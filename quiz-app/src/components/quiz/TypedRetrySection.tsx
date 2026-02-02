'use client';

/**
 * Typed Retry Section Component
 * Shows typed "deep processing" retry questions for wrong MCQ answers
 * LLM-marked with score threshold of 60%
 */

import { useState, useEffect } from 'react';
import { Question } from '@/data/questions';

interface TypedRetryProps {
  wrongAnswers: Array<{
    questionId: string;
    questionText: string;
    userAnswer: number;
    correctAnswer: number;
    options: string[];
    confidence?: 'not-sure' | 'somewhat-sure' | 'very-sure';
  }>;
  context: string;
  lessonId?: string;
}

interface TypedRetryQuestion {
  originalQuestionId: string;
  rephrasedQuestion: string;
  correctAnswerText: string;
  originalQuestion: string;
  priority: number; // 1=highest (high confidence wrong), 2=repeated, 3=other
}

interface RetryResult {
  questionIndex: number;
  studentAnswer: string;
  score: number;
  feedback: string;
  whatWasRight?: string;
  whatWasMissed?: string;
  modelAnswer?: string;
  passed: boolean;
}

export default function TypedRetrySection({ wrongAnswers, context, lessonId }: TypedRetryProps) {
  const [retryQuestions, setRetryQuestions] = useState<TypedRetryQuestion[]>([]);
  const [currentRetryIndex, setCurrentRetryIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<RetryResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Generate retry questions from wrong answers
    const generated = generateTypedRetries(wrongAnswers);
    setRetryQuestions(generated);
    setStudentAnswers(new Array(generated.length).fill(''));
  }, [wrongAnswers]);

  function generateTypedRetries(wrongs: typeof wrongAnswers): TypedRetryQuestion[] {
    // Sort by priority
    const prioritized = [...wrongs].map(w => {
      let priority = 3;
      if (w.confidence === 'very-sure') {
        priority = 1; // High confidence wrong = misconception
      } else if (w.confidence === 'not-sure') {
        priority = 2;
      }
      return { ...w, priority };
    }).sort((a, b) => a.priority - b.priority);

    // Take up to 3
    const selected = prioritized.slice(0, 3);

    // Rephrase as "why" questions
    return selected.map(w => ({
      originalQuestionId: w.questionId,
      rephrasedQuestion: rephraseAsWhyQuestion(w.questionText, w.options[w.correctAnswer]),
      correctAnswerText: w.options[w.correctAnswer],
      originalQuestion: w.questionText,
      priority: w.priority,
    }));
  }

  function rephraseAsWhyQuestion(originalQuestion: string, correctAnswer: string): string {
    // Simple rephrasing logic - extract topic and create "why" question
    // Remove question mark
    const cleaned = originalQuestion.replace(/\?$/, '').trim();
    
    // Try different templates
    if (cleaned.toLowerCase().includes('what')) {
      return `Explain why "${correctAnswer}" is the correct answer. (1-2 sentences)`;
    } else if (cleaned.toLowerCase().includes('which')) {
      return `Why is "${correctAnswer}" the best choice? Explain in 1-2 sentences.`;
    } else {
      return `Explain why: ${correctAnswer}. (1-2 sentences)`;
    }
  }

  async function handleSubmitRetry(index: number) {
    if (!studentAnswers[index]?.trim()) {
      alert('Please enter an answer before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call LLM marking API
      const response = await fetch('/api/marking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: retryQuestions[index].originalQuestionId,
          questionText: retryQuestions[index].rephrasedQuestion,
          expectedAnswer: `The correct answer is "${retryQuestions[index].correctAnswerText}". ${retryQuestions[index].originalQuestion}`,
          userAnswer: studentAnswers[index],
          cognitiveLevel: 'understanding',
          answerType: 'short-text',
        }),
      });

      if (!response.ok) {
        throw new Error('Marking failed');
      }

      const result = await response.json();

      const retryResult: RetryResult = {
        questionIndex: index,
        studentAnswer: studentAnswers[index],
        score: result.score || 0,
        feedback: result.feedback || '',
        whatWasRight: result.metadata?.whatWasRight,
        whatWasMissed: result.metadata?.whatWasMissed,
        modelAnswer: result.metadata?.modelAnswer,
        passed: (result.score || 0) >= 60,
      };

      setResults(prev => [...prev, retryResult]);

      // Move to next or show results
      if (index < retryQuestions.length - 1) {
        setCurrentRetryIndex(index + 1);
      } else {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting retry:', error);
      alert('Failed to mark answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAnswerChange(value: string) {
    const newAnswers = [...studentAnswers];
    newAnswers[currentRetryIndex] = value;
    setStudentAnswers(newAnswers);
  }

  if (retryQuestions.length === 0) {
    return null; // No retry questions needed
  }

  if (showResults) {
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mt-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">
            Typed Retry Results
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-400">
            {passedCount}/{totalCount} passed (60% threshold)
          </p>
        </div>

        <div className="space-y-6">
          {results.map((result, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-xl border-2 ${
                result.passed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-600'
              }`}
            >
              <div className="flex items-start mb-4">
                <span className="text-2xl mr-3">{result.passed ? '✓' : '⚠'}</span>
                <div className="flex-1">
                  <div className={`font-bold text-lg mb-2 ${
                    result.passed ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'
                  }`}>
                    Question {idx + 1}: {result.passed ? 'Passed' : 'Needs More Work'} (Score: {result.score}/100)
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-semibold text-gray-700 dark:text-slate-400 mb-1">Your Answer:</div>
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-lg text-gray-800 dark:text-slate-200">
                      {result.studentAnswer}
                    </div>
                  </div>

                  {result.feedback && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-gray-700 dark:text-slate-400 mb-1">Feedback:</div>
                      <div className="text-gray-800 dark:text-slate-300">
                        {result.feedback}
                      </div>
                    </div>
                  )}

                  {result.whatWasRight && (
                    <div className="mb-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <div className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">What You Got Right:</div>
                      <div className="text-sm text-green-900 dark:text-green-200">
                        {result.whatWasRight}
                      </div>
                    </div>
                  )}

                  {result.whatWasMissed && (
                    <div className="mb-2 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <div className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">What You Missed:</div>
                      <div className="text-sm text-amber-900 dark:text-amber-200">
                        {result.whatWasMissed}
                      </div>
                    </div>
                  )}

                  {result.modelAnswer && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Model Answer:</div>
                      <div className="text-sm text-blue-900 dark:text-blue-200">
                        {result.modelAnswer}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = retryQuestions[currentRetryIndex];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mt-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            Deep Processing Questions
          </h2>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full font-semibold">
            {currentRetryIndex + 1} of {retryQuestions.length}
          </span>
        </div>
        <p className="text-gray-600 dark:text-slate-400">
          Answer in 1-2 sentences to demonstrate your understanding.
        </p>
      </div>

      <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Original Question:
        </div>
        <div className="text-gray-700 dark:text-slate-300 mb-4">
          {currentQuestion.originalQuestion}
        </div>
        <div className="text-lg font-semibold text-gray-800 dark:text-slate-100">
          {currentQuestion.rephrasedQuestion}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
          Your Answer:
        </label>
        <textarea
          value={studentAnswers[currentRetryIndex]}
          onChange={(e) => handleAnswerChange(e.target.value)}
          rows={4}
          className="w-full p-4 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200"
          placeholder="Type your answer here (1-2 sentences)..."
          disabled={isSubmitting}
        />
      </div>

      <button
        onClick={() => handleSubmitRetry(currentRetryIndex)}
        disabled={isSubmitting || !studentAnswers[currentRetryIndex]?.trim()}
        className="w-full px-6 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        {isSubmitting ? 'Marking...' : 'Submit Answer'}
      </button>
    </div>
  );
}
