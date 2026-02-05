/**
 * API Route: Score Lesson with LLM
 * 
 * POST /api/score-lesson
 * Scores a lesson using LLM-based intelligent scoring (98/100 target)
 */

import { NextRequest, NextResponse } from 'next/server';
import { LLMScoringService } from '@/lib/generation/llmScoringService';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      );
    }

    // Load lesson file
    const lessonPath = path.join(
      process.cwd(),
      'src',
      'data',
      'lessons',
      `${lessonId}.json`
    );

    if (!fs.existsSync(lessonPath)) {
      return NextResponse.json(
        { error: `Lesson file not found: ${lessonId}` },
        { status: 404 }
      );
    }

    const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));

    // Create LLM client and generateWithRetry function for scoring
    const model = await createLLMClientWithFallback(getGeminiModelWithDefault());
    
    const generateWithRetry = async (
      systemPrompt: string,
      userPrompt: string,
      type: 'lesson' | 'quiz',
      maxRetries: number,
      attemptHigherLimit?: boolean,
      tokenLimit?: number
    ): Promise<string> => {
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] },
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: tokenLimit || 4000,
        },
      });
      
      return result.response.text();
    };

    // Score the lesson with LLM
    const scoringService = new LLMScoringService(generateWithRetry);
    const score = await scoringService.scoreLesson(lessonData);

    return NextResponse.json({
      success: true,
      lessonId,
      score,
    });
  } catch (error: any) {
    console.error('[score-lesson] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to score lesson',
      },
      { status: 500 }
    );
  }
}
