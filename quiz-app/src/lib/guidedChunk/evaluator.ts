import type {
  GuidedChunkChunk,
  GuidedChunkEvaluationResult,
  GuidedChunkRepairTemplate,
  GuidedChunkActiveQuestion,
  GuidedChunkShortAnswerTestQuestion,
} from '@/lib/guidedChunk/types';
import { generateGuidedChunkJson } from '@/lib/guidedChunk/llm';

type LlmEvaluationResponse = {
  accepted: boolean;
  outcome: 'accepted' | 'follow_up' | 'repair' | 'advance_with_flag';
  feedback: string;
  followUpQuestion?: string;
  misconceptionCode?: string | null;
  rationale?: string;
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(normalize(needle)));
}

function keywordScore(answer: string, expectedConcepts: string[]): number {
  if (expectedConcepts.length === 0) return 0;
  const normalizedAnswer = normalize(answer);
  const hits = expectedConcepts.filter((concept) => normalizedAnswer.includes(normalize(concept)));
  return hits.length / expectedConcepts.length;
}

function findRepairTemplate(
  answer: string,
  repairTemplates: GuidedChunkRepairTemplate[]
): GuidedChunkRepairTemplate | null {
  const normalizedAnswer = normalize(answer);
  for (const template of repairTemplates) {
    if (template.triggerPhrases && template.triggerPhrases.some((phrase) => normalizedAnswer.includes(normalize(phrase)))) {
      return template;
    }
  }
  return repairTemplates[0] ?? null;
}

function firstSentence(text: string): string {
  const sentence = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .find(Boolean);
  return sentence ?? text.trim();
}

function ensureAcceptedFeedback(feedback: string, question: GuidedChunkActiveQuestion): string {
  const trimmed = feedback.trim();
  const lower = trimmed.toLowerCase();
  const soundsAffirmative =
    lower.startsWith('correct') ||
    lower.startsWith('yes') ||
    lower.startsWith('right') ||
    lower.startsWith('exactly') ||
    lower.startsWith('good');

  if (soundsAffirmative) {
    return trimmed;
  }

  if (question.acceptableAnswers?.length) {
    return `Correct. ${trimmed}`;
  }

  return `Correct. ${trimmed || 'That answer is strong enough to build on.'}`;
}

function detectClarificationIntent(
  learnerAnswer: string,
  question: GuidedChunkActiveQuestion,
  chunk: GuidedChunkChunk,
  priorTurns: string[]
): GuidedChunkEvaluationResult | null {
  const normalized = normalize(learnerAnswer);
  const asksForClarification =
    /\b(what do you mean|what did you mean|do you mean|can you explain|explain that|say that again|what is meant|what does .* mean)\b/.test(
      normalized
    ) || /\?$/.test(learnerAnswer.trim());
  const confusionSignal = /\b(i don t get it|i do not get it|confused|not sure what you mean|don t understand|do not understand)\b/.test(
    normalized
  );

  if (!asksForClarification && !confusionSignal) {
    return null;
  }

  const recentContext = priorTurns.slice(-3).join(' ').toLowerCase();
  const asksAboutFlagging =
    normalized.includes('flagging') ||
    normalized.includes('flag') ||
    recentContext.includes('flagging this point for review');

  if (asksAboutFlagging) {
    return {
      accepted: false,
      outcome: 'clarification',
      feedback: `I meant you were close enough to keep moving, but I want to bring that point back later so it sticks. Back to the question: ${question.prompt}`,
      rationale: 'rule-based clarification for review language',
    };
  }

  return {
    accepted: false,
    outcome: 'clarification',
    feedback: `In simple terms: ${firstSentence(chunk.teachingCore)} Back to the question: ${question.prompt}`,
    rationale: 'rule-based clarification',
  };
}

