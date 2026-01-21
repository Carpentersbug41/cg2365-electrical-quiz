/**
 * LLM-First Marking Service
 * Uses Gemini API with structured JSON output for semantic answer evaluation
 * Supports both Google AI Studio and Vertex AI via abstraction layer
 */

import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { createLLMClientWithFallback } from '@/lib/llm/client';

/**
 * Error types for marking service failures
 */
export type ErrorType = 
  | 'QUOTA_EXCEEDED'
  | 'MODEL_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * LLM Marking Request
 */
export interface LLMMarkingRequest {
  questionText: string;
  modelAnswer: string;
  userAnswer: string;
  cognitiveLevel?: 'connection' | 'synthesis' | 'hypothesis';
}

/**
 * LLM Marking Response
 */
export interface LLMMarkingResponse {
  isCorrect: boolean;
  score: number;  // 0.0 to 1.0
  feedback: string;
}

/**
 * Extended Marking Result with error handling
 */
export interface ExtendedMarkingResult extends LLMMarkingResponse {
  canRetry?: boolean;
  serviceUnavailable?: boolean;
  metadata?: {
    markingStrategy: string;
    errorCode?: string;
    errorType?: ErrorType;
    timestamp?: Date;
    markedAt?: Date;
    modelUsed?: string;
  };
}

/**
 * Classify error type based on error message
 */
function classifyError(error: unknown): ErrorType {
  const msg = error instanceof Error ? error.message : String(error);
  // #region agent log
  console.log('🔍 [DEBUG] classifyError called', {errorMessage:msg.substring(0,200),has429:msg.includes('429'),hasQuota:msg.includes('quota'),has404:msg.includes('404'),has401:msg.includes('401')});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:62',message:'classifyError called',data:{errorMessage:msg,errorType:error?.constructor?.name,has429:msg.includes('429'),hasQuota:msg.includes('quota'),has404:msg.includes('404'),has401:msg.includes('401'),hasApiKey:msg.includes('API key')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
    // #region agent log
    console.log('🔍 [DEBUG] ❌ Classified as QUOTA_EXCEEDED');
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:65',message:'Classified as QUOTA_EXCEEDED',data:{errorMessage:msg},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return 'QUOTA_EXCEEDED';
  }
  if (msg.includes('404') || msg.includes('not found')) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:71',message:'Classified as MODEL_UNAVAILABLE',data:{errorMessage:msg},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return 'MODEL_UNAVAILABLE';
  }
  if (msg.includes('timeout') || msg.includes('network') || msg.includes('ECONNREFUSED')) {
    return 'NETWORK_ERROR';
  }
  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('API key')) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:80',message:'Classified as AUTH_ERROR',data:{errorMessage:msg},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return 'AUTH_ERROR';
  }
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:86',message:'Classified as UNKNOWN_ERROR',data:{errorMessage:msg},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  return 'UNKNOWN_ERROR';
}

/**
 * Generate unique error code
 */
