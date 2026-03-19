'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import TutorPanel from '@/components/learning/tutor/TutorPanel';
import LessonBlockPreview from './LessonBlockPreview';
import TailwindFreeZone from './TailwindFreeZone';
import type { Lesson } from '@/data/lessons/types';
import styles from './styles.module.css';
import {
  DEFAULT_LESSON_LAB_THEME,
  LESSON_LAB_THEMES,
  getLessonLabThemeConfig,
  type LessonLabThemeId,
} from './themeRegistry';

type Option = {
  id: string;
  title: string;
  unit: string;
  hasMicrobreak: boolean;
  hasMedia: boolean;
};

interface Props {
  lesson: Lesson;
  options: Option[];
  theme: LessonLabThemeId;
}

const themeClassNames: Record<LessonLabThemeId, string> = {
  none: styles.themeNone,
  'luxe-editorial': styles.themeLuxeEditorial,
  'glass-aurora': styles.themeGlassAurora,
  'coastal-studio': styles.themeCoastalStudio,
  'midnight-velvet': styles.themeMidnightVelvet,
  'mono-atelier': styles.themeMonoAtelier,
};

function formatBlockType(type: string) {
  return type.replace(/-/g, ' ');
}

function getThemeSceneTags(theme: LessonLabThemeId): string[] {
  switch (theme) {
    case 'luxe-editorial':
      return ['couture serif', 'gallery calm', 'warm paper'];
    case 'glass-aurora':
      return ['glass glow', 'soft blur', 'future polish'];
    case 'coastal-studio':
      return ['sunlit layers', 'sea glass', 'slow luxury'];
    case 'midnight-velvet':
      return ['spotlight drama', 'rich velvet', 'late-night glow'];
    case 'mono-atelier':
      return ['graphic grid', 'studio brutalism', 'sharp rhythm'];
    default:
      return ['raw html', 'unstyled text', 'browser default'];
  }
}

function getThemeImage(theme: LessonLabThemeId): string | null {
  switch (theme) {
    case 'luxe-editorial':
      return '/images/lesson-style-lab/luxe-editorial-scene.svg';
    case 'glass-aurora':
      return '/images/lesson-style-lab/glass-aurora-scene.svg';
    case 'coastal-studio':
      return '/images/lesson-style-lab/coastal-studio-scene.svg';
    case 'midnight-velvet':
      return '/images/lesson-style-lab/midnight-velvet-scene.svg';
    case 'mono-atelier':
      return '/images/lesson-style-lab/mono-atelier-scene.svg';
    default:
      return null;
  }
}

