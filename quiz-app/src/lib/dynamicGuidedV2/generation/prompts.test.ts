import { describe, expect, it } from 'vitest';
import {
  buildDynamicBasicChecksPrompt,
  buildDynamicDeeperChecksPrompt,
  buildDynamicExplanationPrompt,
  buildDynamicFixPlanPrompt,
  buildDynamicPlanningPrompt,
  buildDynamicPracticePrompt,
  buildDynamicRepairPrompt,
  buildDynamicScorePrompt,
  buildDynamicSpacedReviewPrompt,
  buildDynamicIntegrationPrompt,
  buildDynamicVocabularyPrompt,
  buildDynamicWorkedExamplePrompt,
} from '@/lib/dynamicGuidedV2/generation/prompts';
import type {
  DynamicFixPlan,
  DynamicLessonGenerationInput,
  DynamicLessonGenerationScore,
  DynamicLessonStageDescriptor,
} from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type { DynamicLessonGenerationValidation } from '@/lib/dynamicGuidedV2/versionStore';

const input: DynamicLessonGenerationInput = {
  lessonCode: '203-5A',
  title: 'Electricity Generation and Transmission',
  unit: '203',
  topic: 'Electricity Generation and Transmission',
  subject: 'C&G 2365',
  audience: 'beginner',
  tonePrompt: 'Teach clearly.',
  sourceText: 'PV stands for photovoltaic.',
};

const stagePlan = [
  {
    key: 'teach-check-1',
    title: 'Teach/Check 1',
    role: 'explanation' as const,
    stage: 'teach_check' as const,
    objective: 'Explain what PV means.',
    completionMode: 'continue' as const,
  },
];

const fullStagePlan: DynamicLessonStageDescriptor[] = [
  ...stagePlan,
  {
    key: 'worked-example',
    title: 'Worked Example',
    role: 'worked_example',
    stage: 'worked_example',
    objective: 'Use PV in a worked example.',
    completionMode: 'continue',
  },
  {
    key: 'guided-practice',
    title: 'Guided Practice',
    role: 'guided_practice',
    stage: 'guided_practice',
    objective: 'Apply PV in a guided task.',
    completionMode: 'continue',
  },
  {
    key: 'practice',
    title: 'Practice',
    role: 'practice',
    stage: 'practice',
    objective: 'Apply PV independently.',
    completionMode: 'continue',
  },
  {
    key: 'integrative',
    title: 'Integrative',
    role: 'integrative',
    stage: 'integrative',
    objective: 'Integrate the lesson.',
    completionMode: 'continue',
  },
];

const lesson: DynamicGuidedV2Lesson = {
  lessonId: 'dynamic-v2-generated-test',
  lessonCode: '203-5A',
  title: 'Electricity Generation and Transmission',
  subject: 'C&G 2365',
  unit: '203',
  audience: 'beginner',
  tonePrompt: 'Teach clearly.',
  comparisonSource: 'dynamic_generator',
  artifactVersion: 'test',
  keyTerms: ['PV'],
  keyIdeas: ['PV stands for photovoltaic.'],
  steps: [
    {
      id: 'step-1',
      sourceBlockId: 'source-1',
      title: 'Teach/Check 1',
      role: 'explanation',
      stage: 'teach_check',
      completionMode: 'continue',
      objective: 'Explain what PV means.',
      keyTerms: ['PV'],
      keyIdeas: ['PV stands for photovoltaic.'],
      anchorFacts: ['PV stands for photovoltaic.'],
      taskConstraints: [],
      taskSkeleton: { steps: [] },
      retrievalText: 'PV stands for photovoltaic.',
      retrievalTextLines: ['PV stands for photovoltaic.'],
      questionText: 'What does PV stand for?',
      questionHeading: 'Check 1',
      questionIntent: 'Check understanding of PV.',
      questionType: 'short_answer',
      answerFormat: 'short_text',
      acceptableAnswers: ['photovoltaic'],
      basicQuestions: [
        { questionForm: 'exact_term', questionText: 'What does PV stand for?' },
        { questionForm: 'definition_to_name', questionText: 'What term is abbreviated to PV?' },
        { questionForm: 'short_explanation', questionText: 'What does PV describe?' },
      ],
      deeperQuestionText: 'Why is PV useful in micro-generation?',
      hint: 'PV means photovoltaic.',
    },
  ],
};

