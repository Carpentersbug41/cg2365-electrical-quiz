/**
 * Guided Practice Block: Step-based learner entry with scaffolding
 */

'use client';

import { useState } from 'react';
import { BlockProps } from './types';
import { GuidedPracticeBlockContent } from '@/data/lessons/types';
import { MarkingResponse } from '@/lib/marking/types';
import BlockTTSButton from '../tts/BlockTTSButton';

export default function GuidedPracticeBlock({ block }: BlockProps) {
  const MIN_REFLECTION_CHARS = 20;
  const content = block.content as GuidedPracticeBlockContent;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(content.steps.length).fill(''));
  const [feedback, setFeedback] = useState<(MarkingResponse | null)[]>(new Array(content.steps.length).fill(null));
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState<number[]>(new Array(content.steps.length).fill(0));
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>(new Array(content.steps.length).fill(false));
  const [revealReflections, setRevealReflections] = useState<string[]>(new Array(content.steps.length).fill(''));
  const [verificationRequired, setVerificationRequired] = useState<boolean[]>(new Array(content.steps.length).fill(false));
  const [verificationPassed, setVerificationPassed] = useState<boolean[]>(new Array(content.steps.length).fill(false));
  const [verificationLoading, setVerificationLoading] = useState<boolean[]>(new Array(content.steps.length).fill(false));
  const [verificationFeedback, setVerificationFeedback] = useState<(MarkingResponse | null)[]>(
    new Array(content.steps.length).fill(null)
  );
  const [verificationPrompts, setVerificationPrompts] = useState<string[]>(new Array(content.steps.length).fill(''));

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

  const handleAnswerChange = (stepIndex: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[stepIndex] = value;
      return next;
    });
  };

  const resolveExpectedAnswer = (expectedAnswer: string | string[]) => {
    const raw = Array.isArray(expectedAnswer) ? (expectedAnswer[0] ?? '') : expectedAnswer;
    const trimmed = String(raw ?? '').trim();
    return trimmed || 'Explain the main idea and include one concrete example.';
  };

  const buildVerificationPrompt = (prompt: string) => {
    const stem = prompt.replace(/\?+$/, '').trim();
    return `Transfer check: answer "${stem}" in a different context, then explain why your answer still works.`;
  };

  const checkAnswer = async (stepIndex: number) => {
    if (verificationRequired[stepIndex] && !verificationPassed[stepIndex]) return;
    setLoading(true);
    
    try {
      const step = content.steps[stepIndex];

      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: step.prompt,
          questionText: step.prompt,
          userAnswer: answers[stepIndex],
          expectedAnswer: Array.isArray(step.expectedAnswer) 
            ? step.expectedAnswer[0] 
            : step.expectedAnswer,
          answerType: 'conceptual',
          cognitiveLevel: 'recall',
        }),
      });

      const result: MarkingResponse = await response.json();
      
      const newFeedback = [...feedback];
      newFeedback[stepIndex] = result;
      setFeedback(newFeedback);

      // Play soft ding for correct answers
      if (result.isCorrect) {
        playSoftDing();
      }

      // Increment attempt count if answer is incorrect
      if (!result.isCorrect) {
        const newAttemptCount = [...attemptCount];
        newAttemptCount[stepIndex] = (newAttemptCount[stepIndex] || 0) + 1;
        setAttemptCount(newAttemptCount);
      }

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

  const handleShowAnswer = (stepIndex: number) => {
    const reflection = (revealReflections[stepIndex] || '').trim();
    const step = content.steps[stepIndex];
    if (!step || reflection.length < MIN_REFLECTION_CHARS) {
      return;
    }

    setRevealedAnswers((prev) => {
      const next = [...prev];
      next[stepIndex] = true;
      return next;
    });
    setVerificationRequired((prev) => {
      const next = [...prev];
      next[stepIndex] = true;
      return next;
    });
    setVerificationPassed((prev) => {
      const next = [...prev];
      next[stepIndex] = false;
      return next;
    });
    setVerificationFeedback((prev) => {
      const next = [...prev];
      next[stepIndex] = null;
      return next;
    });
    setVerificationPrompts((prev) => {
      const next = [...prev];
      next[stepIndex] = buildVerificationPrompt(step.prompt);
      return next;
    });
    setAnswers((prev) => {
      const next = [...prev];
      next[stepIndex] = '';
      return next;
    });
  };

  const handleVerificationSubmit = async (stepIndex: number) => {
    const step = content.steps[stepIndex];
    if (!step) return;

    setVerificationLoading((prev) => {
      const next = [...prev];
      next[stepIndex] = true;
      return next;
    });

    try {
      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: `${block.id}-guided-verify-${stepIndex}`,
          questionText: verificationPrompts[stepIndex] || buildVerificationPrompt(step.prompt),
          userAnswer: answers[stepIndex],
          expectedAnswer: resolveExpectedAnswer(step.expectedAnswer),
          answerType: 'conceptual',
          cognitiveLevel: 'connection',
        }),
      });

      const result: MarkingResponse = await response.json();
      setVerificationFeedback((prev) => {
        const next = [...prev];
        next[stepIndex] = result;
        return next;
      });

      if (result.isCorrect) {
        playSoftDing();
        setVerificationPassed((prev) => {
          const next = [...prev];
          next[stepIndex] = true;
          return next;
        });
        setVerificationRequired((prev) => {
          const next = [...prev];
          next[stepIndex] = false;
          return next;
        });
        if (stepIndex === currentStep && stepIndex < content.steps.length - 1) {
          setTimeout(() => {
            setCurrentStep(stepIndex + 1);
            setShowHint(false);
          }, 900);
        }
      }
    } catch {
      setVerificationFeedback((prev) => {
        const next = [...prev];
        next[stepIndex] = {
          isCorrect: false,
          score: 0,
          userAnswer: answers[stepIndex],
          expectedAnswer: [],
          feedback: 'Verification check failed. Please try again.',
          suggestedNextAction: 'retry',
        } as MarkingResponse;
        return next;
      });
    } finally {
      setVerificationLoading((prev) => {
        const next = [...prev];
        next[stepIndex] = false;
        return next;
      });
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
                <div className="mb-3 flex items-start gap-2">
                  <p className="flex-1 text-gray-700 font-medium">{step.prompt}</p>
                  <BlockTTSButton
                    blockId={`${block.id}-guided-step-${stepIndex}`}
                    text={step.prompt}
                    label={`Read guided question ${stepIndex + 1} aloud`}
                    iconOnly
                  />
                </div>
                
                {stepIndex <= currentStep && (
                  <>
                    {(() => {
                      const verificationPendingForStep = verificationRequired[stepIndex] && !verificationPassed[stepIndex];
                      return (
                        <>
                    <input
                      type="text"
                      value={answers[stepIndex]}
                      onChange={(e) => handleAnswerChange(stepIndex, e.target.value)}
                      disabled={feedback[stepIndex]?.isCorrect || loading || verificationPendingForStep}
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
                          {feedback[stepIndex]!.feedback}
                        </p>
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
                          disabled={!answers[stepIndex].trim() || loading || verificationPendingForStep}
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
                        
                        {/* Show Answer Button - appears after 2 failed attempts */}
                        {attemptCount[stepIndex] >= 2 && !revealedAnswers[stepIndex] && (
                          <div className="w-full">
                            <label className="block text-xs font-semibold text-amber-900 mb-1">
                              Before revealing, explain what you think you are missing.
                            </label>
                            <textarea
                              value={revealReflections[stepIndex] || ''}
                              onChange={(e) =>
                                setRevealReflections((prev) => {
                                  const next = [...prev];
                                  next[stepIndex] = e.target.value;
                                  return next;
                                })
                              }
                              rows={2}
                              className="w-full mb-2 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-gray-900 focus:border-amber-500 focus:outline-none"
                              placeholder="Write a short reflection first..."
                            />
                            <p className="text-xs text-amber-800 mb-2">
                              Minimum {MIN_REFLECTION_CHARS} characters.
                            </p>
                            <button
                              onClick={() => handleShowAnswer(stepIndex)}
                              disabled={(revealReflections[stepIndex] || '').trim().length < MIN_REFLECTION_CHARS}
                              className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm border-2 border-amber-600"
                            >
                              👁️ Show Answer
                            </button>
                          </div>
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
                    
                    {/* Display Revealed Answer */}
                    {revealedAnswers[stepIndex] && stepIndex === currentStep && (
                      <div className="mt-3 bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                        <p className="text-sm font-semibold text-amber-900 mb-2">Expected Answer:</p>
                        <p className="text-gray-800">
                          {Array.isArray(step.expectedAnswer) 
                            ? step.expectedAnswer[0] 
                            : step.expectedAnswer}
                        </p>
                        <p className="text-xs text-amber-700 mt-2">
                          Mandatory step: complete the verification check correctly to continue.
                        </p>
                      </div>
                    )}
                    {revealedAnswers[stepIndex] &&
                      verificationRequired[stepIndex] &&
                      !verificationPassed[stepIndex] && (
                      <div className="mt-3 bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                        <p className="text-sm font-semibold text-blue-900 mb-2">
                          Mandatory Verification Check
                        </p>
                        <p className="text-xs text-blue-800 mb-3">
                          Re-answer from memory using this transfer check:
                        </p>
                        <p className="text-sm text-blue-900 mb-3">
                          {verificationPrompts[stepIndex] || buildVerificationPrompt(step.prompt)}
                        </p>
                        <button
                          onClick={() => handleVerificationSubmit(stepIndex)}
                          disabled={!answers[stepIndex]?.trim() || verificationLoading[stepIndex]}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          {verificationLoading[stepIndex] ? 'Checking...' : 'Complete Verification Check'}
                        </button>
                        {verificationFeedback[stepIndex] && (
                          <p className={`mt-2 text-sm ${verificationFeedback[stepIndex]!.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {verificationFeedback[stepIndex]!.feedback}
                          </p>
                        )}
                      </div>
                    )}
                    {verificationPassed[stepIndex] && (
                      <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-300 text-sm text-green-800">
                        Verification passed. You can continue.
                      </div>
                    )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {feedback.every(f => f?.isCorrect) && feedback.every(f => f !== null) && (
        <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-300">
          <p className="text-green-900 font-medium text-center">
            All steps completed.
          </p>
        </div>
      )}
    </div>
  );
}
