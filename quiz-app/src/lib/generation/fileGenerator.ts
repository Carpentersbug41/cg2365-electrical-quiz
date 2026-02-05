/**
 * File Generator Service
 * Coordinates LLM calls to generate lesson and quiz files
 * 
 * ⚠️ CRITICAL FILE - READ BEFORE MODIFYING
 * See: reports/bulk_tasks/don't_touch.md
 * 
 * This file handles core generation logic. Changes here affect the entire system.
 * Most "simplifications" break things.
 * 
 * Common mistakes that break everything:
 * - Removing response validation → API errors show as JSON parse errors
 * - Changing parsing order → Preprocessing fails, invalid JSON
 * - Removing debug info → Debugging becomes impossible
 * - Skipping strict lint → Bad lessons reach production
 * - Using eval() instead of JSON.parse → Security risk + inconsistent results
 * 
 * Before changing this file:
 * 1. Read don't_touch.md (reports/bulk_tasks/)
 * 2. Check gen_problems.md for similar past issues
 * 3. Test with actual lesson generation
 * 4. Verify debug.log shows no errors
 * 
 * Test thoroughly before committing!
 */

import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { LessonPromptBuilder } from './lessonPromptBuilder';
import { QuizPromptBuilder } from './quizPromptBuilder';
import { ValidationService } from './validationService';
import { StrictLintService, type LintFailure } from './strictLintService';
import { SequentialLessonGenerator } from './SequentialLessonGenerator';
import { GenerationRequest, Lesson, QuizQuestion, DebugInfo } from './types';
import {
  generateLessonFilename,
  generateQuizFilename,
  generateLessonId,
  getCurrentTimestamp,
  cleanCodeBlocks,
  extractJson,
  extractTypeScriptArray,
  preprocessToValidJson,
  safeJsonParse,
  sleep,
  validateLLMResponse,
  debugLog,
} from './utils';
import { GENERATION_LIMITS, DIFFICULTY_DISTRIBUTION, COMPLEXITY_THRESHOLDS } from './constants';
import {
  detectTruncation,
  isResponseSafeToParse,
  formatTruncationReport,
  type UsageMetadata,
} from './truncationDetector';
import fs from 'fs';
import path from 'path';

// Context preview helper for error debugging
function generateContextPreview(content: string, position?: number): {
  before: string;
  errorLocation: string;
  after: string;
} {
  if (!position) {
    return {
      before: content.substring(0, 200),
      errorLocation: '(position unknown)',
      after: content.substring(200, 400),
    };
  }
  
  const start = Math.max(0, position - 100);
  const end = Math.min(content.length, position + 100);
  
  return {
    before: content.substring(start, position),
    errorLocation: content.charAt(position),
    after: content.substring(position + 1, end),
  };
}

/**
 * Format truncation error with actionable guidance
 */
function formatTruncationError(type: 'lesson' | 'quiz', attemptedTokens: number[], complexity?: string): string {
  const itemType = type === 'lesson' ? 'lesson' : 'quiz';
  const tokenList = attemptedTokens.join(' → ');
  const maxToken = Math.max(...attemptedTokens);
  
  return `🚨 ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Generation Exceeded Maximum Length

The LLM response was truncated even at maximum capacity.
Token Limits Attempted: ${tokenList} tokens (max: ${maxToken.toLocaleString()})
${complexity ? `Estimated Complexity: ${complexity}` : ''}

This typically means the lesson scope is too broad for a single generation.

IMMEDIATE SOLUTIONS:
${type === 'lesson' 
  ? `
✓ SPLIT THE LESSON: Divide into 2-3 focused lessons (recommended)
  - Current lesson appears to cover too many distinct concepts
  - Each lesson should focus on 1-3 closely related topics
  - Example: Instead of "Cable Selection & Installation & Testing",
    create separate lessons for each topic

✓ REDUCE SCOPE in "Must Have Topics":
  - Remove secondary/nice-to-have topics
  - Focus on core essentials only
  - Move advanced concepts to separate lesson

✓ SIMPLIFY "Additional Instructions":
  - Remove verbose requirements
  - Stick to core learning outcomes
  - Reduce worked example complexity

✓ REMOVE NON-ESSENTIAL BLOCKS:
  - Skip worked examples for simple conceptual topics
  - Reduce number of practice questions to minimum (3-4)
  - Simplify explanation depth` 
  : `
✓ Reduce question count (currently generating 50 questions)
✓ Simplify question complexity and scenario length
✓ Generate quiz in multiple smaller batches
✓ Remove complex multi-part questions`}

TECHNICAL NOTE:
The system uses dynamic token allocation (32k-65k) based on lesson complexity.
This error means your content exceeds even the 65k maximum allowed by the API.
This is rare and indicates the scope truly is too large for a single lesson.

If you've already minimized scope and still see this error, please report it with:
- Lesson ID, topic, and full request details
- This will help us identify if further optimization is needed`;
}

/**
 * Estimate lesson complexity and determine appropriate token limit
 */
