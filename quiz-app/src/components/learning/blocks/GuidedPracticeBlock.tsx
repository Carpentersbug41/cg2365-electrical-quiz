/**
 * Guided Practice Block: Step-based learner entry with scaffolding
 */

'use client';

import { useState } from 'react';
import { BlockProps } from './types';
import { GuidedPracticeBlockContent } from '@/data/lessons/types';
import { MarkingResponse } from '@/lib/marking/types';

export default function GuidedPracticeBlock({ block }: BlockProps) {
  const content = block.content as GuidedPracticeBlockContent;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(content.steps.length).fill(''));
  const [feedback, setFeedback] = useState<(MarkingResponse | null)[]>(new Array(content.steps.length).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (stepIndex: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[stepIndex] = value;
    setAnswers(newAnswers);
  };

  const checkAnswer = async (stepIndex: number) => {
    setLoading(true);
    
    try {
      const step = content.steps[stepIndex];
      const expectedAnswers = Array.isArray(step.expectedAnswer) 
        ? step.expectedAnswer 
        : [step.expectedAnswer];

      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: step.prompt,
          userAnswer: answers[stepIndex],
          answerType: 'short-text',
          validationConfig: {
            strategy: 'ai-assisted',
            requiredKeywords: expectedAnswers,
          },
          context: {
            lessonId: block.id,
            attemptNumber: 1,
          },
        }),
      });

      const result: MarkingResponse = await response.json();
      
      const newFeedback = [...feedback];
      newFeedback[stepIndex] = result;
      setFeedback(newFeedback);

      if (result.isCorrect && stepIndex < content.steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(stepIndex + 1);
          setShowHint(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error marking answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200" id={block.id}>
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-blue-600">🤝</span>
        {content.title}
        <span className="ml-auto px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full border border-blue-300">
          We Do (Guided)
        </span>
      </h2>
      
      <div className="bg-white rounded-xl p-4 mb-6 border border-blue-200">
        <p className="text-sm font-semibold text-gray-600 mb-2">Problem:</p>
        <p className="text-gray-800 font-medium">{content.problem}</p>
      </div>

      <div className="space-y-4">
        {content.steps.map((step, stepIndex) => (
          <div 
            key={stepIndex}
            className={`bg-white rounded-xl p-5 border-2 transition-all ${
              stepIndex === currentStep 
                ? 'border-blue-400 shadow-md' 
                : stepIndex < currentStep 
                ? 'border-green-300' 
                : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                feedback[stepIndex]?.isCorrect
                  ? 'bg-green-500 text-white' 
                  : stepIndex === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {feedback[stepIndex]?.isCorrect ? '✓' : step.stepNumber}
              </div>
              
              <div className="flex-1">
                <p className="text-gray-700 mb-3 font-medium">{step.prompt}</p>
                
                {stepIndex <= currentStep && (
                  <>
                    <input
                      type="text"
                      value={answers[stepIndex]}
                      onChange={(e) => handleAnswerChange(stepIndex, e.target.value)}
                      disabled={feedback[stepIndex]?.isCorrect || loading}
                      placeholder="Type your answer..."
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 ${
                        feedback[stepIndex]?.isCorrect
                          ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/30'
                          : feedback[stepIndex] && !feedback[stepIndex]?.isCorrect
                          ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
                          : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    />
                    
                    {feedback[stepIndex]?.isCorrect && (
                      <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-300">
                        <p className="text-sm text-green-800 font-medium">
                          ✓ {feedback[stepIndex]!.feedback}
                        </p>
                        <p className="text-xs text-green-700 mt-1">Moving to next step...</p>
                      </div>
                    )}
                    
                    {feedback[stepIndex] && !feedback[stepIndex]?.isCorrect && (
                      <div className="mt-3 bg-red-50 rounded-lg p-3 border border-red-300">
                        <p className="text-sm text-red-800 font-medium mb-2">
                          {feedback[stepIndex]!.feedback}
                        </p>
                        {feedback[stepIndex]!.detailedFeedback?.howToFix && (
                          <p className="text-xs text-red-700">
                            💡 {feedback[stepIndex]!.detailedFeedback!.howToFix}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {stepIndex === currentStep && !feedback[stepIndex]?.isCorrect && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => checkAnswer(stepIndex)}
                          disabled={!answers[stepIndex].trim() || loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          {loading ? 'Checking...' : 'Check Answer'}
                        </button>
                        
                        {step.hint && (
                          <button
                            onClick={() => setShowHint(!showHint)}
                            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition-colors text-sm border border-amber-300"
                          >
                            {showHint ? 'Hide' : 'Show'} Hint
                          </button>
                        )}
                      </div>
                    )}
                    
                    {showHint && step.hint && stepIndex === currentStep && (
                      <div className="mt-3 bg-amber-50 rounded-lg p-3 border border-amber-200">
                        <p className="text-sm text-amber-900 flex items-start gap-2">
                          <span className="text-amber-600 flex-shrink-0">💡</span>
                          <span>{step.hint}</span>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedback.every(f => f?.isCorrect) && feedback.every(f => f !== null) && (
        <div className="mt-6 bg-green-100 rounded-xl p-4 border-2 border-green-300">
          <p className="text-green-900 font-semibold text-center flex items-center justify-center gap-2">
            <span className="text-2xl">🎉</span>
            Great job! You&apos;ve completed all steps correctly.
          </p>
        </div>
      )}
    </div>
  );
}

