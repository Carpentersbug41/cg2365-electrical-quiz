import { describe, expect, it } from 'vitest';
import { lesson20413AFrame } from '@/data/guided-chunk/2365/lesson20413A';
import { applyChunkEvaluation, createInitialSession, submitLoTest } from '@/lib/guidedChunk/runtime';

describe('guided chunk runtime', () => {
  it('starts with a streamed tutor turn that includes the first chunk and first recall prompt', () => {
    const { session, animateTurnIds } = createInitialSession(lesson20413AFrame);

    expect(session.step.kind).toBe('question');
    expect(session.thread).toHaveLength(3);
    expect(animateTurnIds).toHaveLength(1);

    const firstAssistantTurn = session.thread[2];
    expect(firstAssistantTurn.kind).toBe('message');
    if (firstAssistantTurn.kind !== 'message') {
      throw new Error('Expected first assistant turn to be a message.');
    }

    expect(firstAssistantTurn.content).toContain('Quick check:');
    expect(firstAssistantTurn.stream).toBe(true);
  });

  it('counts accepted follow-up answers against the original initial question', () => {
    const { session } = createInitialSession(lesson20413AFrame);
    if (session.step.kind !== 'question') {
      throw new Error('Expected question step.');
    }

    const originalQuestionId = session.step.chunk.activeQuestion.questionId;
    session.step.chunk.activeQuestion = {
      questionId: 'follow-up-1',
      prompt: 'Tighten that answer.',
      kind: 'follow_up',
      sourceQuestionId: originalQuestionId,
      expectedConcepts: session.step.chunk.activeQuestion.expectedConcepts,
    };

    applyChunkEvaluation(lesson20413AFrame, session, 'It connects the lamp and groups conductors.', {
      accepted: true,
      outcome: 'accepted',
      feedback: 'Good. That is strong enough to build on.',
    });

    if (session.step.kind !== 'question') {
      throw new Error('Expected to remain in question flow.');
    }

    expect(session.step.chunk.acceptedInitialQuestionIds).toContain(originalQuestionId);
    expect(session.step.chunk.activeQuestion.kind).toBe('initial');
  });

  it('advances from an LO test into the next LO when the lesson is not finished', () => {
    const { session } = createInitialSession(lesson20413AFrame);
    session.currentLoIndex = 0;
    session.step = {
      kind: 'lo_test',
      loIndex: 0,
      loTest: {
        intro: 'LO test',
        mcqs: lesson20413AFrame.loSequence[0].loTestMcq.mcqs,
        shortAnswers: lesson20413AFrame.loSequence[0].loTestShortAnswer.shortAnswers,
      },
    };

    const animateTurnIds = submitLoTest(lesson20413AFrame, session, {
      mcqAnswers: {
        '204-13A-LO1-M1': 1,
        '204-13A-LO1-M2': 1,
        '204-13A-LO1-M3': 2,
        '204-13A-LO1-M4': 1,
        '204-13A-LO1-M5': 1,
      },
      shortAnswers: {
        '204-13A-LO1-S1': 'The supply is joined at each rose and continues to the next light point.',
        '204-13A-LO1-S2': 'It is a junction point as well as the lamp connection.',
      },
    });

    expect(animateTurnIds.length).toBeGreaterThan(0);
    expect(session.loResults).toHaveLength(1);
    expect(session.currentLoIndex).toBe(1);
    expect(session.step.kind).toBe('question');
    expect(session.thread.some((turn) => turn.kind === 'divider' && turn.content.includes('Recognise the three groups'))).toBe(true);
  });

  it('answers clarification about review language without treating it as a content answer', () => {
    const { session } = createInitialSession(lesson20413AFrame);
    if (session.step.kind !== 'question') {
      throw new Error('Expected question step.');
    }

    const originalQuestionId = session.step.chunk.activeQuestion.questionId;

    applyChunkEvaluation(lesson20413AFrame, session, 'What did you mean by flagging it?', {
      accepted: false,
      outcome: 'clarification',
      feedback:
        'I meant you were close enough to keep moving, but I want to bring that point back later so it sticks. Back to the question: What are the three groups of conductors at a 3-plate ceiling rose?',
    });

    if (session.step.kind !== 'question') {
      throw new Error('Expected to remain in question flow.');
    }

    expect(session.step.chunk.activeQuestion.questionId).toBe(originalQuestionId);
    const lastTurn = session.thread[session.thread.length - 1];
    expect(lastTurn.kind).toBe('message');
    if (lastTurn.kind !== 'message') {
      throw new Error('Expected clarification response to be a message.');
    }
    expect(lastTurn.content).toContain('bring that point back later');
    expect(lastTurn.content).toContain('Back to the question:');
  });
});
