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
import {
  validateLessonAgainstMasterLessonBlueprint,
  validateMasterLessonBlueprintContract,
} from '@/lib/module_planner/masterLessonBlueprint';
import { MasterLessonBlueprint } from '@/lib/module_planner/types';
import { getRefinementConfig } from '@/lib/generation/config';
import fs from 'fs';
import path from 'path';

type LessonGenerationResult = Awaited<ReturnType<FileGenerator['generateLesson']>> & {
  phases?: GenerationResponse['phases'];
  refinementMetadata?: GenerationResponse['refinementMetadata'];
  debugBundle?: GenerationResponse['debugBundle'];
  originalLesson?: unknown;
  rejectedRefinedLesson?: unknown;
};

const lessonGeneratorLockDir = path.join(process.cwd(), '.tmp_lesson_generator_locks');
const lessonGeneratorLockStaleMs = 45 * 60 * 1000;

function sanitizeLockName(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function acquireLessonGeneratorLock(lessonId: string): { acquired: true; lockPath: string } | { acquired: false } {
  const lockPath = path.join(lessonGeneratorLockDir, `${sanitizeLockName(lessonId)}.lock`);
  fs.mkdirSync(lessonGeneratorLockDir, { recursive: true });

  try {
    fs.writeFileSync(lockPath, JSON.stringify({ lessonId, pid: process.pid, createdAt: Date.now() }), {
      flag: 'wx',
      encoding: 'utf8',
    });
    return { acquired: true, lockPath };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException | undefined)?.code;
    if (code !== 'EEXIST') throw error;
    try {
      const stat = fs.statSync(lockPath);
      if (Date.now() - stat.mtimeMs > lessonGeneratorLockStaleMs) {
        fs.unlinkSync(lockPath);
        fs.writeFileSync(lockPath, JSON.stringify({ lessonId, pid: process.pid, createdAt: Date.now() }), {
          flag: 'wx',
          encoding: 'utf8',
        });
        return { acquired: true, lockPath };
      }
    } catch {
      // Treat lock as active.
    }
    return { acquired: false };
  }
}

function releaseLessonGeneratorLock(lockPath: string | null): void {
  if (!lockPath) return;
  try {
    if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
  } catch {
    // Best-effort cleanup only.
  }
}

function buildBlueprintDebugData(
  lesson: { id: string; blocks: Array<{ id: string; type: string; order: number }> },
  masterBlueprint: MasterLessonBlueprint
) {
  const deprecatedOptionalKeys = new Set(['explanation-b', 'check-b', 'explanation-c', 'check-c']);
  const requiredEntries = masterBlueprint.blockPlan.entries.filter(
    (entry) => entry.required && !deprecatedOptionalKeys.has(entry.key)
  );
  const expectedRequiredBlockIds = requiredEntries.map((entry) => entry.id);
  const actualBlockIds = lesson.blocks.map((block) => block.id);
  const blocksById = new Map(lesson.blocks.map((block) => [block.id, block]));
  const blockByTypeAndOrder = (type: string, order: number) =>
    lesson.blocks.find((block) => block.type === type && Math.abs(block.order - order) <= 0.0001);
  const expectedOrderForEntry = (entry: MasterLessonBlueprint['blockPlan']['entries'][number]): number => {
    if (entry.key === 'worked-example') return 6;
    if (entry.key === 'guided-practice') return 7;
    if (entry.key === 'practice') return 8;
    if (entry.key === 'integrative') return 9.5;
    if (entry.key === 'spaced-review') return 10;
    return entry.order;
  };
  const missingRequiredBlockIds = requiredEntries
    .filter((entry) => {
      const expectedOrder = expectedOrderForEntry(entry);
      return !blocksById.get(entry.id) && !blockByTypeAndOrder(entry.type, expectedOrder);
    })
    .map((entry) => entry.id);

  const checkPlacementIssues: string[] = [];
  for (const pair of masterBlueprint.blockPlan.checksAfterExplanation.slice(0, 2)) {
    const explanation =
      blocksById.get(pair.explanationId) ??
      (pair.explanationId.endsWith('-explain-a')
        ? blockByTypeAndOrder('explanation', 4)
        : blockByTypeAndOrder('explanation', 5));
    const check =
      blocksById.get(pair.checkId) ??
      (pair.checkId.endsWith('-check-1')
        ? blockByTypeAndOrder('practice', 4.5)
        : blockByTypeAndOrder('practice', 5.5));
    if (!explanation || !check) continue;
    const expectedOrder = explanation.order + 0.5;
    if (Math.abs(check.order - expectedOrder) > 0.0001) {
      checkPlacementIssues.push(`${pair.checkId} expected ${expectedOrder} got ${check.order}`);
    }
  }

  return {
    lessonId: lesson.id,
    expectedRequiredBlockIds,
    actualBlockIds,
    missingRequiredBlockIds,
    checkPlacementIssues,
  };
}

