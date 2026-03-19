import type { Lesson } from '@/data/lessons/types';
import type { DynamicGuidedV2Lesson, DynamicGuidedV2Stage, DynamicGuidedV2Step, DynamicGuidedV2StepRole } from '@/lib/dynamicGuidedV2/types';

type V1Question = {
  id?: string;
  questionText: string;
  expectedAnswer?: string[];
  keyPoints?: string[];
  hint?: string;
};

type V1Block = Lesson['blocks'][number];

function stripMarkdown(text: string): string {
  return text
    .replace(/###\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*   /g, '- ')
    .replace(/\r/g, '')
    .trim();
}

function firstSentence(text: string): string {
  const cleaned = stripMarkdown(text).replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/.*?[.!?](\s|$)/);
  return (match ? match[0] : cleaned).trim();
}

function cleanTitle(title: string): string {
  return title.replace(/\s*[—-]\s*/g, ' - ').trim();
}

function lines(parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join('\n');
}

function questionsFromBlock(block: V1Block): V1Question[] {
  const maybeQuestions = (block.content as { questions?: unknown }).questions;
  return Array.isArray(maybeQuestions) ? (maybeQuestions as V1Question[]) : [];
}

function extractSection(text: string, heading: string): string {
  const normalized = stripMarkdown(text);
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escaped}\n([\s\S]*?)(?=\n[A-Z][^\n]*\n|$)`);
  const match = normalized.match(regex);
  return match?.[1]?.trim() ?? '';
}

function extractBulletLines(text: string, limit = 4): string[] {
  return stripMarkdown(text)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .slice(0, limit)
    .map((line) => line.replace(/^- /, '').trim());
}

function distillExplanationContent(raw: string): string {
  const whatThisIs = firstSentence(extractSection(raw, 'What this is'));
  const whyItMatters = firstSentence(extractSection(raw, 'Why it matters'));
  const quickRecap = firstSentence(extractSection(raw, 'Quick recap'));
  const keyFacts = extractBulletLines(extractSection(raw, 'Key facts / rules'));
  const mistakes = extractBulletLines(extractSection(raw, 'Common mistakes'), 2);

  return lines([
    whatThisIs ? `Core idea: ${whatThisIs}` : '',
    whyItMatters ? `Why it matters: ${whyItMatters}` : '',
    keyFacts.length ? 'Key facts:' : '',
    ...keyFacts.map((fact) => `- ${fact}`),
    mistakes.length ? 'Watch out for:' : '',
    ...mistakes.map((fact) => `- ${fact}`),
    quickRecap ? `Short recap: ${quickRecap}` : '',
    'Teach this naturally in your own words. Keep it concrete and practical.',
  ]);
}

function buildQuestionStep(
  lesson: Lesson,
  block: V1Block,
  role: DynamicGuidedV2StepRole,
  stage: DynamicGuidedV2Stage,
  prefix: string,
  question: V1Question,
  index: number
): DynamicGuidedV2Step {
  const answerGuidance = question.keyPoints?.length ? question.keyPoints : question.expectedAnswer ?? [];
  return {
    id: `${lesson.id}-${block.id}-${index + 1}`,
    sourceBlockId: block.id,
    title: `${prefix} ${index + 1}`,
    role,
    stage,
    objective: question.questionText,
    completionMode: 'respond',
    retrievalText: lines([
      `Question set: ${prefix}`,
      `Ask this exact question: ${question.questionText}`,
      answerGuidance.length ? `A good answer should include: ${answerGuidance.join(' | ')}` : '',
      question.hint ? `Hint if needed: ${question.hint}` : '',
    ]),
    questionText: question.questionText,
    answerGuidance,
    hint: question.hint,
  };
}

export function adaptV1LessonToDynamicGuidedV2(lesson: Lesson): DynamicGuidedV2Lesson {
  const sortedBlocks = [...lesson.blocks].sort((a, b) => a.order - b.order);
  const steps: DynamicGuidedV2Step[] = [];
  let explanationIndex = 0;
  let teachCheckGroup = 0;
  let guidedPracticeGroup = 0;

  for (const block of sortedBlocks) {
    switch (block.type) {
      case 'outcomes': {
        const outcomes = ('outcomes' in block.content ? block.content.outcomes : []) as Array<{ text: string }>;
        steps.push({
          id: `${lesson.id}-outcomes`,
          sourceBlockId: block.id,
          title: 'Intro',
          role: 'outcomes',
          stage: 'intro',
          objective: 'Orient the learner to what this lesson covers.',
          completionMode: 'continue',
          retrievalText: lines([
            `Lesson: ${cleanTitle(lesson.title)}`,
            'Learning outcomes:',
            ...outcomes.map((item, idx) => `${idx + 1}. ${item.text}`),
            'Open the lesson naturally. Explain what the learner will be able to do by the end and why the topic matters in practical electrical work.',
          ]),
        });
        break;
      }
      case 'vocab': {
        const terms = ('terms' in block.content ? block.content.terms : []) as Array<{ term: string; definition: string }>;
        steps.push({
          id: `${lesson.id}-vocab`,
          sourceBlockId: block.id,
          title: 'Teach/Check vocab',
          role: 'vocab',
          stage: 'teach_check',
          objective: 'Introduce the terms needed for the lesson.',
          completionMode: 'continue',
          retrievalText: lines([
            'Teach only the key vocabulary needed for the next steps. Keep it concise and practical.',
            ...terms.map((item) => `- ${item.term}: ${firstSentence(item.definition)}`),
          ]),
        });
        break;
      }
      case 'diagram': {
        const content = block.content as { title?: string; description?: string; placeholderText?: string };
        steps.push({
          id: `${lesson.id}-diagram`,
          sourceBlockId: block.id,
          title: content.title ?? 'Diagram',
          role: 'diagram',
          stage: 'teach_check',
          objective: 'Use the diagram to ground the learner in the sequence or path.',
          completionMode: 'continue',
          retrievalText: lines([
            `Use this diagram in the explanation: ${content.title ?? 'Diagram'}`,
            content.description ?? '',
            content.placeholderText ?? '',
            'Explain what the learner should notice in the diagram before moving on.',
          ]),
          asset: {
            title: content.title ?? 'Diagram',
            description: content.description,
            placeholderText: content.placeholderText,
          },
        });
        break;
      }
      case 'explanation': {
        const content = block.content as { title?: string; content?: string };
        explanationIndex += 1;
        teachCheckGroup += 1;
        steps.push({
          id: `${lesson.id}-explanation-${explanationIndex}`,
          sourceBlockId: block.id,
          title: `Teach/Check ${teachCheckGroup}`,
          role: 'explanation',
          stage: 'teach_check',
          objective: content.title ?? `Explanation ${explanationIndex}`,
          completionMode: 'continue',
          retrievalText: distillExplanationContent(content.content ?? ''),
        });
        break;
      }
      case 'worked-example': {
        const content = block.content as {
          title?: string;
          given?: string;
          steps?: Array<{ stepNumber: number; description: string; formula?: string; calculation?: string; result?: string }>;
          notes?: string;
        };
        steps.push({
          id: `${lesson.id}-worked-example`,
          sourceBlockId: block.id,
          title: `Teach/Check worked example ${teachCheckGroup || 1}`,
          role: 'worked_example',
          stage: 'teach_check',
          objective: 'Model the process clearly before the learner answers independently.',
          completionMode: 'continue',
          retrievalText: lines([
            `Worked example: ${content.title ?? 'Worked example'}`,
            content.given ? `Given: ${content.given}` : '',
            ...(content.steps ?? []).map((step) =>
              lines([
                `Step ${step.stepNumber}: ${step.description}`,
                step.formula ? `Formula: ${step.formula}` : '',
                step.calculation ? `Calculation: ${step.calculation}` : '',
                step.result ? `Result: ${step.result}` : '',
              ])
            ),
            content.notes ? `Note: ${firstSentence(content.notes)}` : '',
            'Work through it naturally, step by step. Do not just read the list back verbatim.',
          ]),
        });
        break;
      }
      case 'guided-practice': {
        const content = block.content as {
          title?: string;
          problem?: string;
          steps?: Array<{ prompt: string; expectedAnswer: string | string[]; hint?: string }>;
        };
        guidedPracticeGroup += 1;
        steps.push({
          id: `${lesson.id}-${block.id}-intro`,
          sourceBlockId: block.id,
          title: `Guided practice ${guidedPracticeGroup}`,
          role: 'guided_practice',
          stage: 'guided_practice',
          objective: 'Set up the guided practice problem.',
          completionMode: 'continue',
          retrievalText: lines([
            content.problem ?? '',
            'Set up the guided practice clearly, then move into the first guided prompt.',
          ]),
        });
        (content.steps ?? []).forEach((step, index) => {
          const guidance = Array.isArray(step.expectedAnswer) ? step.expectedAnswer : [step.expectedAnswer];
          steps.push({
            id: `${lesson.id}-${block.id}-${index + 1}`,
            sourceBlockId: block.id,
            title: `Guided practice ${guidedPracticeGroup}.${index + 1}`,
            role: 'guided_practice',
            stage: 'guided_practice',
            objective: step.prompt,
            completionMode: 'respond',
            retrievalText: lines([
              `Guided practice problem: ${content.problem ?? ''}`,
              `Ask this exact prompt: ${step.prompt}`,
              guidance.length ? `A good answer should include: ${guidance.join(' | ')}` : '',
              step.hint ? `Hint if needed: ${step.hint}` : '',
            ]),
            questionText: step.prompt,
            answerGuidance: guidance,
            hint: step.hint,
          });
        });
        break;
      }
      case 'practice': {
        const content = block.content as { title?: string; mode?: string };
        const role: DynamicGuidedV2StepRole = content.mode === 'integrative' ? 'integrative' : 'practice';
        const stage: DynamicGuidedV2Stage = content.mode === 'integrative' ? 'integrative' : 'practice';
        questionsFromBlock(block).forEach((question, index) => {
          steps.push(buildQuestionStep(lesson, block, role, stage, content.title ?? 'Practice', question, index));
        });
        break;
      }
      case 'spaced-review': {
        const content = block.content as { title?: string };
        questionsFromBlock(block).forEach((question, index) => {
          steps.push(buildQuestionStep(lesson, block, 'spaced_review', 'spaced_review', content.title ?? 'Spaced review', question, index));
        });
        break;
      }
      default:
        break;
    }
  }

  return {
    lessonId: `dynamic-v2-${lesson.id}`,
    lessonCode: lesson.id,
    title: cleanTitle(lesson.title),
    subject: 'C&G 2365',
    unit: lesson.unit,
    audience: 'Level 2 electrical learner',
    tonePrompt:
      'Teach like a strong 2365 electrical tutor: practical, direct, technically precise, concise, and natural. Avoid robotic feedback and avoid textbook filler.',
    comparisonSource: 'v1_lesson_json',
    steps,
  };
}
