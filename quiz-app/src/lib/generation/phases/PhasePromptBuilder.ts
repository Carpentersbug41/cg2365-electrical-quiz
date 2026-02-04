/**
 * Base class for phase-specific prompt builders
 * Provides shared utilities and consistent interface for all phases
 */

import { DebugInfo } from '../types';

/**
 * Standard result interface for all phases
 */
export interface PhaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  debugInfo?: DebugInfo;
}

/**
 * Base class for phase prompt builders
 */
export abstract class PhasePromptBuilder {
  /**
   * Get the phase name for logging
   */
  abstract getPhaseName(): string;

  /**
   * Build the system prompt for this phase
   */
  protected abstract buildSystemPrompt(): string;

  /**
   * Build the user prompt for this phase
   */
  protected abstract buildUserPrompt(input: any): string;

  /**
   * Get prompts for this phase
   */
  public getPrompts(input: any): { systemPrompt: string; userPrompt: string } {
    return {
      systemPrompt: this.buildSystemPrompt(),
      userPrompt: this.buildUserPrompt(input),
    };
  }

  /**
   * Standard JSON output instructions
   */
  protected getJsonOutputInstructions(): string {
    return `
OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else`;
  }

  /**
   * Create error result with debug info
   */
  protected createErrorResult<T>(error: string, debugInfo?: DebugInfo): PhaseResult<T> {
    return {
      success: false,
      error,
      debugInfo,
    };
  }

  /**
   * Create success result
   */
  protected createSuccessResult<T>(data: T): PhaseResult<T> {
    return {
      success: true,
      data,
    };
  }
}
