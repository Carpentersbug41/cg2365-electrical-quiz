import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { buildDynamicModulePlannerPrompt } from '@/lib/dynamicGuidedV2/planner/prompts';
import type {
  DynamicModulePlanRequest,
  DynamicModulePlannerBlueprint,
  DynamicModulePlannerDraft,
} from '@/lib/dynamicGuidedV2/planner/types';
import type { DynamicLessonStageDescriptor } from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGenerationPhaseArtifact } from '@/lib/dynamicGuidedV2/versionStore';

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

async function getClient() {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }
  return llmClientPromise;
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeWhitespace(text: unknown): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseJson<T>(rawText: string): T | null {
  const trimmed = rawText.trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  const candidate =
    firstBrace >= 0 && lastBrace > firstBrace ? trimmed.slice(firstBrace, lastBrace + 1) : trimmed;
  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}

function sanitizeLessonCode(input: string, index: number): string {
  const cleaned = normalizeWhitespace(input)
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || `DYN-${index + 1}`;
}

function fallbackUnit(moduleTitle: string): string {
  const match = moduleTitle.match(/\b(Unit\s+\d+[A-Z]?)\b/i);
  return match ? match[1] : 'Unit';
}

function buildStagePlan(blueprint: {
  lessonCode: string;
  topic: string;
  teachChecks: Array<{ title: string; objective: string }>;
}): DynamicLessonStageDescriptor[] {
  const teachChecks = blueprint.teachChecks.length > 0 ? blueprint.teachChecks.slice(0, 6) : [
    { title: 'Teach/Check 1', objective: `Teach the first core idea in ${blueprint.topic}.` },
    { title: 'Teach/Check 2', objective: `Teach the next core idea in ${blueprint.topic}.` },
    { title: 'Teach/Check 3', objective: `Teach the next distinct idea in ${blueprint.topic}.` },
    { title: 'Teach/Check 4', objective: `Teach the last core idea needed before application in ${blueprint.topic}.` },
  ];

  const stagePlan: DynamicLessonStageDescriptor[] = [
    {
      key: 'intro',
      title: 'Intro',
      role: 'outcomes',
      stage: 'intro',
      objective: `Orient the learner to ${blueprint.topic}.`,
      progressionRule: 'auto',
      completionMode: 'continue',
    },
    ...teachChecks.map((item, index) => ({
      key: `teach-check-${index + 1}`,
      title: normalizeWhitespace(item.title) || `Teach/Check ${index + 1}`,
      role: 'explanation' as const,
      stage: 'teach_check' as const,
      objective: normalizeWhitespace(item.objective) || `Teach concept ${index + 1} in ${blueprint.topic}.`,
      progressionRule: 'feedback_deeper' as const,
      completionMode: 'respond' as const,
    })),
  ];

  return stagePlan.map((step) => ({
    ...step,
    key: `${blueprint.lessonCode.toLowerCase()}-${step.key}`,
  }));
}

function coerceDraft(input: DynamicModulePlanRequest, raw: unknown): DynamicModulePlannerDraft {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const rawBlueprints = Array.isArray(data.blueprints) ? data.blueprints : [];
  const defaultFocusText = input.sourceText.length > 2500 ? `${input.sourceText.slice(0, 2500).trim()}...` : input.sourceText;
  const blueprints = rawBlueprints.length > 0 ? rawBlueprints : [
    {
      lessonCode: input.moduleTitle,
      title: input.moduleTitle,
      unit: fallbackUnit(input.moduleTitle),
      topic: input.moduleTitle,
      objectiveSummary: `Teach the main ideas in ${input.moduleTitle}.`,
      focusText: defaultFocusText,
      sourceRefs: input.sourceName ? [input.sourceName] : [],
      teachChecks: [
        { title: 'Teach/Check 1', objective: 'Teach the first core idea.' },
        { title: 'Teach/Check 2', objective: 'Teach the next core idea.' },
        { title: 'Teach/Check 3', objective: 'Teach the next distinct idea.' },
        { title: 'Teach/Check 4', objective: 'Teach the final core idea before application.' },
      ],
    },
  ];

  return {
    moduleTitle: normalizeWhitespace(data.moduleTitle) || input.moduleTitle,
    blueprints: blueprints.slice(0, Math.max(1, Math.min(input.requestedLessonCount ?? 3, 8))).map((item, index) => {
      const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      const teachChecksRaw = Array.isArray(record.teachChecks) ? record.teachChecks : [];
      const teachChecks = teachChecksRaw.slice(0, 6).map((entry, teachIndex) => {
        const value = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {};
        return {
          title: normalizeWhitespace(value.title) || `Teach/Check ${teachIndex + 1}`,
          objective: normalizeWhitespace(value.objective) || `Teach concept ${teachIndex + 1}.`,
        };
      });
      return {
        lessonCode: sanitizeLessonCode(String(record.lessonCode ?? record.title ?? input.moduleTitle), index),
        title: normalizeWhitespace(record.title) || `Lesson ${index + 1}`,
        unit: normalizeWhitespace(record.unit) || fallbackUnit(input.moduleTitle),
        topic: normalizeWhitespace(record.topic) || normalizeWhitespace(record.title) || `Topic ${index + 1}`,
        objectiveSummary:
          normalizeWhitespace(record.objectiveSummary) ||
          `Teach the core ideas in ${normalizeWhitespace(record.topic) || normalizeWhitespace(record.title) || `lesson ${index + 1}`}.`,
        focusText: normalizeWhitespace(record.focusText) || defaultFocusText,
        sourceRefs: Array.isArray(record.sourceRefs)
          ? record.sourceRefs.map((ref) => normalizeWhitespace(ref)).filter(Boolean)
          : input.sourceName
            ? [input.sourceName]
            : [],
        teachChecks,
      };
    }),
  };
}

