/**
 * File Generator Service
 * Coordinates LLM calls to generate lesson and quiz files
 */

import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { LessonPromptBuilder } from './lessonPromptBuilder';
import { QuizPromptBuilder } from './quizPromptBuilder';
import { GenerationRequest, Lesson, QuizQuestion } from './types';
import {
  generateLessonFilename,
  generateQuizFilename,
  generateLessonId,
  getCurrentTimestamp,
  cleanCodeBlocks,
  extractJson,
  extractTypeScriptArray,
  safeJsonParse,
  sleep,
} from './utils';
import { GENERATION_LIMITS, DIFFICULTY_DISTRIBUTION } from './constants';
import fs from 'fs';
import path from 'path';

// Debug logger
function debugLog(stage: string, data: any) {
  const logEntry = JSON.stringify({
    timestamp: Date.now(),
    location: 'fileGenerator.ts',
    stage,
    data,
    sessionId: 'generation'
  }) + '\n';
  try {
    const logPath = path.join(process.cwd(), '.cursor', 'debug.log');
    fs.appendFileSync(logPath, logEntry, 'utf-8');
  } catch (e) {
    // Silent fail
  }
}

export class FileGenerator {
  private lessonPromptBuilder: LessonPromptBuilder;
  private quizPromptBuilder: QuizPromptBuilder;

  constructor() {
    this.lessonPromptBuilder = new LessonPromptBuilder();
    this.quizPromptBuilder = new QuizPromptBuilder();
  }

  /**
   * Generate complete lesson JSON file
   */
  async generateLesson(request: GenerationRequest): Promise<{ success: boolean; content: Lesson; error?: string }> {
    try {
      const { systemPrompt, userPrompt } = this.lessonPromptBuilder.buildPrompt(request);

      const content = await this.generateWithRetry(
        systemPrompt,
        userPrompt,
        'lesson',
        GENERATION_LIMITS.MAX_RETRIES
      );

      const parsed = safeJsonParse<Lesson>(content);
      if (!parsed.success || !parsed.data) {
        return {
          success: false,
          content: {} as Lesson,
          error: `Failed to parse lesson JSON: ${parsed.error}`,
        };
      }

      return { success: true, content: parsed.data };
    } catch (error) {
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
  async generateQuiz(request: GenerationRequest): Promise<{ success: boolean; questions: QuizQuestion[]; error?: string }> {
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
        return { success: false, questions: [], error: easyQuestions.error };
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
        return { success: false, questions: [], error: mediumQuestions.error };
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
        return { success: false, questions: [], error: hardQuestions.error };
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
   * Generate a batch of questions
   */
  private async generateQuestionBatch(
    request: GenerationRequest,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    startId: number
  ): Promise<{ success: boolean; questions: QuizQuestion[]; error?: string }> {
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

        // Parse as JavaScript array
        const cleanedContent = extractTypeScriptArray(content);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:164',message:'After extractTypeScriptArray cleaning',data:{cleanedLength:cleanedContent.length,cleanedPreview:cleanedContent.substring(0,500),wasModified:content!==cleanedContent},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,D'})}).catch(()=>{});
        // #endregion
        
        // Use eval in a safe context (only for known LLM-generated content)
        let questions: QuizQuestion[];
        try {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:171',message:'Attempting eval',data:{contentToEval:cleanedContent.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          // eslint-disable-next-line no-eval
          questions = eval(cleanedContent) as QuizQuestion[];
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:176',message:'Eval succeeded',data:{questionCount:questions.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
        } catch (evalError) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:181',message:'Eval failed, trying JSON.parse',data:{evalErrorMsg:evalError instanceof Error?evalError.message:'unknown',evalErrorName:evalError instanceof Error?evalError.name:'unknown',contentForJsonParse:cleanedContent.substring(0,300)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B,E'})}).catch(()=>{});
          // #endregion
          // Try JSON.parse as fallback
          const parsed = safeJsonParse<QuizQuestion[]>(cleanedContent);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileGenerator.ts:187',message:'JSON.parse result',data:{parseSuccess:parsed.success,parseError:parsed.error,hasData:!!parsed.data},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B,E'})}).catch(()=>{});
          // #endregion
          if (!parsed.success || !parsed.data) {
            return {
              success: false,
              questions: [],
              error: `Failed to parse quiz questions: ${parsed.error}`,
            };
          }
          questions = parsed.data;
        }

        if (!Array.isArray(questions)) {
          return {
            success: false,
            questions: [],
            error: 'Generated content is not an array',
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
