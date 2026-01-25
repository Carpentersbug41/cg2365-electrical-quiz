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