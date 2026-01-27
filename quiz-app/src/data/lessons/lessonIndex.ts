/**
 * Lesson Index Registry
 * Central registry of all lessons for navigation and quiz tree
 */

import { getLessonQuestionCount } from '@/lib/questions/questionFilter';

export interface LessonIndexEntry {
  id: string;
  title: string;
  unit: string;
  unitNumber: string; // e.g., "202", "201", "210"
  topic: string;
  description: string;
  questionCount: number;
  available: boolean;
  order: number;
}

/**
 * All available lessons in the system
 * Organized by unit and topic
 */
export const lessonIndex: LessonIndexEntry[] = [
  // Unit 201: Health & Safety
  {
    id: '201-1A',
    title: 'Health & Safety Legislation: Understanding Your Responsibilities',
    unit: 'Unit 201',
    unitNumber: '201',
    topic: 'Health & Safety Legislation',
    description: 'Learn the purpose of health and safety legislation, understand the Health and Safety at Work Act and Electricity at Work Regulations, and know the responsibilities of employers and employees.',
    questionCount: getLessonQuestionCount('201-1A'),
    available: true,
    order: 1,
  },

  // Unit 202: Science 2365 Level 2
  {
    id: '202-1A',
    title: 'Electrical Quantities: Units and Measurements',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Electrical Quantities',
    description: 'Learn the fundamental electrical quantities, their SI units, and how to convert between unit prefixes.',
    questionCount: getLessonQuestionCount('202-1A'),
    available: true,
    order: 1,
  },
  {
    id: '202-2A',
    title: 'Ohm\'s Law: Calculations and Applications',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Ohm\'s Law',
    description: 'Master Ohm\'s Law (V=IR), learn to rearrange formulas, solve basic circuit calculations, and understand how voltage, current, and resistance interact.',
    questionCount: getLessonQuestionCount('202-2A'),
    available: true,
    order: 2,
  },
  {
    id: '202-3A',
    title: 'Series Circuits: Rules and Calculations',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Series Circuits',
    description: 'Learn the three series circuit rules and apply them to basic calculations.',
    questionCount: getLessonQuestionCount('202-3A'),
    available: true,
    order: 3,
  },
  {
    id: '202-3AB',
    title: 'Series Circuits: Understanding Flow and Opposition (Linear Layout)',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Series Circuits',
    description: 'Alternative text-heavy approach to series circuits with rich analogies and self-contained explanations.',
    questionCount: getLessonQuestionCount('202-3AB'),
    available: true,
    order: 3.1,
  },
  {
    id: '202-4A',
    title: 'Parallel Circuits: Rules and Calculations',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Parallel Circuits',
    description: 'Learn the three parallel circuit rules and apply them to calculations.',
    questionCount: getLessonQuestionCount('202-4A'),
    available: true,
    order: 4,
  },
  {
    id: '202-5A',
    title: 'Power & Energy: Calculations and Applications',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Power & Energy',
    description: 'Master electrical power calculations using P=VI, understand energy consumption, and calculate electricity costs.',
    questionCount: getLessonQuestionCount('202-5A'),
    available: true,
    order: 5,
  },
  {
    id: '202-6A',
    title: 'Magnetism & Electromagnetism: Principles and Applications',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Magnetism & Electromagnetism',
    description: 'Learn about magnetic fields, permanent magnets, electromagnets, and how electricity and magnetism relate. Explore the basic principles behind motors, relays, and transformers.',
    questionCount: getLessonQuestionCount('202-6A'),
    available: true,
    order: 6,
  },
  {
    id: '202-7A',
    title: 'Alternating Current (AC) Principles',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'AC Principles',
    description: 'Learn the fundamental differences between AC and DC, understand frequency, and explore UK mains supply characteristics (230V, 50Hz).',
    questionCount: getLessonQuestionCount('202-7A'),
    available: true,
    order: 7,
  },
  {
    id: '202-7B',
    title: 'How AC is Generated: Single-Loop Generator',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'AC Generation',
    description: 'Understand how rotating a loop of wire in a magnetic field generates alternating current with a sine wave pattern. Learn the basic components of a simple AC generator.',
    questionCount: getLessonQuestionCount('202-7B'),
    available: true,
    order: 7.1,
  },
  {
    id: '202-7C',
    title: 'Sine-Wave Characteristics: Vocabulary and Measurements',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'AC Waveform Characteristics',
    description: 'Learn the essential vocabulary for describing AC sine waves including RMS, peak, peak-to-peak, period, frequency, and amplitude values.',
    questionCount: getLessonQuestionCount('202-7C'),
    available: true,
    order: 7.2,
  },
  {
    id: '202-7D',
    title: 'Transformers: Mutual Induction Basics',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Transformers',
    description: 'Understand how transformers use mutual induction to step up or step down AC voltage through electromagnetic coupling.',
    questionCount: getLessonQuestionCount('202-7D'),
    available: true,
    order: 7.3,
  },

// Unit 203: Electrical Installations Technology
  {
    id: '203-1A',
    title: 'Types of Cables: Construction and Applications',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Types of Cables',
    description: 'Learn about cable construction (conductor, insulation, sheath, CPC), identify common cable types (T&E, singles, flex), select appropriate cables for different environments, and understand cable identification standards.',
    questionCount: getLessonQuestionCount('203-1A'),
    available: true,
    order: 1,
  },
  // Future lessons can be added here
  // Unit 210: Communication
  {
    id: '204-10A',
    title: 'Dead-test language — what each test proves',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Dead-test language — what each test proves',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-10A'),
    available: true,
    order: 1,
  },
  {
    id: '204-10B',
    title: 'Circuit map thinking — conductor roles → expected outcomes',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Circuit map thinking — conductor roles → expected outcomes',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-10B'),
    available: true,
    order: 2,
  },
  {
    id: '204-11A',
    title: 'Rig-safe dead-testing mindset and setup',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Rig-safe dead-testing mindset and setup',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-11A'),
    available: true,
    order: 3,
  },
];

