'use client';

/**
 * Lesson-Specific Quiz Page
 * Displays quiz questions filtered by lesson learning outcomes
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Quiz from '@/components/Quiz';
import { filterQuestionsByLesson } from '@/lib/questions/questionFilter';
import { getLessonById } from '@/data/lessons/lessonIndex';
import { Question } from '@/data/questions';
import { getCumulativeQuestions, getCumulativeQuizMetadata } from '@/lib/questions/cumulativeQuestions';

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default function LessonQuizPage({ params }: PageProps) {
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lessonQuestions, setLessonQuestions] = useState<Question[]>([]);
  const [lesson, setLesson] = useState<{ id: string; title: string; unit: string } | null>(null);
  const [isCumulative, setIsCumulative] = useState(false);
  const [cumulativeMetadata, setCumulativeMetadata] = useState<{
    currentLesson: { id: string; title: string; order: number; unitNumber: string };
    includedLessons: unknown[];
    previousLessons: unknown[];
    isFirstInUnit: boolean;
    totalLessonsIncluded: number;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRetest = searchParams.get('retest') === 'true';
  const cumulativeMode = searchParams.get('mode') === 'cumulative';

  useEffect(() => {
    params.then(({ lessonId: id }) => {
      setLessonId(id);
      setIsCumulative(cumulativeMode);
      
      // Get lesson metadata
      const lessonData = getLessonById(id);
      setLesson(lessonData || null);
      
      // Get questions based on mode
      let questions: Question[];
      if (cumulativeMode) {
        questions = getCumulativeQuestions(id);
        const metadata = getCumulativeQuizMetadata(id);
        setCumulativeMetadata(metadata);
      } else {
        questions = filterQuestionsByLesson(id);
      }
      
      setLessonQuestions(questions);
    });
  }, [params, cumulativeMode]);

  if (!lessonId || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 dark:text-slate-300">Loading lesson quiz...</p>
        </div>
      </div>
    );
  }

  if (lessonQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📝</div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                No Quiz Available
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-300 mb-6">
                There are no quiz questions available for this lesson yet.
              </p>
              <p className="text-gray-500 dark:text-slate-400 mb-8">
                <strong>Lesson:</strong> {lesson.title}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/learn/${lessonId}`}
                className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-md text-center"
              >
                Back to Lesson
              </Link>
              <Link
                href="/quiz"
                className="px-8 py-3 bg-gray-600 dark:bg-slate-600 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-slate-700 transition-colors shadow-md text-center"
              >
                Browse All Quizzes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Custom Header for Lesson Context */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/learn/${lessonId}`}
                className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <span>←</span>
                <span className="hidden sm:inline">Back to Lesson</span>
              </Link>
              <span className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                {lesson.unit}
              </span>
              {isCumulative && (
                <span className="px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 rounded-full border border-orange-300 dark:border-orange-700 flex items-center gap-1">
                  <span>🔄</span> Cumulative
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
              <span className="hidden md:inline">
                {isCumulative && cumulativeMetadata && !cumulativeMetadata.isFirstInUnit
                  ? `${lesson.title} + ${cumulativeMetadata.previousLessons.length} previous`
                  : lesson.title}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-xs font-medium">
                {lessonQuestions.length} questions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Component with Lesson-Filtered Questions */}
      <Quiz
        questions={lessonQuestions}
        section={lesson.title}
        onBack={() => router.push(`/learn/${lessonId}`)}
        lessonId={lessonId}
        isRetest={isRetest}
      />
    </div>
  );
}

