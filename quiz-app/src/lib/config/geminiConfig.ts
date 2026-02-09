/**
 * Centralized Gemini Model Configuration
 * Single source of truth for LLM model settings across the application
 */

/**
 * Get the primary Gemini model name from environment variables
 * @throws Error if GEMINI_MODEL is not set and no default is provided
 */
export function getGeminiModel(): string {
  const modelName = process.env.GEMINI_MODEL;
  
  if (!modelName) {
    throw new Error('GEMINI_MODEL is not set in environment variables. Please set it in .env.local');
  }
  
  // Log model configuration when first accessed
  console.log('🤖 [LLM Config] Using Gemini model:', modelName);
  
  return modelName;
}

/**
 * Get the primary Gemini model name from environment variables
 * @throws Error if GEMINI_MODEL is not set
 * @returns Model name from env
 */
export function getGeminiModelWithDefault(): string {
  const modelName = process.env.GEMINI_MODEL;
  
  if (!modelName) {
    throw new Error('GEMINI_MODEL is not set in environment variables. Please set it in .env.local');
  }
  
  // Log model configuration when first accessed
  console.log('🤖 [LLM Config] Using Gemini model:', modelName);
  
  return modelName;
}

/**
 * Get the fallback Gemini model name for error recovery
 * @throws Error if GEMINI_FALLBACK_MODEL is not set
 * @returns Fallback model name from env
 */
export function getGeminiFallbackModel(): string {
  const modelName = process.env.GEMINI_FALLBACK_MODEL;
  
  if (!modelName) {
    throw new Error('GEMINI_FALLBACK_MODEL is not set in environment variables. Please set it in .env.local');
  }
  
  return modelName;
}

/**
 * Get Gemini API key from environment variables
 * @returns API key or null if not set
 */
export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

/**
 * Validate that Gemini configuration is available
 * @returns true if API key is set, false otherwise
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Get Google Cloud Project ID from environment variables
 * @returns Project ID or null if not set
 */
export function getGoogleCloudProject(): string | null {
  return process.env.GOOGLE_CLOUD_PROJECT || null;
}

/**
 * Get Google Cloud location/region from environment variables
 * @param defaultValue - Default location if GOOGLE_CLOUD_LOCATION is not set
 * @returns Location from env or default value
 */
export function getGoogleCloudLocation(defaultValue: string = 'us-central1'): string {
  return process.env.GOOGLE_CLOUD_LOCATION || defaultValue;
}

/**
 * Check if Vertex AI is configured
 * @returns true if project ID is set, false otherwise
 */
export function isVertexAIConfigured(): boolean {
  return !!process.env.GOOGLE_CLOUD_PROJECT;
}

/**
 * Check if Vertex AI should be used instead of Google AI Studio
 * @returns true if USE_VERTEX_AI is set to 'true', false otherwise
 */
export function shouldUseVertexAI(): boolean {
  return process.env.USE_VERTEX_AI === 'true';
}

/**
 * Get the Phase 10 model name from environment variables
 * Phase 10 uses a more powerful model for better reasoning on lesson improvements
 * @returns Phase 10 model name from PHASE10_MODEL env, or falls back to GEMINI_MODEL
 */
export function getPhase10Model(): string {
  // Use dedicated Phase 10 model if set, otherwise fall back to main model
  const phase10Model = process.env.PHASE10_MODEL;
  if (phase10Model) {
    console.log('🎯 [Phase 10 Config] Using dedicated Phase 10 model:', phase10Model);
    return phase10Model;
  }
  
  // Fallback to main model
  const fallbackModel = getGeminiModelWithDefault();
  console.log('🎯 [Phase 10 Config] PHASE10_MODEL not set, using GEMINI_MODEL:', fallbackModel);
  return fallbackModel;
}

/**
 * Get the Phase 12 model name from environment variables
 * Phase 12 uses the most powerful model for complex lesson refinement
 * @returns Phase 12 model name from PHASE12_MODEL env, or falls back to PHASE10_MODEL, then GEMINI_MODEL
 */
export function getPhase12Model(): string {
  // Use dedicated Phase 12 model if set
  const phase12Model = process.env.PHASE12_MODEL;
  if (phase12Model) {
    console.log('🎯 [Phase 12 Config] Using dedicated Phase 12 model:', phase12Model);
    return phase12Model;
  }
  
  // Fallback to Phase 10 model
  const phase10Model = process.env.PHASE10_MODEL;
  if (phase10Model) {
    console.log('🎯 [Phase 12 Config] PHASE12_MODEL not set, using PHASE10_MODEL:', phase10Model);
    return phase10Model;
  }
  
  // Final fallback to main model
  const fallbackModel = getGeminiModelWithDefault();
  console.log('🎯 [Phase 12 Config] PHASE12_MODEL and PHASE10_MODEL not set, using GEMINI_MODEL:', fallbackModel);
  return fallbackModel;
}