function estimateLessonComplexity(request: GenerationRequest): {
  complexity: 'simple' | 'medium' | 'complex';
  recommendedTokens: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  // Count must-have topics (if provided in description or mustHave)
  const topicText = `${request.topic} ${request.description || ''} ${request.mustHave || ''}`;
  const topicCount = (topicText.match(/[,;]\s*/g) || []).length + 1;
  
  if (topicCount >= 7) {
    score += 3;
    reasons.push(`High topic count (${topicCount})`);
  } else if (topicCount >= 4) {
    score += 2;
    reasons.push(`Medium topic count (${topicCount})`);
  } else {
    score += 1;
    reasons.push(`Simple topic count (${topicCount})`);
  }

  // Count prerequisites
  const prereqCount = request.prerequisites?.length || 0;
  if (prereqCount >= 4) {
    score += 2;
    reasons.push(`Many prerequisites (${prereqCount})`);
  } else if (prereqCount >= 2) {
    score += 1;
    reasons.push(`Some prerequisites (${prereqCount})`);
  }

  // Check if worked examples are likely needed (calculation topics)
  const needsWorkedExample = /calculat|formula|equat|ohm|power|resistanc|circuit/i.test(topicText);
  if (needsWorkedExample) {
    score += 2;
    reasons.push('Requires worked examples (calculation topic)');
  }

  // Check for complex topic indicators
  const complexIndicators = ['installation', 'regulation', 'testing', 'inspection', 'design'];
  const hasComplexIndicator = complexIndicators.some(indicator =>
    topicText.toLowerCase().includes(indicator)
  );
  if (hasComplexIndicator) {
    score += 1;
    reasons.push('Complex technical topic');
  }

  // Determine complexity level
  let complexity: 'simple' | 'medium' | 'complex';
  let recommendedTokens: number;

  if (score >= 6) {
    complexity = 'complex';
    recommendedTokens = COMPLEXITY_THRESHOLDS.COMPLEX.TOKENS;
  } else if (score >= 3) {
    complexity = 'medium';
    recommendedTokens = COMPLEXITY_THRESHOLDS.MEDIUM.TOKENS;
  } else {
    complexity = 'simple';
    recommendedTokens = COMPLEXITY_THRESHOLDS.SIMPLE.TOKENS;
  }

  return { complexity, recommendedTokens, reasons };
}

export class FileGenerator {
  private lessonPromptBuilder: LessonPromptBuilder;
  private quizPromptBuilder: QuizPromptBuilder;
  private validationService: ValidationService;
  private strictLintService: StrictLintService;
  private sequentialGenerator: SequentialLessonGenerator;

  constructor() {
    this.lessonPromptBuilder = new LessonPromptBuilder();
    this.quizPromptBuilder = new QuizPromptBuilder();
    this.validationService = new ValidationService();
    this.strictLintService = new StrictLintService();
    // Pass bound generateWithRetry method to sequential generator
    this.sequentialGenerator = new SequentialLessonGenerator(
      this.generateWithRetry.bind(this)
    );
  }
  
  /**
   * Build repair prompt for fixing validation issues
   */
  private buildRepairPrompt(originalJson: string, validationErrors: string[], validationWarnings: string[]): string {
    const issuesList = [
      ...validationErrors.map(e => `ERROR: ${e}`),
      ...validationWarnings.map(w => `WARNING: ${w}`)
    ].join('\n');
    
    return `The following lesson JSON has validation issues that need to be fixed:

VALIDATION ISSUES:
${issuesList}

ORIGINAL JSON:
${originalJson}

INSTRUCTIONS:
- Fix ALL the errors listed above
- Address the warnings if possible
- Return ONLY the corrected JSON
- No markdown code blocks
- No explanations
- Must be valid, parseable JSON

Return the corrected lesson JSON now:`;
  }

  /**
   * Build strict repair prompt for fixing critical lint failures
   * More structured and specific than the generic repair prompt
   */
  private buildStrictRepairPrompt(originalJson: string, failures: LintFailure[]): string {
    // Group failures by severity
    const critical = failures.filter(f => f.severity === 'critical');
    const high = failures.filter(f => f.severity === 'high');
    const medium = failures.filter(f => f.severity === 'medium');
    
    const formatFailure = (f: LintFailure) => {
      let msg = `[${f.code}] ${f.message}`;
      if (f.path) msg += `\n  Location: ${f.path}`;
      if (f.suggestedFix) msg += `\n  Fix: ${f.suggestedFix}`;
      if (f.example) msg += `\n  Example: ${f.example}`;
      return msg;
    };
    
    let failuresSection = '';
    
    if (critical.length > 0) {
      failuresSection += `\nCRITICAL FAILURES (${critical.length}) - MUST FIX:\n`;
      failuresSection += critical.map(formatFailure).join('\n\n');
    }
    
    if (high.length > 0) {
      failuresSection += `\n\nHIGH PRIORITY (${high.length}) - SHOULD FIX:\n`;
      failuresSection += high.map(formatFailure).join('\n\n');
    }
    
    if (medium.length > 0) {
      failuresSection += `\n\nMEDIUM PRIORITY (${medium.length}) - FIX IF POSSIBLE:\n`;
      failuresSection += medium.map(formatFailure).join('\n\n');
    }
    
    return `The following lesson JSON has CRITICAL validation failures that MUST be fixed for 95+ quality scores.
${failuresSection}

ORIGINAL JSON:
${originalJson}

REPAIR INSTRUCTIONS:
1. Fix ALL critical failures first (these break marking/rendering)
2. Fix high priority issues (these reduce quality scores)
3. Fix medium priority issues if possible
4. Make MINIMAL changes - only fix what's broken
5. Do NOT alter working parts of the JSON
6. Preserve all content, just fix structure/format issues
7. Return ONLY the corrected JSON (no markdown, no explanations)
8. Ensure result is valid, parseable RFC 8259 JSON

OUTPUT FORMAT: Pure JSON only`;
  }

