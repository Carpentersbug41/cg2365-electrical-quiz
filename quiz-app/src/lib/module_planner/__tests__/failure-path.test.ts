import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearModulePlannerDbForTests, createSyllabusVersion, insertSyllabusChunks } from '@/lib/module_planner/db';
import { createPlannerRun } from '@/lib/module_planner/planner';

describe('planner failure path', () => {
  beforeEach(async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await clearModulePlannerDbForTests();
  });

  it('blocks planner when uploaded syllabus has no valid extracted structure for selected unit', async () => {
    const version = await createSyllabusVersion({
      filename: 'messy.txt',
      contentHash: 'messy-hash',
      metaJson: {},
    });

    await insertSyllabusChunks(version.id, [
      {
        ordinal: 0,
        text: 'random text without unit or LO markers',
        anchorJson: {
          pageStart: 1,
          pageEnd: 1,
          headingPath: [],
          unitGuess: null,
          loGuess: null,
        },
      },
    ]);

    await expect(
      createPlannerRun({
        syllabusVersionId: version.id,
        unit: '210',
        chatTranscript: 'plan something',
      })
    ).rejects.toThrow(/Unknown unit/i);
  });
});
