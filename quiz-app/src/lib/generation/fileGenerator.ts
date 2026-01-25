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

      // Generate easy questions (15)
      const easyQuestions = await this.generateQuestionBatch(
        request,
        'easy',
        DIFFICULTY_DISTRIBUTION.easy,
        currentId
      );
      if (!easyQuestions.success) {
        return { success: false, questions: [], error: easyQuestions.error };
      }
      allQuestions.push(...easyQuestions.questions);
      currentId += DIFFICULTY_DISTRIBUTION.easy;

      // Generate medium questions (25)
      const mediumQuestions = await this.generateQuestionBatch(
        request,
        'medium',
        DIFFICULTY_DISTRIBUTION.medium,
        currentId
      );
      if (!mediumQuestions.success) {
        return { success: false, questions: [], error: mediumQuestions.error };
      }
      allQuestions.push(...mediumQuestions.questions);
      currentId += DIFFICULTY_DISTRIBUTION.medium;

      // Generate hard questions (10)
      const hardQuestions = await this.generateQuestionBatch(
        request,
        'hard',
        DIFFICULTY_DISTRIBUTION.hard,
        currentId
      );
      if (!hardQuestions.success) {
        return { success: false, questions: [], error: hardQuestions.error };
      }
      allQuestions.push(...hardQuestions.questions);

      return { success: true, questions: allQuestions };
    } catch (error) {
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

        const content = await this.generateWithRetry(
          systemPrompt,
          userPrompt,
          'quiz',
          GENERATION_LIMITS.MAX_RETRIES
        );

        // Parse as JavaScript array
        const cleanedContent = extractTypeScriptArray(content);
        
        // Use eval in a safe context (only for known LLM-generated content)
        let questions: QuizQuestion[];
        try {
          // eslint-disable-next-line no-eval
          questions = eval(cleanedContent) as QuizQuestion[];
        } catch (evalError) {
          // Try JSON.parse as fallback
          const parsed = safeJsonParse<QuizQuestion[]>(cleanedContent);
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
