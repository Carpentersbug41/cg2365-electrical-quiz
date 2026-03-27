import { NextRequest, NextResponse } from 'next/server';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { getUserTutorProfileSummaryForRequest } from '@/lib/prompting/profileInjections';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';
import {
  buildDynamicGuidedV2SectionAttachmentFromLesson,
  buildDynamicGuidedV2SectionAttachmentText,
  getDynamicGuidedV2LessonStepCount,
  loadDynamicGuidedV2Lesson,
} from '@/lib/dynamicGuidedV2/loader';
import { getDynamicLessonVersion } from '@/lib/dynamicGuidedV2/versionStore';
import type { DynamicGuidedV2Step } from '@/lib/dynamicGuidedV2/types';
import {
  buildWorkedExampleSupportFocusFromClassification,
  buildTeachCheckRepairFocusFromClassification,
  classifyLessonReply,
  classifyWorkedExampleReadiness,
  guidanceMatchesUserAnswer,
  type ReplyClassification,
  type RuntimeReplyClass,
  type RuntimeVariant,
} from './runtimeVariant';

type ThreadTurn = {
  role: 'user' | 'assistant';
  text: string;
};

type AttachmentPayload = {
  filename: string;
  text: string;
} | null;

type LessonAttachmentMeta = NonNullable<ReturnType<typeof buildDynamicGuidedV2SectionAttachmentFromLesson>>;

type FeedbackControl = {
  assistantMessage: string;
  resolved: boolean;
  next: 'feedback' | 'teach';
};

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

const BASELINE_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Teach the user the **requested unit only**.
- Plan privately.
- For this turn, deliver **only the next chunk**.
- Do not outline the whole unit unless the user asks.

## Teaching Pattern

- Teach one clear chunk in roughly **150-200 words**.
- Ask **3 short-answer questions** on that chunk only.
- After the learner replies, ask **1 deeper question**.
- Then move to the next chunk.

## Rules

- Teach **one main idea** per chunk.
- Explain before questioning.
- Never ask about material that has not been taught yet.
- Keep questions concrete and easy to mark from the learner's wording.
- Use plain technical notation like **Zs, Ze, R1, R2**. Do not use LaTeX.`;

const RUNTIME_BEHAVIOR_CHARTER = `## Runtime Behavior Charter

- Continue the conversation as if the tutoring session is already in progress.
- Respond to the learner's current position, not to the lesson file.
- Stay inside the current section guard rails, but phrase things naturally.
- Explain plainly, directly, and practically.
- Do not sound like a lesson page, worksheet, or marking report.`;

const RUNTIME_FEEDBACK_CHARTER = `## Runtime Feedback Charter

- Reply directly to the learner's latest answer.
- Repair only the most important missing idea first.
- Keep feedback short, specific, and conversational.
- Use one short example only when it genuinely helps.
- Stay in the current section until the learner is secure enough to move on.`;

const LESSON_INTRO_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Teach the user the **requested unit only**.
- For this first turn only, welcome the user to the lesson.

## Use The Attached Lesson Context To Identify

- what this lesson is about
- what the learner will be able to do by the end
- how the lesson will run

## Intro Turn Rules

- Welcome the learner.
- Explain the lesson outcomes in natural language.
- Explain that the session will run in short teaching chunks with questions.
- Do not start the first teaching chunk yet.
- Do not ask the learner a test question yet.
- Sound like a tutor, not a lesson file.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.

## Style

Keep it concise, direct, and practical.`;

const LESSON_TEACH_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Teach the user the **requested unit only**.
- For this turn, deliver **only the current lesson chunk**.
- Continue the live tutoring session naturally from where the learner already is.
- Do not outline the whole unit unless the user asks.

${RUNTIME_BEHAVIOR_CHARTER}

## Teaching Pattern

- Teach one clear chunk in roughly **120-180 words**.
- Ask **exactly 3 short-answer questions** on that chunk only.

## Rules

- Teach **one main idea** per chunk.
- Explain before questioning.
- Do not give a fresh welcome or re-introduce the whole lesson in a normal teach turn.
- Start directly with the current idea.
- Do not sound like you are presenting a prepared lesson page.
- Never ask about material that has not been taught yet.
- Keep questions concrete and easy to mark from the learner's wording.
- Use the retrieved section as guard rails, not as wording to copy.
- Sound like a tutor speaking naturally, not a block of lesson prose.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

const LESSON_APPLY_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Stay on the **current lesson section only**.
- Set the learner one current task only.
- Do not teach new material unless the task itself requires one short reminder.

${RUNTIME_BEHAVIOR_CHARTER}

## Task Rules

- Ask only the current guided, practice, or integrative task.
- Do not give a fresh welcome or restart the lesson.
- Keep the task direct and concise.
- Continue naturally from the current session state.
- Do not add extra questions beyond the current task.
- Use the retrieved section as guard rails, not as wording to copy.
- Sound natural and practical.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

