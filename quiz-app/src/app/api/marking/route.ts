/**
 * Marking API Endpoint
 * Marks student answers using deterministic marking service
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { seriesCircuitsQuestions } from '@/data/questions/seriesCircuitsQuestions';
import { MarkingRequest, MarkingResponse, MarkingResult } from '@/lib/marking/types';
import { markNumeric, markShortText, markMCQ } from '@/lib/marking/markingService';
import lesson202_3A from '@/data/lessons/202-3A-series-circuits.json';
import { logMarkingRequest, logMarkingResponse, logMarkingError } from '@/lib/observability/loggingService';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const fallbackModelName = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Enhance feedback with LLM (optional enrichment only, not for correctness)
 * This is called AFTER deterministic marking to improve feedback wording
 */
async function enhanceFeedbackWithLLM(
  questionText: string,
  expectedAnswers: string[],
  userAnswer: string,
  deterministicResult: MarkingResult,
  questionContext?: string
): Promise<string> {
  if (!genAI) {
    // If LLM not available, return basic feedback from deterministic marker
    return deterministicResult.feedback;
  }

  const systemInstruction = `You are a helpful electrical tutor. The answer has already been marked as ${deterministicResult.isCorrect ? 'CORRECT' : 'INCORRECT'}.
Your job is ONLY to provide encouraging, clear feedback to the student. Speak directly using "you/your". Be friendly and concise.`;

  const misconceptionInfo = deterministicResult.misconceptionCode 
    ? `\nMisconception detected: ${deterministicResult.misconceptionCode}\nFix: ${deterministicResult.detailedFeedback?.howToFix || ''}`
    : '';

  const prompt = `Question: ${questionText}
Expected: ${expectedAnswers.join(' or ')}
Student answer: ${userAnswer}
Result: ${deterministicResult.isCorrect ? 'CORRECT' : 'INCORRECT'}
Score: ${deterministicResult.score}${misconceptionInfo}

Write brief, encouraging feedback for the student (2-3 sentences max). ${deterministicResult.isCorrect ? 'Celebrate their success.' : 'Help them understand what went wrong without giving the full solution.'}`;

  try {
    // Try primary model
    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: unknown) {
    // If quota exceeded, try fallback model
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
      console.log(`⚠️  Primary model (${modelName}) quota exceeded for feedback, trying fallback: ${fallbackModelName}`);
      
      try {
        const fallbackModel = genAI.getGenerativeModel({ 
          model: fallbackModelName, 
          systemInstruction 
        });
        const result = await fallbackModel.generateContent(prompt);
        return result.response.text();
      } catch (fallbackError) {
        console.warn('Fallback model failed for feedback enhancement, using deterministic feedback:', fallbackError);
        // Return basic deterministic feedback
        return deterministicResult.feedback;
      }
    } else {
      console.warn('LLM feedback enhancement failed, using deterministic feedback:', error);
      // Return basic deterministic feedback
      return deterministicResult.feedback;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MarkingRequest = await request.json();
    const { questionId, userAnswer, answerType, validationConfig, context, expectedAnswers: providedExpectedAnswers } = body;

    // Log marking request
    logMarkingRequest(questionId, answerType || 'unknown', {
      hasValidationConfig: !!validationConfig,
      contextLessonId: context?.lessonId,
    });

    // Validation
    if (!questionId || userAnswer === undefined || userAnswer === null) {
      return NextResponse.json(
        { error: 'Missing required fields: questionId, userAnswer' },
        { status: 400 }
      );
    }

    let questionText: string;
    let expectedAnswers: string[];
    let questionContext: string | undefined;
    let questionType: string;

    // Try to find question in question banks (for quiz questions)
    const question = seriesCircuitsQuestions.find(
      q => q.id.toString() === questionId.toString()
    );

    if (question) {
      // Question found in question bank
      questionText = question.question;
      expectedAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.map(String)
        : question.acceptableAnswers || [String(question.correctAnswer)];
      questionContext = question.section; // Use section from question
      questionType = question.answerType || 'short-text';
    } else {
      // Check if it's a practice question from lesson
      const practiceBlock = lesson202_3A.blocks.find((block: { type: string }) => block.type === 'practice');
      const practiceQuestion = practiceBlock?.content?.questions?.find((q: unknown) => typeof q === 'object' && q !== null && 'id' in q && (q as { id: string }).id === questionId);
      
      if (practiceQuestion && typeof practiceQuestion === 'object') {
        // Practice question found
        questionText = practiceQuestion.questionText;
        expectedAnswers = providedExpectedAnswers || practiceQuestion.expectedAnswer;
        questionContext = 'practice';
        questionType = practiceQuestion.answerType || answerType || 'short-text';
      } else {
        // Check if it's a guided practice question
        const guidedBlock = lesson202_3A.blocks.find((block: { type: string }) => block.type === 'guided-practice');
        const step = guidedBlock?.content?.steps?.find((s: { prompt?: string; description?: string; stepNumber: number }) => 
          (s.prompt && s.prompt === questionId) || 
          (s.description && s.description === questionId) ||
          s.stepNumber.toString() === questionId.toString()
        );
        
        if (step) {
          questionText = (step as { prompt?: string; description?: string }).prompt || (step as { prompt?: string; description?: string }).description || questionId;
          expectedAnswers = (step as { expectedAnswer?: string[] }).expectedAnswer || validationConfig?.requiredKeywords || ['any answer'];
          questionContext = 'guided-practice';
          questionType = answerType || 'short-text';
        } else {
          // Question not found - fallback
          questionText = questionId;
          expectedAnswers = providedExpectedAnswers || validationConfig?.requiredKeywords || ['any answer'];
          questionContext = context?.lessonId || 'general';
          questionType = answerType || 'short-text';
        }
      }
    }

    // STEP 1: Deterministic marking (authoritative correctness + misconception detection)
    let deterministicResult: MarkingResult;
    
    if (questionType === 'mcq' && typeof userAnswer === 'number') {
      // MCQ marking
      const question = seriesCircuitsQuestions.find(
        q => q.id.toString() === questionId.toString()
      );
      if (question) {
        deterministicResult = markMCQ(question, userAnswer);
      } else {
        // Fallback for unknown MCQ
        deterministicResult = {
          isCorrect: false,
          score: 0,
          userAnswer: String(userAnswer),
          expectedAnswer: expectedAnswers,
          feedback: '✗ Question not found in database.',
          metadata: {
            markedAt: new Date(),
            markingStrategy: 'error',
          },
        };
      }
    } else if (questionType === 'numeric') {
      // Numeric marking with tolerance
      deterministicResult = markNumeric(
        typeof userAnswer === 'string' ? userAnswer : String(userAnswer),
        expectedAnswers,
        validationConfig
      );
    } else {
      // Short text marking
      deterministicResult = markShortText(
        typeof userAnswer === 'string' ? userAnswer : String(userAnswer),
        expectedAnswers,
        validationConfig
      );
    }

    // STEP 2: Optionally enhance feedback with LLM (non-critical, can fail gracefully)
    let enhancedFeedback: string = deterministicResult.feedback;
    
    try {
      enhancedFeedback = await enhanceFeedbackWithLLM(
        questionText,
        expectedAnswers,
        typeof userAnswer === 'string' ? userAnswer : String(userAnswer),
        deterministicResult,
        questionContext
      );
    } catch (error) {
      console.warn('LLM feedback enhancement failed, using deterministic feedback:', error);
      // Keep using deterministicResult.feedback (already set above)
    }

    // Determine next action
    const suggestedNextAction: 'continue' | 'retry' | 'review' | 'fix' = 
      deterministicResult.isCorrect ? 'continue' : 
      deterministicResult.misconceptionCode ? 'fix' : 'retry';

    // Build response (correctness from deterministic, feedback optionally enhanced)
    const response: MarkingResponse = {
      isCorrect: deterministicResult.isCorrect, // AUTHORITATIVE from deterministic marker
      score: deterministicResult.score,
      feedback: enhancedFeedback, // Enhanced by LLM if available, else deterministic
      userAnswer: typeof userAnswer === 'string' ? userAnswer : String(userAnswer),
      expectedAnswer: expectedAnswers,
      misconceptionCode: deterministicResult.misconceptionCode,
      detailedFeedback: deterministicResult.detailedFeedback,
      partialCredit: deterministicResult.partialCredit,
      suggestedNextAction,
      metadata: {
        markedAt: new Date(),
        markingStrategy: 'deterministic-primary',
        feedbackEnhanced: enhancedFeedback !== deterministicResult.feedback,
      },
    };

    // Log marking response
    logMarkingResponse(
      questionId,
      deterministicResult.isCorrect,
      deterministicResult.misconceptionCode,
      {
        score: deterministicResult.score,
        feedbackEnhanced: enhancedFeedback !== deterministicResult.feedback,
        suggestedNextAction,
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Marking API error:', error);
    
    if (error instanceof Error) {
      logMarkingError('unknown', error);
      return NextResponse.json(
        { error: `Marking error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to mark answer' },
      { status: 500 }
    );
  }
}

