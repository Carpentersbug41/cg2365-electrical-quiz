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
import { readLatestDynamicGeneratedLessonArtifact } from '@/lib/dynamicGuidedV2/generatedLessonArtifactStore';
import {
  appendDynamicRuntimeEvent,
  appendDynamicRuntimeTurn,
  createDynamicRuntimeEventId,
  createDynamicRuntimeTurnId,
  ensureDynamicRuntimeSession,
  loadDynamicRuntimeSession,
  saveDynamicRuntimeSession,
} from '@/lib/dynamicGuidedV2/runtimeSessionStore';
import { getCurrentDynamicLessonVersionByCode, getDynamicLessonVersion } from '@/lib/dynamicGuidedV2/versionStore';
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

type ChatMode = 'baseline' | 'baseline_v2' | 'lesson' | 'lesson_light';
type LessonPromptProfile =
  | 'baseline'
  | 'challenge_aware_v1'
  | 'intro_short_v1'
  | 'loose_1turn_v1'
  | 'example_first_v1'
  | 'intro_short_example_first_v1'
  | 'deeper_grounded_v1'
  | 'answer_first_brief_v1'
  | 'deeper_practical_v1';

type LessonAttachmentMeta = NonNullable<ReturnType<typeof buildDynamicGuidedV2SectionAttachmentFromLesson>>;

type FeedbackControl = {
  assistantMessage: string;
  resolved: boolean;
  next: 'feedback' | 'teach';
};

type LightLessonControl = {
  assistantMessage: string;
  advance: boolean;
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

const BASELINE_V2_SYSTEM_PROMPT = `#You are an expert in the 2365 level 2 electricians course.

#You are going to teach Rob the unit 202 ONLY.

#Break the unit 202 into the LOs and then plan the 200 word chunks (from the attached material) and how to teach.

#AFter planning, teach the unit by chunks and then ask questions.  Repeat this process.

#Always follow these steps.

- Step 0:
#Break the unit into the LOs and list the LOs then ask the user which LO they want to study.

- Step 1:
#PLan the LO listing out the different sections of the LO.  Wait for user response.  Each section will be 150 words approx.

-Step 2: Teach each section by outputting  150 word chunks and ask 3 short answer questions.

- Step 3:  Wait for user response.  WAIT before contuing.  DON't ask the deeper question yet.
- Step 4 : Ask a question of deeper level that requires 1-2 sentence answer.
- Step 5:  Wait for user response.  WAIT AGAIN!

-Step 6:  Output next 150-200 word chunk and ask 3-4 short answer questions

- Step 7:  wait for user response.
- Step 8 : Ask a question of deeper level that requires 1-2 sentence answer.
- Step 9:  wait for user response.
---
- Repeat this loop until the unit is complete.

---

- If the user requests MCQs give them 20 MCQs on the material that you have taught.  Never question them on something not taught yet!`;

const RUNTIME_BEHAVIOR_CHARTER = `## Runtime Behavior Charter

- Continue the conversation as if the tutoring session is already in progress.
- Respond to the learner's current position, not to the lesson file.
- Stay inside the current section guard rails, but phrase things naturally.
- Explain plainly, directly, and practically.
- Do not sound like a lesson page, worksheet, or marking report.`;

const SIMPLE_LANGUAGE_CHARTER = `## Language Charter

- Explain everything in simple, everyday language first.
- Assume the learner does not know the technical wording yet.
- Use technical terms only when needed, and explain them plainly when you introduce them.
- Prefer short sentences and concrete examples over dense technical wording.`;

const TONE_CHARTER = `## Tone Charter

- Use understated British English.
- Keep the tone calm, matter-of-fact, and helpful.
- Avoid over-enthusiastic praise or filler.
- If the learner is right, acknowledge it briefly with plain wording such as "Yes", "Correct", or a short direct confirmation.
- Avoid phrases such as "Spot on", "Awesome", "Great job", "Nice one", and "No worries".
- Avoid upbeat welcome filler such as "It's great to have you here".`;

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
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}
${TONE_CHARTER}

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
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}
${TONE_CHARTER}

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
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}
${TONE_CHARTER}

## Rules

- Walk through the given values and each step in order.
- Show the formula, substitute the values, perform the calculation, and give the final answer.
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
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}
${TONE_CHARTER}

## Rules

- Judge whether the learner is ready to move on to guided practice.
- If the learner asks a direct process or clarification question, answer that first and then stay on this worked example.
- If the learner is ready, move the learner on.
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
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Feedback Rules

- If the learner is basically right, move the section forward.
- If the learner is wrong or unsure, explain it in **simpler language** than the teaching.
- When correcting, give **one short example** if that helps make the point clear.
- Keep the feedback direct and conversational.
- Keep it specific to the exact missing idea.
- Continue naturally from the learner's last reply rather than sounding like a report.
- Do not sound like an answer key unless the learner explicitly asks for one.
- Use plain technical notation like **Zs, Ze, R1, R2**. Do not use LaTeX.`;

const LESSON_FEEDBACK_CHALLENGE_AWARE_SYSTEM_PROMPT = `# Role

You are an expert in the **2365 Level 2 electricians course**.

## Scope

- Stay on the **current lesson section only**.
- Respond to the learner's latest answer only.
- Do not move into a later section.

${RUNTIME_FEEDBACK_CHARTER}
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Feedback Rules

- If the learner asks a direct clarification or process question, answer that question first.
- Do not treat a direct clarification or process question as a normal assessed answer.
- After answering the learner's question, keep the session inside this same section.
- If the learner is basically right, move the section forward.
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
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Decision Rule

- Silently score the learner's latest answer from 0.0 to 1.0.
- If the score is 0.6 or higher, resolve the section and move on.
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

const LESSON_FEEDBACK_DEEPER_CHALLENGE_AWARE_SYSTEM_PROMPT = `# Role

You are a tutor for the City & Guilds 2365 Level 2 electrical course.

Your job is to help the learner understand the current lesson section through short, simple feedback and one focused repair loop.

## Scope

- Stay on the current lesson section only.
- Respond only to the learner's latest answer.
- Do not move into a later section.

${RUNTIME_FEEDBACK_CHARTER}
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Decision Rule

- If the learner asks a direct clarification or process question, answer that question first.
- Do not treat a direct clarification or process question as a normal scored answer.
- After answering the learner's question, stay on this same deeper stage and invite one short retry on the same idea.
- Otherwise, silently score the learner's latest answer from 0.0 to 1.0.
- If the score is 0.6 or higher, resolve the section and move on.
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

function isLearnerClarificationOrChallenge(message: string): boolean {
  const normalized = message.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (!normalized) return false;
  const patterns = [
    /\bhave you taught (this|that|it)\b/,
    /\byou haven t taught\b/,
    /\byou have not taught\b/,
    /\bhave you explained\b/,
    /\bwhat do you mean\b/,
    /\bi don t get\b/,
    /\bi don t understand\b/,
    /\bwhat formula\b/,
    /\bhave you given (me )?the formula\b/,
    /\bwhere did that come from\b/,
    /\byou haven t explained\b/,
    /\byou have not explained\b/,
  ];
  return patterns.some((pattern) => pattern.test(normalized));
}

const LESSON_INTEGRATIVE_FEEDBACK_SYSTEM_PROMPT = `# Role