const LESSON_WORKED_EXAMPLE_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Stay on the **current worked example only**.
- Explain the example step by step.
- Do not move into a later section.

${RUNTIME_BEHAVIOR_CHARTER}

## Rules

- Walk through the given values and each step in order.
- Do not give a fresh welcome or restart the lesson.
- Keep it concise, practical, and easy to follow.
- Continue naturally from the current session state.
- Use the retrieved section as guard rails, not as wording to copy.
- End with the final result and one short takeaway.
- End by asking whether the example makes sense and whether the learner is ready to try one themselves.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

const LESSON_WORKED_EXAMPLE_FEEDBACK_SYSTEM_PROMPT = `# Role

You are an expert tutor for the City & Guilds 2365 Level 2 electrical course.

Your job is to judge whether the learner is ready to try the worked example themselves and, if not, help them understand it.

## Scope

- Stay on the current worked example only.
- Respond only to the learner's latest answer.
- Do not move into a later section.

${RUNTIME_FEEDBACK_CHARTER}

## Rules

- Judge whether the learner is ready to move on to guided practice.
- If the learner is ready, confirm that briefly and ask if they are ready to continue.
- If the learner is not ready, break the example down in simpler language and walk through it clearly.
- Keep the reply concise, direct, and practical.
- Do not begin guided practice yourself.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

const LESSON_FEEDBACK_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Stay on the **current lesson section only**.
- Respond to the learner's latest answer only.
- Do not move into a later section.

${RUNTIME_FEEDBACK_CHARTER}

## Feedback Rules

- If the learner is basically right, say so clearly.
- If the learner is wrong or unsure, explain it in **simpler language** than the teaching.
- When correcting, give **one short example** if that helps make the point clear.
- Keep the feedback direct and conversational.
- Keep it specific to the exact missing idea.
- Continue naturally from the learner's last reply rather than sounding like a report.
- Do not sound like an answer key unless the learner explicitly asks for one.
- Use plain technical notation like **Zs, Ze, R1, R2**. Do not use LaTeX.`;

const LESSON_FEEDBACK_DEEPER_SYSTEM_PROMPT = `# Role

You are a tutor for the City & Guilds 2365 Level 2 electrical course.

Your job is to help the learner understand the current lesson section through short, simple feedback and one focused repair loop.

## Scope

- Stay on the current lesson section only.
- Respond only to the learner's latest answer.
- Do not move into a later section.

${RUNTIME_FEEDBACK_CHARTER}

## Decision Rule

- Silently score the learner's latest answer from 0.0 to 1.0.
- If the score is 0.6 or higher, confirm the learner is correct, give one short example if helpful, and ask if they are ready to continue.
- If the score is below 0.6, stay in the current section and enter remedial mode.

## If the learner is wrong or unsure

- Identify the single most important missing idea in the learner's answer.
- Re-explain only that missing idea using simpler, beginner-friendly language while keeping it technically correct.
- Use easier words, shorter sentences, and only the core idea.
- Give one short example only if it genuinely helps.
- End with exactly one short retry question on that same missing idea.
- Do not ask a new multi-part set of remedial questions.
- Do not restate the whole chunk unless the learner's answer shows they missed the whole chunk.
- Only move on if the learner then shows enough understanding.

## Style

- Keep the tone direct, calm, and conversational.
- Continue naturally from the learner's last reply.
- Do not sound like an answer key unless the learner explicitly asks for one.
- Use plain technical notation such as Zs, Ze, R1, and R2.
- Do not use LaTeX.

## Length

- Keep each reply within 100 words.`;