const planning = {
  lessonAim: 'Teach PV.',
  taskMode: 'chunk-first',
  teachCheckCount: 1,
  teachChecks: [
    {
      key: 'teach-check-1',
      title: 'Teach/Check 1',
      objective: 'Explain what PV means.',
      conceptFocus: 'PV',
      whyItMatters: 'PV is used in micro-generation.',
      misconceptions: ['PV is not a fuel source.'],
    },
  ],
  inScope: ['PV'],
  outOfScope: ['biomass'],
  constraints: ['Stay on PV.'],
};

const vocabulary = {
  terms: [
    {
      term: 'PV',
      simpleDefinition: 'photovoltaic',
      anchor: 'solar panels',
      misconception: 'PV does not mean power voltage.',
    },
  ],
  anchorPhrases: ['PV stands for photovoltaic.'],
  misconceptionTargets: ['PV does not mean power voltage.'],
};

const validation: DynamicLessonGenerationValidation = {
  passed: true,
  issues: [],
};

const score: DynamicLessonGenerationScore = {
  total: 92,
  grade: 'strong',
  breakdown: {
    beginnerClarity: 28,
    teachingBeforeTesting: 24,
    markingRobustness: 18,
    alignmentToLO: 14,
    questionQuality: 8,
  },
  issues: [],
  phaseFeedback: [],
  summary: 'Strong lesson.',
};

const fixPlan: DynamicFixPlan = {
  summary: 'Fix one field.',
  fixes: [
    {
      fieldType: 'basic_question',
      repairClass: 'basic_question_rewrite',
      repairMode: 'rewrite',
      phaseKey: 'step-1',
      priority: 'high',
      severity: 'major',
      category: 'questionQuality',
      targetPointer: '/steps/1/basicQuestions/0/questionText',
      problem: 'Question is vague.',
      currentValue: 'What does PV describe?',
      whyCurrentValueFails: 'Too vague.',
      mustPreserve: 'PV meaning.',
      requiredFix: 'Ask directly what PV stands for.',
      allowedTerms: ['PV', 'photovoltaic'],
      forbiddenTerms: ['biomass'],
      sourceEvidence: ['PV stands for photovoltaic.'],
      replacementTarget: 'What does PV stand for?',
      badSpan: 'describe',
    },
  ],
};

const spacedReviewGrounding = {
  sourceMode: 'unit_history' as const,
  coveragePlan: [
    {
      sourceLo: 'LO1',
      lessonCodes: ['203-1A'],
      anchorSummary: 'Electrical safety basics.',
    },
  ],
};

