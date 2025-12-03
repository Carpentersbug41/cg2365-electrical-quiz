'use client';

import { useState, useEffect, useRef } from 'react';
import { questions as allQuestions, Question } from '@/data/questions';
import confetti from 'canvas-confetti';
import Image from 'next/image';

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

// Audio Helper
const createOscillator = (type: OscillatorType, freq: number, duration: number, volume = 0.1) => {
  if (typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = type;
  oscillator.frequency.value = freq;
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export default function Quiz({ section, onBack }: QuizProps = {}) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [wrongAnswerFlash, setWrongAnswerFlash] = useState<number | null>(null);
  
  // Gamification State
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [pointAnimation, setPointAnimation] = useState<number | null>(null);
  
  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  const questions = selectedQuestions;

  // Sound Effects wrappers
  const playErrorSound = () => {
    if (!soundEnabled) return;
    createOscillator('sawtooth', 200, 0.5, 0.3);
  };

  const playCorrectSound = () => {
    if (!soundEnabled) return;
    createOscillator('sine', 880, 0.1, 0.2);
    setTimeout(() => createOscillator('sine', 1760, 0.3, 0.1), 50);
  };

  const playStreakSound = (streakCount: number) => {
    if (!soundEnabled) return;
    const baseFreq = 440;
    const multiplier = 1 + (streakCount * 0.1);
    createOscillator('square', baseFreq * multiplier, 0.4, 0.1);
    
    if (streakCount % 5 === 0) {
      setTimeout(() => createOscillator('sine', baseFreq * multiplier * 1.5, 0.6, 0.1), 100);
      setTimeout(() => createOscillator('sine', baseFreq * multiplier * 2, 0.8, 0.1), 200);
    }
  };

  const playCompletionSound = (score: number, total: number) => {
    if (!soundEnabled) return;
    const percentage = (score / total);
    if (percentage > 0.5) {
      [0, 200, 400, 600].forEach((delay, i) => {
        setTimeout(() => {
          const freqs = [523.25, 659.25, 783.99, 1046.50];
          createOscillator('triangle', freqs[i], 0.5, 0.2);
        }, delay);
      });
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    // Prevent changing answer once selected
    if (selectedAnswers[currentQuestion] !== null) {
      return;
    }

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      // Correct Logic
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      const earnedPoints = 100 + (newStreak * 10);
      setPoints(p => p + earnedPoints);
      setPointAnimation(earnedPoints);
      
      if (newStreak % 5 === 0) {
         playStreakSound(newStreak);
         confetti({
           particleCount: 50,
           spread: 60,
           origin: { y: 0.7 }
         });
      } else {
        playCorrectSound();
      }

      setTimeout(() => setPointAnimation(null), 1000);

    } else {
      // Wrong Logic
      setStreak(0);
      playErrorSound();
      setWrongAnswerFlash(answerIndex);
      
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
    const score = calculateScore();
    playCompletionSound(score, questions.length);
    
    if (score === questions.length) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
    
    setShowResults(true);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setSelectedQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setIsReviewing(false);
    setStreak(0);
    setPoints(0);
  };

  const startQuiz = (questionCount: number) => {
    const randomQuestions = getRandomQuestions(questionCount, section);
    setSelectedQuestions(randomQuestions);
    setSelectedAnswers(new Array(questionCount).fill(null));
    setQuizStarted(true);
    setStreak(0);
    setPoints(0);
  };
  
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

  // Styles
  const globalStyles = (
    <style jsx>{`
      @keyframes flashRed {
        0%, 100% { background-color: rgb(254 242 242); border-color: rgb(239 68 68); transform: scale(1); }
        25% { background-color: rgb(239 68 68); border-color: rgb(220 38 38); transform: scale(1.02); }
        50% { background-color: rgb(254 242 242); border-color: rgb(239 68 68); transform: scale(1); }
        75% { background-color: rgb(239 68 68); border-color: rgb(220 38 38); transform: scale(1.02); }
      }
      .flash-wrong { animation: flashRed 0.8s ease-in-out; }
      
      @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-20px); opacity: 0; }
      }
      .float-points { animation: floatUp 1s ease-out forwards; }

      @keyframes slideIn {
        0% { opacity: 0; transform: translateX(20px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      .slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

      @keyframes pulse-streak {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      .animate-pulse-fast { animation: pulse-streak 0.5s ease-in-out; }
    `}</style>
  );

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
                  <span>Questions are randomly selected</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Earn streak bonuses for correct answers! 🔥</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Instant feedback to help you learn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const incorrectQuestions = questions
      .map((q, index) => ({
        question: q,
        index,
        userAnswer: selectedAnswers[index],
      }))
      .filter(({ question, userAnswer }) => userAnswer !== question.correctAnswer);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        {globalStyles}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete! 🎉</h2>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-indigo-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600">Final Score</div>
                    <div className="text-3xl font-bold text-indigo-600">{score}/{questions.length}</div>
                </div>
                 <div className="bg-amber-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600">Total Points</div>
                    <div className="text-3xl font-bold text-amber-600">{points}</div>
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
                {percentage >= 80 && "Excellent! You have a strong understanding of this topic! ⚡"}
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

                    {/* Image in Review Mode */}
                    {question.image && (
                        <div className="mb-4 relative w-full h-48 md:h-64 bg-gray-100 rounded-lg overflow-hidden">
                            <Image 
                                src={question.image} 
                                alt="Question Diagram" 
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}

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
      {globalStyles}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                {section || "Health & Safety"} Quiz
                {streak > 1 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 animate-pulse-fast">
                        🔥 {streak} Streak!
                    </span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
               {/* Points Display */}
               <div className="text-right relative">
                <div className="text-sm text-gray-600">Points</div>
                <div className="text-2xl font-bold text-amber-500">
                    {points}
                </div>
                {pointAnimation && (
                    <div className="absolute top-0 right-0 text-green-500 font-bold text-xl float-points">
                        +{pointAnimation}
                    </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {answeredCount}/{questions.length}
                </div>
              </div>

              {/* Sound Toggle */}
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-full transition-colors ${soundEnabled ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                title={soundEnabled ? "Mute Sound" : "Enable Sound"}
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>
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
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden min-h-[400px]">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 z-0 opacity-50 pointer-events-none"></div>
          
          <div key={currentQuestion} className="slide-in relative z-10">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full">
                  {currentQ.category}
                </span>
                <span className="text-lg font-bold text-gray-400">
                  Q{currentQuestion + 1}
                </span>
              </div>
              
               {/* Image Display */}
               {currentQ.image && (
                  <div className="mb-6 relative w-full h-64 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-inner">
                      <Image 
                        src={currentQ.image} 
                        alt="Question Diagram" 
                        fill
                        className="object-contain p-2"
                        priority
                      />
                  </div>
               )}

              <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                // Instant feedback logic: Show Green/Red immediately if answered, or during review
                const showCorrectAnswer = (isReviewing || isAnswered) && index === currentQ.correctAnswer;
                const showWrongAnswer = (isReviewing || isAnswered) && isSelected && index !== currentQ.correctAnswer;
                const isFlashing = wrongAnswerFlash === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => !isReviewing && !isAnswered && handleAnswerSelect(index)}
                    disabled={isReviewing || isAnswered}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 transform ${
                      showCorrectAnswer
                        ? 'border-green-500 bg-green-50 scale-[1.02] shadow-md'
                        : showWrongAnswer
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-indigo-500 bg-indigo-50 scale-[1.02] shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:scale-[1.01] hover:shadow-sm'
                    } ${isReviewing || isAnswered ? 'cursor-default' : 'cursor-pointer'} ${isFlashing ? 'flash-wrong' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-300 ${
                        showCorrectAnswer
                          ? 'border-green-500 bg-green-500'
                          : showWrongAnswer
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300 group-hover:border-indigo-400'
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
                      <span className={`text-lg transition-colors duration-200 ${
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

            {(isReviewing || (isAnswered && !isCorrect)) && (
              <div className={`mt-6 p-4 rounded-lg animate-pulse-fast ${
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

        {/* Question Grid - Show on wider screens */}
        <div className="hidden lg:block mt-6 bg-white rounded-2xl shadow-2xl p-6">
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
      </div>
    </div>
  );
}