  /**
   * Helper to safely propagate error results with debug info
   * Ensures debugInfo is never accidentally omitted during error propagation
   */
  private propagateError(result: { success: false; questions: QuizQuestion[]; error?: string; debugInfo?: DebugInfo }): { success: false; questions: QuizQuestion[]; error?: string; debugInfo?: DebugInfo } {
    return {
      success: false,
      questions: [],
      error: result.error,
      debugInfo: result.debugInfo,
    };
  }

  /**
   * Generate complete lesson JSON file with two-pass validation and repair
   */
  async generateLesson(request: GenerationRequest): Promise<{ success: boolean; content: Lesson; error?: string; warnings?: string[]; debugInfo?: DebugInfo }> {
    // Feature flag: Use sequential generation if enabled
    const USE_SEQUENTIAL = process.env.USE_SEQUENTIAL_GENERATION === 'true';
    
    if (USE_SEQUENTIAL) {
      console.log('🔄 Using SEQUENTIAL generation pipeline (feature flag enabled)');
      return this.generateLessonSequential(request);
    }
    
    try {
      const lessonId = generateLessonId(request.unit, request.lessonId);
      
      // Estimate complexity and determine appropriate token limit
      const complexityEstimate = estimateLessonComplexity(request);
      console.log(`📊 Lesson complexity: ${complexityEstimate.complexity.toUpperCase()}`);
      console.log(`   Token allocation: ${complexityEstimate.recommendedTokens.toLocaleString()}`);
      console.log(`   Reasons: ${complexityEstimate.reasons.join(', ')}`);
      
      debugLog('LESSON_COMPLEXITY_ESTIMATE', {
        lessonId,
        complexity: complexityEstimate.complexity,
        recommendedTokens: complexityEstimate.recommendedTokens,
        reasons: complexityEstimate.reasons,
      });
      
      const { systemPrompt, userPrompt } = this.lessonPromptBuilder.buildPrompt(request);

      // PASS 1: Generate lesson with appropriate token limit
      debugLog('LESSON_GEN_PASS1_START', { 
        lessonId,
        tokenLimit: complexityEstimate.recommendedTokens 
      });
      const content = await this.generateWithRetry(
        systemPrompt,
        userPrompt,
        'lesson',
        GENERATION_LIMITS.MAX_RETRIES,
        false,
        complexityEstimate.recommendedTokens
      );

      // Preprocess to valid JSON (handles trailing commas, comments, etc.)
      const cleanedContent = preprocessToValidJson(content);

      const parsed = safeJsonParse<Lesson>(cleanedContent);
      if (!parsed.success || !parsed.data) {
        debugLog('LESSON_GEN_PASS1_PARSE_FAILED', { error: parsed.error });
        return {
          success: false,
          content: {} as Lesson,
          error: `Failed to parse lesson JSON: ${parsed.error}`,
          debugInfo: {
            rawResponse: cleanedContent,
            parseError: parsed.error || 'Unknown parse error',
            errorPosition: {
              message: parsed.error || 'Unknown parse error',
              line: parsed.errorDetails?.line,
              column: parsed.errorDetails?.column,
              position: parsed.errorDetails?.position,
            },
            contentPreview: generateContextPreview(
              parsed.rawInput || cleanedContent,
              parsed.errorDetails?.position
            ),
            attemptedOperation: 'Parsing lesson JSON (PASS 1 - initial generation)',
            timestamp: new Date().toISOString(),
          }
        };
      }

      // STRICT LINT: Run hard failure checks (before soft validation)
      const strictLint = this.strictLintService.strictLint(parsed.data, lessonId);
      debugLog('LESSON_GEN_PASS1_STRICT_LINT', {
        passed: strictLint.passed,
        failureCount: strictLint.failures.length,
        criticalCount: strictLint.stats.criticalCount,
        highCount: strictLint.stats.highCount,
        mediumCount: strictLint.stats.mediumCount
      });

      // If strict lint failed, trigger repair with structured failures
      if (!strictLint.passed) {
        debugLog('LESSON_GEN_PASS2_REPAIR_START', { 
          failureCount: strictLint.failures.length,
          criticalCount: strictLint.stats.criticalCount
        });
        console.log(`⚠️  Strict lint failed with ${strictLint.failures.length} issues (${strictLint.stats.criticalCount} critical). Attempting repair...`);
        
        const repairPrompt = this.buildStrictRepairPrompt(content, strictLint.failures);
        
        const repairedContent = await this.generateWithRetry(
          'You are a JSON repair specialist. Fix critical validation issues in lesson JSON.',
          repairPrompt,
          'lesson',
          1 // Only one retry for repair
        );

        // Preprocess repaired content
        const cleanedRepairedContent = preprocessToValidJson(repairedContent);
        
        const repairedParsed = safeJsonParse<Lesson>(cleanedRepairedContent);
        if (!repairedParsed.success || !repairedParsed.data) {
          debugLog('LESSON_GEN_PASS2_PARSE_FAILED', { error: repairedParsed.error });
          // Return original if repair failed to parse
          const softValidation = this.validationService.validateLesson(parsed.data, lessonId);
          return {
            success: true,
            content: parsed.data,
            warnings: [
              'Repair attempt failed to parse, using original with issues',
              ...strictLint.failures.map(f => `[${f.severity}] ${f.message}`),
              ...softValidation.warnings
            ],
            debugInfo: {
              rawResponse: cleanedRepairedContent,
              parseError: repairedParsed.error || 'Unknown parse error',
              errorPosition: {
                message: repairedParsed.error || 'Unknown parse error',
                line: repairedParsed.errorDetails?.line,
                column: repairedParsed.errorDetails?.column,
                position: repairedParsed.errorDetails?.position,
              },
              contentPreview: generateContextPreview(
                repairedParsed.rawInput || cleanedRepairedContent,
                repairedParsed.errorDetails?.position
              ),
              attemptedOperation: 'Parsing repaired lesson JSON (PASS 2 - after strict lint repair)',
              timestamp: new Date().toISOString(),
            }
          };
        }

        // Re-run strict lint on repaired version
        const repairedStrictLint = this.strictLintService.strictLint(repairedParsed.data, lessonId);
        debugLog('LESSON_GEN_PASS2_STRICT_LINT', { 
          passed: repairedStrictLint.passed,
          failureCount: repairedStrictLint.failures.length,
          criticalCount: repairedStrictLint.stats.criticalCount
        });

        // Run soft validation for telemetry
        const softValidation = this.validationService.validateLesson(repairedParsed.data, lessonId);

        // If repair didn't fix everything, include remaining issues in warnings
        const warnings: string[] = [];
        if (!repairedStrictLint.passed) {
          console.log(`⚠️  Repair incomplete: ${repairedStrictLint.failures.length} issues remain`);
          warnings.push(
            `Repair incomplete: ${repairedStrictLint.failures.length} strict lint issues remain`,
            ...repairedStrictLint.failures.slice(0, 5).map(f => `[${f.severity}] ${f.message}`)
          );
          if (repairedStrictLint.failures.length > 5) {
            warnings.push(`... and ${repairedStrictLint.failures.length - 5} more issues`);
          }
        } else {
          console.log('✅ Repair successful - all strict lint checks passed');
        }

        // Add soft validation warnings
        if (softValidation.warnings.length > 0) {
          warnings.push(...softValidation.warnings);
        }

        // Return repaired version (even if still has some issues, should be better than original)
        return {
          success: true,
          content: repairedParsed.data,
          warnings: warnings.length > 0 ? warnings : undefined
        };
      }

      // Strict lint passed - run soft validation for telemetry only
      const softValidation = this.validationService.validateLesson(parsed.data, lessonId);
      debugLog('LESSON_GEN_PASS1_SOFT_VALIDATION', { 
        warningCount: softValidation.warnings.length 
      });
      
      console.log('✅ Strict lint passed - lesson meets 95+ quality standards');
      
      return { 
        success: true, 
        content: parsed.data,
        warnings: softValidation.warnings.length > 0 ? softValidation.warnings : undefined
      };

    } catch (error) {
      debugLog('LESSON_GEN_EXCEPTION', { error: error instanceof Error ? error.message : 'unknown' });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for truncation error and format nicely
      if (errorMessage.includes('TRUNCATED_RESPONSE')) {
        // Estimate complexity for error reporting
        const complexityEstimate = estimateLessonComplexity(request);
        const attemptedTokens = errorMessage.includes(String(GENERATION_LIMITS.MAX_TOKENS_RETRY))
          ? [complexityEstimate.recommendedTokens, GENERATION_LIMITS.MAX_TOKENS_RETRY]
          : [complexityEstimate.recommendedTokens];
        
        return {
          success: false,
          content: {} as Lesson,
          error: formatTruncationError('lesson', attemptedTokens, complexityEstimate.complexity),
        };
      }
      
      return {
        success: false,
        content: {} as Lesson,
        error: errorMessage,
      };
    }
  }

