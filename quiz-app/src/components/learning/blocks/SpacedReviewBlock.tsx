/**
 * Spaced Review Block: Review questions from prerequisites
 */

'use client';

import { useState } from 'react';
import { BlockProps } from './types';
import { SpacedReviewBlockContent } from '@/data/lessons/types';
import { MarkingResponse } from '@/lib/marking/types';

export default function SpacedReviewBlock({ block }: BlockProps) {
  const content = block.content as SpacedReviewBlockContent;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, MarkingResponse | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (questionId: string, questionText: string, expectedAnswer: string | string[]) => {
    setLoading({ ...loading, [questionId]: true });
    
    try {
      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          questionText,
          userAnswer: answers[questionId],
          expectedAnswer: Array.isArray(expectedAnswer) ? expectedAnswer[0] : expectedAnswer,
          answerType: 'conceptual',
          cognitiveLevel: 'recall',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark answer');
      }

      const result: MarkingResponse = await response.json();
      
      setFeedback({ ...feedback, [questionId]: result });
      setSubmitted({ ...submitted, [questionId]: true });
    } catch (error) {
      console.error('Error marking answer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error marking answer';
      
      setFeedback({ 
        ...feedback, 
        [questionId]: {
          isCorrect: false,
          score: 0,
          userAnswer: answers[questionId],
          expectedAnswer: [],
          feedback: errorMessage.includes('quota') || errorMessage.includes('429')
            ? '⚠️ API quota exceeded. Please try again later or check your API key billing.'
            : `Error: ${errorMessage}`,
          suggestedNextAction: 'retry',
        } as MarkingResponse
      });
      setSubmitted({ ...submitted, [questionId]: true });
    } finally {
      setLoading({ ...loading, [questionId]: false });
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-amber-200" id={block.id}>
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-amber-600">🔄</span>
        {content.title}
        <span className="ml-auto px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full border border-amber-300">
          Review
        </span>
      </h2>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          These questions review prerequisite knowledge. Try to answer them from memory to strengthen your understanding.
        </p>
        
        {content.questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-xl p-4 border-2 border-amber-200">
            <div className="flex items-start gap-3 mb-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <p className="flex-1 text-gray-800 font-medium">{question.questionText}</p>
            </div>

            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={submitted[question.id]}
              placeholder="Type your answer..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 mb-3 disabled:bg-gray-100 dark:disabled:bg-slate-700 resize-y"
            />

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
                onClick={() => handleSubmit(question.id, question.questionText, question.expectedAnswer)}
                disabled={!answers[question.id]?.trim() || loading[question.id]}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {loading[question.id] ? 'Checking...' : 'Check Answer'}
              </button>
            ) : feedback[question.id] ? (
              <div className={`rounded-lg p-4 border-2 ${
                feedback[question.id]!.isCorrect
                  ? 'bg-green-50 border-green-300'
                  : 'bg-orange-50 border-orange-300'
              }`}>
                <p className={`font-semibold mb-2 ${
                  feedback[question.id]!.isCorrect ? 'text-green-800' : 'text-orange-800'
                }`}>
                  {feedback[question.id]!.feedback}
                </p>
                
                {feedback[question.id]!.detailedFeedback && (
                  <div className="mt-3 space-y-2 text-sm">
                    {feedback[question.id]!.detailedFeedback!.whatWasWrong && (
                      <div>
                        <strong className="text-orange-800">What to review:</strong>
                        <p className="text-orange-700 mt-1">{feedback[question.id]!.detailedFeedback!.whatWasWrong}</p>
                      </div>
                    )}
                    {feedback[question.id]!.detailedFeedback!.howToFix && (
                      <div>
                        <strong className="text-blue-800">Hint:</strong>
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
                    className="mt-3 px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {content.notes && (
        <div className="mt-4 bg-amber-100 rounded-lg p-4 border border-amber-300">
          <p className="text-sm text-amber-900 flex items-start gap-2">
            <span className="text-amber-600 flex-shrink-0">ℹ️</span>
            <span>{content.notes}</span>
          </p>
        </div>
      )}
    </div>
  );
}