You are an expert tutor for the City & Guilds 2365 Level 2 electrical course.

Your job is to evaluate the learner's integrative answer for the current lesson section and help them strengthen it if needed.

## Scope

- Stay on the current integrative section only.
- Respond only to the learner's latest answer.
- Do not move into a later section.

${RUNTIME_FEEDBACK_CHARTER}
${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- Judge whether the learner has pulled together the key ideas from this section well enough to move on.
- If the answer is basically strong enough, move on.
- If the answer is weak, incomplete, or confused, give short corrective feedback in simpler language.
- Ask one short follow-up only if it is needed to repair the answer.
- Keep the reply concise, direct, and practical.
- Use plain technical notation like **Zs, Ze, R1, R2**.
- Do not use LaTeX or markdown maths.`;

const LESSON_LIGHT_INTRO_SYSTEM_PROMPT = `# Role

You are an expert tutor for the **2365 Level 2 electricians course**.

## Scope

- Teach the user the requested lesson only.
- Use the attached lesson section as grounding.
- Treat the lesson section as scope and guard rails, not as wording to copy.

${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- Start briefly and naturally.
- Explain what this lesson covers and how the lesson will run.
- Do not start testing yet.
- Sound like a live tutor, not a lesson file.
- Keep it concise, direct, and natural.`;

const LESSON_LIGHT_SECTION_SYSTEM_PROMPT = `# Role

You are an expert tutor for the **2365 Level 2 electricians course**.

## Scope

- Stay inside the current attached lesson section only.
- Use the lesson section as grounding and guard rails, not as a script.
- Continue the tutoring session naturally from the learner's current position.

${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- If the learner asks a question or raises a concern, answer that first before carrying on.
- Teach before testing.
- Keep the lesson structure clear without sounding scripted.
- In a teaching turn, teach one clear **100-150 word** block first.
- Then ask **exactly 3** short-answer questions on that same block.
- Do not ask the deeper question in the teaching turn.
- If the learner is unsure or asks for clarification, answer briefly and then return to the current lesson stage.
- Never ask about material that has not been taught yet.
- Do not sound like a marker, rubric, worksheet, or lesson page.
- Keep the reply concise, direct, and natural.
- Return JSON only: {"assistantMessage":"...","advance":true|false}`;

const LESSON_LIGHT_BASIC_FEEDBACK_SYSTEM_PROMPT = `# Role

You are an expert tutor for the **2365 Level 2 electricians course**.

## Scope

- Stay inside the current attached lesson section only.
- Use the lesson section as grounding and guard rails, not as a script.

${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- The learner has answered the 3 short questions for this section.
- If the learner asks a question or raises a concern, answer that first before carrying on.
- Reply briefly to what is right and repair only the most important missing idea.
- Then ask **exactly 1** deeper question that needs a 1-2 sentence answer.
- Make the deeper question specific to this chunk and follow any deeper-question mode given in the turn instruction.
- Ask the deeper question in one clean sentence with no filler lead-in.
- Do not use generic prompts like "Why is this important?" unless the section genuinely requires that.
- Do not ask another batch of short questions.
- Do not start the next teaching block.
- If the learner asks a clarification or fairness question, answer it briefly and still end with the deeper question for this section.
- Keep the reply concise, direct, and natural.
- Return JSON only: {"assistantMessage":"...","resolved":false,"next":"feedback"}`;

const LESSON_LIGHT_DEEPER_FEEDBACK_SYSTEM_PROMPT = `# Role

You are an expert tutor for the **2365 Level 2 electricians course**.

## Scope

- Stay inside the current attached lesson section only.
- Use the lesson section as grounding and guard rails, not as a script.

${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- The learner is answering the deeper question for this section.
- If the learner asks a question or raises a concern, answer that first before carrying on.
- If the learner is secure enough, close the section briefly and move on.
- If the learner is not secure enough, repair only the most important missing idea and end with **exactly 1** deeper retry question.
- Do not ask a new batch of short questions.
- Do not start the next teaching block yourself.
- If the learner asks a clarification or fairness question, answer it briefly and still stay in the deeper stage unless they are clearly ready to move on.
- Do not use filler-only bridge lines such as "we will now move on" or "let's move on" unless the same reply also contains the concrete next task or a clean section close.
- Keep the reply concise, direct, and natural.
- Return JSON only: {"assistantMessage":"...","resolved":true|false,"next":"teach"|"feedback"}`;

const LESSON_LIGHT_WORKED_EXAMPLE_SYSTEM_PROMPT = `# Role

You are an expert tutor for the **2365 Level 2 electricians course**.

## Scope

- Stay inside the current attached worked example only.
- Use the lesson section as grounding and guard rails, not as a script.

${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- If the learner asks a question or raises a concern, answer that first before carrying on.
- Work through the example step by step.
- Show the formula, substitute the values, do the calculation, and give the final answer.
- End with one short check asking whether the example makes sense or whether they are ready to try one themselves.
- Do not turn the worked example into a fresh practice question.
- Do not begin a later section yourself.
- Do not use filler-only bridge lines such as "we will now move on" or "let's move on" without giving the actual next task.
- Keep the reply concise, direct, and natural.
- Return JSON only: {"assistantMessage":"...","advance":true|false}`;

const LESSON_LIGHT_WORKED_EXAMPLE_FEEDBACK_SYSTEM_PROMPT = `# Role

You are an expert tutor for the **2365 Level 2 electricians course**.

## Scope

- Stay inside the current attached worked example only.
- Use the lesson section as grounding and guard rails, not as a script.

${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- The learner is responding to whether the worked example makes sense and whether they are ready to try one.
- If the learner asks a question or raises a concern, answer that first before carrying on.
- If the learner is ready to move on, close the worked example briefly and move on.
- If the learner is not ready, repair only the key missing point in simple language.
- When unresolved, end with one short check asking whether it makes sense now or whether they are ready to try one.
- Do not begin guided practice yourself.
- Do not move into later section content yourself.
- Do not use filler-only bridge lines such as "we will now move on" or "let's move on" unless the same reply also contains the concrete next task or a clean section close.
- Keep the reply concise, direct, and natural.
- Return JSON only: {"assistantMessage":"...","resolved":true|false,"next":"teach"|"feedback"}`;

const LESSON_LIGHT_APPLY_SYSTEM_PROMPT = `# Role

You are an expert tutor for the **2365 Level 2 electricians course**.

## Scope

- Stay inside the current attached lesson section only.
- Use the section as grounding and guard rails, not as wording to copy.

${SIMPLE_LANGUAGE_CHARTER}
${TONE_CHARTER}

## Rules

- Help the learner with the current task only.
- If the learner asks a question or raises a concern, answer that first before carrying on.
- Give light scaffolding rather than restarting the whole explanation.
- Do not move into later section content yourself.
- Keep the reply concise, direct, and natural.
- Return JSON only: {"assistantMessage":"...","advance":true|false}`;

function appendPromptVariant(base: string, extra: string): string {
  return extra ? `${base}\n\n${extra}` : base;
}

function lessonLightPromptVariantExtra(
  profile: LessonPromptProfile,
  mode:
    | 'intro'
    | 'section'
    | 'basic_feedback'
    | 'deeper_feedback'
    | 'worked_example'
    | 'worked_example_feedback'
    | 'apply'
): string {
  switch (profile) {
    case 'intro_short_v1':
      return mode === 'intro'
        ? `## Variant

- Keep the intro to 2-4 short sentences.
- Say what the lesson covers and how it will run.
- Do not begin teaching the first content block in the intro.`
        : '';
    case 'intro_short_example_first_v1':
      if (mode === 'intro') {
        return `## Variant

- Keep the intro to 2-4 short sentences.
- Say what the lesson covers and how it will run.
- Do not begin teaching the first content block in the intro.`;
      }
      if (mode === 'section') {
        return `## Variant

- In the teaching block, start with one concrete everyday or site example before naming the formal rule.
- Use the example to make the idea clear, then state the term or rule plainly.`;
      }
      return '';
    case 'loose_1turn_v1':
      return mode === 'section' ||
        mode === 'basic_feedback' ||
        mode === 'deeper_feedback' ||
        mode === 'worked_example' ||
        mode === 'worked_example_feedback' ||
        mode === 'apply'
        ? `## Variant

- If the learner asks a real question, pushes back, or shows uncertainty, answer that directly first.
- You may spend one brief turn on that point before returning to the section structure.
- Do not restart the section after clarifying.`
        : '';
    case 'example_first_v1':
      return mode === 'section'
        ? `## Variant

- In the teaching block, start with one concrete everyday or site example before naming the formal rule.
- Use the example to make the idea clear, then state the term or rule plainly.`
        : '';
    case 'answer_first_brief_v1':
      return mode === 'basic_feedback'
        ? `## Variant

- Start from the learner's actual answer.
- Confirm or correct it in the first sentence.
- Do not recap the whole chunk unless that is genuinely needed.
- Repair only the one key idea that matters for the deeper question.`
        : '';
    case 'deeper_grounded_v1':
      return mode === 'basic_feedback'
        ? `## Variant

- Ask one deeper question that can be answered from the chunk just taught.
- Do not ask the learner to infer from something that was not stated clearly in this section.
- Do not use generic prompts such as "Why is this important?" or "How would you explain the importance...".
- Keep the deeper question to one clean sentence with no filler lead-in.`
        : '';
    case 'deeper_practical_v1':
      return mode === 'basic_feedback'
        ? `## Variant

- Prefer deeper questions that ask about practical effect, comparison, or what would happen next.
- Avoid abstract framing unless the section genuinely requires it.`
        : '';
    default:
      return '';
  }
}

function lessonLightSystemPrompt(
  profile: LessonPromptProfile,
  mode:
    | 'intro'
    | 'section'
    | 'basic_feedback'
    | 'deeper_feedback'
    | 'worked_example'
    | 'worked_example_feedback'
    | 'apply'
): string {
  const base =
    mode === 'intro'
      ? LESSON_LIGHT_INTRO_SYSTEM_PROMPT
      : mode === 'section'
        ? LESSON_LIGHT_SECTION_SYSTEM_PROMPT
        : mode === 'basic_feedback'
          ? LESSON_LIGHT_BASIC_FEEDBACK_SYSTEM_PROMPT
          : mode === 'deeper_feedback'
            ? LESSON_LIGHT_DEEPER_FEEDBACK_SYSTEM_PROMPT
            : mode === 'worked_example'
              ? LESSON_LIGHT_WORKED_EXAMPLE_SYSTEM_PROMPT
              : mode === 'worked_example_feedback'
                ? LESSON_LIGHT_WORKED_EXAMPLE_FEEDBACK_SYSTEM_PROMPT
                : LESSON_LIGHT_APPLY_SYSTEM_PROMPT;
  return appendPromptVariant(base, lessonLightPromptVariantExtra(profile, mode));
}

function lessonLightTurnInstructionExtra(
  profile: LessonPromptProfile,
  mode:
    | 'intro'
    | 'section'
    | 'basic_feedback'
    | 'deeper_feedback'
    | 'worked_example'
    | 'worked_example_feedback'
    | 'apply'
): string {
  switch (profile) {
    case 'intro_short_v1':
      return mode === 'intro'
        ? `\nKeep this intro very short. Do not start teaching the first content block yet.`
        : '';
    case 'intro_short_example_first_v1':
      if (mode === 'intro') {
        return `\nKeep this intro very short. Do not start teaching the first content block yet.`;
      }
      if (mode === 'section') {
        return `\nStart the teaching block with one concrete example before naming the rule or term.`;
      }
      return '';
    case 'loose_1turn_v1':
      return mode === 'section' ||
        mode === 'basic_feedback' ||
        mode === 'deeper_feedback' ||
        mode === 'worked_example' ||
        mode === 'worked_example_feedback' ||
        mode === 'apply'
        ? `\nIf the learner asks a real question or pushes back, answer it directly first. You may spend one brief turn on that before returning to the lesson structure.`
        : '';
    case 'example_first_v1':
      return mode === 'section'
        ? `\nStart the teaching block with one concrete example before naming the rule or term.`
        : '';
    case 'answer_first_brief_v1':
      return mode === 'basic_feedback'
        ? `\nStart from the learner's actual answer. Do not recap the whole chunk unless needed.`
        : '';
    case 'deeper_grounded_v1':
      return mode === 'basic_feedback'
        ? `\nAsk one deeper question that is directly answerable from the chunk just taught. Do not use generic importance wording. Do not ask the learner to infer from an unstated fact.`
        : '';
    case 'deeper_practical_v1':
      return mode === 'basic_feedback'
        ? `\nMake the deeper question practical, comparative, or a short what-happens-next question where possible.`
        : '';
    default:
      return '';
  }
}

function normalizeWhitespace(text: unknown): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferDeeperQuestionModeFromText(questionText: string): 'connection' | 'synthesis' | 'hypothesis' {
  const normalized = normalizeWhitespace(questionText).toLowerCase();
  if (!normalized) return 'synthesis';
  if (/\bif\b|\bwhat would happen\b|\bwould happen\b|\bimagine\b|\bsuppose\b|\bpredict\b/.test(normalized)) {
    return 'hypothesis';
  }
  if (/\bdiffer\b|\bdifference\b|\bcompare\b|\bcompared\b|\baffect\b|\binfluence\b|\brelationship\b|\blink\b|\blead to\b|\breduce\b|\bincrease\b|\bcause\b/.test(normalized)) {
    return 'connection';
  }
  return 'synthesis';
}

function describeDeeperQuestionMode(mode: 'connection' | 'synthesis' | 'hypothesis'): string {
  switch (mode) {
    case 'connection':
      return 'Ask one sentence that links two ideas from this section.';
    case 'hypothesis':
      return 'Ask one sentence that predicts or justifies what would happen in a nearby case.';
    default:
      return 'Ask one sentence that combines the taught ideas into a short reasoned explanation.';
  }
}

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

function parseLightLessonControl(rawText: string): LightLessonControl {
  const fallback: LightLessonControl = {
    assistantMessage: rawText.trim() || 'Let’s stay on this point for one more step.',
    advance: false,
  };

  const trimmed = rawText.trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  const candidate =
    firstBrace >= 0 && lastBrace > firstBrace ? trimmed.slice(firstBrace, lastBrace + 1) : trimmed;

  try {
    const parsed = JSON.parse(candidate) as Partial<LightLessonControl>;
    return {
      assistantMessage:
        typeof parsed.assistantMessage === 'string' && parsed.assistantMessage.trim()
          ? parsed.assistantMessage.trim()
          : fallback.assistantMessage,
      advance: parsed.advance === true,
    };
  } catch {
    const assistantMatch = candidate.match(/"assistantMessage"\s*:\s*"([\s\S]*?)"/);
    const advanceMatch = candidate.match(/"advance"\s*:\s*(true|false)/i);

    return {
      assistantMessage: assistantMatch
        ? assistantMatch[1]
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\\\/g, '\\')
            .trim() || fallback.assistantMessage
        : fallback.assistantMessage,
      advance: advanceMatch?.[1]?.toLowerCase() === 'true',
    };
  }
}

function normalizeLessonAssistantTone(text: string): string {
  let normalized = text.trim();
  if (!normalized) return normalized;

  const replacements: Array<[RegExp, string]> = [
    [/^\s*Spot on[!,.:\s-]*/i, 'Yes. '],
    [/^\s*Exactly right[!,.:\s-]*/i, 'Yes. '],
    [/^\s*That'?s exactly right[!,.:\s-]*/i, 'Yes. '],
    [/^\s*Great start[!,.:\s-]*/i, 'Good start. '],
    [/^\s*Nice one[!,.:\s-]*/i, 'Yes. '],
    [/^\s*No worries[!,.:\s-]*/i, 'Right. '],
    [/It(?:'|’)s great to have you here\.?\s*/gi, ''],
  ];

  for (const [pattern, replacement] of replacements) {
    normalized = normalized.replace(pattern, replacement);
  }

  normalized = normalized
    .replace(/\bSpot on\b/gi, 'Yes')
    .replace(/\bExactly right\b/gi, 'Yes')
    .replace(/\bNice one\b/gi, 'Yes')
    .replace(/\bNo worries\b/gi, 'Right');

  return normalized.replace(/\s{2,}/g, ' ').trim();
}

function normalizeLessonQuestionFormatting(text: string): string {
  if (!text.trim()) return text.trim();

  return text
    .replace(/([^\n])\s+(1\.\s+)/g, '$1\n\n$2')
    .replace(/\s+(2\.\s+)/g, '\n$1')
    .replace(/\s+(3\.\s+)/g, '\n$1')
    .replace(/\s+(4\.\s+)/g, '\n$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function runFinalLessonCoverageAudit(params: {
  client: Awaited<ReturnType<typeof createLLMClientWithFallback>>;
  lesson: DynamicGuidedV2Lesson;
  conversationHistory: Array<{ role: 'user' | 'assistant'; text: string }>;
}): Promise<{
  complete: boolean;
  catchUpMessage: string | null;
  missingObjectives: string[];
}> {
  const objectives = params.lesson.steps
    .filter((step) => step.stage === 'teach_check' || step.stage === 'worked_example' || step.stage === 'guided_practice' || step.stage === 'practice' || step.stage === 'integrative')
    .map((step) => normalizeWhitespace(step.objective))
    .filter(Boolean);

  if (objectives.length === 0) {
    return { complete: true, catchUpMessage: null, missingObjectives: [] };
  }

  const transcript = params.conversationHistory
    .map((turn) => `${turn.role.toUpperCase()}: ${turn.text}`)
    .join('\n\n');

  const model = params.client.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `# Role

You are checking lesson coverage at the end of a tutoring session.

## Rules

- Read the lesson objectives and the transcript.
- Decide whether the lesson has clearly covered the required objectives well enough to finish.
- If one or two objectives are still missing, write one short catch-up teaching turn in simple language.
- Keep the catch-up practical and brief.
- Return JSON only.

## Lesson objectives

${objectives.map((item, index) => `${index + 1}. ${item}`).join('\n')}

## Transcript

${transcript}

## Output

{
  "complete": true,
  "missingObjectives": ["..."],
  "catchUpMessage": "..."
}`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const candidate = extractJsonCandidate(rawText);
    const parsed = JSON.parse(candidate) as Partial<{
      complete: boolean;
      missingObjectives: string[];
      catchUpMessage: string;
    }>;
    return {
      complete: parsed.complete === true,
      missingObjectives: Array.isArray(parsed.missingObjectives)
        ? parsed.missingObjectives.map((item) => normalizeWhitespace(item)).filter(Boolean)
        : [],
      catchUpMessage:
        typeof parsed.catchUpMessage === 'string' && parsed.catchUpMessage.trim()
          ? normalizeLessonAssistantTone(parsed.catchUpMessage)
          : null,
    };
  } catch {
    return { complete: true, catchUpMessage: null, missingObjectives: [] };
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

async function logSimpleChatbotAssistantTurn(params: {
  sessionId: string;
  userId: string | null;
  lessonCode: string;
  lessonVersionId: string | null;
  runtimeVariant: RuntimeVariant;
  lessonPromptProfile: LessonPromptProfile;
  lessonStepIndex: number;
  lessonSectionPhase: string;
  currentStepId: string | null;
  currentStepRole: string;
  currentStepStage: string;
  message: string;
  assistantMessage: string;
  systemInstruction: string;
  attachment: AttachmentPayload;
  attachmentStepMeta: LessonAttachmentMeta | null;
  lessonTurnInstruction: string;
  repairFocus: string;
  replyClassification: ReplyClassification | null;
  geminiRequest: unknown;
  finishReason: string | null;
  autoAdvance?: boolean;
  nextStepId?: string | null;
  nextStepIndex?: number | null;
  nextStepRole?: string | null;
  nextStepStage?: string | null;
  feedbackResolved?: boolean | null;
  feedbackNext?: string | null;
  progressionGate?: boolean;
  lessonDeeperTurnCount?: number;
  rawResponseText?: string | null;
  challengeDetected?: boolean;
}): Promise<void> {
  if (!params.sessionId || !params.lessonCode) return;

  const existing = await loadDynamicRuntimeSession(params.sessionId);
  let runtimeSession = ensureDynamicRuntimeSession({
    existing,
    sessionId: params.sessionId,
    userId: params.userId,
    lessonCode: params.lessonCode,
    lessonVersionId: params.lessonVersionId,
    sourceContext: 'simple_chatbot_lesson_mode',
    runtimeSurface: 'simple_chatbot',
    runtimeVariant: params.runtimeVariant,
    currentStepIndex: params.lessonStepIndex,
    currentPhase: params.lessonSectionPhase,
  });

  if (!existing) {
    runtimeSession = appendDynamicRuntimeEvent(runtimeSession, {
      id: createDynamicRuntimeEventId('session_started'),
      type: 'session_started',
      createdAt: runtimeSession.createdAt,
      payload: {
        lessonCode: params.lessonCode,
        lessonVersionId: params.lessonVersionId,
        runtimeVariant: params.runtimeVariant,
        lessonPromptProfile: params.lessonPromptProfile,
        challengeDetected: params.challengeDetected ?? false,
      },
    });
  }

  const turnCreatedAt = new Date().toISOString();
  if (params.message) {
    runtimeSession = appendDynamicRuntimeTurn(runtimeSession, {
      id: createDynamicRuntimeTurnId('user'),
      role: 'user',
      kind: 'visible_turn',
      content: params.message,
      stepId: params.currentStepId,
      phase: params.lessonSectionPhase,
      createdAt: turnCreatedAt,
      meta: {
        stepIndex: params.lessonStepIndex,
        stepRole: params.currentStepRole,
        stepStage: params.currentStepStage,
      },
    });
    runtimeSession = appendDynamicRuntimeEvent(runtimeSession, {
      id: createDynamicRuntimeEventId('user_turn_received'),
      type: 'user_turn_received',
      createdAt: turnCreatedAt,
      payload: {
        message: params.message,
        lessonStepIndex: params.lessonStepIndex,
        lessonSectionPhase: params.lessonSectionPhase,
        lessonPromptProfile: params.lessonPromptProfile,
        challengeDetected: params.challengeDetected ?? false,
      },
    });
  }

  if (params.assistantMessage) {
    runtimeSession = appendDynamicRuntimeTurn(runtimeSession, {
      id: createDynamicRuntimeTurnId('assistant'),
      role: 'assistant',
      kind: 'visible_turn',
      content: params.assistantMessage,
      stepId: params.currentStepId,
      phase: params.lessonSectionPhase,
      createdAt: turnCreatedAt,
      meta: {
        stepIndex: params.lessonStepIndex,
        stepRole: params.currentStepRole,
        stepStage: params.currentStepStage,
        autoAdvance: params.autoAdvance ?? false,
      },
    });
  }

  runtimeSession = appendDynamicRuntimeEvent(runtimeSession, {
    id: createDynamicRuntimeEventId('assistant_turn_debug'),
    type: 'assistant_turn_debug',
    createdAt: turnCreatedAt,
    payload: {
      lessonStepIndex: params.lessonStepIndex,
      lessonSectionPhase: params.lessonSectionPhase,
      lessonPromptProfile: params.lessonPromptProfile,
      challengeDetected: params.challengeDetected ?? false,
      stepRole: params.currentStepRole,
      stepStage: params.currentStepStage,
      systemInstruction: params.systemInstruction,
      attachmentText: params.attachment?.text ?? null,
      attachmentFilename: params.attachment?.filename ?? null,
      lessonTurnInstruction: params.lessonTurnInstruction || null,
      repairFocus: params.repairFocus || null,
      replyClassification: params.replyClassification,
      geminiRequest: params.geminiRequest,
      finishReason: params.finishReason,
      assistantMessage: params.assistantMessage,
      rawResponseText: params.rawResponseText ?? null,
      progressionGate: params.progressionGate ?? false,
      lessonDeeperTurnCount: params.lessonDeeperTurnCount ?? 0,
      feedbackResolved: params.feedbackResolved ?? null,
      feedbackNext: params.feedbackNext ?? null,
      autoAdvance: params.autoAdvance ?? false,
      nextStepId: params.nextStepId ?? null,
      nextStepIndex: params.nextStepIndex ?? null,
      nextStepRole: params.nextStepRole ?? null,
      nextStepStage: params.nextStepStage ?? null,
    },
  });

  if (params.autoAdvance && params.nextStepIndex != null) {
    runtimeSession = appendDynamicRuntimeEvent(runtimeSession, {
      id: createDynamicRuntimeEventId('auto_advance'),
      type: 'auto_advance',
      createdAt: turnCreatedAt,
      payload: {
        fromStepIndex: params.lessonStepIndex,
        toStepIndex: params.nextStepIndex,
        toStepId: params.nextStepId ?? null,
        toStepRole: params.nextStepRole ?? null,
        toStepStage: params.nextStepStage ?? null,
      },
    });
  }

  await saveDynamicRuntimeSession(runtimeSession);
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
  chatMode?: ChatMode;
  lessonPromptProfile?: string;
  challengeDetected?: boolean;
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

  return {
    'x-simple-chatbot-system-instruction': encodeURIComponent(systemInstruction),
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
    'x-simple-chatbot-chat-mode': params.chatMode ?? 'baseline',
    'x-simple-chatbot-lesson-prompt-profile': encodeURIComponent(params.lessonPromptProfile ?? 'baseline'),
    'x-simple-chatbot-challenge-detected': params.challengeDetected ? 'true' : 'false',
    'x-simple-chatbot-auto-advance': autoAdvance ? 'true' : 'false',
    'x-simple-chatbot-next-step-id': encodeURIComponent(nextStep?.id ?? ''),
    'x-simple-chatbot-next-step-index': nextStepIndex != null && nextStepIndex >= 0 ? String(nextStepIndex) : '',
    'x-simple-chatbot-next-step-role': encodeURIComponent(nextStep?.role ?? ''),
    'x-simple-chatbot-next-step-stage': encodeURIComponent(nextStep?.stage ?? ''),
    'x-simple-chatbot-runtime-variant': runtimeVariant,
    'x-simple-chatbot-reply-class': replyClass ?? '',
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/simple-chatbot',
    methods: ['GET', 'POST'],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = typeof body.sessionId === 'string' && body.sessionId.trim() ? body.sessionId.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const thread = Array.isArray(body.thread) ? (body.thread as ThreadTurn[]) : [];
    const lessonCode = typeof body.lessonCode === 'string' ? body.lessonCode.trim().toUpperCase() : '';
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
    const chatMode: ChatMode =
      body.chatMode === 'lesson'
        ? 'lesson'
        : body.chatMode === 'lesson_light'
          ? 'lesson_light'
        : body.chatMode === 'baseline_v2'
          ? 'baseline_v2'
          : 'baseline';
    const lessonPromptProfile: LessonPromptProfile =
      body.lessonPromptProfile === 'baseline'
        ? 'baseline'
        : body.lessonPromptProfile === 'challenge_aware_v1'
          ? 'challenge_aware_v1'
          : body.lessonPromptProfile === 'intro_short_v1'
            ? 'intro_short_v1'
            : body.lessonPromptProfile === 'loose_1turn_v1'
              ? 'loose_1turn_v1'
              : body.lessonPromptProfile === 'example_first_v1'
                ? 'example_first_v1'
                : body.lessonPromptProfile === 'intro_short_example_first_v1'
                  ? 'intro_short_example_first_v1'
                  : body.lessonPromptProfile === 'deeper_grounded_v1'
                    ? 'deeper_grounded_v1'
                : body.lessonPromptProfile === 'answer_first_brief_v1'
                  ? 'answer_first_brief_v1'
                  : body.lessonPromptProfile === 'deeper_practical_v1'
                    ? 'deeper_practical_v1'
          : chatMode === 'lesson'
            ? 'challenge_aware_v1'
            : chatMode === 'lesson_light'
              ? 'intro_short_example_first_v1'
              : 'baseline';
    let attachment =
      body.attachment &&
      typeof body.attachment.filename === 'string' &&
      typeof body.attachment.text === 'string'
        ? ({ filename: body.attachment.filename, text: body.attachment.text } satisfies NonNullable<AttachmentPayload>)
        : null;

    if (!message && !lessonCode) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const explicitVersion = dynamicVersionId ? await getDynamicLessonVersion(dynamicVersionId) : null;
    const currentVersion = explicitVersion || !lessonCode ? null : await getCurrentDynamicLessonVersionByCode(lessonCode);
    const generatedArtifact = explicitVersion || currentVersion || !lessonCode
      ? null
      : readLatestDynamicGeneratedLessonArtifact(lessonCode);
    const resolvedLesson =
      explicitVersion?.lesson ??
      currentVersion?.lesson ??
      generatedArtifact?.lesson ??
      (lessonCode ? loadDynamicGuidedV2Lesson(lessonCode) : null);
    const resolvedLessonVersionId = explicitVersion?.id ?? currentVersion?.id ?? dynamicVersionId ?? null;
    const stepCount =
      resolvedLesson?.steps.length ??
      (lessonCode ? getDynamicGuidedV2LessonStepCount(lessonCode) : 0);
    const safeLessonStepIndex = lessonCode
      ? Math.max(0, Math.min(lessonStepIndex, Math.max(0, stepCount - 1)))
      : 0;

    if (chatMode === 'baseline_v2' && thread.length > 0) {
      attachment = null;
    }

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
    const includeLearnerProfileInPrompt = chatMode !== 'lesson' && chatMode !== 'lesson_light';
    const profileFound = includeLearnerProfileInPrompt && Boolean(learnerProfileSummary);
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
    const currentDeeperQuestionMode =
      currentLessonStep?.deeperQuestionMode ??
      inferDeeperQuestionModeFromText(currentLessonStep?.deeperQuestionText ?? '');
    const currentStepId = currentLessonStep?.id ?? null;
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
    const challengeDetected =
      (chatMode === 'lesson_light' || lessonPromptProfile === 'challenge_aware_v1') &&
      currentLessonStep &&
      currentLessonStep.stage === 'teach_check' &&
      isLessonFeedbackTurn &&
      (lessonSectionPhase === 'feedback_basic' || lessonSectionPhase === 'feedback_deeper') &&
      isLearnerClarificationOrChallenge(message);
    const replyClassification: ReplyClassification | null =
      chatMode !== 'lesson'
        ? null
        :
      runtimeVariant === 'lean_feedback_v1' &&
      currentLessonStep &&
      currentLessonStep.stage === 'teach_check' &&
      (lessonSectionPhase === 'feedback_basic' || lessonSectionPhase === 'feedback_deeper') &&
      !questionOnlyDynamicStep &&
      isLessonFeedbackTurn &&
      !challengeDetected
        ? classifyLessonReply(currentLessonStep, message, lessonSectionPhase)
        : null;
    const workedExampleReadiness =
      chatMode !== 'lesson'
        ? null
        :
      runtimeVariant === 'lean_feedback_v1' &&
      currentLessonStep &&
      currentStepRole === 'worked_example' &&
      lessonSectionPhase === 'worked_example_feedback' &&
      isLessonFeedbackTurn
        ? classifyWorkedExampleReadiness(currentLessonStep, message)
        : null;
    const repairFocus =
      currentLessonStep && isLessonFeedbackTurn
        ? chatMode === 'lesson_light'
          ? ''
          : challengeDetected
          ? ''
          : replyClassification
          ? buildTeachCheckRepairFocusFromClassification(currentLessonStep, lessonSectionPhase, replyClassification)
          : workedExampleReadiness
            ? buildWorkedExampleSupportFocusFromClassification(workedExampleReadiness)
          : buildTeachCheckRepairFocus(currentLessonStep, message, lessonSectionPhase)
        : '';
    const systemInstruction = [
      isLessonIntroTurn
        ? chatMode === 'lesson_light'
          ? lessonLightSystemPrompt(lessonPromptProfile, 'intro')
          : LESSON_INTRO_SYSTEM_PROMPT
        : lessonCode
          ? chatMode === 'lesson_light'
            ? isLessonFeedbackTurn
              ? lessonSectionPhase === 'feedback_deeper'
                ? currentStepStage === 'teach_check'
                  ? lessonLightSystemPrompt(lessonPromptProfile, 'deeper_feedback')
                  : currentStepRole === 'worked_example'
                    ? lessonLightSystemPrompt(lessonPromptProfile, 'worked_example_feedback')
                    : LESSON_INTEGRATIVE_FEEDBACK_SYSTEM_PROMPT
                : lessonSectionPhase === 'feedback_basic'
                  ? currentStepStage === 'teach_check'
                    ? lessonLightSystemPrompt(lessonPromptProfile, 'basic_feedback')
                    : lessonLightSystemPrompt(lessonPromptProfile, 'section')
                  : currentStepRole === 'worked_example'
                    ? lessonLightSystemPrompt(lessonPromptProfile, 'worked_example_feedback')
                    : LESSON_INTEGRATIVE_FEEDBACK_SYSTEM_PROMPT
              : currentStepRole === 'worked_example'
                ? lessonLightSystemPrompt(lessonPromptProfile, 'worked_example')
                : currentStepRole === 'guided_practice' || currentStepRole === 'practice' || currentStepRole === 'integrative'
                  ? lessonLightSystemPrompt(lessonPromptProfile, 'apply')
                  : lessonLightSystemPrompt(lessonPromptProfile, 'section')
            : isLessonFeedbackTurn
              ? lessonSectionPhase === 'feedback_deeper'
                ? challengeDetected
                  ? LESSON_FEEDBACK_DEEPER_CHALLENGE_AWARE_SYSTEM_PROMPT
                  : LESSON_FEEDBACK_DEEPER_SYSTEM_PROMPT
                : lessonSectionPhase === 'worked_example_feedback'
                  ? LESSON_WORKED_EXAMPLE_FEEDBACK_SYSTEM_PROMPT
                : lessonSectionPhase === 'integrative_feedback'
                  ? LESSON_INTEGRATIVE_FEEDBACK_SYSTEM_PROMPT
                  : challengeDetected
                    ? LESSON_FEEDBACK_CHALLENGE_AWARE_SYSTEM_PROMPT
                    : LESSON_FEEDBACK_SYSTEM_PROMPT
              : currentStepRole === 'worked_example'
                ? LESSON_WORKED_EXAMPLE_SYSTEM_PROMPT
              : currentStepRole === 'guided_practice' || currentStepRole === 'practice' || currentStepRole === 'integrative'
                ? LESSON_APPLY_SYSTEM_PROMPT
                : LESSON_TEACH_SYSTEM_PROMPT
          : chatMode === 'baseline_v2'
            ? BASELINE_V2_SYSTEM_PROMPT
            : BASELINE_SYSTEM_PROMPT,
      includeLearnerProfileInPrompt && learnerProfileSummary
        ? `## This is the user's profile:\n${learnerProfileSummary}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const isLessonLightStructuredTurn = Boolean(lessonCode) && chatMode === 'lesson_light' && !isLessonIntroTurn;

    const model = client.getGenerativeModel({
      model: getGeminiModelWithDefault(),
      systemInstruction,
      generationConfig: {
        temperature: 0.6,
        ...(isLessonFeedbackTurn || isLessonLightStructuredTurn ? { responseMimeType: 'application/json' } : {}),
      },
    });

    const conversationHistory = recentConversation(thread).map((turn) => ({
      role: turn.role,
      text: turn.text,
    }));

    const lessonTurnInstruction =
      lessonCode && attachment && !isLessonIntroTurn
        ? chatMode === 'lesson_light'
          ? lessonSectionPhase === 'teach'
            ? currentStepRole === 'worked_example'
              ? `Current mode: worked_example_light.
Use this worked example as grounding only.
If the learner asks a direct process or clarification question, answer it first.
Then work through the example step by step.
Show the formula, substitute the numbers, do the calculation, and give the final answer.
End with one short check asking whether the example makes sense or whether they are ready to try one themselves.
Do not turn the worked example into a fresh practice question.
${lessonLightTurnInstructionExtra(lessonPromptProfile, 'worked_example')}

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "advance": false
}`
              : currentStepRole === 'guided_practice' || currentStepRole === 'practice' || currentStepRole === 'integrative'
                ? `Current mode: apply_light.
Stay on the current task only.
Answer the learner directly, give light scaffolding, and decide whether they are ready to move on.
${lessonLightTurnInstructionExtra(lessonPromptProfile, 'apply')}

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "advance": false
}`
                : `Current mode: section_tutor_light.
Teach naturally from this current section only.
Use the attached section as guard rails, not wording to copy.
Output one clear teaching block of 100-150 words.
Then ask exactly 3 numbered short-answer questions on this same section.
Do not ask the deeper question yet.
If the learner is confused, answer that confusion briefly and then return to this lesson structure.
${lessonLightTurnInstructionExtra(lessonPromptProfile, 'section')}

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "advance": false
}`
          : lessonSectionPhase === 'feedback_basic' && currentStepStage === 'teach_check'
            ? challengeDetected
              ? `Current mode: feedback_basic_light_challenge.
The learner has asked a direct clarification or fairness question about this same section.
Answer that first in plain language.
If they ask whether this has already been taught, say briefly whether it has just been covered in this section.
Then end with exactly 1 deeper question for this same section.
${describeDeeperQuestionMode(currentDeeperQuestionMode)}
Ask that deeper question in one clean sentence with no filler lead-in.
Do not ask another batch of short questions.
Do not start the next teaching block.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}`
              : `Current mode: feedback_basic_light.
The learner has answered the 3 short questions for this section.
Reply briefly to what is secure and repair only the most important missing idea.
Then ask exactly 1 deeper question for this same section.
${describeDeeperQuestionMode(currentDeeperQuestionMode)}
Ask that deeper question in one clean sentence with no filler lead-in.
Avoid generic deeper prompts like "Why is this important?" unless that is genuinely the best fit for this section.
Do not ask another batch of short questions.
Do not start the next teaching block.
If the learner asks a clarification or fairness question, answer it briefly and still end with the deeper question.
${lessonLightTurnInstructionExtra(lessonPromptProfile, 'basic_feedback')}

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}`
          : lessonSectionPhase === 'feedback_deeper' && currentStepStage === 'teach_check'
              ? challengeDetected
                ? `Current mode: feedback_deeper_light_challenge.
The learner has asked a direct clarification or fairness question about this same section.
Answer that question first in plain language.
If they ask whether this has already been taught, say briefly whether it has just been covered in this section.
Stay on this deeper stage unless they are clearly ready to move on.
End with exactly 1 short retry deeper question on the same idea.
Do not ask a new short-question batch.
Do not start the next teaching block yourself.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}`
                : `Current mode: feedback_deeper_light.
The learner is answering the deeper question for this section.
If the learner is secure enough, close the section briefly and move on.
If not, repair only the most important missing idea and end with exactly 1 deeper retry question.
Do not ask any new short-question batch.
Do not start the next teaching block yourself.
If the learner asks a clarification or fairness question, answer it briefly and still stay in this deeper stage unless they are clearly ready to move on.
Do not output filler-only bridge lines such as "we will now move on" or "let's move on" unless the same reply also gives the concrete next task or a clean section close.
${lessonLightTurnInstructionExtra(lessonPromptProfile, 'deeper_feedback')}

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true,
  "next": "teach"
}`
              : lessonSectionPhase === 'worked_example_feedback' && currentStepRole === 'worked_example'
                ? `Current mode: worked_example_feedback_light.
The learner is responding to whether the worked example makes sense and whether they are ready to try one.
If the learner is ready, close the worked example briefly and move on.
If the learner is not ready, repair only the most important missing point in simple language.
If the learner asks a direct question or concern, answer it first and then decide whether they are ready.
When unresolved, end with one short check asking whether it makes sense now or whether they are ready to try one.
Do not begin guided practice yourself.
Do not output filler-only bridge lines such as "we will now move on" or "let's move on" unless the same reply also gives the concrete next task or a clean section close.
${lessonLightTurnInstructionExtra(lessonPromptProfile, 'worked_example_feedback')}

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": true|false,
  "next": "teach"|"feedback"
}`
              : `Current mode: section_tutor_light.
Stay inside this current section only.
Answer the learner directly and keep the task or explanation bounded to this section.
Only advance if the learner is ready for the next section.
${lessonLightTurnInstructionExtra(lessonPromptProfile, 'section')}

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "advance": true
}`
        : lessonSectionPhase === 'teach'
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
            ? challengeDetected
              ? `Current mode: feedback_basic.
The learner has asked a direct clarification or process question about this same section.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}

Rules:
- "assistantMessage" is the learner-facing reply.
- Answer the learner's direct question first using this current section only.
- Do not treat the learner's message as a normal marked answer.
- If the learner asks whether this idea has already been taught, say briefly whether it has already been explained in this section.
- Clarify the exact point they challenged in simple language.
- Keep the reply short, direct, and conversational.
- After answering, end by asking the attached deeper question for this same section.
- Because the deeper question still needs an answer, set "resolved" to false and "next" to "feedback".
- Do not move into later section content yourself.`
              : runtimeVariant === 'lean_feedback_v1' && !questionOnlyDynamicStep
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
              ? challengeDetected
                ? `Current mode: feedback_deeper.

Return valid JSON only in this shape:
{
  "assistantMessage": "string",
  "resolved": false,
  "next": "feedback"
}

Output rules:
- "assistantMessage" is the learner-facing reply.
- The learner has asked a direct clarification or process question about this same section.
- Answer that question first using this current section only.
- Do not treat the learner's message as a normal scored answer.
- If the learner asks whether this idea has already been taught, say briefly whether it has already been explained in this section.
- Stay on this same deeper stage.
- End with exactly one short retry question on the same underlying idea.
- Keep the reply short, direct, and conversational.
- Do not ask a different deeper question and do not switch to a new chunk.
- Set "resolved" to false and "next" to "feedback".`
                : runtimeVariant === 'lean_feedback_v1' && !questionOnlyDynamicStep
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
- When resolved, close the section briefly and move on.
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
- When resolved, close the section briefly and move on.
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
- When resolved, close the section briefly and move on.
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
      generationConfig: isLessonFeedbackTurn || isLessonLightStructuredTurn
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
      lessonPromptProfile,
      replyClassification,
      challengeDetected,
    });
    if (isLessonFeedbackTurn || isLessonLightStructuredTurn) {
      const result = await model.generateContent({
        contents,
        generationConfig: {
          temperature: 0.6,
          responseMimeType: 'application/json',
        },
      });
      const rawText = result.response.text();
      const feedbackControl =
        chatMode === 'lesson_light'
          ? (() => {
              if (lessonSectionPhase === 'teach') {
                const parsed = parseLightLessonControl(rawText);
                return {
                  assistantMessage: parsed.assistantMessage,
                  resolved: parsed.advance,
                  next: parsed.advance ? ('teach' as const) : ('feedback' as const),
                };
              }

              const parsed = parseFeedbackControl(rawText);
              if (lessonSectionPhase === 'feedback_basic') {
                return {
                  assistantMessage: parsed.assistantMessage,
                  resolved: false,
                  next: 'feedback' as const,
                };
              }

              if (lessonSectionPhase === 'worked_example_feedback') {
                return {
                  assistantMessage: parsed.assistantMessage,
                  resolved: parsed.resolved,
                  next: parsed.resolved ? ('teach' as const) : parsed.next,
                };
              }

              return parsed;
            })()
          : (() => {
              const parsed = parseFeedbackControl(rawText);
              return lessonSectionPhase === 'feedback_basic'
                ? {
                    assistantMessage: parsed.assistantMessage,
                    resolved: false,
                    next: 'feedback' as const,
                  }
                : parsed;
            })();
      const lesson = resolvedLesson;
      const currentStep = lesson?.steps[safeLessonStepIndex] ?? null;
      const nextStepIndex =
        lesson && currentStep?.nextStepId
          ? lesson.steps.findIndex((step) => step.id === currentStep.nextStepId)
          : -1;
      const resolvedNextStepIndex =
        nextStepIndex >= 0
          ? nextStepIndex
          : lessonCode && safeLessonStepIndex + 1 < stepCount
            ? safeLessonStepIndex + 1
            : -1;
      const nextStep = lesson && resolvedNextStepIndex >= 0 ? lesson.steps[resolvedNextStepIndex] ?? null : null;
      const assistantMessageNormalized =
        chatMode === 'lesson' || chatMode === 'lesson_light'
          ? normalizeLessonQuestionFormatting(normalizeLessonAssistantTone(feedbackControl.assistantMessage))
          : feedbackControl.assistantMessage;
      const isFinalLessonStep = Boolean(lessonCode) && resolvedNextStepIndex < 0;
      const finalCoverageAudit =
        feedbackControl.resolved &&
        feedbackControl.next === 'teach' &&
        isFinalLessonStep &&
        lesson
          ? await runFinalLessonCoverageAudit({
              client,
              lesson,
              conversationHistory,
            })
          : null;
      const auditedResolved =
        finalCoverageAudit && !finalCoverageAudit.complete ? false : feedbackControl.resolved;
      const auditedNext =
        finalCoverageAudit && !finalCoverageAudit.complete ? ('feedback' as const) : feedbackControl.next;
      const auditedAssistantMessage =
        finalCoverageAudit && !finalCoverageAudit.complete && finalCoverageAudit.catchUpMessage
          ? finalCoverageAudit.catchUpMessage
          : assistantMessageNormalized;
      const autoAdvance =
        auditedResolved &&
        auditedNext === 'teach' &&
        resolvedNextStepIndex >= 0 &&
        nextStep !== null &&
        (
          chatMode === 'lesson_light' ||
          lessonSectionPhase === 'feedback_deeper' ||
          lessonSectionPhase === 'worked_example_feedback' ||
          lessonSectionPhase === 'integrative_feedback'
        );

      console.log('[simple-chatbot] feedback_response', {
        lessonCode: lessonCode || null,
        lessonStepIndex: lessonCode ? safeLessonStepIndex : null,
        lessonSectionPhase: lessonCode ? lessonSectionPhase : null,
        lessonDeeperTurnCount: lessonCode ? lessonDeeperTurnCount : null,
        progressionGate:
          chatMode === 'lesson_light' ||
          lessonSectionPhase === 'feedback_deeper' ||
          lessonSectionPhase === 'worked_example_feedback' ||
          lessonSectionPhase === 'integrative_feedback',
        assistantMessage: auditedAssistantMessage,
        resolved: auditedResolved,
        next: auditedNext,
        autoAdvance,
        nextStepId: nextStep?.id ?? null,
        nextStepIndex: resolvedNextStepIndex >= 0 ? resolvedNextStepIndex : null,
        rawText,
        finishReason: result.response.candidates?.[0]?.finishReason ?? null,
        usageMetadata: result.response.usageMetadata ?? null,
        runtimeVariant,
        replyClassification,
        finalCoverageAudit,
      });

      await logSimpleChatbotAssistantTurn({
        sessionId,
        userId,
        lessonCode,
        lessonVersionId: resolvedLessonVersionId,
        runtimeVariant,
        lessonPromptProfile,
        lessonStepIndex: safeLessonStepIndex,
        lessonSectionPhase,
        currentStepId,
        currentStepRole,
        currentStepStage,
        message,
        assistantMessage: auditedAssistantMessage,
        systemInstruction,
        attachment,
        attachmentStepMeta,
        lessonTurnInstruction,
        repairFocus,
        replyClassification,
        geminiRequest,
        finishReason: result.response.candidates?.[0]?.finishReason ?? null,
        autoAdvance,
        nextStepId: nextStep?.id ?? null,
        nextStepIndex: resolvedNextStepIndex >= 0 ? resolvedNextStepIndex : null,
        nextStepRole: nextStep?.role ?? null,
        nextStepStage: nextStep?.stage ?? null,
        feedbackResolved: auditedResolved,
        feedbackNext: auditedNext,
        progressionGate:
          lessonSectionPhase === 'feedback_deeper' ||
          lessonSectionPhase === 'worked_example_feedback' ||
          lessonSectionPhase === 'integrative_feedback',
        lessonDeeperTurnCount,
        rawResponseText: rawText,
        challengeDetected,
      });

      return new Response(auditedAssistantMessage, {
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
              chatMode === 'lesson_light' ||
              lessonSectionPhase === 'feedback_deeper' ||
              lessonSectionPhase === 'worked_example_feedback' ||
              lessonSectionPhase === 'integrative_feedback',
            feedbackResolved: auditedResolved ? 'true' : 'false',
            feedbackNext: auditedNext,
            chatMode,
            lessonPromptProfile,
            autoAdvance,
            nextStep,
            nextStepIndex: resolvedNextStepIndex >= 0 ? resolvedNextStepIndex : null,
            runtimeVariant,
            replyClass: replyClassification?.replyClass ?? null,
            challengeDetected,
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
          await logSimpleChatbotAssistantTurn({
            sessionId,
            userId,
            lessonCode,
            lessonVersionId: resolvedLessonVersionId,
            runtimeVariant,
            lessonPromptProfile,
            lessonStepIndex: safeLessonStepIndex,
            lessonSectionPhase,
            currentStepId,
            currentStepRole,
            currentStepStage,
            message,
            assistantMessage: aggregatedReply.trim(),
            systemInstruction,
            attachment,
            attachmentStepMeta,
            lessonTurnInstruction,
            repairFocus,
            replyClassification,
            geminiRequest,
            finishReason: finalResponse.candidates?.[0]?.finishReason ?? null,
            progressionGate:
              chatMode === 'lesson_light' ||
              lessonSectionPhase === 'feedback_deeper' ||
              lessonSectionPhase === 'worked_example_feedback' ||
              lessonSectionPhase === 'integrative_feedback',
            lessonDeeperTurnCount,
            rawResponseText: aggregatedReply.trim(),
            challengeDetected,
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
          chatMode,
          lessonPromptProfile,
          runtimeVariant,
          replyClass: replyClassification?.replyClass ?? null,
          challengeDetected,
        }),
      },
    });
  } catch (error) {
    console.error('[simple-chatbot] error', error);
    return NextResponse.json({ error: 'Unable to get a response.' }, { status: 500 });
  }
}
