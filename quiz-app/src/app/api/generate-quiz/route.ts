/**
 * Quiz Generator API Route
 * Generates quizzes for existing lessons without creating new lessons
 */

import { NextRequest, NextResponse } from 'next/server';
import { FileGenerator } from '@/lib/generation/fileGenerator';
import { ValidationService } from '@/lib/generation/validationService';
import { FileIntegrator } from '@/lib/generation/fileIntegrator';
import { GitService } from '@/lib/generation/gitService';
import { ErrorHandler } from '@/lib/generation/errorHandler';
import { globalRateLimiter } from '@/lib/generation/rateLimiter';
import { 
  getLessonQuizStatus, 
  getExistingLesson, 
  extractLearningOutcomes 
} from '@/lib/generation/lessonDetector';
import { generateQuizFilename, getCurrentTimestamp } from '@/lib/generation/utils';
import fs from 'fs';
import path from 'path';

interface QuizGenerationRequest {
  lessonId: string;
  regenerate?: boolean;
}

interface QuizGenerationResponse {
  success: boolean;
  quizFile?: string;
  commitHash?: string;
  commitUrl?: string;
  previousQuestionCount?: number;
  warnings: string[];
  error?: string;
  debugInfo?: {
    rawResponse: string;
    parseError: string;
    attemptedOperation: string;
    timestamp: string;
  };
}

// Debug logger
function debugLog(stage: string, data: unknown) {
  const logEntry = JSON.stringify({
    timestamp: Date.now(),
    stage,
    data,
    sessionId: 'quiz-generation-' + Date.now()
  }) + '\n';
  try {
    const logPath = path.join(process.cwd(), '..', '.cursor', 'debug.log');
    fs.appendFileSync(logPath, logEntry, 'utf-8');
  } catch (e) {
    console.error('Failed to write debug log:', e);
  }
}

