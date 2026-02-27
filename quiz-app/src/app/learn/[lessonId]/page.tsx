/**
 * Dynamic Lesson Page
 * Renders lessons using appropriate layout based on lesson data
 * Includes diagnostic gate for prerequisite checking
 */

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Lesson } from '@/data/lessons/types';
import LayoutA from '@/components/learning/layouts/LayoutA';
import LayoutB from '@/components/learning/layouts/LayoutB';
import DiagnosticGate from '@/components/learning/DiagnosticGate';
import { decodeHtmlEntities } from '@/lib/utils/htmlEntities';
import { getCoursePrefixFromHeader } from '@/lib/routing/curricula';
import { getCurriculumScopeFromCoursePrefix, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

// Import lesson data
import lesson204_10A from '@/data/lessons/2365/204-10A-dead-test-language-what-each-test-proves.json';
import lesson204_10B from '@/data/lessons/2365/204-10B-circuit-map-thinking-conductor-roles-expected-outcomes.json';
import lesson204_11A from '@/data/lessons/2365/204-11A-rig-safe-dead-testing-mindset-and-setup.json';
import lesson204_11B from '@/data/lessons/2365/204-11B-proving-your-tester-works.json';
import lesson204_11C from '@/data/lessons/2365/204-11C-leads-nulling-zeroing-and-avoiding-false-readings.json';
import lesson204_12A from '@/data/lessons/2365/204-12A-the-dead-inspection-checklist.json';
import lesson204_12B from '@/data/lessons/2365/204-12B-inspection-decisions-and-recording.json';
import lesson204_14A from '@/data/lessons/2365/204-14A-one-way-lighting-3-plate-ceiling-rose.json';
import lesson204_14B from '@/data/lessons/2365/204-14B-one-way-lighting-3-plate-ceiling-rose-build-flow-prove-it-rig-safe.json';
import lesson204_13A from '@/data/lessons/2365/204-13A-3-plate-ceiling-rose-loop-in-explained-for-a-total-beginner.json';
import lesson204_13B from '@/data/lessons/2365/204-13B-ceiling-rose-to-one-way-switch-for-absolute-beginners.json';
import lesson201_1A from '@/data/lessons/2365/201-1A-roles-responsibilities.json';
import lesson201_1B from '@/data/lessons/2365/201-1B-health-safety-legislation.json';
import lesson201_1C from '@/data/lessons/2365/201-1C-environmental-legislation.json';
import lesson204_15A from '@/data/lessons/2365/204-15A-testing-overview-safe-isolation.json';
import lesson204_9A from '@/data/lessons/2365/204-9A-tools-measuring-marking-out-for-wiring-systems.json';
import lesson210_1A from '@/data/lessons/2365/210-1A-site-management-and-trade-roles.json';
import lesson210_1B from '@/data/lessons/2365/210-1B-site-visitors-and-inspectors.json';
import lesson210_2A from '@/data/lessons/2365/210-2A-legislation-and-workplace-documentation.json';
import lesson203_1A from '@/data/lessons/2365/203-1A-statutory-and-non-statutory-regulations.json';
import lesson203_1B from '@/data/lessons/2365/203-1B-implications-of-regulatory-non-compliance.json';
import lesson203_2A from '@/data/lessons/2365/203-2A-technical-information-and-drawing-types.json';
import lesson203_2B from '@/data/lessons/2365/203-2B-symbols-and-scaling-in-drawings.json';
import lesson203_3A from '@/data/lessons/2365/203-3A-circuit-types-what-they-do.json';
import lesson203_3B from '@/data/lessons/2365/203-3B-conductor-sizing-and-protective-devices.json';
import lesson203_3C from '@/data/lessons/2365/203-3C-installation-equipment-and-enclosure-spacing.json';
import lesson203_4A from '@/data/lessons/2365/203-4A-earthing-systems-and-ads-components.json';
import lesson203_4B from '@/data/lessons/2365/203-4B-exposed-and-extraneous-conductive-parts.json';
import lesson203_4C from '@/data/lessons/2365/203-4C-earth-loop-impedance-path.json';
import lesson203_5A from '@/data/lessons/2365/203-5A-electricity-generation-and-transmission.json';
import lesson203_5B from '@/data/lessons/2365/203-5B-distribution-voltages-and-network-components.json';
import lesson203_6A from '@/data/lessons/2365/203-6A-types-of-micro-renewable-energy.json';
import lesson203_6B from '@/data/lessons/2365/203-6B-installation-and-evaluation-of-micro-renewables.json';
import lesson203_10B from '@/data/lessons/2365/203-10B-consumer-units-purpose-protective-devices.json';
import lesson203_10C from '@/data/lessons/2365/203-10C-consumer-unit-practical-position-entries-terminations-rig-safe.json';
import lesson203_10A from '@/data/lessons/2365/203-10A-consumer-units-total-noob.json';
import lesson203_LC1A from '@/data/lessons/2365/203-LC1A-lighting-circuits-noob-level-1.json';
import lesson201_203_SC1A from '@/data/lessons/2365/201-203-SC1A-socket-circuits-noob-level-1.json';
import lesson203_SC1A from '@/data/lessons/2365/203-SC1A-socket-circuits-noob-level-1.json';
import lesson203_2N1A from '@/data/lessons/2365/203-2N1A-electrical-symbols-noob-shape-grammar-basics.json';
import lesson202_5A from '@/data/lessons/2365/202-5A-magnetism-and-electromagnetism.json';
import lesson202_4A from '@/data/lessons/2365/202-4A-electron-theory-and-materials.json';
import lesson202_4B from '@/data/lessons/2365/202-4B-resistance-resistivity-and-voltage-drop.json';
import lesson202_5L1M from '@/data/lessons/2365/202-5L1M-magnetism-noob-poles-fields-flux-flux-density-current-effects.json';
import lesson203_3L1C from '@/data/lessons/2365/203-3L1C-cooker-circuits-noob-what-it-is-basic-path-and-protection.json';
import lesson202_4D from '@/data/lessons/2365/202-4D-power-and-effects-of-electric-current.json';
import lesson202_5B from '@/data/lessons/2365/202-5B-ac-generation-and-sine-waves.json';
import lesson203_3L1A from '@/data/lessons/2365/203-3L1A-alarm-emergency-systems-noob-open-closed-circuits-fire-intruder-emergency-lighting.json';
import lessonPHY_4_1A from '@/data/lessons/gcse/physics/PHY-4-1A-introduction-to-waves.json';
import lessonBIO_1_1A from '@/data/lessons/gcse/biology/BIO-1-1A-eukaryotic-cell-structures.json';
import lesson202_6A from '@/data/lessons/2365/202-6A-electronic-components-and-principles.json';
import lessonBIO_6_1A from '@/data/lessons/gcse/biology/BIO-6-1A-photosynthesis-and-producers.json';

// Lesson registry (expand as more lessons are added)
const LESSONS: Record<string, Lesson> = {
  'BIO-6-1A': lessonBIO_6_1A as Lesson,
  '202-6A': lesson202_6A as Lesson,
  'BIO-1-1A': lessonBIO_1_1A as Lesson,
  'PHY-4-1A': lessonPHY_4_1A as Lesson,
  '203-3L1A': lesson203_3L1A as Lesson,
  '202-5B': lesson202_5B as Lesson,
  '202-4D': lesson202_4D as Lesson,
  '203-3L1C': lesson203_3L1C as Lesson,
  '202-5L1M': lesson202_5L1M as Lesson,
  '202-4B': lesson202_4B as Lesson,
  '202-4A': lesson202_4A as Lesson,
  '202-5A': lesson202_5A as Lesson,
  '203-2N1A': lesson203_2N1A as Lesson,  '203-SC1A': lesson203_SC1A as Lesson,
  '201-203-SC1A': lesson201_203_SC1A as Lesson,
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
  '203-3A': lesson203_3A as Lesson,
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
  '204-15A': lesson204_15A as Lesson,  // Backward-compatible alias for legacy lesson IDs.
  '202-202-5A': lesson203_5A as Lesson,  '201-1C': lesson201_1C as Lesson,
  '201-1B': lesson201_1B as Lesson,
  '201-1A': lesson201_1A as Lesson,  '204-13B': lesson204_13B as Lesson,
  '204-13A': lesson204_13A as Lesson,
  '204-14B': lesson204_14B as Lesson,
  '204-14A': lesson204_14A as Lesson,
  '204-12B': lesson204_12B as Lesson,
  '204-12A': lesson204_12A as Lesson,
  '204-11C': lesson204_11C as Lesson,
  '204-11B': lesson204_11B as Lesson,
  '204-11A': lesson204_11A as Lesson,
  '204-10B': lesson204_10B as Lesson,
  '204-10A': lesson204_10A as Lesson,};

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  const requestHeaders = await headers();
  const coursePrefix = getCoursePrefixFromHeader(requestHeaders.get('x-course-prefix'));
  const scope = getCurriculumScopeFromCoursePrefix(coursePrefix);

  if (!isLessonIdAllowedForScope(lessonId, scope)) {
    notFound();
  }
  
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
  const requestHeaders = await headers();
  const coursePrefix = getCoursePrefixFromHeader(requestHeaders.get('x-course-prefix'));
  const suffix =
    coursePrefix === '/gcse/science/physics'
      ? 'GCSE Physics Learning'
      : coursePrefix === '/gcse/science/biology'
        ? 'GCSE Biology Learning'
        : 'C&G 2365 Learning';

  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }

  return {
    title: `${decodeHtmlEntities(lesson.title)} | ${suffix}`,
    description: decodeHtmlEntities(lesson.description),
  };
}