function fallbackEvaluation(
  learnerAnswer: string,
  question: GuidedChunkActiveQuestion,
  chunk: GuidedChunkChunk,
  priorTurns: string[]
): GuidedChunkEvaluationResult {
  const clarification = detectClarificationIntent(learnerAnswer, question, chunk, priorTurns);
  if (clarification) {
    return clarification;
  }

  const normalizedAnswer = normalize(learnerAnswer);
  const explicitAccept =
    (question.acceptableAnswers ?? []).length > 0 && includesAny(normalizedAnswer, question.acceptableAnswers ?? []);
  const conceptScore = keywordScore(learnerAnswer, question.expectedConcepts);
  const repairTemplate = findRepairTemplate(learnerAnswer, chunk.repairTemplates);

  if (explicitAccept || conceptScore >= 0.6) {
    return {
      accepted: true,
      outcome: 'accepted',
      feedback: 'Good. That is strong enough to build on.',
      rationale: 'fallback keyword acceptance',
    };
  }

  if (conceptScore >= 0.25 && question.kind === 'initial') {
    return {
      accepted: false,
      outcome: 'follow_up',
      feedback: 'You have part of it. Tighten one point before we move on.',
      followUpQuestion: `Tighten this for me: ${question.prompt}`,
      rationale: 'fallback partial answer',
    };
  }

  if (repairTemplate) {
    return {
      accepted: false,
      outcome: 'repair',
      feedback: `${repairTemplate.shortCorrection} ${repairTemplate.retryPrompt}`,
      misconceptionCode: repairTemplate.misconceptionCode,
      rationale: 'fallback repair',
    };
  }

  return {
    accepted: false,
    outcome: 'advance_with_flag',
    feedback: 'Not secure yet. We can keep moving, and I will bring this idea back later so it becomes secure.',
    rationale: 'fallback advance with review flag',
  };
}

export async function evaluateChunkAnswer(input: {
  learnerAnswer: string;
  question: GuidedChunkActiveQuestion;
  chunk: GuidedChunkChunk;
  priorTurns: string[];
}): Promise<GuidedChunkEvaluationResult> {
  const { learnerAnswer, question, chunk, priorTurns } = input;

  const clarification = detectClarificationIntent(learnerAnswer, question, chunk, priorTurns);
  if (clarification) {
    return clarification;
  }

  const llmResult = await generateGuidedChunkJson<LlmEvaluationResponse>(
    [
      'You are evaluating one learner answer inside a constrained tutoring runtime.',
      'Return JSON only.',
      'Keep feedback under 35 words.',
      'Only use one of these outcomes: accepted, follow_up, repair, advance_with_flag.',
      'If the outcome is accepted, the feedback must clearly acknowledge that the learner is correct.',
      'Use follow_up for partially correct answers that can be tightened quickly.',
      'Use repair when there is a real misconception or wrong classification.',
      'Use advance_with_flag when the answer is still weak after the flow should move on.',
    ].join('\n'),
    JSON.stringify(
      {
        teachingCore: chunk.teachingCore,
        learningGoal: chunk.learningGoal,
        question,
        learnerAnswer,
        misconceptionCodes: chunk.misconceptionCodes,
        repairTemplates: chunk.repairTemplates.map((template) => ({
          misconceptionCode: template.misconceptionCode,
          shortCorrection: template.shortCorrection,
          contrastPrompt: template.contrastPrompt,
          retryPrompt: template.retryPrompt,
        })),
        priorTurns,
      },
      null,
      2
    ),
    'runtime_evaluator'
  );

  if (
    llmResult &&
    typeof llmResult.accepted === 'boolean' &&
    typeof llmResult.outcome === 'string' &&
    typeof llmResult.feedback === 'string'
  ) {
    return {
      accepted: llmResult.accepted,
      outcome: llmResult.outcome,
      feedback:
        llmResult.outcome === 'accepted'
          ? ensureAcceptedFeedback(llmResult.feedback, question)
          : llmResult.feedback.trim(),
      followUpQuestion: llmResult.followUpQuestion?.trim(),
      misconceptionCode: llmResult.misconceptionCode ?? null,
      rationale: llmResult.rationale,
    };
  }

  return fallbackEvaluation(learnerAnswer, question, chunk, priorTurns);
}

export function evaluateShortAnswerTest(
  learnerAnswer: string,
  question: GuidedChunkShortAnswerTestQuestion
): { passed: boolean; feedback: string } {
  const normalizedAnswer = normalize(learnerAnswer);
  const acceptableAnswers = question.acceptableAnswers ?? [];

  if (acceptableAnswers.length > 0 && includesAny(normalizedAnswer, acceptableAnswers)) {
    return { passed: true, feedback: 'Accepted.' };
  }

  const conceptScore = keywordScore(learnerAnswer, question.expectedConcepts);
  if (conceptScore >= 0.6) {
    return { passed: true, feedback: 'Accepted on concept coverage.' };
  }

  return { passed: false, feedback: 'Missing enough of the key idea.' };
}
