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
    
    /**
     * Phase 10 strategy: 'patch' or 'rewrite'
     * 'patch': v1 surgical JSON patches (DEPRECATED - offline except for emergency)
     * 'rewrite': v2 holistic rewrite with hard safety gates (DEFAULT)
     * Default: 'rewrite'
     * 
     * WARNING: v1 (patch) is offline by default. Only enable for emergency rollback.
     */
    strategy: 'rewrite' as 'patch' | 'rewrite',
    
    /**
     * Enable Phase 10 v2 (holistic rewrite)
     * When true, uses rewrite strategy (DEFAULT)
     * When false, uses patch strategy (EMERGENCY FALLBACK ONLY)
     * Default: true (v2 is production strategy)
     * 
     * Set to false ONLY for emergency rollback to v1 patches.
     */
    rewriteEnabled: true,
    
    /**
     * Enable shadow mode for v2 testing
     * When true, runs both v1 and v2 but ships v1 result
     * Used to collect comparison metrics without risk
     * Default: false
     */
    rewriteShadowMode: false,
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
 * Get Phase 10 strategy (patch or rewrite)
 * Default: 'rewrite' (v2) - v1 (patch) is offline except for emergency
 * 
 * To enable v1 emergency fallback: set rewriteEnabled: false in config
 */
export function getPhase10Strategy(): 'patch' | 'rewrite' {
  // v2 (rewrite) is default - v1 (patch) requires explicit opt-in
  return GENERATION_CONFIG.refinement.rewriteEnabled ? 'rewrite' : 'patch';
}
