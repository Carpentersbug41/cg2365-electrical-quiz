import { describe, expect, it } from 'vitest';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type { DynamicPlanningPhaseOutput } from '@/lib/dynamicGuidedV2/generation/types';
import type {
  DynamicLessonGenerationScore,
  DynamicLessonGenerationValidation,
} from '@/lib/dynamicGuidedV2/versionStore';
import {
  buildDynamicBasicChecksPrompt,
  buildDynamicRepairPrompt,
  buildDynamicSpacedReviewPrompt,
} from '@/lib/dynamicGuidedV2/generation/prompts';
import {
  __testOnlyDynamicLessonGenerator,
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

function buildChunkFirstLesson(): DynamicGuidedV2Lesson {
  return {
    lessonId: 'test-chunk-first-lesson',
    lessonCode: '203-1A',
    title: 'Statutory and Non-statutory Requirements',
    subject: 'C&G 2365',
    unit: '203',
    audience: 'Level 2 electrical learner',
    tonePrompt: 'Teach clearly.',
    comparisonSource: 'dynamic_generator',
    steps: [
      {
        id: '203-1a-intro',
        sourceBlockId: '203-1A-outcomes',
        title: 'Intro',
        role: 'outcomes',
        stage: 'intro',
        progressionRule: 'auto',
        nextStepId: '203-1a-teach-check-1',
        objective: 'Orient the learner to the lesson.',
        retrievalText: 'This lesson explains statutory and non-statutory requirements used in electrical work.',
        completionMode: 'continue',
      },
      {
        id: '203-1a-teach-check-1',
        sourceBlockId: '203-1A-teach-check-1',
        title: 'Statutory Documents',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        nextStepId: '203-1a-teach-check-2',
        objective: 'Explain what statutory means.',
        retrievalText: 'Statutory documents are backed by law and must be followed in electrical work. HASAWA and EAWR are statutory requirements. If they are ignored, the electrician or employer can face legal action, enforcement, prosecution, or other formal consequences.',
        completionMode: 'respond',
        basicQuestions: [
          { questionText: 'What does statutory mean?' },
          { questionText: 'Name one statutory requirement.' },
          { questionText: 'What can happen if a statutory requirement is ignored?' },
        ],
        deeperQuestionText: 'Why do statutory requirements matter more than simple site preference?',
      },
      {
        id: '203-1a-teach-check-2',
        sourceBlockId: '203-1A-teach-check-2',
        title: 'Non-statutory Documents',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        objective: 'Explain what non-statutory means.',
        completionMode: 'respond',
        retrievalText: 'Non-statutory documents are not law by themselves, but they still matter in practice. BS 7671 is widely used guidance for safe and correct electrical work. Following it helps electricians work to accepted standards and show good technical judgement on site.',
        basicQuestions: [
          { questionText: 'What does non-statutory mean?' },
          { questionText: 'Name one non-statutory document.' },
          { questionText: 'Why is BS 7671 still important?' },
        ],
        deeperQuestionText: 'Why would an electrician still follow a non-statutory document carefully?',
      },
    ],
  };
}

function buildPlanning(titles: string[]): DynamicPlanningPhaseOutput {
  return {
    lessonAim: 'Test lesson aim',
    taskMode: 'respond',
    teachCheckCount: titles.length,
    teachChecks: titles.map((title, index) => ({
      key: `teach-check-${index + 1}`,
      title,
      objective: title,
      conceptFocus: title,
      whyItMatters: title,
      misconceptions: [],
    })),
    workedExampleObjective: 'Worked example',
    guidedPracticeObjective: 'Guided practice',
    practiceObjective: 'Practice',
    integrativeObjective: 'Integrative',
    spacedReviewObjective: 'Spaced review',
    inScope: [],
    outOfScope: [],
    constraints: [],
  };
}

function buildPilotLesson(
  lessonCode: string,
  title: string,
  teachCheckTitles: string[]
): DynamicGuidedV2Lesson {
  const lessonId = lessonCode.toLowerCase();
  const teachSteps = teachCheckTitles.map((teachTitle, index) => ({
    id: `${lessonId}-teach-check-${index + 1}`,
    sourceBlockId: `${lessonCode}-teach-check-${index + 1}`,
    title: teachTitle,
    role: 'explanation' as const,
    stage: 'teach_check' as const,
    progressionRule: 'feedback_deeper' as const,
    nextStepId: undefined,
    objective: teachTitle,
    completionMode: 'respond' as const,
    basicQuestions: [
      { questionText: 'Placeholder Q1', answerGuidance: ['Placeholder A1'] },
      { questionText: 'Placeholder Q2', answerGuidance: ['Placeholder A2'] },
      { questionText: 'Placeholder Q3', answerGuidance: ['Placeholder A3'] },
    ],
    deeperQuestionText: 'Placeholder deeper question',
    deeperAnswerGuidance: ['Placeholder deeper answer'],
    hint: 'Placeholder hint',
  }));

  return {
    lessonId,
    lessonCode,
    title,
    subject: 'C&G 2365',
    unit: lessonCode.startsWith('202') ? '202' : '203',
    audience: 'Level 2 electrical learner',
    tonePrompt: 'Teach clearly.',
    comparisonSource: 'dynamic_generator',
    artifactVersion: 'thin_guard_rails',
    steps: [
      {
        id: `${lessonId}-intro`,
        sourceBlockId: `${lessonCode}-outcomes`,
        title: 'Intro',
        role: 'outcomes',
        stage: 'intro',
        progressionRule: 'auto',
        nextStepId: teachSteps[0]?.id,
        objective: 'Intro',
        completionMode: 'continue',
      },
      ...teachSteps,
      {
        id: `${lessonId}-worked-example-1`,
        sourceBlockId: `${lessonCode}-worked-example-1`,
        title: 'Worked Example',
        role: 'worked_example',
        stage: 'worked_example',
        progressionRule: 'worked_example_feedback',
        nextStepId: `${lessonId}-guided-practice-1`,
        objective: 'Worked Example',
        completionMode: 'respond',
      },
      {
        id: `${lessonId}-guided-practice-1`,
        sourceBlockId: `${lessonCode}-guided-practice-1`,
        title: 'Guided Practice',
        role: 'guided_practice',
        stage: 'guided_practice',
        progressionRule: 'auto',
        nextStepId: `${lessonId}-practice-1`,
        objective: 'Guided Practice',
        completionMode: 'respond',
        questionText: 'Placeholder guided question',
        answerGuidance: ['Placeholder guided answer'],
      },
      {
        id: `${lessonId}-practice-1`,
        sourceBlockId: `${lessonCode}-practice-1`,
        title: 'Practice',
        role: 'practice',
        stage: 'practice',
        progressionRule: 'auto',
        nextStepId: `${lessonId}-integrative-1`,
        objective: 'Practice',
        completionMode: 'respond',
        questionText: 'Placeholder practice question',
        answerGuidance: ['Placeholder practice answer'],
      },
      {
        id: `${lessonId}-integrative-1`,
        sourceBlockId: `${lessonCode}-integrative-1`,
        title: 'Integrative Close',
        role: 'integrative',
        stage: 'integrative',
        progressionRule: 'integrative_feedback',
        objective: 'Integrative Close',
        completionMode: 'respond',
        questionText: 'Placeholder integrative question',
        answerGuidance: ['Placeholder integrative answer'],
      },
    ],
  };
}

// Retained for fast local scenario debugging of neighbouring-question leakage.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildContaminatedGuidanceLesson(): DynamicGuidedV2Lesson {
  const lesson = buildBundledApplyLesson();
  const teachCheck = lesson.steps.find((step) => step.stage === 'teach_check');
  if (!teachCheck || !teachCheck.basicQuestions) {
    throw new Error('Expected teach_check step in test lesson.');
  }
  teachCheck.title = 'Earthing System Types';
  teachCheck.basicQuestions = [
    {
      questionText: "In a TN-S system, what does the letter 'S' stand for?",
      answerGuidance: ['Separate', 'TT Earthing System'],
    },
    {
      questionText: 'Which earthing system uses a local earth electrode?',
      answerGuidance: ['TT Earthing System'],
    },
    {
      questionText: 'Where are neutral and earth separated in a TN-C-S system?',
      answerGuidance: ["Consumer's main cut-out"],
    },
  ];
  teachCheck.questionText = teachCheck.basicQuestions.map((question, index) => `${index + 1}. ${question.questionText}`).join('\n');
  teachCheck.answerGuidance = teachCheck.basicQuestions.flatMap((question) => question.answerGuidance);
  return lesson;
}

