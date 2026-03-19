import { describe, expect, it } from 'vitest';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import {
  scoreDynamicLesson,
  validateDynamicLesson,
} from '@/lib/dynamicGuidedV2/generation/DynamicLessonGenerator';

function buildPlaceholderLesson(): DynamicGuidedV2Lesson {
  return {
    lessonId: 'test-placeholder-lesson',
    lessonCode: '203-5A',
    title: 'Electricity Generation and Transmission',
    subject: 'C&G 2365',
    unit: '203',
    audience: 'Level 2 electrical learner',
    tonePrompt: 'Teach clearly.',
    comparisonSource: 'dynamic_generator',
    steps: [
      {
        id: '203-5a-intro',
        sourceBlockId: '203-5A-outcomes',
        title: 'Intro',
        role: 'outcomes',
        stage: 'intro',
        progressionRule: 'auto',
        nextStepId: '203-5a-teach-check-1',
        objective: 'Orient the learner.',
        retrievalText: 'Lesson outcomes.',
        completionMode: 'continue',
      },
      {
        id: '203-5a-teach-check-1',
        sourceBlockId: '203-5A-teach-check-1',
        title: 'Teach/Check 1',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        nextStepId: '203-5a-teach-check-2',
        objective: 'Teach the first core idea.',
        retrievalText: 'Core idea: section 1.',
        completionMode: 'respond',
        basicQuestions: [
          { questionText: 'Question 1', answerGuidance: ['key idea 1'] },
          { questionText: 'Question 2', answerGuidance: ['key idea 2'] },
          { questionText: 'Question 3', answerGuidance: ['key idea 3'] },
        ],
        questionText: '1. Question 1\n2. Question 2\n3. Question 3',
        answerGuidance: ['key idea 1', 'key idea 2', 'key idea 3'],
        deeperQuestionText: 'Why does the main idea matter in practice?',
        deeperAnswerGuidance: ['correct idea'],
      },
      {
        id: '203-5a-teach-check-2',
        sourceBlockId: '203-5A-teach-check-2',
        title: 'Teach/Check 2',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        nextStepId: '203-5a-worked-example-1',
        objective: 'Teach the next core idea.',
        retrievalText: 'Core idea: section 2.',
        completionMode: 'respond',
        basicQuestions: [
          { questionText: 'Question 1', answerGuidance: ['key idea 1'] },
          { questionText: 'Question 2', answerGuidance: ['key idea 2'] },
          { questionText: 'Question 3', answerGuidance: ['key idea 3'] },
        ],
        questionText: '1. Question 1\n2. Question 2\n3. Question 3',
        answerGuidance: ['key idea 1', 'key idea 2', 'key idea 3'],
        deeperQuestionText: 'Why does the main idea matter in practice?',
        deeperAnswerGuidance: ['correct idea'],
      },
      {
        id: '203-5a-worked-example-1',
        sourceBlockId: '203-5A-worked-example-1',
        title: 'Worked Example',
        role: 'worked_example',
        stage: 'worked_example',
        progressionRule: 'worked_example_feedback',
        nextStepId: '203-5a-guided-practice-1',
        objective: 'Show one worked example.',
        retrievalText: 'Worked example: show the steps clearly.',
        completionMode: 'respond',
      },
      {
        id: '203-5a-guided-practice-1',
        sourceBlockId: '203-5A-guided-practice-1',
        title: 'Guided Practice',
        role: 'guided_practice',
        stage: 'guided_practice',
        progressionRule: 'auto',
        nextStepId: '203-5a-practice-1',
        objective: 'Guide the learner through a supported task.',
        retrievalText: 'Supported practice task.',
        completionMode: 'respond',
        questionText: 'Supported practice task.',
        answerGuidance: ['correct idea'],
      },
      {
        id: '203-5a-practice-1',
        sourceBlockId: '203-5A-practice-1',
        title: 'Practice',
        role: 'practice',
        stage: 'practice',
        progressionRule: 'auto',
        nextStepId: '203-5a-integrative-1',
        objective: 'Check independent understanding.',
        retrievalText: 'Independent practice task.',
        completionMode: 'respond',
        questionText: 'Independent practice task.',
        answerGuidance: ['correct idea'],
      },
      {
        id: '203-5a-integrative-1',
        sourceBlockId: '203-5A-integrative-1',
        title: 'Integrative Close',
        role: 'integrative',
        stage: 'integrative',
        progressionRule: 'integrative_feedback',
        objective: 'Pull the ideas together.',
        retrievalText: 'Integrative task.',
        completionMode: 'respond',
        questionText: 'Integrative task.',
        answerGuidance: ['correct idea'],
      },
    ],
  };
}

