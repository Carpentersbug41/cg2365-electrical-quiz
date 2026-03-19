import type { DynamicGuidedV2Lesson, DynamicGuidedV2Step } from '@/lib/dynamicGuidedV2/types';
import { lesson2034AFromV1 } from '@/data/dynamic-guided-v2/2365/lesson2034AFromV1';
import { lesson2034CFromV1 } from '@/data/dynamic-guided-v2/2365/lesson2034CFromV1';
import { lesson2034L1EFromV1 } from '@/data/dynamic-guided-v2/2365/lesson2034L1EFromV1';

const lessons: Record<string, DynamicGuidedV2Lesson> = {
  '203-4A': lesson2034AFromV1,
  '203-4C': lesson2034CFromV1,
  '203-4L1E': lesson2034L1EFromV1,
};

function buildTeachCheckQuestions(step: DynamicGuidedV2Step): string {
  if (step.basicQuestions?.length) {
    return step.basicQuestions
      .map((question, index) => `${index + 1}. ${question.questionText}`)
      .join('\n');
  }
  return step.questionText ?? '';
}

function buildTeachCheckAnswerTargets(step: DynamicGuidedV2Step): string[] {
  if (step.answerGuidance?.length) {
    return step.answerGuidance;
  }
  if (step.basicQuestions?.length) {
    return Array.from(
      new Set(
        step.basicQuestions
          .flatMap((question) => question.answerGuidance)
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );
  }
  return [];
}

export function loadDynamicGuidedV2Lesson(lessonCode: string): DynamicGuidedV2Lesson | null {
  return lessons[lessonCode] ?? null;
}

export function loadDynamicGuidedV2LessonStep(lessonCode: string, stepIndex: number): DynamicGuidedV2Step | null {
  const lesson = loadDynamicGuidedV2Lesson(lessonCode);
  if (!lesson) return null;
  return lesson.steps[stepIndex] ?? null;
}

export function getDynamicGuidedV2LessonStepCount(lessonCode: string): number {
  const lesson = loadDynamicGuidedV2Lesson(lessonCode);
  return lesson?.steps.length ?? 0;
}

export function buildDynamicGuidedV2SectionAttachmentFromLesson(
  lesson: DynamicGuidedV2Lesson,
  stepIndex: number,
  turnStage: 'teach' | 'feedback' = 'teach'
): {
  filename: string;
  text: string;
  stepTitle: string;
  stepStage: string;
  stepRole: string;
  completionMode: 'continue' | 'respond';
  stepIndex: number;
  totalSteps: number;
} | null {
  const step = lesson.steps[stepIndex];
  if (!step) return null;

  const label =
    turnStage === 'feedback'
      ? 'Retrieved lesson section for feedback'
      : 'Retrieved lesson section for teaching';

  const stageSpecificText =
    turnStage === 'feedback'
      ? [
          'Current concept facts:',
          step.retrievalText
            .replace(/^Teach\/Check \d+ attachment\s*\n?/m, '')
            .replace(/^Question targets:\s*\n[\s\S]*$/m, '')
            .trim(),
          buildTeachCheckAnswerTargets(step).length
            ? `Accepted answer targets: ${buildTeachCheckAnswerTargets(step).join(' | ')}`
            : '',
          step.deeperQuestionText ? `Deeper question: ${step.deeperQuestionText}` : '',
          step.deeperAnswerGuidance?.length
            ? `Accepted deeper answer targets: ${step.deeperAnswerGuidance.join(' | ')}`
            : '',
          step.hint ? `Common confusion: ${step.hint}` : '',
        ]
          .filter(Boolean)
          .join('\n\n')
      : step.retrievalText;

  return {
    filename: `${lesson.lessonCode}-section-${stepIndex + 1}.txt`,
    stepTitle: step.title,
    stepStage: step.stage,
    stepRole: step.role,
    completionMode: step.completionMode,
    stepIndex,
    totalSteps: lesson.steps.length,
    text: [
      label,
      `Lesson: ${lesson.title}`,
      `Current section: ${step.title}`,
      step.objective ? `Objective: ${step.objective}` : '',
      'Use only this section for the current turn.',
      stageSpecificText,
      turnStage === 'feedback'
        ? ''
        : step.stage === 'teach_check'
          ? buildTeachCheckQuestions(step)
            ? `Questions:\n${buildTeachCheckQuestions(step)}`
            : ''
          : step.questionText
            ? `Question target: ${step.questionText}`
            : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
  };
}

export function buildDynamicGuidedV2SectionAttachmentText(
  lessonCode: string,
  stepIndex: number,
  turnStage: 'teach' | 'feedback' = 'teach'
): {
  filename: string;
  text: string;
  stepTitle: string;
  stepStage: string;
  stepRole: string;
  completionMode: 'continue' | 'respond';
  stepIndex: number;
  totalSteps: number;
} | null {
  const lesson = loadDynamicGuidedV2Lesson(lessonCode);
  if (!lesson) return null;
  return buildDynamicGuidedV2SectionAttachmentFromLesson(lesson, stepIndex, turnStage);
}

export function buildDynamicGuidedV2AttachmentText(lessonCode: string): { filename: string; text: string } | null {
  const lesson = loadDynamicGuidedV2Lesson(lessonCode);
  if (!lesson) return null;

  const sections = lesson.steps.map((step) =>
    [
      `=== SECTION: ${step.title} ===`,
      `Stage: ${step.stage}`,
      step.objective ? `Objective: ${step.objective}` : '',
      step.retrievalText,
      step.stage === 'teach_check'
        ? buildTeachCheckQuestions(step)
          ? `Questions:\n${buildTeachCheckQuestions(step)}`
          : ''
        : step.questionText
          ? `Question target: ${step.questionText}`
          : '',
    ]
      .filter(Boolean)
      .join('\n')
  );

  return {
    filename: `${lesson.lessonCode}-attachment.txt`,
    text: [
      `Lesson: ${lesson.title}`,
      `Lesson code: ${lesson.lessonCode}`,
      `Unit: ${lesson.unit}`,
      `Audience: ${lesson.audience}`,
      '',
      'Use the attachment one section at a time.',
      'Stay grounded in the attachment and teach naturally.',
      '',
      ...sections,
    ].join('\n\n'),
  };
}
