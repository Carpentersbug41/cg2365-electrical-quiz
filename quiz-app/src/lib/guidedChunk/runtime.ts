import { createGuidedChunkId } from '@/lib/guidedChunk/ids';
import type {
  GuidedChunkActiveQuestion,
  GuidedChunkChunk,
  GuidedChunkChunkProgress,
  GuidedChunkEvaluationResult,
  GuidedChunkFrame,
  GuidedChunkLo,
  GuidedChunkLoResult,
  GuidedChunkLoTestSubmission,
  GuidedChunkSession,
  GuidedChunkSessionPayload,
  GuidedChunkTurn,
} from '@/lib/guidedChunk/types';
import { evaluateShortAnswerTest } from '@/lib/guidedChunk/evaluator';

function nowIso(): string {
  return new Date().toISOString();
}

function createMessageTurn(role: 'assistant' | 'user', content: string, stream = false): GuidedChunkTurn {
  return {
    id: createGuidedChunkId(role),
    role,
    kind: 'message',
    content,
    createdAt: nowIso(),
    stream,
  };
}

function createDividerTurn(label: string, content: string): GuidedChunkTurn {
  return {
    id: createGuidedChunkId('divider'),
    role: 'system',
    kind: 'divider',
    label,
    content,
    createdAt: nowIso(),
  };
}

function buildQuestionFromChunk(chunk: GuidedChunkChunk, index: number): GuidedChunkActiveQuestion {
  const question = chunk.initialRecallQuestions[index];
  return {
    questionId: question.id,
    prompt: question.prompt,
    kind: 'initial',
    acceptableAnswers: question.acceptableAnswers,
    expectedConcepts: question.expectedConcepts,
  };
}

function getChunk(frame: GuidedChunkFrame, loIndex: number, chunkIndex: number): GuidedChunkChunk {
  return frame.loSequence[loIndex].chunkPlan[chunkIndex];
}

function getLo(frame: GuidedChunkFrame, loIndex: number): GuidedChunkLo {
  return frame.loSequence[loIndex];
}

function buildRenderableLoTest(lo: GuidedChunkLo) {
  return {
    intro: [lo.loTestMcq.intro, lo.loTestShortAnswer.intro].filter(Boolean).join(' '),
    mcqs: lo.loTestMcq.mcqs,
    shortAnswers: lo.loTestShortAnswer.shortAnswers,
  };
}

function createChunkProgress(loIndex: number, chunkIndex: number, chunk: GuidedChunkChunk): GuidedChunkChunkProgress {
  return {
    loIndex,
    chunkIndex,
    askedInitialQuestionIds: [chunk.initialRecallQuestions[0].id],
    acceptedInitialQuestionIds: [],
    repairLoops: 0,
    deeperAsked: false,
    deeperAccepted: false,
    flaggedForReview: false,
    activeQuestion: buildQuestionFromChunk(chunk, 0),
  };
}

function buildChunkTurnContent(chunk: GuidedChunkChunk, questionPrompt: string): string {
  return `${chunk.teachingCore}\n\nQuick check: ${questionPrompt}`;
}

function appendEvent(session: GuidedChunkSession, type: string, payload: Record<string, unknown>): void {
  session.events.push({
    id: createGuidedChunkId('event'),
    type,
    createdAt: nowIso(),
    payload,
  });
}

function startChunk(session: GuidedChunkSession, frame: GuidedChunkFrame, loIndex: number, chunkIndex: number): string[] {
  const lo = getLo(frame, loIndex);
  const chunk = getChunk(frame, loIndex, chunkIndex);
  const animateTurnIds: string[] = [];

  if (chunkIndex === 0) {
    session.thread.push(createDividerTurn(`LO ${loIndex + 1}`, lo.loTitle));
  }
  session.thread.push(createDividerTurn(`Chunk ${chunkIndex + 1}`, chunk.learningGoal));

  const progress = createChunkProgress(loIndex, chunkIndex, chunk);
  const assistantTurn = createMessageTurn('assistant', buildChunkTurnContent(chunk, progress.activeQuestion.prompt), true);
  session.thread.push(assistantTurn);
  animateTurnIds.push(assistantTurn.id);

  session.currentLoIndex = loIndex;
  session.step = { kind: 'question', chunk: progress };
  appendEvent(session, 'chunk_started', {
    loId: lo.loId,
    chunkId: chunk.chunkId,
  });
  appendEvent(session, 'question_asked', {
    loId: lo.loId,
    chunkId: chunk.chunkId,
    questionId: progress.activeQuestion.questionId,
    questionKind: progress.activeQuestion.kind,
    prompt: progress.activeQuestion.prompt,
    expectedConcepts: progress.activeQuestion.expectedConcepts,
  });

  return animateTurnIds;
}

