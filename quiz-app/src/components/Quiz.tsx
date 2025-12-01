'use client';

import { useState, useEffect } from 'react';
import { questions as allQuestions, Question } from '@/data/questions';

interface QuizProps {
  section?: string;
  onBack?: () => void;
}

// Function to shuffle answer options within a question
const shuffleQuestionOptions = (question: Question): Question => {
  const optionsWithIndex = question.options.map((option, index) => ({
    option,
    wasCorrect: index === question.correctAnswer,
  }));
  
  // Shuffle the options
  const shuffledOptions = [...optionsWithIndex].sort(() => Math.random() - 0.5);
  
  // Find the new index of the correct answer
  const newCorrectIndex = shuffledOptions.findIndex(item => item.wasCorrect);
  
  return {
    ...question,
    options: shuffledOptions.map(item => item.option),
    correctAnswer: newCorrectIndex,
  };
};

// Function to randomly select n questions from the question bank (filtered by section)
const getRandomQuestions = (count: number, section?: string): Question[] => {
  const filteredQuestions = section 
    ? allQuestions.filter(q => q.section === section)
    : allQuestions;
  
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  
  // Shuffle options within each question
  return selected.map(q => shuffleQuestionOptions(q));
};

// Function to play error sound
const playErrorSound = () => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200; // Low frequency for error
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }
};

