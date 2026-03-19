'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { DynamicGuidedV2Lesson, DynamicGuidedV2ThreadTurn } from '@/lib/dynamicGuidedV2/types';
import styles from './styles.module.css';

type ChatApiResponse = {
  response: {
    assistantMessage: string;
    advance: boolean;
  };
  step: {
    stage: string;
  };
};

export function DynamicGuidedV2LessonClient({
  lesson,
  versionId,
}: {
  lesson: DynamicGuidedV2Lesson;
  versionId?: string | null;
}) {
  const bootedRef = useRef(false);
  const previousStageRef = useRef<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [thread, setThread] = useState<DynamicGuidedV2ThreadTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingTransitionToGuidedPractice, setPendingTransitionToGuidedPractice] = useState<number | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const currentStep = lesson.steps[stepIndex];

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    void generateTurn(0, [], undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.lessonCode]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread]);

  useEffect(() => {
    const stage = currentStep.stage;
    if (previousStageRef.current && previousStageRef.current !== stage) {
      console.log('[dynamic-guided-v2] prompt:change', {
        from: previousStageRef.current,
        to: stage,
        stepId: currentStep.id,
        stepTitle: currentStep.title,
      });
      console.warn(`[dynamic-guided-v2] Prompt change: ${previousStageRef.current} -> ${stage}`);
    }
    previousStageRef.current = stage;
  }, [currentStep.id, currentStep.stage, currentStep.title]);

  async function generateTurn(targetStepIndex: number, currentThread: DynamicGuidedV2ThreadTurn[], learnerMessage?: string) {
    const step = lesson.steps[targetStepIndex];
    if (!step) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dynamic-guided-v2/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonCode: lesson.lessonCode,
          versionId: versionId ?? null,
          stepIndex: targetStepIndex,
          thread: currentThread,
          learnerMessage,
        }),
      });

      const data = (await response.json()) as ChatApiResponse | { error: string };
      if (!response.ok || !('response' in data)) {
        throw new Error('error' in data ? data.error : 'Unable to generate tutor turn.');
      }

      const tutorTurn: DynamicGuidedV2ThreadTurn = {
        id: `tutor-${Date.now()}-${targetStepIndex}`,
        role: 'tutor',
        text: data.response.assistantMessage,
        stepId: step.id,
      };

      const nextThread = [...currentThread, tutorTurn];
      setThread(nextThread);

      console.log('[dynamic-guided-v2] client:api_payload', {
        stepIndex: targetStepIndex,
        learnerMessage: learnerMessage ?? null,
        data,
        nextThread,
      });

      if (learnerMessage && data.response.advance && targetStepIndex < lesson.steps.length - 1) {
        const nextStepIndex = targetStepIndex + 1;
        const nextStep = lesson.steps[nextStepIndex];
        const activeStep = lesson.steps[targetStepIndex];

        if (nextStep?.stage === 'guided_practice' && activeStep?.stage !== 'guided_practice') {
          setPendingTransitionToGuidedPractice(nextStepIndex);
          setThread([
            ...nextThread,
            {
              id: `system-transition-${Date.now()}-${nextStepIndex}`,
              role: 'system',
              text: 'You have the key terms and core ideas. Next we will move into a supported practice step.',
              stepId: nextStep.id,
            },
          ]);
          return;
        }

        setStepIndex(nextStepIndex);
        setTimeout(() => {
          void generateTurn(nextStepIndex, nextThread, undefined);
        }, 250);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate tutor turn.');
    } finally {
      setLoading(false);
    }
  }

  async function handleContinue() {
    if (!currentStep || loading) return;
    if (pendingTransitionToGuidedPractice !== null) {
      const nextStepIndex = pendingTransitionToGuidedPractice;
      setPendingTransitionToGuidedPractice(null);
      setStepIndex(nextStepIndex);
      await generateTurn(nextStepIndex, thread, undefined);
      return;
    }
    if (stepIndex >= lesson.steps.length - 1) return;
    const nextStepIndex = stepIndex + 1;
    setStepIndex(nextStepIndex);
    await generateTurn(nextStepIndex, thread, undefined);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentStep || loading) return;
    const trimmed = draft.trim();
    if (!trimmed) return;

    const learnerTurn: DynamicGuidedV2ThreadTurn = {
      id: `learner-${Date.now()}-${stepIndex}`,
      role: 'learner',
      text: trimmed,
      stepId: currentStep.id,
    };
    const nextThread = [...thread, learnerTurn];
    setThread(nextThread);
    setDraft('');

    console.log('[dynamic-guided-v2] client:submit', {
      stepIndex,
      stepId: currentStep.id,
      learnerMessage: trimmed,
      nextThread,
    });

    await generateTurn(stepIndex, nextThread, trimmed);
  }

  const progressLabel = useMemo(() => `${Math.min(stepIndex + 1, lesson.steps.length)} / ${lesson.steps.length}`, [stepIndex, lesson.steps.length]);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Dynamic Guided V2</div>
            <h1 className={styles.title}>{lesson.title}</h1>
            <p className={styles.subtle}>V1 lesson as runtime context. Minimal prompt. Live tutor wording.</p>
          </div>
          <div className={styles.progress}>{progressLabel}</div>
        </header>

        <div className={styles.meta}>
          <span>{lesson.subject}</span>
          <span>Unit {lesson.unit}</span>
          <span>{lesson.comparisonSource}</span>
        </div>

        <div ref={threadRef} className={styles.thread}>
          {thread.map((turn) => (
            <article
              key={turn.id}
              className={
                turn.role === 'learner'
                  ? styles.learnerTurn
                  : turn.role === 'system'
                    ? styles.systemTurn
                    : styles.tutorTurn
              }
            >
              <div className={styles.turnRole}>
                {turn.role === 'learner' ? 'You' : turn.role === 'system' ? 'Progression' : 'Tutor'}
              </div>
              <div className={styles.turnText}>{turn.text}</div>
            </article>
          ))}
          {loading ? <div className={styles.loading}>Tutor is thinking...</div> : null}
        </div>

        <aside className={styles.stepPanel}>
          <div className={styles.stepEyebrow}>Current step</div>
          <div className={styles.stepTitle}>{currentStep.title}</div>
          <div className={styles.stepMeta}>
            <span>{currentStep.stage}</span>
            <span>{currentStep.role}</span>
            <span>{currentStep.completionMode}</span>
          </div>
          {currentStep.asset ? (
            <div className={styles.assetCard}>
              <strong>{currentStep.asset.title}</strong>
              {currentStep.asset.description ? <p>{currentStep.asset.description}</p> : null}
            </div>
          ) : null}
        </aside>

        {error ? <div className={styles.error}>{error}</div> : null}

        {currentStep.completionMode === 'respond' ? (
          <form className={styles.composer} onSubmit={handleSubmit}>
            <textarea
              className={styles.input}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your answer..."
              rows={3}
            />
            <button className={styles.button} disabled={loading || !draft.trim()} type="submit">
              Send
            </button>
          </form>
        ) : (
          <div className={styles.composer}>
            <button
              className={styles.button}
              disabled={loading || (stepIndex >= lesson.steps.length - 1 && pendingTransitionToGuidedPractice === null)}
              type="button"
              onClick={handleContinue}
            >
              {pendingTransitionToGuidedPractice !== null
                ? 'Start guided practice'
                : stepIndex >= lesson.steps.length - 1
                  ? 'Lesson complete'
                  : 'Continue'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