function buildProgressPayload(frame: GuidedChunkFrame, session: GuidedChunkSession): GuidedChunkSessionPayload['progress'] {
  const activeChunk =
    session.step.kind === 'question'
      ? session.step.chunk
      : session.step.kind === 'microbreak'
        ? { loIndex: session.step.loIndex, chunkIndex: session.step.chunkIndex }
        : { loIndex: session.currentLoIndex, chunkIndex: null as number | null };

  return {
    currentLoIndex: session.currentLoIndex,
    loCount: frame.loSequence.length,
    currentChunkIndex: typeof activeChunk.chunkIndex === 'number' ? activeChunk.chunkIndex : null,
    chunkCountInCurrentLo: frame.loSequence[session.currentLoIndex]?.chunkPlan.length ?? null,
    reviewFlagCount: session.reviewFlags.length,
  };
}

export function buildSessionPayload(
  frame: GuidedChunkFrame,
  session: GuidedChunkSession,
  animateTurnIds: string[] = []
): GuidedChunkSessionPayload {
  return {
    sessionId: session.id,
    lessonCode: frame.lessonCode,
    lessonVersionId: session.lessonVersionId ?? null,
    lessonStatus: session.lessonStatus ?? null,
    lessonTitle: frame.title,
    unit: frame.unit,
    topic: frame.topic,
    runtimeVersion: frame.runtimeVersion,
    variantId: frame.variantId,
    thread: session.thread,
    step: session.step,
    progress: buildProgressPayload(frame, session),
    animateTurnIds,
  };
}

export function createInitialSession(
  frame: GuidedChunkFrame,
  options?: {
    userId?: string | null;
    lessonVersionId?: string | null;
    lessonStatus?: GuidedChunkSession['lessonStatus'];
    sourceContext?: string | null;
  }
): { session: GuidedChunkSession; animateTurnIds: string[] } {
  const session: GuidedChunkSession = {
    id: createGuidedChunkId('gc-session'),
    lessonCode: frame.lessonCode,
    lessonVersionId: options?.lessonVersionId ?? null,
    lessonStatus: options?.lessonStatus ?? 'builtin',
    userId: options?.userId ?? null,
    sourceContext: options?.sourceContext ?? 'guided_chunk_runtime',
    runtimeVersion: frame.runtimeVersion,
    variantId: frame.variantId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    status: 'active',
    currentLoIndex: 0,
    thread: [],
    step: { kind: 'completed' },
    reviewFlags: [],
    loResults: [],
    events: [],
    syncedEventIds: [],
    syncedReviewKeys: [],
  };

  appendEvent(session, 'session_started', { lessonCode: frame.lessonCode });
  const animateTurnIds = startChunk(session, frame, 0, 0);
  return { session, animateTurnIds };
}

function nextInitialQuestion(chunk: GuidedChunkChunk, progress: GuidedChunkChunkProgress): GuidedChunkActiveQuestion | null {
  const askedCount = progress.askedInitialQuestionIds.length;
  const next = chunk.initialRecallQuestions[askedCount];
  if (!next) return null;
  return {
    questionId: next.id,
    prompt: next.prompt,
    kind: 'initial',
    acceptableAnswers: next.acceptableAnswers,
    expectedConcepts: next.expectedConcepts,
  };
}

function shouldAskAnotherInitial(chunk: GuidedChunkChunk, progress: GuidedChunkChunkProgress): boolean {
  const minRequired = chunk.advanceRule.minAcceptedRecallAnswers;
  const askedCount = progress.askedInitialQuestionIds.length;
  const acceptedCount = progress.acceptedInitialQuestionIds.length;

  if (acceptedCount < minRequired) return askedCount < chunk.initialRecallQuestions.length;
  return askedCount < Math.min(2, chunk.initialRecallQuestions.length);
}

function makeReviewFlag(session: GuidedChunkSession, frame: GuidedChunkFrame, chunk: GuidedChunkChunk, misconceptionCode: string | null | undefined, reason: string): void {
  session.reviewFlags.push({
    loId: frame.loSequence[session.currentLoIndex].loId,
    chunkId: chunk.chunkId,
    misconceptionCode: misconceptionCode ?? null,
    reason,
  });
}

