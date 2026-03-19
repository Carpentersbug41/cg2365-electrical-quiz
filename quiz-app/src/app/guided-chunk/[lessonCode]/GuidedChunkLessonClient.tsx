'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fraunces, Manrope, Space_Mono } from 'next/font/google';
import { useEffect, useMemo, useRef, useState } from 'react';
import MicrobreakBlock from '@/components/learning/microbreaks/MicrobreakBlock';
import { authedFetch } from '@/lib/api/authedFetch';
import type {
  GuidedChunkLoTestSubmission,
  GuidedChunkSessionPayload,
  GuidedChunkThreadImageTurn,
  GuidedChunkTurn,
} from '@/lib/guidedChunk/types';
import styles from './styles.module.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const spaceMono = Space_Mono({ subsets: ['latin'], variable: '--font-space-mono', weight: ['400', '700'] });

function chunkTokens(text: string): string[] {
  return text.split(/(\s+)/).filter((token) => token.length > 0);
}

function logGuidedClientDebug(label: string, payload: unknown) {
  // Keep this always on for guided runtime debugging until the POC settles.
  // The user explicitly wants to inspect full conversation history and payloads.
  console.log(`[guided-debug] ${label}`, payload);
}

function isImageTurn(turn: GuidedChunkTurn): turn is GuidedChunkThreadImageTurn {
  return turn.kind === 'image';
}

type StreamedTextProps = {
  content: string;
  animate: boolean;
  fastMode: boolean;
  replayToken: number;
};

