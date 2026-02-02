'use client';

/**
 * Layout A: Split-Vis (Diagram Persistent)
 * For spatial/topology learning where diagram must remain visible
 * Desktop: 50/50 split (sticky diagram left, scrollable content right)
 * Mobile: sticky diagram top, content below
 */

import { useState, useEffect } from 'react';
import { LayoutProps } from './types';
import { Block, DiagramBlockContent } from '@/data/lessons/types';

// Placeholder block renderers - will be replaced with actual components in Phase 4
import OutcomesBlock from '../blocks/OutcomesBlock';
import VocabBlock from '../blocks/VocabBlock';
import ExplanationBlock from '../blocks/ExplanationBlock';
import WorkedExampleBlock from '../blocks/WorkedExampleBlock';
import GuidedPracticeBlock from '../blocks/GuidedPracticeBlock';
import PracticeBlock from '../blocks/PracticeBlock';
import SpacedReviewBlock from '../blocks/SpacedReviewBlock';
import DiagramStage from '../diagram/DiagramStage';
import TutorPanel from '../tutor/TutorPanel';
import MasteryGate from '../MasteryGate';
import MicrobreakBlock from '../microbreaks/MicrobreakBlock';
import { getLessonProgress, getQuizProgress } from '@/lib/progress/progressService';
import { LessonProgress, QuizProgress } from '@/lib/progress/types';

export default function LayoutA({ lesson }: LayoutProps) {
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);
  const [diagramExpanded, setDiagramExpanded] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null);
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);

  // Load progress on mount
  useEffect(() => {
    const progress = getLessonProgress(lesson.id);
    setLessonProgress(progress);

    const quiz = getQuizProgress(`${lesson.id}-quiz`);
    setQuizProgress(quiz);
  }, [lesson.id]);

  // Extract diagram block
  const diagramBlock = lesson.blocks.find(b => b.type === 'diagram');
  const contentBlocks = lesson.blocks.filter(b => b.type !== 'diagram').sort((a, b) => a.order - b.order);

  const handleDiagramAction = (action: 'highlight' | 'focus' | 'clear' | 'jumpToTimestamp', elementIds?: string[]) => {
    if (action === 'clear') {
      setHighlightedElements([]);
    } else if (action === 'jumpToTimestamp') {
      // Handled by DiagramStage internally
      return;
    } else if (elementIds) {
      setHighlightedElements(elementIds);
    }
  };

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
      case 'microbreak':
        return <MicrobreakBlock key={key} block={block} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            {lesson.unit}
          </span>
          <span className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 rounded-full hidden md:inline">
            Split-Vis Layout
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
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

      {/* Main Layout - Conditional based on diagram existence */}
      {diagramBlock ? (
        // Original Split Layout: Diagram + Tutor on LEFT, Content on RIGHT
        <div className="lg:grid lg:grid-cols-2 lg:h-[calc(100vh-3.5rem)]">
          {/* LEFT: Diagram Stage + Tutor (Desktop) / TOP: Diagram (Mobile) */}
          <section 
            className={`lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:border-r border-gray-200 dark:border-slate-700 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 lg:overflow-y-auto ${
              diagramExpanded ? 'fixed inset-0 z-50 lg:relative' : 'lg:relative'
            }`}
            aria-label="Diagram stage"
          >
            <div className="p-4 space-y-4">
              <DiagramStage
                block={diagramBlock}
                highlightedElements={highlightedElements}
                onAction={handleDiagramAction}
                isExpanded={diagramExpanded}
                onToggleExpand={() => setDiagramExpanded(!diagramExpanded)}
              />
              
              {/* Tutor Panel - Under diagram on desktop */}
              <div className="hidden lg:block">
                <TutorPanel 
                  lessonId={lesson.id}
                  lessonTitle={lesson.title}
                  blocks={lesson.blocks}
                  mode="teach"
                />
              </div>
            </div>
          </section>

          {/* RIGHT: Content Stream */}
          <section 
            className="p-4 lg:p-6 lg:overflow-y-auto"
            aria-label="Lesson content"
          >
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              {/* Lesson Header */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {lesson.title}
                </h1>
                <p className="text-gray-600 dark:text-slate-300 text-lg mb-4">
                  {lesson.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {lesson.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-200 dark:border-indigo-800"
                    >
                      {outcome.split(':')[0]}
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
              {contentBlocks.map(block => (
                <div key={block.id}>
                  {renderBlock(block)}
                </div>
              ))}

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

              {/* Mobile Tutor */}
              <div className="lg:hidden mt-4">
                <TutorPanel 
                  lessonId={lesson.id}
                  lessonTitle={lesson.title}
                  blocks={lesson.blocks}
                  mode="teach"
                />
              </div>
            </div>
          </section>
        </div>
      ) : (
        // New Layout: Content on LEFT, Tutor Sidebar on RIGHT
        <div className="max-w-7xl mx-auto flex gap-6 px-4">
          {/* Main Content */}
          <section 
            className="flex-1 py-4 lg:py-6"
            aria-label="Lesson content"
          >
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              {/* Lesson Header */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {lesson.title}
                </h1>
                <p className="text-gray-600 dark:text-slate-300 text-lg mb-4">
                  {lesson.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {lesson.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-200 dark:border-indigo-800"
                    >
                      {outcome.split(':')[0]}
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
          </section>

          {/* RIGHT: Tutor Panel Sidebar */}
          <aside className="hidden lg:block lg:w-96 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
            <TutorPanel 
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              blocks={lesson.blocks}
              mode="teach"
            />
          </aside>
        </div>
      )}
    </div>
  );
}