// Debug logger
function debugLog(stage: string, data: unknown) {
  const logEntry = JSON.stringify({
    timestamp: Date.now(),
    stage,
    data,
    sessionId: 'generation-' + Date.now()
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
  let generationLockPath: string | null = null;
  
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

  try {
    const body: GenerationRequest = await request.json();

    debugLog('REQUEST_RECEIVED', { unit: body.unit, lessonId: body.lessonId, topic: body.topic, section: body.section });

    // Validate request
    if (!body.unit || !body.lessonId || !body.topic || !body.section) {
      debugLog('REQUEST_INVALID', { body });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fullLessonId = generateLessonId(body.unit, body.lessonId);
    const lock = acquireLessonGeneratorLock(fullLessonId);
    if (!lock.acquired) {
      return NextResponse.json(
        {
          success: false,
          code: 'GENERATION_IN_PROGRESS',
          error: `A generation job is already running for ${fullLessonId}. Wait for that run to finish, then retry.`,
        },
        { status: 409, headers }
      );
    }
    generationLockPath = lock.lockPath;

    const warnings: string[] = [];
    const errors: string[] = [];

    debugLog('GENERATION_START', { fullLessonId });
    console.log(`[Generator] Starting generation for ${fullLessonId}`);

    if (body.masterLessonBlueprint) {
      const masterBlueprint = body.masterLessonBlueprint as unknown as MasterLessonBlueprint;
      const contractErrors = validateMasterLessonBlueprintContract(
        masterBlueprint,
        fullLessonId
      );
      if (contractErrors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Master lesson blueprint contract is invalid',
            errors: contractErrors,
          },
          { status: 400 }
        );
      }
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

    // Step 1: Generate lesson
    debugLog('STEP_1_START', { step: 'generateLesson' });
    console.log('[Generator] Step 1: Generating lesson...');
    const lessonResult = await fileGenerator.generateLesson(body) as LessonGenerationResult;
    
    debugLog('STEP_1_COMPLETE', { success: lessonResult.success, error: lessonResult.error });
    
    if (!lessonResult.success) {
      debugLog('STEP_1_FAILED', { error: lessonResult.error, debugInfo: lessonResult.debugInfo });
      return NextResponse.json({
        success: false,
        error: lessonResult.error,
        debugInfo: lessonResult.debugInfo, // Include debug info for lesson parse errors
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
        debugData: lessonValidation.debugData,  // NEW: Pass debug data to client
      }, { status: 400 });
    }

    warnings.push(...lessonValidation.warnings);

    // Step 3: Generate quiz
    debugLog('STEP_3_START', { step: 'generateQuiz' });
    console.log('[Generator] Step 3: Generating quiz (50 questions)...');
    const quizResult = await fileGenerator.generateQuiz(body);
    
    debugLog('STEP_3_COMPLETE', { success: quizResult.success, error: quizResult.error, questionCount: quizResult.questions?.length });
    
    if (!quizResult.success) {
      debugLog('STEP_3_FAILED', { error: quizResult.error, debugInfo: quizResult.debugInfo });
      return NextResponse.json({
        success: false,
        error: quizResult.error,
        debugInfo: quizResult.debugInfo, // NEW: Include debug info
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
        debugData: quizValidation.debugData,  // NEW: Pass debug data to client
      }, { status: 400 });
    }

    warnings.push(...quizValidation.warnings);

    // Persist generation score in lesson metadata so admin UIs can surface quality quickly.
    const originalGenerationScore = lessonResult.refinementMetadata?.originalScore;
    const finalGenerationScore = lessonResult.refinementMetadata?.finalScore ?? originalGenerationScore;
    if (typeof finalGenerationScore === 'number') {
      const metadata = (lessonResult.content as { metadata?: Record<string, unknown> }).metadata || {};
      metadata.generationScore = finalGenerationScore;
      metadata.generationScoreDetails = {
        originalScore: typeof originalGenerationScore === 'number' ? originalGenerationScore : null,
        finalScore: finalGenerationScore,
        wasRefined: Boolean(lessonResult.refinementMetadata?.wasRefined),
        generatedAt: new Date().toISOString(),
        source: 'phase10-13',
      };
      (lessonResult.content as { metadata: Record<string, unknown> }).metadata = metadata;
    }

    if (body.masterLessonBlueprint) {
      const masterBlueprint = body.masterLessonBlueprint as unknown as MasterLessonBlueprint;
      const blueprintErrors = validateLessonAgainstMasterLessonBlueprint(
        lessonResult.content,
        masterBlueprint
      );
      if (blueprintErrors.length > 0) {
        const blueprintDebug = buildBlueprintDebugData(
          lessonResult.content as { id: string; blocks: Array<{ id: string; type: string; order: number }> },
          masterBlueprint
        );
        return NextResponse.json(
          {
            success: false,
            error: 'Generated lesson does not comply with master lesson blueprint',
            errors: blueprintErrors,
            blueprintDebug,
          },
          { status: 400 }
        );
      }
    }

    const refinementConfig = getRefinementConfig();
    const qualityThreshold = refinementConfig.scoreThreshold;
    const finalScoreBeforeWrite =
      lessonResult.refinementMetadata?.finalScore ?? lessonResult.refinementMetadata?.originalScore ?? null;
    const refinementReport =
      lessonResult.refinementMetadata &&
      typeof lessonResult.refinementMetadata === 'object' &&
      'report' in lessonResult.refinementMetadata
        ? (lessonResult.refinementMetadata as {
            report?: {
              status?: string;
              reason?: string;
              initialScore?: number;
              finalScore?: number;
              threshold?: number;
            };
          }).report
        : undefined;
    if (typeof finalScoreBeforeWrite === 'number' && finalScoreBeforeWrite < qualityThreshold) {
      return NextResponse.json(
        {
          success: false,
          code: 'QUALITY_THRESHOLD_FAIL',
          error: `Lesson quality ${finalScoreBeforeWrite}/100 below threshold ${qualityThreshold}/100`,
          qualityGate: {
            threshold: qualityThreshold,
            finalScore: finalScoreBeforeWrite,
            passed: false,
          },
          refinementMetadata: lessonResult.refinementMetadata,
          refinementReport,
        },
        { status: 422, headers }
      );
    }

    // Step 5: Write files
    debugLog('STEP_5_START', { step: 'writeFiles' });
    console.log('[Generator] Step 5: Writing files...');
    lessonFilePath = await fileGenerator.writeLessonFile(body, lessonResult.content);
    quizFilePath = await fileGenerator.writeQuizFile(body, quizResult.questions);

    // If Phase 10 ran (original lesson exists), always save original for debugging
    if (lessonResult.originalLesson) {
      const originalLessonPath = path.join(
        path.dirname(lessonFilePath),
        `${fullLessonId}-original.json`
      );
      fs.writeFileSync(originalLessonPath, JSON.stringify(lessonResult.originalLesson, null, 2), 'utf-8');
      filesUpdated.push(originalLessonPath);
      console.log(`💾 [Refinement] Saved original version: ${fullLessonId}-original.json`);
    }
    
    // If patches were rejected (score declined), save rejected refined version for debugging
    if (lessonResult.rejectedRefinedLesson) {
      const rejectedLessonPath = path.join(
        path.dirname(lessonFilePath),
        `${fullLessonId}-rejected-patches.json`
      );
      fs.writeFileSync(rejectedLessonPath, JSON.stringify(lessonResult.rejectedRefinedLesson, null, 2), 'utf-8');
      filesUpdated.push(rejectedLessonPath);
      console.log(`💾 [Refinement] Saved rejected patches version: ${fullLessonId}-rejected-patches.json`);
    }

    const lessonFilename = lessonFilePath.split(/[/\\]/).pop() || '';
    const quizFilename = quizFilePath.split(/[/\\]/).pop() || '';
    
    debugLog('STEP_5_COMPLETE', { 
      lessonFilename, 
      quizFilename,
      wasRefined: lessonResult.refinementMetadata?.wasRefined || false
    });

    // Step 6: Integrate files
    debugLog('STEP_6_START', { step: 'integrateFiles', lessonFilename, quizFilename });
    console.log('[Generator] Step 6: Integrating files...');
    const integrationResult = await integrator.integrateAllFiles(
      body,
      lessonFilename,
      quizFilename
    );

    debugLog('STEP_6_COMPLETE', { success: integrationResult.success, filesUpdated: integrationResult.filesUpdated, errors: integrationResult.errors });

    if (!integrationResult.success) {
      debugLog('STEP_6_FAILED', { errors: integrationResult.errors });
      // Rollback files
      await errorHandler.rollbackAll(lessonFilePath, quizFilePath);
      
      return NextResponse.json({
        success: false,
        error: 'File integration failed',
        errors: integrationResult.errors,
      }, { status: 500 });
    }

    filesUpdated = integrationResult.filesUpdated;

    // Wait for file system to fully sync before Git operations
    // This prevents race conditions where Next.js hot-reload tries to parse
    // newly generated files before they're fully written to disk
    console.log('[Generator] Waiting for file system sync...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 7: Git commit and push
    let commitHash = 'N/A';
    let commitUrl = 'N/A';

    if (isGitConfigured) {
      console.log('[Generator] Step 7: Committing to main...');
      const gitResult = await gitService.commitAndPush(
        fullLessonId,
        body.topic,
        integrationResult.filesUpdated
      );

      if (gitResult.success) {
        commitHash = gitResult.commitHash;
        commitUrl = gitResult.commitUrl;
        console.log(`[Generator] Success! Committed to main: ${commitHash.substring(0, 7)}`);
      } else {
        warnings.push(`Git commit failed: ${gitResult.error}`);
        // Don't rollback - files are still valid, just not committed
      }
    }

    // Log success
    errorHandler.logGenerationAttempt(body, true);

    // Step 8: Extract final score from refinement metadata
    // (Scoring is done internally by SequentialLessonGenerator)
    const finalScore = lessonResult.refinementMetadata?.finalScore || 
                      lessonResult.refinementMetadata?.originalScore;
    
    if (finalScore) {
      console.log(`[Generator] Final lesson score: ${finalScore}/100`);
      
      // Add score warnings if below 90
      if (finalScore < 90) {
        warnings.push(`Lesson score: ${finalScore}/100 - may need manual review`);
      }
    }

    // Success response
    const response: GenerationResponse = {
      success: true,
      lessonFile: lessonFilename,
      quizFile: quizFilename,
      commitHash,
      commitUrl,
      warnings,
      phases: lessonResult.phases,
      refinementMetadata: lessonResult.refinementMetadata,
      debugBundle: lessonResult.debugBundle,
    };

    return NextResponse.json(response, { headers });

  } catch (error) {
    // Enhanced error logging
    console.error('\n❌❌❌ GENERATION PIPELINE EXCEPTION ❌❌❌');
    console.error(`   Error name: ${error instanceof Error ? error.name : 'Unknown'}`);
    console.error(`   Error message: ${error instanceof Error ? error.message : 'unknown'}`);
    
    if (error instanceof Error && error.stack) {
      console.error(`   Stack trace:`);
      console.error(error.stack);
    }
    
    debugLog('GENERATION_EXCEPTION', { 
      errorMsg: error instanceof Error ? error.message : 'unknown', 
      errorName: error instanceof Error ? error.name : 'unknown',
      errorStack: error instanceof Error ? error.stack : 'unknown',
      fullError: error
    });

    // Try to get lesson ID from request body
    let lessonIdContext = 'unknown';
    try {
      const body = await request.clone().json();
      lessonIdContext = `${body.unit}-${body.lessonId}`;
    } catch {
      // Could not parse body for logging
    }
    
    console.error(`   Lesson ID: ${lessonIdContext}`);
    console.error(`   Files updated so far: ${filesUpdated.join(', ') || 'none'}`);
    console.error('=====================================\n');
    
    // Attempt rollback
    try {
      await errorHandler.rollbackAll(lessonFilePath, quizFilePath, filesUpdated);
    } catch (rollbackError) {
      console.error('[Generator] Rollback failed:', rollbackError);
      debugLog('ROLLBACK_FAILED', { error: rollbackError instanceof Error ? rollbackError.message : 'unknown' });
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
      detailedError: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 1000), // First 1000 chars of stack
      } : undefined,
      lessonId: lessonIdContext,
      filesUpdated: filesUpdated.length > 0 ? filesUpdated : undefined,
    }, { status: errorResponse.status });
  } finally {
    releaseLessonGeneratorLock(generationLockPath);
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
