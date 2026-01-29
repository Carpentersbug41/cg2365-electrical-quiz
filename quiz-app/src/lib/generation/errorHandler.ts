/**
 * Error Handler for Lesson Generation
 * Provides comprehensive error handling and rollback mechanisms
 */

import { FileIntegrator } from './fileIntegrator';
import { GitService } from './gitService';
import { GenerationRequest } from './types';
import fs from 'fs';

export class ErrorHandler {
  private fileIntegrator: FileIntegrator;
  private gitService: GitService;

  constructor() {
    this.fileIntegrator = new FileIntegrator();
    this.gitService = new GitService();
  }

  /**
   * Rollback all changes after error
   * Note: Git changes are NOT automatically rolled back when committing to main
   * Manual revert required if git commit succeeded but later steps failed
   */
  async rollbackAll(
    lessonFilePath?: string,
    quizFilePath?: string,
    integrationFiles?: string[]
  ): Promise<void> {
    console.log('[ErrorHandler] Starting rollback...');

    try {
      // 1. Delete generated files
      if (lessonFilePath && fs.existsSync(lessonFilePath)) {
        fs.unlinkSync(lessonFilePath);
        console.log(`[ErrorHandler] Deleted lesson file: ${lessonFilePath}`);
      }

      if (quizFilePath && fs.existsSync(quizFilePath)) {
        fs.unlinkSync(quizFilePath);
        console.log(`[ErrorHandler] Deleted quiz file: ${quizFilePath}`);
      }

      // 2. Rollback integration files
      if (integrationFiles && integrationFiles.length > 0) {
        await this.fileIntegrator.rollback(integrationFiles);
        console.log('[ErrorHandler] Integration files rollback initiated');
      }

      // Note: Git rollback is NOT performed automatically to avoid reverting main
      // If git commit succeeded but generation failed, manual revert is required

      console.log('[ErrorHandler] Rollback complete');
    } catch (error) {
      console.error('[ErrorHandler] Error during rollback:', error);
      throw new Error(`Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle API errors with detailed logging
   */
  handleApiError(error: unknown, context: string): { message: string; status: number } {
    console.error(`[ErrorHandler] ${context}:`, error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('rate limit')) {
        return {
          message: 'Rate limit exceeded. Please try again later.',
          status: 429,
        };
      }

      if (error.message.includes('validation')) {
        return {
          message: `Validation error: ${error.message}`,
          status: 400,
        };
      }

      if (error.message.includes('git')) {
        return {
          message: `Git error: ${error.message}. Check git configuration.`,
          status: 500,
        };
      }

      if (error.message.includes('LLM') || error.message.includes('API')) {
        return {
          message: `AI service error: ${error.message}. Please try again.`,
          status: 503,
        };
      }

      return {
        message: error.message,
        status: 500,
      };
    }

    return {
      message: 'An unknown error occurred',
      status: 500,
    };
  }

  /**
   * Validate environment configuration
   */
  validateEnvironment(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required environment variables
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_CLOUD_PROJECT) {
      errors.push('Missing GEMINI_API_KEY or GOOGLE_CLOUD_PROJECT environment variable');
    }

    // Check if running in production without safety checks
    if (process.env.NODE_ENV === 'production' && process.env.LESSON_GENERATOR_ENABLED !== 'true') {
      errors.push('Lesson generator is not enabled in production. Set LESSON_GENERATOR_ENABLED=true');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Log generation attempt for debugging
   */
  logGenerationAttempt(request: GenerationRequest, success: boolean, error?: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      lessonId: `${request.unit}-${request.lessonId}`,
      topic: request.topic,
      success,
      error: error || null,
    };

    console.log('[GenerationLog]', JSON.stringify(logEntry));

    // In production, you could write to a log file or database
    // For now, just console log
  }
}
