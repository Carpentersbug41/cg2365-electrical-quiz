'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { isAnswerCorrect, type V2QuizQuestion } from '@/lib/v2/lessonQuestions';
import { authedFetch } from '@/lib/api/authedFetch';

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

export default function V2QuizRunner({ lessonId, questions }: V2QuizRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const attempts = useMemo(() => {
    return questions.map((question) => {
      const answer = answers[question.stableId] ?? '';
      const correct = isAnswerCorrect(answer, question.acceptedAnswers);
      return {
        questionStableId: question.stableId,
        isCorrect: correct,
      };
    });
  }, [answers, questions]);

  const incorrectCount = useMemo(
    () => attempts.filter((attempt) => !attempt.isCorrect).length,
    [attempts]
  );

  const unansweredCount = useMemo(() => {
    return questions.filter((question) => !(answers[question.stableId] ?? '').trim()).length;
  }, [answers, questions]);

  async function onSubmit() {
    setError(null);
    setResult(null);
    setIsSubmitting(true);
    try {
      const response = await authedFetch('/api/v2/runtime/lesson-quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
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
          <p>Unanswered: {unansweredCount}</p>
          <p>Current matched correct: {questions.length - incorrectCount}/{questions.length}</p>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || questions.length === 0}
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
