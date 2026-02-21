/**
 * API Route: Score Lesson with LLM
 * 
 * POST /api/score-lesson
 * Scores a lesson using LLM-based intelligent scoring (98/100 target)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Phase10_Score } from '@/lib/generation/phases/Phase10_Score';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import fs from 'fs';
import path from 'path';

function resolveLessonPath(lessonId: string): string | null {
  const lessonsDir = path.join(process.cwd(), 'src', 'data', 'lessons');
  const exactPath = path.join(lessonsDir, `${lessonId}.json`);
  if (fs.existsSync(exactPath)) {
    return exactPath;
  }

  const prefix = `${lessonId}-`;
  const match = fs
    .readdirSync(lessonsDir)
    .find((name) => name.startsWith(prefix) && name.endsWith('.json'));

  return match ? path.join(lessonsDir, match) : null;
}

export async function POST(request: NextRequest) {
  try {
    const { lessonId, persist } = await request.json() as { lessonId?: string; persist?: boolean };

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      );
    }

    const lessonPath = resolveLessonPath(lessonId);

    if (!lessonPath) {
      return NextResponse.json(
        { error: `Lesson file not found: ${lessonId}` },
        { status: 404 }
      );
    }

    const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));

    // Create LLM client and generateWithRetry function for scoring
    const client = await createLLMClientWithFallback();
    
    const generateWithRetry = async (
      systemPrompt: string,
      userPrompt: string,
      type: 'lesson' | 'quiz' | 'phase' | 'score',
      maxRetries: number,
      attemptHigherLimit?: boolean,
      tokenLimit?: number,
      modelOverride?: string
    ): Promise<string> => {
      const model = client.getGenerativeModel({
        model: modelOverride || getGeminiModelWithDefault(),
      });
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

    // Score the lesson with Phase 10 (same scoring used by generation pipeline)
    const scorer = new Phase10_Score();
    const score = await scorer.scoreLesson(lessonData, generateWithRetry);

    if (persist) {
      const lessonRecord = lessonData as {
        metadata?: Record<string, unknown>;
      };
      const metadata = lessonRecord.metadata || {};
      metadata.generationScore = score.total;
      metadata.generationScoreDetails = {
        originalScore: score.total,
        finalScore: score.total,
        wasRefined: false,
        generatedAt: new Date().toISOString(),
        source: 'score-lesson-api',
      };
      lessonRecord.metadata = metadata;
      fs.writeFileSync(lessonPath, JSON.stringify(lessonRecord, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      lessonId,
      lessonPath,
      persisted: Boolean(persist),
      score,
    });
  } catch (error: unknown) {
    console.error('[score-lesson] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to score lesson';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