  /**
   * Generate lesson using sequential pipeline (9 focused phases)
   * This is the NEW generation approach that breaks the monolithic prompt into phases
   */
  async generateLessonSequential(request: GenerationRequest): Promise<{ success: boolean; content: Lesson; error?: string; warnings?: string[]; debugInfo?: DebugInfo }> {
    try {
      const lessonId = generateLessonId(request.unit, request.lessonId);
      
      debugLog('SEQUENTIAL_GENERATION_START', { lessonId });
      console.log(`\n🔄 [Sequential] Starting sequential generation for ${lessonId}`);
      
      // Run sequential pipeline
      const result = await this.sequentialGenerator.generate(request);
      
      if (!result.success) {
        debugLog('SEQUENTIAL_GENERATION_FAILED', { lessonId, error: result.error });
        return result;
      }
      
      // Run strict lint on the assembled lesson
      const strictLint = this.strictLintService.strictLint(result.content, lessonId);
      debugLog('SEQUENTIAL_STRICT_LINT', {
        passed: strictLint.passed,
        failureCount: strictLint.failures.length,
        criticalCount: strictLint.stats.criticalCount,
      });
      
      if (!strictLint.passed) {
        console.log(`⚠️  Sequential generation: Strict lint found ${strictLint.failures.length} issues (${strictLint.stats.criticalCount} critical)`);
        
        const warnings: string[] = [];
        warnings.push(
          `Strict lint found ${strictLint.failures.length} issues`,
          ...strictLint.failures.slice(0, 5).map(f => `[${f.severity}] ${f.message}`)
        );
        if (strictLint.failures.length > 5) {
          warnings.push(`... and ${strictLint.failures.length - 5} more issues`);
        }
        
        // Still return success but with warnings
        return {
          success: true,
          content: result.content,
          warnings,
          phases: result.phases,
        };
      }
      
      // Run soft validation for telemetry
      const softValidation = this.validationService.validateLesson(result.content, lessonId);
      debugLog('SEQUENTIAL_SOFT_VALIDATION', { 
        warningCount: softValidation.warnings.length 
      });
      
      console.log('✅ Sequential generation complete - all strict lint checks passed');
      
      return {
        success: true,
        content: result.content,
        warnings: softValidation.warnings.length > 0 ? softValidation.warnings : undefined,
        phases: result.phases,
      };
      
    } catch (error) {
      debugLog('SEQUENTIAL_GENERATION_EXCEPTION', { 
        error: error instanceof Error ? error.message : 'unknown' 
      });
      
      return {
        success: false,
        content: {} as Lesson,
        error: error instanceof Error ? error.message : 'Unknown error in sequential generation',
      };
    }
  }

