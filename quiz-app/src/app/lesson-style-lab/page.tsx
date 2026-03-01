import {
  Fraunces,
  Instrument_Sans,
  Newsreader,
  Plus_Jakarta_Sans,
  Space_Mono,
} from 'next/font/google';
import fs from 'node:fs';
import path from 'node:path';
import styles from './styles.module.css';
import LessonShowcaseExperience from './LessonShowcaseExperience';
import type { Lesson } from '@/data/lessons/types';

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader' });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

type LessonSummary = {
  id: string;
  title: string;
  unit: string;
  hasMicrobreak: boolean;
  hasMedia: boolean;
};

interface PageProps {
  searchParams?: Promise<{ lessonId?: string; theme?: string }>;
}

function collectLessonFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectLessonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function hasMicrobreakBlock(lesson: Lesson): boolean {
  return lesson.blocks.some((block) => block.type === 'microbreak');
}

function hasMediaBlock(lesson: Lesson): boolean {
  return lesson.blocks.some((block) => {
    if (block.type !== 'diagram') return false;
    const content = block.content as Record<string, unknown>;
    const embedUrl = typeof content.embedUrl === 'string' ? content.embedUrl.trim() : '';
    const videoUrl = typeof content.videoUrl === 'string' ? content.videoUrl.trim() : '';
    return embedUrl.length > 0 || videoUrl.length > 0;
  });
}

function loadLessonsFromDisk(): { lessons: Lesson[]; summaries: LessonSummary[] } {
  const lessonsDir = path.join(process.cwd(), 'src', 'data', 'lessons');
  const files = collectLessonFiles(lessonsDir);
  const lessons: Lesson[] = [];

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<Lesson>;
      if (!parsed.id || !parsed.title || !Array.isArray(parsed.blocks)) continue;
      lessons.push(parsed as Lesson);
    } catch {
      continue;
    }
  }

  lessons.sort((a, b) => a.id.localeCompare(b.id));
  const summaries = lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    unit: lesson.unit,
    hasMicrobreak: hasMicrobreakBlock(lesson),
    hasMedia: hasMediaBlock(lesson),
  }));

  return { lessons, summaries };
}

export default async function LessonStyleLabPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const selectedId = params?.lessonId;
  const requestedTheme = params?.theme;
  const theme: 'original' | 'swiss' | 'control' | 'studio' | 'notebook' | 'blueprint' =
    requestedTheme === 'control' ||
    requestedTheme === 'studio' ||
    requestedTheme === 'notebook' ||
    requestedTheme === 'blueprint' ||
    requestedTheme === 'swiss' ||
    requestedTheme === 'original'
      ? requestedTheme
      : 'original';
  const { lessons, summaries } = loadLessonsFromDisk();
  const mediaEligible = summaries.filter((item) => item.hasMedia);
  const options = mediaEligible.length > 0 ? mediaEligible : summaries;

  const defaultLessonId = options[0]?.id;
  const resolvedLessonId =
    selectedId && options.some((item) => item.id === selectedId) ? selectedId : defaultLessonId;
  const lesson = lessons.find((entry) => entry.id === resolvedLessonId);

  if (!lesson) {
    return (
      <main
        className={`${styles.page} ${instrumentSans.variable} ${newsreader.variable} ${plusJakartaSans.variable} ${spaceMono.variable} ${fraunces.variable}`}
      >
        <div className={styles.shell}>
          <header className={styles.hero}>
            <h1 className={styles.title}>Lesson Style Lab</h1>
            <p className={styles.subtitle}>No lessons available to preview.</p>
          </header>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`${styles.page} ${instrumentSans.variable} ${newsreader.variable} ${plusJakartaSans.variable} ${spaceMono.variable} ${fraunces.variable}`}
    >
      <div className={styles.glowA} />
      <div className={styles.glowB} />
      <div className={styles.shell}>
        <LessonShowcaseExperience lesson={lesson} options={options} theme={theme} />
      </div>
    </main>
  );
}
