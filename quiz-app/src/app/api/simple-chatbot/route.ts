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
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.

## Style

Keep it concise, direct, and practical.`;

const LESSON_TEACH_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Teach the user the **requested unit only**.
- For this turn, deliver **only the current lesson chunk**.
- Do not outline the whole unit unless the user asks.

## Teaching Pattern

- Teach one clear chunk in roughly **120-180 words**.
- Ask **exactly 3 short-answer questions** on that chunk only.

## Rules

- Teach **one main idea** per chunk.
- Explain before questioning.
- Never ask about material that has not been taught yet.
- Keep questions concrete and easy to mark from the learner's wording.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

const LESSON_APPLY_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Stay on the **current lesson section only**.
- Set the learner one current task only.
- Do not teach new material unless the task itself requires one short reminder.

## Task Rules

- Ask only the current guided, practice, or integrative task.
- Keep the task direct and concise.
- Do not add extra questions beyond the current task.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

const LESSON_WORKED_EXAMPLE_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Stay on the **current worked example only**.
- Explain the example step by step.
- Do not move into a later section.

## Rules

- Walk through the given values and each step in order.
- Keep it concise, practical, and easy to follow.
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

## Feedback Rules

- If the learner is basically right, say so clearly.
- If the learner is wrong or unsure, explain it in **simpler language** than the teaching.
- When correcting, give **one short example** if that helps make the point clear.
- Keep the feedback direct and conversational.
- Do not sound like an answer key unless the learner explicitly asks for one.
- Use plain technical notation like **Zs, Ze, R1, R2**. Do not use LaTeX.`;

const LESSON_FEEDBACK_DEEPER_SYSTEM_PROMPT = `# Role

You are a tutor for the City & Guilds 2365 Level 2 electrical course.

Your job is to help the learner understand the current lesson section through short, simple feedback and guided discovery.

## Scope

- Stay on the current lesson section only.
- Respond only to the learner's latest answer.
- Do not move into a later section.

## Decision Rule

- Silently score the learner's latest answer from 0.0 to 1.0.
- If the score is 0.6 or higher, confirm the learner is correct, give one short example if helpful, and ask if they are ready to continue.
- If the score is below 0.6, stay in the current section and enter remedial mode.

## If the learner is wrong or unsure

- Re-explain the idea using simpler, beginner-friendly language while keeping it technically correct.
- Use easier words, shorter sentences, and only the core idea.
- Give one short example only if it genuinely helps.
- Ask 2 to 3 short remedial questions that build understanding step by step through guided discovery.
- Start with the simplest check, then increase difficulty gradually.
- After the remedial questions, ask the section's main check question again.
- Only move on if the learner then shows enough understanding.

## Style

- Keep the tone direct, calm, and conversational.
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

async function getClient() {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }
  return llmClientPromise;
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

    const conversationHistory = thread.map((turn) => ({
      role: turn.role,
      text: turn.text,
    }));

    const lessonTurnInstruction =
      lessonCode && attachment && !isLessonIntroTurn
        ? lessonSectionPhase === 'teach'
          ? currentStepRole === 'worked_example'
            ? `Current lesson section mode: worked_example.\nExplain only this worked example step by step.\nEnd by asking whether it makes sense and whether the learner is ready to try one themselves.\nDo not move to later sections.`
            : currentStepRole === 'guided_practice' || currentStepRole === 'practice' || currentStepRole === 'integrative'
              ? `Current lesson section mode: apply.\nSet only the current task from this section.\nDo not introduce later section content.`
              : `Current lesson section mode: teach_check.\nTeach only this current section in roughly 120-180 words.\nAsk exactly 3 short-answer questions from this current section only.\nDo not ask a deeper question yet.\nDo not move to later sections.`
          : lessonSectionPhase === 'feedback_basic' && currentStepStage === 'teach_check'
            ? `Current lesson section mode: feedback_basic.
The learner has replied to the 3 short questions on this section. Use the recent conversation and the retrieved context to assess those answers.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}

Rules:
- "assistantMessage" is the learner-facing reply.
- Give brief, direct feedback on the 3 answers.
- If the learner is wrong or unsure, explain it in simpler language than the teaching and give one short example if useful.
- End by asking the attached deeper question for this section.
- Because the deeper question still needs an answer, set "resolved" to false and "next" to "feedback".
- Do not move into later section content yourself.`
            : lessonSectionPhase === 'feedback_deeper' && currentStepStage === 'teach_check'
              ? `Current lesson section mode: feedback_deeper.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- Judge the answer against the attached deeper question and deeper answer targets.