function StreamedText({ content, animate, fastMode, replayToken }: StreamedTextProps) {
  const [visibleTokens, setVisibleTokens] = useState(() => (animate ? 0 : chunkTokens(content).length));
  const tokens = useMemo(() => chunkTokens(content), [content]);

  useEffect(() => {
    if (!animate) {
      setVisibleTokens(tokens.length);
      return;
    }

    setVisibleTokens(0);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let index = 0;
    const delay = fastMode ? 12 : 28;

    const streamNext = () => {
      index += 1;
      setVisibleTokens(index);
      if (index < tokens.length) {
        timeoutId = setTimeout(streamNext, delay);
      }
    };

    timeoutId = setTimeout(streamNext, fastMode ? 50 : 140);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [animate, fastMode, replayToken, tokens]);

  return (
    <>
      {tokens.slice(0, visibleTokens).join('')}
      {animate && visibleTokens < tokens.length ? <span className={styles.streamCaret} aria-hidden="true" /> : null}
    </>
  );
}

type LoTestCardProps = {
  session: GuidedChunkSessionPayload;
  onSubmit: (submission: GuidedChunkLoTestSubmission) => Promise<void>;
  submitting: boolean;
};

function LoTestCard({ session, onSubmit, submitting }: LoTestCardProps) {
  const loTestStep = session.step.kind === 'lo_test' ? session.step : null;
  const loTest = loTestStep?.loTest ?? null;
  const loIndex = loTestStep?.loIndex ?? -1;
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setMcqAnswers({});
    setShortAnswers({});
  }, [loIndex]);

  if (!loTest) return null;

  return (
    <section className={styles.loTestCard}>
      <p className={styles.sectionLabel}>LO Check</p>
      <h2 className={styles.loTestTitle}>Quick test on what you have just learned</h2>
      <p className={styles.loTestIntro}>{loTest.intro}</p>

      <div className={styles.loTestSection}>
        {loTest.mcqs.map((question) => (
          <div key={question.id} className={styles.testQuestion}>
            <p className={styles.testPrompt}>{question.prompt}</p>
            <div className={styles.optionList}>
              {question.options.map((option, optionIndex) => (
                <label key={`${question.id}-${optionIndex}`} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={mcqAnswers[question.id] === optionIndex}
                    onChange={() => setMcqAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.loTestSection}>
        {loTest.shortAnswers.map((question) => (
          <div key={question.id} className={styles.testQuestion}>
            <p className={styles.testPrompt}>{question.prompt}</p>
            <textarea
              className={styles.shortAnswerInput}
              rows={4}
              value={shortAnswers[question.id] ?? ''}
              onChange={(event) =>
                setShortAnswers((prev) => ({
                  ...prev,
                  [question.id]: event.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.sendButton}
        disabled={submitting}
        onClick={() => onSubmit({ mcqAnswers, shortAnswers })}
      >
        {submitting ? 'Submitting...' : 'Submit LO Check'}
      </button>
    </section>
  );
}

type GuidedChunkLessonClientProps = {
  lessonCode: string;
  previewVersionId?: string;
  sourceContext?: string;
};

export default function GuidedChunkLessonClient({
  lessonCode,
  previewVersionId,
  sourceContext,
}: GuidedChunkLessonClientProps) {
  const [session, setSession] = useState<GuidedChunkSessionPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const [animatedTurnIds, setAnimatedTurnIds] = useState<string[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);
  const storageKey = `guided-chunk-session:${lessonCode}:${previewVersionId ?? 'published'}`;

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const storedSessionId = window.localStorage.getItem(storageKey);
        let response = storedSessionId
          ? await authedFetch(`/api/guided-chunk/sessions/${storedSessionId}`, {
              method: 'GET',
            })
          : await authedFetch('/api/guided-chunk/sessions/start', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lessonCode,
                versionId: previewVersionId,
                sourceContext: sourceContext ?? (previewVersionId ? 'guided_chunk_admin_preview' : 'guided_chunk_runtime'),
              }),
            });

        if (storedSessionId && (response.status === 401 || response.status === 403 || response.status === 404 || response.status === 409)) {
          window.localStorage.removeItem(storageKey);
          response = await authedFetch('/api/guided-chunk/sessions/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonCode,
              versionId: previewVersionId,
              sourceContext: sourceContext ?? (previewVersionId ? 'guided_chunk_admin_preview' : 'guided_chunk_runtime'),
            }),
          });
        }

        if (!response.ok) {
          throw new Error(storedSessionId ? 'Failed to restore session.' : 'Failed to start session.');
        }

        const payload = (await response.json()) as GuidedChunkSessionPayload;
        if (cancelled) return;

        logGuidedClientDebug('bootstrap payload', payload);
        setSession(payload);
        setAnimatedTurnIds(payload.animateTurnIds);
        window.localStorage.setItem(storageKey, payload.sessionId);
      } catch (caughtError) {
        if (cancelled) return;
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load lesson.');
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [lessonCode, previewVersionId, sourceContext, storageKey]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [session]);

  async function applyApiResponse(response: Response) {
    const payload = (await response.json()) as GuidedChunkSessionPayload & { error?: string };
    if (!response.ok) {
      throw new Error(payload.error || 'Request failed.');
    }

    logGuidedClientDebug('api payload', payload);
    setSession(payload);
    setAnimatedTurnIds(payload.animateTurnIds);
    if (payload.step.kind === 'completed') {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, payload.sessionId);
    }
  }

  async function submitAnswer() {
    if (!session || !answer.trim()) return;
    setBusy(true);
    setError(null);

    try {
      logGuidedClientDebug('submit answer', {
        sessionId: session.sessionId,
        lessonCode: session.lessonCode,
        lessonVersionId: session.lessonVersionId ?? null,
        activeStep: session.step,
        thread: session.thread,
        answer,
      });
      const response = await authedFetch('/api/guided-chunk/turns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId, answer }),
      });
      await applyApiResponse(response);
      setAnswer('');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to submit answer.');
    } finally {
      setBusy(false);
    }
  }

  async function handleMicrobreakComplete(skipped: boolean) {
    if (!session) return;
    setBusy(true);
    setError(null);

    try {
      const response = await authedFetch('/api/guided-chunk/microbreak/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId, skipped }),
      });
      await applyApiResponse(response);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to continue after the microbreak.');
    } finally {
      setBusy(false);
    }
  }

  async function submitLoTest(submission: GuidedChunkLoTestSubmission) {
    if (!session) return;
    setBusy(true);
    setError(null);

    try {
      const response = await authedFetch('/api/guided-chunk/lo-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId, submission }),
      });
      await applyApiResponse(response);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to submit LO test.');
    } finally {
      setBusy(false);
    }
  }

  const inputDisabled = !session || session.step.kind !== 'question' || busy;

  return (
    <main className={[styles.page, fraunces.variable, manrope.variable, spaceMono.variable].join(' ')}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div>
            <Link href="/lesson-style-lab" className={styles.backLink}>
              Lesson Style Lab
            </Link>
            <p className={styles.eyebrow}>Guided chunk runtime</p>
          </div>
          {session ? (
            <p className={styles.headerMeta}>
              {session.lessonCode} � LO {session.progress.currentLoIndex + 1} of {session.progress.loCount}
            </p>
          ) : null}
        </header>

        <section className={styles.lessonCard}>
          <div className={styles.lessonHeader}>
            <div>
              <p className={styles.sectionLabel}>Learning mode</p>
              <h1 className={styles.title}>{session?.lessonTitle ?? 'Loading guided lesson...'}</h1>
              <p className={styles.subtitle}>
                Pre-generated teaching core, dynamic follow-ups, inline assets, and microbreaks in one scrolling tutor window.
              </p>
            </div>
            {session ? (
              <div className={styles.progressBlock}>
                <div className={styles.progressRow}>
                  <strong>
                    {session.progress.currentLoIndex + 1} / {session.progress.loCount}
                  </strong>
                  <span>{session.progress.reviewFlagCount} review flags</span>
                </div>
                <div className={styles.progressTrack} aria-hidden="true">
                  <span
                    className={styles.progressFill}
                    style={{ width: `${((session.progress.currentLoIndex + 1) / session.progress.loCount) * 100}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div ref={threadRef} className={styles.threadBody}>
            {session?.thread.map((turn) => {
              if (turn.kind === 'divider') {
                return (
                  <div key={turn.id} className={styles.dividerRow}>
                    <span>{turn.label}</span>
                    <strong>{turn.content}</strong>
                  </div>
                );
              }

              if (isImageTurn(turn)) {
                return (
                  <article key={turn.id} className={styles.imageCard}>
                    <div className={styles.imageFrame}>
                      <Image src={turn.asset.imageUrl} alt={turn.asset.alt} width={840} height={520} className={styles.inlineImage} />
                    </div>
                    <div className={styles.imageCopy}>
                      <p className={styles.sectionLabel}>Visual anchor</p>
                      <h2 className={styles.imageTitle}>{turn.asset.title}</h2>
                      <p className={styles.imageDescription}>{turn.asset.description}</p>
                    </div>
                  </article>
                );
              }

              if (turn.kind === 'microbreak') {
                return (
                  <section key={turn.id} className={styles.microbreakSection}>
                    <div className={styles.microbreakHint}>
                      <span className={styles.microbreakTag}>Reset</span>
                      <p>{turn.intro}</p>
                    </div>
                    {session.step.kind === 'microbreak' ? (
                      <div className={styles.embeddedGame}>
                        <MicrobreakBlock
                          block={turn.microbreak.block}
                          lessonId={session.lessonCode}
                          onComplete={() => void handleMicrobreakComplete(false)}
                          onSkip={() => void handleMicrobreakComplete(true)}
                        />
                      </div>
                    ) : null}
                  </section>
                );
              }

              const isUser = turn.role === 'user';
              const shouldAnimate = turn.role === 'assistant' && animatedTurnIds.includes(turn.id);

              return (
                <div key={turn.id} className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowTutor}`}>
                  <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.tutorBubble}`}>
                    <p className={styles.messageLabel}>{isUser ? 'You' : 'Tutor'}</p>
                    <p className={styles.messageText}>
                      {turn.role === 'assistant' ? (
                        <StreamedText content={turn.content} animate={shouldAnimate} fastMode={fastMode} replayToken={replayToken} />
                      ) : (
                        turn.content
                      )}
                    </p>
                  </div>
                </div>
              );
            })}

            {session && session.step.kind === 'lo_test' ? (
              <LoTestCard session={session} onSubmit={submitLoTest} submitting={busy} />
            ) : null}

            {!session && !error ? <p className={styles.loadingState}>Loading lesson session...</p> : null}
            {error ? <p className={styles.errorState}>{error}</p> : null}
          </div>

          <div className={styles.inputDock}>
            <div className={styles.inputShell}>
              <textarea
                className={styles.inputPrompt}
                rows={3}
                value={answer}
                disabled={inputDisabled}
                placeholder={
                  session?.step.kind === 'question'
                    ? 'Type your answer...'
                    : session?.step.kind === 'microbreak'
                      ? 'Complete or skip the microbreak to continue.'
                      : session?.step.kind === 'lo_test'
                        ? 'Submit the LO test above to continue.'
                        : 'Lesson complete.'
                }
                onChange={(event) => setAnswer(event.target.value)}
              />
              <button type="button" className={styles.sendButton} disabled={inputDisabled} onClick={() => void submitAnswer()}>
                {busy ? 'Sending...' : 'Send'}
              </button>
            </div>
            <div className={styles.controlRow}>
              <button type="button" className={styles.controlButton} onClick={() => setReplayToken((value) => value + 1)}>
                Replay
              </button>
              <button type="button" className={styles.controlButton} onClick={() => setFastMode((value) => !value)}>
                {fastMode ? 'Normal speed' : 'Speed up'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
