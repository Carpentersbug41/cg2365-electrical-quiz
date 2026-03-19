import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import type { DynamicGuidedV2ChatResult, DynamicGuidedV2Lesson, DynamicGuidedV2Step, DynamicGuidedV2ThreadTurn } from '@/lib/dynamicGuidedV2/types';

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

function recentHistory(turns: DynamicGuidedV2ThreadTurn[]): string {
  return turns
    .slice(-6)
    .map((turn) => `${turn.role.toUpperCase()}: ${turn.text}`)
    .join('\n\n');
}

function truncateToTokens(text: string, maxTokens: number): string {
  const tokens = text.trim().split(/\s+/);
  if (tokens.length <= maxTokens) return text;
  return `${tokens.slice(0, maxTokens).join(' ')} ...`;
}

function historyPreview(turns: DynamicGuidedV2ThreadTurn[]): Array<{ role: string; text: string }> {
  return turns.slice(-6).map((turn) => ({
    role: turn.role,
    text: truncateToTokens(turn.text, 20),
  }));
}

function unescapeJsonString(value: string): string {
  return value
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}

function parseJsonResult(rawText: string): DynamicGuidedV2ChatResult | null {
  const match = rawText.match(/\{[\s\S]*\}/);
  const candidate = match?.[0] ?? rawText;

  try {
    const parsed = JSON.parse(candidate) as Partial<DynamicGuidedV2ChatResult>;
    if (typeof parsed.assistantMessage === 'string' && typeof parsed.advance === 'boolean') {
      return {
        assistantMessage: parsed.assistantMessage.trim(),
        advance: parsed.advance,
      };
    }
  } catch {
    // Fall through to tolerant extraction.
  }

  const messageMatch =
    candidate.match(/"assistantMessage"\s*:\s*"([\s\S]*?)"\s*,\s*"advance"/) ??
    candidate.match(/"assistantMessage"\s*:\s*"([\s\S]*?)"/);
  const advanceMatch = candidate.match(/"advance"\s*:\s*(true|false)/i);

  if (!messageMatch) return null;

  return {
    assistantMessage: unescapeJsonString(messageMatch[1]).trim(),
    advance: advanceMatch ? advanceMatch[1].toLowerCase() === 'true' : false,
  };
}

async function getClient() {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }
  return llmClientPromise;
}

export type DynamicGuidedV2DebugInfo = {
  stage: string;
  systemInstruction: string;
  prompt: string;
  conversationHistoryPreview: Array<{ role: string; text: string }>;
  rawText: string;
};

function buildSystemInstruction(lesson: DynamicGuidedV2Lesson, step: DynamicGuidedV2Step): string {
  const base = [
    `You are an expert in the ${lesson.subject} course.`,
    `You are teaching ${lesson.unit} only.`,
    'Teach naturally and clearly from the provided lesson context.',
    'Teach before testing.',
    'Use the lesson context as grounding, not as a script. Re-express it naturally in tutor language.',
    'Never ask about material that has not been taught yet.',
    'Do not mention prompts, JSON, retrieval, lesson blocks, or hidden system logic.',
    'Do not sound like a marker or evaluator.',
    'If the learner is basically correct, accept it naturally even if wording is imperfect.',
    'Keep the response concise and concrete.',
  ];

  if (step.role === 'guided_practice') {
    return [
      ...base,
      'You are now in guided practice.',
      'Do not reteach the whole topic unless the learner is lost.',
      'Help the learner apply what has already been taught with light scaffolding.',
      'If the learner is close, nudge them rather than restarting the explanation.',
      'Keep the learner moving through the task step by step.',
      'Return JSON only: {"assistantMessage":"...","advance":true|false}',
    ].join('\n');
  }

  if (step.stage === 'intro') {
    return [
      ...base,
      'You are now in the introduction phase.',
      'Welcome the learner and orient them to the lesson.',
      'Explain what they will cover and how the session will work.',
      'Do not start the main teaching chunk yet.',
    ].join('\n');
  }

  return [
    ...base,
    'You are now in the teaching and checking phase.',
    'Focus on one teachable idea at a time.',
    'Ask only about the material just taught in this step.',
    'Return JSON only: {"assistantMessage":"...","advance":true|false}',
  ].join('\n');
}

