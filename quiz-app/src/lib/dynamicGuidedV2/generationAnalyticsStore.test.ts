import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createSupabaseAdminClient: vi.fn(() => null),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createSupabaseAdminClient: mocks.createSupabaseAdminClient,
}));

import type { DynamicLessonGenerationResult } from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import {
  buildDynamicGenerationRunFingerprint,
  buildDynamicGenerationAnalyticsPayload,
  logDynamicGenerationAnalytics,
  normalizeDynamicGenerationIssueKey,
} from '@/lib/dynamicGuidedV2/generationAnalyticsStore';

function buildLesson(): DynamicGuidedV2Lesson {
  return {
    lessonId: 'lesson-1',
    lessonCode: '203-5A',
    title: 'Electricity Generation and Transmission',
    subject: 'C&G 2365',
    unit: '203',
    audience: 'Level 2 electrical learner',
    tonePrompt: 'Teach clearly.',
    comparisonSource: 'dynamic_generator',
    steps: [
      {
        id: 'step-1',
        sourceBlockId: 'source-1',
        title: 'Teach/Check 1',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        objective: 'Teach one core idea.',
        retrievalText: 'Generation requires a step-up transformer before transmission.',
        completionMode: 'respond',
        keyIdeas: ['A step-up transformer increases voltage before transmission.'],
        anchorFacts: ['A Step-up Transformer is the device used at power stations to increase voltage for transmission.'],
        basicQuestions: [{ questionText: 'Which device increases voltage before transmission?', answerGuidance: ['Step-up transformer'] }],
        questionText: '1. Which device increases voltage before transmission?',
        answerGuidance: ['Step-up transformer'],
        deeperQuestionText: 'Why is a step-up transformer used before transmission?',
        deeperAnswerGuidance: ['It increases voltage and reduces current.'],
      },
    ],
  };
}

function buildResult(): DynamicLessonGenerationResult {
  const lesson = buildLesson();
  return {
    lesson,
    phases: [],
    validation: { passed: true, issues: [] },
    score: {
      total: 85,
      grade: 'usable',
      breakdown: {
        beginnerClarity: 24,
        teachingBeforeTesting: 19,
        markingRobustness: 16,
        alignmentToLO: 14,
        questionQuality: 12,
      },
      issues: [
        {
          id: 'issue-1',
          category: 'alignmentToLO',
          jsonPointers: ['/steps/0/anchorFacts/0'],
          problem: 'The anchor fact still names the wrong device for transmission.',
          whyItMatters: 'This teaches the wrong factual device.',
          solution: "Change the anchor fact to: 'A Step-up Transformer is the device used at power stations to increase voltage for transmission.'",
          suggestion: 'Replace the wrong named device with Step-up Transformer.',
        },
        {
          id: 'issue-2',
          category: 'questionQuality',
          jsonPointers: ['/steps/0/deeperQuestionText'],
          problem: 'The deeper question is still meta rather than technical.',
          whyItMatters: 'It tests lesson framing instead of the technical idea.',
          solution: 'Replace the meta deeper question with a technical application question about voltage and losses.',
          suggestion: 'Rewrite the deeper question so it tests the chunk objective directly.',
        },
      ],
      phaseFeedback: [],
      summary: 'Some issues remain.',
    },
    planScore: {
      total: 100,
      grade: 'ship',
      breakdown: {},
      issues: [],
      summary: 'Strong plan.',
    },
    fidelityScore: {
      total: 100,
      grade: 'ship',
      breakdown: {},
      issues: [],
      summary: 'Strong fidelity.',
    },
    refined: true,
    accepted: false,
    rejectionReason: 'Below gate.',
    candidateLesson: null,
    candidateValidation: null,
    candidateScore: null,
    postRepairScore: null,
    repairSummary: {
      phase12Ran: true,
      repairRoundsRun: 2,
      repairStopReason: 'all_patchable_attempted_and_resolved',
      patchableIssueCountInitial: 2,
      patchableIssueCountFinal: 1,
      attemptedPatchCount: 2,
      acceptedPatchCount: 1,
      lastTargetPointer: '/steps/0/deeperQuestionText',
      lastRepairClass: 'deeper_question_rewrite',
      specificPromptReturnedPatch: true,
      fallbackPromptRan: false,
      fallbackPromptReturnedPatch: false,
      patchAccepted: true,
      patchRejectedCode: null,
      patchRejectedReason: null,
      repairAttempts: [
        {
          round: 1,
          attemptMode: 'specific',
          repairClass: 'exact_replace',
          targetPointer: '/steps/0/anchorFacts/0',
          promptReturnedPatch: true,
          patchAccepted: true,
          patchRejectedCode: null,
          patchRejectedReason: null,
        },
      ],
    },
    fixPlan: {
      summary: 'One issue remains.',
      fixes: [
        {
          fieldType: 'deeper_question',
          repairClass: 'deeper_question_rewrite',
          repairMode: 'field_rewrite',
          priority: 'high',
          severity: 'major',
          category: 'questionQuality',
          targetPointer: '/steps/0/deeperQuestionText',
          problem: 'The deeper question is still meta rather than technical.',
          currentValue: 'Why is this lesson important?',
          whyCurrentValueFails: 'It does not test the technical objective.',
          mustPreserve: 'Keep the chunk focus on voltage and losses.',
          requiredFix: 'Rewrite it as one technical application question.',
          allowedTerms: ['voltage', 'losses', 'current'],
          forbiddenTerms: ['importance'],
          sourceEvidence: ['High voltage reduces current and losses.'],
        },
      ],
    },
  };
}

