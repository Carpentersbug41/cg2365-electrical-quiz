/**
 * Lesson Generator API Route
 * Main endpoint that coordinates the entire generation pipeline
 */

import { NextRequest, NextResponse } from 'next/server';
import { FileGenerator } from '@/lib/generation/fileGenerator';
import { ValidationService } from '@/lib/generation/validationService';
import { FileIntegrator } from '@/lib/generation/fileIntegrator';
import { GitService } from '@/lib/generation/gitService';
import { ErrorHandler } from '@/lib/generation/errorHandler';
import { globalRateLimiter } from '@/lib/generation/rateLimiter';
import { GenerationRequest, GenerationResponse } from '@/lib/generation/types';
import { generateLessonId, generateLessonFilename, generateQuizFilename } from '@/lib/generation/utils';

export async function POST(request: NextRequest) {
  const errorHandler = new ErrorHandler();
  
  // Validate environment
  const envValidation = errorHandler.validateEnvironment();
  if (!envValidation.valid) {
    return NextResponse.json({
      success: false,
      error: 'Environment validation failed',
      errors: envValidation.errors,
    }, { status: 500 });
  }

  // Rate limiting
  const identifier = globalRateLimiter.getIdentifier(request);
  const rateLimit = globalRateLimiter.checkLimit(identifier);
  
  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetTime);
    return NextResponse.json({
      success: false,
      error: `Rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}`,
    }, { status: 429 });
  }

  // Add rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', '5');
  headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

  let lessonFilePath: string | undefined;
  let quizFilePath: string | undefined;
  let filesUpdated: string[] = [];
  let branchName: string | undefined;

  try {
    const body: GenerationRequest = await request.json();

    // Validate request
    if (!body.unit || !body.lessonId || !body.topic || !body.section) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fullLessonId = generateLessonId(body.unit, body.lessonId);
    const warnings: string[] = [];
    const errors: string[] = [];

    console.log(`[Generator] Starting generation for ${fullLessonId}`);

    // Initialize services
    const fileGenerator = new FileGenerator();
    const validator = new ValidationService();
    const integrator = new FileIntegrator();
    const gitService = new GitService();

    // Check git configuration
    const isGitConfigured = await gitService.isGitConfigured();
    if (!isGitConfigured) {
      warnings.push('Git is not configured - auto-commit disabled');
    }

    // Step 1: Generate lesson
    console.log('[Generator] Step 1: Generating lesson...');
    const lessonResult = await fileGenerator.generateLesson(body);
    
    if (!lessonResult.success) {
      return NextResponse.json({
        success: false,
        error: lessonResult.error,
      }, { status: 500 });
    }

    // Step 2: Validate lesson
    console.log('[Generator] Step 2: Validating lesson...');
    const lessonValidation = validator.validateLesson(lessonResult.content, fullLessonId);
    
    if (!lessonValidation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Lesson validation failed',
        errors: lessonValidation.errors,
        warnings: lessonValidation.warnings,
      }, { status: 400 });
    }

    warnings.push(...lessonValidation.warnings);

    // Step 3: Generate quiz
    console.log('[Generator] Step 3: Generating quiz (50 questions)...');
    const quizResult = await fileGenerator.generateQuiz(body);
    
    if (!quizResult.success) {
      return NextResponse.json({
        success: false,
        error: quizResult.error,
      }, { status: 500 });
    }

    // Step 4: Validate quiz
    console.log('[Generator] Step 4: Validating quiz...');
    const quizValidation = validator.validateQuiz(quizResult.questions, fullLessonId);
    
    if (!quizValidation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Quiz validation failed',
        errors: quizValidation.errors,
        warnings: quizValidation.warnings,
      }, { status: 400 });
    }

    warnings.push(...quizValidation.warnings);

    // Step 5: Write files
    console.log('[Generator] Step 5: Writing files...');
    lessonFilePath = await fileGenerator.writeLessonFile(body, lessonResult.content);
    quizFilePath = await fileGenerator.writeQuizFile(body, quizResult.questions);

    const lessonFilename = lessonFilePath.split(/[/\\]/).pop() || '';
    const quizFilename = quizFilePath.split(/[/\\]/).pop() || '';

    // Step 6: Integrate files
    console.log('[Generator] Step 6: Integrating files...');
    const integrationResult = await integrator.integrateAllFiles(
      body,
      lessonFilename,
      quizFilename
    );

    if (!integrationResult.success) {
      // Rollback files
      await errorHandler.rollbackAll(lessonFilePath, quizFilePath);
      
      return NextResponse.json({
        success: false,
        error: 'File integration failed',
        errors: integrationResult.errors,
      }, { status: 500 });
    }

    filesUpdated = integrationResult.filesUpdated;

    // Step 7: Git commit and push
    let finalBranchName = 'N/A';
    let branchUrl = 'N/A';

    if (isGitConfigured) {
      console.log('[Generator] Step 7: Committing to git...');
      const gitResult = await gitService.commitAndPush(
        fullLessonId,
        body.topic,
        integrationResult.filesUpdated
      );

      if (gitResult.success) {
        finalBranchName = gitResult.branchName;
        branchName = gitResult.branchName;
        branchUrl = gitResult.branchUrl;
        console.log(`[Generator] Success! Branch: ${finalBranchName}`);
      } else {
        warnings.push(`Git commit failed: ${gitResult.error}`);
        // Don't rollback - files are still valid, just not committed
      }
    }

    // Log success
    errorHandler.logGenerationAttempt(body, true);

    // Success response
    const response: GenerationResponse = {
      success: true,
      lessonFile: lessonFilename,
      quizFile: quizFilename,
      branchName: finalBranchName,
      branchUrl,
      warnings,
    };

    return NextResponse.json(response, { headers });

  } catch (error) {
    console.error('[Generator] Unexpected error:', error);
    
    // Attempt rollback
    try {
      await errorHandler.rollbackAll(lessonFilePath, quizFilePath, filesUpdated, branchName);
    } catch (rollbackError) {
      console.error('[Generator] Rollback failed:', rollbackError);
    }

    // Log failure
    try {
      const body = await request.json();
      errorHandler.logGenerationAttempt(body, false, error instanceof Error ? error.message : 'Unknown error');
    } catch {
      // Could not parse body for logging
    }

    const errorResponse = errorHandler.handleApiError(error, 'Generation pipeline');
    
    return NextResponse.json({
      success: false,
      error: errorResponse.message,
    }, { status: errorResponse.status });
  }
}

/**
 * GET endpoint to check generator status
 */
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    version: '1.0.0',
    message: 'Lesson generator API is ready',
  });
}