/**
 * Get lessons grouped by unit
 */
export function getLessonsByUnit(): Record<string, LessonIndexEntry[]> {
  const grouped: Record<string, LessonIndexEntry[]> = {};
  
  lessonIndex.forEach(lesson => {
    if (!grouped[lesson.unitNumber]) {
      grouped[lesson.unitNumber] = [];
    }
    grouped[lesson.unitNumber].push(lesson);
  });
  
  // Sort lessons within each unit by order
  Object.keys(grouped).forEach(unit => {
    grouped[unit].sort((a, b) => a.order - b.order);
  });
  
  return grouped;
}

/**
 * Get lessons grouped by topic
 */
export function getLessonsByTopic(): Record<string, LessonIndexEntry[]> {
  const grouped: Record<string, LessonIndexEntry[]> = {};
  
  lessonIndex.forEach(lesson => {
    if (!grouped[lesson.topic]) {
      grouped[lesson.topic] = [];
    }
    grouped[lesson.topic].push(lesson);
  });
  
  // Sort lessons within each topic by order
  Object.keys(grouped).forEach(topic => {
    grouped[topic].sort((a, b) => a.order - b.order);
  });
  
  return grouped;
}

/**
 * Get a specific lesson by ID
 */
export function getLessonById(lessonId: string): LessonIndexEntry | undefined {
  return lessonIndex.find(lesson => lesson.id === lessonId);
}

/**
 * Get all available lessons
 */
export function getAvailableLessons(): LessonIndexEntry[] {
  return lessonIndex.filter(lesson => lesson.available);
}

/**
 * Unit metadata for display
 */
export const unitMetadata = {
  '201': {
    name: 'Health & Safety',
    fullName: 'Health & Safety 2365 Level 2 & 3',
    icon: '⚡',
    color: 'blue',
  },
  '202': {
    name: 'Science',
    fullName: 'Science 2365 Level 2',
    icon: '🔬',
    color: 'indigo',
  },
  '203': {
    name: 'Electrical Installations',
    fullName: 'Electrical Installations Technology',
    icon: '🔌',
    color: 'violet',
  },
  '204': {
    name: 'Testing & Inspection',
    fullName: 'Testing & Inspection 2365 Level 2',
    icon: '🔍',
    color: 'purple',
  },
  '210': {
    name: 'Communication',
    fullName: 'Communication 2365 Level 2',
    icon: '💬',
    color: 'cyan',
  },
};