function buildBundledApplyLesson(): DynamicGuidedV2Lesson {
  return {
    lessonId: 'test-bundled-apply-lesson',
    lessonCode: '203-5A',
    title: 'Electricity Generation and Transmission',
    subject: 'C&G 2365',
    unit: '203',
    audience: 'Level 2 electrical learner',
    tonePrompt: 'Teach clearly.',
    comparisonSource: 'dynamic_generator',
    steps: [
      {
        id: '203-5a-intro',
        sourceBlockId: '203-5A-outcomes',
        title: 'Intro',
        role: 'outcomes',
        stage: 'intro',
        progressionRule: 'auto',
        nextStepId: '203-5a-teach-check-1',
        objective: 'Orient the learner.',
        retrievalText: 'Lesson: Electricity Generation and Transmission\nBy the end of this lesson you will identify generation methods and transmission voltages.',
        completionMode: 'continue',
      },
      {
        id: '203-5a-teach-check-1',
        sourceBlockId: '203-5A-teach-check-1',
        title: 'Generation Methods',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        nextStepId: '203-5a-teach-check-2',
        objective: 'Teach generation methods.',
        retrievalText: 'Generation is the first stage of the supply chain. Methods include coal, gas, nuclear, wind, wave, hydro, biomass, photovoltaic and micro-generation.',
        completionMode: 'respond',
        basicQuestions: [
          { questionText: 'What is the first stage of the supply chain?', answerGuidance: ['Generation'] },
          { questionText: 'Name one renewable generation source.', answerGuidance: ['Wind', 'Wave', 'Hydro', 'Biomass', 'Photovoltaic'] },
          { questionText: 'What is micro-generation?', answerGuidance: ['Small-scale local generation'] },
        ],
        questionText: '1. What is the first stage of the supply chain?\n2. Name one renewable generation source.\n3. What is micro-generation?',
        answerGuidance: ['Generation', 'Wind', 'Wave', 'Hydro', 'Biomass', 'Photovoltaic', 'Small-scale local generation'],
        deeperQuestionText: 'How is photovoltaic generation different from burning gas?',
        deeperAnswerGuidance: ['PV generates directly from sunlight', 'Gas uses combustion and heat'],
      },
      {
        id: '203-5a-teach-check-2',
        sourceBlockId: '203-5A-teach-check-2',
        title: 'Transmission Voltages',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        nextStepId: '203-5a-worked-example-1',
        objective: 'Teach transmission voltages.',
        retrievalText: 'Transmission moves electricity long distances at 400 kV, 275 kV and 132 kV. High voltage reduces current and lowers losses.',
        completionMode: 'respond',
        basicQuestions: [
          { questionText: 'What are the three UK transmission voltages?', answerGuidance: ['400 kV', '275 kV', '132 kV'] },
          { questionText: 'What does kV mean?', answerGuidance: ['Kilovolt', '1000 volts'] },
          { questionText: 'Why use high voltage?', answerGuidance: ['Reduces current', 'Reduces losses'] },
        ],
        questionText: '1. What are the three UK transmission voltages?\n2. What does kV mean?\n3. Why use high voltage?',
        answerGuidance: ['400 kV', '275 kV', '132 kV', 'Kilovolt', '1000 volts', 'Reduces current', 'Reduces losses'],
        deeperQuestionText: 'Why is 132 kV still transmission and not local distribution?',
        deeperAnswerGuidance: ['132 kV is one of the transmission voltages', 'Distribution uses lower voltages'],
      },
      {
        id: '203-5a-worked-example-1',
        sourceBlockId: '203-5A-worked-example-1',
        title: 'Worked Example',
        role: 'worked_example',
        stage: 'worked_example',
        progressionRule: 'worked_example_feedback',
        nextStepId: '203-5a-guided-practice-1',
        objective: 'Show one worked example.',
        retrievalText: 'Scenario: Categorise a list into generation or transmission.\nStep 1: Identify generation methods.\nStep 2: Identify transmission voltages.\nFinal Result: Generation items are separated from transmission voltages.\nTakeaway: Generation is the source; transmission is the high-voltage movement stage.',
        completionMode: 'respond',
      },
      {
        id: '203-5a-guided-practice-1',
        sourceBlockId: '203-5A-guided-practice-1',
        title: 'Guided Practice',
        role: 'guided_practice',
        stage: 'guided_practice',
        progressionRule: 'auto',
        nextStepId: '203-5a-practice-1',
        objective: 'Guide the learner.',
        retrievalText: 'Use the worked-example categories again.',
        completionMode: 'respond',
        questionText: '1. Biomass 2. 275 kV 3. Wave power 4. 400 kV 5. Hydro-electric',
        answerGuidance: ['Generation items', 'Transmission items'],
      },
      {
        id: '203-5a-practice-1',
        sourceBlockId: '203-5A-practice-1',
        title: 'Practice',
        role: 'practice',
        stage: 'practice',
        progressionRule: 'auto',
        nextStepId: '203-5a-integrative-1',
        objective: 'Check independent understanding.',
        retrievalText: 'Work independently now.',
        completionMode: 'respond',
        questionText: 'Part A: List the three voltages. Part B: Identify the generation methods from the list.',
        answerGuidance: ['400 kV, 275 kV, 132 kV', 'Coal, Gas, Photovoltaic'],
      },
      {
        id: '203-5a-integrative-1',
        sourceBlockId: '203-5A-integrative-1',
        title: 'Integrative Close',
        role: 'integrative',
        stage: 'integrative',
        progressionRule: 'integrative_feedback',
        objective: 'Pull the ideas together.',
        retrievalText: 'Put generation and transmission together in one explanation.',
        completionMode: 'respond',
        questionText: '1) Name three generation methods. 2) Name the three transmission voltages. 3) Explain why high voltage is used.',
        answerGuidance: ['Generation methods', '400 kV, 275 kV, 132 kV', 'High voltage reduces current and losses'],
      },
    ],
  };
}

describe('dynamic lesson scoring', () => {
  it('fails placeholder-thin lessons and caps them to rework', () => {
    const lesson = buildPlaceholderLesson();

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(validation.passed).toBe(false);
    expect(validation.issues.some((issue) => issue.includes('Teach/Check 1 retrieval text is too thin'))).toBe(true);
    expect(validation.issues.some((issue) => issue.includes('Worked example must include real steps'))).toBe(true);
    expect(score.grade).toBe('rework');
    expect(score.total).toBeLessThanOrEqual(45);
  });

  it('penalizes bundled apply-stage tasks with thin guidance', () => {
    const lesson = buildBundledApplyLesson();

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(score.total).toBeLessThan(100);
    expect(score.issues.some((issue) => issue.id === 'GP-2')).toBe(true);
  });
});
