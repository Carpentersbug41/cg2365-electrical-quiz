'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { isAnswerCorrect, type V2QuizQuestion } from '@/lib/v2/questionRuntime';
import { v2AuthedFetch } from '@/lib/v2/client';

interface V2QuizRunnerProps {
  lessonId: string;
  questions: V2QuizQuestion[];
}

interface SubmitResult {
  ok: boolean;
  percentage: number;
  correctCount: number;
  attemptsCount: number;
  masteryAchieved: boolean;
}

function resolveSelectedAnswerIndex(options: string[] | null | undefined, answer: string): number | null {
  if (!options || options.length === 0) return null;
  const index = options.findIndex((option) => option === answer);
  return index >= 0 ? index : null;
}

export default function V2QuizRunner({ lessonId, questions }: V2QuizRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const attempts = useMemo(() => {
    return questions.map((question) => {
      return {
        questionId: question.questionId,
        questionVersionId: question.questionVersionId,
        questionStableId: question.stableId,
        responseText: answers[question.stableId] ?? '',
        selectedAnswer: resolveSelectedAnswerIndex(question.options, answers[question.stableId] ?? ''),
      };
    });
  }, [answers, questions]);

  const incorrectCount = useMemo(
    () =>
      questions.filter((question) => {
        const answer = answers[question.stableId] ?? '';
        return !isAnswerCorrect(answer, question.acceptedAnswers);
      }).length,
    [answers, questions]
  );

  const unansweredCount = useMemo(() => {
    return questions.filter((question) => !(answers[question.stableId] ?? '').trim()).length;
  }, [answers, questions]);

  useEffect(() => {
    let active = true;

    async function startQuizSessionFlow() {
      setIsStarting(true);
      setError(null);
      try {
        const response = await v2AuthedFetch('/api/v2/runtime/quiz-session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            sourceContext: 'v2_quiz_runner',
          }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.quizSessionId) {
          throw new Error(payload?.error || 'Failed to start V2 quiz session.');
        }
        if (!active) return;
        setQuizSessionId(String(payload.quizSessionId));
      } catch (startError) {
        if (!active) return;
        setError(startError instanceof Error ? startError.message : 'Failed to start quiz session.');
      } finally {
        if (active) {
          setIsStarting(false);
        }
      }
    }

    void startQuizSessionFlow();
    return () => {
      active = false;
    };
  }, [lessonId]);

  async function onSubmit() {
    setError(null);
    setResult(null);
    if (!quizSessionId) {
      setError('Quiz session has not started yet.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await v2AuthedFetch('/api/v2/runtime/lesson-quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          quizSessionId,
          attempts,
          sourceContext: 'v2_quiz_runner',
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to submit V2 quiz.');
      }
      setResult(payload as SubmitResult);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function markChecked(questionStableId: string) {
    setChecked((prev) => ({ ...prev, [questionStableId]: true }));
  }

  return (
    <section>
      <p>Lesson: {lessonId}</p>
      {questions.length === 0 ? (
        <p>No practice/spaced-review questions found in this lesson yet.</p>
      ) : (
        <ol>
          {questions.map((question, index) => {
            const answer = answers[question.stableId] ?? '';
            const isCorrect = isAnswerCorrect(answer, question.acceptedAnswers);
            const wasChecked = checked[question.stableId] === true;
            return (
              <li key={question.stableId}>
                <p>Q{index + 1}</p>
                <p>{question.prompt}</p>
                {question.options && question.options.length > 0 ? (
                  <div>
                    {question.options.map((option) => (
                      <label key={`${question.stableId}-${option}`}>
                        <input
                          type="radio"
                          name={question.stableId}
                          checked={answer === option}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [question.stableId]: option,
                            }))
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={answer}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.stableId]: event.target.value,
                      }))
                    }
                  />
                )}
                <div>
                  <button
                    type="button"
                    onClick={() => markChecked(question.stableId)}
                  >
                    Check
                  </button>
                  {wasChecked && (
                    <span>
                      {isCorrect ? 'Looks correct' : 'Not matched yet'}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {questions.length > 0 && (
        <section>
          {isStarting && <p>Starting quiz session...</p>}
          <p>Unanswered: {unansweredCount}</p>
          <p>Current matched correct: {questions.length - incorrectCount}/{questions.length}</p>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || isStarting || !quizSessionId || questions.length === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit V2 Quiz'}
          </button>
        </section>
      )}

      {error && <p>{error}</p>}
      {result && (
        <section>
          <h2>Result</h2>
          <p>Score: {Math.round(result.percentage)}%</p>
          <p>
            Correct: {result.correctCount}/{result.attemptsCount}
          </p>
          <p>Mastery: {result.masteryAchieved ? 'Achieved' : 'Pending'}</p>
          {incorrectCount > 0 && (
            <p>
              You have {incorrectCount} incorrect answer(s). <Link href="/v2/review">Open V2 Review Queue</Link>
            </p>
          )}
        </section>
      )}
    </section>
  );
}
