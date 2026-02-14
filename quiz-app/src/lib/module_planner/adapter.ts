import { LessonBlueprint } from './types';

export interface BlueprintGenerationOptions {
  apiBaseUrl?: string;
}

export interface BlueprintGenerationResult {
  lessonId: string;
  response: {
    success: boolean;
    lessonFile?: string;
    quizFile?: string;
    commitHash?: string;
    commitUrl?: string;
    warnings?: string[];
    error?: string;
  };
}

const SECTION_BY_UNIT: Record<string, string> = {
  '201': 'Health and Safety 2365 Level 2',
  '202': 'Science 2365 Level 2',
  '203': 'Installation 2365 Level 2',
  '204': 'Wiring Systems 2365 Level 2',
  '210': 'Communication 2365 Level 2',
  '305': 'Advanced Safety 2365 Level 3',
};

interface ExistingLessonRequestPayload {
  unit: number;
  lessonId: string;
  topic: string;
  section: string;
  layout?: 'split-vis' | 'linear-flow';
  prerequisites?: string[];
  mustHaveTopics?: string;
  additionalInstructions?: string;
}

function toExistingLessonRequestPayload(blueprint: LessonBlueprint): ExistingLessonRequestPayload {
  const lessonId = blueprint.id.startsWith(`${blueprint.unit}-`)
    ? blueprint.id.slice(`${blueprint.unit}-`.length)
    : blueprint.id;

  return {
    unit: Number.parseInt(blueprint.unit, 10),
    lessonId,
    topic: blueprint.topic,
    section: SECTION_BY_UNIT[blueprint.unit] ?? `Unit ${blueprint.unit}`,
    layout: blueprint.layout,
    prerequisites: blueprint.prerequisites,
    mustHaveTopics: blueprint.mustHaveTopics.join('; '),
    additionalInstructions: blueprint.acAnchors.length > 0 ? `AC Anchors: ${blueprint.acAnchors.join(', ')}` : undefined,
  };
}

function resolveApiBaseUrl(options?: BlueprintGenerationOptions): string {
  const explicit = options?.apiBaseUrl;
  if (explicit && explicit.trim().length > 0) return explicit.replace(/\/$/, '');
  const envUrl = process.env.MODULE_PLANNER_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim().length > 0) return envUrl.replace(/\/$/, '');
  return 'http://localhost:3000';
}

export async function generateLessonFromBlueprint(
  blueprint: LessonBlueprint,
  options?: BlueprintGenerationOptions
): Promise<BlueprintGenerationResult> {
  const payload = toExistingLessonRequestPayload(blueprint);
  if (!Number.isFinite(payload.unit)) {
    throw new Error(`Invalid numeric unit in blueprint: ${blueprint.unit}`);
  }

  const baseUrl = resolveApiBaseUrl(options);
  const response = await fetch(`${baseUrl}/api/lesson-generator`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let parsed: BlueprintGenerationResult['response'] | null = null;
  try {
    parsed = (await response.json()) as BlueprintGenerationResult['response'];
  } catch (error) {
    throw new Error(`Lesson generator returned non-JSON response for ${blueprint.id}`);
  }

  if (!response.ok || !parsed?.success) {
    throw new Error(parsed?.error || `Lesson generation failed for ${blueprint.id} (status ${response.status})`);
  }

  return {
    lessonId: `${payload.unit}-${payload.lessonId}`,
    response: parsed,
  };
}

