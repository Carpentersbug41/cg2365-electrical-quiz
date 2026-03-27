import type { DynamicGuidedV2Lesson, DynamicGuidedV2Step } from '@/lib/dynamicGuidedV2/types';
import { lesson2034AFromV1 } from '@/data/dynamic-guided-v2/2365/lesson2034AFromV1';
import { lesson2034CFromV1 } from '@/data/dynamic-guided-v2/2365/lesson2034CFromV1';
import { lesson2034L1EFromV1 } from '@/data/dynamic-guided-v2/2365/lesson2034L1EFromV1';

const lessons: Record<string, DynamicGuidedV2Lesson> = {
  '203-4A': lesson2034AFromV1,
  '203-4C': lesson2034CFromV1,
  '203-4L1E': lesson2034L1EFromV1,
};

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function cleanList(values: string[] | undefined): string[] {
  return unique((values ?? []).map((value) => value.trim()).filter(Boolean));
}

function takeTop(values: string[], limit: number): string[] {
  return values.slice(0, limit);
}

function hasThinGuardRails(step: DynamicGuidedV2Step): boolean {
  return (
    cleanList(step.keyTerms).length > 0 ||
    cleanList(step.keyIdeas).length > 0 ||
    cleanList(step.anchorFacts).length > 0 ||
    cleanList(step.misconceptionsToWatch).length > 0 ||
    cleanList(step.taskConstraints).length > 0 ||
    Boolean(step.taskSkeleton?.scenario || step.taskSkeleton?.steps?.length || step.taskSkeleton?.takeaway)
  );
}

function renderList(label: string, values: string[]): string {
  if (values.length === 0) return '';
  return [label, ...values.map((value) => `- ${value}`)].join('\n');
}

