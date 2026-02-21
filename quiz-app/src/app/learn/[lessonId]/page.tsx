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
import lesson202_1A from '@/data/lessons/202-1A-electrical-quantities-units.json';
import lesson202_2A from '@/data/lessons/202-2A-ohms-law.json';
import lesson202_3A from '@/data/lessons/202-3A-series-circuits.json';
import lesson202_3AB from '@/data/lessons/202-3AB-series-circuits-linear.json';
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
import lesson202_3F from '@/data/lessons/202-3F-spacing-factor-enclosure-fill.json';
import lesson201_1A from '@/data/lessons/201-1A-roles-responsibilities.json';
import lesson201_1B from '@/data/lessons/201-1B-health-safety-legislation.json';
import lesson201_1C from '@/data/lessons/201-1C-environmental-legislation.json';
import lesson202_5A from '@/data/lessons/202-5A-magnetism-basics.json';
import lesson204_15A from '@/data/lessons/204-15A-testing-overview-safe-isolation.json';
import lesson204_9A from '@/data/lessons/204-9A-tools-measuring-marking-out-for-wiring-systems.json';
import lesson210_1A from '@/data/lessons/210-1A-site-management-and-trade-roles.json';
import lesson210_1B from '@/data/lessons/210-1B-site-visitors-and-inspectors.json';
import lesson210_2A from '@/data/lessons/210-2A-legislation-and-workplace-documentation.json';
import lesson203_1A from '@/data/lessons/203-1A-statutory-and-non-statutory-regulations.json';
import lesson203_1B from '@/data/lessons/203-1B-implications-of-regulatory-non-compliance.json';
import lesson203_2A from '@/data/lessons/203-2A-technical-information-and-drawing-types.json';
import lesson203_2B from '@/data/lessons/203-2B-symbols-and-scaling-in-drawings.json';
import lesson203_3B from '@/data/lessons/203-3B-conductor-sizing-and-protective-devices.json';
import lesson203_3C from '@/data/lessons/203-3C-installation-equipment-and-enclosure-spacing.json';
import lesson203_4A from '@/data/lessons/203-4A-earthing-systems-and-ads-components.json';
import lesson203_4B from '@/data/lessons/203-4B-exposed-and-extraneous-conductive-parts.json';
import lesson203_4C from '@/data/lessons/203-4C-earth-loop-impedance-path.json';
import lesson203_5A from '@/data/lessons/203-5A-electricity-generation-and-transmission.json';
import lesson203_5B from '@/data/lessons/203-5B-distribution-voltages-and-network-components.json';
import lesson203_6A from '@/data/lessons/203-6A-types-of-micro-renewable-energy.json';
import lesson203_6B from '@/data/lessons/203-6B-installation-and-evaluation-of-micro-renewables.json';
import lesson203_10B from '@/data/lessons/203-10B-consumer-units-purpose-protective-devices.json';
import lesson203_10C from '@/data/lessons/203-10C-consumer-unit-practical-position-entries-terminations-rig-safe.json';
import lesson203_10A from '@/data/lessons/203-10A-consumer-units-total-noob.json';
import lesson203_LC1A from '@/data/lessons/203-LC1A-lighting-circuits-noob-level-1.json';

// Lesson registry (expand as more lessons are added)
const LESSONS: Record<string, Lesson> = {
  '203-LC1A': lesson203_LC1A as Lesson,
  '203-10A': lesson203_10A as Lesson,
  '203-10C': lesson203_10C as Lesson,
  '203-10B': lesson203_10B as Lesson,
  '203-6B': lesson203_6B as Lesson,
  '203-6A': lesson203_6A as Lesson,
  '203-5B': lesson203_5B as Lesson,
  '203-5A': lesson203_5A as Lesson,
  '203-4C': lesson203_4C as Lesson,
  '203-4B': lesson203_4B as Lesson,
  '203-4A': lesson203_4A as Lesson,
  '203-3C': lesson203_3C as Lesson,
  '203-3B': lesson203_3B as Lesson,
  '203-2B': lesson203_2B as Lesson,
  '203-2A': lesson203_2A as Lesson,
  '203-1B': lesson203_1B as Lesson,
  '203-1A': lesson203_1A as Lesson,
  '210-2A': lesson210_2A as Lesson,
  '210-1B': lesson210_1B as Lesson,
  '210-1A': lesson210_1A as Lesson,  '210-210-3A1': lesson210_1A as Lesson,
  '210-210-2A1': lesson210_1A as Lesson,
  '210-210-1A1': lesson210_1A as Lesson,
  '204-9A': lesson204_9A as Lesson,
  '204-15A': lesson204_15A as Lesson,
  '202-5A': lesson202_5A as Lesson,  // Backward-compatible alias for legacy lesson IDs.
  '202-202-5A': lesson202_5A as Lesson,  '201-1C': lesson201_1C as Lesson,
  '201-1B': lesson201_1B as Lesson,
  '201-1A': lesson201_1A as Lesson,  '202-3F': lesson202_3F as Lesson,  '204-13B': lesson204_13B as Lesson,
  '204-13A': lesson204_13A as Lesson,
  '204-14B': lesson204_14B as Lesson,
  '204-14A': lesson204_14A as Lesson,
  '204-12B': lesson204_12B as Lesson,
  '204-12A': lesson204_12A as Lesson,
  '204-11C': lesson204_11C as Lesson,
  '204-11B': lesson204_11B as Lesson,
  '204-11A': lesson204_11A as Lesson,
  '204-10B': lesson204_10B as Lesson,
  '204-10A': lesson204_10A as Lesson,  '202-1A': lesson202_1A as Lesson,
  '202-2A': lesson202_2A as Lesson,
  '202-3A': lesson202_3A as Lesson,
  '202-3AB': lesson202_3AB as Lesson,  '202-7A': lesson202_7A as Lesson,
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
