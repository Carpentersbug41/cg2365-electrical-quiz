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
    title: 'Roles & responsibilities',
    unit: 'Unit 201',
    unitNumber: '201',
    topic: 'Roles & responsibilities',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('201-1A'),
    available: true,
    order: 1,
  },
  {
    id: '201-1B',
    title: 'Health & Safety legislation',
    unit: 'Unit 201',
    unitNumber: '201',
    topic: 'Health & Safety legislation',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('201-1B'),
    available: true,
    order: 2,
  },
  {
    id: '201-1C',
    title: 'Environmental legislation',
    unit: 'Unit 201',
    unitNumber: '201',
    topic: 'Environmental legislation',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('201-1C'),
    available: true,
    order: 3,
  },// Unit 202: Science 2365 Level 2
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


  {
    id: '202-3F',
    title: 'Spacing Factor / Enclosure Fill',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Spacing Factor / Enclosure Fill',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('202-3F'),
    available: true,
    order: 8.3,
  },
  
      
  
      
  {
    id: '202-202-5A',
    title: 'Magnetism basics',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Magnetism basics',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('202-202-5A'),
    available: true,
    order: 9.3,
  },// Unit 203: Electrical Installations Technology
  // Future lessons can be added here
  
  {
    id: '203-1A',
    title: 'Statutory Regulations (LAW)',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Statutory Regulations (LAW)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-1A'),
    available: true,
    order: 1,
  },
  {
    id: '203-1B',
    title: 'Non-Statutory Regulations & Guidance',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Non-Statutory Regulations & Guidance',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-1B'),
    available: true,
    order: 2,
  },
  {
    id: '203-1C',
    title: 'Using BS 7671 on a Job',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Using BS 7671 on a Job',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-1C'),
    available: true,
    order: 3,
  },
  {
    id: '203-2A',
    title: 'Sources, Drawings, Symbols & Scale',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Sources, Drawings, Symbols & Scale',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-2A'),
    available: true,
    order: 4,
  },
  
  {
    id: '203-2B',
    title: 'Reading Installation Drawings: Legend, Symbols, Notes & Abbreviations',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Reading Installation Drawings: Legend, Symbols, Notes & Abbreviations',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-2B'),
    available: true,
    order: 5,
  },
  {
    id: '203-2C',
    title: 'Recognising Electrical Symbols on Drawings',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Recognising Electrical Symbols on Drawings',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-2C'),
    available: true,
    order: 6,
  },
  {
    id: '203-2D',
    title: 'Converting Drawing Scale to Real Measurements',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Converting Drawing Scale to Real Measurements',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-2D'),
    available: true,
    order: 7,
  },
  
  {
    id: '203-3A',
    title: 'Circuit Types: What They Do (Principles of Operation)',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Circuit Types: What They Do (Principles of Operation)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3A'),
    available: true,
    order: 8,
  },
  {
    id: '203-3B',
    title: 'Wiring Systems by Environment: Choosing the Right Cable + Containment',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Wiring Systems by Environment: Choosing the Right Cable + Containment',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3B'),
    available: true,
    order: 9,
  },
  {
    id: '203-3C',
    title: 'Cable Sizing Basics: Ib / In / Iz + Factors',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Cable Sizing Basics: Ib / In / Iz + Factors',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3C'),
    available: true,
    order: 10,
  },
  {
    id: '203-3D',
    title: 'Protective Devices Basics: Fuses, MCB Types, RCDs, RCBOs',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Protective Devices Basics: Fuses, MCB Types, RCDs, RCBOs',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3D'),
    available: true,
    order: 11,
  },
  {
    id: '203-3E',
    title: 'Specialised Installing Equipment',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Specialised Installing Equipment',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3E'),
    available: true,
    order: 12,
  },
  
  
      
  
  
  {
    id: '203-3F',
    title: 'Spacing Factor / Enclosure Fill',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Spacing Factor / Enclosure Fill',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3F'),
    available: true,
    order: 13,
  },
                
      
        
        
      
                    
  
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
  {
    id: '204-11B',
    title: 'Proving your tester works',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Proving your tester works',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-11B'),
    available: true,
    order: 4,
  },
  {
    id: '204-11C',
    title: 'Leads, nulling/zeroing, and avoiding false readings',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Leads, nulling/zeroing, and avoiding false readings',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-11C'),
    available: true,
    order: 5,
  },
  {
    id: '204-12A',
    title: 'The dead inspection checklist',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'The dead inspection checklist',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-12A'),
    available: true,
    order: 6,
  },
  {
    id: '204-12B',
    title: 'Inspection decisions and recording',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Inspection decisions and recording',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-12B'),
    available: true,
    order: 7,
  },
  {
    id: '204-14A',
    title: 'One-way lighting (3-plate ceiling rose)',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'One-way lighting (3-plate ceiling rose)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-14A'),
    available: true,
    order: 8,
  },
  {
    id: '204-14B',
    title: 'One-way lighting (3-plate ceiling rose): build flow + prove it (rig-safe)',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'One-way lighting (3-plate ceiling rose): build flow + prove it (rig-safe)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-14B'),
    available: true,
    order: 9,
  },
  {
    id: '204-13A',
    title: '3-plate ceiling rose (loop-in) — explained for a total beginner',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: '3-plate ceiling rose (loop-in) — explained for a total beginner',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-13A'),
    available: true,
    order: 10,
  },
  {
    id: '204-13B',
    title: 'Ceiling rose to one-way switch - For absolute beginners',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Ceiling rose to one-way switch - For absolute beginners',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-13B'),
    available: true,
    order: 11,
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


