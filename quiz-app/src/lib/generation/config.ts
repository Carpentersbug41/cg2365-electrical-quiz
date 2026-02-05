/**
 * Generation Configuration
 * Central configuration for lesson generation system
 */

export const GENERATION_CONFIG = {
  /**
   * Phase 10: Auto-Refinement Configuration
   */
  refinement: {
    /**
     * Enable/disable auto-refinement
     * Set to false to completely skip Phase 10
     */
    enabled: true,
    
    /**
     * Score threshold for triggering refinement
     * Refinement activates if lesson score < this value
     * Default: 97 (for testing - aims for 98-100 after refinement)
     */
    scoreThreshold: 97,
    
    /**
     * Maximum number of patches to apply per refinement
     * Limits LLM to fixing top N issues
     * Set to 10 to maintain laser focus on most impactful issues
     */
    maxFixes: 10,
    
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
     * Default: 0.3 for deterministic scoring
     */
    temperature: 0.3,
    
    /**
     * Max tokens for scoring response
     */
    maxTokens: 4000,
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
