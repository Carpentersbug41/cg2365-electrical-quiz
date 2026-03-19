'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Fraunces, Manrope, Space_Mono } from 'next/font/google';
import MicrobreakBlock from '@/components/learning/microbreaks/MicrobreakBlock';
import type { Block } from '@/data/lessons/types';
import styles from './styles.module.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const spaceMono = Space_Mono({ subsets: ['latin'], variable: '--font-space-mono', weight: ['400', '700'] });

const transcript = [
  {
    role: 'assistant' as const,
    label: 'Tutor',
    content: [
      'Resistance is the opposition to the flow of charge. If voltage stays the same and resistance increases, current decreases. That is why a thinner conductor or a longer path can reduce the current in a circuit.',
      '',
      'Quick check: if the voltage stays the same and the resistance doubles, does the current increase or decrease?',
    ].join('\n'),
  },
  {
    role: 'user' as const,
    label: 'You',
    content: 'It decreases.',
  },
  {
    role: 'assistant' as const,
    label: 'Tutor',
    content: 'Correct. Keep the relationship simple: more resistance, less current. You have the core rule.',
  },
  {
    role: 'system' as const,
    label: 'Chunk 3',
    content: 'Resistivity and material choice',
  },
  {
    role: 'assistant' as const,
    label: 'Tutor',
    content:
      'One term for the next step: resistivity. Resistivity is a property of the material itself, not just the size or length of the conductor.',
  },
];

const microbreakBlock: Block = {
  id: '202-4B-microbreak-1',
  type: 'microbreak',
  order: 999,
  content: {
    breakType: 'game',
    gameType: 'classify-two-bins',
    leftLabel: 'Resistance',
    rightLabel: 'Current',
    prompt: 'Sort each statement into the correct idea.',
    instructions: 'A quick reset before the next chunk. Classify each card into the best matching side.',
    timerSeconds: 30,
    enableSound: false,
    enableEffects: false,
    items: [
      { text: 'Opposes charge flow', correctBin: 'left' },
      { text: 'Rate of charge flow', correctBin: 'right' },
      { text: 'Higher value reduces current', correctBin: 'left' },
      { text: 'Measured in amperes', correctBin: 'right' },
    ],
  },
};

const WORD_DELAY_MS = 34;
const ITEM_DELAY_MS = 320;
const RESUME_DELAY_MS = 700;

const resumeDivider = {
  label: 'Chunk 4',
  content: 'Material properties and current flow',
};

const resumeTutorMessage =
  'Good. Now take the same relationship one step further. Resistivity helps explain why two conductors of the same size can still behave differently if the materials themselves are different.';

function chunkWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export default function GuidedChunkMockup() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [streamedWordCounts, setStreamedWordCounts] = useState<Record<number, number>>({});
  const [showResumeSection, setShowResumeSection] = useState(false);
  const [resumeWordCount, setResumeWordCount] = useState(0);

  const wordMap = useMemo(
    () => transcript.map((item) => (item.role === 'assistant' ? chunkWords(item.content) : [])),
    []
  );
  const resumeWords = useMemo(() => chunkWords(resumeTutorMessage), []);

  useEffect(() => {
    setVisibleCount(0);
    setStreamedWordCounts({});
    setShowResumeSection(false);
    setResumeWordCount(0);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runItem = (index: number) => {
      if (index >= transcript.length) return;

      const item = transcript[index];
      setVisibleCount(index + 1);

      if (item.role !== 'assistant') {
        timeoutId = setTimeout(() => runItem(index + 1), ITEM_DELAY_MS);
        return;
      }

      const words = wordMap[index];
      let wordIndex = 0;
      setStreamedWordCounts((prev) => ({ ...prev, [index]: 0 }));

      const streamNextWord = () => {
        wordIndex += 1;
        setStreamedWordCounts((prev) => ({ ...prev, [index]: wordIndex }));

        if (wordIndex < words.length) {
          timeoutId = setTimeout(streamNextWord, WORD_DELAY_MS);
          return;
        }

        timeoutId = setTimeout(() => runItem(index + 1), ITEM_DELAY_MS);
      };

      timeoutId = setTimeout(streamNextWord, index === 0 ? 220 : 120);
    };

    runItem(0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [wordMap]);

  useEffect(() => {
    if (visibleCount < transcript.length) return undefined;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let wordIndex = 0;

    timeoutId = setTimeout(() => {
      setShowResumeSection(true);

      const streamNextWord = () => {
        wordIndex += 1;
        setResumeWordCount(wordIndex);

        if (wordIndex < resumeWords.length) {
          timeoutId = setTimeout(streamNextWord, WORD_DELAY_MS);
        }
      };

      timeoutId = setTimeout(streamNextWord, 180);
    }, RESUME_DELAY_MS);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visibleCount, resumeWords]);

  return (
    <main className={[styles.page, fraunces.variable, manrope.variable, spaceMono.variable].join(' ')}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div>
            <Link href="/lesson-style-lab" className={styles.backLink}>
              Lesson Style Lab
            </Link>
            <p className={styles.eyebrow}>Guided chunk runtime concept</p>
          </div>
          <p className={styles.headerMeta}>Lesson 202-4B · Chunk 2 of 6</p>
        </header>

        <section className={styles.lessonCard}>
          <div className={styles.lessonHeader}>
            <div>
              <p className={styles.sectionLabel}>Learning goal</p>
              <h1 className={styles.title}>Understand how resistance affects current in a simple circuit.</h1>
              <p className={styles.subtitle}>One short chunk, one check, one response, then move on.</p>
            </div>

            <div className={styles.progressBlock}>
              <div className={styles.progressRow}>
                <strong>2 / 6</strong>
                <span>Teach + recall</span>
              </div>
              <div className={styles.progressTrack} aria-hidden="true">
                <span className={styles.progressFill} />
              </div>
            </div>
          </div>

          <div className={styles.threadBody}>
            {transcript.slice(0, visibleCount).map((item, index) => {
              if (item.role === 'system') {
                return (
                  <div key={`${item.role}-${index}`} className={styles.dividerRow}>
                    <span>{item.label}</span>
                    <strong>{item.content}</strong>
                  </div>
                );
              }

              const isUser = item.role === 'user';
              const bubbleClass = isUser ? styles.userBubble : styles.tutorBubble;
              const streamedText =
                item.role === 'assistant'
                  ? wordMap[index].slice(0, streamedWordCounts[index] ?? 0).join(' ')
                  : item.content;
              const isStreaming =
                item.role === 'assistant' && (streamedWordCounts[index] ?? 0) < wordMap[index].length;

              return (
                <div
                  key={`${item.role}-${index}`}
                  className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowTutor}`}
                >
                  <div className={`${styles.messageBubble} ${bubbleClass}`}>
                    <p className={styles.messageLabel}>{item.label}</p>
                    <p className={styles.messageText}>
                      {streamedText}
                      {isStreaming ? <span className={styles.streamCaret} aria-hidden="true" /> : null}
                    </p>
                  </div>
                </div>
              );
            })}

            {visibleCount >= transcript.length ? (
              <>
                <div className={styles.microbreakHint}>
                  <span className={styles.microbreakTag}>Now</span>
                  <p>Short classify exercise to break the text rhythm before the next chunk.</p>
                </div>
                <div className={styles.transitionNote}>
                  <span className={styles.transitionLine} aria-hidden="true" />
                  <p>The tutor pauses for a brief reset activity, then returns to the next concept.</p>
                </div>
                <div className={styles.embeddedGame}>
                  <MicrobreakBlock block={microbreakBlock} lessonId="202-4B" />
                </div>
                {showResumeSection ? (
                  <>
                    <div className={styles.dividerRow}>
                      <span>{resumeDivider.label}</span>
                      <strong>{resumeDivider.content}</strong>
                    </div>
                    <div className={`${styles.messageRow} ${styles.messageRowTutor}`}>
                      <div className={`${styles.messageBubble} ${styles.tutorBubble}`}>
                        <p className={styles.messageLabel}>Tutor</p>
                        <p className={styles.messageText}>
                          {resumeWords.slice(0, resumeWordCount).join(' ')}
                          {resumeWordCount < resumeWords.length ? (
                            <span className={styles.streamCaret} aria-hidden="true" />
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : null}
          </div>

          <div className={styles.inputDock}>
            <div className={styles.inputShell}>
              <div className={styles.inputPrompt}>Type your answer...</div>
              <button type="button" className={styles.sendButton}>
                Send
              </button>
            </div>
            <div className={styles.controlRow}>
              <button type="button" className={styles.controlButton}>
                Replay
              </button>
              <button type="button" className={styles.controlButton}>
                Speed up
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

