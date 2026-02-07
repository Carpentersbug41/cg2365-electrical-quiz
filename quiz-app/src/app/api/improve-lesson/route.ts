/**
 * Improve Lesson API Route
 * Runs Phase 10 v2 refinement on an existing lesson
 */

import { NextRequest, NextResponse } from 'next/server';
import { getExistingLesson, findLessonFile } from '@/lib/generation/lessonDetector';
import { Phase10_Rewrite } from '@/lib/generation/phases/Phase10_Rewrite';
import { LLMScoringService } from '@/lib/generation/llmScoringService';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { GENERATION_LIMITS } from '@/lib/generation/constants';
import { validateLLMResponse, cleanCodeBlocks } from '@/lib/generation/utils';
import fs from 'fs';
import path from 'path';

interface ImproveRequest {
  lessonId: string;
}

interface ImproveResponse {
  success: boolean;
  lessonId: string;
  wasImproved: boolean;
  originalScore: number;
  finalScore: number;
  scoreDelta: number;
  validationFailures?: string[];
  debugInfo?: {
    prompts: { system: string; user: string };
    rawResponse: string;
    candidateLesson: any | null;
  };
  error?: string;
}

/**
 * Generate content with retry logic
 * Simplified version of FileGenerator.generateWithRetry for standalone use
 */
async function generateWithRetry(
  systemPrompt: string,
  userPrompt: string,
  type: 'lesson' | 'quiz' | 'phase' | 'score',
  maxRetries: number,
  attemptHigherLimit = false,
  currentTokenLimit?: number
): Promise<string> {
  let lastError: Error | undefined;
  const tokenLimit = currentTokenLimit || (attemptHigherLimit 
    ? GENERATION_LIMITS.MAX_TOKENS_RETRY 
    : GENERATION_LIMITS.MAX_TOKENS);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const client = await createLLMClientWithFallback();
      const model = client.getGenerativeModel({
        model: getGeminiModelWithDefault(),
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: tokenLimit,
        },
      });

      const result = await model.generateContent(userPrompt);
      
      // Extract response data
      const candidate = result.response.candidates?.[0];
      const finishReason = candidate?.finishReason;

      // Check for problematic finish reasons
      if (finishReason && finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
        throw new Error(
          `Generation stopped by API: ${finishReason}. ` +
          `This may indicate content policy violation or API issue.`
        );
      }

      const text = result.response.text();

      // Validate response
      const validation = validateLLMResponse(text);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid response from LLM');
      }

      const cleanedText = cleanCodeBlocks(text);

      console.log(`✅ Generation successful (attempt ${attempt + 1}/${maxRetries})`);
      console.log(`   Type: ${type}`);
      console.log(`   Tokens used: ${result.response.usageMetadata?.candidatesTokenCount?.toLocaleString() || 'unknown'} / ${tokenLimit.toLocaleString()}`);
      console.log(`   Response length: ${cleanedText.length.toLocaleString()} characters`);

      return cleanedText;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      console.error(`\n❌ Generation attempt ${attempt + 1}/${maxRetries} failed`);
      console.error(`   Error: ${lastError.message}`);
      
      if (attempt < maxRetries - 1) {
        console.log(`   🔄 Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  throw lastError || new Error('All generation attempts failed');
}

export async function POST(request: NextRequest) {
  try {
    const body: ImproveRequest = await request.json();

    // Validate request
    if (!body.lessonId) {
      return NextResponse.json(
        { success: false, error: 'Missing lessonId' },
        { status: 400 }
      );
    }

    const lessonId = body.lessonId;
    console.log(`\n🔧 [ImproveLesson] Starting improvement for ${lessonId}`);

    // Load existing lesson
    const originalLesson = getExistingLesson(lessonId);
    if (!originalLesson) {
      return NextResponse.json(
        { success: false, error: `Lesson ${lessonId} not found` },
        { status: 404 }
      );
    }

    console.log(`✅ [ImproveLesson] Loaded lesson: ${originalLesson.title}`);

    // Initialize scoring service
    const scorer = new LLMScoringService(generateWithRetry);

    // Score original lesson
    console.log(`📊 [ImproveLesson] Scoring original lesson...`);
    const originalScore = await scorer.scoreLesson(originalLesson);
    console.log(`📊 [ImproveLesson] Original score: ${originalScore.total}/100`);

    // Run Phase 10 v2 refinement
    console.log(`🔄 [ImproveLesson] Running Phase 10 v2 refinement...`);
    const phase10 = new Phase10_Rewrite();
    const result = await phase10.rewriteLesson(
      originalLesson,
      originalScore,
      generateWithRetry,
      scorer
    );

    // Prepare response
    const response: ImproveResponse = {
      success: true,
      lessonId,
      wasImproved: result.candidateLesson !== null,
      originalScore: originalScore.total,
      finalScore: result.scoreComparison?.candidate || originalScore.total,
      scoreDelta: result.scoreComparison?.delta || 0,
      validationFailures: result.validationFailures,
      debugInfo: {
        prompts: phase10.lastPrompts,
        rawResponse: phase10.lastRawResponse,
        candidateLesson: result.candidateLesson,
      },
    };

    // If improvement was made, save the improved lesson
    if (result.candidateLesson && result.scoreComparison && result.scoreComparison.delta > 0) {
      const lessonPath = findLessonFile(lessonId);
      if (lessonPath) {
        console.log(`💾 [ImproveLesson] Saving improved lesson to ${lessonPath}`);
        fs.writeFileSync(
          lessonPath,
          JSON.stringify(result.candidateLesson, null, 2),
          'utf-8'
        );
        console.log(`✅ [ImproveLesson] Lesson saved successfully`);
      } else {
        console.warn(`⚠️ [ImproveLesson] Could not find lesson file path to save`);
      }
    } else {
      console.log(`ℹ️ [ImproveLesson] No improvement made - original lesson retained`);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ [ImproveLesson] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