export default function Quiz({ section, onBack }: QuizProps = {}) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [wrongAnswerFlash, setWrongAnswerFlash] = useState<number | null>(null);

  const questions = selectedQuestions;

  const handleAnswerSelect = (answerIndex: number) => {
    // Prevent changing answer once selected
    if (selectedAnswers[currentQuestion] !== null) {
      return;
    }

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    // Check if the answer is wrong
    if (answerIndex !== questions[currentQuestion].correctAnswer) {
      playErrorSound();
      setWrongAnswerFlash(answerIndex);
      
      // Clear the flash animation after 1 second
      setTimeout(() => {
        setWrongAnswerFlash(null);
      }, 1000);
    }
  };

  // Clear flash when changing questions
  useEffect(() => {
    setWrongAnswerFlash(null);
  }, [currentQuestion]);

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

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setSelectedQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setIsReviewing(false);
  };

  const startQuiz = (questionCount: number) => {
    const randomQuestions = getRandomQuestions(questionCount, section);
    setSelectedQuestions(randomQuestions);
    setSelectedAnswers(new Array(questionCount).fill(null));
    setQuizStarted(true);
  };
  
  // Get questions for the selected section
  const sectionQuestions = section 
    ? allQuestions.filter(q => q.section === section)
    : allQuestions;

  const handleReview = () => {
    setIsReviewing(true);
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const answeredCount = selectedAnswers.filter(a => a !== null).length;
  const score = calculateScore();
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // Start Screen
  if (!quizStarted) {
    const maxQuestions = sectionQuestions.length;
    const questionOptions = [5, 10, 20, 30, 50].filter(n => n <= maxQuestions);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {onBack && (
              <button
                onClick={onBack}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="mr-2">←</span> Back to Section Selection
              </button>
            )}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {section || "Health & Safety"} Quiz
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                {section === "Communication" ? "2365 Communication Test" : "2365 Electrical Knowledge Test"}
              </p>
              <p className="text-gray-500">
                Total questions available: {sectionQuestions.length}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                How many questions would you like?
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {questionOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => startQuiz(count)}
                    className="group relative p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl font-semibold text-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="text-4xl font-bold mb-1">{count}</div>
                    <div className="text-sm font-normal opacity-90">questions</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="font-semibold text-indigo-900 mb-3 flex items-center">
                <span className="text-xl mr-2">ℹ️</span>
                Quiz Information
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Questions are randomly selected from the question bank</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>You can navigate between questions freely</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>All questions must be answered before submitting</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Review your answers after completing the quiz</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    // Get all incorrect questions
    const incorrectQuestions = questions
      .map((q, index) => ({
        question: q,
        index,
        userAnswer: selectedAnswers[index],
      }))
      .filter(({ question, userAnswer }) => userAnswer !== question.correctAnswer);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete! 🎉</h2>
              <div className="text-6xl font-bold text-indigo-600 mb-4">
                {score}/{questions.length}
              </div>
              <div className="text-2xl text-gray-600 mb-6">
                {percentage}% Correct
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
                {percentage >= 80 && "Excellent! You have a strong understanding of 2365 electrical health and safety! ⚡"}
                {percentage >= 60 && percentage < 80 && "Good job! Review the questions you missed to improve further. 📚"}
                {percentage < 60 && "Keep studying! Review the material and try again. 💪"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleReview}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Review Answers
              </button>
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
              >
                Restart Quiz
              </button>
            </div>
          </div>

          {/* Incorrect Questions Section */}
          {incorrectQuestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center">
                <span className="mr-3">❌</span>
                Questions You Got Wrong ({incorrectQuestions.length})
              </h3>
              
              <div className="space-y-6">
                {incorrectQuestions.map(({ question, index, userAnswer }) => (
                  <div key={index} className="border-l-4 border-red-500 bg-red-50 p-6 rounded-r-lg">
                    <div className="mb-4">
                      <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                        {question.category}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Question {index + 1}: {question.question}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border-2 border-red-300">
                        <div className="flex items-start">
                          <span className="text-red-500 font-bold mr-3 text-lg">✗</span>
                          <div>
                            <div className="text-sm font-semibold text-red-700 mb-1">Your Answer:</div>
                            <div className="text-gray-800">
                              {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                        <div className="flex items-start">
                          <span className="text-green-500 font-bold mr-3 text-lg">✓</span>
                          <div>
                            <div className="text-sm font-semibold text-green-700 mb-1">Correct Answer:</div>
                            <div className="text-gray-800 font-semibold">
                              {question.options[question.correctAnswer]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {incorrectQuestions.length === 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-600">Perfect Score!</h3>
              <p className="text-gray-600 mt-2">You answered all questions correctly!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== null;
  const isCorrect = selectedAnswers[currentQuestion] === currentQ.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <style jsx>{`
        @keyframes flashRed {
          0%, 100% { 
            background-color: rgb(254 242 242);
            border-color: rgb(239 68 68);
            transform: scale(1);
          }
          25% { 
            background-color: rgb(239 68 68);
            border-color: rgb(220 38 38);
            transform: scale(1.02);
          }
          50% { 
            background-color: rgb(254 242 242);
            border-color: rgb(239 68 68);
            transform: scale(1);
          }
          75% { 
            background-color: rgb(239 68 68);
            border-color: rgb(220 38 38);
            transform: scale(1.02);
          }
        }
        .flash-wrong {
          animation: flashRed 0.8s ease-in-out;
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Health & Safety 2365 Electrical Quiz
              </h1>
              <p className="text-gray-600 mt-2">Test your knowledge with {questions.length} questions</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-2xl font-bold text-indigo-600">
                {answeredCount}/{questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full">
                {currentQ.category}
              </span>
              <span className="text-lg font-bold text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const showCorrectAnswer = isReviewing && index === currentQ.correctAnswer;
              const showWrongAnswer = isReviewing && isSelected && index !== currentQ.correctAnswer;
              const isFlashing = wrongAnswerFlash === index;
              
              return (
                <button
                  key={index}
                  onClick={() => !isReviewing && !isAnswered && handleAnswerSelect(index)}
                  disabled={isReviewing || isAnswered}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    showCorrectAnswer
                      ? 'border-green-500 bg-green-50'
                      : showWrongAnswer
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  } ${isReviewing || isAnswered ? 'cursor-default' : 'cursor-pointer'} ${isFlashing ? 'flash-wrong' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                      showCorrectAnswer
                        ? 'border-green-500 bg-green-500'
                        : showWrongAnswer
                        ? 'border-red-500 bg-red-500'
                        : isSelected
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {(showCorrectAnswer || (isSelected && !showWrongAnswer)) && (
                        <span className="text-white font-bold">
                          {showCorrectAnswer ? '✓' : (isSelected ? '✓' : '')}
                        </span>
                      )}
                      {showWrongAnswer && (
                        <span className="text-white font-bold">✗</span>
                      )}
                    </div>
                    <span className={`text-lg ${
                      showCorrectAnswer ? 'text-green-800 font-semibold' :
                      showWrongAnswer ? 'text-red-800' :
                      isSelected ? 'text-indigo-800 font-semibold' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {isReviewing && (
            <div className={`mt-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
            }`}>
              <div className="flex items-start">
                <span className="text-2xl mr-3">{isCorrect ? '✓' : '✗'}</span>
                <div>
                  <div className={`font-bold mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  {!isCorrect && (
                    <div className="text-gray-700">
                      The correct answer is: <strong>{currentQ.options[currentQ.correctAnswer]}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      actualIdx === currentQuestion
                        ? 'bg-indigo-600 text-white'
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
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full sm:w-auto"
              >
                Next →
              </button>
            )}
          </div>

          {answeredCount < questions.length && currentQuestion === questions.length - 1 && (
            <div className="mt-4 text-center text-amber-700 bg-amber-50 p-3 rounded-lg">
              Please answer all questions before submitting ({questions.length - answeredCount} remaining)
            </div>
          )}
        </div>

        {/* Question Grid - Show on wider screens */}
        <div className="hidden lg:block mt-6 bg-white rounded-2xl shadow-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">All Questions</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors text-sm ${
                  idx === currentQuestion
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
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
      </div>
    </div>
  );
}

