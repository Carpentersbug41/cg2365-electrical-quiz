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
import { decodeHtmlEntities } from '@/lib/utils/htmlEntities';

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
import lesson204_10A from '@/data/lessons/204-10A-dead-test-language-what-each-test-proves.json';
import lesson204_10B from '@/data/lessons/204-10B-circuit-map-thinking-conductor-roles-expected-outcomes.json';
import lesson204_11A from '@/data/lessons/204-11A-rig-safe-dead-testing-mindset-and-setup.json';
import lesson204_11B from '@/data/lessons/204-11B-proving-your-tester-works.json';
import lesson204_11C from '@/data/lessons/204-11C-leads-nulling-zeroing-and-avoiding-false-readings.json';
import lesson204_12A from '@/data/lessons/204-12A-the-dead-inspection-checklist.json';
import lesson204_12B from '@/data/lessons/204-12B-inspection-decisions-and-recording.json';
import lesson204_14A from '@/data/lessons/204-14A-one-way-lighting-3-plate-ceiling-rose.json';
import lesson204_14B from '@/data/lessons/204-14B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json';
import lesson204_13A from '@/data/lessons/204-13A-3-plate-ceiling-rose-loop-in-explained-for-a-total-beginner.json';
import lesson204_13B from '@/data/lessons/204-13B-ceiling-rose-to-one-way-switch-for-absolute-beginners.json';
import lesson203_1A from '@/data/lessons/203-1A-statutory-regulations-law.json';
import lesson203_1B from '@/data/lessons/203-1B-non-statutory-regulations-guidance.json';
import lesson203_1C from '@/data/lessons/203-1C-using-bs-7671-on-a-job.json';
import lesson203_2A from '@/data/lessons/203-2A-sources-drawings-symbols-scale.json';
import lesson203_2B from '@/data/lessons/203-2B-reading-installation-drawings-legend-symbols-notes-abbreviations.json';
import lesson203_2C from '@/data/lessons/203-2C-recognising-electrical-symbols-on-drawings.json';
import lesson203_2D from '@/data/lessons/203-2D-converting-drawing-scale-to-real-measurements.json';
import lesson203_3A from '@/data/lessons/203-3A-circuit-types-what-they-do-principles-of-operation.json';
import lesson203_3B from '@/data/lessons/203-3B-wiring-systems-by-environment-choosing-the-right-cable-containment.json';
import lesson203_3C from '@/data/lessons/203-3C-cable-sizing-basics-ib-in-iz-factors.json';
import lesson203_3D from '@/data/lessons/203-3D-protective-devices-basics-fuses-mcb-types-rcds-rcbos.json';
import lesson203_3E from '@/data/lessons/203-3E-specialised-installing-equipment.json';
import lesson202_3F from '@/data/lessons/202-3F-spacing-factor-enclosure-fill.json';
import lesson203_3F from '@/data/lessons/203-3F-spacing-factor-enclosure-fill.json';
import lesson203_3A1 from '@/data/lessons/203-3A1-circuit-types-what-they-do.json';

// Lesson registry (expand as more lessons are added)
const LESSONS: Record<string, Lesson> = {
  '203-3A1': lesson203_3A1 as Lesson,  '203-3F': lesson203_3F as Lesson,  '202-3F': lesson202_3F as Lesson,
  '203-3E': lesson203_3E as Lesson,
  '203-3D': lesson203_3D as Lesson,
  '203-3C': lesson203_3C as Lesson,
  '203-3B': lesson203_3B as Lesson,
  '203-3A': lesson203_3A as Lesson,
  '203-2D': lesson203_2D as Lesson,
  '203-2C': lesson203_2C as Lesson,
  '203-2B': lesson203_2B as Lesson,
  '203-2A': lesson203_2A as Lesson,
  '203-1C': lesson203_1C as Lesson,
  '203-1B': lesson203_1B as Lesson,
  '203-1A': lesson203_1A as Lesson,
  '204-13B': lesson204_13B as Lesson,
  '204-13A': lesson204_13A as Lesson,
  '204-14B': lesson204_14B as Lesson,
  '204-14A': lesson204_14A as Lesson,
  '204-12B': lesson204_12B as Lesson,
  '204-12A': lesson204_12A as Lesson,
  '204-11C': lesson204_11C as Lesson,
  '204-11B': lesson204_11B as Lesson,
  '204-11A': lesson204_11A as Lesson,
  '204-10B': lesson204_10B as Lesson,
  '204-10A': lesson204_10A as Lesson,
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
    title: `${decodeHtmlEntities(lesson.title)} | C&G 2365 Learning`,
    description: decodeHtmlEntities(lesson.description),
  };
}