  /**
   * Generate complete quiz (50 questions in batches)
   */
  async generateQuiz(request: GenerationRequest): Promise<{ success: boolean; questions: QuizQuestion[]; error?: string; debugInfo?: DebugInfo }> {
    try {
      const allQuestions: QuizQuestion[] = [];
      let currentId = this.getStartingQuestionId();

      debugLog('QUIZ_GEN_START', { startId: currentId });

      // Generate easy questions (15)
      const easyQuestions = await this.generateQuestionBatch(
        request,
        'easy',
        DIFFICULTY_DISTRIBUTION.easy,
        currentId
      );
      if (!easyQuestions.success) {
        debugLog('EASY_BATCH_FAILED', { error: easyQuestions.error });
        return { success: false, questions: [], error: easyQuestions.error, debugInfo: easyQuestions.debugInfo };
      }
      allQuestions.push(...easyQuestions.questions);
      currentId += DIFFICULTY_DISTRIBUTION.easy;
      debugLog('EASY_BATCH_SUCCESS', { count: easyQuestions.questions.length });

      // Generate medium questions (25)
      const mediumQuestions = await this.generateQuestionBatch(
        request,
        'medium',
        DIFFICULTY_DISTRIBUTION.medium,
        currentId
      );
      if (!mediumQuestions.success) {
        debugLog('MEDIUM_BATCH_FAILED', { error: mediumQuestions.error });
        return { success: false, questions: [], error: mediumQuestions.error, debugInfo: mediumQuestions.debugInfo };
      }
      allQuestions.push(...mediumQuestions.questions);
      currentId += DIFFICULTY_DISTRIBUTION.medium;
      debugLog('MEDIUM_BATCH_SUCCESS', { count: mediumQuestions.questions.length });

      // Generate hard questions (10)
      const hardQuestions = await this.generateQuestionBatch(
        request,
        'hard',
        DIFFICULTY_DISTRIBUTION.hard,
        currentId
      );
      if (!hardQuestions.success) {
        debugLog('HARD_BATCH_FAILED', { error: hardQuestions.error });
        return { success: false, questions: [], error: hardQuestions.error, debugInfo: hardQuestions.debugInfo };
      }
      allQuestions.push(...hardQuestions.questions);
      debugLog('HARD_BATCH_SUCCESS', { count: hardQuestions.questions.length });

      debugLog('QUIZ_GEN_COMPLETE', { totalQuestions: allQuestions.length });
      return { success: true, questions: allQuestions };
    } catch (error) {
      debugLog('QUIZ_GEN_EXCEPTION', { error: error instanceof Error ? error.message : 'unknown' });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for truncation error and format nicely
      if (errorMessage.includes('TRUNCATED_RESPONSE')) {
        const attemptedTokens = errorMessage.includes(String(GENERATION_LIMITS.MAX_TOKENS_RETRY))
          ? [GENERATION_LIMITS.MAX_TOKENS, GENERATION_LIMITS.MAX_TOKENS_RETRY]
          : [GENERATION_LIMITS.MAX_TOKENS];
        
        return {
          success: false,
          questions: [],
          error: formatTruncationError('quiz', attemptedTokens),
        };
      }
      
      return {
        success: false,
        questions: [],
        error: errorMessage,
      };
    }
  }

