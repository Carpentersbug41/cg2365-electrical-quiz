import { describe, expect, it } from 'vitest';
import type { DynamicGuidedV2Step } from '@/lib/dynamicGuidedV2/types';
import { classifyLessonReply, classifyWorkedExampleReadiness } from './runtimeVariant';

function makeTeachCheckStep(overrides?: Partial<DynamicGuidedV2Step>): DynamicGuidedV2Step {
  return {
    id: 'step-1',
    sourceBlockId: 'source-1',
    title: 'Meters',
    role: 'explanation',
    stage: 'teach_check',
    objective: 'Identify instruments and what they measure.',
    completionMode: 'respond',
    basicQuestions: [
      {
        questionText: 'What instrument measures current?',
        answerGuidance: ['Ammeter'],
      },
      {
        questionText: 'What instrument measures voltage?',
        answerGuidance: ['Voltmeter'],
      },
      {
        questionText: 'What instrument measures resistance?',
        answerGuidance: ['Ohmmeter'],
      },
    ],
    deeperQuestionText: 'Why does an ammeter have low internal resistance?',
    deeperAnswerGuidance: ['so it does not significantly affect current flow', 'low resistance'],
    hint: 'The learner may swap the instrument and the quantity being measured.',
    ...overrides,
  };
}

describe('classifyLessonReply', () => {
  it('marks a fully correct basic answer as correct', () => {
    const result = classifyLessonReply(
      makeTeachCheckStep(),
      'Ammeter for current, voltmeter for voltage, and ohmmeter for resistance.',
      'feedback_basic'
    );

    expect(result.replyClass).toBe('correct');
    expect(result.matchedTargets).toEqual(['Ammeter', 'Voltmeter', 'Ohmmeter']);
    expect(result.missingTargets).toEqual([]);
  });

  it('marks a partly correct basic answer as partial', () => {
    const result = classifyLessonReply(
      makeTeachCheckStep(),
      'Ammeter measures current and voltmeter measures voltage.',
      'feedback_basic'
    );

    expect(result.replyClass).toBe('partial');
    expect(result.matchedTargets).toEqual(['Ammeter', 'Voltmeter']);
    expect(result.missingTargets).toEqual(['Ohmmeter']);
    expect(result.recommendedRepairFocus).toBe('Ohmmeter');
  });

  it('marks a clearly wrong exact term as misconception', () => {
    const result = classifyLessonReply(
      makeTeachCheckStep(),
      'Resistance is measured with a wattmeter.',
      'feedback_basic'
    );

    expect(result.replyClass).toBe('misconception');
    expect(result.matchedTargets).toEqual([]);
    expect(result.missingTargets).toEqual(['Ammeter', 'Voltmeter', 'Ohmmeter']);
  });

  it('marks uncertain answers as unclear', () => {
    const result = classifyLessonReply(makeTeachCheckStep(), "I don't know", 'feedback_basic');

    expect(result.replyClass).toBe('unclear');
    expect(result.matchedTargets).toEqual([]);
    expect(result.missingTargets).toEqual(['Ammeter', 'Voltmeter', 'Ohmmeter']);
  });

  it('uses deeper targets for deeper feedback classification', () => {
    const result = classifyLessonReply(
      makeTeachCheckStep(),
      'Because it has low resistance so it does not affect current flow much.',
      'feedback_deeper'
    );

    expect(result.replyClass).toBe('correct');
    expect(result.matchedTargets).toEqual([
      'so it does not significantly affect current flow',
      'low resistance',
    ]);
  });
});

describe('classifyWorkedExampleReadiness', () => {
  it('marks clear readiness as ready', () => {
    const result = classifyWorkedExampleReadiness(
      makeTeachCheckStep({
        role: 'worked_example',
        stage: 'worked_example',
        taskSkeleton: { takeaway: 'Low resistance in an ammeter stops it from changing the circuit too much.' },
      }),
      'Yes, that makes sense now. I am ready.'
    );

    expect(result.readiness).toBe('ready');
  });

  it('marks uncertainty as needs_support', () => {
    const result = classifyWorkedExampleReadiness(
      makeTeachCheckStep({
        role: 'worked_example',
        stage: 'worked_example',
        taskSkeleton: { takeaway: 'Low resistance in an ammeter stops it from changing the circuit too much.' },
      }),
      'Not yet, can you explain that again?'
    );

    expect(result.readiness).toBe('needs_support');
    expect(result.recommendedSupportFocus).toContain('Low resistance');
  });
});
