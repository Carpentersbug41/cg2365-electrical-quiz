/**
 * Spaced Review Block: Review questions from prerequisites
 */

'use client';

import { useState } from 'react';
import { BlockProps } from './types';
import { SpacedReviewBlockContent } from '@/data/lessons/types';
import { MarkingResponse } from '@/lib/marking/types';
import BlockTTSButton from '../tts/BlockTTSButton';
import { decodeHtmlEntities } from '@/lib/utils/htmlEntities';
import { logAttempt } from '@/lib/authProgress/clientTelemetry';
import {
  extractLessonIdFromBlockId,
  getAcMetaFromQuestion,
  normalizeQuestionStableId,
} from '@/lib/authProgress/questionIdentity';

export default function SpacedReviewBlock({ block, lessonId }: BlockProps) {
  const MIN_REFLECTION_CHARS = 20;
  const content = block.content as SpacedReviewBlockContent;
  const resolvedLessonId = lessonId ?? extractLessonIdFromBlockId(block.id);

  // Normalize questions - handle both object format and legacy string format
  const normalizedQuestions = content.questions.map((q, index) => {
    if (typeof q === 'string') {
      // Legacy format: plain string - decode HTML entities and provide placeholder answer
      return {
        id: `${block.id}-q${index}`,
        questionText: decodeHtmlEntities(q),
        expectedAnswer: 'This is a review question. Provide a thoughtful answer based on your prior knowledge.'
      };
    }
    
    // Modern format: structured object - check if questionText exists
    if (!q.questionText) {
      // DEFENSIVE: Handle missing questionText field (catches LLM typos like "attText")
      console.error(`Spaced review question missing questionText field:`, q);
      const allKeys = Object.keys(q);
      const suspectedField = allKeys.find(k => k.toLowerCase().includes('text'));
      
      return {
        ...q,
        questionText: suspectedField 
          ? `[ERROR: Found "${suspectedField}" instead of "questionText". Question ID: ${q.id || 'unknown'}]`
          : `[ERROR: Question text missing. Question ID: ${q.id || 'unknown'}. Available fields: ${allKeys.join(', ')}]`
      };
    }
    
    // Modern format: structured object - decode HTML entities in questionText
    return {
      ...q,
      questionText: decodeHtmlEntities(q.questionText)
    };
  });
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, MarkingResponse | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [attemptCount, setAttemptCount] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [revealReflections, setRevealReflections] = useState<Record<string, string>>({});
  const [verificationRequired, setVerificationRequired] = useState<Record<string, boolean>>({});
  const [verificationPassed, setVerificationPassed] = useState<Record<string, boolean>>({});
  const [verificationLoading, setVerificationLoading] = useState<Record<string, boolean>>({});
  const [verificationFeedback, setVerificationFeedback] = useState<Record<string, MarkingResponse | null>>({});
  const [verificationPrompts, setVerificationPrompts] = useState<Record<string, string>>({});

  const LEGACY_PLACEHOLDER_ANSWER = 'This is a review question. Provide a thoughtful answer based on your prior knowledge.';

  const resolveExpectedAnswer = (expectedAnswer: string | string[]): string => {
    const raw = Array.isArray(expectedAnswer) ? (expectedAnswer[0] ?? '') : expectedAnswer;
    const trimmed = String(raw ?? '').trim();
    if (!trimmed || trimmed === LEGACY_PLACEHOLDER_ANSWER) {
      return 'Explain the core idea correctly and include one concrete example.';
    }
    return trimmed;
  };

  const buildVerificationPrompt = (questionText: string): string => {
    const stem = questionText.replace(/\?+$/, '').trim();
    return `Transfer check: answer the same concept in a different context than "${stem}", then explain why it is still true.`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleShowAnswer = (questionId: string, questionText: string) => {
    const reflection = (revealReflections[questionId] || '').trim();
    if (reflection.length < MIN_REFLECTION_CHARS) {
      return;
    }
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: true }));
    setVerificationRequired((prev) => ({ ...prev, [questionId]: true }));
    setVerificationPassed((prev) => ({ ...prev, [questionId]: false }));
    setVerificationFeedback((prev) => ({ ...prev, [questionId]: null }));
    setVerificationPrompts((prev) => ({ ...prev, [questionId]: buildVerificationPrompt(questionText) }));
    setAnswers((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleVerificationSubmit = async (questionId: string, questionText: string, expectedAnswer: string | string[]) => {
    setVerificationLoading((prev) => ({ ...prev, [questionId]: true }));
    try {
      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          questionText: verificationPrompts[questionId] || buildVerificationPrompt(questionText),
          userAnswer: answers[questionId],
          expectedAnswer: resolveExpectedAnswer(expectedAnswer),
          answerType: 'conceptual',
          cognitiveLevel: 'recall',
        }),
      });

      const result: MarkingResponse = await response.json();
      setVerificationFeedback((prev) => ({ ...prev, [questionId]: result }));

      if (result.isCorrect) {
        setVerificationPassed((prev) => ({ ...prev, [questionId]: true }));
        setVerificationRequired((prev) => ({ ...prev, [questionId]: false }));
      }
    } catch {
      setVerificationFeedback((prev) => ({
        ...prev,
        [questionId]: {
          isCorrect: false,
          score: 0,
          userAnswer: answers[questionId],
          expectedAnswer: [],
          feedback: 'Verification check failed. Please try again.',
          suggestedNextAction: 'retry',
        } as MarkingResponse
      }));
    } finally {
      setVerificationLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const activePendingVerificationQuestionId = Object.keys(verificationRequired).find(
    (qid) => verificationRequired[qid] && !verificationPassed[qid]
  );

  const handleSubmit = async (questionId: string, questionText: string, expectedAnswer: string | string[]) => {
    setLoading({ ...loading, [questionId]: true });
    const nextAttemptNumber = (attemptCount[questionId] || 0) + 1;
    
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

      const question = normalizedQuestions.find((item) => item.id === questionId);
      const { ac_key, ac_source } = getAcMetaFromQuestion(question);
      void logAttempt({
        lesson_id: resolvedLessonId,
        block_id: block.id,
        question_stable_id: normalizeQuestionStableId(questionId),
        question_type: 'short',
        correct: Boolean(result.isCorrect),
        score: typeof result.score === 'number' ? result.score : null,
        user_answer: answers[questionId] ?? null,
        attempt_number: nextAttemptNumber,
        ac_key,
        ac_source,
        grading_mode: 'llm',
      });
      
      // Increment attempt count if answer is incorrect
      if (!result.isCorrect) {
        setAttemptCount({ ...attemptCount, [questionId]: (attemptCount[questionId] || 0) + 1 });
      }
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
      
      // Increment attempt count on error
      setAttemptCount({ ...attemptCount, [questionId]: (attemptCount[questionId] || 0) + 1 });
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
        
        {normalizedQuestions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-xl p-4 border-2 border-amber-200">
            {(() => {
              const verificationPendingForThisQuestion = Boolean(
                verificationRequired[question.id] && !verificationPassed[question.id]
              );
              return (
                <>
            <div className="flex items-start gap-3 mb-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <div className="flex flex-1 items-start gap-2">
                <p className="flex-1 text-gray-800 font-medium">{question.questionText}</p>
                <BlockTTSButton
                  blockId={`${block.id}-spaced-question-${question.id}`}
                  text={question.questionText}
                  label={`Read review question ${index + 1} aloud`}
                  iconOnly
                />
              </div>
            </div>

            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={submitted[question.id] || Boolean(activePendingVerificationQuestionId && activePendingVerificationQuestionId !== question.id)}
              placeholder="Type your answer..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:border-amber-400 dark:focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 mb-3 disabled:bg-gray-100 dark:disabled:bg-slate-700 resize-y"
            />

            {/* Display Revealed Answer */}
            {revealedAnswers[question.id] && (
              <div className="mb-3 bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                <p className="text-sm font-semibold text-amber-900 mb-2">Expected Answer:</p>
                {question.expectedAnswer && 
                 question.expectedAnswer !== 'This is a review question. Provide a thoughtful answer based on your prior knowledge.' ? (
                  <p className="text-gray-800 font-medium">
                    {Array.isArray(question.expectedAnswer) 
                      ? question.expectedAnswer[0] 
                      : question.expectedAnswer}
                  </p>
                ) : (
                  <p className="text-gray-800 font-medium italic">
                    Ask your AI tutor for the answer
                  </p>
                )}
                {question.expectedAnswer && 
                 question.expectedAnswer !== LEGACY_PLACEHOLDER_ANSWER && (
                  <p className="text-xs text-amber-700 mt-2">
                    Mandatory step: complete the verification check correctly to continue.
                  </p>
                )}
              </div>
            )}

            {revealedAnswers[question.id] &&
              verificationRequired[question.id] &&
              !verificationPassed[question.id] &&
              !Boolean(activePendingVerificationQuestionId && activePendingVerificationQuestionId !== question.id) && (
                <div className="mb-3 bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Mandatory Verification Check</p>
                  <p className="text-xs text-blue-800 mb-3">
                    Re-answer from memory using this transfer check:
                  </p>
                  <p className="text-sm text-blue-900 mb-3">
                    {verificationPrompts[question.id] || buildVerificationPrompt(question.questionText)}
                  </p>
                  <button
                    onClick={() => handleVerificationSubmit(question.id, question.questionText, question.expectedAnswer)}
                    disabled={!answers[question.id]?.trim() || verificationLoading[question.id]}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {verificationLoading[question.id] ? 'Checking...' : 'Complete Verification Check'}
                  </button>
                  {verificationFeedback[question.id] && (
                    <p className={`mt-2 text-sm ${verificationFeedback[question.id]!.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {verificationFeedback[question.id]!.feedback}
                    </p>
                  )}
                </div>
              )}

            {verificationPassed[question.id] && (
              <div className="mb-3 bg-green-50 rounded-lg p-3 border border-green-300 text-sm text-green-800">
                Verification passed. You can continue.
              </div>
            )}

            {!submitted[question.id] &&
              !Boolean(activePendingVerificationQuestionId && activePendingVerificationQuestionId !== question.id) && (
              <div className="flex gap-2 flex-wrap mb-3">
                {question.hint && (
                  <button
                    onClick={() => setShowHint({ ...showHint, [question.id]: !showHint[question.id] })}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold hover:bg-amber-200 transition-colors text-sm border border-amber-300"
                  >
                    {showHint[question.id] ? 'Hide' : 'Show'} Hint
                  </button>
                )}
                
                {/* Show Answer Button - appears after 2 failed attempts */}
                {attemptCount[question.id] >= 2 && !revealedAnswers[question.id] && (
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-amber-900 mb-1">
                      Before revealing, write what you think you got wrong.
                    </label>
                    <textarea
                      value={revealReflections[question.id] || ''}
                      onChange={(e) =>
                        setRevealReflections({ ...revealReflections, [question.id]: e.target.value })
                      }
                      rows={2}
                      className="w-full mb-2 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-gray-900 focus:border-amber-500 focus:outline-none"
                      placeholder="Write a short reflection first..."
                    />
                    <p className="text-xs text-amber-800 mb-2">
                      Minimum {MIN_REFLECTION_CHARS} characters.
                    </p>
                    <button
                      onClick={() => handleShowAnswer(question.id, question.questionText)}
                      disabled={(revealReflections[question.id] || '').trim().length < MIN_REFLECTION_CHARS}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm border-2 border-amber-600"
                    >
                      👁️ Show Answer
                    </button>
                  </div>
                )}
              </div>
            )}

            {Boolean(activePendingVerificationQuestionId && activePendingVerificationQuestionId !== question.id) && (
              <div className="mb-3 text-center text-sm text-gray-600">
                Complete the mandatory verification check on the revealed-answer question first.
              </div>
            )}

            {/* Display Hint */}
            {showHint[question.id] &&
              question.hint &&
              !submitted[question.id] &&
              !Boolean(activePendingVerificationQuestionId && activePendingVerificationQuestionId !== question.id) && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  {question.hint}
                </p>
              </div>
            )}

            {!submitted[question.id] ? (
              <button
                onClick={() => handleSubmit(question.id, question.questionText, question.expectedAnswer)}
                disabled={
                  !answers[question.id]?.trim() ||
                  loading[question.id] ||
                  Boolean(activePendingVerificationQuestionId && activePendingVerificationQuestionId !== question.id) ||
                  verificationPendingForThisQuestion
                }
                className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
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
                </>
              );
            })()}
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