- If the score is 0.6 or higher, set "resolved" to true and "next" to "teach".
- When resolved, confirm the learner is correct, give one short example if helpful, and ask if they are ready to continue.
- If the score is below 0.6, set "resolved" to false and "next" to "feedback".
- When unresolved, stay on this same deeper stage.
- Do not ask a new deeper question.
- When resolved, do not begin the next teaching chunk and do not ask a new content question.
- Do not move into later section content yourself.`
              : lessonSectionPhase === 'worked_example_feedback' && currentStepRole === 'worked_example'
                ? `Current lesson section mode: worked_example_feedback.

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
                ? `Current lesson section mode: integrative_feedback.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- Judge the learner's answer against the attached integrative task and answer targets.
- If the learner has integrated the key ideas well enough, set "resolved" to true and "next" to "teach".
- If the learner still needs repair, set "resolved" to false and "next" to "feedback".
- When unresolved, stay on this same integrative feedback stage.
- Do not move into later section content yourself.`
              : `Current lesson section mode: feedback.
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
- Do not move into later section content yourself.`
        : '';

    const currentTurnParts = [
      ...(attachment
        ? [
            {
              text: `Retrieved lesson context (${attachment.filename}):\nUse this as grounding context for this turn only.\nUse only this retrieved section unless the learner explicitly asks otherwise.\n\n${attachment.text}`,
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
      });

      return new Response(autoAdvance ? '' : feedbackControl.assistantMessage, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'x-simple-chatbot-system-instruction': encodeURIComponent(systemInstruction),
          'x-simple-chatbot-user-id': encodeURIComponent(userId ?? ''),
          'x-simple-chatbot-profile-found': profileFound ? 'true' : 'false',
          'x-simple-chatbot-finish-reason': encodeURIComponent(
            result.response.candidates?.[0]?.finishReason ?? ''
          ),
          'x-simple-chatbot-attachment-filename': encodeURIComponent(attachment?.filename ?? ''),
          'x-simple-chatbot-attachment-chars': attachment ? String(attachment.text.length) : '0',
          'x-simple-chatbot-attachment-text': encodeURIComponent(attachment?.text ?? ''),
          'x-simple-chatbot-lesson-step-index': lessonCode ? String(safeLessonStepIndex) : '',
          'x-simple-chatbot-lesson-step-title': encodeURIComponent(attachmentStepMeta?.stepTitle ?? ''),
          'x-simple-chatbot-lesson-step-stage': encodeURIComponent(attachmentStepMeta?.stepStage ?? ''),
          'x-simple-chatbot-lesson-completion-mode': encodeURIComponent(currentCompletionMode),
          'x-simple-chatbot-lesson-step-role': encodeURIComponent(attachmentStepMeta?.stepRole ?? ''),
          'x-simple-chatbot-lesson-step-total': lessonCode && attachmentStepMeta ? String(attachmentStepMeta.totalSteps) : '',
          'x-simple-chatbot-lesson-turn-instruction': encodeURIComponent(lessonTurnInstruction || ''),
          'x-simple-chatbot-gemini-request': encodeURIComponent(JSON.stringify(geminiRequest)),
          'x-simple-chatbot-feedback-phase': lessonSectionPhase,
          'x-simple-chatbot-feedback-deeper-turn-count':
            lessonSectionPhase === 'feedback_deeper' ? String(lessonDeeperTurnCount) : '0',
          'x-simple-chatbot-progression-gate':
            lessonSectionPhase === 'feedback_deeper' ||
            lessonSectionPhase === 'worked_example_feedback' ||
            lessonSectionPhase === 'integrative_feedback'
              ? 'true'
              : 'false',
          'x-simple-chatbot-feedback-resolved': feedbackControl.resolved ? 'true' : 'false',
          'x-simple-chatbot-feedback-next': feedbackControl.next,
          'x-simple-chatbot-auto-advance': autoAdvance ? 'true' : 'false',
          'x-simple-chatbot-next-step-id': encodeURIComponent(nextStep?.id ?? ''),
          'x-simple-chatbot-next-step-index':
            resolvedNextStepIndex >= 0 ? String(resolvedNextStepIndex) : '',
          'x-simple-chatbot-next-step-role': encodeURIComponent(nextStep?.role ?? ''),
          'x-simple-chatbot-next-step-stage': encodeURIComponent(nextStep?.stage ?? ''),
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
        'x-simple-chatbot-system-instruction': encodeURIComponent(systemInstruction),
        'x-simple-chatbot-user-id': encodeURIComponent(userId ?? ''),
        'x-simple-chatbot-profile-found': profileFound ? 'true' : 'false',
        'x-simple-chatbot-finish-reason': '',
        'x-simple-chatbot-attachment-filename': encodeURIComponent(attachment?.filename ?? ''),
        'x-simple-chatbot-attachment-chars': attachment ? String(attachment.text.length) : '0',
        'x-simple-chatbot-attachment-text': encodeURIComponent(attachment?.text ?? ''),
        'x-simple-chatbot-lesson-step-index': lessonCode ? String(safeLessonStepIndex) : '',
        'x-simple-chatbot-lesson-step-title': encodeURIComponent(attachmentStepMeta?.stepTitle ?? ''),
        'x-simple-chatbot-lesson-step-stage': encodeURIComponent(attachmentStepMeta?.stepStage ?? ''),
        'x-simple-chatbot-lesson-completion-mode': encodeURIComponent(currentCompletionMode),
        'x-simple-chatbot-lesson-step-role': encodeURIComponent(attachmentStepMeta?.stepRole ?? ''),
        'x-simple-chatbot-lesson-step-total': lessonCode && attachmentStepMeta ? String(attachmentStepMeta.totalSteps) : '',
        'x-simple-chatbot-lesson-turn-instruction': encodeURIComponent(lessonTurnInstruction || ''),
        'x-simple-chatbot-gemini-request': encodeURIComponent(JSON.stringify(geminiRequest)),
        'x-simple-chatbot-feedback-phase': lessonSectionPhase,
        'x-simple-chatbot-feedback-deeper-turn-count':
          lessonSectionPhase === 'feedback_deeper' ? String(lessonDeeperTurnCount) : '0',
        'x-simple-chatbot-progression-gate':
          lessonSectionPhase === 'feedback_deeper' ||
          lessonSectionPhase === 'worked_example_feedback' ||
          lessonSectionPhase === 'integrative_feedback'
            ? 'true'
            : 'false',
        'x-simple-chatbot-feedback-resolved': '',
        'x-simple-chatbot-feedback-next': '',
      },
    });
  } catch (error) {
    console.error('[simple-chatbot] error', error);
    return NextResponse.json({ error: 'Unable to get a response.' }, { status: 500 });
  }
}