function buildTeachCheckGuardRailText(step: DynamicGuidedV2Step, turnStage: 'teach' | 'feedback'): string {
  const keyTerms = takeTop(cleanList(step.keyTerms), 4);
  const keyIdeas = takeTop(cleanList(step.keyIdeas), 2);
  const anchorFacts = takeTop(cleanList(step.anchorFacts), 3);
  const misconceptions = takeTop(cleanList(step.misconceptionsToWatch), 1);
  const constraints = takeTop(cleanList(step.taskConstraints), 2);
  const answerTargets = buildTeachCheckAnswerTargets(step);

  const shared = [
    renderList('Terms to keep accurate:', keyTerms),
    renderList('Main ideas for this chunk:', keyIdeas),
    renderList('Facts to stay inside:', anchorFacts),
    renderList('Likely misconception:', misconceptions),
    renderList('Do not drift beyond:', constraints),
  ].filter(Boolean);

  if (turnStage === 'teach') {
    return [
      ...shared,
      step.questionIntent ? `Current chunk intent: ${step.questionIntent}` : '',
      buildTeachCheckQuestions(step) ? `Questions:\n${buildTeachCheckQuestions(step)}` : '',
      step.deeperQuestionText ? `Deeper probe: ${step.deeperQuestionText}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  return [
    ...shared,
    answerTargets.length ? `Overall answer targets: ${answerTargets.join(' | ')}` : '',
    step.basicQuestions?.length
      ? [
          'Short-check questions:',
          ...step.basicQuestions.map(
            (question, index) => `${index + 1}. ${question.questionText}`
          ),
        ].join('\n')
      : '',
    step.deeperQuestionText ? `Deeper question: ${step.deeperQuestionText}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function buildTaskGuardRailText(step: DynamicGuidedV2Step, turnStage: 'teach' | 'feedback'): string {
  const keyTerms = takeTop(cleanList(step.keyTerms), 4);
  const keyIdeas = takeTop(cleanList(step.keyIdeas), 2);
  const anchorFacts = takeTop(cleanList(step.anchorFacts), 3);
  const misconceptions = takeTop(cleanList(step.misconceptionsToWatch), 1);
  const constraints = takeTop(cleanList(step.taskConstraints), 2);
  const skeletonSteps = takeTop(cleanList(step.taskSkeleton?.steps), 4);
  const requiredOutputs = takeTop(cleanList(step.taskSkeleton?.requiredOutputs), 3);

  return [
    renderList('Terms to keep accurate:', keyTerms),
    renderList('Main ideas for this task:', keyIdeas),
    renderList('Facts to stay inside:', anchorFacts),
    renderList('Likely misconception:', misconceptions),
    step.questionIntent ? `Task intent: ${step.questionIntent}` : '',
    step.taskSkeleton?.scenario ? `Scenario: ${step.taskSkeleton.scenario}` : '',
    renderList('Required steps:', skeletonSteps),
    renderList('Required outputs:', requiredOutputs),
    step.taskSkeleton?.takeaway ? `Takeaway: ${step.taskSkeleton.takeaway}` : '',
    renderList('Do not drift beyond:', constraints),
    turnStage === 'teach' && step.questionText ? `Question target: ${step.questionText}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function buildIntroGuardRailText(step: DynamicGuidedV2Step): string {
  const keyTerms = takeTop(cleanList(step.keyTerms), 4);
  const keyIdeas = takeTop(cleanList(step.keyIdeas), 3);
  const anchorFacts = takeTop(cleanList(step.anchorFacts), 3);
  const chunkMap = takeTop(cleanList(step.taskSkeleton?.steps), 6);
  const constraints = takeTop(cleanList(step.taskConstraints), 2);

  return [
    renderList('Terms to keep accurate:', keyTerms),
    renderList('Main lesson ideas:', keyIdeas),
    renderList('Facts to stay inside:', anchorFacts),
    renderList('Chunk map:', chunkMap),
    renderList('Do not drift beyond:', constraints),
  ]
    .filter(Boolean)
    .join('\n\n');
}

function buildWorkedExampleGuardRailText(step: DynamicGuidedV2Step): string {
  const keyTerms = takeTop(cleanList(step.keyTerms), 4);
  const keyIdeas = takeTop(cleanList(step.keyIdeas), 2);
  const anchorFacts = takeTop(cleanList(step.anchorFacts), 3);
  const skeletonSteps = takeTop(cleanList(step.taskSkeleton?.steps), 4);
  const constraints = takeTop(cleanList(step.taskConstraints), 2);

  return [
    renderList('Terms to keep accurate:', keyTerms),
    renderList('Main idea in this example:', keyIdeas),
    renderList('Facts to stay inside:', anchorFacts),
    step.taskSkeleton?.scenario ? `Scenario: ${step.taskSkeleton.scenario}` : '',
    renderList('Required steps:', skeletonSteps),
    step.taskSkeleton?.takeaway ? `Takeaway: ${step.taskSkeleton.takeaway}` : '',
    renderList('Do not drift beyond:', constraints),
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function buildDynamicGuidedV2StepContextText(
  step: DynamicGuidedV2Step,
  turnStage: 'teach' | 'feedback'
): string {
  if (!hasThinGuardRails(step)) {
    if (turnStage === 'feedback') {
      return [
        'Current concept facts:',
        (step.retrievalText ?? '')
          .replace(/^Teach\/Check \d+ attachment\s*\n?/m, '')
          .replace(/^Question targets:\s*\n[\s\S]*$/m, '')
          .trim(),
        step.basicQuestions?.length
          ? [
              'Question-by-question prompts:',
              ...step.basicQuestions.map(
                (question, index) => `${index + 1}. ${question.questionText}`
              ),
            ].join('\n')
          : '',
        step.deeperQuestionText ? `Deeper question: ${step.deeperQuestionText}` : '',
        step.hint ? `Common confusion: ${step.hint}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    return step.retrievalText ?? '';
  }

  if (step.stage === 'intro') {
    return buildIntroGuardRailText(step);
  }
  if (step.stage === 'teach_check') {
    return buildTeachCheckGuardRailText(step, turnStage);
  }
  if (step.stage === 'worked_example') {
    return buildWorkedExampleGuardRailText(step);
  }
  return buildTaskGuardRailText(step, turnStage);
}

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
          .flatMap((question) => question.answerGuidance ?? [])
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
  const stageSpecificText = buildDynamicGuidedV2StepContextText(step, turnStage);

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
      `Section: ${step.title}`,
      step.objective ? `Objective: ${step.objective}` : '',
      'Use this section as guard rails, not as a script.',
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
      buildDynamicGuidedV2StepContextText(step, 'teach'),
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
