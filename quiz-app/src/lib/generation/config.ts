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
     * Default: 93 (aims for 95-97 after refinement)
     * TEMPORARILY SET TO 97 FOR TESTING DIAGNOSTIC OUTPUT
     */
    scoreThreshold: 97,
    
    /**
     * Maximum number of patches to apply per refinement
     * Limits LLM to fixing top N issues
     * Default: 10
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
 * Check if refinement should run for a given score
 */
export function shouldRefine(score: number): boolean {
  return GENERATION_CONFIG.refinement.enabled && score < GENERATION_CONFIG.refinement.scoreThreshold;
}
