import { beforeEach, describe, expect, it, vi } from 'vitest';

type LlmPlanBuilder = (prompt: string) => unknown;

let buildLlmPlan: LlmPlanBuilder;

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
        generateContent: async (prompt: string) => ({
          response: {
            text: () => JSON.stringify(buildLlmPlan(prompt)),
          },
        }),
      }),
    })),
  };
});

import {
  createPlannerRun,
  getPlannerRunSummary,
  runM0Distill,
  runM1Analyze,
  runM2Coverage,
  runM3Plan,
  runM4Blueprints,
  runM5Validate,
} from '@/lib/module_planner/planner';
import { clearModulePlannerDbForTests, createSyllabusVersion, insertSyllabusChunks, upsertSyllabusStructure } from '@/lib/module_planner/db';

function buildValidPlanFromPrompt(prompt: string): Record<string, unknown> {
  const parsed = JSON.parse(prompt) as {
    constraints?: { maxAcsPerLesson?: number };
    canonicalCoverage: {
      unit: string;
      los: Array<{ lo: string; coverageTargets: Array<{ acKey: string; acText: string }> }>;
    };
  };
  const coverage = parsed.canonicalCoverage;
  const maxAcsPerLesson = Math.max(1, Number(parsed?.constraints?.maxAcsPerLesson ?? 12));
  return {
    unit: coverage.unit,
    los: coverage.los.map((loGroup) => {
      const lessonCount = Math.max(1, Math.ceil(loGroup.coverageTargets.length / maxAcsPerLesson));
      return {
        lo: loGroup.lo,
        lessonCount,
        lessons: Array.from({ length: lessonCount }, (_, idx) => {
          const start = idx * maxAcsPerLesson;
          const end = start + maxAcsPerLesson;
          const chunk = loGroup.coverageTargets.slice(start, end);
          const letter = String.fromCharCode(65 + idx);
          return {
            topicCode: `${loGroup.lo.replace(/^LO/i, '')}${letter}`,
            title: chunk[0]?.acText ?? `${loGroup.lo} Lesson ${idx + 1}`,
            coversAcKeys: chunk.map((target) => target.acKey),
            whySplit: idx > 0 ? 'Split by AC ceiling' : null,
          };
        }),
      };
    }),
  };
}

async function createVersionWithStructure(input: {
  unit: string;
  loNumber: string;
  acs: Array<{ acNumber: string; text: string; range?: string[] }>;
  loRange?: string[];
  chunkText?: string;
  unitHeadingTitle?: string;
  loHeadingTitle?: string;
  structureUnitTitle?: string;
}): Promise<string> {
  const version = await createSyllabusVersion({
    filename: `unit-${input.unit}-lo-${input.loNumber}.txt`,
    contentHash: `hash-${input.unit}-${input.loNumber}-${Math.random().toString(16).slice(2)}`,
    metaJson: {},
  });

  await insertSyllabusChunks(version.id, [
    {
      ordinal: 0,
      text: input.chunkText ?? `Unit ${input.unit}\nLO${input.loNumber}`,
      anchorJson: {
        pageStart: 1,
        pageEnd: 1,
        headingPath: [input.unitHeadingTitle ?? `Unit ${input.unit}`, input.loHeadingTitle ?? `LO${input.loNumber}`],
        unitGuess: input.unit,
        loGuess: `LO${input.loNumber}`,
      },
    },
  ]);

  await upsertSyllabusStructure({
    syllabusVersionId: version.id,
    unit: input.unit,
    structureJson: {
      unit: input.unit,
      unitTitle: input.structureUnitTitle,
      los: [
        {
          loNumber: input.loNumber,
          title: `LO${input.loNumber}`,
          range: input.loRange,
          acs: input.acs.map((ac) => ({
            acNumber: ac.acNumber,
            text: ac.text,
            acKey: `${input.unit}.LO${input.loNumber}.AC${ac.acNumber}`,
            range: ac.range,
          })),
        },
      ],
    },
  });

  return version.id;
}