export async function POST(request: NextRequest) {
  const errorHandler = new ErrorHandler();
  
  // Validate environment
  const envValidation = errorHandler.validateEnvironment();
  if (!envValidation.valid) {
    return NextResponse.json({
      success: false,
      error: 'Environment validation failed',
      warnings: envValidation.errors,
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
      warnings: [],
    }, { status: 429 });
  }

  // Add rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', '5');
  headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

  let quizFilePath: string | undefined;
  let filesUpdated: string[] = [];

  try {
    const body: QuizGenerationRequest = await request.json();

    debugLog('REQUEST_RECEIVED', { lessonId: body.lessonId, regenerate: body.regenerate });

    // Validate request
    if (!body.lessonId) {
      debugLog('REQUEST_INVALID', { body });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: lessonId',
          warnings: [],
        },
        { status: 400 }
      );
    }

    const warnings: string[] = [];
    const errors: string[] = [];

    debugLog('QUIZ_GEN_START', { lessonId: body.lessonId });
    console.log(`[QuizGenerator] Starting quiz generation for ${body.lessonId}`);

    // Get lesson status
    const lessonStatus = getLessonQuizStatus(body.lessonId);
    if (!lessonStatus) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Lesson ${body.lessonId} not found in lesson index`,
          warnings: [],
        },
        { status: 404 }
      );
    }

    // Load lesson data
    const lessonData = getExistingLesson(body.lessonId);
    if (!lessonData) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Lesson file for ${body.lessonId} not found`,
          warnings: [],
        },
        { status: 404 }
      );
    }

    debugLog('LESSON_LOADED', { 
      lessonId: body.lessonId, 
      hasBlocks: !!lessonData.blocks,
      blockCount: lessonData.blocks?.length 
    });

    // Check if quiz exists
    const previousQuestionCount = lessonStatus.questionCount;
    if (previousQuestionCount > 0 && !body.regenerate) {
      warnings.push(
        `Lesson ${body.lessonId} already has ${previousQuestionCount} questions. ` +
        `Set regenerate: true to create new questions.`
      );
    }

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

    // Generate quiz from lesson
    console.log(`[QuizGenerator] Generating quiz...`);
    const quizResult = await fileGenerator.generateQuizFromLesson(
      body.lessonId,
      lessonData,
      lessonStatus.section
    );

    if (!quizResult.success) {
      debugLog('QUIZ_GEN_FAILED', { error: quizResult.error });
      return NextResponse.json(
        {
          success: false,
          error: quizResult.error || 'Failed to generate quiz',
          warnings,
          debugInfo: quizResult.debugInfo,
        },
        { status: 500, headers }
      );
    }

    debugLog('QUIZ_GEN_SUCCESS', { questionCount: quizResult.questions.length });

    // Validate quiz
    console.log(`[QuizGenerator] Validating quiz...`);
    const validation = validator.validateQuiz(quizResult.questions, body.lessonId);
    if (!validation.valid) {
      debugLog('VALIDATION_FAILED', { errors: validation.errors });
      errors.push(...validation.errors);
    }
    if (validation.warnings.length > 0) {
      warnings.push(...validation.warnings);
    }

    // Write quiz file
    console.log(`[QuizGenerator] Writing quiz file...`);
    const quizFilename = generateQuizFilename(lessonData.topic || lessonData.title);
    quizFilePath = path.join(process.cwd(), 'src', 'data', 'questions', quizFilename);
    
    const quizFileContent = generateQuizFileContent(
      body.lessonId,
      lessonData.topic || lessonData.title,
      quizResult.questions
    );
    
    fs.writeFileSync(quizFilePath, quizFileContent, 'utf-8');
    debugLog('FILE_WRITTEN', { path: quizFilePath });

    // Integrate into codebase
    console.log(`[QuizGenerator] Integrating files...`);
    const integration = await integrator.integrateQuizOnly(
      quizFilePath,
      quizResult.questions
    );

    if (!integration.success) {
      debugLog('INTEGRATION_FAILED', { errors: integration.errors });
      // Rollback quiz file
      if (fs.existsSync(quizFilePath)) {
        fs.unlinkSync(quizFilePath);
      }
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to integrate quiz files',
          warnings: [...warnings, ...integration.errors],
        },
        { status: 500, headers }
      );
    }

    filesUpdated = integration.filesUpdated;
    debugLog('INTEGRATION_SUCCESS', { filesUpdated });

    // Git commit
    let commitHash = 'N/A';
    let commitUrl = 'N/A';

    if (isGitConfigured) {
      console.log(`[QuizGenerator] Creating git commit...`);
      const topic = previousQuestionCount > 0
        ? `quiz (regenerate: ${previousQuestionCount} → 50 questions)`
        : `quiz (50 questions)`;

      const gitResult = await gitService.commitAndPush(
        body.lessonId,
        topic,
        [quizFilePath, ...filesUpdated]
      );

      if (gitResult.success) {
        commitHash = gitResult.commitHash;
        commitUrl = gitResult.commitUrl;
        debugLog('GIT_SUCCESS', { commitHash, commitUrl });
      } else {
        warnings.push(`Git commit failed: ${gitResult.error}`);
        debugLog('GIT_FAILED', { error: gitResult.error });
      }
    }

    // Success
    console.log(`[QuizGenerator] ✅ Quiz generation complete for ${body.lessonId}`);
    debugLog('COMPLETE', { 
      lessonId: body.lessonId, 
      questionCount: quizResult.questions.length,
      previousQuestionCount 
    });

    const response: QuizGenerationResponse = {
      success: true,
      quizFile: path.basename(quizFilePath),
      commitHash,
      commitUrl,
      previousQuestionCount: previousQuestionCount > 0 ? previousQuestionCount : undefined,
      warnings,
    };

    return NextResponse.json(response, { headers });

  } catch (error) {
    debugLog('EXCEPTION', { error: error instanceof Error ? error.message : 'unknown' });
    console.error('[QuizGenerator] Error:', error);

    // Cleanup on error
    if (quizFilePath && fs.existsSync(quizFilePath)) {
      try {
        fs.unlinkSync(quizFilePath);
      } catch (cleanupError) {
        console.error('Failed to cleanup quiz file:', cleanupError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        warnings: ['An unexpected error occurred during quiz generation'],
      },
      { status: 500, headers }
    );
  }
}

/**
 * Generate TypeScript quiz file content
 */
function generateQuizFileContent(
  lessonId: string,
  topic: string,
  questions: unknown[]
): string {
  const variableName = generateQuizFilename(topic)
    .replace('.ts', '')
    .replace(/Questions$/, 'Questions');

  return `import { TaggedQuestion } from './types';

/**
 * ${topic} Question Bank
 * Aligned with lesson ${lessonId} learning outcomes
 * Generated: ${getCurrentTimestamp()}
 */

export const ${variableName}: TaggedQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    version: '1.0.0',
    message: 'Quiz generator API is ready',
  });
}