function queueQuestionTurn(session: GuidedChunkSession, content: string): string {
  const turn = createMessageTurn('assistant', content, true);
  session.thread.push(turn);
  return turn.id;
}

function markQuestionAccepted(progress: GuidedChunkChunkProgress): void {
  if (progress.activeQuestion.kind === 'deeper') {
    progress.deeperAccepted = true;
    return;
  }

  if (progress.activeQuestion.kind === 'initial') {
    if (!progress.acceptedInitialQuestionIds.includes(progress.activeQuestion.questionId)) {
      progress.acceptedInitialQuestionIds.push(progress.activeQuestion.questionId);
    }
    return;
  }

  if (
    (progress.activeQuestion.kind === 'follow_up' || progress.activeQuestion.kind === 'repair') &&
    progress.activeQuestion.sourceQuestionId &&
    !progress.acceptedInitialQuestionIds.includes(progress.activeQuestion.sourceQuestionId)
  ) {
    progress.acceptedInitialQuestionIds.push(progress.activeQuestion.sourceQuestionId);
  }
}

function continueAfterChunk(
  session: GuidedChunkSession,
  frame: GuidedChunkFrame,
  loIndex: number,
  chunkIndex: number,
  animateTurnIds: string[] = []
): string[] {
  const lo = getLo(frame, loIndex);
  const nextChunkIndex = chunkIndex + 1;

  if (nextChunkIndex < lo.chunkPlan.length) {
    animateTurnIds.push(...startChunk(session, frame, loIndex, nextChunkIndex));
    return animateTurnIds;
  }

  const loTestIntroTurn = createMessageTurn('assistant', lo.loTestMcq.intro, true);
  session.thread.push(loTestIntroTurn);
  animateTurnIds.push(loTestIntroTurn.id);
  session.step = { kind: 'lo_test', loIndex, loTest: buildRenderableLoTest(lo) };
  appendEvent(session, 'lo_test_started', { loId: lo.loId });
  return animateTurnIds;
}

function advanceFromChunk(session: GuidedChunkSession, frame: GuidedChunkFrame, chunk: GuidedChunkChunk, loIndex: number, chunkIndex: number): string[] {
  const animateTurnIds: string[] = [];

  if (chunk.assetInjection) {
    session.thread.push({
      id: createGuidedChunkId('image'),
      role: 'system',
      kind: 'image',
      asset: chunk.assetInjection,
      createdAt: nowIso(),
    });
    appendEvent(session, 'asset_injected', {
      chunkId: chunk.chunkId,
      assetId: chunk.assetInjection.assetId,
    });
  }

  if (chunk.microbreakAfter) {
    session.thread.push({
      id: createGuidedChunkId('microbreak'),
      role: 'system',
      kind: 'microbreak',
      intro: chunk.microbreakAfter.intro,
      microbreak: chunk.microbreakAfter,
      createdAt: nowIso(),
    });
    session.step = {
      kind: 'microbreak',
      loIndex,
      chunkIndex,
    };
    appendEvent(session, 'microbreak_started', {
      chunkId: chunk.chunkId,
      microbreakId: chunk.microbreakAfter.id,
    });
    return animateTurnIds;
  }

  return continueAfterChunk(session, frame, loIndex, chunkIndex, animateTurnIds);
}

