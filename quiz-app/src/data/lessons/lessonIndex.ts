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
  },
  // Unit 202: Science 2365 Level 2
                      

    
      
  
      
    
  
  
  {
    id: '202-5A',
    title: 'Magnetism and Electromagnetism',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Magnetism and Electromagnetism',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('202-5A'),
    available: true,
    order: 1,
  },
  {
    id: '202-4A',
    title: 'Electron Theory and Materials',
    unit: 'Unit 202',
    unitNumber: '202',
    topic: 'Electron Theory and Materials',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('202-4A'),
    available: true,
    order: 2,
  },// Unit 203: Electrical Installations Technology
  // Future lessons can be added here
  
          
        
            
  
      
  
  
                  
      
        
        
      
                    
  
            
  
    
  {
    id: '203-1A',
    title: 'Statutory and Non-statutory Regulations',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Statutory and Non-statutory Regulations',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-1A'),
    available: true,
    order: 1,
  },
  {
    id: '203-1B',
    title: 'Implications of Regulatory Non-compliance',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Implications of Regulatory Non-compliance',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-1B'),
    available: true,
    order: 2,
  },
  {
    id: '203-2A',
    title: 'Technical Information and Drawing Types',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Technical Information and Drawing Types',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-2A'),
    available: true,
    order: 3,
  },
  {
    id: '203-2B',
    title: 'Symbols and Scaling in Drawings',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Symbols and Scaling in Drawings',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-2B'),
    available: true,
    order: 4,
  },
  {
    id: '203-3B',
    title: 'Conductor Sizing and Protective Devices',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Conductor Sizing and Protective Devices',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3B'),
    available: true,
    order: 5,
  },
  {
    id: '203-3C',
    title: 'Installation Equipment and Enclosure Spacing',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Installation Equipment and Enclosure Spacing',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-3C'),
    available: true,
    order: 6,
  },
  {
    id: '203-4A',
    title: 'Earthing Systems and ADS Components',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Earthing Systems and ADS Components',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-4A'),
    available: true,
    order: 7,
  },
  {
    id: '203-4B',
    title: 'Exposed and Extraneous Conductive Parts',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Exposed and Extraneous Conductive Parts',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-4B'),
    available: true,
    order: 8,
  },
  {
    id: '203-4C',
    title: 'Earth Loop Impedance Path',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Earth Loop Impedance Path',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-4C'),
    available: true,
    order: 9,
  },
  {
    id: '203-5A',
    title: 'Electricity Generation and Transmission',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Electricity Generation and Transmission',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-5A'),
    available: true,
    order: 10,
  },
  {
    id: '203-5B',
    title: 'Distribution Voltages and Network Components',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Distribution Voltages and Network Components',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-5B'),
    available: true,
    order: 11,
  },
  {
    id: '203-6A',
    title: 'Types of Micro-renewable Energy',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Types of Micro-renewable Energy',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-6A'),
    available: true,
    order: 12,
  },
  {
    id: '203-6B',
    title: 'Installation and Evaluation of Micro-renewables',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Installation and Evaluation of Micro-renewables',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-6B'),
    available: true,
    order: 13,
  },
  {
    id: '203-10B',
    title: 'Consumer Units: Purpose + Protective Devices',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Consumer Units: Purpose + Protective Devices',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-10B'),
    available: true,
    order: 14,
  },
  {
    id: '203-10C',
    title: 'Consumer Unit Practical: Position, Entries, Terminations (Rig-safe)',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Consumer Unit Practical: Position, Entries, Terminations (Rig-safe)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-10C'),
    available: true,
    order: 15,
  },
  {
    id: '203-10A',
    title: 'Consumer Units (TOTAL NOOB)',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Consumer Units (TOTAL NOOB)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-10A'),
    available: true,
    order: 16,
  },
  {
    id: '203-LC1A',
    title: 'Lighting Circuits (Noob Level 1)',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Lighting Circuits (Noob Level 1)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-LC1A'),
    available: true,
    order: 17,
  },
  {
    id: '203-SC1A',
    title: 'Socket Circuits (Noob Level 1)',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Socket Circuits (Noob Level 1)',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-SC1A'),
    available: true,
    order: 18,
  },
  
  {
    id: '203-2N1A',
    title: 'Electrical Symbols (Noob): Shape Grammar Basics ',
    unit: 'Unit 203',
    unitNumber: '203',
    topic: 'Electrical Symbols (Noob): Shape Grammar Basics ',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('203-2N1A'),
    available: true,
    order: 19,
  },// Unit 210: Communication
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
          {
    id: '204-15A',
    title: 'Testing overview + safe isolation',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Testing overview + safe isolation',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-15A'),
    available: true,
    order: 12,
  },
  {
    id: '204-9A',
    title: 'Tools & measuring/marking out for wiring systems',
    unit: 'Unit 204',
    unitNumber: '204',
    topic: 'Tools & measuring/marking out for wiring systems',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('204-9A'),
    available: true,
    order: 13,
  },

                  
  
  {
    id: '210-1A',
    title: 'Site Management and Trade Roles',
    unit: 'Unit 210',
    unitNumber: '210',
    topic: 'Site Management and Trade Roles',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('210-1A'),
    available: true,
    order: 1,
  },
  {
    id: '210-1B',
    title: 'Site Visitors and Inspectors',
    unit: 'Unit 210',
    unitNumber: '210',
    topic: 'Site Visitors and Inspectors',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('210-1B'),
    available: true,
    order: 2,
  },
  {
    id: '210-2A',
    title: 'Legislation and Workplace Documentation',
    unit: 'Unit 210',
    unitNumber: '210',
    topic: 'Legislation and Workplace Documentation',
    description: '[Generated lesson]',
    questionCount: getLessonQuestionCount('210-2A'),
    available: true,
    order: 3,
  },];

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