function buildTurnPrompt(params: {
  lesson: DynamicGuidedV2Lesson;
  step: DynamicGuidedV2Step;
  thread: DynamicGuidedV2ThreadTurn[];
  learnerMessage?: string;
}): string {
  const { lesson, step, thread, learnerMessage } = params;
  const sectionHeader = `Current attachment section: ${step.title} (${step.stage})`;
  const sectionRule = 'Use only the current attachment section below as the source of truth for this turn. Do not pull teaching points from later sections.';

  if (learnerMessage) {
    return [
      `Learner profile: ${lesson.audience}. ${lesson.tonePrompt}`,
      sectionHeader,
      sectionRule,
      `Attached lesson context:\n${step.retrievalText}`,
      recentHistory(thread) ? `Recent conversation:\n${recentHistory(thread)}` : '',
      `Learner reply: ${learnerMessage}`,
      step.role === 'guided_practice'
        ? 'Respond as a tutor during guided practice. If the learner is good enough to move on, set advance=true. Otherwise give one short scaffold and set advance=false.'
        : 'Reply like a tutor. If the learner has answered well enough, accept it naturally and set advance=true. If not, give one short correction or hint and set advance=false.',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  if (step.stage === 'intro') {
    return [
      `Learner profile: ${lesson.audience}. ${lesson.tonePrompt}`,
      sectionHeader,
      sectionRule,
      `Attached lesson context:\n${step.retrievalText}`,
      recentHistory(thread) ? `Recent conversation:\n${recentHistory(thread)}` : '',
      'Welcome the learner, introduce the outcomes naturally, and explain that the lesson will move through short teaching chunks with questions. End cleanly so the learner can continue.',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  return [
    `Learner profile: ${lesson.audience}. ${lesson.tonePrompt}`,
    sectionHeader,
    sectionRule,
    `Attached lesson context:\n${step.retrievalText}`,
    step.asset ? `Asset reference:\n${step.asset.title}\n${step.asset.description ?? ''}\n${step.asset.placeholderText ?? ''}` : '',
    recentHistory(thread) ? `Recent conversation:\n${recentHistory(thread)}` : '',
    step.role === 'guided_practice'
      ? 'Set up the guided practice naturally. Make the task clear, keep the scaffolding light, and end ready for the learner response. Set advance=false.'
      : step.completionMode === 'respond'
        ? 'Teach this part naturally, then ask the learner the next grounded question. Set advance=false.'
        : 'Teach this part naturally and end cleanly so the learner can continue. Set advance=true.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function generateDynamicGuidedV2Turn(params: {
  lesson: DynamicGuidedV2Lesson;
  step: DynamicGuidedV2Step;
  thread: DynamicGuidedV2ThreadTurn[];
  learnerMessage?: string;
}): Promise<DynamicGuidedV2ChatResult> {
  const result = await generateDynamicGuidedV2TurnWithDebug(params);
  return result.response;
}

export async function generateDynamicGuidedV2TurnWithDebug(params: {
  lesson: DynamicGuidedV2Lesson;
  step: DynamicGuidedV2Step;
  thread: DynamicGuidedV2ThreadTurn[];
  learnerMessage?: string;
}): Promise<{ response: DynamicGuidedV2ChatResult; debug: DynamicGuidedV2DebugInfo }> {
  const { lesson, step, thread, learnerMessage } = params;
  const client = await getClient();
  const systemInstruction = buildSystemInstruction(lesson, step);
  const model = client.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    systemInstruction,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 700,
      ...(step.stage === 'intro' ? {} : { responseMimeType: 'application/json' }),
    },
  });

  const prompt = buildTurnPrompt({ lesson, step, thread, learnerMessage });

  console.log('[dynamic-guided-v2] llm:request', {
    lessonCode: lesson.lessonCode,
    stepId: step.id,
    stage: step.stage,
    learnerMessage: learnerMessage ?? null,
    systemInstruction,
    conversationHistoryPreview: historyPreview(thread),
    prompt,
  });

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  console.log('[dynamic-guided-v2] llm:response_raw', {
    lessonCode: lesson.lessonCode,
    stepId: step.id,
    stage: step.stage,
    rawText,
  });

  if (step.stage === 'intro') {
    return {
      response: {
        assistantMessage: rawText.trim(),
        advance: true,
      },
      debug: {
        stage: step.stage,
        systemInstruction,
        prompt,
        conversationHistoryPreview: historyPreview(thread),
        rawText,
      },
    };
  }

  const parsed = parseJsonResult(rawText);
  if (parsed) {
    return {
      response: parsed,
      debug: {
        stage: step.stage,
        systemInstruction,
        prompt,
        conversationHistoryPreview: historyPreview(thread),
        rawText,
      },
    };
  }

  return {
    response: {
      assistantMessage: 'I lost the shape of that reply. Continue and I will restate it cleanly.',
      advance: step.completionMode === 'continue' && !learnerMessage,
    },
    debug: {
      stage: step.stage,
      systemInstruction,
      prompt,
      conversationHistoryPreview: historyPreview(thread),
      rawText,
    },
  };
}