async function runThroughM2(runId: string, syllabusVersionId: string, unit: string, lo: string): Promise<void> {
  await runM0Distill(
    runId,
    {
      syllabusVersionId,
      unit,
      selectedLos: [lo],
      constraints: {
        minimiseLessons: false,
        defaultMaxLessonsPerLO: 3,
        maxAcsPerLesson: 4,
        preferredAcsPerLesson: 2,
        maxLessonsOverrides: {},
        level: 'Level 2',
        audience: 'beginner',
      },
      orderingPreference: 'foundation-first',
      notes: 'compliance test',
      chatTranscript: 'plan lessons',
    },
    { replayFromArtifacts: false }
  );
  await runM1Analyze(runId, { replayFromArtifacts: false });
}

describe('module planner compliance gaps', () => {
  beforeEach(async () => {
    vi.stubEnv('NODE_ENV', 'test');
    await clearModulePlannerDbForTests();
    buildLlmPlan = buildValidPlanFromPrompt;
  });

  it('uses canonical AC range in M2 and does not re-derive from chunk text', async () => {
    const versionId = await createVersionWithStructure({
      unit: '202',
      loNumber: '5',
      acs: [
        { acNumber: '1', text: 'Identify RMS' },
        {
          acNumber: '5',
          text: 'Explain waveform values',
          range: ['RMS', 'average', 'peak-to-peak', 'periodic time', 'frequency', 'amplitude'],
        },
      ],
      chunkText: [
        'Unit 202',
        'LO5',
        '1. Identify RMS',
        '5. Explain waveform values',
        'Range:',
        '- WRONG FROM CHUNK',
      ].join('\n'),
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '202',
      chatTranscript: 'LO5 only',
    });

    await runThroughM2(run.id, versionId, '202', 'LO5');
    const m2 = await runM2Coverage(run.id, { replayFromArtifacts: false });
    const lo = m2.artifact.los.find((item) => item.lo === 'LO5');
    expect(lo).toBeTruthy();
    if (!lo) return;

    const ac1 = lo.coverageTargets.find((target) => target.acKey === '202.LO5.AC1');
    const ac5 = lo.coverageTargets.find((target) => target.acKey === '202.LO5.AC5');

    expect(ac1?.range).toBeNull();
    expect(ac5?.range).toEqual(['RMS', 'average', 'peak-to-peak', 'periodic time', 'frequency', 'amplitude']);
  });

  it('normalizes legacy indexed AC text so M2 labels reflect actual AC statement text', async () => {
    const versionId = await createVersionWithStructure({
      unit: '216',
      loNumber: '5',
      acs: [
        { acNumber: '5.1', text: '1 Identify RMS values' },
        { acNumber: '5.2', text: '2 Identify average values' },
      ],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '216',
      chatTranscript: 'LO5 only',
    });

    await runThroughM2(run.id, versionId, '216', 'LO5');
    const m2 = await runM2Coverage(run.id, { replayFromArtifacts: false });
    const lo = m2.artifact.los.find((item) => item.lo === 'LO5');
    expect(lo).toBeTruthy();
    if (!lo) return;

    const acOne = lo.coverageTargets.find((target) => target.acKey === '216.LO5.AC5.1');
    const acTwo = lo.coverageTargets.find((target) => target.acKey === '216.LO5.AC5.2');
    expect(acOne?.acText).toBe('Identify RMS values');
    expect(acTwo?.acText).toBe('Identify average values');
  });

  it('hydrates M1 sourceChunkIds and prefers retrieved unitTitle metadata', async () => {
    const versionId = await createVersionWithStructure({
      unit: '214',
      loNumber: '1',
      acs: [{ acNumber: '1', text: 'Identify role A' }],
      unitHeadingTitle: 'Construction Team Roles',
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '214',
      chatTranscript: 'LO1 only',
    });

    await runM0Distill(
      run.id,
      {
        syllabusVersionId: versionId,
        unit: '214',
        selectedLos: ['LO1'],
        constraints: {
          minimiseLessons: false,
          defaultMaxLessonsPerLO: 3,
          maxAcsPerLesson: 4,
          preferredAcsPerLesson: 2,
          maxLessonsOverrides: {},
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'm1 provenance test',
      },
      { replayFromArtifacts: false }
    );

    const m1 = await runM1Analyze(run.id, { replayFromArtifacts: false });
    expect(m1.artifact.unitTitle).toBe('Construction Team Roles');
    expect(m1.artifact.los[0].sourceChunkIds.length).toBeGreaterThan(0);
  });

  it('prefers canonical structure unitTitle metadata over LO-like retrieved heading title', async () => {
    const versionId = await createVersionWithStructure({
      unit: '219',
      loNumber: '3',
      acs: [{ acNumber: '3.1', text: 'Define effective communication methods' }],
      unitHeadingTitle: 'Communicate with others within building services engineering',
      structureUnitTitle: 'Health and Safety in Building Services Engineering',
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '219',
      chatTranscript: 'LO3 only',
    });

    await runM0Distill(
      run.id,
      {
        syllabusVersionId: versionId,
        unit: '219',
        selectedLos: ['LO3'],
        constraints: {
          minimiseLessons: false,
          defaultMaxLessonsPerLO: 3,
          maxAcsPerLesson: 4,
          preferredAcsPerLesson: 2,
          maxLessonsOverrides: {},
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'm1 unit title precedence',
      },
      { replayFromArtifacts: false }
    );

    const m1 = await runM1Analyze(run.id, { replayFromArtifacts: false });
    expect(m1.artifact.unitTitle).toBe('Health and Safety in Building Services Engineering');
  });

  it('trims dangling colon from M2 acText when no explicit bullet payload exists', async () => {
    const versionId = await createVersionWithStructure({
      unit: '220',
      loNumber: '3',
      acs: [{ acNumber: '3.2', text: 'Define effective communication methods for people with:' }],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '220',
      chatTranscript: 'LO3 only',
    });

    await runThroughM2(run.id, versionId, '220', 'LO3');
    const m2 = await runM2Coverage(run.id, { replayFromArtifacts: false });
    const lo = m2.artifact.los.find((item) => item.lo === 'LO3');
    expect(lo).toBeTruthy();
    if (!lo) return;

    const ac = lo.coverageTargets.find((target) => target.acKey === '220.LO3.AC3.2');
    expect(ac?.acText).toBe('Define effective communication methods for people with');
    expect(ac?.acText.endsWith(':')).toBe(false);
  });

  it('fails M1 explicitly when selected LO retrieval returns no chunks', async () => {
    const version = await createSyllabusVersion({
      filename: 'unit-215-empty-rag.txt',
      contentHash: `hash-215-empty-${Math.random().toString(16).slice(2)}`,
      metaJson: {},
    });

    await insertSyllabusChunks(version.id, [
      {
        ordinal: 0,
        text: 'Appendix material only',
        anchorJson: {
          pageStart: 1,
          pageEnd: 1,
          headingPath: ['Appendix'],
          unitGuess: '215',
          loGuess: 'LO9',
        },
      },
    ]);

    await upsertSyllabusStructure({
      syllabusVersionId: version.id,
      unit: '215',
      structureJson: {
        unit: '215',
        los: [
          {
            loNumber: '1',
            title: 'LO1',
            acs: [
              {
                acNumber: '1',
                text: 'Identify role A',
                acKey: '215.LO1.AC1',
              },
            ],
          },
        ],
      },
    });

    const run = await createPlannerRun({
      syllabusVersionId: version.id,
      unit: '215',
      chatTranscript: 'LO1 only',
    });

    await runM0Distill(
      run.id,
      {
        syllabusVersionId: version.id,
        unit: '215',
        selectedLos: ['LO1'],
        constraints: {
          minimiseLessons: false,
          defaultMaxLessonsPerLO: 3,
          maxAcsPerLesson: 4,
          preferredAcsPerLesson: 2,
          maxLessonsOverrides: {},
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'm1 missing rag test',
      },
      { replayFromArtifacts: false }
    );

    await expect(runM1Analyze(run.id, { replayFromArtifacts: false })).rejects.toThrow(
      /M1 retrieval returned no chunks for selected LOs/i
    );
  });

  it('fails M3 when repaired plan is still deterministically invalid', async () => {
    const versionId = await createVersionWithStructure({
      unit: '210',
      loNumber: '1',
      acs: [
        { acNumber: '1', text: 'Identify role A' },
        { acNumber: '2', text: 'Identify role B' },
      ],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '210',
      chatTranscript: 'LO1 only',
    });
    await runThroughM2(run.id, versionId, '210', 'LO1');
    await runM2Coverage(run.id, { replayFromArtifacts: false });

    buildLlmPlan = (prompt: string) => {
      const parsed = JSON.parse(prompt) as {
        canonicalCoverage: { unit: string; los: Array<{ lo: string; coverageTargets: Array<{ acKey: string }> }> };
      };
      const lo = parsed.canonicalCoverage.los[0];
      return {
        unit: parsed.canonicalCoverage.unit,
        los: [
          {
            lo: lo.lo,
            lessonCount: 1,
            lessons: [
              {
                topicCode: '1A',
                title: 'Invalid plan',
                coversAcKeys: [lo.coverageTargets[0].acKey],
                whySplit: null,
              },
            ],
          },
        ],
      };
    };

    await expect(runM3Plan(run.id, { replayFromArtifacts: false })).rejects.toThrow(
      /M3 plan invalid after single repair attempt/i
    );
  });

  it('reports actionable Gemini diagnostics when response JSON fails M3 schema', async () => {
    const versionId = await createVersionWithStructure({
      unit: '211',
      loNumber: '1',
      acs: [
        { acNumber: '1', text: 'Identify method A' },
        { acNumber: '2', text: 'Identify method B' },
      ],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '211',
      chatTranscript: 'LO1 only',
    });
    await runThroughM2(run.id, versionId, '211', 'LO1');
    await runM2Coverage(run.id, { replayFromArtifacts: false });

    buildLlmPlan = () => ({
      unexpected: true,
      note: 'invalid shape for MinimalLessonPlan',
    });

    await expect(runM3Plan(run.id, { replayFromArtifacts: false })).rejects.toThrow(/reason=JSON_SCHEMA_FAIL/i);
  });

  it('coerces array-style Gemini M3 output into MinimalLessonPlan shape', async () => {
    const versionId = await createVersionWithStructure({
      unit: '212',
      loNumber: '1',
      acs: [
        { acNumber: '1', text: 'Identify role A' },
        { acNumber: '2', text: 'Identify role B' },
      ],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '212',
      chatTranscript: 'LO1 only',
    });
    await runThroughM2(run.id, versionId, '212', 'LO1');
    await runM2Coverage(run.id, { replayFromArtifacts: false });

    buildLlmPlan = () => [
      {
        lo: 'LO1',
        lessonCount: 2,
        lessons: [
          {
            title: 'Lesson A',
            coversAcKeys: ['212.LO1.AC1'],
          },
          {
            title: 'Lesson B',
            coversAcKeys: ['212.LO1.AC2'],
          },
        ],
      },
    ];

    const m3 = await runM3Plan(run.id, { replayFromArtifacts: false });
    expect(m3.artifact.unit).toBe('212');
    expect(m3.artifact.los).toHaveLength(1);
    expect(m3.artifact.los[0].lessonCount).toBe(2);
    expect(m3.artifact.los[0].lessons[0].topicCode).toBeTruthy();
    expect(m3.artifact.los[0].lessons[0].whySplit).toBeNull();
  });

  it('normalizes topicCode variants and avoids raw AC statements in LO ledger fields', async () => {
    const versionId = await createVersionWithStructure({
      unit: '213',
      loNumber: '1',
      acs: [
        { acNumber: '1', text: 'Identify statutory documentation for site teams' },
        { acNumber: '2', text: 'State communication methods used with customers' },
      ],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '213',
      chatTranscript: 'LO1 only',
    });
    await runThroughM2(run.id, versionId, '213', 'LO1');
    await runM2Coverage(run.id, { replayFromArtifacts: false });

    buildLlmPlan = (prompt: string) => {
      const parsed = JSON.parse(prompt) as {
        canonicalCoverage: { unit: string; los: Array<{ lo: string; coverageTargets: Array<{ acKey: string }> }> };
      };
      const lo = parsed.canonicalCoverage.los[0];
      return {
        unit: parsed.canonicalCoverage.unit,
        los: [
          {
            lo: lo.lo,
            lessonCount: 2,
            lessons: [
              {
                topicCode: '213.LO1.L1',
                title: 'Documentation',
                coversAcKeys: [lo.coverageTargets[0].acKey],
                whySplit: null,
              },
              {
                topicCode: '213.LO1.L2',
                title: 'Communication',
                coversAcKeys: [lo.coverageTargets[1].acKey],
                whySplit: null,
              },
            ],
          },
        ],
      };
    };

    const m3 = await runM3Plan(run.id, { replayFromArtifacts: false });
    expect(m3.artifact.los[0].lessons[0].topicCode).toBe('1A');
    expect(m3.artifact.los[0].lessons[1].topicCode).toBe('1B');

    await runM4Blueprints(run.id, { replayFromArtifacts: false });
    const summary = await getPlannerRunSummary(run.id);
    const storedM4 = summary.artifacts.find((artifact) => artifact.stage === 'M4')?.artifact_json as
      | { loLedgers?: Array<{ lo: string; ledger: { taughtConcepts: string[]; taughtVocab: string[]; doNotTeach: string[] } }> }
      | undefined;
    const ledger = storedM4?.loLedgers?.[0]?.ledger;
    expect(ledger).toBeTruthy();
    if (!ledger) return;

    const allLedgerItems = [...ledger.taughtConcepts, ...ledger.taughtVocab, ...ledger.doNotTeach];
    const hasRawAcStatements = allLedgerItems.some((item) =>
      /^\d+(?:\.\d+)?\s+(identify|state|define|describe|explain|apply|list|outline|demonstrate)\b/i.test(item)
    );
    expect(hasRawAcStatements).toBe(false);
  });

  it('separates already-taught concepts from doNotTeach and avoids slash-fragmented vocab tokens', async () => {
    const versionId = await createVersionWithStructure({
      unit: '221',
      loNumber: '2',
      acs: [{ acNumber: '2.4', text: 'State importance of company policies/procedures affecting working relationships' }],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '221',
      chatTranscript: 'LO2 only',
    });

    await runThroughM2(run.id, versionId, '221', 'LO2');
    await runM2Coverage(run.id, { replayFromArtifacts: false });
    await runM3Plan(run.id, { replayFromArtifacts: false });
    await runM4Blueprints(run.id, { replayFromArtifacts: false });

    const summary = await getPlannerRunSummary(run.id);
    const storedM4 = summary.artifacts.find((artifact) => artifact.stage === 'M4')?.artifact_json as
      | {
          loLedgers?: Array<{
            lo: string;
            ledger: {
              alreadyTaughtConcepts?: string[];
              taughtConcepts: string[];
              taughtVocab: string[];
              doNotTeach: string[];
            };
          }>;
        }
      | undefined;
    const ledger = storedM4?.loLedgers?.find((entry) => entry.lo === 'LO2')?.ledger;
    expect(ledger).toBeTruthy();
    if (!ledger) return;

    expect(
      ledger.taughtConcepts.some((item) => item.includes('company policies/procedures affecting working relationships'))
    ).toBe(true);
    expect(ledger.taughtVocab).not.toContain('importance of company policies');
    expect(ledger.taughtVocab).not.toContain('procedures affecting working relationships');
    expect([...(ledger.alreadyTaughtConcepts ?? [])].sort()).toEqual([...ledger.taughtConcepts].sort());
    expect(ledger.doNotTeach).toEqual([]);
  });

  it('enriches truncated M2 AC text from retrieved chunk AC entries before propagation', async () => {
    const versionId = await createVersionWithStructure({
      unit: '222',
      loNumber: '3',
      acs: [
        { acNumber: '3.2', text: 'Define effective communication methods for people with:' },
        { acNumber: '3.3', text: 'State actions to deal with conflicts between:' },
      ],
      chunkText: [
        '## LO3  Communicate with others in the industry',
        '**AC**',
        '3.2 Define effective communication methods for people with:',
        '- physical disabilities',
        '- learning difficulties',
        '- language differences',
        '3.3 State actions to deal with conflicts between:',
        '- customers and operatives',
        '- co-workers',
        '- supervisors and operatives',
        '---',
      ].join('\n'),
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '222',
      chatTranscript: 'LO3 only',
    });

    await runThroughM2(run.id, versionId, '222', 'LO3');
    const m2 = await runM2Coverage(run.id, { replayFromArtifacts: false });
    const lo = m2.artifact.los.find((item) => item.lo === 'LO3');
    expect(lo).toBeTruthy();
    if (!lo) return;

    const ac32 = lo.coverageTargets.find((target) => target.acKey === '222.LO3.AC3.2');
    const ac33 = lo.coverageTargets.find((target) => target.acKey === '222.LO3.AC3.3');
    expect(ac32?.acText).toContain('physical disabilities');
    expect(ac33?.acText).toContain('customers and operatives');
    expect(ac32?.acText.endsWith('with')).toBe(false);
    expect(ac33?.acText.endsWith('between')).toBe(false);
  });

  it('surfaces explicit warning when M4 uses fallback blueprint generation', async () => {
    const versionId = await createVersionWithStructure({
      unit: '223',
      loNumber: '1',
      acs: [{ acNumber: '1', text: 'Identify role A' }],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '223',
      chatTranscript: 'LO1 only',
    });

    await runThroughM2(run.id, versionId, '223', 'LO1');
    await runM2Coverage(run.id, { replayFromArtifacts: false });
    await runM3Plan(run.id, { replayFromArtifacts: false });
    await runM4Blueprints(run.id, { replayFromArtifacts: false });
    const m5 = await runM5Validate(run.id, { replayFromArtifacts: false });

    const fallbackWarnings = m5.artifact.issues.filter(
      (issue) => issue.severity === 'warn' && issue.code === 'BLUEPRINT_GENERATION_MISMATCH'
    );
    expect(fallbackWarnings.length).toBeGreaterThan(0);
  });

  it('emits EXCEEDS_PREFERRED_ACS_PER_LESSON warning without hard error when within max', async () => {
    const versionId = await createVersionWithStructure({
      unit: '203',
      loNumber: '2',
      acs: [
        { acNumber: '1', text: 'AC one' },
        { acNumber: '2', text: 'AC two' },
        { acNumber: '3', text: 'AC three' },
      ],
    });

    const run = await createPlannerRun({
      syllabusVersionId: versionId,
      unit: '203',
      chatTranscript: 'LO2 only',
    });

    await runM0Distill(
      run.id,
      {
        syllabusVersionId: versionId,
        unit: '203',
        selectedLos: ['LO2'],
        constraints: {
          minimiseLessons: false,
          defaultMaxLessonsPerLO: 3,
          maxAcsPerLesson: 4,
          preferredAcsPerLesson: 2,
          maxLessonsOverrides: {},
          level: 'Level 2',
          audience: 'beginner',
        },
        orderingPreference: 'foundation-first',
        notes: 'preferred warning check',
        chatTranscript: 'plan',
      },
      { replayFromArtifacts: false }
    );
    await runM1Analyze(run.id, { replayFromArtifacts: false });
    await runM2Coverage(run.id, { replayFromArtifacts: false });
    await runM3Plan(run.id, { replayFromArtifacts: false });
    await runM4Blueprints(run.id, { replayFromArtifacts: false });
    const m5 = await runM5Validate(run.id, { replayFromArtifacts: false });

    const warningCodes = m5.artifact.issues.filter((issue) => issue.severity === 'warn').map((issue) => issue.code);
    const hardCodes = m5.artifact.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.code);

    expect(warningCodes).toContain('EXCEEDS_PREFERRED_ACS_PER_LESSON');
    expect(hardCodes).not.toContain('EXCEEDS_MAX_ACS_PER_LESSON');
  });
});
