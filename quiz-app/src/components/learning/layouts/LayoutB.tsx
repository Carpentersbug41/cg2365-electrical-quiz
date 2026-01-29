'use client';

/**
 * Layout B: Linear Flow (Reading + Practice)
 * For definitions, formulas, non-spatial content
 * Single centered column with floating tutor button
 * Clean reading experience
 */

import { useState, useEffect } from 'react';
import { LayoutProps } from './types';
import { Block } from '@/data/lessons/types';

// Block renderers
import OutcomesBlock from '../blocks/OutcomesBlock';
import VocabBlock from '../blocks/VocabBlock';
import ExplanationBlock from '../blocks/ExplanationBlock';
import WorkedExampleBlock from '../blocks/WorkedExampleBlock';
import GuidedPracticeBlock from '../blocks/GuidedPracticeBlock';
import PracticeBlock from '../blocks/PracticeBlock';
import SpacedReviewBlock from '../blocks/SpacedReviewBlock';
import TutorPanel from '../tutor/TutorPanel';
import MasteryGate from '../MasteryGate';
import { getLessonProgress, getQuizProgress } from '@/lib/progress/progressService';
import { LessonProgress, QuizProgress } from '@/lib/progress/types';

export default function LayoutB({ lesson }: LayoutProps) {
  const [tutorOpen, setTutorOpen] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null);
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);

  // Load progress on mount
  useEffect(() => {
    const progress = getLessonProgress(lesson.id);
    setLessonProgress(progress);

    const quiz = getQuizProgress(`${lesson.id}-quiz`);
    setQuizProgress(quiz);
  }, [lesson.id]);

  const contentBlocks = lesson.blocks.sort((a, b) => a.order - b.order);

  const renderBlock = (block: Block) => {
    const key = block.id;
    
    switch (block.type) {
      case 'outcomes':
        return <OutcomesBlock key={key} block={block} />;
      case 'vocab':
        return <VocabBlock key={key} block={block} />;
      case 'explanation':
        return <ExplanationBlock key={key} block={block} />;
      case 'worked-example':
        return <WorkedExampleBlock key={key} block={block} />;
      case 'guided-practice':
        return <GuidedPracticeBlock key={key} block={block} />;
      case 'practice':
        return <PracticeBlock key={key} block={block} />;
      case 'spaced-review':
        return <SpacedReviewBlock key={key} block={block} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
            {lesson.unit}
          </span>
          <span className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 rounded-full hidden md:inline">
            Linear Flow
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            Review
          </button>
          <button 
            onClick={() => window.location.href = `/learn/${lesson.id}/quiz`}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg transition-colors shadow-sm"
          >
            Quiz
          </button>
          <button 
            onClick={() => window.location.href = `/learn/${lesson.id}/quiz?mode=cumulative`}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 rounded-lg transition-all shadow-sm flex items-center gap-1"
            title="Quiz with questions from this lesson and all previous lessons in this unit"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Cumulative</span>
          </button>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="max-w-7xl mx-auto flex gap-6 px-4 py-8">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          <div className="space-y-4 pb-20">
          {/* Lesson Hero */}
          <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-indigo-900/20 rounded-2xl shadow-lg p-6 md:p-8 border border-indigo-100 dark:border-indigo-800">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-3">
              {lesson.title}
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-lg mb-4">
              {lesson.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {['Remember', 'Understand', 'Apply'].map((level) => (
                <span 
                  key={level}
                  className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-200 dark:border-indigo-700"
                >
                  {level}
                </span>
              ))}
            </div>
          </div>

          {/* Mastery Gate */}
          {(quizProgress?.masteryPending || quizProgress?.masteryAchieved) && quizProgress && (
            <MasteryGate
              progress={quizProgress}
              lessonId={lesson.id}
              lessonTitle={lesson.title}
            />
          )}

          {/* Content Blocks */}
          {contentBlocks.map(block => renderBlock(block))}

          {/* Continue to Quiz CTA */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border-2 border-indigo-200 dark:border-indigo-700 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to test your knowledge?
            </h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Complete the quiz to reinforce what you&apos;ve learned
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.href = `/learn/${lesson.id}/quiz`}
                className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Continue to Quiz →
              </button>
              <button 
                onClick={() => window.location.href = `/learn/${lesson.id}/quiz?mode=cumulative`}
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Cumulative Quiz
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* RIGHT: Tutor Panel Sidebar - Always visible on desktop */}
        <aside className="hidden lg:block lg:w-96 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
          <TutorPanel 
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            blocks={lesson.blocks}
            mode="teach"
          />
        </aside>

        {/* Mobile: Floating Tutor Button */}
        <button
          onClick={() => setTutorOpen(!tutorOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Toggle tutor"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </button>

        {/* Mobile: Tutor Bottom Sheet */}
        {tutorOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm lg:hidden"
              onClick={() => setTutorOpen(false)}
            />
            
            {/* Sheet */}
            <div className="lg:hidden fixed left-0 right-0 bottom-0 h-[70vh] bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 rounded-t-2xl z-50 shadow-2xl overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Sheet Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Tutor</h3>
                  <button
                    onClick={() => setTutorOpen(false)}
                    className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Tutor Content */}
                <div className="flex-1 overflow-hidden">
                  <TutorPanel 
                    lessonId={lesson.id}
                    lessonTitle={lesson.title}
                    blocks={lesson.blocks}
                    mode="teach"
                    isBottomSheet
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


