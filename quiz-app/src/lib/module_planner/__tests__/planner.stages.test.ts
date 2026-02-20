import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/module_planner/adapter', () => {
  return {
    generateLessonFromBlueprint: vi.fn(async (blueprint: { id: string }) => ({
      lessonId: blueprint.id,
      response: { success: true },
    })),
  };
});

vi.mock('@/lib/config/geminiConfig', () => {
  return {
    getGeminiApiKey: vi.fn(() => 'test-key'),
    getGeminiModelWithDefault: vi.fn(() => 'gemini-test'),
  };
});

vi.mock('@/lib/llm/client', () => {
  return {
    createLLMClient: vi.fn(() => ({
      getGenerativeModel: () => ({
        generateContent: async (prompt: string) => {
          const parsed = JSON.parse(prompt);
          const coverage = parsed.canonicalCoverage as {
            unit: string;
            los: Array<{ lo: string; coverageTargets: Array<{ acKey: string; acText: string }> }>;
          };
          const maxAcsPerLesson = Number(parsed?.constraints?.maxAcsPerLesson ?? 12);
          const output = {
            unit: coverage.unit,
            los: coverage.los.map((loGroup) => ({
              lo: loGroup.lo,
              lessonCount: Math.max(1, Math.ceil(loGroup.coverageTargets.length / Math.max(1, maxAcsPerLesson))),
              lessons: Array.from(
                { length: Math.max(1, Math.ceil(loGroup.coverageTargets.length / Math.max(1, maxAcsPerLesson))) },
                (_, idx) => {
                  const start = idx * Math.max(1, maxAcsPerLesson);
                  const end = start + Math.max(1, maxAcsPerLesson);
                  const chunk = loGroup.coverageTargets.slice(start, end);
                  const letter = String.fromCharCode(65 + idx);
                  return {
                    topicCode: `${loGroup.lo.replace(/^LO/i, '')}${letter}`,
                    title: chunk[0]?.acText ?? `${loGroup.lo} Lesson ${idx + 1}`,
                    coversAcKeys: chunk.map((target) => target.acKey),
                    whySplit: idx > 0 ? 'Split by test constraint' : null,
                  };
                }
              ),
            })),
          };

          return {
            response: {
              text: () => JSON.stringify(output),
            },
          };
        },
      }),
    })),
  };
});

import {
  createPlannerRun,
  ensureM2UsesStoredChunks,
  getPlannerRunSummary,
  runM0Distill,
  runM1Analyze,
  runM2Coverage,
  runM3Plan,
  runM4Blueprints,
  runM5Validate,
  runM6GenerateLesson,
  runM6Generate,
} from '@/lib/module_planner/planner';
import { generateLessonFromBlueprint } from '@/lib/module_planner/adapter';
import { clearModulePlannerDbForTests } from '@/lib/module_planner/db';
import { seedLegacyChunksAsDefaultVersionIfNeeded } from '@/lib/module_planner/syllabus';

