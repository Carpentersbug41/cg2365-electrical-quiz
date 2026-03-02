import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import { findLessonFile } from '@/lib/generation/lessonDetector';
import { createLLMClient } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { getCurriculumScopeFromHeaderOrReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

type VisualPromptRequestBody = {
  lessonId?: string;
  explanationBlockId?: string;
};

type LessonBlock = {
  id?: string;
  type?: string;
  content?: Record<string, unknown>;
};

type LessonFile = {
  title?: string;
  topic?: string;
  blocks?: LessonBlock[];
};

type GeneratedConcept = {
  conceptTitle: string;
  diagramPrompt: string;
  animationPrompt: string;
};

type GeneratedPayload = {
  concepts: GeneratedConcept[];
};

function cleanJsonText(text: string): string {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function toUniqueConcepts(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const normalized = value.trim().replace(/\s+/g, ' ');
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
    if (output.length >= 2) break;
  }
  return output;
}

function buildHeuristicConcepts(explanationText: string, lessonTitle: string): GeneratedPayload {
  const boldTerms = Array.from(explanationText.matchAll(/\*\*([^*]{3,80})\*\*/g)).map((match) => match[1]);
  const headingTerms = Array.from(explanationText.matchAll(/^#+\s+(.+)$/gm)).map((match) => match[1]);
  const sentenceCandidates = explanationText
    .split(/[\r\n]+/)
    .map((line) => line.replace(/^[*\-\d.\s]+/, '').trim())
    .filter((line) => line.length > 20 && line.length < 120);

  const chosen = toUniqueConcepts([...boldTerms, ...headingTerms, ...sentenceCandidates]).slice(0, 2);
  const fallback = chosen.length > 0 ? chosen : [lessonTitle];

  return {
    concepts: fallback.map((concept) => ({
      conceptTitle: concept,
      diagramPrompt: `Educational diagram of ${concept}. Minimal objects, simple labels, white background, clear arrows, no decorative detail.`,
      animationPrompt: `Short 10-second educational animation of ${concept}. One scene, simple labels, slow motion, no extra effects.`,
    })),
  };
}

function validatePayload(payload: unknown): GeneratedPayload | null {
  if (!payload || typeof payload !== 'object') return null;
  const conceptsRaw = (payload as { concepts?: unknown }).concepts;
  if (!Array.isArray(conceptsRaw)) return null;

  const concepts = conceptsRaw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const conceptTitle = (item as { conceptTitle?: unknown }).conceptTitle;
      const diagramPrompt = (item as { diagramPrompt?: unknown }).diagramPrompt;
      const animationPrompt = (item as { animationPrompt?: unknown }).animationPrompt;
      if (typeof conceptTitle !== 'string' || typeof diagramPrompt !== 'string') return null;
      return {
        conceptTitle: conceptTitle.trim(),
        diagramPrompt: diagramPrompt.trim(),
        animationPrompt:
          typeof animationPrompt === 'string' && animationPrompt.trim()
            ? animationPrompt.trim()
            : `Short 10-second educational animation of ${conceptTitle.trim()}. One scene, simple labels, no extra effects.`,
      };
    })
    .filter((item): item is GeneratedConcept => Boolean(item))
    .slice(0, 2);

  if (concepts.length === 0) return null;
  return { concepts };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VisualPromptRequestBody;
    const lessonId = body.lessonId?.trim();
    const explanationBlockId = body.explanationBlockId?.trim();
    const scope = getCurriculumScopeFromHeaderOrReferer(
      request.headers.get('x-course-prefix'),
      request.headers.get('referer')
    );

    if (!lessonId || !explanationBlockId) {
      return NextResponse.json(
        { success: false, error: 'lessonId and explanationBlockId are required.' },
        { status: 400 }
      );
    }

    if (!isLessonIdAllowedForScope(lessonId, scope)) {
      return NextResponse.json(
        { success: false, error: `Lesson ${lessonId} is not available in this curriculum scope.` },
        { status: 403 }
      );
    }

    const lessonFile = findLessonFile(lessonId);
    if (!lessonFile) {
      return NextResponse.json(
        { success: false, error: `Could not find lesson file for ${lessonId}.` },
        { status: 404 }
      );
    }

    const lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf8')) as LessonFile;
    const explanationBlock = (lesson.blocks ?? []).find(
      (block) => block.type === 'explanation' && block.id === explanationBlockId
    );

    const explanationText =
      explanationBlock &&
      explanationBlock.content &&
      typeof explanationBlock.content.content === 'string'
        ? explanationBlock.content.content
        : null;
    if (!explanationText) {
      return NextResponse.json(
        { success: false, error: `Explanation block ${explanationBlockId} was not found or has no content.` },
        { status: 404 }
      );
    }

    const lessonTitle =
      (typeof lesson.title === 'string' && lesson.title.trim()) || lessonId;
    const lessonTopic =
      (typeof lesson.topic === 'string' && lesson.topic.trim()) || lessonTitle;

    const prompt = [
      'You are generating admin-only visual concept prompts for an educational lesson.',
      'Read the explanation text and pick only the 1-2 highest-value concepts to visualize.',
      'Output strict JSON only with this shape:',
      '{"concepts":[{"conceptTitle":"...","diagramPrompt":"...","animationPrompt":"..."}]}',
      'Rules:',
      '- Keep prompts minimal and concrete.',
      '- Prefer simple, labeled educational diagrams.',
      '- The visual must be interactive or clickable where possible (for example hotspots, toggles, step buttons, or drag controls), while still making sense as a static fallback.',
      '- No decorative art style language.',
      '- Ensure conceptTitle is concise.',
      '- Return exactly 1 or 2 concepts.',
      '',
      `Lesson title: ${lessonTitle}`,
      `Lesson topic: ${lessonTopic}`,
      `Explanation block id: ${explanationBlockId}`,
      'Explanation text:',
      explanationText,
    ].join('\n');

    let generated: GeneratedPayload | null = null;
    let modelName = 'heuristic-fallback';

    try {
      modelName = getGeminiModelWithDefault();
      const client = createLLMClient();
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 900,
          responseMimeType: 'application/json',
        },
      });
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const parsed = JSON.parse(cleanJsonText(rawText)) as unknown;
      generated = validatePayload(parsed);
    } catch {
      generated = null;
    }

    if (!generated) {
      generated = buildHeuristicConcepts(explanationText, lessonTitle);
      modelName = 'heuristic-fallback';
    }

    return NextResponse.json({
      success: true,
      lessonId,
      explanationBlockId,
      model: modelName,
      concepts: generated.concepts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
