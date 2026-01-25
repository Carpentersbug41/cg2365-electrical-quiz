import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel, getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { createLLMClientWithFallback } from '@/lib/llm/client';

// Initialize LLM client (will be created on first request with fallback support)
let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;
let modelName: string | null = null;

try {
  modelName = getGeminiModel();
} catch (error) {
  // Model name will be validated in the POST handler
  console.warn('GEMINI_MODEL not set:', error instanceof Error ? error.message : error);
}

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per IP

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Initialize LLM client if not already initialized
    if (!llmClientPromise) {
      llmClientPromise = createLLMClientWithFallback();
    }

    let client;
    try {
      client = await llmClientPromise;
    } catch (error) {
      return NextResponse.json(
        { error: 'Chat assistant is not configured. Please check API key or Vertex AI configuration.' },
        { status: 503 }
      );
    }

    // Check if model is configured
    if (!modelName) {
      try {
        modelName = getGeminiModel();
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'GEMINI_MODEL is not set in environment variables. Please set it in .env.local' },
          { status: 503 }
        );
      }
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, questionContext, contextType } = body;

    // Validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    if (!questionContext || !questionContext.questionText) {
      return NextResponse.json({ error: 'Invalid question context' }, { status: 400 });
    }

    // Determine if this is an assessment context (stricter mode)
    const isAssessment = contextType === 'assessment';

    // Prepare system prompt with question context
    let systemPrompt = `You are an educational tutor specializing in 2365 Electrical Installation qualifications.`;
    
    if (isAssessment) {
      systemPrompt += ` You are a quiz assistant helping students with electrical installation concepts.

CURRENT QUESTION:
"${questionContext.questionText}"

Options:
A) ${questionContext.options[0]}
B) ${questionContext.options[1]}
C) ${questionContext.options[2]}
D) ${questionContext.options[3]}

Category: ${questionContext.category}
Section: ${questionContext.section}

YOUR ROLE:
You are an ELECTRICAL SUBJECT MATTER EXPERT. You fully understand what this question is testing and you're here to TEACH the underlying electrical concepts, principles, and regulations that relate to this question.

COMMUNICATION STYLE:
- Use SIMPLE, PLAIN LANGUAGE - talk like a helpful colleague, not a textbook
- Keep responses SHORT and FOCUSED - aim for 100-150 words maximum
- Don't overcomplicate - your explanation should be SIMPLER than a textbook
- Get straight to the point - no long introductions or unnecessary detail
- Use everyday analogies when helpful

WHAT YOU SHOULD DO:
- Explain electrical concepts clearly and briefly
- Teach relevant regulations concisely
- Provide focused background knowledge
- Explain WHY things work (but keep it brief)
- Help them understand technical terms in simple words
- Answer their questions about the electrical/technical concepts directly

WHAT YOU SHOULD NOT DO:
- DO NOT write long, complicated explanations
- DO NOT just rephrase or clarify the wording of the question
- DO NOT act like a language tutor explaining grammar
- DO NOT directly state "The answer is A/B/C/D"
- DO NOT eliminate wrong options or narrow down choices
- DO NOT give step-by-step solutions that lead directly to the answer

EXAMPLE GOOD RESPONSES:
Student: "What's impedance?"
You: "Impedance is the total opposition to current flow in AC circuits. Think of it like resistance, but for AC. It combines resistance (from the wire) and reactance (from coils and capacitors). Measured in ohms, just like resistance."

Student: "I don't understand this question"
You: "This is asking about [concept]. Here's the key: [2-3 sentences explaining the core principle]. That's what you need to work this out."

REMEMBER: SHORT, SIMPLE, FOCUSED. You're a helpful expert, not a textbook.`;
    } else {
      systemPrompt += ` You are a quiz assistant helping students with electrical installation concepts.

CURRENT QUESTION:
"${questionContext.questionText}"

Options:
A) ${questionContext.options[0]}
B) ${questionContext.options[1]}
C) ${questionContext.options[2]}
D) ${questionContext.options[3]}

Category: ${questionContext.category}
Section: ${questionContext.section}

YOUR ROLE:
You are an ELECTRICAL SUBJECT MATTER EXPERT in teaching mode. You fully understand this question and can teach the concepts, provide answers, and explain WHY.

COMMUNICATION STYLE:
- Use SIMPLE, PLAIN LANGUAGE - talk like a helpful colleague
- Keep responses SHORT and FOCUSED - aim for 100-150 words maximum
- Don't overcomplicate - make it easy to understand
- Get straight to the point
- Use everyday analogies when helpful

WHAT YOU SHOULD DO:
- Explain electrical concepts, principles, and regulations clearly and briefly
- Answer their questions directly about the electrical concepts
- If asked for the answer, provide it WITH a brief explanation of WHY
- Help them understand the reasoning behind options (keep it concise)
- Use examples and analogies to clarify (but keep them short)

WHAT YOU SHOULD NOT DO:
- DO NOT write long, complicated explanations
- DO NOT just rephrase or explain the wording of the question
- DO NOT act like a language tutor

REMEMBER: SHORT, SIMPLE, FOCUSED. You're teaching ELECTRICAL CONCEPTS, not writing an essay.`;
    }

    // Initialize model
    console.log('🤖 [LLM Chat] Using Gemini model:', modelName);
    const model = client.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemPrompt,
    });

    // Generate response
    const result = await model.generateContent(message);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Model name used:', modelName);
    
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('API_KEY_INVALID')) {
        return NextResponse.json(
          { error: 'API key is invalid. Please check your configuration.' },
          { status: 500 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again in a moment.' },
          { status: 503 }
        );
      }
      if (error.message.includes('model') || error.message.includes('not found') || error.message.includes('404')) {
        return NextResponse.json(
          { error: `Model "${modelName}" is not available. Please check GEMINI_MODEL in .env.local. Error: ${error.message}` },
          { status: 503 }
        );
      }
      
      // Return the actual error message for debugging
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to connect to assistant. Please try again.' },
      { status: 500 }
    );
  }
}