describe('dynamic prompt variants', () => {
  it('keeps baseline explanation prompt in markdown form', () => {
    const prompt = buildDynamicExplanationPrompt(input);
    expect(prompt.system).toContain('# System message');
    expect(prompt.system).toContain('## Rules');
  });

  it('uses literal markdown prompts for planning and vocabulary', () => {
    const planning = buildDynamicPlanningPrompt(input, stagePlan);
    const vocabulary = buildDynamicVocabularyPrompt(input);
    expect(planning.system).toContain('# System message');
    expect(planning.system).not.toContain('Read the locked prior phase history');
    expect(planning.user).toContain('## Output shape');
    expect(vocabulary.system).toContain('# System message');
    expect(vocabulary.system).not.toContain('Complete only the current phase');
    expect(vocabulary.user).toContain('## Critical rules');
  });

  it('uses literal markdown for the worked example prompt', () => {
    const prompt = buildDynamicWorkedExamplePrompt(input);
    expect(prompt.system).toContain('# System message');
    expect(prompt.system).not.toContain('Read the locked prior phase history');
    expect(prompt.user).toContain('## Output shape');
    expect(prompt.user).toContain('## Critical rules');
  });

  it('uses literal markdown for practice, integration, and spaced review prompts', () => {
    const practice = buildDynamicPracticePrompt(input);
    const integration = buildDynamicIntegrationPrompt(input);
    const spacedReview = buildDynamicSpacedReviewPrompt(input, spacedReviewGrounding);
    expect(practice.system).toContain('# System message');
    expect(practice.user).toContain('## Output shape');
    expect(integration.system).toContain('# System message');
    expect(integration.user).toContain('## Critical rules');
    expect(spacedReview.system).toContain('# System message');
    expect(spacedReview.user).toContain('## Output shape');
  });

  it('uses literal markdown for score, fix plan, and repair prompts', () => {
    const scorePrompt = buildDynamicScorePrompt(input, lesson, validation.issues, planning, vocabulary, null);
    const fixPlanPrompt = buildDynamicFixPlanPrompt(lesson, score, validation);
    const repairPrompt = buildDynamicRepairPrompt(input, lesson, score, fixPlan, fixPlan.fixes[0], fullStagePlan);
    expect(scorePrompt.system).toContain('# System message');
    expect(scorePrompt.user).toContain('## Output shape');
    expect(fixPlanPrompt.system).toContain('# System message');
    expect(fixPlanPrompt.user).toContain('## Critical rules');
    expect(repairPrompt.system).toContain('# System message');
    expect(repairPrompt.user).toContain('## Critical rules');
  });

  it('reverts explanation prompt to plain text for the markdown revert variant', () => {
    const prompt = buildDynamicExplanationPrompt(input, 'p3_markdown_revert');
    expect(prompt.system).not.toContain('# System message');
    expect(prompt.system).toContain('You are writing the Phase 3 explanation content.');
  });

  it('adds a mini example only for the phase 3 few-shot variant', () => {
    const baseline = buildDynamicExplanationPrompt(input);
    const prompt = buildDynamicExplanationPrompt(input, 'p3_few_shot_mini_example');
    expect(baseline.user).not.toContain('## Mini example');
    expect(prompt.user).toContain('## Mini example');
    expect(prompt.user).toContain('PV stands for photovoltaic.');
  });

  it('adds markdown formatting only for the phase 4 markdown variant', () => {
    const baseline = buildDynamicBasicChecksPrompt(input);
    const prompt = buildDynamicBasicChecksPrompt(input, 'p4_markdown_only');
    expect(baseline.system).not.toContain('# System message');
    expect(prompt.system).toContain('# System message');
    expect(prompt.system).toContain('## Critical rules');
    expect(prompt.system).toContain('You are writing three short direct questions for each teach/check section.');
    expect(prompt.system).toContain('## Prompt hygiene');
    expect(prompt.user).toContain('Use the explanation already provided in the lesson context.');
    expect(prompt.user).toContain('## Critical rules');
  });

  it('cleans phase 4 context wording without adding markdown', () => {
    const prompt = buildDynamicBasicChecksPrompt(input, 'p4_context_cleanup');
    expect(prompt.system).not.toContain('# System message');
    expect(prompt.system).toContain('Write three short direct questions for each teach/check section.');
    expect(prompt.user).toContain('Use the explanation already provided in the lesson context.');
    expect(prompt.user).toContain('Critical rules:');
  });

  it('adds a contrastive example only for the dedicated phase 4 variant', () => {
    const baseline = buildDynamicBasicChecksPrompt(input);
    const prompt = buildDynamicBasicChecksPrompt(input, 'p4_contrastive_example');
    expect(baseline.user).not.toContain('Bad/good contrast');
    expect(prompt.user).toContain('Bad/good contrast');
    expect(prompt.user).toContain('the question asks about biomass');
  });

  it('adds anti-meta instructions only for the phase 4.1 variant', () => {
    const baseline = buildDynamicDeeperChecksPrompt(input, 'baseline');
    const prompt = buildDynamicDeeperChecksPrompt(input, 'p41_anti_meta');
    expect(baseline.system).not.toContain('Do not write meta questions');
    expect(prompt.system).toContain('Do not write meta questions');
    expect(prompt.system).toContain('Make the deeper question test the technical idea itself');
  });

  it('uses the simplified markdown deeper-check prompt by default', () => {
    const prompt = buildDynamicDeeperChecksPrompt(input, 'p41_markdown_only');
    expect(prompt.system).toContain('# System message');
    expect(prompt.user).toContain('## Critical rules');
    expect(prompt.system).toContain('You are writing one deeper question for each teach/check section.');
  });

  it('adds markdown formatting only for the phase 4.1 markdown variant versus the old baseline control', () => {
    const baseline = buildDynamicDeeperChecksPrompt(input, 'baseline');
    const prompt = buildDynamicDeeperChecksPrompt(input, 'p41_markdown_only');
    expect(baseline.system).not.toContain('# System message');
    expect(prompt.system).toContain('# System message');
    expect(prompt.user).toContain('## Critical rules');
  });

  it('adds a positive example only for the phase 4.1 few-shot variant', () => {
    const baseline = buildDynamicDeeperChecksPrompt(input, 'baseline');
    const prompt = buildDynamicDeeperChecksPrompt(input, 'p41_few_shot_positive');
    expect(baseline.user).not.toContain('Positive example:');
    expect(prompt.user).toContain('Positive example:');
    expect(prompt.user).toContain('Good deeper question:');
  });
});