const LESSON_INTEGRATIVE_FEEDBACK_SYSTEM_PROMPT = `# Role

You are an expert tutor for the City & Guilds 2365 Level 2 electrical course.

Your job is to evaluate the learner's integrative answer for the current lesson section and help them strengthen it if needed.

## Scope

- Stay on the current integrative section only.
- Respond only to the learner's latest answer.
- Do not move into a later section.

${RUNTIME_FEEDBACK_CHARTER}

## Rules

- Judge whether the learner has pulled together the key ideas from this section well enough to move on.
- If the answer is basically strong enough, confirm that briefly and move on.
- If the answer is weak, incomplete, or confused, give short corrective feedback in simpler language.
- Ask one short follow-up only if it is needed to repair the answer.
- Keep the reply concise, direct, and practical.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

function parseFeedbackControl(rawText: string): FeedbackControl {
  const fallback: FeedbackControl = {
    assistantMessage: rawText.trim() || 'Let’s stay on this point for one more step.',
    resolved: false,
    next: 'feedback',
  };

  const trimmed = rawText.trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  const candidate =
    firstBrace >= 0 && lastBrace > firstBrace ? trimmed.slice(firstBrace, lastBrace + 1) : trimmed;

  try {
    const parsed = JSON.parse(candidate) as Partial<FeedbackControl>;
    return {
      assistantMessage:
        typeof parsed.assistantMessage === 'string' && parsed.assistantMessage.trim()
          ? parsed.assistantMessage.trim()
          : fallback.assistantMessage,
      resolved: parsed.resolved === true,
      next: parsed.next === 'teach' ? 'teach' : 'feedback',
    };
  } catch {
    const assistantMatch = candidate.match(/"assistantMessage"\s*:\s*"([\s\S]*?)"/);
    const resolvedMatch = candidate.match(/"resolved"\s*:\s*(true|false)/i);
    const nextMatch = candidate.match(/"next"\s*:\s*"(teach|feedback)"/i);

    return {
      assistantMessage: assistantMatch
        ? assistantMatch[1]
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\\\/g, '\\')
            .trim() || fallback.assistantMessage
        : fallback.assistantMessage,
      resolved: resolvedMatch?.[1]?.toLowerCase() === 'true',
      next: nextMatch?.[1]?.toLowerCase() === 'teach' ? 'teach' : 'feedback',
    };
  }
}

function buildTeachCheckRepairFocus(step: DynamicGuidedV2Step, latestUserMessage: string, lessonSectionPhase: string): string {
  if (step.stage !== 'teach_check') return '';
  const trimmedUser = latestUserMessage.trim();
  if (!trimmedUser) return '';

  if (lessonSectionPhase === 'feedback_basic' && step.basicQuestions?.length) {
    const diagnostics = step.basicQuestions.map((question, index) => {
      const targets = question.answerGuidance ?? [];
      const matched = targets.some((guidance) => guidanceMatchesUserAnswer(trimmedUser, guidance));
      return {
        index,
        matched,
        question: question.questionText,
        targets,
      };
    });
    const missing = diagnostics.filter((item) => !item.matched);
    return [
      'Repair focus from the latest learner answer:',
      ...diagnostics.map((item) =>
        `${item.index + 1}. ${item.matched ? 'likely secure' : 'likely missing'} -> ${item.question}${item.targets.length ? ` | expected: ${item.targets.join(' | ')}` : ''}`
      ),
      missing.length
        ? `Prioritise repair on: ${missing.map((item) => item.targets[0] ?? item.question).join('; ')}.`
        : 'All three short checks look broadly secure. Tighten wording briefly, then move to the deeper question.',
      step.hint ? `Likely misconception to address if needed: ${step.hint}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  if (lessonSectionPhase === 'feedback_deeper') {
    const matchedTargets = (step.deeperAnswerGuidance ?? []).filter((guidance) =>
      guidanceMatchesUserAnswer(trimmedUser, guidance)
    );
    const missingTargets = (step.deeperAnswerGuidance ?? []).filter((guidance) =>
      !guidanceMatchesUserAnswer(trimmedUser, guidance)
    );
    return [
      'Repair focus from the latest deeper answer:',
      `Matched deeper targets: ${matchedTargets.length > 0 ? matchedTargets.join(' | ') : 'none clearly matched'}`,
      `Missing deeper targets: ${missingTargets.length > 0 ? missingTargets.join(' | ') : 'none obvious'}`,
      step.hint ? `Repair the misconception through this lens: ${step.hint}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

async function getClient() {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }
  return llmClientPromise;
}

function recentConversation(thread: ThreadTurn[]): ThreadTurn[] {
  return thread.slice(-8);
}

function buildResponseDebugHeaders(params: {
  systemInstruction: string;
  userId: string | null;
  profileFound: boolean;
  finishReason: string;
  attachment: AttachmentPayload;
  attachmentStepMeta: LessonAttachmentMeta | null;
  lessonCode: string;
  safeLessonStepIndex: number;
  currentCompletionMode: string;
  lessonSectionPhase: string;
  lessonDeeperTurnCount: number;
  progressionGate: boolean;
  feedbackResolved: string;
  feedbackNext: string;
  autoAdvance?: boolean;
  nextStep?: { id?: string; role?: string; stage?: string } | null;
  nextStepIndex?: number | null;
  runtimeVariant: RuntimeVariant;
  replyClass?: RuntimeReplyClass | null;
}): Record<string, string> {
  const {
    systemInstruction,
    userId,
    profileFound,
    finishReason,
    attachment,
    attachmentStepMeta,
    lessonCode,
    safeLessonStepIndex,
    currentCompletionMode,
    lessonSectionPhase,
    lessonDeeperTurnCount,
    progressionGate,
    feedbackResolved,
    feedbackNext,
    autoAdvance,
    nextStep,
    nextStepIndex,
    runtimeVariant,
    replyClass,
  } = params;

  const systemInstructionPreview = systemInstruction.split('\n').slice(0, 8).join('\n');

  return {
    'x-simple-chatbot-system-instruction': encodeURIComponent(systemInstructionPreview),
    'x-simple-chatbot-user-id': encodeURIComponent(userId ?? ''),
    'x-simple-chatbot-profile-found': profileFound ? 'true' : 'false',
    'x-simple-chatbot-finish-reason': encodeURIComponent(finishReason),
    'x-simple-chatbot-attachment-filename': encodeURIComponent(attachment?.filename ?? ''),
    'x-simple-chatbot-attachment-chars': attachment ? String(attachment.text.length) : '0',
    'x-simple-chatbot-lesson-step-index': lessonCode ? String(safeLessonStepIndex) : '',
    'x-simple-chatbot-lesson-step-title': encodeURIComponent(attachmentStepMeta?.stepTitle ?? ''),
    'x-simple-chatbot-lesson-step-stage': encodeURIComponent(attachmentStepMeta?.stepStage ?? ''),
    'x-simple-chatbot-lesson-completion-mode': encodeURIComponent(currentCompletionMode),
    'x-simple-chatbot-lesson-step-role': encodeURIComponent(attachmentStepMeta?.stepRole ?? ''),
    'x-simple-chatbot-lesson-step-total': lessonCode && attachmentStepMeta ? String(attachmentStepMeta.totalSteps) : '',
    'x-simple-chatbot-feedback-phase': lessonSectionPhase,
    'x-simple-chatbot-feedback-deeper-turn-count':
      lessonSectionPhase === 'feedback_deeper' ? String(lessonDeeperTurnCount) : '0',
    'x-simple-chatbot-progression-gate': progressionGate ? 'true' : 'false',
    'x-simple-chatbot-feedback-resolved': feedbackResolved,
    'x-simple-chatbot-feedback-next': feedbackNext,
    'x-simple-chatbot-auto-advance': autoAdvance ? 'true' : 'false',
    'x-simple-chatbot-next-step-id': encodeURIComponent(nextStep?.id ?? ''),
    'x-simple-chatbot-next-step-index': nextStepIndex != null && nextStepIndex >= 0 ? String(nextStepIndex) : '',
    'x-simple-chatbot-next-step-role': encodeURIComponent(nextStep?.role ?? ''),
    'x-simple-chatbot-next-step-stage': encodeURIComponent(nextStep?.stage ?? ''),
    'x-simple-chatbot-runtime-variant': runtimeVariant,
    'x-simple-chatbot-reply-class': replyClass ?? '',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const thread = Array.isArray(body.thread) ? (body.thread as ThreadTurn[]) : [];
    const lessonCode = typeof body.lessonCode === 'string' ? body.lessonCode.trim() : '';
    const dynamicVersionId =
      typeof body.dynamicVersionId === 'string' && body.dynamicVersionId.trim() ? body.dynamicVersionId.trim() : null;
    const lessonStepIndex =
      typeof body.lessonStepIndex === 'number' && Number.isInteger(body.lessonStepIndex) && body.lessonStepIndex >= 0
        ? body.lessonStepIndex
        : 0;
    const lessonSectionPhase =
      body.lessonSectionPhase === 'feedback_basic'
        ? 'feedback_basic'
        : body.lessonSectionPhase === 'feedback_deeper'
          ? 'feedback_deeper'
          : body.lessonSectionPhase === 'worked_example_feedback'
            ? 'worked_example_feedback'
          : body.lessonSectionPhase === 'integrative_feedback'
            ? 'integrative_feedback'
          : 'teach';
    const lessonDeeperTurnCount =
      typeof body.lessonDeeperTurnCount === 'number' &&
      Number.isInteger(body.lessonDeeperTurnCount) &&
      body.lessonDeeperTurnCount >= 0
        ? body.lessonDeeperTurnCount
        : 0;
    const runtimeVariant: RuntimeVariant = body.runtimeVariant === 'control' ? 'control' : 'lean_feedback_v1';
    let attachment =
      body.attachment &&
      typeof body.attachment.filename === 'string' &&
      typeof body.attachment.text === 'string'
        ? ({ filename: body.attachment.filename, text: body.attachment.text } satisfies NonNullable<AttachmentPayload>)
        : null;

    if (!message && !lessonCode) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const version = dynamicVersionId ? await getDynamicLessonVersion(dynamicVersionId) : null;
    const resolvedLesson = version?.lesson ?? (lessonCode ? loadDynamicGuidedV2Lesson(lessonCode) : null);
    const stepCount = resolvedLesson?.steps.length ?? (lessonCode ? getDynamicGuidedV2LessonStepCount(lessonCode) : 0);
    const safeLessonStepIndex = lessonCode
      ? Math.max(0, Math.min(lessonStepIndex, Math.max(0, stepCount - 1)))
      : 0;

    if (lessonCode && !attachment) {
      attachment = resolvedLesson
        ? buildDynamicGuidedV2SectionAttachmentFromLesson(
            resolvedLesson,
            safeLessonStepIndex,
            lessonSectionPhase === 'teach' ? 'teach' : 'feedback'
          )
        : buildDynamicGuidedV2SectionAttachmentText(
            lessonCode,
            safeLessonStepIndex,
            lessonSectionPhase === 'teach' ? 'teach' : 'feedback'
          );
      if (!attachment) {
        return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });
      }
    }

    const client = await getClient();
    const [session, learnerProfileSummary] = await Promise.all([
      getSupabaseSessionFromRequest(request),
      getUserTutorProfileSummaryForRequest(request),
    ]);
    const userId = session?.user.id ?? null;
    const profileFound = Boolean(learnerProfileSummary);
    const attachmentStepMeta: LessonAttachmentMeta | null =
      attachment &&
      'stepTitle' in attachment &&
      'stepStage' in attachment &&
      'stepRole' in attachment &&
      'completionMode' in attachment &&
      'totalSteps' in attachment
        ? (attachment as LessonAttachmentMeta)
        : null;
    const currentStepRole = attachmentStepMeta?.stepRole ?? '';
    const currentStepStage = attachmentStepMeta?.stepStage ?? '';
    const currentCompletionMode = attachmentStepMeta?.completionMode ?? 'respond';
    const isLessonIntroTurn =
      Boolean(lessonCode) &&
      safeLessonStepIndex === 0 &&
      currentStepStage === 'intro' &&
      lessonSectionPhase === 'teach' &&
      thread.length <= 1 &&
      thread.every((turn) => turn.role === 'user');
    const isLessonFeedbackTurn =
      Boolean(lessonCode) &&
      !isLessonIntroTurn &&
      (
        lessonSectionPhase === 'feedback_basic' ||
        lessonSectionPhase === 'feedback_deeper' ||
        lessonSectionPhase === 'worked_example_feedback' ||
        lessonSectionPhase === 'integrative_feedback'
      );
    const currentLessonStep = lessonCode ? resolvedLesson?.steps[safeLessonStepIndex] ?? null : null;
    const questionOnlyDynamicStep =
      resolvedLesson?.comparisonSource === 'dynamic_generator' &&
      currentLessonStep &&
      (
        (currentLessonStep.stage === 'teach_check' &&
          (currentLessonStep.basicQuestions ?? []).every((question) => (question.answerGuidance ?? []).length === 0) &&
          (currentLessonStep.deeperAnswerGuidance ?? []).length === 0) ||
        ((currentLessonStep.stage === 'guided_practice' ||
          currentLessonStep.stage === 'practice' ||
          currentLessonStep.stage === 'integrative') &&
          (currentLessonStep.answerGuidance ?? []).length === 0)
      );
    const replyClassification: ReplyClassification | null =
      runtimeVariant === 'lean_feedback_v1' &&
      currentLessonStep &&
      currentLessonStep.stage === 'teach_check' &&
      (lessonSectionPhase === 'feedback_basic' || lessonSectionPhase === 'feedback_deeper') &&
      !questionOnlyDynamicStep &&
      isLessonFeedbackTurn
        ? classifyLessonReply(currentLessonStep, message, lessonSectionPhase)
        : null;
    const workedExampleReadiness =
      runtimeVariant === 'lean_feedback_v1' &&
      currentLessonStep &&
      currentStepRole === 'worked_example' &&
      lessonSectionPhase === 'worked_example_feedback' &&
      isLessonFeedbackTurn
        ? classifyWorkedExampleReadiness(currentLessonStep, message)
        : null;
    const repairFocus =
      currentLessonStep && isLessonFeedbackTurn
        ? replyClassification
          ? buildTeachCheckRepairFocusFromClassification(currentLessonStep, lessonSectionPhase, replyClassification)
          : workedExampleReadiness
            ? buildWorkedExampleSupportFocusFromClassification(workedExampleReadiness)
          : buildTeachCheckRepairFocus(currentLessonStep, message, lessonSectionPhase)
        : '';
    const systemInstruction = [
      isLessonIntroTurn
        ? LESSON_INTRO_SYSTEM_PROMPT
        : lessonCode
          ? isLessonFeedbackTurn
            ? lessonSectionPhase === 'feedback_deeper'
              ? LESSON_FEEDBACK_DEEPER_SYSTEM_PROMPT
              : lessonSectionPhase === 'worked_example_feedback'
                ? LESSON_WORKED_EXAMPLE_FEEDBACK_SYSTEM_PROMPT
              : lessonSectionPhase === 'integrative_feedback'
                ? LESSON_INTEGRATIVE_FEEDBACK_SYSTEM_PROMPT
                : LESSON_FEEDBACK_SYSTEM_PROMPT
            : currentStepRole === 'worked_example'
              ? LESSON_WORKED_EXAMPLE_SYSTEM_PROMPT
            : currentStepRole === 'guided_practice' || currentStepRole === 'practice' || currentStepRole === 'integrative'
              ? LESSON_APPLY_SYSTEM_PROMPT
              : LESSON_TEACH_SYSTEM_PROMPT
          : BASELINE_SYSTEM_PROMPT,
      learnerProfileSummary ? `## This is the user's profile:\n${learnerProfileSummary}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const model = client.getGenerativeModel({
      model: getGeminiModelWithDefault(),
      systemInstruction,
      generationConfig: {
        temperature: 0.6,
      },
    });

    const conversationHistory = recentConversation(thread).map((turn) => ({
      role: turn.role,
      text: turn.text,
    }));

    const lessonTurnInstruction =
      lessonCode && attachment && !isLessonIntroTurn
        ? lessonSectionPhase === 'teach'
          ? currentStepRole === 'worked_example'
            ? `Current mode: worked_example.
Explain only this worked example step by step.
Stay inside the current section.
End by asking whether it makes sense and whether the learner is ready to try one themselves.`
            : currentStepRole === 'guided_practice' || currentStepRole === 'practice' || currentStepRole === 'integrative'
              ? `Current mode: apply.
Set only the current task from this section.
Keep the wording natural and direct.
Do not introduce later section content.`
              : runtimeVariant === 'lean_feedback_v1'
                ? `Current mode: teach_check.
Continue naturally from the learner's current position.
Explain the current idea plainly and directly in roughly 80-140 words.
Use the retrieved section as guard rails, not as wording to copy.
Teach as a live tutor, not as a prepared lesson page.
Ask exactly 3 short-answer questions on this current section only.
Do not ask the deeper question yet.
Do not move to later sections.`
                : `Current mode: teach_check.
Continue the session naturally from the learner's current position.
Teach only this current section in roughly 90-150 words.
Use the retrieved section as guard rails, not as wording to copy.
Ask exactly 3 short-answer questions from this current section only.
Do not ask a deeper question yet.
Do not move to later sections.`
          : lessonSectionPhase === 'feedback_basic' && currentStepStage === 'teach_check'
            ? runtimeVariant === 'lean_feedback_v1' && !questionOnlyDynamicStep
              ? `Current mode: feedback_basic.
The learner has replied to the 3 short questions on this section. Use the attached reply classification and repair focus.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}

Rules:
- "assistantMessage" is the learner-facing reply.
- Start by responding to the learner's actual answer, not by summarising the section.
- If the reply class is "correct", briefly confirm what is secure, tighten wording if useful, and ask the deeper question.
- If the reply class is "partial", confirm what is right, repair the single missing idea first, then ask the deeper question.
- If the reply class is "misconception", name the mix-up directly in simple language, repair one idea only, then ask the deeper question.
- If the reply class is "unclear", give a very short reset on the key idea, then ask the deeper question.
- Keep the reply short, direct, and conversational.
- Use one short example only if it genuinely helps.
- Do not sound like a marking report or answer key.
- Because the deeper question still needs an answer, set "resolved" to false and "next" to "feedback".
- Do not move into later section content yourself.`
              : `Current mode: feedback_basic.
The learner has replied to the 3 short questions on this section. Judge the reply from the current questions and the retrieved section context only.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}

Rules:
- "assistantMessage" is the learner-facing reply.
- Give brief, direct feedback on the 3 answers.
- Explicitly say which ideas look secure and which idea still needs repair.
- If the learner is wrong or unsure, explain it in simpler language than the teaching and give one short example if useful.
- Repair only the missing idea first; do not re-teach the whole chunk.
- Sound like a tutor speaking to the learner, not a marking report.
- End by asking the attached deeper question for this section.
- Because the deeper question still needs an answer, set "resolved" to false and "next" to "feedback".
- Do not move into later section content yourself.`
          : lessonSectionPhase === 'feedback_deeper' && currentStepStage === 'teach_check'
              ? runtimeVariant === 'lean_feedback_v1' && !questionOnlyDynamicStep
                ? `Current mode: feedback_deeper.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- Use the attached reply classification and repair focus to decide what to do next.
- If the reply class is "correct", set "resolved" to true and "next" to "teach".
- When resolved, briefly confirm the learner is right in natural language, tighten one idea if useful, and ask if they are ready to continue.
- If the reply class is "partial", "misconception", or "unclear", set "resolved" to false and "next" to "feedback".
- When unresolved, stay on this same deeper stage.
- When unresolved, repair only the single recommended idea in simpler language.
- When unresolved, end with exactly one short retry question on that same idea.
- Keep the reply short, direct, and conversational.
- Do not sound like a checklist, rubric, or answer key.
- Do not ask a different deeper question and do not switch to a new chunk.
- When resolved, do not begin the next teaching chunk and do not ask a new content question.
- Do not move into later section content yourself.`
                : `Current mode: feedback_deeper.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- Judge the answer against the attached deeper question and the current section context only.
- If the score is 0.6 or higher, set "resolved" to true and "next" to "teach".
- When resolved, confirm the learner is correct, give one short example if helpful, and ask if they are ready to continue.
- If the score is below 0.6, set "resolved" to false and "next" to "feedback".
- When unresolved, stay on this same deeper stage.
- When unresolved, identify the exact missing idea, repair only that idea in simpler language, and end with one short retry question on that same idea.
- Sound like a tutor speaking naturally, not a checklist.
- Do not ask a different deeper question and do not switch to a new chunk.
- When resolved, do not begin the next teaching chunk and do not ask a new content question.
- Do not move into later section content yourself.`
              : lessonSectionPhase === 'worked_example_feedback' && currentStepRole === 'worked_example'
                ? runtimeVariant === 'lean_feedback_v1'
                  ? `Current mode: worked_example_feedback.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- Use the attached worked-example readiness classification and support focus.
- If readiness is "ready", set "resolved" to true and "next" to "teach".
- When resolved, confirm briefly that the learner is ready and ask if they want to continue.
- If readiness is "needs_support" or "unclear", set "resolved" to false and "next" to "feedback".
- When unresolved, stay on this same worked example feedback stage.
- Repair only the one support focus in simpler language.
- Keep the reply short, direct, and conversational.
- End with one short check that asks whether the explanation makes sense now or whether they are ready to try one.
- Do not re-run the whole worked example unless it is genuinely necessary.
- Do not begin guided practice yourself.
- Do not move into later section content yourself.`
                  : `Current mode: worked_example_feedback.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- Judge whether the learner is ready to move on from the worked example to guided practice.
- If the learner is ready, set "resolved" to true and "next" to "teach".
- If the learner is not ready, set "resolved" to false and "next" to "feedback".
- When unresolved, stay on this same worked example feedback stage.
- Do not begin guided practice yourself.
- Do not move into later section content yourself.`
              : lessonSectionPhase === 'integrative_feedback' && currentStepRole === 'integrative'
                ? `Current mode: integrative_feedback.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- Judge the learner's answer against the attached integrative task and current section context only.
- If the learner has integrated the key ideas well enough, set "resolved" to true and "next" to "teach".
- If the learner still needs repair, set "resolved" to false and "next" to "feedback".
- When unresolved, stay on this same integrative feedback stage.
- Do not move into later section content yourself.`
              : `Current mode: feedback.
The learner has replied on this section. Use the recent conversation to decide whether they have now understood the section well enough to move on.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Rules:
- "assistantMessage" is the learner-facing reply.
- If the learner still needs one more check, clarification, or correction on this same section, set "resolved" to false and "next" to "feedback".
- Do not ask a deeper question.
- Do not introduce any new sub-stage.
- Either resolve this section and move on, or stay on this same section.
- Only set "resolved" to true and "next" to "teach" when the current section is fully complete and you are not asking anything else.
- Keep feedback direct and conversational.
- If the learner is wrong or unsure, explain it in simpler language than the teaching and give one short example if useful.
- Focus on the missing idea only, not the whole section.
- Do not move into later section content yourself.`
        : '';

    const currentTurnParts = [
      ...(attachment
        ? [
            {
              text: `Current lesson guard rails (${attachment.filename}):
Use this section only for the current turn.
Teach naturally from it. Do not copy it mechanically.

${attachment.text}`,
            },
          ]
        : []),
      ...(lessonTurnInstruction
        ? [
            {
              text: `Turn instruction:\n${lessonTurnInstruction}`,
            },
          ]
        : []),
      ...(repairFocus
        ? [
            {
              text: `Repair focus:\n${repairFocus}`,
            },
          ]
        : []),
      {
        text: message,
      },
    ];

    const contents = [
      ...conversationHistory.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: turn.text }],
      })),
      {
        role: 'user' as const,
        parts: currentTurnParts,
      },
    ];

    const geminiRequest = {
      systemInstruction,
      contents,
      generationConfig: isLessonFeedbackTurn
        ? {
            temperature: 0.6,
            responseMimeType: 'application/json',
          }
        : {
            temperature: 0.6,
          },
    };

    console.log('[simple-chatbot] request', {
      lessonCode: lessonCode || null,
      lessonStepIndex: lessonCode ? safeLessonStepIndex : null,
      lessonSectionPhase: lessonCode ? lessonSectionPhase : null,
      isLessonIntroTurn,
      userId,
      profileFound,
      systemInstruction,
      attachment: attachment
        ? {
            filename: attachment.filename,
            chars: attachment.text.length,
          }
        : null,
      conversationHistory,
      latestUserMessage: message,
      lessonTurnInstruction: lessonTurnInstruction || null,
      contents,
      geminiRequest,
      runtimeVariant,
      replyClassification,
    });
    if (isLessonFeedbackTurn) {
      const result = await model.generateContent({
        contents,
        generationConfig: {
          temperature: 0.6,
          responseMimeType: 'application/json',
        },
      });
      const rawText = result.response.text();
      const parsed = parseFeedbackControl(rawText);
      const feedbackControl =
        lessonSectionPhase === 'feedback_basic'
          ? {
              assistantMessage: parsed.assistantMessage,
              resolved: false,
              next: 'feedback' as const,
            }
          : parsed;
      const lesson = resolvedLesson;
      const currentStep = lesson?.steps[safeLessonStepIndex] ?? null;
      const nextStepIndex =
        lesson && currentStep?.nextStepId
          ? lesson.steps.findIndex((step) => step.id === currentStep.nextStepId)
          : -1;
      const resolvedNextStepIndex =
        nextStepIndex >= 0
          ? nextStepIndex
          : lessonCode
            ? Math.min(safeLessonStepIndex + 1, Math.max(0, stepCount - 1))
            : -1;
      const nextStep = lesson && resolvedNextStepIndex >= 0 ? lesson.steps[resolvedNextStepIndex] ?? null : null;
      const autoAdvance =
        lessonSectionPhase === 'worked_example_feedback' &&
        feedbackControl.resolved &&
        feedbackControl.next === 'teach' &&
        resolvedNextStepIndex >= 0 &&
        nextStep !== null;

      console.log('[simple-chatbot] feedback_response', {
        lessonCode: lessonCode || null,
        lessonStepIndex: lessonCode ? safeLessonStepIndex : null,
        lessonSectionPhase: lessonCode ? lessonSectionPhase : null,
        lessonDeeperTurnCount: lessonCode ? lessonDeeperTurnCount : null,
        progressionGate:
          lessonSectionPhase === 'feedback_deeper' ||
          lessonSectionPhase === 'worked_example_feedback' ||
          lessonSectionPhase === 'integrative_feedback',
        assistantMessage: feedbackControl.assistantMessage,
        resolved: feedbackControl.resolved,
        next: feedbackControl.next,
        autoAdvance,
        nextStepId: nextStep?.id ?? null,
        nextStepIndex: resolvedNextStepIndex >= 0 ? resolvedNextStepIndex : null,
        rawText,
        finishReason: result.response.candidates?.[0]?.finishReason ?? null,
        usageMetadata: result.response.usageMetadata ?? null,
        runtimeVariant,
        replyClassification,
      });

      return new Response(autoAdvance ? '' : feedbackControl.assistantMessage, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          ...buildResponseDebugHeaders({
            systemInstruction,
            userId,
            profileFound,
            finishReason: result.response.candidates?.[0]?.finishReason ?? '',
            attachment,
            attachmentStepMeta,
            lessonCode,
            safeLessonStepIndex,
            currentCompletionMode,
            lessonSectionPhase,
            lessonDeeperTurnCount,
            progressionGate:
              lessonSectionPhase === 'feedback_deeper' ||
              lessonSectionPhase === 'worked_example_feedback' ||
              lessonSectionPhase === 'integrative_feedback',
            feedbackResolved: feedbackControl.resolved ? 'true' : 'false',
            feedbackNext: feedbackControl.next,
            autoAdvance,
            nextStep,
            nextStepIndex: resolvedNextStepIndex >= 0 ? resolvedNextStepIndex : null,
            runtimeVariant,
            replyClass: replyClassification?.replyClass ?? null,
          }),
        },
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const result = await model.generateContentStream({ contents });
        let aggregatedReply = '';

        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (!text) continue;
            aggregatedReply += text;
            controller.enqueue(encoder.encode(text));
          }

          const finalResponse = await result.response;
          console.log('[simple-chatbot] response', {
            lessonCode: lessonCode || null,
            lessonStepIndex: lessonCode ? safeLessonStepIndex : null,
            lessonSectionPhase: lessonCode ? lessonSectionPhase : null,
            reply: aggregatedReply.trim(),
            replyLength: aggregatedReply.trim().length,
            finishReason: finalResponse.candidates?.[0]?.finishReason ?? null,
            usageMetadata: finalResponse.usageMetadata ?? null,
          });
          controller.close();
        } catch (streamError) {
          console.error('[simple-chatbot] stream error', streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        ...buildResponseDebugHeaders({
          systemInstruction,
          userId,
          profileFound,
          finishReason: '',
          attachment,
          attachmentStepMeta,
          lessonCode,
          safeLessonStepIndex,
          currentCompletionMode,
          lessonSectionPhase,
          lessonDeeperTurnCount,
          progressionGate:
            lessonSectionPhase === 'feedback_deeper' ||
            lessonSectionPhase === 'worked_example_feedback' ||
            lessonSectionPhase === 'integrative_feedback',
          feedbackResolved: '',
          feedbackNext: '',
          runtimeVariant,
          replyClass: replyClassification?.replyClass ?? null,
        }),
      },
    });
  } catch (error) {
    console.error('[simple-chatbot] error', error);
    return NextResponse.json({ error: 'Unable to get a response.' }, { status: 500 });
  }
}