function ThemeShowpiece({ theme }: { theme: LessonLabThemeId }) {
  const image = getThemeImage(theme);

  if (theme === 'luxe-editorial') {
    return (
      <div className={`${styles.heroShowpiece} ${styles.showpieceLuxe}`}>
        {image ? <img src={image} alt="" className={`${styles.sceneImage} ${styles.sceneImageFill}`} /> : null}
        <div className={styles.editorialLargeCard}>
          <span className={styles.sceneKicker}>Issue 05</span>
          <span className={styles.sceneHeadline}>A lesson framed like a couture feature.</span>
        </div>
        <div className={styles.editorialMiniStack}>
          <div className={styles.editorialMiniCard} />
          <div className={styles.editorialQuote}>Elegant structure, generous space, no dashboard energy.</div>
        </div>
      </div>
    );
  }

  if (theme === 'glass-aurora') {
    return (
      <div className={`${styles.heroShowpiece} ${styles.showpieceGlass}`}>
        {image ? <img src={image} alt="" className={`${styles.sceneImage} ${styles.sceneImageFill}`} /> : null}
        <div className={styles.glassHalo} />
        <div className={styles.glassPanelPrimary}>
          <span className={styles.sceneKicker}>Live Surface</span>
          <span className={styles.sceneHeadline}>The lesson sits inside a luminous floating system.</span>
        </div>
        <div className={styles.glassChipRow}>
          <div className={styles.glassChip}>Bloom</div>
          <div className={styles.glassChip}>Depth</div>
          <div className={styles.glassChip}>Motion</div>
        </div>
      </div>
    );
  }

  if (theme === 'coastal-studio') {
    return (
      <div className={`${styles.heroShowpiece} ${styles.showpieceCoastal}`}>
        {image ? <img src={image} alt="" className={`${styles.sceneImage} ${styles.sceneImageFill}`} /> : null}
        <div className={styles.coastalPostcardPrimary}>
          <span className={styles.sceneKicker}>Studio View</span>
          <span className={styles.sceneHeadline}>Soft cards, bright air, and a calm lifestyle rhythm.</span>
        </div>
        <div className={styles.coastalPostcardSecondary} />
        <div className={styles.coastalSun} />
      </div>
    );
  }

  if (theme === 'midnight-velvet') {
    return (
      <div className={`${styles.heroShowpiece} ${styles.showpieceMidnight}`}>
        {image ? <img src={image} alt="" className={`${styles.sceneImage} ${styles.sceneImageFill}`} /> : null}
        <div className={styles.midnightSpotlight} />
        <div className={styles.midnightPoster}>
          <span className={styles.sceneKicker}>After Dark</span>
          <span className={styles.sceneHeadline}>A dramatic lesson stage with cinematic contrast.</span>
        </div>
        <div className={styles.midnightTicker}>velvet tone / sharp highlights / premium contrast</div>
      </div>
    );
  }

  if (theme === 'mono-atelier') {
    return (
      <div className={`${styles.heroShowpiece} ${styles.showpieceMono}`}>
        {image ? <img src={image} alt="" className={`${styles.sceneImage} ${styles.sceneImageFill}`} /> : null}
        <div className={styles.monoBlockPrimary}>
          <span className={styles.sceneKicker}>Grid / 09</span>
          <span className={styles.sceneHeadline}>Presented like a design studio case study.</span>
        </div>
        <div className={styles.monoBlockSecondary}>FORM</div>
        <div className={styles.monoBlockTertiary}>TYPE</div>
      </div>
    );
  }

  return (
    <div className={`${styles.heroShowpiece} ${styles.showpieceNone}`}>
      <div className={styles.noneCard}>No theme applied. This is the baseline inspection mode.</div>
    </div>
  );
}

