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
    id: '202-4A',
    title: 'Series Circuits: Rules and Calculations',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Series Circuits',
    description: 'Learn the three series circuit rules and apply them to basic calculations.',
    questionCount: getLessonQuestionCount('202-4A'),
    available: true,
    order: 3,
  },
  {
    id: '202-4B',
    title: 'Series Circuits: Extended',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Series Circuits',
    description: 'Advanced series circuit calculations and applications.',
    questionCount: getLessonQuestionCount('202-4B'),
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
  // Future lessons can be added here
  // Unit 201: Health & Safety
  // Unit 210: Communication
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
  '202': {
    name: 'Science',
    fullName: 'Science 2365 Level 2',
    icon: '🔬',
    color: 'green',
  },
  '201': {
    name: 'Health & Safety',
    fullName: 'Health & Safety 2365 Level 2 & 3',
    icon: '⚡',
    color: 'red',
  },
  '210': {
    name: 'Communication',
    fullName: 'Communication 2365 Level 2',
    icon: '💬',
    color: 'blue',
  },
};


