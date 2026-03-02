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

type PromptContext = {
  components: string[];
  triggerEvent: string;
  outcomeEvent: string;
};

const GENERIC_CONCEPT_TITLES = new Set([
  'what this is',
  'why it matters',
  'key points',
  'key facts',
  'key facts / rules',
  'common mistakes',
  'quick recap',
  'coming up next',
  'in this lesson',
  'how to use it',
  'how to calculate it',
]);

const TECHNICAL_KEYWORDS = [
  'circuit',
  'current',
  'voltage',
  'power',
  'load',
  'heating',
  'thermostat',
  'switch',
  'fuse',
  'mcb',
  'rcd',
  'resistance',
  'series',
  'parallel',
  'control',
  'protection',
  'conductor',
  'live',
  'neutral',
  'earth',
];

const COMPONENT_PHRASES = [
  'consumer unit',
  'distribution board',
  'alarm panel',
  'alarm bell',
  'sounder',
  'sensor',
  'detector',
  'zone',
  'switch',
  'isolator',
  'thermostat',
  'heating element',
  'load',
  'fuse',
  'mcb',
  'rcd',
  'rcbo',
  'contactor',
  'relay',
  'live wire',
  'neutral wire',
  'earth wire',
  'open circuit',
  'closed circuit',
  'series circuit',
  'parallel circuit',
];

const EVENT_VERBS = ['open', 'close', 'activate', 'deactivate', 'trip', 'break', 'turn on', 'turn off', 'fault'];

