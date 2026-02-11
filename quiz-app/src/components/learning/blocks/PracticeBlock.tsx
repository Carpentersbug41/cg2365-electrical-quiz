/**
 * Practice Block: Independent practice questions
 */

'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BlockProps } from './types';
import { PracticeBlockContent } from '@/data/lessons/types';
import { MarkingResponse } from '@/lib/marking/types';

interface ErrorState {
  message: string;
  errorCode?: string;
  canRetry: boolean;
}

export default function PracticeBlock({ block }: BlockProps) {
  const content = block.content as PracticeBlockContent;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, MarkingResponse | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, ErrorState | null>>({});
  const [attemptCount, setAttemptCount] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Soft ding sound for correct answers
  const playSoftDing = () => {
    if (typeof window === 'undefined') return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.debug('Web Audio API not supported');
        return;
      }
      
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 880; // Soft A5 note
      
      // More audible but still subtle
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // Clean up after sound finishes
      setTimeout(() => {
        audioContext.close();
      }, 300);
    } catch (error) {
      console.debug('Audio playback failed:', error);
    }
  };

  const isSequential = content.sequential === true;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (questionId: string, questionIndex: number) => {
    setLoading({ ...loading, [questionId]: true });
    setErrors({ ...errors, [questionId]: null });
    
    // Find the question to get its properties
    const question = content.questions.find(q => q.id === questionId);
    
    if (!question) {
      console.error('Question not found:', questionId);
      return;
    }
    
    try {
      // All questions use LLM marking
      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          questionText: question.questionText,
          userAnswer: answers[questionId],
          expectedAnswer: Array.isArray(question.expectedAnswer) 
            ? question.expectedAnswer[0] 
            : question.expectedAnswer,
          answerType: question.answerType || 'short-text',
          cognitiveLevel: question.cognitiveLevel || 'recall',
          keyPoints: question.keyPoints,
        }),
      });

      const result = await response.json();
      
      // Check if service unavailable
      if (result.serviceUnavailable) {
        setErrors({
          ...errors,
          [questionId]: {
            message: result.feedback,
            errorCode: result.metadata?.errorCode,
            canRetry: result.canRetry !== false,
          }
        });
        return;
      }
      
      setFeedback({ ...feedback, [questionId]: result });
      setSubmitted({ ...submitted, [questionId]: true });
      
      // Play soft ding for correct answers
      if (result.isCorrect) {
        playSoftDing();
      }
      
      // Increment attempt count if answer is incorrect
      if (!result.isCorrect) {
        setAttemptCount({ ...attemptCount, [questionId]: (attemptCount[questionId] || 0) + 1 });
      }
      
      // Mark this question as attempted (for sequential unlocking)
      setAttemptedQuestions(prev => new Set(prev).add(questionIndex));
    } catch (error) {
      console.error('Error marking answer:', error);
      setErrors({
        ...errors,
        [questionId]: {
          message: 'Unable to connect to marking service. Please check your internet connection and try again.',
          canRetry: true,
        }
      });
    } finally {
      setLoading({ ...loading, [questionId]: false });
    }
  };

  const handleShowAnswer = (questionId: string, questionIndex: number) => {
    setRevealedAnswers({ ...revealedAnswers, [questionId]: true });
    // Mark as attempted for sequential unlocking
    setAttemptedQuestions(prev => new Set(prev).add(questionIndex));
  };

  // Check if a question is accessible (for sequential mode)
  const isQuestionAccessible = (index: number) => {
    if (!isSequential) return true;
    // First question is always accessible, others unlock after previous is attempted
    return index === 0 || attemptedQuestions.has(index - 1);
  };

  // Get cognitive level label
  const getCognitiveLevelLabel = (level?: string) => {
    switch (level) {
      case 'recall': return 'Level 1: Recall';
      case 'connection': return 'Level 2: Connection';
      case 'synthesis': return 'Level 3: Synthesis';
      default: return null;
    }
  };

  // Get textarea config based on answer type
  const getTextareaConfig = (question: PracticeBlockContent['questions'][number]) => {
    if (question.answerType === 'long-text') {
      return {
        rows: 6,
        placeholder: "Write your answer in 3-4 sentences, addressing each required point..."
      };
    }
    if (question.cognitiveLevel === 'synthesis') {
      return {
        rows: 5,
        placeholder: "Explain your thinking in 2-3 sentences..."
      };
    }
    return {
      rows: 4,
      placeholder: "Type your answer... (explain your thinking)"
    };
  };

  return (
    <div 
      className="rounded-2xl shadow-lg p-6 border-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200" 
      id={block.id}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-purple-600">🎯</span>
        {content.title}
        <span className="ml-auto px-3 py-1 text-xs font-medium rounded-full border text-purple-700 bg-purple-100 border-purple-300">
          You Do (Independent)
        </span>
      </h2>

      {isSequential && (
        <div className="mb-4 text-sm text-purple-800 bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="flex items-center gap-2">
            <span>🔒</span>
            <span>Questions unlock as you complete each one in order</span>
          </p>
        </div>
      )}

      <div className="space-y-6">
        {content.questions.map((question, index) => {
          const accessible = isQuestionAccessible(index);
          const cognitiveLabel = getCognitiveLevelLabel(question.cognitiveLevel);
          
          return (
            <div 
              key={question.id} 
              className={`bg-white rounded-xl p-5 border-2 ${
                accessible ? 'border-purple-200' : 'border-gray-200 opacity-50'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  accessible ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  {accessible ? (index + 1) : '🔒'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isSequential && (
                      <span className="text-xs text-gray-500">
                        Question {index + 1} of {content.questions.length}
                      </span>
                    )}
                    {cognitiveLabel && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        {cognitiveLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 font-medium">{question.questionText}</p>
                </div>
              </div>

              {!accessible ? (
                <div className="text-center text-gray-500 text-sm py-4">
                  Complete the previous question to unlock this one
                </div>
              ) : (
                <>
                {(() => {
                  const textareaConfig = getTextareaConfig(question);
                  return (
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={submitted[question.id]}
                      placeholder={textareaConfig.placeholder}
                      rows={textareaConfig.rows}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 mb-3 disabled:bg-gray-100 dark:disabled:bg-slate-700 resize-y"
                    />
                  );
                })()}

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

                {/* Show Answer Button - appears after 2 failed attempts */}
                {!submitted[question.id] && attemptCount[question.id] >= 2 && !revealedAnswers[question.id] && (
                  <div className="mb-3">
                    <button
                      onClick={() => handleShowAnswer(question.id, index)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm border-2 border-amber-600"
                    >
                      👁️ Show Answer
                    </button>
                    <p className="text-xs text-amber-700 mt-1">
                      Having trouble? You can view the expected answer.
                    </p>
                  </div>
                )}

                {/* Display Revealed Answer */}
                {revealedAnswers[question.id] && (
                  <div className="mb-3 bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                    <p className="text-sm font-semibold text-amber-900 mb-2">Expected Answer:</p>
                    <p className="text-gray-800 font-medium">
                      {Array.isArray(question.expectedAnswer) 
                        ? question.expectedAnswer[0] 
                        : question.expectedAnswer}
                    </p>
                    <p className="text-xs text-amber-700 mt-2">
                      💡 You can still submit your answer to practice and get feedback.
                    </p>
                  </div>
                )}

                {errors[question.id] && (
                  <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-900 mb-2">
                          Service Temporarily Unavailable
                        </h3>
                        <p className="text-sm text-yellow-800 whitespace-pre-line mb-3">
                          {errors[question.id]!.message}
                        </p>
                        {errors[question.id]!.errorCode && (
                          <p className="text-xs text-yellow-700 font-mono mb-3 bg-yellow-100 px-2 py-1 rounded inline-block">
                            {errors[question.id]!.errorCode}
                          </p>
                        )}
                        {errors[question.id]!.canRetry && (
                          <button
                            onClick={() => {
                              setErrors({ ...errors, [question.id]: null });
                              handleSubmit(question.id, index);
                            }}
                            className="text-sm px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                          >
                            Try Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!submitted[question.id] ? (
                  <button
                    onClick={() => handleSubmit(question.id, index)}
                    disabled={!answers[question.id] || loading[question.id]}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {loading[question.id] ? 'Checking...' : 'Submit Answer'}
                  </button>
                ) : feedback[question.id] ? (
                  <div className={`rounded-lg p-4 border-2 ${
                    feedback[question.id]!.isCorrect
                      ? 'bg-green-50 border-green-300'
                      : feedback[question.id]!.score > 0 && feedback[question.id]!.score < 1
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <p className={`font-medium mb-2 ${
                      feedback[question.id]!.isCorrect 
                        ? 'text-green-800' 
                        : feedback[question.id]!.score > 0 && feedback[question.id]!.score < 1
                        ? 'text-amber-800'
                        : 'text-red-800'
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
              </>
            )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl p-4 border bg-purple-100 border-purple-200">
        <p className="text-sm flex items-start gap-2 text-purple-900">
          <span className="flex-shrink-0 text-purple-600">📝</span>
          <span>
            <strong>Tip:</strong> Try all questions before asking the tutor for help. Making mistakes is part of learning!
          </span>
        </p>
      </div>
    </div>
  );
}
