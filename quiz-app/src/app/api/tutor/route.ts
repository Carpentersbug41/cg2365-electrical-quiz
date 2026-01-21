/**
 * Tutor API Endpoint
 * Handles AI tutor interactions using Google Gemini
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPromptForMode, TUTOR_MODE_CONFIGS } from '@/lib/tutor/prompts';
import { formatLessonContextForLLM, validateGrounding, extractBlockReferences } from '@/lib/tutor/groundingService';
import { TutorRequest, TutorResponse, TutorMode, ContextType } from '@/lib/tutor/types';
import { applyContextBudget, logContextBudget, DEFAULT_CONTEXT_BUDGET } from '@/lib/tutor/contextBudgetService';
import { logTutorRequest, logTutorResponse, logTutorError, logGroundingFailure, logRateLimitExceeded } from '@/lib/observability/loggingService';
import { Block, OutcomesBlockContent } from '@/data/lessons/types';
import { getGeminiModel, getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { createLLMClientWithFallback, ChatHistoryEntry } from '@/lib/llm/client';

// Initialize LLM client (will be created on first request with fallback support)
let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;
let modelName: string | null = null;

try {
  modelName = getGeminiModel();
} catch (error) {
  // Model name will be validated in the POST handler
  console.warn('GEMINI_MODEL not set:', error instanceof Error ? error.message : error);
}

// Rate limiting store (in-memory)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

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

/**
 * Helper: Check if response is "substantive" (enough content to require grounding)
 */
function isSubstantiveResponse(response: string): boolean {
  const contentWithoutWhitespace = response.replace(/\s+/g, ' ');
  return contentWithoutWhitespace.length >= 120;
}

/**
 * Helper: Check if message is asking for answer without attempting
 */
function isAskingForAnswer(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const triggers = [
    'answer',
    'solution',
    'just tell',
    'work it out',
    'calculate for me',
    'give me the result',
  ];
  return triggers.some(trigger => lowerMessage.includes(trigger));
}

/**
 * Helper: Call LLM with given system instruction and message
 */