describe('dynamic generation analytics store', () => {
  beforeEach(() => {
    mocks.createSupabaseAdminClient.mockReset();
    mocks.createSupabaseAdminClient.mockReturnValue(null);
    delete process.env.DYNAMIC_GENERATION_PROMPT_VERSION;
  });

  it('normalizes wrong named device issues', () => {
    const result = buildResult();
    expect(normalizeDynamicGenerationIssueKey(result.score.issues[0], result)).toBe('wrong_named_device');
  });

  it('builds run and issue payloads from the final result', () => {
    process.env.DYNAMIC_GENERATION_PROMPT_VERSION = 'dg-v2-test';
    const payload = buildDynamicGenerationAnalyticsPayload({
      context: {
        lessonCode: '203-5A',
        sourceContext: 'benchmark_dynamic_generation',
        origin: 'artifact_backfill',
        runFingerprint: 'artifact:test-run',
      },
      result: buildResult(),
    });

    expect(payload.runRow.lesson_code).toBe('203-5A');
    expect(payload.runRow.prompt_version).toBe('dg-v2-test');
    expect(payload.runRow.run_fingerprint).toBe('artifact:test-run');
    expect(payload.runRow.origin).toBe('artifact_backfill');
    expect(payload.runRow.issue_count).toBe(2);
    expect(payload.runRow.accepted_patch_count).toBe(1);
    expect(payload.issueRows).toEqual([
      expect.objectContaining({
        lesson_code: '203-5A',
        issue_index: 0,
        normalized_key: 'wrong_named_device',
        repairable: false,
        resolved_by_repair: false,
      }),
      expect.objectContaining({
        lesson_code: '203-5A',
        issue_index: 1,
        normalized_key: 'meta_deeper_question',
        repairable: true,
        repair_class: 'deeper_question_rewrite',
        resolved_by_repair: false,
      }),
    ]);
  });

  it('builds a stable artifact fingerprint for the same run input', () => {
    const result = buildResult();
    const context = {
      lessonCode: '203-5A',
      sourceContext: 'benchmark_dynamic_generation',
      origin: 'artifact_backfill' as const,
    };
    const first = buildDynamicGenerationRunFingerprint({
      context,
      result,
      artifactPath: 'C:/repo/.runtime/dynamic-guided-v2-generated-lessons/203-5a/20260320-105811z-accepted.json',
      exportedAt: '2026-03-20T10:58:11.000Z',
    });
    const second = buildDynamicGenerationRunFingerprint({
      context,
      result,
      artifactPath: 'C:/repo/.runtime/dynamic-guided-v2-generated-lessons/203-5a/20260320-105811z-accepted.json',
      exportedAt: '2026-03-20T10:58:11.000Z',
    });
    expect(first).toBe(second);
  });

  it('no-ops when the admin client is unavailable', async () => {
    await expect(
      logDynamicGenerationAnalytics({
        context: {
          lessonCode: '203-5A',
          sourceContext: 'benchmark_dynamic_generation',
          origin: 'live_generation',
        },
        result: buildResult(),
      })
    ).resolves.toBeUndefined();
  });
});