function toBlueprints(draft: DynamicModulePlannerDraft): DynamicModulePlannerBlueprint[] {
  return draft.blueprints.map((blueprint, index) => {
    const lessonCode = sanitizeLessonCode(blueprint.lessonCode, index);
    return {
      id: lessonCode,
      lessonCode,
      title: normalizeWhitespace(blueprint.title) || lessonCode,
      unit: normalizeWhitespace(blueprint.unit) || 'Unit',
      topic: normalizeWhitespace(blueprint.topic) || normalizeWhitespace(blueprint.title) || lessonCode,
      objectiveSummary: normalizeWhitespace(blueprint.objectiveSummary),
      focusText: normalizeWhitespace(blueprint.focusText),
      sourceRefs: blueprint.sourceRefs.map((item) => normalizeWhitespace(item)).filter(Boolean),
      stagePlan: buildStagePlan({
        lessonCode,
        topic: normalizeWhitespace(blueprint.topic) || normalizeWhitespace(blueprint.title) || lessonCode,
        teachChecks: blueprint.teachChecks,
      }),
    };
  });
}

export async function planDynamicModule(input: DynamicModulePlanRequest): Promise<{
  moduleTitle: string;
  blueprints: DynamicModulePlannerBlueprint[];
  phaseArtifacts: DynamicGenerationPhaseArtifact[];
}> {
  const requestedLessonCount = Math.max(1, Math.min(Number(input.requestedLessonCount ?? 3), 8));
  const normalizedInput: DynamicModulePlanRequest = {
    moduleTitle: normalizeWhitespace(input.moduleTitle) || 'Dynamic Module',
    subject: normalizeWhitespace(input.subject) || 'C&G 2365',
    audience: normalizeWhitespace(input.audience) || 'Level 2 electrical learner',
    sourceName: normalizeWhitespace(input.sourceName) || null,
    sourceText: String(input.sourceText ?? '').trim(),
    requestedLessonCount,
  };

  if (!normalizedInput.sourceText) {
    throw new Error('sourceText is required to plan a dynamic module.');
  }

  const phases: DynamicGenerationPhaseArtifact[] = [];
  const startedAt = nowIso();
  const client = await getClient();
  const model = client.getGenerativeModel({
    model: getGeminiModelWithDefault('gemini-2.5-flash'),
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildDynamicModulePlannerPrompt({
    moduleTitle: normalizedInput.moduleTitle,
    subject: normalizedInput.subject ?? 'C&G 2365',
    audience: normalizedInput.audience ?? 'Level 2 electrical learner',
    requestedLessonCount,
    sourceText: normalizedInput.sourceText,
  });

  const llmResult = await model.generateContent(prompt);
  const rawText = llmResult.response.text();
  phases.push({
    phase: 'D1_plan_module_blueprints',
    status: 'completed',
    output: {
      prompt,
      rawText,
    },
    startedAt,
    finishedAt: nowIso(),
  });

  const parsed = parseJson<DynamicModulePlannerDraft>(rawText);
  const draft = coerceDraft(normalizedInput, parsed);
  const blueprints = toBlueprints(draft);

  phases.push({
    phase: 'D2_normalize_blueprints',
    status: 'completed',
    output: {
      moduleTitle: draft.moduleTitle,
      blueprintCount: blueprints.length,
      blueprintIds: blueprints.map((item) => item.id),
    },
    startedAt: nowIso(),
    finishedAt: nowIso(),
  });

  return {
    moduleTitle: draft.moduleTitle,
    blueprints,
    phaseArtifacts: phases,
  };
}