export function applyChunkEvaluation(
  frame: GuidedChunkFrame,
  session: GuidedChunkSession,
  learnerAnswer: string,
  evaluation: GuidedChunkEvaluationResult
): string[] {
  if (session.step.kind !== 'question') {
    return [];
  }

  const progress = session.step.chunk;
  const lo = getLo(frame, progress.loIndex);
  const chunk = getChunk(frame, progress.loIndex, progress.chunkIndex);

  session.thread.push(createMessageTurn('user', learnerAnswer));
  appendEvent(session, 'learner_turn_submitted', {
    loId: lo.loId,
    chunkId: chunk.chunkId,
    questionId: progress.activeQuestion.questionId,
    questionKind: progress.activeQuestion.kind,
    learnerAnswer,
  });
  appendEvent(session, 'question_evaluated', {
    loId: lo.loId,
    chunkId: chunk.chunkId,
    questionId: progress.activeQuestion.questionId,
    questionKind: progress.activeQuestion.kind,
    outcome: evaluation.outcome,
    accepted: evaluation.accepted,
    misconceptionCode: evaluation.misconceptionCode ?? null,
    feedback: evaluation.feedback,
    followUpQuestion: evaluation.followUpQuestion ?? null,
  });

  const animateTurnIds: string[] = [];

  if (evaluation.outcome === 'clarification') {
    const assistantTurnId = queueQuestionTurn(session, evaluation.feedback);
    animateTurnIds.push(assistantTurnId);
    appendEvent(session, 'clarification_answered', {
      loId: lo.loId,
      chunkId: chunk.chunkId,
      questionId: progress.activeQuestion.questionId,
    });
    return animateTurnIds;
  }

  if (evaluation.outcome === 'accepted') {
    const assistantTurnId = queueQuestionTurn(session, evaluation.feedback);
    animateTurnIds.push(assistantTurnId);

    markQuestionAccepted(progress);

    const nextInitial = nextInitialQuestion(chunk, progress);
    if (nextInitial && shouldAskAnotherInitial(chunk, progress)) {
      progress.askedInitialQuestionIds.push(nextInitial.questionId);
      progress.activeQuestion = nextInitial;
      const nextTurnId = queueQuestionTurn(session, nextInitial.prompt);
      animateTurnIds.push(nextTurnId);
      appendEvent(session, 'question_asked', {
        chunkId: chunk.chunkId,
        questionId: nextInitial.questionId,
        questionKind: 'initial',
      });
      return animateTurnIds;
    }

    if (chunk.candidateDeeperQuestion && !progress.deeperAsked) {
      progress.deeperAsked = true;
      progress.activeQuestion = {
        questionId: chunk.candidateDeeperQuestion.id,
        prompt: chunk.candidateDeeperQuestion.prompt,
        kind: 'deeper',
        acceptableAnswers: chunk.candidateDeeperQuestion.acceptableAnswers,
        expectedConcepts: chunk.candidateDeeperQuestion.expectedConcepts,
      };
      const deeperTurnId = queueQuestionTurn(session, `One deeper check before we move on: ${progress.activeQuestion.prompt}`);
      animateTurnIds.push(deeperTurnId);
      appendEvent(session, 'question_asked', {
        chunkId: chunk.chunkId,
        questionId: progress.activeQuestion.questionId,
        questionKind: 'deeper',
      });
      return animateTurnIds;
    }

    appendEvent(session, 'chunk_completed', {
      loId: lo.loId,
      chunkId: chunk.chunkId,
      flaggedForReview: progress.flaggedForReview,
    });
    animateTurnIds.push(...advanceFromChunk(session, frame, chunk, progress.loIndex, progress.chunkIndex));
    return animateTurnIds;
  }

  if (evaluation.outcome === 'follow_up' && evaluation.followUpQuestion) {
    const sourceQuestionId = progress.activeQuestion.questionId;
    progress.activeQuestion = {
      questionId: createGuidedChunkId('follow-up'),
      prompt: evaluation.followUpQuestion,
      kind: 'follow_up',
      sourceQuestionId,
      expectedConcepts: progress.activeQuestion.expectedConcepts,
    };
    const turnId = queueQuestionTurn(session, `${evaluation.feedback} ${evaluation.followUpQuestion}`);
    animateTurnIds.push(turnId);
    appendEvent(session, 'follow_up_triggered', {
      chunkId: chunk.chunkId,
      sourceQuestionId,
    });
    return animateTurnIds;
  }

  if (evaluation.outcome === 'repair' && progress.repairLoops < chunk.advanceRule.maxRepairLoops) {
    progress.repairLoops += 1;
    const repairTemplate =
      chunk.repairTemplates.find((template) => template.misconceptionCode === evaluation.misconceptionCode) ??
      chunk.repairTemplates[0];

    progress.activeQuestion = {
      questionId: createGuidedChunkId('repair'),
      prompt: repairTemplate?.retryPrompt ?? progress.activeQuestion.prompt,
      kind: 'repair',
      sourceQuestionId: progress.activeQuestion.questionId,
      expectedConcepts: progress.activeQuestion.expectedConcepts,
    };

    const repairMessage =
      repairTemplate
        ? `${repairTemplate.shortCorrection} ${repairTemplate.retryPrompt}`
        : evaluation.feedback;
    const turnId = queueQuestionTurn(session, repairMessage);
    animateTurnIds.push(turnId);
    appendEvent(session, 'repair_triggered', {
      chunkId: chunk.chunkId,
      misconceptionCode: repairTemplate?.misconceptionCode ?? evaluation.misconceptionCode ?? null,
    });
    return animateTurnIds;
  }

  progress.flaggedForReview = true;
  makeReviewFlag(session, frame, chunk, evaluation.misconceptionCode, evaluation.feedback);
  const turnId = queueQuestionTurn(
    session,
    `${evaluation.feedback} Good enough for now. I will bring this point back later so it becomes secure.`
  );
  animateTurnIds.push(turnId);
  appendEvent(session, 'chunk_flagged_for_review', {
    loId: lo.loId,
    chunkId: chunk.chunkId,
    misconceptionCode: evaluation.misconceptionCode ?? null,
  });
  animateTurnIds.push(...advanceFromChunk(session, frame, chunk, progress.loIndex, progress.chunkIndex));
  return animateTurnIds;
}

