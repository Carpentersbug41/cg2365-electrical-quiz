/**
 * Dynamic Lesson Page
 * Renders lessons using appropriate layout based on lesson data
 * Includes diagnostic gate for prerequisite checking
 */

import { notFound } from 'next/navigation';
import { Lesson } from '@/data/lessons/types';
import LayoutA from '@/components/learning/layouts/LayoutA';
import LayoutB from '@/components/learning/layouts/LayoutB';
import DiagnosticGate from '@/components/learning/DiagnosticGate';

// Import lesson data
import lesson201_1A from '@/data/lessons/201-1A-health-safety-legislation.json';
import lesson202_1A from '@/data/lessons/202-1A-electrical-quantities-units.json';
import lesson202_2A from '@/data/lessons/202-2A-ohms-law.json';
import lesson202_3A from '@/data/lessons/202-3A-series-circuits.json';
import lesson202_3AB from '@/data/lessons/202-3AB-series-circuits-linear.json';
import lesson202_4A from '@/data/lessons/202-4A-series-circuits-extended.json';
import lesson202_5A from '@/data/lessons/202-5A-power-energy.json';
import lesson202_6A from '@/data/lessons/202-6A-magnetism-electromagnetism.json';
import lesson202_7A from '@/data/lessons/202-7A-ac-principles.json';
import lesson202_7B from '@/data/lessons/202-7B-how-ac-is-generated.json';
import lesson202_7C from '@/data/lessons/202-7C-sine-wave-vocab.json';
import lesson202_7D from '@/data/lessons/202-7D-transformers.json';
import lesson203_1A from '@/data/lessons/203-1A-types-of-cables.json';
import lesson202_TETS from '@/data/lessons/202-TETS-test';

// Lesson registry (expand as more lessons are added)
const LESSONS: Record<string, Lesson> = {
  '202-TETS': lesson202_TETS as Lesson,
  '201-1A': lesson201_1A as Lesson,
  '202-1A': lesson202_1A as Lesson,
  '202-2A': lesson202_2A as Lesson,
  '202-3A': lesson202_3A as Lesson,
  '202-3AB': lesson202_3AB as Lesson,
  '202-4A': lesson202_4A as Lesson,
  '202-5A': lesson202_5A as Lesson,
  '202-6A': lesson202_6A as Lesson,
  '202-7A': lesson202_7A as Lesson,
  '202-7B': lesson202_7B as Lesson,
  '202-7C': lesson202_7C as Lesson,
  '202-7D': lesson202_7D as Lesson,
  '203-1A': lesson203_1A as Lesson,
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

  // Check if diagnostic gate is required
  if (lesson.diagnostic?.enabled) {
    return (
      <DiagnosticGate lessonId={lessonId} diagnostic={lesson.diagnostic}>
        <LayoutComponent lesson={lesson} />
      </DiagnosticGate>
    );
  }

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


