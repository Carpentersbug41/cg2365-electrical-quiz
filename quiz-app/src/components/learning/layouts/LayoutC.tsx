'use client';

/**
 * Layout C: Focus Mode (Assessment)
 * For quizzes/tests with minimal distractions
 * Tutor locked (Check mode only or hidden)
 * Single focused column, clear progress indicator
 */

import { useState, useEffect } from 'react';
import { TaggedQuestion } from '@/data/questions/types';

interface LayoutCProps {
  quizId: string;
  quizTitle: string;
  questions: TaggedQuestion[];
  onComplete: (results: QuizResults) => void;
}

interface QuizResults {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    questionId: string;
    userAnswer: number | null;
    isCorrect: boolean;
    misconceptionCode?: string;
  }[];
  timeSpent: number;
}

export default function LayoutC({ quizId, quizTitle, questions, onComplete }: LayoutCProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [startTime] = useState(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const results: QuizResults = {
      quizId,
      score: 0,
      totalQuestions: questions.length,
      percentage: 0,
      answers: [],
      timeSpent: timeElapsed,
    };

    questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        results.score++;
      }

      // Detect misconception if wrong
      let misconceptionCode: string | undefined;
      if (!isCorrect && userAnswer !== null && question.misconceptionCodes) {
        misconceptionCode = question.misconceptionCodes[userAnswer];
      }

      results.answers.push({
        questionId: question.id.toString(),
        userAnswer,
        isCorrect,
        misconceptionCode,
      });
    });

    results.percentage = Math.round((results.score / results.totalQuestions) * 100);
    
    setShowResults(true);
    onComplete(results);
  };

  const answeredCount = selectedAnswers.filter(a => a !== null).length;
  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== null;

  if (showResults) {
    const score = selectedAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete! 🎉</h2>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600">Score</div>
                  <div className="text-3xl font-bold text-indigo-600">{score}/{questions.length}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600">Percentage</div>
                  <div className="text-3xl font-bold text-amber-600">{percentage}%</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="text-lg text-gray-700 mb-8">
                {percentage >= 80 && "Excellent! You have a strong understanding! ⚡"}
                {percentage >= 60 && percentage < 80 && "Good job! Review the questions you missed. 📚"}
                {percentage < 60 && "Keep studying! Review the material and try again. 💪"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Back to Lesson
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
              >
                Retry Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Strip (Assessment Header) */}
      <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white/85 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
            Focus Mode
          </span>
          <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
            {quizTitle}
          </span>
          <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
            Q {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
            {formatTime(timeElapsed)}
          </span>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="mb-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full">
                  {currentQ.category}
                </span>
                <span className="text-lg font-bold text-gray-400">
                  Q{currentQuestion + 1}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 relative z-10">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 transform ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 scale-[1.02] shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:scale-[1.01] hover:shadow-sm'
                    } cursor-pointer`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-300 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <span className="text-white font-bold">✓</span>
                        )}
                      </div>
                      <span className={`text-lg transition-colors duration-200 ${
                        isSelected ? 'text-indigo-800 font-semibold' : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
              >
                ← Previous
              </button>

              <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
                {questions.slice(
                  Math.max(0, currentQuestion - 2),
                  Math.min(questions.length, currentQuestion + 3)
                ).map((_, idx) => {
                  const actualIdx = Math.max(0, currentQuestion - 2) + idx;
                  return (
                    <button
                      key={actualIdx}
                      onClick={() => goToQuestion(actualIdx)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                        actualIdx === currentQuestion
                          ? 'bg-indigo-600 text-white transform scale-110 shadow-md'
                          : selectedAnswers[actualIdx] !== null
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {actualIdx + 1}
                    </button>
                  );
                })}
              </div>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors w-full sm:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={goToNextQuestion}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full sm:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Next →
                </button>
              )}
            </div>

            {answeredCount < questions.length && currentQuestion === questions.length - 1 && (
              <div className="mt-4 text-center text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                Please answer all questions before submitting ({questions.length - answeredCount} remaining)
              </div>
            )}
          </div>

          {/* Question Grid */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">All Questions</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToQuestion(idx)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    idx === currentQuestion
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 transform scale-110 z-10'
                      : selectedAnswers[idx] !== null
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Tutor Locked Notice */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-300">
            <div className="flex items-center gap-3 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <div>
                <span className="font-semibold">Tutor is locked during assessment.</span>
                <p className="text-sm">Complete the quiz to see feedback and guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