describe('module planner stages', () => {
  beforeEach(async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await clearModulePlannerDbForTests();
  });

  it('runs M0-M5 with deterministic replay from request hash', async () => {
    const syllabusVersionId = await seedLegacyChunksAsDefaultVersionIfNeeded();
    expect(syllabusVersionId).toBeTruthy();

    const runA = await createPlannerRun({
      syllabusVersionId: String(syllabusVersionId),
      unit: '202',
      chatTranscript: 'Please plan LO1 and LO5 in a concise sequence.',
    });

    const m0a = await runM0Distill(
      runA.id,
      {
        syllabusVersionId: String(syllabusVersionId),
        unit: '202',
        selectedLos: ['LO1', 'LO5'],
        constraints: {
          minimiseLessons: true,
          defaultMaxLessonsPerLO: 2,
          maxAcsPerLesson: 12,
          preferredAcsPerLesson: 12,
          maxLessonsOverrides: { LO1: 3 },
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'Deterministic replay test',
      },
      { replayFromArtifacts: false }
    );
    const m1a = await runM1Analyze(runA.id, { replayFromArtifacts: false });
    const m2a = await runM2Coverage(runA.id, { replayFromArtifacts: false });
    const m3a = await runM3Plan(runA.id, { replayFromArtifacts: false });
    const m4a = await runM4Blueprints(runA.id, { replayFromArtifacts: false });
    const m5a = await runM5Validate(runA.id, { replayFromArtifacts: false });

    expect(m0a.artifact.unit).toBe('202');
    expect(m1a.artifact.unit).toBe('202');
    expect(m2a.artifact.unit).toBe('202');
    expect(m3a.artifact.unit).toBe('202');
    expect(Array.isArray(m4a.artifact)).toBe(true);
    expect(m5a.artifact.valid).toBe(true);
    const summaryA = await getPlannerRunSummary(runA.id);
    const storedM4 = summaryA.artifacts.find((artifact) => artifact.stage === 'M4')?.artifact_json as
      | {
          blueprints?: unknown[];
          loBlueprintSets?: Array<{ lo: string; generatedBy: string; blueprints: unknown[] }>;
          loLedgers?: Array<{ lo: string; ledger: unknown }>;
          lessonLedgerMetadata?: Array<{ lessonId: string; lo: string }>;
        }
      | undefined;
    expect(Array.isArray(storedM4?.blueprints)).toBe(true);
    expect(Array.isArray(storedM4?.loBlueprintSets)).toBe(true);
    expect(storedM4?.loBlueprintSets?.every((set) => Array.isArray(set.blueprints))).toBe(true);
    expect(Array.isArray(storedM4?.loLedgers)).toBe(true);
    expect(Array.isArray(storedM4?.lessonLedgerMetadata)).toBe(true);
    expect(summaryA.lessons.length).toBeGreaterThan(0);
    expect(summaryA.lessons.every((row) => row.status === 'planned')).toBe(true);
    await ensureM2UsesStoredChunks(runA.id);

    const runB = await createPlannerRun({
      syllabusVersionId: String(syllabusVersionId),
      unit: '202',
      chatTranscript: 'Please plan LO1 and LO5 in a concise sequence.',
    });

    await runM0Distill(
      runB.id,
      {
        syllabusVersionId: String(syllabusVersionId),
        unit: '202',
        selectedLos: ['LO1', 'LO5'],
        constraints: {
          minimiseLessons: true,
          defaultMaxLessonsPerLO: 2,
          maxAcsPerLesson: 12,
          preferredAcsPerLesson: 12,
          maxLessonsOverrides: { LO1: 3 },
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'Deterministic replay test',
      },
      { replayFromArtifacts: false }
    );

    const m1b = await runM1Analyze(runB.id, { replayFromArtifacts: true });
    const m2b = await runM2Coverage(runB.id, { replayFromArtifacts: true });
    const m3b = await runM3Plan(runB.id, { replayFromArtifacts: true });
    const m4b = await runM4Blueprints(runB.id, { replayFromArtifacts: true });
    const m5b = await runM5Validate(runB.id, { replayFromArtifacts: true });

    expect(m1b.replayed).toBe(true);
    expect(m2b.replayed).toBe(true);
    expect(m3b.replayed).toBe(true);
    expect(m4b.replayed).toBe(true);
    expect(m5b.replayed).toBe(true);

    expect(m1b.artifact).toEqual(m1a.artifact);
    expect(m2b.artifact).toEqual(m2a.artifact);
    expect(m3b.artifact).toEqual(m3a.artifact);
    expect(m4b.artifact).toEqual(m4a.artifact);
    expect(m5b.artifact).toEqual(m5a.artifact);
  });

  it('runs M6 and stores generation summary', async () => {
    const syllabusVersionId = await seedLegacyChunksAsDefaultVersionIfNeeded();
    expect(syllabusVersionId).toBeTruthy();

    const run = await createPlannerRun({
      syllabusVersionId: String(syllabusVersionId),
      unit: '202',
      chatTranscript: 'Build LO5 only',
    });

    await runM0Distill(
      run.id,
      {
        syllabusVersionId: String(syllabusVersionId),
        unit: '202',
        selectedLos: ['LO5'],
        constraints: {
          minimiseLessons: true,
          defaultMaxLessonsPerLO: 2,
          maxAcsPerLesson: 12,
          preferredAcsPerLesson: 12,
          maxLessonsOverrides: {},
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'M6 test',
      },
      { replayFromArtifacts: false }
    );
    await runM1Analyze(run.id, { replayFromArtifacts: false });
    await runM2Coverage(run.id, { replayFromArtifacts: false });
    await runM3Plan(run.id, { replayFromArtifacts: false });
    await runM4Blueprints(run.id, { replayFromArtifacts: false });
    await runM5Validate(run.id, { replayFromArtifacts: false });

    const m6 = await runM6Generate(run.id, {
      replayFromArtifacts: false,
      apiBaseUrl: 'http://localhost:3000',
    });

    expect(m6.artifact.generated).toBeGreaterThan(0);
    expect(m6.artifact.failed).toBe(0);
    expect(m6.artifact.lessonIds.length).toBe(m6.artifact.generated);

    const summary = await getPlannerRunSummary(run.id);
    expect(summary.lessons.every((row) => row.status === 'success')).toBe(true);
  });

  it('dedupes concurrent single-lesson generation requests for the same run/blueprint', async () => {
    const syllabusVersionId = await seedLegacyChunksAsDefaultVersionIfNeeded();
    expect(syllabusVersionId).toBeTruthy();

    const run = await createPlannerRun({
      syllabusVersionId: String(syllabusVersionId),
      unit: '202',
      chatTranscript: 'Build LO5 only',
    });

    await runM0Distill(
      run.id,
      {
        syllabusVersionId: String(syllabusVersionId),
        unit: '202',
        selectedLos: ['LO5'],
        constraints: {
          minimiseLessons: true,
          defaultMaxLessonsPerLO: 2,
          maxAcsPerLesson: 12,
          preferredAcsPerLesson: 12,
          maxLessonsOverrides: {},
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'M6 single lesson dedupe test',
      },
      { replayFromArtifacts: false }
    );
    await runM1Analyze(run.id, { replayFromArtifacts: false });
    await runM2Coverage(run.id, { replayFromArtifacts: false });
    await runM3Plan(run.id, { replayFromArtifacts: false });
    const m4 = await runM4Blueprints(run.id, { replayFromArtifacts: false });
    await runM5Validate(run.id, { replayFromArtifacts: false });

    const m4Artifact = m4.artifact as unknown as
      | Array<{ id: string }>
      | { blueprints?: Array<{ id: string }> };
    const blueprints = Array.isArray(m4Artifact) ? m4Artifact : (m4Artifact.blueprints ?? []);
    const blueprintId = blueprints[0]?.id;
    expect(blueprintId).toBeTruthy();

    const mockedGenerator = vi.mocked(generateLessonFromBlueprint);
    mockedGenerator.mockImplementationOnce(async (blueprint: { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return {
        lessonId: blueprint.id,
        response: { success: true },
      };
    });

    const [first, second] = await Promise.all([
      runM6GenerateLesson(run.id, String(blueprintId), { apiBaseUrl: 'http://localhost:3000' }),
      runM6GenerateLesson(run.id, String(blueprintId), { apiBaseUrl: 'http://localhost:3000' }),
    ]);

    expect(mockedGenerator).toHaveBeenCalledTimes(1);
    expect(first.error).toBeNull();
    expect(second.error).toBeNull();
    expect([first.status, second.status]).toContain('generated');
    expect(first.deduped || second.deduped).toBe(true);
  });
});