describe('dynamic generation normalization regressions', () => {
  it('uses Phase 4 to generate authored questions only', () => {
    const prompt = buildDynamicBasicChecksPrompt({
      lessonCode: '202-4B',
      title: 'Resistance, Resistivity, and Voltage Drop',
      unit: '202',
      topic: 'Resistance, Resistivity, and Voltage Drop',
      subject: 'C&G 2365',
      audience: 'Level 2 electrical learner',
      tonePrompt: 'Teach clearly.',
      sourceText: 'Resistance, resistivity, and voltage drop.',
      stagePlan: [],
    });

    expect(prompt.user).toContain('questionForm');
    expect(prompt.user).toContain('questionText');
    expect(prompt.user).not.toContain('answerGuidance');
  });

  it('maps opposition to current flow questions to Ohmmeter guidance', () => {
    const guidance = __testOnlyDynamicLessonGenerator.inferInstrumentGuidance(
      'Which instrument should be selected to measure the opposition to current flow in a circuit?',
      {
        terms: [
          { term: 'Ohmmeter', simpleDefinition: 'Measures resistance.', anchor: 'Opposition to flow.' },
          { term: 'Ammeter', simpleDefinition: 'Measures current.', anchor: 'Flow of electricity.' },
        ],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    expect(guidance).toEqual(['Ohmmeter', 'An ohmmeter']);
  });

  it('does not use instrument names for generic concept-definition inference', () => {
    expect(
      __testOnlyDynamicLessonGenerator.inferSpecificTechnicalAnswer(
        'What term describes opposition to current flow in a circuit?'
      )
    ).toBe('Resistance');
  });

  it('maps internal resistance instrument questions to voltmeter and ammeter correctly', () => {
    const vocabulary = {
      terms: [
        { term: 'Voltmeter', simpleDefinition: 'Measures voltage.', anchor: 'Electrical pressure.' },
        { term: 'Ammeter', simpleDefinition: 'Measures current.', anchor: 'Flow of electricity.' },
      ],
      anchorPhrases: [],
      misconceptionTargets: [],
    };

    expect(
      __testOnlyDynamicLessonGenerator.inferInstrumentGuidance(
        'Which measuring instrument is specifically designed with very high internal resistance to measure electrical pressure?',
        vocabulary
      )
    ).toEqual(['Voltmeter', 'A voltmeter']);

    expect(
      __testOnlyDynamicLessonGenerator.inferInstrumentGuidance(
        'Which instrument is designed with very low internal resistance to allow current to flow through it during measurement?',
        vocabulary
      )
    ).toEqual(['Ammeter', 'An ammeter']);
  });

  it('does not treat measurement-point questions as instrument questions', () => {
    const vocabulary = {
      terms: [
        { term: 'Voltmeter', simpleDefinition: 'Measures voltage.', anchor: 'Electrical pressure.' },
        { term: 'Load', simpleDefinition: 'The appliance or part of the circuit using power.', anchor: 'Final connected equipment.' },
      ],
      anchorPhrases: [],
      misconceptionTargets: [],
    };

    expect(
      __testOnlyDynamicLessonGenerator.inferInstrumentGuidance(
        'Where should you measure the voltage drop at the load in this circuit?',
        vocabulary
      )
    ).toBeNull();
  });

  it('binds abbreviation expansions to the canonical full term only', () => {
    const binding = __testOnlyDynamicLessonGenerator.buildExactAnswerBinding(
      'What does the abbreviation PV stand for?',
      ['Photovoltaic', 'PV', 'Photovoltaic generation'],
      {
        terms: [
          { term: 'Photovoltaic', simpleDefinition: 'Generates electricity directly from sunlight.', anchor: 'PV panels on rooftops.' },
          { term: 'Micro-generation', simpleDefinition: 'Small-scale local generation.', anchor: 'Domestic generation.' },
        ],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    expect(binding?.canonicalAnswer).toBe('Photovoltaic');
    expect(binding?.acceptedVariants).toEqual(['Photovoltaic']);
  });

  it('binds specific-term questions to the vocabulary canonical term and filters topic labels', () => {
    const binding = __testOnlyDynamicLessonGenerator.buildExactAnswerBinding(
      'Name one common micro-generation method used on rooftops.',
      ['Photovoltaic', 'Photovoltaic generation', 'PV'],
      {
        terms: [
          { term: 'Photovoltaic', simpleDefinition: 'A generation method that converts sunlight directly into electricity.', anchor: 'Used on rooftops as solar panels.' },
          { term: 'Micro-generation', simpleDefinition: 'Small-scale local generation.', anchor: 'Domestic supply.' },
        ],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    expect(binding?.canonicalAnswer).toBe('Photovoltaic');
    expect(binding?.acceptedVariants).toEqual(['Photovoltaic', 'Photo-voltaic', 'PV']);
    expect(binding?.acceptedVariants).not.toContain('Photovoltaic generation');
  });

  it('binds loss-of-electrical-pressure definition questions to Voltage Drop', () => {
    const packet = __testOnlyDynamicLessonGenerator.buildCanonicalAnswerPacket(
      'What term describes the reduction in electrical pressure as current passes through the resistance of a circuit?',
      ['Ohm', 'Ohms', 'Ω'],
      {
        terms: [
          { term: 'Voltage Drop', simpleDefinition: 'The reduction in electrical pressure along a conductor.', anchor: 'Electrical pressure is used up through resistance.' },
          { term: 'Resistance', simpleDefinition: 'Opposition to current flow.', anchor: 'Measured in ohms.' },
        ],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    expect(packet).toEqual({
      questionType: 'exact_term',
      canonicalAnswer: 'Voltage Drop',
      acceptedVariants: ['Voltage Drop'],
      conceptPoints: [],
    });
  });

  it('classifies generation questions into reusable question types', () => {
    expect(
      __testOnlyDynamicLessonGenerator.classifyGenerationQuestionType(
        'What does PV stand for?',
        ['Photovoltaic']
      )
    ).toBe('abbreviation_expansion');
    expect(
      __testOnlyDynamicLessonGenerator.classifyGenerationQuestionType(
        'What is the unit of resistance?',
        ['Ohm']
      )
    ).toBe('unit');
    expect(
      __testOnlyDynamicLessonGenerator.classifyGenerationQuestionType(
        'Using one short explanation, explain why high voltage reduces losses.',
        ['lower current', 'less heat loss']
      )
    ).toBe('short_explanation');
  });

  it('builds canonical answer packets for exact-term and explanation questions', () => {
    const exactPacket = __testOnlyDynamicLessonGenerator.buildCanonicalAnswerPacket(
      'What is the name of the dense central part of an atom?',
      ['Atom'],
      {
        terms: [
          { term: 'Nucleus', simpleDefinition: 'The dense central region of an atom.', anchor: 'Contains protons and neutrons.' },
        ],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    const explanationPacket = __testOnlyDynamicLessonGenerator.buildCanonicalAnswerPacket(
      'Using one short explanation, explain why long-distance transmission uses very high voltage.',
      ['High voltage reduces current, so less energy is lost as heat and the transfer is more efficient.'],
      { terms: [], anchorPhrases: [], misconceptionTargets: [] }
    );

    expect(exactPacket).toMatchObject({
      questionType: 'definition_to_name',
      canonicalAnswer: 'Nucleus',
      acceptedVariants: ['Nucleus'],
    });
    expect(explanationPacket?.questionType).toBe('short_explanation');
    expect(explanationPacket?.conceptPoints.length).toBeGreaterThan(1);
  });

  it('detects deeper questions that are too similar in intent', () => {
    expect(
      __testOnlyDynamicLessonGenerator.areDeeperQuestionsTooSimilar(
        'Why do statutory requirements matter more than simple site preference?',
        'Why do statutory regulations matter more than normal site preference?'
      )
    ).toBe(true);

    expect(
      __testOnlyDynamicLessonGenerator.areDeeperQuestionsTooSimilar(
        'Why do statutory requirements matter more than simple site preference?',
        'Why would an electrician still follow a non-statutory document carefully?'
      )
    ).toBe(false);
  });

  it('backfills missing deeper questions from the planned chunk focus', () => {
    const planning = buildPlanning(['Resistance', 'Voltage Drop']);
    const explanations = {
      teachChecks: [
        {
          title: 'Resistance',
          objective: 'Explain resistance.',
          teachingPoints: ['Resistance opposes current flow.', 'Higher resistance reduces current for a given voltage.', 'Resistance rises with longer cable length.'],
          keyTerms: ['Resistance'],
          keyIdeas: ['Resistance opposes current flow.'],
          misconceptions: [],
          retrievalTextLines: ['Resistance opposes current flow in a conductor.'],
        },
        {
          title: 'Voltage Drop',
          objective: 'Explain voltage drop.',
          teachingPoints: ['Voltage drop is the reduction in voltage along a cable.', 'Longer runs increase voltage drop.', 'Higher resistance increases voltage drop.'],
          keyTerms: ['Voltage Drop'],
          keyIdeas: ['Voltage drop is a reduction in voltage along a cable.'],
          misconceptions: [],
          retrievalTextLines: ['Voltage drop increases on long, high-resistance cable runs.'],
        },
      ],
    };

    const repaired = __testOnlyDynamicLessonGenerator.backfillMissingDeeperChecks(
      {
        teachChecks: [
          { title: 'Resistance', deeperQuestionText: '' },
          { title: 'Voltage Drop', deeperQuestionText: 'Why does voltage drop matter on a long cable run?' },
        ],
      },
      planning,
      explanations
    );

    expect(repaired.teachChecks[0]?.deeperQuestionText).toMatch(/Why is|How would you explain/i);
    expect(repaired.teachChecks[0]?.deeperQuestionText.length).toBeGreaterThan(10);
    expect(repaired.teachChecks[1]?.deeperQuestionText).toBe('Why does voltage drop matter on a long cable run?');
  });

  it('rejects ambiguous basic questions when the target is not named clearly', () => {
    const planning = buildPlanning(['Resistance and Resistivity']);
    planning.teachChecks[0] = {
      ...planning.teachChecks[0],
      objective: 'Explain resistance and resistivity in a cable.',
      conceptFocus: 'Resistance and resistivity',
      whyItMatters: 'long cable runs and cable material affect voltage drop',
    };
    const explanations = {
      teachChecks: [
        {
          title: 'Resistance and Resistivity',
          objective: 'Explain resistance and resistivity in a cable.',
          teachingPoints: [
            'Resistance increases with longer cable length.',
            'Resistivity is the inherent material property of the conductor.',
            'Higher resistance contributes to voltage drop.',
          ],
          keyTerms: ['Resistance', 'Resistivity', 'Voltage Drop'],
          keyIdeas: ['Resistance and resistivity are different concepts.'],
          misconceptions: [],
          retrievalTextLines: ['Resistance rises with length; resistivity belongs to the material itself.'],
        },
      ],
    };

    const issues = __testOnlyDynamicLessonGenerator.validateBasicChecksPhaseOutput(
      {
        teachChecks: [
          {
            title: 'Resistance and Resistivity',
            basicQuestions: [
              { questionForm: 'term', questionText: 'What physical property is increasing in this scenario?' },
              { questionForm: 'term', questionText: 'What is resistivity?' },
              { questionForm: 'effect', questionText: 'What happens to the supply voltage at the load?' },
            ],
          },
        ],
      },
      planning,
      explanations
    );

    expect(issues).toContain('Teach/check 1 question 1 is ambiguous.');
  });

  it('rejects recall questions that test an untaught target from another generation-method chunk', () => {
    const planning = buildPlanning(['Generation Methods']);
    planning.teachChecks[0] = {
      ...planning.teachChecks[0],
      objective: 'Identify large-scale generation methods.',
      conceptFocus: 'CCGT, Nuclear, Wind, and Solar',
      whyItMatters: 'these are common named generation methods',
    };
    const explanations = {
      teachChecks: [
        {
          title: 'Generation Methods',
          objective: 'Identify large-scale generation methods.',
          teachingPoints: [
            'CCGT uses a gas turbine and a steam turbine together.',
            'Nuclear generation uses nuclear fission to produce heat.',
            'Wind and solar are named renewable generation methods.',
          ],
          keyTerms: ['CCGT', 'Nuclear', 'Wind', 'Solar'],
          keyIdeas: ['Generation methods must be named accurately.'],
          misconceptions: [],
          retrievalTextLines: ['CCGT, Nuclear, Wind, and Solar are the methods taught in this chunk.'],
        },
      ],
    };

    const issues = __testOnlyDynamicLessonGenerator.validateBasicChecksPhaseOutput(
      {
        teachChecks: [
          {
            title: 'Generation Methods',
            basicQuestions: [
              { questionForm: 'term', questionText: 'What generation method uses moving water to drive turbines?' },
              { questionForm: 'term', questionText: 'What generation method uses burning organic material to produce electricity?' },
              { questionForm: 'term', questionText: 'What generation method uses nuclear fission?' },
            ],
          },
        ],
      },
      planning,
      explanations
    );

    expect(issues).toContain('Teach/check 1 question 1 is not answerable from the taught chunk.');
    expect(issues).toContain('Teach/check 1 question 2 is not answerable from the taught chunk.');
  });

  it('splits long explanation guidance into discrete marking points', () => {
    expect(
      __testOnlyDynamicLessonGenerator.splitExplanationGuidancePoints([
        'Higher resistance means more voltage is lost along the conductor, so the voltage drop increases.'
      ])
    ).toEqual([
      'Higher resistance means more voltage is lost along the conductor,',
      'the voltage drop increases',
    ]);
  });

  it('normalizes single-box explain tasks to discrete points instead of one rigid sentence', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeSingleMarkableTask(
      'integrative',
      'Using one short explanation, explain why a long cable run gives a bigger voltage drop.',
      ['Higher resistance means more voltage is lost along the conductor, so the voltage drop increases.']
    );

    expect(normalized.answerGuidance).toEqual([
      'Higher resistance means more voltage is lost along the conductor,',
      'the voltage drop increases',
    ]);
  });

  it('splits long integrative guidance even when the task stem is not phrased as explain', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeRuntimeStep({
      id: 'integrative-paragraph-test',
      sourceBlockId: 'integrative-paragraph-test',
      title: 'Integrative',
      role: 'question',
      stage: 'integrative',
      progressionRule: 'complete',
      objective: 'Link resistivity, CSA, resistance, and voltage drop.',
      completionMode: 'respond',
      questionText: 'Use the scenario to link resistivity, cross-sectional area, total resistance, and voltage drop.',
      answerGuidance: [
        'Higher resistivity increases baseline resistance, a smaller CSA gives a narrower current path, total resistance rises, and the voltage drop becomes greater along the conductor.'
      ],
    });

    expect(normalized.answerGuidance.length).toBeGreaterThan(1);
    expect(normalized.answerGuidance.length).toBeLessThanOrEqual(3);
  });

  it('binds unit questions to deterministic unit answers when the model gives the quantity name instead', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeRuntimeStep({
      id: 'unit-binding-test',
      sourceBlockId: 'unit-binding-test',
      title: 'Teach/Check 1',
      role: 'explanation',
      stage: 'teach_check',
      progressionRule: 'feedback_deeper',
      objective: 'Teach electrical quantities and units.',
      completionMode: 'respond',
      basicQuestions: [
        { questionText: 'What is the unit of resistance?', answerGuidance: ['Resistance'] },
        { questionText: 'What is the unit of current?', answerGuidance: ['Current'] },
        { questionText: 'What is the unit of voltage?', answerGuidance: ['Voltage'] },
      ],
      deeperQuestionText: 'Why do electrical quantities and units need to be kept distinct?',
      deeperAnswerGuidance: ['To avoid technical errors'],
    });

    expect(normalized.basicQuestions?.[0].answerGuidance).toEqual(['Ohm', 'Ohms', 'Ω']);
    expect(normalized.basicQuestions?.[1].answerGuidance).toEqual(['Ampere', 'Amps', 'A']);
    expect(normalized.basicQuestions?.[2].answerGuidance).toEqual(['Volt', 'Volts', 'V']);
  });

  it('rebuilds weak apply output into a concrete learner-facing scenario and question', () => {
    const ensured = __testOnlyDynamicLessonGenerator.ensureApplyOutput(
      {
        lessonCode: '202-4B',
        title: 'Resistance, Resistivity, and Voltage Drop',
        unit: '202',
        topic: 'Resistance, Resistivity, and Voltage Drop',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'Resistance, resistivity, and voltage drop.',
        stagePlan: [],
      },
      {
        lessonAim: 'Explain resistance, resistivity, and voltage drop.',
        inScope: ['Resistance', 'Resistivity', 'Voltage Drop'],
        outOfScope: [],
        constraints: [],
        misconceptions: [],
        teachChecks: [],
        workedExampleObjective: 'Demonstrate voltage drop in one concrete case.',
        guidedPracticeObjective: 'Identify the effect of resistance and resistivity in a long cable run.',
        practiceObjective: 'Identify the same electrical effect independently in a new cable scenario.',
        integrativeObjective: 'Link the concepts together.',
      },
      {
        title: 'Worked Example',
        objective: 'Demonstrate voltage drop in one case.',
        retrievalTextLines: [
          'Scenario: A 50-metre cable run has a total resistance of 0.4 Ohms and carries 20 A.',
          'Takeaway: Higher resistance causes a larger voltage drop.',
        ],
      },
      {
        guidedPractice: {
          title: 'Guided Practice',
          objective: 'Identify the effect of resistance and resistivity in a long cable run.',
          retrievalTextLines: ['Use the same method as the worked example, but apply it to one new case.'],
          questionText: 'Using the scenario only, identify the single best technical answer.',
        },
        practice: {
          title: 'Practice',
          objective: 'Identify the same electrical effect independently in a new cable scenario.',
          retrievalTextLines: ['Now answer independently using the same lesson method without the worked example in front of you.'],
          questionText: 'From the scenario, identify the specific technical answer that best fits.',
        },
      }
    );

    expect(ensured.guidedPractice.retrievalTextLines[0]).toContain('Scenario:');
    expect(ensured.guidedPractice.questionText).toMatch(/supply voltage|voltage drop/i);
    expect(ensured.practice.retrievalTextLines[0]).toContain('Scenario:');
    expect(ensured.practice.questionText).toMatch(/supply voltage|voltage drop/i);
  });

  it('rewrites a legal-status guided-practice fallback into an explicit legal-status question', () => {
    const rewritten = __testOnlyDynamicLessonGenerator.buildQuestionOnlyApplyQuestion({
      stage: 'guided_practice',
      objective: 'Identify the legal status of HASAWA from a mixed document scenario.',
      retrievalTextLines: [
        'Scenario: One document is an Act of Parliament and another is technical guidance used by electricians.',
      ],
      planning: {
        lessonAim: 'Explain statutory and non-statutory regulations.',
        inScope: ['HASAWA', 'Statutory', 'Non-statutory'],
        outOfScope: [],
        constraints: [],
        misconceptions: [],
        teachChecks: [],
        workedExampleObjective: 'Demonstrate the difference in one concrete case.',
        guidedPracticeObjective: 'Identify the legal status of HASAWA from a mixed document scenario.',
        practiceObjective: 'Apply the distinction independently.',
        integrativeObjective: 'Link the regulation hierarchy together.',
      },
      input: {
        lessonCode: '203-1A',
        title: 'Statutory and Non-statutory Regulations',
        unit: '203',
        topic: 'Statutory and Non-statutory Regulations',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'HASAWA is statutory. BS 7671 is non-statutory.',
        stagePlan: [],
      },
    });

    expect(rewritten).toBe('What is the legal status of HASAWA in this scenario?');
  });

  it('rewrites vague integrative instrument prompts into a markable instrument question', () => {
    const rewritten = __testOnlyDynamicLessonGenerator.normalizeSingleMarkableTask(
      'integrative',
      'Using the scenario only, identify the single best technical answer.',
      ['Voltmeter for Voltage']
    );

    expect(rewritten.questionText).toContain('which instrument should you use to measure voltage');
    expect(rewritten.answerGuidance[0]).toContain('Voltmeter');
  });

  it('rewrites generic technical-answer apply prompts into a concrete learner-facing question', () => {
    const rewritten = __testOnlyDynamicLessonGenerator.normalizeSingleMarkableTask(
      'guided_practice',
      'Using the scenario only, identify the single best technical answer.',
      ['Voltage Drop']
    );

    expect(rewritten.questionText).toBe('Using the scenario, identify the term for the loss of electrical pressure in the circuit.');
    expect(rewritten.answerGuidance).toEqual(['Voltage Drop']);
  });

  it('applies canonical exact-term binding to practice steps after task normalization', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeRuntimeStep({
      id: 'test-practice',
      sourceBlockId: 'test-practice',
      title: 'Practice',
      role: 'practice',
      stage: 'practice',
      progressionRule: 'auto',
      objective: 'Identify the material property.',
      completionMode: 'respond',
      keyTerms: ['Resistance', 'Resistivity', 'Voltage Drop'],
      anchorFacts: ['Resistivity is the material property that causes different materials to oppose current differently.'],
      questionText: "Which term describes the inherent material property that causes Reel B to have higher resistance than Reel A?",
      answerGuidance: ['Material Property'],
    });

    expect(normalized.answerGuidance).toEqual(['Resistivity']);
  });

  it('maps exact-term technical questions to deterministic answers', () => {
    expect(
      __testOnlyDynamicLessonGenerator.inferSpecificTechnicalAnswer("What does the 'PV' stand for in a domestic generation system?")
    ).toBe('Photovoltaic');
    expect(
      __testOnlyDynamicLessonGenerator.inferSpecificTechnicalAnswer(
        'What specific material is used as insulation inside an MICC cable?'
      )
    ).toBe('Magnesium Oxide');
    expect(
      __testOnlyDynamicLessonGenerator.inferSpecificTechnicalAnswer(
        'What term is used for the generation method that involves burning organic materials to produce electricity?'
      )
    ).toBe('Biomass');
  });

  it('keeps exact-term guidance tight for photovoltaic answers', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeRuntimeStep({
      id: 'pv-term-test',
      sourceBlockId: 'pv-term-test',
      title: 'Micro-Generation and Local Supply',
      role: 'explanation',
      stage: 'teach_check',
      progressionRule: 'feedback_deeper',
      objective: 'Identify one named rooftop micro-generation method.',
      completionMode: 'respond',
      keyTerms: ['Photovoltaic', 'PV'],
      anchorFacts: ['Photovoltaic means generating electricity directly from sunlight.'],
      basicQuestions: [
        {
          questionText: 'Name one common micro-generation method used on rooftops.',
          answerGuidance: ['Photovoltaic', 'PV', 'Photovoltaic generation'],
        },
        {
          questionText: 'What does the abbreviation PV stand for?',
          answerGuidance: ['Photovoltaic', 'PV'],
        },
        {
          questionText: 'What does micro-generation mean?',
          answerGuidance: ['small-scale local generation'],
        },
      ],
      deeperQuestionText: 'Why is photovoltaic generation classed as micro-generation when used on a house?',
      deeperAnswerGuidance: ['it is small-scale', 'it is local'],
    });

    expect(normalized.basicQuestions?.[0].answerGuidance).toEqual(['Photovoltaic', 'Photo-voltaic', 'PV']);
  });

  it('rewrites fault-path outputs before generic single-target collapse', () => {
    const rewritten = __testOnlyDynamicLessonGenerator.normalizeSingleMarkableTask(
      'integrative',
      'State the specific component name.',
      ['The current travels from the socket casing through the CPC to the MET and then through the earthing conductor to Earth.']
    );

    expect(rewritten.questionText).toContain('fault path');
    expect(rewritten.answerGuidance[0]).toContain('CPC');
  });

  it('rewrites weak calculation tasks into markable calculation prompts with numbers', () => {
    const rewritten = __testOnlyDynamicLessonGenerator.normalizeRuntimeStep({
      id: 'calc-step',
      sourceBlockId: 'calc-step',
      title: 'Integrative Close: Motor Circuit Calculation',
      role: 'integrative',
      stage: 'integrative',
      progressionRule: 'integrative_feedback',
      objective: 'Solve a practical calculation.',
      completionMode: 'respond',
      questionText: 'Using one short explanation, explain why 50A is the correct technical answer for this 50 scenario.',
      answerGuidance: ['50', '50A'],
      hint: 'First, convert 9.2 kW to 9200 Watts. Transpose the formula to I = P / V to find the current. Finally, multiply that current by 1.25 (which represents 125%).',
      taskSkeleton: {
        scenario: 'To solve complex electrical tasks, you must combine multiple mathematical steps.',
        steps: [
          'First, ensure units are compatible.',
          'Second, use transposition to isolate your unknown variable.',
        ],
        requiredOutputs: ['50', '50A'],
      },
    });

    expect(rewritten.questionText).toBe('Calculate the final design current in Amps for this motor circuit.');
    expect(rewritten.taskSkeleton?.scenario).toContain('9.2kW');
    expect(rewritten.answerGuidance).toContain('40 * 1.25 = 50');
  });

  it('applies deterministic calculation templates to 202-1A pilot lessons', () => {
    const planning = buildPlanning([
      'Fractions, Percentages, and Indices',
      'Algebra and Transposition',
      'Triangles and Trigonometry',
      'Statistics in Electrical Work',
    ]);
    const lesson = buildPilotLesson('202-1A', 'Mathematical Principles for Electrical Work', planning.teachChecks.map((item) => item.title));

    const compiled = __testOnlyDynamicLessonGenerator.applyPilotFamilyCompiler(
      {
        lessonCode: '202-1A',
        title: 'Mathematical Principles for Electrical Work',
        unit: '202',
        topic: 'Mathematical Principles for Electrical Work',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'Fractions, algebra, trigonometry, and statistics.',
      },
      planning,
      lesson
    );

    const fractionsStep = compiled.steps.find((step) => step.title === 'Fractions, Percentages, and Indices');
    const algebraStep = compiled.steps.find((step) => step.title === 'Algebra and Transposition');
    const statisticsStep = compiled.steps.find((step) => step.title === 'Statistics in Electrical Work');
    const integrativeStep = compiled.steps.find((step) => step.stage === 'integrative');

    expect(fractionsStep?.basicQuestions?.[0].answerGuidance).toContain('1000');
    expect(algebraStep?.basicQuestions?.[0].answerGuidance).toContain('Subject');
    expect(statisticsStep?.basicQuestions?.[1].answerGuidance).toEqual(['Median']);
    expect(integrativeStep?.questionText).toBe('Calculate the final design current in Amps for this motor circuit.');
    expect(integrativeStep?.answerGuidance).toContain('40 * 1.25 = 50');
  });

  it('keeps 203-1A non-statutory anchors aligned to the taught chunk content', () => {
    const planning = buildPlanning([
      'Statutory Regulations',
      'Non-statutory Regulations and Guidance',
      'The Statutory List',
      'Acts and Guidance',
    ]);
    const lesson = buildPilotLesson('203-1A', 'Statutory and Non-statutory Requirements', planning.teachChecks.map((item) => item.title));

    const compiled = __testOnlyDynamicLessonGenerator.applyPilotFamilyCompiler(
      {
        lessonCode: '203-1A',
        title: 'Statutory and Non-statutory Requirements',
        unit: '203',
        topic: 'Statutory and Non-statutory Requirements',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'HASAWA and EAWR are statutory. BS 7671 is non-statutory guidance.',
      },
      planning,
      lesson
    );

    const nonStatutoryStep = compiled.steps.find((step) => step.title === 'Non-statutory Regulations and Guidance');

    expect(nonStatutoryStep?.keyIdeas?.join(' ')).not.toContain('absolute');
    expect(nonStatutoryStep?.anchorFacts?.join(' ')).not.toContain('Absolute');
    expect(nonStatutoryStep?.anchorFacts).toContain('BS 7671 is non-statutory guidance.');
  });

  it('normalizes electrical acronym drift from the grounded vocabulary', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1] = {
      ...lesson.steps[1],
      retrievalText: 'HASWA and EAWR are statutory requirements.',
      keyTerms: ['HASWA', 'EAWR'],
      anchorFacts: ['HASWA is statutory.'],
      basicQuestions: [{ questionText: 'What does HASWA stand for?' }],
      deeperQuestionText: 'Why does HASWA matter on site?',
    };

    const normalized = __testOnlyDynamicLessonGenerator.normalizeCanonicalTechnicalTermsInLesson(
      lesson,
      {
        lessonCode: '203-1A',
        title: 'Statutory and Non-statutory Requirements',
        unit: '203',
        topic: 'Statutory and Non-statutory Requirements',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'HASAWA and EAWR are statutory requirements.',
      },
      {
        terms: [
          {
            term: 'HASAWA',
            simpleDefinition: 'Health and Safety at Work etc. Act 1974',
            anchor: 'Main workplace safety Act.',
          },
          {
            term: 'EAWR',
            simpleDefinition: 'Electricity at Work Regulations',
            anchor: 'Electrical safety regulations.',
          },
        ],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    expect(normalized.steps[1]?.retrievalText).toContain('HASAWA');
    expect(normalized.steps[1]?.retrievalText).not.toContain('HASWA ');
    expect(normalized.steps[1]?.basicQuestions?.[0]?.questionText).toBe('What does HASAWA stand for?');
    expect(normalized.steps[1]?.keyTerms).toContain('HASAWA');
  });

  it('does not apply electrical protected terms to non-electrical subjects without lesson-local support', () => {
    const lesson = buildChunkFirstLesson();
    lesson.subject = 'Biology';
    lesson.steps[1] = {
      ...lesson.steps[1],
      retrievalText: 'HASWA appears here as unrelated stray text.',
      keyTerms: ['HASWA'],
    };

    const normalized = __testOnlyDynamicLessonGenerator.normalizeCanonicalTechnicalTermsInLesson(
      lesson,
      {
        lessonCode: 'BIO-1A',
        title: 'Cell Structure',
        unit: 'Biology',
        topic: 'Cell Structure',
        subject: 'Biology',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'Cells contain DNA and RNA.',
      },
      {
        terms: [
          {
            term: 'DNA',
            simpleDefinition: 'Genetic material',
            anchor: 'Found in the nucleus.',
          },
        ],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    expect(normalized.steps[1]?.retrievalText).toContain('HASWA');
    expect(normalized.steps[1]?.keyTerms).toContain('HASWA');
  });

  it('applies deterministic earthing templates to 203-4A pilot lessons', () => {
    const planning = buildPlanning([
      'Core ADS Components',
      'Main and Supplementary Bonding',
      'TT Earthing Systems',
      'TN-S and TN-C-S Systems',
      'CPC and Earthing Conductor',
    ]);
    const lesson = buildPilotLesson('203-4A', 'Earthing Systems and ADS Components', planning.teachChecks.map((item) => item.title));

    const compiled = __testOnlyDynamicLessonGenerator.applyPilotFamilyCompiler(
      {
        lessonCode: '203-4A',
        title: 'Earthing Systems and ADS Components',
        unit: '203',
        topic: 'Earthing Systems and ADS Components',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'TT, TN-S, TN-C-S, CPC, bonding, earthing conductor.',
      },
      planning,
      lesson
    );

    const tnStep = compiled.steps.find((step) => step.title === 'TN-S and TN-C-S Systems');
    const integrativeStep = compiled.steps.find((step) => step.stage === 'integrative');

    expect(tnStep?.basicQuestions?.[0].answerGuidance).toContain('Separate');
    expect(tnStep?.basicQuestions?.[2].answerGuidance).toContain('PEN conductor');
    expect(integrativeStep?.questionText).toContain('why TT systems usually require an RCD');
  });

  it('applies deterministic generation-method templates to 203-5A pilot lessons', () => {
    const planning = buildPlanning([
      'Transmission Voltage Values',
      'Large-Scale Generation Methods',
      'Micro-Generation and Local Supply',
      'The Logic of High Voltage Transmission',
    ]);
    const lesson = buildPilotLesson('203-5A', 'Electricity Generation and Transmission', planning.teachChecks.map((item) => item.title));

    const compiled = __testOnlyDynamicLessonGenerator.applyPilotFamilyCompiler(
      {
        lessonCode: '203-5A',
        title: 'Electricity Generation and Transmission',
        unit: '203',
        topic: 'Electricity Generation and Transmission',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'Generation: biomass, photovoltaic, micro-generation. Transmission: 400 kV, 275 kV, 132 kV.',
      },
      planning,
      lesson
    );

    const generationStep = compiled.steps.find((step) => step.title === 'Large-Scale Generation Methods');
    const microStep = compiled.steps.find((step) => step.title === 'Micro-Generation and Local Supply');

    expect(generationStep?.basicQuestions?.[2].answerGuidance).toEqual(['Biomass']);
    expect(microStep?.basicQuestions?.[0].answerGuidance).toContain('Photovoltaic');
  });

  it('injects missing teaching anchors from teach-check questions', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeRuntimeStep({
      id: 'teach-check-anchor-test',
      sourceBlockId: 'teach-check-anchor-test',
      title: 'Domestic Wiring Cables',
      role: 'explanation',
      stage: 'teach_check',
      progressionRule: 'feedback_deeper',
      objective: 'Teach the common domestic wiring cable name.',
      completionMode: 'respond',
      keyTerms: ['Twin and Earth'],
      keyIdeas: ['Domestic wiring cables must be identified correctly.'],
      anchorFacts: ['Domestic installations use a flat profile cable.'],
      basicQuestions: [
        {
          questionText: 'What is the common name for the PVC/PVC flat profile cable used in domestic installations?',
          answerGuidance: ['Twin and Earth'],
        },
        {
          questionText: 'What conductor size is commonly used for a ring final circuit?',
          answerGuidance: ['2.5mm²'],
        },
        {
          questionText: 'What does PVC stand for?',
          answerGuidance: ['Polyvinyl chloride'],
        },
      ],
      questionText:
        '1. What is the common name for the PVC/PVC flat profile cable used in domestic installations?\n2. What conductor size is commonly used for a ring final circuit?\n3. What does PVC stand for?',
      answerGuidance: ['Twin and Earth', '2.5mm²', 'Polyvinyl chloride'],
      deeperQuestionText: 'Why is Twin and Earth commonly chosen for domestic fixed wiring?',
      deeperAnswerGuidance: ['It is a standard flat-profile cable used in domestic fixed wiring.'],
    });

    expect(normalized.anchorFacts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Twin and Earth'),
        expect.stringContaining('Polyvinyl chloride is the correct expansion'),
      ])
    );
  });

  it('compiles multi-point explanation guidance into one cohesive expected answer', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeSingleMarkableTask(
      'integrative',
      'Using one short explanation, explain why TT systems usually require an RCD.',
      ['The earth path through soil has high resistance.', 'Fault current is often too low to trip an MCB or fuse quickly.', 'An RCD can disconnect on imbalance even when the fault current is relatively small.']
    );

    expect(normalized.answerGuidance).toEqual([
      'The earth path through soil has high resistance',
      'Fault current is often too low to trip an MCB or fuse quickly',
      'An RCD can disconnect on imbalance even when the fault current is relatively small',
    ]);
  });

  it('keeps deeper guidance as discrete marking points rather than one concatenated sentence', () => {
    const normalized = __testOnlyDynamicLessonGenerator.normalizeRuntimeStep({
      id: 'deeper-guidance-test',
      sourceBlockId: 'deeper-guidance-test',
      title: 'Teach/Check 1',
      role: 'explanation',
      stage: 'teach_check',
      progressionRule: 'feedback_deeper',
      objective: 'Explain why TT systems usually require an RCD.',
      completionMode: 'respond',
      anchorFacts: ['TT systems have a higher-resistance earth return path than TN systems.'],
      basicQuestions: [
        { questionText: 'Which system normally uses an earth electrode?', answerGuidance: ['TT'] },
        { questionText: 'Which device is commonly used on a TT system?', answerGuidance: ['RCD'] },
        { questionText: 'Does soil give a low-resistance return path?', answerGuidance: ['No'] },
      ],
      deeperQuestionText: 'Why does a TT system usually require an RCD?',
      deeperAnswerGuidance: [
        'earth path resistance is high',
        'fault current is often too low',
        'an RCD can trip on small imbalance current',
      ],
    });

    expect(normalized.deeperAnswerGuidance).toEqual([
      'earth path resistance is high',
      'fault current is often too low',
      'an RCD can trip on small imbalance current',
    ]);
  });

  it('repairs abbreviation-expansion guidance from local step context', () => {
    const repaired = __testOnlyDynamicLessonGenerator.repairQuestionGuidancePair(
      {
        id: 'abbr-step',
        sourceBlockId: 'abbr-step',
        title: 'Regulations',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        objective: 'Expand the abbreviation CDM correctly.',
        completionMode: 'respond',
        keyTerms: ['Construction (Design and Management) Regulations', 'CDM'],
        anchorFacts: ['CDM stands for Construction (Design and Management) Regulations.'],
      },
      'What does CDM stand for?',
      ['CDM']
    );

    expect(repaired).toEqual(['Construction (Design and Management) Regulations']);
  });

  it('repairs abbreviation-expansion guidance from acronym-matched key terms', () => {
    const repaired = __testOnlyDynamicLessonGenerator.repairQuestionGuidancePair(
      {
        id: 'abbr-step-2',
        sourceBlockId: 'abbr-step-2',
        title: 'Regulations',
        role: 'explanation',
        stage: 'teach_check',
        progressionRule: 'feedback_deeper',
        objective: 'Expand COSHH correctly.',
        completionMode: 'respond',
        keyTerms: ['Control of Substances Hazardous to Health', 'Statutory regulations'],
        anchorFacts: ['COSHH is one of the statutory regulations used to control hazardous substances at work.'],
      },
      'What does COSHH stand for?',
      ['Statutory regulations']
    );

    expect(repaired).toEqual(['Control of Substances Hazardous to Health']);
  });

  it('binds code-letter questions even when the stem does not use the word letter', () => {
    const packet = __testOnlyDynamicLessonGenerator.buildCanonicalAnswerPacket(
      'What does the S stand for in TN-S?',
      ['TN-S'],
      {
        terms: [],
        anchorPhrases: [],
        misconceptionTargets: [],
      }
    );

    expect(packet?.acceptedVariants).toEqual(['Separate']);
  });

  it('repairs late-stage system-identification guidance when a component answer leaks in', () => {
    const repaired = __testOnlyDynamicLessonGenerator.repairLateStageStep({
      id: 'late-step',
      sourceBlockId: 'late-step',
      title: 'Practice',
      role: 'practice',
      stage: 'practice',
      progressionRule: 'auto',
      objective: 'Identify TN-C-S from the scenario.',
      completionMode: 'respond',
      keyTerms: ['TN-C-S', 'PEN conductor', 'PME'],
      anchorFacts: ['TN-C-S combines neutral and earth in one conductor before separating them at the intake position.'],
      questionText: 'Which earthing system is described in this scenario?',
      answerGuidance: ['PEN conductor'],
    });

    expect(repaired.answerGuidance).toEqual(['TN-C-S']);
  });

  it('keeps original check questions when the repair phase returns thin chunks', () => {
    const original = {
      teachChecks: [
        {
          title: 'Chunk 1',
          basicQuestions: [
            { questionText: 'What does ADS stand for?', answerGuidance: ['Automatic Disconnection of Supply'] },
            { questionText: 'Which system uses an earth electrode?', answerGuidance: ['TT'] },
            { questionText: 'What does the S stand for in TN-S?', answerGuidance: ['Separate'] },
          ],
          deeperQuestionText: 'Why does ADS need a low-resistance fault path?',
          deeperAnswerGuidance: ['fault current must be high enough', 'device must disconnect quickly'],
          deeperSourceTeachingPointIds: ['TP1', 'TP2'],
          hint: 'Stay with the taught mappings.',
        },
      ],
    };

    const repaired = {
      teachChecks: [
        {
          title: 'Chunk 1',
          basicQuestions: [],
          deeperQuestionText: '',
          deeperAnswerGuidance: [],
          deeperSourceTeachingPointIds: [],
          hint: '',
        },
      ],
    };

    expect(__testOnlyDynamicLessonGenerator.mergeUnderstandingChecks(original, repaired)).toEqual({
      teachChecks: [
        {
          ...original.teachChecks[0],
          deeperQuestionMode: 'synthesis',
        },
      ],
    });
  });

  it('rejects refined lessons that change protected step structure', () => {
    const lesson = buildPlaceholderLesson();
    const brokenCandidate: DynamicGuidedV2Lesson = {
      ...lesson,
      steps: lesson.steps.slice(0, 2),
    };

    expect(__testOnlyDynamicLessonGenerator.preservesLessonStructure(lesson, brokenCandidate)).toBe(false);
  });
});

// Retained for fast local scenario debugging of exact-term drift.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildExactTermDriftLesson(): DynamicGuidedV2Lesson {
  const lesson = buildBundledApplyLesson();
  const teachChecks = lesson.steps.filter((step) => step.stage === 'teach_check');
  const firstTeachCheck = teachChecks[0];
  const secondTeachCheck = teachChecks[1];
  if (!firstTeachCheck?.basicQuestions || !secondTeachCheck?.basicQuestions) {
    throw new Error('Expected teach_check steps in test lesson.');
  }
  firstTeachCheck.title = 'Generation Methods';
  firstTeachCheck.basicQuestions[2] = {
    questionText: 'What specific term is used for small-scale electricity production by individual homeowners or businesses?',
    answerGuidance: ['Micro-generation', 'Small-scale production', 'Homeowner or business generation'],
  };
  firstTeachCheck.questionText = firstTeachCheck.basicQuestions.map((question, index) => `${index + 1}. ${question.questionText}`).join('\n');
  firstTeachCheck.answerGuidance = firstTeachCheck.basicQuestions.flatMap((question) => question.answerGuidance);

  secondTeachCheck.title = 'Transmission Voltages';
  secondTeachCheck.basicQuestions[1] = {
    questionText: 'What does the technical abbreviation kV stand for?',
    answerGuidance: ['Kilovolt', 'Transmission Voltages'],
  };
  secondTeachCheck.questionText = secondTeachCheck.basicQuestions.map((question, index) => `${index + 1}. ${question.questionText}`).join('\n');
  secondTeachCheck.answerGuidance = secondTeachCheck.basicQuestions.flatMap((question) => question.answerGuidance);
  return lesson;
}

describe('dynamic lesson scoring', () => {
  it('fails placeholder-thin lessons and caps them to rework', () => {
    const lesson = buildPlaceholderLesson();

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(validation.passed).toBe(false);
    expect(validation.issues.some((issue) => issue.includes('Teach/Check 1 teaching anchors are too thin'))).toBe(true);
    expect(validation.issues.some((issue) => issue.includes('Worked example must include real steps'))).toBe(true);
    expect(score.grade).toBe('rework');
    expect(score.total).toBeLessThanOrEqual(45);
  });

  it('accepts question-only dynamic lessons without answer-guidance penalties', () => {
    const lesson = __testOnlyDynamicLessonGenerator.stripDynamicLessonAnswers(buildBundledApplyLesson());

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(validation.issues.some((issue) => /answer guidance/i.test(issue))).toBe(false);
    expect(score.issues.some((issue) => /^GP-2$|^CONTAM-|^TERM-/.test(issue.id ?? ''))).toBe(false);
    expect(score.total).toBeLessThan(100);
  });

  it('accepts chunk-first lessons without guided practice, practice, or integrative steps', () => {
    const lesson = buildChunkFirstLesson();

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(validation.passed).toBe(true);
    expect(validation.issues).not.toContain('Missing guided practice step.');
    expect(validation.issues).not.toContain('Missing practice step.');
    expect(validation.issues).not.toContain('Missing integrative step.');
    expect(score.issues.some((issue) => issue.id === 'GP-1' || issue.id === 'PR-1' || issue.id === 'INT-1')).toBe(false);
  });

  it('penalizes duplicate deeper questions across chunks', () => {
    const lesson = buildChunkFirstLesson();
    const secondTeachCheck = lesson.steps.find((step) => step.id === '203-1a-teach-check-2');
    if (!secondTeachCheck) throw new Error('Missing second teach/check step.');
    secondTeachCheck.deeperQuestionText = 'Why do statutory regulations matter more than normal site preference?';

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(score.issues.some((issue) => (issue.id ?? '').startsWith('DQ-DUP-'))).toBe(true);
  });

  it('backfills at least one issue for sub-95 model scores that come back empty', () => {
    const lesson = buildChunkFirstLesson();
    const validation = validateDynamicLesson(lesson);

    const score = __testOnlyDynamicLessonGenerator.buildLessonScore(
      lesson,
      validation,
      {
        total: 92,
        grade: 'strong',
        breakdown: {
          beginnerClarity: 27,
          teachingBeforeTesting: 22,
          markingRobustness: 18,
          alignmentToLO: 15,
          questionQuality: 10,
        },
        issues: [],
        phaseFeedback: [],
        summary: 'The lesson is mostly sound but not yet at the top quality band.',
      },
      false
    );

    expect(score.total).toBe(92);
    expect(score.issues.length).toBeGreaterThanOrEqual(1);
  });

  it('backfills at least five issues for sub-90 model scores that come back empty', () => {
    const lesson = buildChunkFirstLesson();
    const validation = validateDynamicLesson(lesson);

    const score = __testOnlyDynamicLessonGenerator.buildLessonScore(
      lesson,
      validation,
      {
        total: 82,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 23,
          teachingBeforeTesting: 18,
          markingRobustness: 16,
          alignmentToLO: 15,
          questionQuality: 10,
        },
        issues: [],
        phaseFeedback: [],
        summary: 'The lesson remains below the acceptance gate.',
      },
      false
    );

    expect(score.total).toBe(82);
    expect(score.issues.length).toBeGreaterThanOrEqual(5);
  });

  it('carries scorer solutions through to the repair packet requiredFix', () => {
    const lesson = buildChunkFirstLesson();
    const validation = validateDynamicLesson(lesson);

    const score = __testOnlyDynamicLessonGenerator.buildLessonScore(
      lesson,
      validation,
      {
        total: 88,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 25,
          teachingBeforeTesting: 21,
          markingRobustness: 17,
          alignmentToLO: 15,
          questionQuality: 10,
        },
        issues: [
          {
            id: 'ISSUE-1',
            category: 'questionQuality',
            jsonPointers: ['/steps/1/basicQuestions/0/questionText'],
            excerpt: 'Why is balance important?',
            problem: 'This question asks for a theoretical reason, but the chunk objective requires a practical fuse-rating application.',
            whyItMatters: 'The learner is not being asked to perform the intended practical thinking.',
            solution: 'Rewrite this as one direct fuse-rating application question using the chunk scenario.',
            suggestion: 'Rewrite the question.',
          },
        ],
        phaseFeedback: [],
        summary: 'The lesson is usable but still misses the intended application focus.',
      },
      false
    );

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan({}, score, lesson, validation);

    expect(score.issues[0]?.solution).toBe('Rewrite this as one direct fuse-rating application question using the chunk scenario.');
    expect(fixPlan.fixes[0]?.requiredFix).toBe('Rewrite this as one direct fuse-rating application question using the chunk scenario.');
  });

  it('builds deterministic exact-replace patches without using the LLM path', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].anchorFacts = [
      'Transmission raises the voltage before long-distance movement across the grid.',
    ];
    const patchSet = __testOnlyDynamicLessonGenerator.buildDeterministicExactReplacePatchSet(lesson, {
      fieldType: 'anchor_fact',
      repairClass: 'exact_replace',
      repairMode: 'exact_replace',
      severity: 'critical',
      priority: 'high',
      category: 'beginnerClarity',
      phaseKey: lesson.steps[1].id,
      targetPointer: '/steps/1/anchorFacts/0',
      problem: "Factual error. 'Transmission' is the process, not the component. The device is a 'Step-up Transformer'.",
      currentValue: 'Transmission raises the voltage before long-distance movement across the grid.',
      whyCurrentValueFails: "Transmission names the process, not the device.",
      mustPreserve: 'Keep the anchor fact about voltage increase before transmission.',
      requiredFix: 'Remove Transmission and use Step-up Transformer.',
      allowedTerms: ['Step-up Transformer'],
      forbiddenTerms: ['Transmission'],
      sourceEvidence: ['A Step-up Transformer raises voltage before transmission.'],
      badSpan: 'Transmission',
      replacementTarget: 'Step-up Transformer',
    });

    expect(patchSet.patches).toEqual([
      {
        jsonPointer: '/steps/1/anchorFacts/0',
        value: 'Step-up Transformer raises the voltage before long-distance movement across the grid.',
      },
    ]);
  });

  it('penalizes generic question-only guided practice stems', () => {
    const lesson = __testOnlyDynamicLessonGenerator.stripDynamicLessonAnswers(buildBundledApplyLesson());
    const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');
    if (!guidedPractice) throw new Error('Missing guided practice step in test lesson.');
    guidedPractice.objective = 'Identify one specific generation method from the scenario.';
    guidedPractice.retrievalText = 'Scenario: A rooftop array converts sunlight directly into electricity.';
    guidedPractice.questionText = 'Using the scenario only, identify the single best technical answer.';

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(validation.issues).toContain('Guided practice question is missing or generic.');
    expect(score.issues.some((issue) => issue.id === 'GP-QO-1')).toBe(true);
    expect(score.total).toBeLessThan(95);
  });

  it('strips stored answers from dynamic teach/check and apply steps', () => {
    const lesson = __testOnlyDynamicLessonGenerator.stripDynamicLessonAnswers(buildBundledApplyLesson());

    const teachCheck = lesson.steps.find((step) => step.stage === 'teach_check');
    const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');

    expect(teachCheck?.basicQuestions?.every((question) => (question.answerGuidance ?? []).length === 0)).toBe(true);
    expect(teachCheck?.deeperAnswerGuidance).toBeUndefined();
    expect(guidedPractice?.answerGuidance).toBeUndefined();
    expect(guidedPractice?.taskSkeleton?.requiredOutputs).toBeUndefined();
  });

  it('rejects repair patches outside the allowed field surface', () => {
    const lesson = __testOnlyDynamicLessonGenerator.stripDynamicLessonAnswers(buildBundledApplyLesson());
    const patchSet = __testOnlyDynamicLessonGenerator.coerceRepairPatchSet(
      {
        patches: [
          { jsonPointer: '/steps/0/title', value: 'New Intro' },
          { jsonPointer: '/steps/4/questionText', value: 'Which generation method is shown in this scenario?' },
        ],
      },
      ['/steps/4/questionText']
    );

    const issues = __testOnlyDynamicLessonGenerator.validateRepairPatchSet(
      lesson,
      patchSet,
      ['/steps/4/questionText']
    );

    expect(patchSet.patches).toEqual([
      { jsonPointer: '/steps/4/questionText', value: 'Which generation method is shown in this scenario?' },
    ]);
    expect(issues).toEqual([]);
  });

  it('applies repair patches only to the targeted field', () => {
    const lesson = __testOnlyDynamicLessonGenerator.stripDynamicLessonAnswers(buildBundledApplyLesson());
    const originalPractice = lesson.steps.find((step) => step.stage === 'practice');
    const patched = __testOnlyDynamicLessonGenerator.applyRepairPatchSet(lesson, {
      patches: [
        {
          jsonPointer: '/steps/4/questionText',
          value: 'Which generation method is shown in this scenario?',
        },
      ],
    });

    const patchedGuidedPractice = patched.steps.find((step) => step.stage === 'guided_practice');
    const patchedPractice = patched.steps.find((step) => step.stage === 'practice');

    expect(patchedGuidedPractice?.questionText).toBe('Which generation method is shown in this scenario?');
    expect(patchedPractice?.questionText).toBe(originalPractice?.questionText);
    expect(lesson.steps.find((step) => step.stage === 'guided_practice')?.questionText).not.toBe(
      'Which generation method is shown in this scenario?'
    );
  });

  it('splits multi-target fix plan items into single-target repair items using the simplified classes', () => {
    const lesson = buildChunkFirstLesson();
    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);
    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {
        summary: 'patch two fields',
        fixes: [
          {
            priority: 'high',
            category: 'questionQuality',
            repairClass: 'basic_question_rewrite',
            repairMode: 'field_rewrite',
            severity: 'major',
            targetPointers: ['/steps/1/basicQuestions/0/questionText', '/steps/1/basicQuestions/1/questionText'],
            problem: 'Questions are too vague.',
            sourceEvidence: ['Use one direct taught term in each question.'],
          },
        ],
      },
      score,
      lesson,
      validation
    );

    expect(fixPlan.fixes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ targetPointer: '/steps/1/basicQuestions/0/questionText', repairClass: 'basic_question_rewrite' }),
        expect.objectContaining({ targetPointer: '/steps/1/basicQuestions/1/questionText', repairClass: 'basic_question_rewrite' }),
      ])
    );
  });

  it('rejects a weak basic-question rewrite patch', () => {
    const lesson = buildChunkFirstLesson();
    const issues = __testOnlyDynamicLessonGenerator.validateRepairPatchSet(
      lesson,
      {
        patches: [
          {
            jsonPointer: '/steps/1/basicQuestions/0/questionText',
            value: 'Identify and explain the main idea and then compare it.',
          },
        ],
      },
      ['/steps/1/basicQuestions/0/questionText'],
      {
        fieldType: 'basic_question',
        repairClass: 'basic_question_rewrite',
        repairMode: 'field_rewrite',
        phaseKey: 'step-1',
        priority: 'high',
        severity: 'major',
        category: 'questionQuality',
        targetPointer: '/steps/1/basicQuestions/0/questionText',
        problem: 'Basic question is too vague.',
        currentValue: 'What does it do?',
        whyCurrentValueFails: 'Basic question is too vague.',
        mustPreserve: 'Keep the question tied to the chunk objective.',
        requiredFix: 'Rewrite it into one direct single-focus question.',
        allowedTerms: ['regulation', 'law'],
        forbiddenTerms: ['it'],
        sourceEvidence: ['Statutory regulations are legal requirements.'],
      }
    );

    expect(issues.some((issue) => /single-focus basic question/i.test(issue))).toBe(true);
  });

  it('builds a capped repair prompt without full lesson or score dumps', () => {
    const lesson = buildChunkFirstLesson();
    const prompt = buildDynamicRepairPrompt(
      {
        lessonCode: lesson.lessonCode,
        title: lesson.title,
        unit: lesson.unit,
        topic: lesson.title,
        subject: lesson.subject,
        audience: lesson.audience,
        tonePrompt: lesson.tonePrompt,
        sourceText: 'Statutory regulations are legal requirements.',
        stagePlan: [],
      },
      lesson,
      scoreDynamicLesson(lesson, validateDynamicLesson(lesson)),
      { summary: 'repair', fixes: [] },
      {
        fieldType: 'basic_question',
        repairClass: 'basic_question_rewrite',
        repairMode: 'field_rewrite',
        phaseKey: 'step-1',
        priority: 'high',
        severity: 'major',
        category: 'questionQuality',
        targetPointer: '/steps/1/basicQuestions/0/questionText',
        problem: 'Basic question is too vague.',
        currentValue: 'What does it do in the lesson and why is it important in practice?',
        whyCurrentValueFails: 'The question is too vague.',
        mustPreserve: 'Keep it tied to the chunk objective.',
        requiredFix: 'Rewrite it into one direct single-focus question.',
        allowedTerms: ['regulation', 'law', 'guidance', 'statutory', 'non-statutory', 'electrical'],
        forbiddenTerms: ['it', 'thing', 'stuff', 'lesson structure', 'main idea', 'general'],
        sourceEvidence: [
          'Statutory regulations are legal requirements.',
          'Non-statutory guidance supports safe working practice.',
          'Electrical work must follow the relevant legal duties.',
          'A fourth evidence line should be dropped.',
        ],
      },
      []
    );

    expect(prompt.user).not.toContain('Original lesson JSON:');
    expect(prompt.user).not.toContain('Baseline score:');
    expect(prompt.user).not.toContain('Fix plan summary:');
    expect((prompt.user.match(/Evidence \d:/g) ?? []).length).toBe(3);
    expect(prompt.user).not.toContain('A fourth evidence line should be dropped.');
    expect(prompt.user).toContain('Allowed: regulation, law, guidance, statutory, non-statutory');
    expect(prompt.user).not.toContain('electrical');
  });

  it('adds only one short previous-rejection line on fallback repair prompts', () => {
    const lesson = buildChunkFirstLesson();
    const prompt = buildDynamicRepairPrompt(
      {
        lessonCode: lesson.lessonCode,
        title: lesson.title,
        unit: lesson.unit,
        topic: lesson.title,
        subject: lesson.subject,
        audience: lesson.audience,
        tonePrompt: lesson.tonePrompt,
        sourceText: 'Statutory regulations are legal requirements.',
        stagePlan: [],
      },
      lesson,
      scoreDynamicLesson(lesson, validateDynamicLesson(lesson)),
      { summary: 'repair', fixes: [] },
      {
        fieldType: 'deeper_question',
        repairClass: 'deeper_question_rewrite',
        repairMode: 'field_rewrite',
        phaseKey: 'step-2',
        priority: 'high',
        severity: 'major',
        category: 'alignmentToLO',
        targetPointer: '/steps/2/deeperQuestionText',
        problem: 'Deeper question is meta-cognitive.',
        currentValue: 'Why is this lesson important?',
        whyCurrentValueFails: 'It asks about the lesson structure instead of the technical idea.',
        mustPreserve: 'Keep the question tied to the chunk objective.',
        requiredFix: 'Rewrite it into one why/how technical reasoning question.',
        allowedTerms: ['resistance', 'voltage drop'],
        forbiddenTerms: ['lesson structure'],
        sourceEvidence: ['Resistance in a longer cable increases voltage drop.'],
      },
      [],
      'general_fallback',
      { code: 'too_vague', detail: 'No patch was returned for the targeted field.' }
    );

    expect((prompt.user.match(/Previous rejection:/g) ?? []).length).toBe(1);
    expect(prompt.user).toContain('Previous rejection: too_vague: No patch was returned');
  });

  it('derives an exact replacement fix when the score names a wrong theorem and the correct theorem', () => {
    const lesson = buildPlaceholderLesson();
    const teachCheck = lesson.steps.find((step) => step.stage === 'teach_check');
    if (!teachCheck || !teachCheck.basicQuestions?.[0]) throw new Error('Missing teach/check test data.');
    teachCheck.basicQuestions[0].questionText = 'What is the name of the theorem used to calculate the missing side in a right-angled triangle?';
    teachCheck.anchorFacts = ['Hypotenuse is the theorem used to calculate a missing side.'];

    const validation = validateDynamicLesson(lesson);
    const score = {
      total: 80,
      grade: 'usable' as const,
      breakdown: { beginnerClarity: 20, teachingBeforeTesting: 20, markingRobustness: 15, alignmentToLO: 15, questionQuality: 10 },
      issues: [
        {
          id: 'ISSUE-1',
          category: 'alignmentToLO' as const,
          jsonPointers: [],
          excerpt: teachCheck.anchorFacts[0],
          problem: "The lesson incorrectly identifies `Hypotenuse` as the name of the theorem. The theorem is `Pythagoras' Theorem`.",
          whyItMatters: 'The learner is being taught the wrong concept label.',
          alignmentGap: 'GENERAL PEDAGOGY',
          suggestion: 'Replace the wrong term with the correct theorem name.',
        },
      ],
      phaseFeedback: [],
      summary: 'test',
    };

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan({}, score, lesson, validation, {
      lessonCode: lesson.lessonCode,
      lessonTitle: lesson.title,
      unit: lesson.unit,
      topic: lesson.title,
      subject: lesson.subject,
      audience: lesson.audience,
      tonePrompt: lesson.tonePrompt,
      sourceText: "Pythagoras' Theorem is used to calculate a missing side in a right-angled triangle.",
      stagePlan: [],
    });

    expect(
      fixPlan.fixes.some(
        (fix) =>
          fix.repairClass === 'exact_replace' &&
          fix.badSpan === 'Hypotenuse' &&
          (fix.replacementTarget ?? '').includes('Pythagoras')
      )
    ).toBe(true);
  });

  it('normalizes semantic replacement targets that include a leading article before the quoted term', () => {
    const lesson = buildPlaceholderLesson();
    const teachCheck = lesson.steps.find((step) => step.stage === 'teach_check');
    if (!teachCheck) throw new Error('Missing teach/check test data.');
    teachCheck.anchorFacts = ['Transmission raises the voltage before long-distance movement across the grid.'];

    const validation = validateDynamicLesson(lesson);
    const score: DynamicLessonGenerationScore = {
      total: 78,
      grade: 'rework',
      breakdown: {
        beginnerClarity: 20,
        teachingBeforeTesting: 18,
        markingRobustness: 14,
        alignmentToLO: 16,
        questionQuality: 10,
      },
      issues: [
        {
          id: 'ALIGN-2',
          category: 'alignmentToLO',
          jsonPointers: [],
          excerpt: teachCheck.anchorFacts[0],
          problem: "The anchor fact names `Transmission` where the correct device is a `Step-up Transformer`.",
          whyItMatters: 'The learner is being taught the wrong named device.',
          alignmentGap: 'GENERAL PEDAGOGY',
          suggestion: 'Replace the wrong named item with the correct device.',
        },
      ],
      phaseFeedback: [],
      summary: 'test',
    };

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan({}, score, lesson, validation, {
      lessonCode: lesson.lessonCode,
      lessonTitle: lesson.title,
      unit: lesson.unit,
      topic: lesson.title,
      subject: lesson.subject,
      audience: lesson.audience,
      tonePrompt: lesson.tonePrompt,
      sourceText: 'A step-up transformer raises the voltage before long-distance transmission across the grid.',
      stagePlan: [],
    });

    expect(
      fixPlan.fixes.some(
        (fix) =>
          fix.repairClass === 'exact_replace' &&
          fix.badSpan === 'Transmission' &&
          fix.replacementTarget === 'Step-up Transformer'
      )
    ).toBe(true);
  });

  it('accepts an anchor fact patch only when the bad named device is gone and the correct one is present', () => {
    const lesson = buildPlaceholderLesson();
    const teachCheck = lesson.steps.find((step) => step.stage === 'teach_check');
    if (!teachCheck) throw new Error('Missing teach/check test data.');
    teachCheck.anchorFacts = ['Transmission raises the voltage before long-distance movement across the grid.'];

    const issues = __testOnlyDynamicLessonGenerator.validateRepairPatchSet(
      lesson,
      {
        patches: [
          {
            jsonPointer: '/steps/1/anchorFacts/0',
            value: 'A Step-up Transformer raises the voltage before long-distance transmission across the grid.',
          },
        ],
      },
      ['/steps/1/anchorFacts/0'],
      {
        fieldType: 'anchor_fact',
        repairClass: 'exact_replace',
        repairMode: 'exact_replace',
        phaseKey: 'step-1',
        priority: 'high',
        severity: 'critical',
        category: 'alignmentToLO',
        targetPointer: '/steps/1/anchorFacts/0',
        problem: "The anchor fact names 'Transmission' where the correct device is 'Step-up Transformer'.",
        currentValue: 'Transmission raises the voltage before long-distance movement across the grid.',
        whyCurrentValueFails: "The anchor fact names 'Transmission' where the correct device is 'Step-up Transformer'.",
        mustPreserve: 'Keep the chunk aligned to transformer function in the grid.',
        requiredFix: 'Remove Transmission and use Step-up Transformer.',
        allowedTerms: ['Step-up Transformer', 'transmission'],
        forbiddenTerms: ['Transmission'],
        sourceEvidence: ['A step-up transformer raises voltage before transmission.'],
        badSpan: 'Transmission',
        replacementTarget: 'Step-up Transformer',
      }
    );

    expect(issues).toEqual([]);
  });

  it('routes apply-versus-recall score issues to basic_question_rewrite', () => {
    const lesson = buildChunkFirstLesson();
    const validation: DynamicLessonGenerationValidation = { passed: true, issues: [] };
    const score: DynamicLessonGenerationScore = {
      total: 78,
      grade: 'usable',
      breakdown: {
        beginnerClarity: 24,
        teachingBeforeTesting: 18,
        markingRobustness: 15,
        alignmentToLO: 12,
        questionQuality: 9,
      },
      issues: [
        {
          id: 'Q-APPLY-1',
          category: 'alignmentToLO',
          jsonPointers: [],
          excerpt: 'What does statutory mean?',
          problem: 'The chunk objective says learners should apply or calculate, but this question only asks them to name or define a term.',
          whyItMatters: 'The learner is not being asked to use the method or calculation implied by the objective.',
          alignmentGap: 'LO verb mismatch',
          suggestion: 'Rewrite one recall question into a direct apply or calculation question.',
        },
      ],
      phaseFeedback: [],
      summary: 'test',
    };

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {},
      score,
      lesson,
      validation,
      {
        lessonCode: lesson.lessonCode,
        lessonTitle: lesson.title,
        unit: lesson.unit,
        topic: lesson.title,
        subject: lesson.subject,
        audience: lesson.audience,
        tonePrompt: lesson.tonePrompt,
        sourceText: 'Learners calculate and apply statutory requirements to site decisions.',
        stagePlan: [],
      }
    );

    expect(
      fixPlan.fixes.some(
        (fix) =>
          fix.repairClass === 'basic_question_rewrite' &&
          /\/basicQuestions\/\d+\/questionText$/.test(fix.targetPointer)
      )
    ).toBe(true);
  });

  it('keeps a semantic-only repaired candidate as the better draft without treating score-domain swings as automatic rejection', () => {
    const originalScore: DynamicLessonGenerationScore = {
      total: 63,
      grade: 'rework',
      breakdown: {
        beginnerClarity: 14,
        teachingBeforeTesting: 15,
        markingRobustness: 14,
        alignmentToLO: 12,
        questionQuality: 8,
      },
      issues: [
        {
          id: 'ALIGN-1',
          category: 'alignmentToLO',
          jsonPointers: ['/steps/1/anchorFacts/0'],
          excerpt: 'Transmission raises the voltage.',
          problem: "The anchor fact names 'Transmission' where the correct device is 'Step-up Transformer'.",
          suggestion: 'Replace the wrong named item with the correct device.',
        },
      ],
      phaseFeedback: [],
      summary: 'original',
    };
    const candidateScore: DynamicLessonGenerationScore = {
      total: 67,
      grade: 'rework',
      breakdown: {
        beginnerClarity: 12,
        teachingBeforeTesting: 8,
        markingRobustness: 17,
        alignmentToLO: 20,
        questionQuality: 10,
      },
      issues: [],
      phaseFeedback: [],
      summary: 'candidate',
    };

    const decision = __testOnlyDynamicLessonGenerator.compareScores(
      originalScore,
      candidateScore,
      true,
      true,
      true
    );

    expect(decision.accepted).toBe(false);
    expect(decision.acceptedSource).toBe('candidate');
    expect(decision.reason).toContain('Highest repaired score 67 is below the 80 publish floor.');
    expect(decision.regressions).toEqual([]);
  });

  it('publishes a repaired candidate that misses the 90 target but clears the 80 publish floor', () => {
    const originalScore: DynamicLessonGenerationScore = {
      total: 74,
      grade: 'rework',
      breakdown: {
        beginnerClarity: 16,
        teachingBeforeTesting: 16,
        markingRobustness: 14,
        alignmentToLO: 16,
        questionQuality: 12,
      },
      issues: [],
      phaseFeedback: [],
      summary: 'original',
    };
    const candidateScore: DynamicLessonGenerationScore = {
      total: 85,
      grade: 'usable',
      breakdown: {
        beginnerClarity: 24,
        teachingBeforeTesting: 18,
        markingRobustness: 16,
        alignmentToLO: 15,
        questionQuality: 12,
      },
      issues: [],
      phaseFeedback: [],
      summary: 'candidate',
    };

    const decision = __testOnlyDynamicLessonGenerator.compareScores(
      originalScore,
      candidateScore,
      true,
      true,
      true
    );

    expect(decision.accepted).toBe(true);
    expect(decision.acceptedSource).toBe('candidate');
    expect(decision.reason).toContain('below the 90 target but cleared the 80 publish floor');
  });

  it('routes method-teaching gaps to teaching_field_rewrite', () => {
    const lesson = buildBundledApplyLesson();
    const score: DynamicLessonGenerationScore = {
      total: 82,
      grade: 'rework',
      breakdown: {
        beginnerClarity: 20,
        teachingBeforeTesting: 18,
        markingRobustness: 16,
        alignmentToLO: 18,
        questionQuality: 10,
      },
      issues: [
        {
          id: 'TBT-1',
          category: 'teachingBeforeTesting',
          jsonPointers: ['/steps/1/keyIdeas/0'],
          excerpt: 'The answer is 5%.',
          problem: 'The lesson gives the answer but does not explicitly teach the calculation method or working clearly enough.',
          suggestion: 'Teach the method explicitly.',
        },
      ],
      phaseFeedback: [],
      summary: 'repair',
    };
    const descriptor = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      { summary: 'repair', fixes: [] },
      score,
      lesson,
      { passed: true, issues: [] }
    );

    expect(descriptor.fixes[0]?.repairClass).toBe('teaching_field_rewrite');
  });

  it('builds allowed and forbidden repair terms for untaught-target question issues', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].keyTerms = ['CCGT', 'Nuclear', 'Wind', 'Solar'];
    lesson.steps[1].keyIdeas = ['CCGT and nuclear are large-scale generation methods.', 'Wind and solar are renewable methods.'];
    lesson.steps[1].basicQuestions = [
      { questionText: 'Which generation methods are Hydro and Biomass?', answerGuidance: [] },
      { questionText: 'What does CCGT stand for?', answerGuidance: [] },
      { questionText: 'Which method uses uranium fuel?', answerGuidance: [] },
    ];

    const score: DynamicLessonGenerationScore = {
      total: 78,
      grade: 'usable',
      breakdown: {
        beginnerClarity: 20,
        teachingBeforeTesting: 18,
        markingRobustness: 15,
        alignmentToLO: 16,
        questionQuality: 9,
      },
      issues: [
        {
          id: 'ALIGN-2',
          category: 'alignmentToLO',
          jsonPointers: ['/steps/1/basicQuestions/0/questionText'],
          excerpt: 'Which generation methods are Hydro and Biomass?',
          problem: 'The basic question asks about Hydro and Biomass, but these specific methods are not clearly taught in this chunk.',
          suggestion: 'Rewrite the question to use one taught generation method from this chunk only.',
        },
      ],
      phaseFeedback: [],
      summary: 'repair',
    };

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan({}, score, lesson, { passed: true, issues: [] });
    const fix = fixPlan.fixes[0];

    expect(fix?.fieldType).toBe('basic_question');
    expect(fix?.allowedTerms).toEqual(expect.arrayContaining(['CCGT', 'Nuclear', 'Wind', 'Solar']));
    expect(fix?.forbiddenTerms).toEqual(expect.arrayContaining(['Hydro', 'Biomass']));
  });

  it('expands broad basicQuestions score pointers into editable questionText repair targets', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].basicQuestions = [
      { questionText: 'What is CCGT?', answerGuidance: [] },
      { questionText: 'Which method uses water?', answerGuidance: [] },
      { questionText: 'Which method burns organic material?', answerGuidance: [] },
    ];

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {},
      {
        total: 86,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 25,
          teachingBeforeTesting: 22,
          markingRobustness: 17,
          alignmentToLO: 12,
          questionQuality: 10,
        },
        issues: [
          {
            id: 'ISSUE-1',
            category: 'teachingBeforeTesting',
            jsonPointers: ['/steps/1/basicQuestions'],
            excerpt: 'Hydro and Biomass are asked but not taught.',
            problem: 'The teaching content for this step does not cover Hydro and Biomass, but the questions ask about them.',
            whyItMatters: 'The learner is tested on untaught content.',
            solution: 'Rewrite the affected questions so they use only taught generation methods from this chunk.',
            suggestion: 'Rewrite the affected questions so they use only taught generation methods from this chunk.',
          },
        ],
        phaseFeedback: [],
        summary: 'The lesson still tests untaught terms in one chunk.',
      },
      lesson,
      { passed: true, issues: [] }
    );

    expect(fixPlan.fixes.some((fix) => fix.targetPointer === '/steps/1/basicQuestions/0/questionText')).toBe(true);
    expect(fixPlan.fixes.some((fix) => fix.targetPointer === '/steps/1/basicQuestions/1/questionText')).toBe(true);
    expect(fixPlan.fixes.some((fix) => fix.targetPointer === '/steps/1/basicQuestions/2/questionText')).toBe(true);
  });

  it('keeps scorer-derived fallback fixes even when phase 11 returns model fixes', () => {
    const lesson = buildChunkFirstLesson();
    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {
        summary: 'model fixes',
        fixes: [
          {
            repairClass: 'exact_replace',
            category: 'beginnerClarity',
            targetPointer: '/steps/1/anchorFacts/0',
            problem: "Factual error. 'Transmission' is the process, not the component. The device is a 'Step-up Transformer'.",
            currentValue: 'Transmission raises the voltage.',
            requiredFix: 'Replace Transmission with Step-up Transformer.',
          },
        ],
      },
      {
        total: 86,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 24,
          teachingBeforeTesting: 22,
          markingRobustness: 17,
          alignmentToLO: 13,
          questionQuality: 10,
        },
        issues: [
          {
            id: 'ISSUE-1',
            category: 'questionQuality',
            jsonPointers: ['/steps/1/deeperQuestionText'],
            excerpt: 'Why does this lesson matter?',
            problem: "The question is overly broad and 'philosophical', leading to subjective learner responses that are difficult to mark accurately with automated feedback.",
            whyItMatters: 'The learner task is too weak to mark reliably.',
            solution: "Replace with a functional application question: 'If a cable's current capacity is 20A and a derating factor of 0.8 is applied, explain the mathematical steps to find the new capacity.'",
            suggestion: "Replace with a functional application question: 'If a cable's current capacity is 20A and a derating factor of 0.8 is applied, explain the mathematical steps to find the new capacity.'",
          },
        ],
        phaseFeedback: [],
        summary: 'There is still one weak deeper question.',
      },
      lesson,
      { passed: true, issues: [] }
    );

    expect(fixPlan.fixes.some((fix) => fix.repairClass === 'deeper_question_rewrite')).toBe(true);
    expect(fixPlan.fixes.some((fix) => fix.targetPointer === '/steps/1/deeperQuestionText')).toBe(true);
  });

  it('prefers scorer-derived fixes over weaker phase 11 fixes for the same pointer', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].anchorFacts = ['The grid uses the wrong named device here.'];

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {
        summary: 'model fixes',
        fixes: [
          {
            repairClass: 'exact_replace',
            category: 'beginnerClarity',
            targetPointer: '/steps/1/anchorFacts/0',
            problem: "Factual error. The device is a 'Step-up Transformer'.",
            currentValue: 'The grid uses the wrong named device here.',
            requiredFix: 'Replace Transmission with Step-up Transformer.',
          },
        ],
      },
      {
        total: 86,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 24,
          teachingBeforeTesting: 22,
          markingRobustness: 17,
          alignmentToLO: 13,
          questionQuality: 10,
        },
        issues: [
          {
            id: 'ISSUE-1',
            category: 'beginnerClarity',
            jsonPointers: ['/steps/1/anchorFacts/0'],
            excerpt: 'The grid uses the wrong named device here.',
            problem: "Factual error. The device used to increase voltage is a 'Step-up Transformer', not 'Transmission'.",
            whyItMatters: 'The learner is being taught the wrong named device.',
            solution: "Update the anchor fact to: 'A step-up transformer is the device used at power stations to increase voltage for transmission.'",
            suggestion: "Update the anchor fact to: 'A step-up transformer is the device used at power stations to increase voltage for transmission.'",
          },
        ],
        phaseFeedback: [],
        summary: 'One factual anchor fact issue remains.',
      },
      lesson,
      { passed: true, issues: [] }
    );

    expect(fixPlan.fixes[0]?.targetPointer).toBe('/steps/1/anchorFacts/0');
    expect(fixPlan.fixes[0]?.repairClass).toBe('exact_replace');
  });

  it('does not upgrade question rewrites to exact_replace just because the solution text contains replacement phrasing', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].basicQuestions = [
      { questionText: 'Which generation methods are Hydro and Biomass?', answerGuidance: [] },
      { questionText: 'What does CCGT stand for?', answerGuidance: [] },
      { questionText: 'Which method uses uranium fuel?', answerGuidance: [] },
    ];

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {},
      {
        total: 86,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 24,
          teachingBeforeTesting: 22,
          markingRobustness: 17,
          alignmentToLO: 13,
          questionQuality: 10,
        },
        issues: [
          {
            id: 'ISSUE-1',
            category: 'teachingBeforeTesting',
            jsonPointers: ['/steps/1/basicQuestions/0/questionText'],
            excerpt: 'Which generation methods are Hydro and Biomass?',
            problem: 'The teaching content for this step does not cover Hydro and Biomass, but the question asks about them.',
            whyItMatters: 'The learner is tested on untaught content.',
            solution: "Replace the question with one that asks about CCGT only.",
            suggestion: "Replace the question with one that asks about CCGT only.",
          },
        ],
        phaseFeedback: [],
        summary: 'One question tests untaught content.',
      },
      lesson,
      { passed: true, issues: [] }
    );

    expect(fixPlan.fixes[0]?.repairClass).toBe('basic_question_rewrite');
  });

  it('derives exact-replace metadata from the scorer solution when the problem text is less explicit', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].anchorFacts = ['Transmission raises the voltage before long-distance movement across the grid.'];

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {},
      {
        total: 86,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 24,
          teachingBeforeTesting: 22,
          markingRobustness: 17,
          alignmentToLO: 13,
          questionQuality: 10,
        },
        issues: [
          {
            id: 'ISSUE-1',
            category: 'beginnerClarity',
            jsonPointers: ['/steps/1/anchorFacts/0'],
            excerpt: 'Transmission raises the voltage before long-distance movement across the grid.',
            problem: "Factual error: 'Transmission' is a process, not a device. The device is a Step-up Transformer.",
            whyItMatters: 'The learner is being taught the wrong named device.',
            solution: "Replace 'Transmission' with 'Step-up Transformer' in the anchor fact.",
            suggestion: "Replace 'Transmission' with 'Step-up Transformer' in the anchor fact.",
          },
        ],
        phaseFeedback: [],
        summary: 'The lesson is usable but has one factual naming error.',
      },
      lesson,
      { passed: true, issues: [] }
    );

    const exactFix = fixPlan.fixes.find((fix) => fix.repairClass === 'exact_replace');
    expect(exactFix?.badSpan).toBe('Transmission');
    expect(exactFix?.replacementTarget).toBe('Step-up Transformer');
  });

  it('falls back to the full corrected sentence from requiredFix when exact span replacement cannot match the field text', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].anchorFacts = ['The grid uses the wrong named device here.'];

    const patchSet = __testOnlyDynamicLessonGenerator.buildDeterministicExactReplacePatchSet(lesson, {
      phaseKey: 'repair',
      priority: 'high',
      category: 'beginnerClarity',
      targetPointer: '/steps/1/anchorFacts/0',
      problem: "Factual error. The device is a 'Step-up Transformer'.",
      currentValue: 'The grid uses the wrong named device here.',
      fieldType: 'anchor_fact',
      repairClass: 'exact_replace',
      repairMode: 'exact_replace',
      severity: 'critical',
      sourceEvidence: ['A step-up transformer is the device used at power stations to increase voltage for transmission.'],
      whyCurrentValueFails: "The correct sentence should name the 'Step-up Transformer'.",
      mustPreserve: 'Teach the correct named device for raising voltage.',
      requiredFix: "Update the anchor fact to: 'A step-up transformer is the device used at power stations to increase voltage for transmission.'",
      allowedTerms: ['Step-up Transformer', 'transmission'],
      forbiddenTerms: ['Transmission'],
      badSpan: 'Transmission',
      replacementTarget: 'Step-up Transformer',
    });

    expect(patchSet.patches).toEqual([
      {
        jsonPointer: '/steps/1/anchorFacts/0',
        value: 'A step-up transformer is the device used at power stations to increase voltage for transmission.',
      },
    ]);
  });

  it('stores replacementText on exact_replace fixes when the scorer solution contains a corrected sentence', () => {
    const lesson = buildChunkFirstLesson();
    lesson.steps[1].anchorFacts = ['Transmission raises the voltage before long-distance movement across the grid.'];

    const fixPlan = __testOnlyDynamicLessonGenerator.coerceFixPlan(
      {},
      {
        total: 86,
        grade: 'usable',
        breakdown: {
          beginnerClarity: 24,
          teachingBeforeTesting: 22,
          markingRobustness: 17,
          alignmentToLO: 13,
          questionQuality: 10,
        },
        issues: [
          {
            id: 'ISSUE-1',
            category: 'beginnerClarity',
            jsonPointers: ['/steps/1/anchorFacts/0'],
            excerpt: 'Transmission raises the voltage before long-distance movement across the grid.',
            problem: "Factual error. The device used to increase voltage is a 'Step-up Transformer', not 'Transmission'.",
            whyItMatters: 'The learner is being taught the wrong named device.',
            solution: "Change the anchor fact to: 'A Step-up Transformer is the device used at power stations to increase voltage for transmission.'",
            suggestion: "Change the anchor fact to: 'A Step-up Transformer is the device used at power stations to increase voltage for transmission.'",
          },
        ],
        phaseFeedback: [],
        summary: 'One factual issue remains.',
      },
      lesson,
      { passed: true, issues: [] }
    );

    expect(fixPlan.fixes[0]?.repairClass).toBe('exact_replace');
    expect(fixPlan.fixes[0]?.replacementText).toBe(
      'A Step-up Transformer is the device used at power stations to increase voltage for transmission.'
    );
  });

  it('treats awkward but clear question-only guided practice as a soft scoring issue, not a validation failure', () => {
    const lesson = __testOnlyDynamicLessonGenerator.stripDynamicLessonAnswers(buildBundledApplyLesson());
    const guidedPractice = lesson.steps.find((step) => step.stage === 'guided_practice');
    if (!guidedPractice) throw new Error('Missing guided practice step in test lesson.');
    guidedPractice.objective = 'Identify the outcome of resistance in a long cable run based on the material and length.';
    guidedPractice.retrievalText = 'Scenario: You are installing a 50-metre aluminum cable to a remote workshop.';
    guidedPractice.questionText =
      "Following the chain of causality from the worked example, what is the technical term for the 'loss of electrical pressure' that occurs at the end of this 50-metre run?";

    const validation = validateDynamicLesson(lesson);
    const score = scoreDynamicLesson(lesson, validation);

    expect(validation.issues).not.toContain('Guided practice question is missing or generic.');
    expect(score.issues.some((issue) => issue.id === 'GP-QO-1')).toBe(false);
    expect(score.issues.some((issue) => issue.id === 'GP-QO-SOFT-1')).toBe(true);
  });
});