function generateErrorCode(error: unknown): string {
  const type = classifyError(error);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${type}-${timestamp}-${random}`;
}

/**
 * Generate user-friendly error message
 */
function generateErrorMessage(errorType: ErrorType, errorCode: string): string {
  const messages: Record<ErrorType, string> = {
    QUOTA_EXCEEDED: "⚠️ Marking service quota exceeded.\n\nPlease try again in a few minutes.",
    MODEL_UNAVAILABLE: "⚠️ Marking model temporarily unavailable.\n\nPlease try again shortly.",
    NETWORK_ERROR: "⚠️ Unable to connect to marking service.\n\nPlease check your internet connection and try again.",
    AUTH_ERROR: "⚠️ Marking service authentication error.\n\nPlease contact support.",
    UNKNOWN_ERROR: "⚠️ Marking service temporarily unavailable.\n\nPlease try again in a few moments.",
  };
  
  return `${messages[errorType]}\n\nError code: ${errorCode}`;
}

/**
 * Build marking prompt with cognitive level context
 */
function buildMarkingPrompt(params: LLMMarkingRequest): string {
  const cognitiveDescriptions: Record<string, string> = {
    connection: "linking two concepts together",
    synthesis: "combining multiple ideas into coherent reasoning",
    hypothesis: "predicting or justifying beyond the text",
  };
  
  return `You are an expert electrical science educator marking a C&G 2365 Level 2 student answer.

QUESTION:
${params.questionText}

COGNITIVE LEVEL: ${params.cognitiveLevel || 'understanding'}
This question tests: ${cognitiveDescriptions[params.cognitiveLevel || 'understanding'] || 'understanding of concepts'}

MODEL ANSWER (for reference):
${params.modelAnswer}

STUDENT'S ANSWER:
${params.userAnswer}

MARKING INSTRUCTIONS:
1. Determine if the student demonstrates understanding of the core concept
2. Award credit for SEMANTIC correctness, not exact word matching
3. Students may use different terminology but still show understanding
4. Consider the cognitive level being tested
5. Be fair but maintain C&G 2365 Level 2 standards
6. Assess technical accuracy, not writing style

Respond with ONLY valid JSON in this exact format:
{
  "isCorrect": true or false,
  "score": 0.0 to 1.0,
  "feedback": "1-2 sentences maximum, following the template patterns below"
}

SCORING SCALE:
- 1.0: Fully demonstrates required understanding, technically accurate
- 0.8-0.9: Strong understanding, minor gaps or imprecision
- 0.6-0.7: Adequate understanding, meets minimum standard
- 0.4-0.5: Partial understanding, significant gaps
- 0.2-0.3: Minimal understanding, mostly incorrect
- 0.0-0.1: Incorrect, irrelevant, or no understanding demonstrated

PASSING THRESHOLD: Mark "isCorrect" as true if score >= 0.5

FEEDBACK TEMPLATES (USE EXACTLY THESE PATTERNS):

For CORRECT answers:
- "Correct. [One-sentence rule or causal explanation]"
- OR if vague but correct: "Correct. More precisely, [refined statement]."

For INCORRECT answers:
- Conceptual error: "Not quite. [Name the misconception]. [Point toward the correct concept WITHOUT stating the full answer]."
- Calculation error: "Incorrect. [Identify wrong step]. [Hint at the correct method WITHOUT giving the formula]."
- Near-miss: "Close, but not correct. [Wrong intuition]. [Point to what they should reconsider]."

CRITICAL RULES FOR INCORRECT ANSWERS:
- NEVER give the complete answer or full solution
- NEVER state the complete rule or formula
- POINT and GUIDE, don't TELL
- Name the misconception, then point toward the correct direction
- Example BAD: "Not quite. Voltage doesn't stay the same. In fact, voltage divides across components while current stays constant."
- Example GOOD: "Not quite. Voltage doesn't stay the same in series circuits. Consider what happens to voltage across each component."

OTHER STRICT RULES:
- Maximum 1-2 sentences
- NO praise words: "Excellent", "Perfect", "Amazing", "Well done", "Great"
- Use neutral tone: "Correct" not "Correct!"
- Confirm → compress → stop (no follow-up prompts)
- Focus on the core concept or rule, not encouragement`;
}

/**
 * Validate JSON response structure
 */
function validateMarkingResponse(parsed: unknown): void {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON response: not an object');
  }
  
  const obj = parsed as Record<string, unknown>;
  
  if (typeof obj.isCorrect !== 'boolean') {
    throw new Error('Invalid JSON response: isCorrect must be boolean');
  }
  
  if (typeof obj.score !== 'number' || obj.score < 0 || obj.score > 1) {
    throw new Error('Invalid JSON response: score must be number between 0 and 1');
  }
  
  if (typeof obj.feedback !== 'string' || obj.feedback.length === 0) {
    throw new Error('Invalid JSON response: feedback must be non-empty string');
  }
}

/**
 * Clamp value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Main LLM marking function with JSON structured output
 */
export async function llmMarkWithJSON(
  params: LLMMarkingRequest
): Promise<LLMMarkingResponse> {
  
  // #region agent log
  console.log('🔍 [DEBUG] llmMarkWithJSON called', {questionText:params.questionText.substring(0,50),hasUserAnswer:!!params.userAnswer,cognitiveLevel:params.cognitiveLevel});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:200',message:'llmMarkWithJSON called',data:{questionText:params.questionText,hasUserAnswer:!!params.userAnswer,cognitiveLevel:params.cognitiveLevel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // Initialize LLM client with fallback
  let client;
  try {
    client = await createLLMClientWithFallback();
  } catch (error) {
    throw new Error('AUTH_ERROR: LLM client not configured. Please check API key or Vertex AI configuration.');
  }
  
  // 1. Construct prompt with clear instructions
  const prompt = buildMarkingPrompt(params);
  
  // 2. Call LLM API with JSON response mode
  const modelName = getGeminiModelWithDefault();
  // #region agent log
  console.log('🔍 [DEBUG] About to call LLM API', {modelName:modelName,promptLength:prompt.length});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:217',message:'About to call LLM API',data:{modelName:modelName,promptLength:prompt.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  const model = client.getGenerativeModel({ 
    model: modelName,
    generationConfig: { 
      temperature: 0,  // Maximum consistency
      responseMimeType: 'application/json',
    }
  });
  
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    // #region agent log
    console.log('🔍 [DEBUG] Gemini API success', {responseLength:responseText.length,responsePreview:responseText.substring(0,100)});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:229',message:'Gemini API success',data:{responseLength:responseText.length,responsePreview:responseText.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // 3. Parse and validate JSON
    const parsed = JSON.parse(responseText);
    validateMarkingResponse(parsed);
    
    // 4. Return structured result
    return {
      isCorrect: parsed.isCorrect as boolean,
      score: clamp(parsed.score as number, 0, 1),
      feedback: parsed.feedback as string,
    };
  } catch (error) {
    // #region agent log
    console.error('🔍 [DEBUG] Gemini API error caught', {errorMessage:error instanceof Error?error.message:String(error),errorType:error?.constructor?.name,errorStack:error instanceof Error?error.stack?.substring(0,200):''});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:244',message:'Gemini API error caught',data:{errorMessage:error instanceof Error?error.message:String(error),errorType:error?.constructor?.name,errorString:JSON.stringify(error),fullError:error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    throw error;
  }
}

/**
 * Mark conceptual question using LLM with comprehensive error handling
 */
export async function markConceptualQuestion(
  questionText: string,
  modelAnswer: string,
  userAnswer: string,
  cognitiveLevel?: 'connection' | 'synthesis' | 'hypothesis'
): Promise<ExtendedMarkingResult> {
  
  // Basic validation
  if (!userAnswer || userAnswer.trim().length < 5) {
    return {
      isCorrect: false,
      score: 0,
      feedback: "Please provide a more detailed answer (at least 5 characters).",
      metadata: { markingStrategy: 'validation-failed' }
    };
  }
  
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:289',message:'Before llmMarkWithJSON call',data:{hasQuestionText:!!questionText,hasModelAnswer:!!modelAnswer,hasUserAnswer:!!userAnswer},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Primary: LLM marking
    const result = await llmMarkWithJSON({
      questionText,
      modelAnswer,
      userAnswer,
      cognitiveLevel,
    });
    
    // Get model name for metadata
    const modelName = getGeminiModelWithDefault();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:297',message:'After llmMarkWithJSON success',data:{hasResult:!!result,resultScore:result?.score,isModelNameDefined:typeof modelName !== 'undefined',modelName:modelName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:304-before',message:'Before constructing return object',data:{willAccessModelName:true,modelNameType:typeof modelName,modelNameValue:modelName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    return {
      isCorrect: result.isCorrect,
      score: result.score,
      feedback: result.feedback,
      metadata: {
        markingStrategy: 'llm-json',
        markedAt: new Date(),
        modelUsed: modelName,
      }
    };
    
  } catch (error) {
    // #region agent log
    console.error('🔍 [DEBUG] markConceptualQuestion error caught', {errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack?.substring(0,300):''});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:295',message:'markConceptualQuestion error caught',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack:'',errorType:error?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    // Service unavailable - inform user with error code
    const errorCode = generateErrorCode(error);
    const errorType = classifyError(error);
    
    // #region agent log
    console.log('🔍 [DEBUG] Error classified', {errorType,errorCode,originalErrorPreview:error instanceof Error?error.message.substring(0,100):String(error).substring(0,100)});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'llmMarkingService.ts:302',message:'Error classified',data:{errorType,errorCode,originalError:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    console.error('LLM marking service error:', {
      errorType,
      errorCode,
      error: error instanceof Error ? error.message : String(error),
    });
    
    return {
      isCorrect: false,
      score: 0,
      feedback: generateErrorMessage(errorType, errorCode),
      canRetry: true,
      serviceUnavailable: true,
      metadata: {
        markingStrategy: 'service-unavailable',
        errorCode,
        errorType,
        timestamp: new Date(),
      }
    };
  }
}
