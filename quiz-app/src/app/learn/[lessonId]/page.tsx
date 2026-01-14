/**
 * Dynamic Lesson Page
 * Renders lessons using appropriate layout based on lesson data
 */

import { notFound } from 'next/navigation';
import { Lesson } from '@/data/lessons/types';
import LayoutA from '@/components/learning/layouts/LayoutA';
import LayoutB from '@/components/learning/layouts/LayoutB';

// Import lesson data
import lesson201_1A from '@/data/lessons/201-1A-health-safety-legislation.json';
import lesson202_1A from '@/data/lessons/202-1A-electrical-quantities-units.json';
import lesson202_2A from '@/data/lessons/202-2A-ohms-law.json';
import lesson202_4A from '@/data/lessons/202-4A-series-circuits.json';
import lesson202_4B from '@/data/lessons/202-4B-series-circuits-extended.json';
import lesson202_5A from '@/data/lessons/202-5A-power-energy.json';
import lesson202_6A from '@/data/lessons/202-6A-magnetism-electromagnetism.json';
import lesson202_7A from '@/data/lessons/202-7A-ac-principles.json';

// Lesson registry (expand as more lessons are added)
const LESSONS: Record<string, Lesson> = {
  '201-1A': lesson201_1A as Lesson,
  '202-1A': lesson202_1A as Lesson,
  '202-2A': lesson202_2A as Lesson,
  '202-4A': lesson202_4A as Lesson,
  '202-4B': lesson202_4B as Lesson,
  '202-5A': lesson202_5A as Lesson,
  '202-6A': lesson202_6A as Lesson,
  '202-7A': lesson202_7A as Lesson,
};

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  
  // Load lesson data
  const lesson = LESSONS[lessonId];

  if (!lesson) {
    notFound();
  }

  // Select layout component based on lesson layout type
  const LayoutComponent = lesson.layout === 'split-vis' ? LayoutA : LayoutB;

  return <LayoutComponent lesson={lesson} />;
}

// Generate static paths for known lessons (optional for SSG)
export async function generateStaticParams() {
  return Object.keys(LESSONS).map((lessonId) => ({
    lessonId,
  }));
}

// Metadata
export async function generateMetadata({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = LESSONS[lessonId];

  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }

  return {
    title: `${lesson.title} | C&G 2365 Learning`,
    description: lesson.description,
  };
}


