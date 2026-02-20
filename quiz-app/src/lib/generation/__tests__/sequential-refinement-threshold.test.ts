import { describe, expect, it, vi } from 'vitest';
import { SequentialLessonGenerator } from '@/lib/generation/SequentialLessonGenerator';
import type { Lesson } from '@/lib/generation/types';

function createBaseLesson(): Lesson {
  return {
    id: '203-4B',
    title: 'Test lesson',
    description: 'Test description',
    layout: 'linear-flow',
    unit: 'Unit 203',
    topic: 'Earthing',
    learningOutcomes: ['LO1'],
    prerequisites: [],
    blocks: [
      {
        id: '203-4B-outcomes',
        type: 'outcomes',
        order: 1,
        content: {
          outcomes: [{ text: 'LO1', bloomLevel: 'remember' }],
        },
      },
    ],
    metadata: {
      created: '2026-02-20',
      updated: '2026-02-20',
      version: '1.0',
      author: 'test',
    },
  };
}

function createScore(total: number) {
  return {
    total,
    grade: total >= 95 ? 'Ship it' : total >= 90 ? 'Strong' : 'Usable',
    syllabus: {
      unit: '203',
      unitTitle: 'Test',
      learningOutcome: 'LO4',
      loTitle: 'Test LO',
      assessmentCriteria: ['AC1', 'AC2'],
    },
    breakdown: {
      beginnerClarity: 28,
      teachingBeforeTesting: 24,
      markingRobustness: 18,
      alignmentToLO: 15,
      questionQuality: 10,
    },
    issues: [],
    overallAssessment: 'ok',
  };
}

function buildGeneratorForThresholdTest() {
  const generator = new SequentialLessonGenerator(vi.fn(async () => '{}')) as any;
  const lesson = createBaseLesson();

  vi.spyOn(generator, 'runPhase1').mockResolvedValue({ layout: 'linear-flow', explanationSections: [], learningOutcomes: ['LO1'] });
  vi.spyOn(generator, 'runPhase2').mockResolvedValue({ terms: [] });
  vi.spyOn(generator, 'runPhase3').mockResolvedValue({ explanations: [] });
  vi.spyOn(generator, 'runPhase4').mockResolvedValue({ checks: [] });
  vi.spyOn(generator, 'runPhase5').mockResolvedValue({ workedExample: null, guidedPractice: null });
  vi.spyOn(generator, 'runPhase6').mockResolvedValue({ practice: { questions: [] } });
  vi.spyOn(generator, 'runPhase7').mockResolvedValue({ integrative: { questions: [] } });
  vi.spyOn(generator, 'runPhase8').mockResolvedValue({ spacedReview: { questions: [] } });
  generator.phase9 = { assemble: vi.fn(() => lesson) };

  return { generator, lesson };
}

describe('Sequential generator threshold gating', () => {
  it('does not run refinement when initial score already meets threshold', async () => {
    const { generator } = buildGeneratorForThresholdTest();
    const scoreSpy = vi.spyOn(generator.phase10, 'scoreLesson').mockResolvedValue(createScore(96));
    const runPhase10Spy = vi.spyOn(generator, 'runPhase10');

    const result = await generator.generate({
      unit: 203,
      lessonId: '4B',
      topic: 'Earthing',
      section: 'Installation 2365 Level 2',
    });

    expect(result.success).toBe(true);
    expect(scoreSpy).toHaveBeenCalledTimes(1);
    expect(runPhase10Spy).not.toHaveBeenCalled();
    expect(result.refinementMetadata?.report?.status).toBe('pass_no_refinement');
  });

  it('flags quality failure report when refinement is not accepted', async () => {
    const { generator, lesson } = buildGeneratorForThresholdTest();
    vi.spyOn(generator.phase10, 'scoreLesson').mockResolvedValue(createScore(90));
    vi.spyOn(generator, 'runPhase10').mockResolvedValue({
      originalLesson: lesson,
      refined: lesson,
      patchesApplied: [],
      originalScore: 90,
      refinedScore: 92,
      accepted: false,
      reason: 'Candidate score 92 is below threshold 95',
      regressions: [],
      improvementSuccess: false,
    });

    const result = await generator.generate({
      unit: 203,
      lessonId: '4B',
      topic: 'Earthing',
      section: 'Installation 2365 Level 2',
    });

    expect(result.success).toBe(true);
    expect(result.refinementMetadata?.report?.status).toBe('fail_below_threshold');
    expect(result.refinementMetadata?.report?.finalScore).toBe(92);
  });
});

