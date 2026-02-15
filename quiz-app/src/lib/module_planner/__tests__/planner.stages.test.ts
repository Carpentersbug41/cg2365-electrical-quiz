import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/module_planner/adapter', () => {
  return {
    generateLessonFromBlueprint: vi.fn(async (blueprint: { id: string }) => ({
      lessonId: blueprint.id,
      response: { success: true },
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
  runM6Generate,
} from '@/lib/module_planner/planner';
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
});
