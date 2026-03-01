'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import TutorPanel from '@/components/learning/tutor/TutorPanel';
import LessonBlockPreview from './LessonBlockPreview';
import TailwindFreeZone from './TailwindFreeZone';
import type { Lesson } from '@/data/lessons/types';
import styles from './styles.module.css';

type Option = {
  id: string;
  title: string;
  unit: string;
  hasMicrobreak: boolean;
  hasMedia: boolean;
};

type LabTheme = 'original' | 'swiss' | 'control' | 'studio' | 'notebook' | 'blueprint';

interface Props {
  lesson: Lesson;
  options: Option[];
  theme: LabTheme;
}

export default function LessonShowcaseExperience({ lesson, options, theme }: Props) {
  const router = useRouter();
  const [activeTheme, setActiveTheme] = useState<LabTheme>(theme);
  const shouldStripComponentStyles = activeTheme !== 'original';
  const sortedBlocks = useMemo(() => [...lesson.blocks].sort((a, b) => a.order - b.order), [lesson.blocks]);
  const diagramBlock = sortedBlocks.find((b) => b.type === 'diagram') ?? null;
  const firstInteractiveIndex = sortedBlocks.findIndex(
    (b) => b.type === 'practice' || b.type === 'guided-practice' || b.type === 'spaced-review' || b.type === 'microbreak'
  );
  const firstGameIndex = sortedBlocks.findIndex((b) => b.type === 'microbreak');
  const [activeIndex, setActiveIndex] = useState(() => {
    if (firstInteractiveIndex >= 0) return firstInteractiveIndex;
    if (diagramBlock) {
      const diagramIndex = sortedBlocks.findIndex((b) => b.id === diagramBlock.id);
      return Math.max(0, diagramIndex);
    }
    return 0;
  });

  const activeBlock = sortedBlocks[activeIndex] ?? sortedBlocks[0];
  const progress = sortedBlocks.length > 0 ? Math.round(((activeIndex + 1) / sortedBlocks.length) * 100) : 0;

  useEffect(() => {
    // Keep URL shareable without forcing a server navigation.
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const previousTheme = root.dataset.labTheme;
    root.dataset.labTheme = activeTheme;

    const url = new URL(window.location.href);
    if (activeTheme === 'original') {
      url.searchParams.delete('theme');
    } else {
      url.searchParams.set('theme', activeTheme);
    }
    window.history.replaceState(null, '', url.toString());

    return () => {
      if (previousTheme === undefined) {
        delete root.dataset.labTheme;
      } else {
        root.dataset.labTheme = previousTheme;
      }
    };
  }, [activeTheme]);

  const handleRouteChange = (
    lessonId: string,
    selectedTheme: LabTheme
  ) => {
    const themePart = selectedTheme === 'original' ? '' : `&theme=${encodeURIComponent(selectedTheme)}`;
    router.push(`/lesson-style-lab?lessonId=${encodeURIComponent(lessonId)}${themePart}`);
  };

  return (
    <section
      className={`${styles.showcaseWrap} ${
        activeTheme === 'original'
          ? styles.themeOriginal
          : activeTheme === 'control'
            ? styles.themeControl
            : activeTheme === 'studio'
              ? styles.themeStudio
              : activeTheme === 'notebook'
                ? styles.themeNotebook
                : activeTheme === 'blueprint'
                  ? styles.themeBlueprint
                  : styles.themeSwiss
      }`}
    >
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <p className={styles.eyebrow}>Lesson Lab Showcase</p>
          <p className={styles.unitBadge}>{lesson.unit}</p>
        </div>
        <h1 className={styles.title}>{lesson.title}</h1>
        <p className={styles.subtitle}>{lesson.description}</p>

        <div className={styles.commandBar}>
          <div className={styles.commandSelect}>
            <label htmlFor="lessonId" className={styles.selectorLabel}>
              Lesson
            </label>
            <select
              id="lessonId"
              value={lesson.id}
              onChange={(event) => handleRouteChange(event.target.value, activeTheme)}
              className={styles.selectorInput}
            >
              {options.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title}
                </option>
              ))}
            </select>
            <label htmlFor="theme" className={styles.selectorLabel}>
              Styles
            </label>
            <select
              id="theme"
              value={activeTheme}
              onChange={(event) => setActiveTheme(event.target.value as LabTheme)}
              className={styles.selectorInput}
            >
              <option value="original">Original (App)</option>
              <option value="swiss">Swiss Editorial</option>
              <option value="control">Mission Control</option>
              <option value="studio">Studio Canvas</option>
              <option value="notebook">Calm Notebook</option>
              <option value="blueprint">Blueprint Lab</option>
            </select>
          </div>
          <div className={styles.commandStats}>
            <p className={styles.statLabel}>Progress</p>
            <p className={styles.statValue}>{progress}%</p>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles.rawToggle}>Lab-only styling: switch themes freely (production unaffected).</p>
          </div>
        </div>
      </header>

      <div className={styles.experienceGrid}>
        <main className={styles.stageArea}>
          <div className={styles.stageHeader}>
            <div>
              <p className={styles.stageLabel}>Focused Block</p>
              <h2 className={styles.stageTitle}>{activeBlock?.id}</h2>
            </div>
            <div className={styles.stageActions}>
              <select
                aria-label="Jump to block"
                className={styles.stageJump}
                value={activeBlock?.id ?? ''}
                onChange={(event) => {
                  const index = sortedBlocks.findIndex((b) => b.id === event.target.value);
                  if (index >= 0) setActiveIndex(index);
                }}
              >
                {sortedBlocks.map((block, index) => (
                  <option key={block.id} value={block.id}>
                    {index + 1}. {block.type} ({block.id})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.stageBtn}
                onClick={() => {
                  if (firstInteractiveIndex >= 0) setActiveIndex(firstInteractiveIndex);
                }}
                disabled={firstInteractiveIndex < 0}
              >
                First Practice
              </button>
              <button
                type="button"
                className={styles.stageBtn}
                onClick={() => {
                  if (firstGameIndex >= 0) setActiveIndex(firstGameIndex);
                }}
                disabled={firstGameIndex < 0}
              >
                First Game
              </button>
              <button
                type="button"
                className={styles.stageBtn}
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
              >
                Previous
              </button>
              <button
                type="button"
                className={styles.stageBtn}
                onClick={() => setActiveIndex((prev) => Math.min(sortedBlocks.length - 1, prev + 1))}
                disabled={activeIndex === sortedBlocks.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          <div className={styles.stageCard}>
            {activeBlock && (
              shouldStripComponentStyles ? (
                <TailwindFreeZone enabled>
                  <LessonBlockPreview block={activeBlock} lessonId={lesson.id} />
                </TailwindFreeZone>
              ) : (
                <LessonBlockPreview block={activeBlock} lessonId={lesson.id} />
              )
            )}
          </div>
        </main>

        <aside className={styles.contextRail}>
          {diagramBlock && (
            <div className={styles.contextCard}>
              <p className={styles.contextLabel}>Diagram</p>
              shouldStripComponentStyles ? (
                <TailwindFreeZone enabled>
                  <LessonBlockPreview block={diagramBlock} lessonId={lesson.id} />
                </TailwindFreeZone>
              ) : (
                <LessonBlockPreview block={diagramBlock} lessonId={lesson.id} />
              )
            </div>
          )}
          <div className={styles.contextCard}>
            <p className={styles.contextLabel}>AI Tutor</p>
            <div className={styles.tutorWrap}>
              {shouldStripComponentStyles ? (
                <TailwindFreeZone enabled>
                  <TutorPanel lessonId={lesson.id} lessonTitle={lesson.title} blocks={sortedBlocks} mode="teach" />
                </TailwindFreeZone>
              ) : (
                <TutorPanel lessonId={lesson.id} lessonTitle={lesson.title} blocks={sortedBlocks} mode="teach" />
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