async function callLLM(
  client: Awaited<ReturnType<typeof createLLMClientWithFallback>>,
  modelName: string,
  systemInstruction: string,
  message: string,
  history: { role: string; content: string }[],
  temperature: number
): Promise<string> {
  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction,
  });

  const formattedHistory: ChatHistoryEntry[] = history.map(msg => ({
    role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      temperature,
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

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
        { error: 'Tutor is not configured. Please check API key or Vertex AI configuration.' },
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
      logRateLimitExceeded(ip, '/api/tutor');
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body: TutorRequest = await request.json();
    const { message, mode, contextType, lessonContext, questionContext, history, userProgress, blockIdsToInclude, currentPracticeBlockId } = body;

    // Log tutor request
    logTutorRequest(mode, lessonContext?.lessonId, blockIdsToInclude, {
      contextType,
      hasQuestionContext: !!questionContext,
      historyLength: history?.length || 0,
    });

    // Validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    if (!mode || !['teach', 'check', 'fix'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // GUARDRAIL 1B: Assessment Lock
    // In assessment context, only allow 'check' mode (prevents DevTools manipulation)
    if (contextType === 'assessment' && mode !== 'check') {
      return NextResponse.json(
        { error: 'Only "check" mode is allowed during assessments.' },
        { status: 400 }
      );
    }

    // GUARDRAIL 1C: Attempt-First
    // If learner hasn't attempted yet and is asking for answer, block it
    if (
      userProgress?.attemptsOnCurrentQuestion === 0 &&
      isAskingForAnswer(message)
    ) {
      const tutorResponse: TutorResponse = {
        response: "Have a go first — type your attempt.",
        metadata: {
          model: 'guardrail',
          responseTime: Date.now() - startTime,
        },
      };
      return NextResponse.json(tutorResponse);
    }

    // Get mode configuration
    const modeConfig = TUTOR_MODE_CONFIGS[mode as TutorMode];
    const systemPrompt = getPromptForMode(mode as TutorMode);

    // Build contextual prompt with grounding
    let contextualPrompt = systemPrompt;

    if (lessonContext) {
      // Apply context budget to manage token usage
      // Convert LessonContext blocks back to Block format for budget calculation
      const lessonBlocks = lessonContext.blocks.map((b, index) => ({
        id: b.id,
        type: b.type as 'outcomes' | 'vocab' | 'explanation' | 'worked-example' | 'guided-practice' | 'practice' | 'spaced-review' | 'diagram',
        content: {} as OutcomesBlockContent, // Placeholder - content already formatted in lessonContext
        order: index,
      })) as Block[];

      // Create a map of formatted contents
      const formattedContents = new Map<string, string>(
        lessonContext.blocks.map(b => [b.id, b.content])
      );

      // Apply budget
      const budgetResult = applyContextBudget(
        lessonBlocks,
        DEFAULT_CONTEXT_BUDGET,
        {
          blockIdsToInclude,
          currentPracticeBlockId,
          formattedBlockContents: formattedContents,
        }
      );

      // Log budget application
      logContextBudget(lessonContext.lessonId, budgetResult);

      // Create filtered lesson context with only selected blocks
      const filteredLessonContext = {
        ...lessonContext,
        blocks: lessonContext.blocks.filter(b => 
          budgetResult.selectedBlocks.some(sb => sb.id === b.id)
        ),
      };

      const lessonContextFormatted = formatLessonContextForLLM(filteredLessonContext);
      contextualPrompt += `\n\n${lessonContextFormatted}`;
    }

    if (questionContext) {
      contextualPrompt += `\n\nCURRENT QUESTION CONTEXT:
Question ID: ${questionContext.questionId}
Question: ${questionContext.questionText}
Category: ${questionContext.category}
Section: ${questionContext.section}
${questionContext.options ? `Options:\n${questionContext.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}` : ''}
${questionContext.tags ? `Tags: ${questionContext.tags.join(', ')}` : ''}`;
    }

    if (userProgress) {
      contextualPrompt += `\n\nLEARNER PROGRESS:
Attempts on current question: ${userProgress.attemptsOnCurrentQuestion}
${userProgress.lastAttemptWasCorrect !== undefined ? `Last attempt correct: ${userProgress.lastAttemptWasCorrect}` : ''}
${userProgress.identifiedMisconceptions ? `Identified misconceptions: ${userProgress.identifiedMisconceptions.join(', ')}` : ''}`;
    }

    // Initialize Gemini model
    console.log(`Using Gemini model: ${modelName}`);

    // Generate initial response
    let response = await callLLM(
      client,
      modelName,
      contextualPrompt,
      message,
      history || [],
      modeConfig.temperature
    );

    // GUARDRAIL 1A: Grounding Gate with Retry
    // If we have lesson context, response is substantive, but no block references, retry once
    let blockReferences: string[] = [];
    
    if (lessonContext) {
      blockReferences = extractBlockReferences(response);
      
      if (
        isSubstantiveResponse(response) &&
        blockReferences.length === 0
      ) {
        // Retry with stricter instruction
        logGroundingFailure(lessonContext.lessonId, 'No block references in substantive response', 1);
        
        const stricterPrompt = contextualPrompt + `\n\nREMINDER: You MUST cite at least one [block-id] in your response when explaining concepts from the lesson.`;
        
        response = await callLLM(
          client,
          modelName,
          stricterPrompt,
          message,
          history || [],
          modeConfig.temperature
        );
        
        blockReferences = extractBlockReferences(response);
        
        // If still no references after retry, return error requiring block selection
        if (blockReferences.length === 0) {
          logGroundingFailure(lessonContext.lessonId, 'No block references after retry');
          return NextResponse.json(
            {
              error: 'Please be more specific and point to a section of the lesson you\'d like help with.',
              requiresBlockSelection: true,
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate grounding (warn if invalid references, but don't block)
    if (lessonContext && blockReferences.length > 0) {
      const allowedBlockIds = lessonContext.blocks.map(b => b.id);
      const validation = validateGrounding(response, allowedBlockIds);
      
      if (!validation.isValid) {
        console.warn('Tutor made invalid block references:', validation.invalidReferences);
      }
    }

    // Build response
    const responseTime = Date.now() - startTime;
    const tutorResponse: TutorResponse = {
      response,
      blockReferences: blockReferences.length > 0 ? blockReferences : undefined,
      metadata: {
        model: modelName,
        responseTime,
      },
    };

    // Log successful response
    logTutorResponse(mode as TutorMode, responseTime, blockReferences, {
      model: modelName,
    });

    return NextResponse.json(tutorResponse);
  } catch (error) {
    console.error('Tutor API error:', error);
    console.error('Model name used:', modelName);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Log error
      logTutorError('unknown', error, { model: modelName });
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
      
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to connect to tutor. Please try again.' },
      { status: 500 }
    );
  }
}