describe('dynamic spaced review grounding', () => {
  it('builds a same-unit fallback packet for a first lesson', () => {
    const grounding = __testOnlyDynamicLessonGenerator.buildSpacedReviewGroundingPacket({
      lessonCode: '203-1A',
      title: 'Statutory and Non-statutory Regulations',
      unit: '203',
      topic: 'Statutory and Non-statutory Regulations',
      subject: 'C&G 2365',
      audience: 'beginner',
      tonePrompt: 'Teach clearly.',
      sourceText: 'Learning outcome: LO1 - Implications of electrical industry regulations',
    });

    expect(grounding.sourceMode).toBe('unit_lo_fallback');
    expect(grounding.loGroups[0]?.sourceLo).toBe('LO1');
    expect(grounding.loGroups[0]?.anchorFacts.length).toBeGreaterThan(0);
  });

  it('validates even spaced review coverage across LO groups', () => {
    const issues = __testOnlyDynamicLessonGenerator.validateSpacedReviewCoverage(
      {
        title: 'Spaced Review',
        objective: 'Review earlier same-unit knowledge.',
        retrievalTextLines: ['Earlier same-unit review.'],
        coveragePlan: [
          { sourceLo: 'LO1', lessonCodes: ['203-1A'], anchorSummary: 'lo1 anchors' },
          { sourceLo: 'LO2', lessonCodes: ['203-2A'], anchorSummary: 'lo2 anchors' },
        ],
        questions: [
          { sourceLo: 'LO1', questionText: 'Q1' },
          { sourceLo: 'LO1', questionText: 'Q2' },
          { sourceLo: 'LO1', questionText: 'Q3' },
          { sourceLo: 'LO1', questionText: 'Q4' },
          { sourceLo: 'LO2', questionText: 'Q5' },
          { sourceLo: 'LO2', questionText: 'Q6' },
          { sourceLo: 'LO2', questionText: 'Q7' },
          { sourceLo: 'LO2', questionText: 'Q8' },
        ],
      },
      {
        unit: '203',
        currentLessonCode: '203-3A',
        sourceMode: 'preceding_lessons',
        loGroups: [
          { sourceLo: 'LO1', lessonCodes: ['203-1A'], anchorFacts: ['Anchor 1'] },
          { sourceLo: 'LO2', lessonCodes: ['203-2A'], anchorFacts: ['Anchor 2'] },
        ],
      }
    );

    expect(issues).toEqual([]);
  });

  it('builds a domain-first spaced review prompt with 8-question output', () => {
    const prompt = buildDynamicSpacedReviewPrompt(
      {
        lessonCode: '203-3A',
        title: 'Circuit Types and Their Purpose',
        unit: '203',
        topic: 'Circuit Types and Their Purpose',
        subject: 'C&G 2365',
        audience: 'beginner',
        tonePrompt: 'Teach clearly.',
        sourceText: 'Learning outcome: LO3 - Circuit types',
      },
      {
        unit: '203',
        currentLessonCode: '203-3A',
        sourceMode: 'preceding_lessons',
        loGroups: [
          { sourceLo: 'LO1', lessonCodes: ['203-1A'], anchorFacts: ['Anchor 1'] },
          { sourceLo: 'LO2', lessonCodes: ['203-2A'], anchorFacts: ['Anchor 2'] },
        ],
      }
    );

    expect(prompt.system).toContain('You are an expert in the City & Guilds 2365 Level 2 Electrical Installation course.');
    expect(prompt.system).not.toContain('You are Phase 8');
    expect(prompt.user).toContain('"coveragePlan"');
    expect(prompt.user).toContain('"questions"');
    expect(prompt.user).toContain('Write exactly 8 spaced review questions.');
  });
});
