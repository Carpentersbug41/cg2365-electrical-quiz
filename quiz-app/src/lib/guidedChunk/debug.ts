import type { GuidedChunkEvaluationResult, GuidedChunkFrame, GuidedChunkSession, GuidedChunkSessionPayload } from '@/lib/guidedChunk/types';

function replacer(_key: string, value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }
  return value;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, replacer, 2);
  } catch {
    return '[unserializable]';
  }
}

export function logGuidedServerDebug(label: string, payload: unknown): void {
  console.log(`\n[guided-debug] ${label}\n${safeStringify(payload)}\n`);
}

export function logGuidedLlmDebug(label: string, payload: unknown): void {
  console.log(`\n[guided-llm] ${label}\n${safeStringify(payload)}\n`);
}

export function buildGuidedSessionDebugSnapshot(frame: GuidedChunkFrame, session: GuidedChunkSession): Record<string, unknown> {
  return {
    lessonCode: frame.lessonCode,
    lessonTitle: frame.title,
    variantId: frame.variantId,
    runtimeVersion: frame.runtimeVersion,
    sessionId: session.id,
    lessonVersionId: session.lessonVersionId ?? null,
    lessonStatus: session.lessonStatus ?? null,
    sourceContext: session.sourceContext ?? null,
    currentLoIndex: session.currentLoIndex,
    step: session.step,
    reviewFlags: session.reviewFlags,
    thread: session.thread,
    events: session.events,
  };
}

export function buildGuidedSubmitDebugSnapshot(input: {
  frame: GuidedChunkFrame;
  session: GuidedChunkSession;
  learnerAnswer: string;
  priorTurns: string[];
  evaluation: GuidedChunkEvaluationResult;
  payload: GuidedChunkSessionPayload;
}): Record<string, unknown> {
  return {
    lessonCode: input.frame.lessonCode,
    lessonTitle: input.frame.title,
    variantId: input.frame.variantId,
    runtimeVersion: input.frame.runtimeVersion,
    sessionId: input.session.id,
    lessonVersionId: input.session.lessonVersionId ?? null,
    sourceContext: input.session.sourceContext ?? null,
    learnerAnswer: input.learnerAnswer,
    activeStep: input.session.step,
    priorTurns: input.priorTurns,
    fullThread: input.session.thread,
    evaluation: input.evaluation,
    responsePayload: input.payload,
  };
}