  /**
   * Generate quiz from existing lesson data
   * Used for standalone quiz generation without creating a new lesson
   */
  async generateQuizFromLesson(
    lessonId: string,
    lesson: Lesson,
    section: string
  ): Promise<{ success: boolean; questions: QuizQuestion[]; error?: string; debugInfo?: DebugInfo }> {
    try {
      // Extract lesson info
      const [unitStr, lessonIdPart] = lessonId.split('-');
      const unit = parseInt(unitStr, 10);
      
      // Create a minimal generation request from lesson data
      const request: GenerationRequest = {
        unit,
        lessonId: lessonIdPart,
        topic: lesson.topic || lesson.title,
        section,
        prerequisites: lesson.prerequisites || [],
      };

      debugLog('QUIZ_FROM_LESSON_START', { lessonId, topic: lesson.topic });

      // Generate quiz using existing method
      const result = await this.generateQuiz(request);

      if (result.success) {
        debugLog('QUIZ_FROM_LESSON_SUCCESS', { questionCount: result.questions.length });
      } else {
        debugLog('QUIZ_FROM_LESSON_FAILED', { error: result.error });
      }

      return result;
    } catch (error) {
      debugLog('QUIZ_FROM_LESSON_EXCEPTION', { error: error instanceof Error ? error.message : 'unknown' });
      return {
        success: false,
        questions: [],
        error: error instanceof Error ? error.message : 'Unknown error generating quiz from lesson',
      };
    }
  }

