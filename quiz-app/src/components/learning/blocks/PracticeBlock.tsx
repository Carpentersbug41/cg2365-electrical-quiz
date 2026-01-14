/**
 * Practice Block: Independent practice questions
 */

'use client';

import { useState } from 'react';
import { BlockProps } from './types';
import { PracticeBlockContent } from '@/data/lessons/types';
import { MarkingResponse } from '@/lib/marking/types';

export default function PracticeBlock({ block }: BlockProps) {
  const content = block.content as PracticeBlockContent;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, MarkingResponse | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (questionId: string) => {
    setLoading({ ...loading, [questionId]: true });
    
    // Find the question to get its answerType
    const question = content.questions.find(q => q.id === questionId);
    
    try {
      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          userAnswer: answers[questionId],
          answerType: question?.answerType || 'short-text',
          expectedAnswers: question?.expectedAnswer,
        }),
      });

      const result: MarkingResponse = await response.json();
      
      setFeedback({ ...feedback, [questionId]: result });
      setSubmitted({ ...submitted, [questionId]: true });
    } catch (error) {
      console.error('Error marking answer:', error);
      setFeedback({ 
        ...feedback, 
        [questionId]: {
          isCorrect: false,
          score: 0,
          userAnswer: answers[questionId],
          expectedAnswer: [],
          feedback: 'Error marking answer. Please try again.',
          suggestedNextAction: 'retry',
        } as MarkingResponse
      });
    } finally {
      setLoading({ ...loading, [questionId]: false });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200" id={block.id}>
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-purple-600">🎯</span>
        {content.title}
        <span className="ml-auto px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full border border-purple-300">
          You Do (Independent)
        </span>
      </h2>

      <div className="space-y-6">
        {content.questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-xl p-5 border-2 border-purple-200">
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <p className="flex-1 text-gray-800 font-medium">{question.questionText}</p>
            </div>

            {question.answerType === 'mcq' && question.options ? (
              <div className="space-y-2 mb-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIndex}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={submitted[question.id]}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                disabled={submitted[question.id]}
                placeholder={question.answerType === 'numeric' ? 'e.g., 12 Ω' : 'Type your answer...'}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 mb-3 disabled:bg-gray-100 dark:disabled:bg-slate-700"
              />
            )}

            {question.hint && !submitted[question.id] && (
              <details className="mb-3">
                <summary className="text-sm text-amber-700 cursor-pointer hover:text-amber-800 font-medium">
                  💡 Need a hint?
                </summary>
                <p className="mt-2 text-sm text-gray-600 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  {question.hint}
                </p>
              </details>
            )}

            {!submitted[question.id] ? (
              <button
                onClick={() => handleSubmit(question.id)}
                disabled={!answers[question.id] || loading[question.id]}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {loading[question.id] ? 'Checking...' : 'Submit Answer'}
              </button>
            ) : feedback[question.id] ? (
              <div className={`rounded-lg p-4 border-2 ${
                feedback[question.id]!.isCorrect
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}>
                <p className={`font-semibold mb-2 ${
                  feedback[question.id]!.isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {feedback[question.id]!.feedback}
                </p>
                
                {feedback[question.id]!.detailedFeedback && (
                  <div className="mt-3 space-y-2 text-sm">
                    {feedback[question.id]!.detailedFeedback!.whatWasWrong && (
                      <div>
                        <strong className="text-red-800">What was wrong:</strong>
                        <p className="text-red-700 mt-1">{feedback[question.id]!.detailedFeedback!.whatWasWrong}</p>
                      </div>
                    )}
                    {feedback[question.id]!.detailedFeedback!.whyItMatters && (
                      <div>
                        <strong className="text-orange-800">Why it matters:</strong>
                        <p className="text-orange-700 mt-1">{feedback[question.id]!.detailedFeedback!.whyItMatters}</p>
                      </div>
                    )}
                    {feedback[question.id]!.detailedFeedback!.howToFix && (
                      <div>
                        <strong className="text-blue-800">How to improve:</strong>
                        <p className="text-blue-700 mt-1">{feedback[question.id]!.detailedFeedback!.howToFix}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {!feedback[question.id]!.isCorrect && (
                  <button
                    onClick={() => {
                      setSubmitted({ ...submitted, [question.id]: false });
                      setFeedback({ ...feedback, [question.id]: null });
                    }}
                    className="mt-3 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-purple-100 rounded-xl p-4 border border-purple-200">
        <p className="text-sm text-purple-900 flex items-start gap-2">
          <span className="text-purple-600 flex-shrink-0">📝</span>
          <span>
            <strong>Tip:</strong> Try all questions before asking the tutor for help. Making mistakes is part of learning!
          </span>
        </p>
      </div>
    </div>
  );
}

