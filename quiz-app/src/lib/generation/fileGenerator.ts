/**
 * File Generator Service
 * Coordinates LLM calls to generate lesson and quiz files
 */

import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { LessonPromptBuilder } from './lessonPromptBuilder';
import { QuizPromptBuilder } from './quizPromptBuilder';
import { ValidationService } from './validationService';
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
} from './utils';
import { GENERATION_LIMITS, DIFFICULTY_DISTRIBUTION } from './constants';
import fs from 'fs';
import path from 'path';

// Debug logger
function debugLog(stage: string, data: unknown) {
  const logEntry = JSON.stringify({
    timestamp: Date.now(),
    location: 'fileGenerator.ts',
    stage,
    data,
    sessionId: 'generation'
  }) + '\n';
  try {
    const logPath = path.join(process.cwd(), '..', '.cursor', 'debug.log');
    fs.appendFileSync(logPath, logEntry, 'utf-8');
  } catch (e) {
    // Silent fail
  }
}

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

export class FileGenerator {
  private lessonPromptBuilder: LessonPromptBuilder;
  private quizPromptBuilder: QuizPromptBuilder;
  private validationService: ValidationService;

  constructor() {
    this.lessonPromptBuilder = new LessonPromptBuilder();
    this.quizPromptBuilder = new QuizPromptBuilder();
    this.validationService = new ValidationService();
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
  async generateLesson(request: GenerationRequest): Promise<{ success: boolean; content: Lesson; error?: string; warnings?: string[] }> {
    try {
      const lessonId = generateLessonId(request.unit, request.lessonId);
      const { systemPrompt, userPrompt } = this.lessonPromptBuilder.buildPrompt(request);

      // PASS 1: Generate lesson
      debugLog('LESSON_GEN_PASS1_START', { lessonId });
      const content = await this.generateWithRetry(
        systemPrompt,
        userPrompt,
        'lesson',
        GENERATION_LIMITS.MAX_RETRIES
      );

      const parsed = safeJsonParse<Lesson>(content);
      if (!parsed.success || !parsed.data) {
        debugLog('LESSON_GEN_PASS1_PARSE_FAILED', { error: parsed.error });
        return {
          success: false,
          content: {} as Lesson,
          error: `Failed to parse lesson JSON: ${parsed.error}`,
        };
      }

      // Validate the generated lesson
      const validation = this.validationService.validateLesson(parsed.data, lessonId);
      debugLog('LESSON_GEN_PASS1_VALIDATION', { 
        valid: validation.valid, 
        errorCount: validation.errors.length,
        warningCount: validation.warnings.length 
      });

      // If validation passed or only has warnings, return success
      if (validation.valid) {
        return { 
          success: true, 
          content: parsed.data,
          warnings: validation.warnings.length > 0 ? validation.warnings : undefined
        };
      }

      // PASS 2: If there are errors, attempt repair
      debugLog('LESSON_GEN_PASS2_REPAIR_START', { errorCount: validation.errors.length });
      console.log('Lesson validation failed, attempting repair...');
      console.log('Errors:', validation.errors);
      
      const repairPrompt = this.buildRepairPrompt(content, validation.errors, validation.warnings);
      
      const repairedContent = await this.generateWithRetry(
        'You are a JSON repair specialist. Fix validation issues in lesson JSON.',
        repairPrompt,
        'lesson-repair',
        1 // Only one retry for repair
      );

      const repairedParsed = safeJsonParse<Lesson>(repairedContent);
      if (!repairedParsed.success || !repairedParsed.data) {
        debugLog('LESSON_GEN_PASS2_PARSE_FAILED', { error: repairedParsed.error });
        // Return original if repair failed to parse
        return {
          success: true,
          content: parsed.data,
          warnings: ['Repair attempt failed, using original with validation issues: ' + validation.errors.join('; ')]
        };
      }

      // Validate repaired lesson
      const repairedValidation = this.validationService.validateLesson(repairedParsed.data, lessonId);
      debugLog('LESSON_GEN_PASS2_VALIDATION', { 
        valid: repairedValidation.valid,
        errorCount: repairedValidation.errors.length,
        warningCount: repairedValidation.warnings.length
      });

      // Return repaired version (even if still has some issues, it should be better)
      return {
        success: true,
        content: repairedParsed.data,
        warnings: repairedValidation.errors.length > 0 
          ? ['Repaired but still has issues: ' + repairedValidation.errors.join('; ')] 
          : repairedValidation.warnings
      };

    } catch (error) {
      debugLog('LESSON_GEN_EXCEPTION', { error: error instanceof Error ? error.message : 'unknown' });
      return {
        success: false,
        content: {} as Lesson,
        error: error instanceof Error ? error.message : 'Unknown error generating lesson',
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
      return {
        success: false,
        questions: [],
        error: error instanceof Error ? error.message : 'Unknown error generating quiz',
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
   * Generate content with retry logic
   */
  private async generateWithRetry(
    systemPrompt: string,
    userPrompt: string,
    type: 'lesson' | 'quiz',
    maxRetries: number
  ): Promise<string> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const client = await createLLMClientWithFallback();
        const model = client.getGenerativeModel({
          model: getGeminiModelWithDefault(),
          systemInstruction: systemPrompt,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: type === 'lesson' ? 8000 : 8000, // Increased from 4000 to prevent truncation
          },
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from LLM');
        }

        return cleanCodeBlocks(text);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Generation attempt ${attempt + 1} failed:`, lastError);

        if (attempt < maxRetries - 1) {
          await sleep(GENERATION_LIMITS.RETRY_DELAY_MS * (attempt + 1));
        }
      }
    }

    throw lastError || new Error('Failed to generate content after retries');
  }

  /**
   * Write lesson to file
   */
  async writeLessonFile(request: GenerationRequest, lesson: Lesson): Promise<string> {
    const filename = generateLessonFilename(request.unit, request.lessonId, request.topic);
    const filePath = path.join(process.cwd(), 'src', 'data', 'lessons', filename);

    fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2), 'utf-8');

    return filePath;
  }

  /**
   * Write quiz to file
   */
  async writeQuizFile(request: GenerationRequest, questions: QuizQuestion[]): Promise<string> {
    const filename = generateQuizFilename(request.topic);
    const filePath = path.join(process.cwd(), 'src', 'data', 'questions', filename);

    // Generate TypeScript content
    const content = this.generateQuizFileContent(request, questions);

    fs.writeFileSync(filePath, content, 'utf-8');

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
