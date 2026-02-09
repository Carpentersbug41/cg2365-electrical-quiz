/**
 * Generation Configuration
 * Central configuration for lesson generation system
 */

export const GENERATION_CONFIG = {
  /**
   * Phase 10-13: Lesson Improvement Pipeline Configuration
   * - Phase 10: Scoring (identify issues)
   * - Phase 11: Suggesting (generate fixes)
   * - Phase 12: Implementing (apply fixes)
   * - Phase 13: Rescoring (validate improvements)
   */
  refinement: {
    /**
     * Enable/disable auto-refinement
     * Set to false to completely skip Phase 10-13 pipeline
     */
    enabled: true,
    
    /**
     * Score threshold for triggering refinement
     * Refinement activates if lesson score < this value
     * Default: 95 (trigger improvement attempts)
     */
    scoreThreshold: 95,
    
    /**
     * Save original lesson when refinement is applied
     * Saves as {lessonId}-original.json for comparison
     * Default: true
     */
    saveOriginal: true,
    
    /**
     * Automatically apply refinement improvements
     * If false, would only suggest improvements (future feature)
     * Default: true
     */
    autoApply: true,
  },
  
  /**
   * Scoring Configuration
   */
  scoring: {
    /**
     * Scoring method: 'llm' or 'rubric'
     * 'llm': Use LLM-based intelligent scoring (recommended)
     * 'rubric': Use hardcoded rubric (deprecated, for comparison only)
     */
    method: 'llm' as 'llm' | 'rubric',
    
    /**
     * Temperature for LLM scoring (lower = more consistent)
     * 0.0 for fully deterministic scoring (no variance)
     */
    temperature: 0.0,
    
    /**
     * Max output tokens for scoring response
     * Set to 16000 to ensure complex lessons never truncate
     * After investing ~70K tokens in generation, scoring must have headroom
     */
    maxTokens: 16000,
  },
  
  /**
   * Other generation settings
   */
  generation: {
    /**
     * Enable debug logging
     */
    debug: true,
    
    /**
     * Retry attempts for LLM calls
     */
    maxRetries: 3,
  },
  
  /**
   * Phase 10-13 Debug Artifacts Configuration
   */
  debugArtifacts: {
    /**
     * Enable/disable Phase 10-13 debug artifact recording
     * When enabled, writes full run bundles to disk with prompts, outputs, scores, validation, diffs
     * Default: true
     */
    enabled: true,
    
    /**
     * Output path for Phase 10-13 run artifacts
     * Default: 'reports/phase10_runs'
     * Each run is saved in its own folder: <outputPath>/<runId>/
     * Example: reports/phase10_runs/203-3D__2026-02-07T10-32-18-123Z__phase10-13__model/
     */
    outputPath: process.env.PHASE10_DEBUG_PATH || 'reports/phase10_runs',
    
    /**
     * Score stability check configuration
     * Re-scores the same lesson multiple times to measure scorer variance
     */
    scoreStability: {
      enabled: false,  // Set to true to enable stability checks
      runs: 3          // Number of times to score the same lesson
    },
    
    /**
     * Issue tracking configuration
     * Generates issue lifecycle and JSON pointer diffs
     */
    issueTracking: {
      enabled: true,
      usePointers: true  // Generate JSON pointer-level diffs (RFC 6901)
    },
  }
};

/**
 * Get refinement config (for easy access)
 */
export function getRefinementConfig() {
  return GENERATION_CONFIG.refinement;
}

/**
 * Get scoring config (for easy access)
 */
export function getScoringConfig() {
  return GENERATION_CONFIG.scoring;
}

/**
 * Check if refinement should run for a given score
 */
export function shouldRefine(score: number): boolean {
  return GENERATION_CONFIG.refinement.enabled && score < GENERATION_CONFIG.refinement.scoreThreshold;
}

/**
 * Get debug artifacts config (for easy access)
 */
export function getDebugArtifactsConfig() {
  return GENERATION_CONFIG.debugArtifacts;
}
