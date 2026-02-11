'use client';

import { Check, Circle } from 'lucide-react';

interface LessonOption {
  id: string;
  filename: string;
  title: string;
  unit: string;
  microbreakCount: number;
  vocabTermCount: number;
  totalBlocks: number;
}

interface LessonSelectorProps {
  lessons: LessonOption[];
  selectedLessonFilename: string | null;
  onSelect: (lessonFilename: string) => void;
  disabled?: boolean;
}

export default function LessonSelector({ 
  lessons, 
  selectedLessonFilename, 
  onSelect,
  disabled = false
}: LessonSelectorProps) {
  // Group lessons by unit
  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.unit]) {
      acc[lesson.unit] = [];
    }
    acc[lesson.unit].push(lesson);
    return acc;
  }, {} as Record<string, LessonOption[]>);

  const selectedLesson = lessons.find(l => l.filename === selectedLessonFilename);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
        Select Lesson
      </label>
      
      <select
        value={selectedLessonFilename || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 text-base rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <option value="">Choose a lesson...</option>
        {Object.entries(groupedLessons).map(([unit, unitLessons]) => (
          <optgroup key={unit} label={unit}>
            {unitLessons.map(lesson => (
              <option key={lesson.filename} value={lesson.filename}>
                {lesson.microbreakCount > 0 ? '✓' : '○'} {lesson.id} - {lesson.title.substring(0, 60)}
                {lesson.title.length > 60 ? '...' : ''} 
                {lesson.microbreakCount > 0 ? ` (${lesson.microbreakCount} games)` : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {selectedLesson && (
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            {selectedLesson.microbreakCount > 0 ? (
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400 dark:text-slate-500" />
            )}
            <span>
              {selectedLesson.microbreakCount === 0 
                ? 'No games' 
                : `${selectedLesson.microbreakCount} game${selectedLesson.microbreakCount > 1 ? 's' : ''}`
              }
            </span>
          </div>
          <div className="text-gray-400 dark:text-slate-500">|</div>
          <span>{selectedLesson.vocabTermCount} vocab terms</span>
          <div className="text-gray-400 dark:text-slate-500">|</div>
          <span>{selectedLesson.totalBlocks} blocks</span>
        </div>
      )}
    </div>
  );
}
