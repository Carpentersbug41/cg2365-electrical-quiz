/**
 * Marking API Endpoint
 * Uses LLM semantic evaluation for all module questions
 * Uses deterministic MCQ marking for quiz/diagnostic questions only
 */

import { NextRequest, NextResponse } from 'next/server';
import { seriesCircuitsQuestions } from '@/data/questions/seriesCircuitsQuestions';
import { MarkingRequest, MarkingResponse } from '@/lib/marking/types';
import { markMCQ } from '@/lib/marking/markingService';
import { markConceptualQuestion } from '@/lib/marking/llmMarkingService';
import { logMarkingRequest, logMarkingResponse, logMarkingError } from '@/lib/observability/loggingService';

export async function POST(request: NextRequest) {
  try {
    const body: MarkingRequest = await request.json();
    const { 
      questionId, 
      userAnswer, 
      answerType, 
      questionText: providedQuestionText,
      expectedAnswer: providedExpectedAnswer,
      cognitiveLevel
    } = body;

    // Log marking request
    logMarkingRequest(questionId, answerType || 'llm', {
      contextLessonId: 'module',
      isConceptual: true,
    });

    // Validation
    if (!questionId || userAnswer === undefined || userAnswer === null) {
      return NextResponse.json(
        { error: 'Missing required fields: questionId, userAnswer' },
        { status: 400 }
      );
    }

    // Check if this is an MCQ question from the Quiz component (diagnostic/quiz)
    if (answerType === 'mcq' && typeof userAnswer === 'number') {
      const question = seriesCircuitsQuestions.find(
        q => q.id.toString() === questionId.toString()
      );
      
      if (question) {
        const mcqResult = markMCQ(question, userAnswer);
        
        logMarkingResponse(
          questionId,
          mcqResult.isCorrect,
          mcqResult.misconceptionCode,
          {
            score: mcqResult.score,
            markingStrategy: 'mcq-deterministic',
          }
        );
        
        return NextResponse.json({
          isCorrect: mcqResult.isCorrect,
          score: mcqResult.score,
          feedback: mcqResult.feedback,
          userAnswer: String(userAnswer),
          expectedAnswer: mcqResult.expectedAnswer,
          misconceptionCode: mcqResult.misconceptionCode,
          detailedFeedback: mcqResult.detailedFeedback,
          suggestedNextAction: mcqResult.isCorrect ? 'continue' : 'retry',
          metadata: mcqResult.metadata,
        });
      }
      
      // MCQ question not found
      return NextResponse.json(
        { error: 'MCQ question not found in database' },
        { status: 404 }
      );
    }

    // All module questions use LLM marking
    if (!providedQuestionText || !providedExpectedAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields: questionText, expectedAnswer' },
        { status: 400 }
      );
    }

    const llmResult = await markConceptualQuestion(
      providedQuestionText,
      providedExpectedAnswer,
      typeof userAnswer === 'string' ? userAnswer : String(userAnswer),
      cognitiveLevel
    );

    // If service unavailable, return error response
    if (llmResult.serviceUnavailable) {
      return NextResponse.json({
        isCorrect: false,
        score: 0,
        feedback: llmResult.feedback,
        userAnswer: typeof userAnswer === 'string' ? userAnswer : String(userAnswer),
        expectedAnswer: providedExpectedAnswer,
        suggestedNextAction: 'retry',
        serviceUnavailable: true,
        canRetry: llmResult.canRetry,
        metadata: llmResult.metadata,
      });
    }

    // Log successful marking
    logMarkingResponse(
      questionId,
      llmResult.isCorrect,
      undefined,
      {
        score: llmResult.score,
        markingStrategy: 'llm-semantic',
        suggestedNextAction: llmResult.isCorrect ? 'continue' : 'retry',
      }
    );

    // Return successful result
    return NextResponse.json({
      isCorrect: llmResult.isCorrect,
      score: llmResult.score,
      feedback: llmResult.feedback,
      userAnswer: typeof userAnswer === 'string' ? userAnswer : String(userAnswer),
      expectedAnswer: providedExpectedAnswer,
      suggestedNextAction: llmResult.isCorrect ? 'continue' : 'retry',
      metadata: llmResult.metadata,
    });
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