  /**
   * Generate a batch of questions
   */
  private async generateQuestionBatch(
    request: GenerationRequest,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    startId: number
  ): Promise<{ success: boolean; questions: QuizQuestion[]; error?: string; debugInfo?: DebugInfo }> {
    try {
      // Split large batches into smaller chunks
      const chunkSize = Math.min(count, GENERATION_LIMITS.BATCH_SIZE);
      const chunks = Math.ceil(count / chunkSize);
      const allQuestions: QuizQuestion[] = [];

      for (let i = 0; i < chunks; i++) {
        const chunkCount = Math.min(chunkSize, count - allQuestions.length);
        const chunkStartId = startId + allQuestions.length;

        const { systemPrompt, userPrompt } = this.quizPromptBuilder.buildBatchPrompt(
          request,
          difficulty,
          chunkCount,
          chunkStartId
        );

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:149',message:'Quiz prompts built',data:{hasLessonStructure:userPrompt.includes('LESSON STRUCTURE'),userPromptPreview:userPrompt.substring(0,400),difficulty,chunkCount},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
        // #endregion

        const content = await this.generateWithRetry(
          systemPrompt,
          userPrompt,
          'quiz',
          GENERATION_LIMITS.MAX_RETRIES
        );

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:157',message:'Raw LLM response received',data:{contentLength:content.length,contentPreview:content.substring(0,500),difficulty,chunkStartId},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B,C,E'})}).catch(()=>{});
        // #endregion

        // Clean and preprocess response for JSON parsing
        let cleanedContent = extractTypeScriptArray(content);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:164',message:'After extractTypeScriptArray cleaning',data:{cleanedLength:cleanedContent.length,cleanedPreview:cleanedContent.substring(0,500),wasModified:content!==cleanedContent},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,D'})}).catch(()=>{});
        // #endregion
        
        // Preprocess to ensure valid JSON (remove trailing commas, comments, etc.)
        cleanedContent = preprocessToValidJson(cleanedContent);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:171',message:'After JSON preprocessing',data:{cleanedLength:cleanedContent.length,cleanedPreview:cleanedContent.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'JSON_PREPROCESSING'})}).catch(()=>{});
        // #endregion
        
        // Parse as strict JSON
        const parsed = safeJsonParse<QuizQuestion[]>(cleanedContent);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:181',message:'JSON.parse result',data:{parseSuccess:parsed.success,parseError:parsed.error,hasData:!!parsed.data},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'JSON_PARSE'})}).catch(()=>{});
        // #endregion
        
        if (!parsed.success || !parsed.data) {
          return {
            success: false,
            questions: [],
            error: `Failed to parse quiz questions as JSON: ${parsed.error}`,
            debugInfo: {
              rawResponse: parsed.rawInput || cleanedContent,
              parseError: parsed.error || 'Unknown error',
              errorPosition: parsed.errorDetails,
              contentPreview: generateContextPreview(
                parsed.rawInput || cleanedContent,
                parsed.errorDetails?.position
              ),
              attemptedOperation: 'Parsing quiz questions as JSON (RFC 8259 compliant)',
              timestamp: new Date().toISOString(),
            }
          };
        }
        
        const questions = parsed.data;

        if (!Array.isArray(questions)) {
          return {
            success: false,
            questions: [],
            error: 'Generated content is not an array',
            debugInfo: {
              rawResponse: cleanedContent,
              parseError: 'Array validation failed - result is not an array',
              attemptedOperation: 'Validating quiz questions array structure',
              timestamp: new Date().toISOString(),
            }
          };
        }

        allQuestions.push(...questions);

        // Small delay between chunks to avoid rate limits
        if (i < chunks - 1) {
          await sleep(1000);
        }
      }

      return { success: true, questions: allQuestions };
    } catch (error) {
      return {
        success: false,
        questions: [],
        error: error instanceof Error ? error.message : 'Unknown error generating question batch',
      };
    }
  }

  /**
   * Generate content with retry logic and truncation detection
   */
  private async generateWithRetry(
    systemPrompt: string,
    userPrompt: string,
    type: 'lesson' | 'quiz' | 'phase',
    maxRetries: number,
    attemptHigherLimit = false,
    currentTokenLimit?: number
  ): Promise<string> {
    let lastError: Error | undefined;
    const tokenLimit = currentTokenLimit || (attemptHigherLimit 
      ? GENERATION_LIMITS.MAX_TOKENS_RETRY 
      : GENERATION_LIMITS.MAX_TOKENS);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const client = await createLLMClientWithFallback();
        const model = client.getGenerativeModel({
          model: getGeminiModelWithDefault(),
          systemInstruction: systemPrompt,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: tokenLimit,
          },
        });

        const result = await model.generateContent(userPrompt);
        
        // Extract response data
        const candidate = result.response.candidates?.[0];
        const finishReason = candidate?.finishReason;

        // Check for problematic finish reasons before extracting text
        if (finishReason && finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
          debugLog('GENERATION_STOPPED', {
            type,
            attempt: attempt + 1,
            finishReason,
            message: 'Generation stopped due to safety/policy/other reason'
          });
          
          throw new Error(
            `Generation stopped by API: ${finishReason}. ` +
            `This may indicate content policy violation or API issue.`
          );
        }

        const text = result.response.text();

        // CRITICAL: Validate response before parsing
        const validation = validateLLMResponse(text);
        if (!validation.valid) {
          // Log the validation failure for debugging
          debugLog('RESPONSE_VALIDATION_FAILED', {
            type,
            attempt: attempt + 1,
            error: validation.error,
            detectedType: validation.detectedType,
            responsePreview: text.substring(0, 500)
          });
          
          throw new Error(validation.error || 'Invalid response from LLM');
        }

        const cleanedText = cleanCodeBlocks(text);

        // Get usage metadata from response
        const usageMetadata: UsageMetadata = {
          candidatesTokenCount: result.response.usageMetadata?.candidatesTokenCount,
          promptTokenCount: result.response.usageMetadata?.promptTokenCount,
          totalTokenCount: result.response.usageMetadata?.totalTokenCount,
        };

        // Log successful generation with token usage
        const tokenUtilization = usageMetadata.candidatesTokenCount 
          ? (usageMetadata.candidatesTokenCount / tokenLimit * 100).toFixed(1)
          : 'unknown';
        
        console.log(`✅ Generation successful (attempt ${attempt + 1}/${maxRetries})`);
        console.log(`   Type: ${type}`);
        console.log(`   Tokens used: ${usageMetadata.candidatesTokenCount?.toLocaleString() || 'unknown'} / ${tokenLimit.toLocaleString()} (${tokenUtilization}%)`);
        console.log(`   Response length: ${cleanedText.length.toLocaleString()} characters`);
        console.log(`   Finish reason: ${finishReason || 'unknown'}`);
        
        debugLog('GENERATION_SUCCESS', {
          type,
          attempt: attempt + 1,
          maxRetries,
          tokenLimit,
          tokensUsed: usageMetadata.candidatesTokenCount,
          tokenUtilization: usageMetadata.candidatesTokenCount 
            ? (usageMetadata.candidatesTokenCount / tokenLimit)
            : undefined,
          promptTokens: usageMetadata.promptTokenCount,
          totalTokens: usageMetadata.totalTokenCount,
          responseLength: cleanedText.length,
          finishReason,
        });

        // Run multi-layer truncation detection
        const truncationCheck = detectTruncation(
          cleanedText,
          finishReason,
          usageMetadata,
          tokenLimit,
          type
        );

        // Log truncation detection results
        if (truncationCheck.isTruncated) {
          const report = formatTruncationReport(truncationCheck);
          console.log(report);
          debugLog('TRUNCATION_DETECTED', {
            type,
            attempt: attempt + 1,
            tokenLimit,
            confidence: truncationCheck.confidence,
            reasons: truncationCheck.reasons,
            metadata: truncationCheck.metadata,
          });
        }

        // If high-confidence truncation detected, throw error to trigger retry
        if (truncationCheck.isTruncated && !isResponseSafeToParse(truncationCheck)) {
          throw new Error(
            `TRUNCATED_RESPONSE: ${truncationCheck.reasons.join('; ')} (confidence: ${truncationCheck.confidence})`
          );
        }

        // Response looks good, return it
        return cleanedText;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Enhanced error logging
        console.error(`\n❌ Generation attempt ${attempt + 1}/${maxRetries} failed`);
        console.error(`   Error type: ${lastError.name}`);
        console.error(`   Error message: ${lastError.message}`);
        console.error(`   Token limit: ${tokenLimit}`);
        console.error(`   Type: ${type}`);
        console.error(`   Attempt higher limit: ${attemptHigherLimit}`);
        
        if (lastError.stack) {
          console.error(`   Stack trace (first 500 chars):`, lastError.stack.substring(0, 500));
        }
        
        debugLog('GENERATION_ATTEMPT_FAILED', {
          attempt: attempt + 1,
          maxRetries,
          errorName: lastError.name,
          errorMessage: lastError.message,
          tokenLimit,
          type,
          attemptHigherLimit,
          stackPreview: lastError.stack?.substring(0, 200)
        });
        
        // If truncated and haven't tried higher limit yet, retry with more tokens
        if (lastError.message.includes('TRUNCATED_RESPONSE') && !attemptHigherLimit) {
          console.log(`\n🔄 TRUNCATION RECOVERY: Retrying with ${GENERATION_LIMITS.MAX_TOKENS_RETRY} tokens...`);
          console.log(`   Previous limit: ${tokenLimit}`);
          console.log(`   New limit: ${GENERATION_LIMITS.MAX_TOKENS_RETRY}`);
          console.log(`   Reason: ${lastError.message}`);
          return this.generateWithRetry(systemPrompt, userPrompt, type, 1, true);
        }

        // Log that we're retrying
        if (attempt < maxRetries - 1) {
          console.log(`\n⏭️  Retrying (attempt ${attempt + 2}/${maxRetries})...`);
          await sleep(GENERATION_LIMITS.RETRY_DELAY_MS * (attempt + 1));
        }
      }
    }

    throw lastError || new Error('Failed to generate content after retries');
  }

  /**
   * Write lesson to file with fsync to ensure physical write to disk
   * This prevents race conditions during Next.js hot-reload
   */
  async writeLessonFile(request: GenerationRequest, lesson: Lesson): Promise<string> {
    const filename = generateLessonFilename(request.unit, request.lessonId, request.topic);
    const filePath = path.join(process.cwd(), 'src', 'data', 'lessons', filename);

    // Use fd-based write with fsync to force kernel buffer flush
    const content = JSON.stringify(lesson, null, 2);
    const fd = fs.openSync(filePath, 'w');
    try {
      fs.writeSync(fd, content, 0, 'utf-8');
      fs.fsyncSync(fd); // Force physical write to disk
    } finally {
      fs.closeSync(fd);
    }

    return filePath;
  }

  /**
   * Write quiz to file with fsync to ensure physical write to disk
   * This prevents race conditions during Next.js hot-reload
   */
  async writeQuizFile(request: GenerationRequest, questions: QuizQuestion[]): Promise<string> {
    const filename = generateQuizFilename(request.topic);
    const filePath = path.join(process.cwd(), 'src', 'data', 'questions', filename);

    // Generate TypeScript content
    const content = this.generateQuizFileContent(request, questions);

    // Use fd-based write with fsync to force kernel buffer flush
    const fd = fs.openSync(filePath, 'w');
    try {
      fs.writeSync(fd, content, 0, 'utf-8');
      fs.fsyncSync(fd); // Force physical write to disk
    } finally {
      fs.closeSync(fd);
    }

    return filePath;
  }

  /**
   * Generate TypeScript quiz file content
   */
  private generateQuizFileContent(request: GenerationRequest, questions: QuizQuestion[]): string {
    const fullLessonId = generateLessonId(request.unit, request.lessonId);
    const variableName = generateQuizFilename(request.topic).replace('.ts', '').replace(/Questions$/, 'Questions');

    return `import { TaggedQuestion } from './types';

/**
 * ${request.topic} Question Bank
 * Aligned with lesson ${fullLessonId} learning outcomes
 * Generated: ${getCurrentTimestamp()}
 */

export const ${variableName}: TaggedQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
  }

  /**
   * Get starting question ID (next available)
   */
  private getStartingQuestionId(): number {
    // Try to find highest existing ID
    const questionsPath = path.join(process.cwd(), 'src', 'data', 'questions');
    
    try {
      const files = fs.readdirSync(questionsPath);
      let maxId = 3000;

      for (const file of files) {
        if (file.endsWith('Questions.ts')) {
          const content = fs.readFileSync(path.join(questionsPath, file), 'utf-8');
          const idMatches = content.matchAll(/id:\s*(\d+)/g);
          
          for (const match of idMatches) {
            const id = parseInt(match[1], 10);
            if (id > maxId) {
              maxId = id;
            }
          }
        }
      }

      return maxId + 1;
    } catch (error) {
      console.warn('Could not scan existing question IDs, starting from 3000');
      return 3000;
    }
  }
}