export function completeMicrobreakStep(
  frame: GuidedChunkFrame,
  session: GuidedChunkSession,
  skipped: boolean
): string[] {
  if (session.step.kind !== 'microbreak') {
    return [];
  }

  const loIndex = session.step.loIndex;
  const chunkIndex = session.step.chunkIndex;
  const chunk = getChunk(frame, loIndex, chunkIndex);
  appendEvent(session, skipped ? 'microbreak_skipped' : 'microbreak_completed', {
    loIndex,
    chunkId: chunk.chunkId,
  });
  const animateTurnIds: string[] = [];
  const resumeTurnId = queueQuestionTurn(
    session,
    chunk.microbreakAfter?.resumePrompt ?? 'Good. Back into the lesson.'
  );
  animateTurnIds.push(resumeTurnId);
  animateTurnIds.push(...continueAfterChunk(session, frame, loIndex, chunkIndex, []));
  return animateTurnIds;
}

export function submitLoTest(
  frame: GuidedChunkFrame,
  session: GuidedChunkSession,
  submission: GuidedChunkLoTestSubmission
): string[] {
  if (session.step.kind !== 'lo_test') {
    return [];
  }

  const loIndex = session.step.loIndex;
  const lo = getLo(frame, loIndex);
  const mcqs = lo.loTestMcq.mcqs;
  const shortQuestions = lo.loTestShortAnswer.shortAnswers;
  const mcqCorrect = mcqs.reduce((count, question) => {
    return count + (submission.mcqAnswers[question.id] === question.correctIndex ? 1 : 0);
  }, 0);
  const shortAnswerPassed = shortQuestions.reduce((count, question) => {
    const result = evaluateShortAnswerTest(submission.shortAnswers[question.id] ?? '', question);
    return count + (result.passed ? 1 : 0);
  }, 0);

  const loResult: GuidedChunkLoResult = {
    loId: lo.loId,
    mcqCorrect,
    mcqTotal: mcqs.length,
    shortAnswerPassed,
    shortAnswerTotal: shortQuestions.length,
  };

  session.loResults.push(loResult);
  appendEvent(session, 'lo_test_submitted', {
    loId: lo.loId,
    mcqAnswers: submission.mcqAnswers,
    shortAnswers: submission.shortAnswers,
  });
  appendEvent(session, 'lo_test_completed', {
    loId: lo.loId,
    mcqCorrect,
    mcqTotal: mcqs.length,
    shortAnswerPassed,
    shortAnswerTotal: shortQuestions.length,
  });

  const animateTurnIds: string[] = [];
  const scoreMessage = `LO complete. You scored ${mcqCorrect}/${mcqs.length} on the MCQs and ${shortAnswerPassed}/${shortQuestions.length} on the short answers.`;
  const scoreTurnId = queueQuestionTurn(session, scoreMessage);
  animateTurnIds.push(scoreTurnId);

  const nextLoIndex = loIndex + 1;
  if (nextLoIndex < frame.loSequence.length) {
    animateTurnIds.push(...startChunk(session, frame, nextLoIndex, 0));
    return animateTurnIds;
  }

  session.status = 'completed';
  session.step = { kind: 'completed' };
  const summaryTurnId = queueQuestionTurn(
    session,
    `Lesson complete. Review flags raised: ${session.reviewFlags.length}. The runtime now has enough session data to compare chunk flow, fatigue, and LO performance.`
  );
  animateTurnIds.push(summaryTurnId);
  appendEvent(session, 'session_completed', {
    lessonCode: session.lessonCode,
    reviewFlagCount: session.reviewFlags.length,
  });
  return animateTurnIds;
}