export default function LessonShowcaseExperience({ lesson, options, theme }: Props) {
  const router = useRouter();
  const [activeTheme, setActiveTheme] = useState<LessonLabThemeId>(theme);
  const sortedBlocks = useMemo(() => [...lesson.blocks].sort((a, b) => a.order - b.order), [lesson.blocks]);
  const diagramBlock = sortedBlocks.find((block) => block.type === 'diagram') ?? null;
  const firstInteractiveIndex = sortedBlocks.findIndex(
    (block) =>
      block.type === 'practice' ||
      block.type === 'guided-practice' ||
      block.type === 'spaced-review' ||
      block.type === 'microbreak'
  );
  const firstGameIndex = sortedBlocks.findIndex((block) => block.type === 'microbreak');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (firstInteractiveIndex >= 0) {
      setActiveIndex(firstInteractiveIndex);
      return;
    }
    if (diagramBlock) {
      const diagramIndex = sortedBlocks.findIndex((block) => block.id === diagramBlock.id);
      setActiveIndex(Math.max(0, diagramIndex));
      return;
    }
    setActiveIndex(0);
  }, [diagramBlock, firstInteractiveIndex, lesson.id, sortedBlocks]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const previousTheme = root.dataset.labTheme;
    root.dataset.labTheme = activeTheme;

    const url = new URL(window.location.href);
    if (activeTheme === DEFAULT_LESSON_LAB_THEME) {
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

  const activeThemeConfig = getLessonLabThemeConfig(activeTheme);
  const activeBlock = sortedBlocks[activeIndex] ?? sortedBlocks[0];
  const progress = sortedBlocks.length > 0 ? Math.round(((activeIndex + 1) / sortedBlocks.length) * 100) : 0;

  const handleRouteChange = (lessonId: string, selectedTheme: LessonLabThemeId) => {
    const themePart =
      selectedTheme === DEFAULT_LESSON_LAB_THEME ? '' : `&theme=${encodeURIComponent(selectedTheme)}`;
    router.push(`/lesson-style-lab?lessonId=${encodeURIComponent(lessonId)}${themePart}`);
  };

  const stats = [
    { label: 'Progress', value: `${progress}%` },
    { label: 'Current', value: `${activeIndex + 1}/${sortedBlocks.length}` },
    { label: 'Focus', value: activeBlock ? formatBlockType(activeBlock.type) : 'n/a' },
  ];
  const sceneTags = getThemeSceneTags(activeTheme);

  const utilityPanel = (
    <section className={`${styles.panel} ${styles.utilityPanel}`}>
      <div className={styles.utilitySection}>
        <p className={styles.panelEyebrow}>Curate</p>
        <h2 className={styles.panelTitle}>Switch the story</h2>
        <p className={styles.panelCopy}>
          Choose a lesson, swap the visual world, then move block by block to judge how the content feels inside each composition.
        </p>
      </div>

      <div className={styles.selectorStack}>
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
          Theme
        </label>
        <select
          id="theme"
          value={activeTheme}
          onChange={(event) => setActiveTheme(event.target.value as LessonLabThemeId)}
          className={styles.selectorInput}
        >
          {LESSON_LAB_THEMES.map((themeOption) => (
            <option key={themeOption.id} value={themeOption.id}>
              {themeOption.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.statGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.jumpSection}>
        <label htmlFor="blockJump" className={styles.selectorLabel}>
          Jump To Block
        </label>
        <select
          id="blockJump"
          aria-label="Jump to block"
          className={styles.selectorInput}
          value={activeBlock?.id ?? ''}
          onChange={(event) => {
            const index = sortedBlocks.findIndex((block) => block.id === event.target.value);
            if (index >= 0) setActiveIndex(index);
          }}
        >
          {sortedBlocks.map((block, index) => (
            <option key={block.id} value={block.id}>
              {index + 1}. {formatBlockType(block.type)} ({block.id})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.buttonCluster}>
        <button
          type="button"
          className={styles.utilityButton}
          onClick={() => {
            if (firstInteractiveIndex >= 0) setActiveIndex(firstInteractiveIndex);
          }}
          disabled={firstInteractiveIndex < 0}
        >
          First Practice
        </button>
        <button
          type="button"
          className={styles.utilityButton}
          onClick={() => {
            if (firstGameIndex >= 0) setActiveIndex(firstGameIndex);
          }}
          disabled={firstGameIndex < 0}
        >
          First Game
        </button>
        <button
          type="button"
          className={styles.utilityButton}
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeIndex === 0}
        >
          Previous
        </button>
        <button
          type="button"
          className={styles.utilityButton}
          onClick={() => setActiveIndex((prev) => Math.min(sortedBlocks.length - 1, prev + 1))}
          disabled={activeIndex === sortedBlocks.length - 1}
        >
          Next
        </button>
      </div>
    </section>
  );

  const stagePane = (
    <section className={`${styles.panel} ${styles.stagePanel}`}>
      <div className={styles.stageIntro}>
        <div>
          <p className={styles.panelEyebrow}>Focused Block</p>
          <h2 className={styles.stageTitle}>{activeBlock?.id ?? 'No block selected'}</h2>
        </div>
        <div className={styles.stageMeta}>
          <span>{activeBlock ? formatBlockType(activeBlock.type) : 'Unknown block'}</span>
          <span>{lesson.unit}</span>
        </div>
      </div>

      <div className={styles.stageCanvas}>
        {activeBlock ? (
          <TailwindFreeZone enabled themeId={activeTheme}>
            <LessonBlockPreview block={activeBlock} lessonId={lesson.id} />
          </TailwindFreeZone>
        ) : null}
      </div>
    </section>
  );

  const diagramPane = diagramBlock ? (
    <section className={`${styles.panel} ${styles.supportPanel}`}>
      <div className={styles.supportHeader}>
        <p className={styles.panelEyebrow}>Diagram Snapshot</p>
        <p className={styles.supportMeta}>Context block</p>
      </div>
      <div className={styles.supportCanvas}>
        <TailwindFreeZone enabled themeId={activeTheme}>
          <LessonBlockPreview block={diagramBlock} lessonId={lesson.id} />
        </TailwindFreeZone>
      </div>
    </section>
  ) : null;

  const tutorPane = (
    <section className={`${styles.panel} ${styles.supportPanel}`}>
      <div className={styles.supportHeader}>
        <p className={styles.panelEyebrow}>Tutor Companion</p>
        <p className={styles.supportMeta}>Teach mode</p>
      </div>
      <div className={styles.tutorCanvas}>
        <TailwindFreeZone enabled themeId={activeTheme}>
          <TutorPanel lessonId={lesson.id} lessonTitle={lesson.title} blocks={sortedBlocks} mode="teach" />
        </TailwindFreeZone>
      </div>
    </section>
  );

  const hero = (
    <header className={`${styles.hero} ${styles.panel}`}>
      <div className={styles.heroTop}>
        <p className={styles.heroEyebrow}>Lesson Style Lab</p>
        <div className={styles.heroPills}>
          <span className={styles.heroPill}>{activeThemeConfig.label}</span>
          <span className={styles.heroPill}>{activeThemeConfig.mood}</span>
        </div>
      </div>

      <div className={styles.heroBody}>
        <div className={styles.heroMain}>
          <p className={styles.heroTag}>{activeThemeConfig.heroTag}</p>
          <h1 className={styles.heroTitle}>{lesson.title}</h1>
          <p className={styles.heroSummary}>{lesson.description}</p>
        </div>

        <div className={styles.heroFeatureColumn}>
          <ThemeShowpiece theme={activeTheme} />
          <aside className={styles.heroAside}>
            <p className={styles.panelEyebrow}>Theme Intent</p>
            <p className={styles.heroAsideText}>{activeThemeConfig.summary}</p>
            <div className={styles.sceneTagRow}>
              {sceneTags.map((tag) => (
                <span key={tag} className={styles.sceneTag}>
                  {tag}
                </span>
              ))}
            </div>
            <p className={styles.heroAsideMeta}>
              This is a sandbox. The theme can be theatrical, editorial, glossy, brutalist, or completely stripped.
            </p>
          </aside>
        </div>
      </div>
    </header>
  );

  const luxeLayout = (
    <div className={styles.luxeLayout}>
      <div className={styles.luxeLead}>{stagePane}</div>
      <div className={styles.luxeRail}>{utilityPanel}</div>
      <div className={styles.luxeSupport}>{diagramPane}</div>
      <div className={styles.luxeCompanion}>{tutorPane}</div>
    </div>
  );

  const glassLayout = (
    <div className={styles.glassLayout}>
      <div className={styles.glassUtility}>{utilityPanel}</div>
      <div className={styles.glassStage}>{stagePane}</div>
      <div className={styles.glassRow}>
        {diagramPane}
        {tutorPane}
      </div>
    </div>
  );

  const coastalLayout = (
    <div className={styles.coastalLayout}>
      <aside className={styles.coastalSidebar}>
        {utilityPanel}
        {tutorPane}
      </aside>
      <div className={styles.coastalMain}>
        {stagePane}
        {diagramPane}
      </div>
    </div>
  );

  const midnightLayout = (
    <div className={styles.midnightLayout}>
      <div className={styles.midnightHeroStrip}>{stagePane}</div>
      <div className={styles.midnightGrid}>
        <div className={styles.midnightUtility}>{utilityPanel}</div>
        <div className={styles.midnightSupportStack}>
          {diagramPane}
          {tutorPane}
        </div>
      </div>
    </div>
  );

  const monoLayout = (
    <div className={styles.monoLayout}>
      <div className={styles.monoUtility}>{utilityPanel}</div>
      <div className={styles.monoStage}>{stagePane}</div>
      <div className={styles.monoDiagram}>{diagramPane}</div>
      <div className={styles.monoTutor}>{tutorPane}</div>
    </div>
  );

  const plainLayout = (
    <div className={styles.noneLayout}>
      {utilityPanel}
      {stagePane}
      {diagramPane}
      {tutorPane}
    </div>
  );

  let layoutBody = glassLayout;
  if (activeTheme === 'none') layoutBody = plainLayout;
  if (activeTheme === 'luxe-editorial') layoutBody = luxeLayout;
  if (activeTheme === 'coastal-studio') layoutBody = coastalLayout;
  if (activeTheme === 'midnight-velvet') layoutBody = midnightLayout;
  if (activeTheme === 'mono-atelier') layoutBody = monoLayout;

  return (
    <section className={`${styles.showcaseWrap} ${themeClassNames[activeTheme]}`}>
      {hero}
      {layoutBody}
    </section>
  );
}
