import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearModulePlannerDbForTests, createSyllabusVersion, insertSyllabusChunks, upsertSyllabusStructure } from '@/lib/module_planner/db';
import { createPlannerRun, getPlannerRunSummary, runM0Distill } from '@/lib/module_planner/planner';

async function makeVersion(filename: string): Promise<string> {
  const version = await createSyllabusVersion({
    filename,
    contentHash: `${filename}-hash`,
    metaJson: {},
  });

  await insertSyllabusChunks(version.id, [
    {
      ordinal: 0,
      text: 'Unit 210\nLO1\nAC1.1 Explain signalling',
      anchorJson: {
        pageStart: 1,
        pageEnd: 1,
        headingPath: ['Unit 210', 'LO1'],
        unitGuess: '210',
        loGuess: 'LO1',
      },
    },
  ]);

  await upsertSyllabusStructure({
    syllabusVersionId: version.id,
    unit: '210',
    structureJson: {
      unit: '210',
      los: [
        {
          loNumber: '1',
          title: 'Understand signalling',
          acs: [
            {
              acNumber: '1.1',
              text: 'Explain signalling',
              acKey: '210.LO1.AC1.1',
            },
          ],
        },
      ],
    },
  });

  return version.id;
}

describe('request hashing', () => {
  beforeEach(async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await clearModulePlannerDbForTests();
  });

  it('includes syllabusVersionId/content hash so hashes differ across versions', async () => {
    const v1 = await makeVersion('syllabus-a.txt');
    const v2 = await makeVersion('syllabus-b.txt');

    const run1 = await createPlannerRun({
      syllabusVersionId: v1,
      unit: '210',
      chatTranscript: 'Plan LO1',
    });
    const run2 = await createPlannerRun({
      syllabusVersionId: v2,
      unit: '210',
      chatTranscript: 'Plan LO1',
    });

    await runM0Distill(run1.id, {
      syllabusVersionId: v1,
      unit: '210',
      selectedLos: ['LO1'],
      constraints: {
        minimiseLessons: true,
        defaultMaxLessonsPerLO: 2,
        maxLessonsOverrides: {},
        level: 'Level 2',
        audience: 'beginner',
      },
      orderingPreference: 'foundation-first',
      notes: 'hash check',
      chatTranscript: 'Plan LO1',
    });

    await runM0Distill(run2.id, {
      syllabusVersionId: v2,
      unit: '210',
      selectedLos: ['LO1'],
      constraints: {
        minimiseLessons: true,
        defaultMaxLessonsPerLO: 2,
        maxLessonsOverrides: {},
        level: 'Level 2',
        audience: 'beginner',
      },
      orderingPreference: 'foundation-first',
      notes: 'hash check',
      chatTranscript: 'Plan LO1',
    });

    const summary1 = await getPlannerRunSummary(run1.id);
    const summary2 = await getPlannerRunSummary(run2.id);

    expect(summary1.run.request_hash).toBeTruthy();
    expect(summary2.run.request_hash).toBeTruthy();
    expect(summary1.run.request_hash).not.toEqual(summary2.run.request_hash);
  });
});