function cleanJsonText(text: string): string {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function normalizeConceptTitle(value: string): string {
  return value.replace(/[*_`:#-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactSentence(text: string, maxChars: number): string {
  const cleaned = stripMarkdown(text).replace(/\s+/g, ' ').trim();
  if (!cleaned) return cleaned;
  const first = cleaned.split(/(?<=[.!?])\s+/)[0] ?? cleaned;
  if (first.length <= maxChars) return first.replace(/\.\.+/g, '.');
  const clipped = first.slice(0, maxChars);
  const lastSpace = clipped.lastIndexOf(' ');
  const safe = lastSpace > 50 ? clipped.slice(0, lastSpace) : clipped;
  return `${safe.replace(/[.,;:\s]+$/, '')}.`.replace(/\.\.+/g, '.');
}

function simplifyEventText(value: string): string {
  const plain = stripMarkdown(value)
    .replace(/\b(if|when)\b/gi, 'When')
    .replace(/\bwere connected\b/gi, 'is connected')
    .replace(/\bare connected\b/gi, 'is connected')
    .replace(/\bsuch as\b/gi, 'for example')
    .replace(/\s+/g, ' ')
    .trim();
  return compactSentence(plain, 120);
}

function toSentenceCase(value: string): string {
  const text = value.trim().replace(/\s+/g, ' ');
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildPromptContext(explanationText: string): PromptContext {
  const lower = explanationText.toLowerCase();
  const foundComponents = COMPONENT_PHRASES.filter((phrase) => lower.includes(phrase));
  const boldTerms = Array.from(explanationText.matchAll(/\*\*([^*]{3,80})\*\*/g))
    .map((match) => normalizeConceptTitle(match[1]).toLowerCase())
    .filter((term) => term.length >= 3);
  const merged = Array.from(new Set([...foundComponents, ...boldTerms]))
    .filter((term) => TECHNICAL_KEYWORDS.some((keyword) => term.includes(keyword)) || COMPONENT_PHRASES.includes(term))
    .slice(0, 6);

  const componentFallback = merged.length > 0
    ? merged
    : ['power source', 'switch', 'load', 'indicator/alarm'];

  const sentences = explanationText
    .split(/(?<=[.!?])\s+|[\r\n]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 20);

  const triggerSentence =
    sentences.find((line) => {
      const lineLower = line.toLowerCase();
      return /\bif\b|\bwhen\b/.test(lineLower) && EVENT_VERBS.some((verb) => lineLower.includes(verb));
    }) ??
    sentences.find((line) => EVENT_VERBS.some((verb) => line.toLowerCase().includes(verb))) ??
    'a switch or sensor state changes';

  const outcomeSentence =
    sentences.find((line) => /\btherefore\b|\bso\b|\bresult\b|\bcauses\b|\bturns on\b|\btrips\b/i.test(line)) ??
    'the circuit response is shown clearly with state labels';

  return {
    components: componentFallback.map((value) => toSentenceCase(value)),
    triggerEvent: simplifyEventText(triggerSentence),
    outcomeEvent: simplifyEventText(outcomeSentence),
  };
}

function getScenarioForConcept(conceptTitle: string, context: PromptContext): { trigger: string; outcome: string } {
  const lower = conceptTitle.toLowerCase();

  if (lower.includes('dedicated circuit')) {
    return {
      trigger: 'A high-power appliance is moved from a shared socket circuit to its own dedicated circuit.',
      outcome: 'Current stays within circuit limits and the protective device does not trip in normal operation.',
    };
  }

  if (lower.includes('high power') || lower.includes('overload') || lower.includes('load')) {
    return {
      trigger: 'A high-power appliance is connected to a standard socket circuit.',
      outcome: 'The fuse or MCB trips immediately to protect the circuit from overload.',
    };
  }

  return {
    trigger: context.triggerEvent,
    outcome: context.outcomeEvent,
  };
}

function enforceDiagramPromptStyle(conceptTitle: string, rawPrompt: string, context: PromptContext): string {
  const componentLine = context.components.slice(0, 3).join(', ');
  const scenario = getScenarioForConcept(conceptTitle, context);
  const generated = [
    `Create a simple 2D educational diagram showing ${conceptTitle}.`,
    `Show these objects explicitly: ${componentLine}.`,
    `Include one clickable element (hotspot/toggle/button) that demonstrates this event: ${scenario.trigger}`,
    `Show the resulting state clearly: ${scenario.outcome}`,
    'Use a clear left-to-right layout with labeled components and arrows for flow/current direction.',
    'Keep it minimal, flat, clean, and easy to understand, with basic icons and no unnecessary detail.',
  ].join(' ');
  return generated;
}

function enforceAnimationPromptStyle(conceptTitle: string, rawPrompt: string, context: PromptContext): string {
  const componentLine = context.components.slice(0, 3).join(', ');
  const scenario = getScenarioForConcept(conceptTitle, context);
  const generated = [
    `Create a short, simple 2D educational animation showing ${conceptTitle}.`,
    `First, show the normal setup with these components visible: ${componentLine}, with clear current/flow direction arrows.`,
    `Then trigger this change event: ${scenario.trigger}`,
    `Next, show the resulting circuit/system response: ${scenario.outcome}`,
    'Then highlight the key learning point with one short on-screen label and a clickable control to replay the state change.',
    'Keep it minimal, flat, clean, and easy to understand, with simple arrows, basic icons, and no unnecessary detail.',
  ].join(' ');
  return generated;
}

function isGenericConceptTitle(value: string): boolean {
  const normalized = normalizeConceptTitle(value).toLowerCase();
  if (!normalized) return true;
  if (GENERIC_CONCEPT_TITLES.has(normalized)) return true;
  if (normalized.length < 4) return true;
  if (/^(section|overview|introduction|summary)$/.test(normalized)) return true;
  return false;
}

function toUniqueConcepts(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const normalized = normalizeConceptTitle(value);
    if (!normalized) continue;
    if (isGenericConceptTitle(normalized)) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
    if (output.length >= 1) break;
  }
  return output;
}

function conceptSimilarityScore(a: string, b: string): number {
  const tokenise = (text: string): Set<string> =>
    new Set(
      normalizeConceptTitle(text)
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length >= 3)
    );
  const tokensA = tokenise(a);
  const tokensB = tokenise(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function dedupeConcepts(concepts: GeneratedConcept[]): GeneratedConcept[] {
  const output: GeneratedConcept[] = [];
  for (const concept of concepts) {
    const isDuplicate = output.some((existing) => {
      const titleOverlap = conceptSimilarityScore(existing.conceptTitle, concept.conceptTitle) >= 0.6;
      const sameDiagramCore =
        stripMarkdown(existing.diagramPrompt).toLowerCase().includes(stripMarkdown(concept.conceptTitle).toLowerCase()) ||
        stripMarkdown(concept.diagramPrompt).toLowerCase().includes(stripMarkdown(existing.conceptTitle).toLowerCase());
      const sameEvent =
        compactSentence(existing.animationPrompt, 220) === compactSentence(concept.animationPrompt, 220);
      return titleOverlap || (sameDiagramCore && sameEvent) || sameEvent;
    });
    if (isDuplicate) continue;
    output.push(concept);
    if (output.length >= 1) break;
  }
  return output;
}

function buildHeuristicConcepts(explanationText: string, lessonTitle: string, context: PromptContext): GeneratedPayload {
  const boldTerms = Array.from(explanationText.matchAll(/\*\*([^*]{3,120})\*\*/g)).map((match) => match[1]);
  const sentenceCandidates = explanationText
    .split(/(?<=[.!?])\s+|[\r\n]+/)
    .map((line) => line.replace(/^[*\-\d.\s]+/, '').trim())
    .filter((line) => line.length > 24 && line.length < 180);

  const technicalSentences = sentenceCandidates.filter((line) => {
    const lower = line.toLowerCase();
    return TECHNICAL_KEYWORDS.some((keyword) => lower.includes(keyword));
  });

  const sentenceDerivedTitles = technicalSentences.map((line) => {
    const compact = line
      .replace(/^(if|when|to|the|a|an)\s+/i, '')
      .replace(/\.$/, '');
    const words = compact.split(/\s+/).slice(0, 8);
    return words.join(' ');
  });

  const chosen = toUniqueConcepts([...boldTerms, ...sentenceDerivedTitles, ...technicalSentences]).slice(0, 1);
  const fallback = chosen.length > 0 ? chosen : [lessonTitle];

  return {
    concepts: fallback.map((concept) => ({
      conceptTitle: toSentenceCase(concept),
      diagramPrompt: enforceDiagramPromptStyle(
        toSentenceCase(concept),
        `Create a simple 2D educational diagram showing ${concept}.`,
        context
      ),
      animationPrompt: enforceAnimationPromptStyle(
        toSentenceCase(concept),
        `Create a short, simple 2D educational animation showing ${concept}.`,
        context
      ),
    })),
  };
}

function validatePayload(payload: unknown, context: PromptContext): GeneratedPayload | null {
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
      const normalizedTitle = normalizeConceptTitle(stripMarkdown(conceptTitle));
      if (isGenericConceptTitle(normalizedTitle)) return null;
      const finalTitle = toSentenceCase(normalizedTitle);
      return {
        conceptTitle: finalTitle,
        diagramPrompt: enforceDiagramPromptStyle(finalTitle, stripMarkdown(diagramPrompt.trim()), context),
        animationPrompt: enforceAnimationPromptStyle(
          finalTitle,
          typeof animationPrompt === 'string' && animationPrompt.trim()
            ? stripMarkdown(animationPrompt.trim())
            : `Create a short, simple 2D educational animation showing ${finalTitle}.`,
          context
        ),
      };
    })
    .filter((item): item is GeneratedConcept => Boolean(item))
    .slice(0, 1);

  if (concepts.length === 0) return null;
  const deduped = dedupeConcepts(concepts);
  return deduped.length > 0 ? { concepts: deduped } : null;
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
    const promptContext = buildPromptContext(explanationText);

    const prompt = [
      'You are generating admin-only visual concept prompts for an educational lesson.',
      'Read the explanation text and pick only the single highest-value concept to visualize.',
      'Output strict JSON only with this shape:',
      '{"concepts":[{"conceptTitle":"...","diagramPrompt":"...","animationPrompt":"..."}]}',
      'Rules:',
      '- Keep prompts minimal and concrete.',
      '- Prefer simple, labeled educational diagrams.',
      '- Each prompt must be self-contained. Assume the image model has zero lesson context.',
      `- Include concrete objects/components from the lesson text, for example: ${promptContext.components.slice(0, 5).join(', ')}.`,
      '- Include an explicit event sequence (normal state -> trigger change -> resulting state).',
      '- The visual must be interactive or clickable where possible (for example hotspots, toggles, step buttons, or drag controls), while still making sense as a static fallback.',
      '- Never use section headings as concepts (for example "What this is", "Why it matters", "Key points", "Quick recap").',
      '- animationPrompt MUST follow this structure: "Create a short, simple 2D educational animation ... First ... Then ... Next ... Then ... Keep it minimal ...".',
      '- diagramPrompt should follow this style: "Create a simple 2D educational diagram ... Keep it minimal ...".',
      '- No decorative art style language.',
      '- Ensure conceptTitle is concise.',
      '- Return exactly 1 concept.',
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
      const attempts = [prompt, `${prompt}\n\nReminder: return technical concepts only, not document headings.`];
      for (const attemptPrompt of attempts) {
        const result = await model.generateContent(attemptPrompt);
        const rawText = result.response.text();
        const parsed = JSON.parse(cleanJsonText(rawText)) as unknown;
        const validated = validatePayload(parsed, promptContext);
        if (validated) {
          generated = validated;
          break;
        }
      }
    } catch {
      generated = null;
    }

    if (!generated) {
      generated = buildHeuristicConcepts(explanationText, lessonTitle, promptContext);
      modelName = 'heuristic-fallback';
    }

    generated = { concepts: dedupeConcepts(generated.concepts).slice(0, 1) };

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
