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
    errors?: string[];
    blueprintDebug?: {
      lessonId?: string;
      expectedRequiredBlockIds?: string[];
      actualBlockIds?: string[];
      missingRequiredBlockIds?: string[];
      checkPlacementIssues?: string[];
    };
    detailedError?: {
      name?: string;
      message?: string;
      stack?: string;
    };
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
  masterLessonBlueprint?: LessonBlueprint['masterBlueprint'];
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
    additionalInstructions:
      blueprint.acAnchors.length > 0
        ? `AC Anchors: ${blueprint.acAnchors.join(', ')}. Follow masterLessonBlueprint exactly; do not invent block structure.`
        : 'Follow masterLessonBlueprint exactly; do not invent block structure.',
    masterLessonBlueprint: blueprint.masterBlueprint,
  };
}

function resolveApiBaseUrl(options?: BlueprintGenerationOptions): string {
  const explicit = options?.apiBaseUrl;
  if (explicit && explicit.trim().length > 0) return explicit.replace(/\/$/, '');
  const envUrl = process.env.MODULE_PLANNER_BASE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim().length > 0) return envUrl.replace(/\/$/, '');
  return 'http://localhost:3000';
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLessonGeneratorWithRetry(
  url: string,
  init: RequestInit,
  attempts: number = 3
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, init);
      // Retry transient server failures.
      if (response.status >= 500 && response.status < 600 && attempt < attempts) {
        await sleep(400 * attempt);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await sleep(400 * attempt);
        continue;
      }
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : 'Unknown fetch failure during lesson generation';
  throw new Error(`Lesson generator request failed after ${attempts} attempts: ${message}`);
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
  const response = await fetchLessonGeneratorWithRetry(`${baseUrl}/api/lesson-generator`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  }, 4);

  let parsed: BlueprintGenerationResult['response'] | null = null;
  try {
    parsed = (await response.json()) as BlueprintGenerationResult['response'];
  } catch (error) {
    throw new Error(`Lesson generator returned non-JSON response for ${blueprint.id}`);
  }

  if (!response.ok || !parsed?.success) {
    const baseMessage = parsed?.error || `Lesson generation failed for ${blueprint.id} (status ${response.status})`;
    const details: string[] = [];

    if (Array.isArray(parsed?.errors) && parsed.errors.length > 0) {
      details.push(`validation: ${parsed.errors.slice(0, 8).join(' | ')}`);
    }
    if (parsed?.blueprintDebug) {
      const debug = parsed.blueprintDebug;
      if (Array.isArray(debug.missingRequiredBlockIds) && debug.missingRequiredBlockIds.length > 0) {
        details.push(`missingBlocks: ${debug.missingRequiredBlockIds.join(', ')}`);
      }
      if (Array.isArray(debug.checkPlacementIssues) && debug.checkPlacementIssues.length > 0) {
        details.push(`checkPlacement: ${debug.checkPlacementIssues.join(' | ')}`);
      }
    }
    if (parsed?.detailedError?.message) {
      details.push(`detail: ${parsed.detailedError.message}`);
    }

    const detailSuffix = details.length > 0 ? ` | ${details.join(' | ')}` : '';
    throw new Error(`${baseMessage}${detailSuffix}`);
  }

  return {
    lessonId: `${payload.unit}-${payload.lessonId}`,
    response: parsed,
  };
}
