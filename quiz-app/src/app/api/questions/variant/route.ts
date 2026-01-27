/**
 * Question Variant API Endpoint
 * Returns a deterministic variant of a question for Fix mode retesting
 */

import { NextRequest, NextResponse } from 'next/server';
import { allTaggedQuestions } from '@/data/questions';
import { getQuestionVariant, hasVariants, getVariantMetadata } from '@/lib/questions/variantService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const attemptNumber = parseInt(searchParams.get('attemptNumber') || '1', 10);
    const metadataOnly = searchParams.get('metadataOnly') === 'true';

    if (!questionId) {
      return NextResponse.json(
        { error: 'Missing required parameter: questionId' },
        { status: 400 }
      );
    }

    // Find the original question
    const originalQuestion = allTaggedQuestions.find(
      q => q.id.toString() === questionId.toString()
    );

    if (!originalQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Return metadata only if requested
    if (metadataOnly) {
      const metadata = getVariantMetadata(originalQuestion);
      return NextResponse.json({
        questionId: originalQuestion.id,
        hasVariants: metadata.hasVariants,
        variantCount: metadata.variantCount,
        variantType: metadata.variantType,
      });
    }

    // Get a variant
    const variant = getQuestionVariant(
      originalQuestion,
      allTaggedQuestions,
      attemptNumber
    );

    if (!variant) {
      return NextResponse.json(
        { 
          error: 'No variants available for this question',
          fallback: 'use-original',
          originalQuestion: {
            id: originalQuestion.id,
            question: originalQuestion.question,
            answerType: originalQuestion.answerType,
          }
        },
        { status: 404 }
      );
    }

    // Return variant question
    return NextResponse.json({
      success: true,
      variant: {
        id: variant.id,
        question: variant.question,
        answerType: variant.answerType,
        correctAnswer: variant.correctAnswer,
        acceptableAnswers: variant.acceptableAnswers,
        options: variant.options, // For MCQ
        requiredUnits: variant.requiredUnits,
        tolerance: variant.tolerance,
        tags: variant.tags,
        learningOutcomeId: variant.learningOutcomeId,
        isVariant: true,
        originalQuestionId: originalQuestion.id,
        attemptNumber,
      },
    });
  } catch (error) {
    console.error('Variant API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Variant generation error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate variant' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // POST endpoint for batch variant requests (optional)
  try {
    const body = await request.json();
    const { questionIds, attemptNumber = 1 } = body;

    if (!questionIds || !Array.isArray(questionIds)) {
      return NextResponse.json(
        { error: 'Missing or invalid parameter: questionIds (array expected)' },
        { status: 400 }
      );
    }

    const variants = questionIds.map(questionId => {
      const originalQuestion = allTaggedQuestions.find(
        q => q.id.toString() === questionId.toString()
      );

      if (!originalQuestion) {
        return {
          questionId,
          error: 'Question not found',
        };
      }

      const variant = getQuestionVariant(
        originalQuestion,
        allTaggedQuestions,
        attemptNumber
      );

      if (!variant) {
        return {
          questionId,
          hasVariant: false,
          error: 'No variants available',
        };
      }

      return {
        questionId,
        hasVariant: true,
        variant: {
          id: variant.id,
          question: variant.question,
          answerType: variant.answerType,
          originalQuestionId: originalQuestion.id,
        },
      };
    });

    return NextResponse.json({
      success: true,
      variants,
    });
  } catch (error) {
    console.error('Batch variant API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Batch variant error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate variants' },
      { status: 500 }
    );
  }
}


