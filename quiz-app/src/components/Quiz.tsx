'use client';

import { useState, useEffect } from 'react';
import { questions as allQuestions, Question } from '@/data/questions';
import confetti from 'canvas-confetti';
import ChatAssistant from './chat/ChatAssistant';
import { 
  saveQuizAttempt, 
  getQuizProgress,
  markLessonMasteryPending,
  confirmLessonMastery,
  resetLessonMastery,
} from '@/lib/progress/progressService';
import { QuizAttempt } from '@/lib/progress/types';
import { scheduleReview } from '@/lib/progress/reviewScheduler';

interface QuizProps {
  section?: string;
  onBack?: () => void;
  questions?: Question[]; // Optional: pass custom filtered questions
  lessonId?: string; // For mastery tracking
  isRetest?: boolean; // True if this is a delayed mastery retest
  onComplete?: (results: {
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    wrongAnswers: Array<{
      questionId: string;
      questionText: string;
      userAnswer: number;
      correctAnswer: number;
      options: string[];
    }>;
  }) => void;
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

// Function to randomly select n questions from the question bank (filtered by section or custom questions)
const getRandomQuestions = (count: number, section?: string, customQuestions?: Question[]): Question[] => {
  const filteredQuestions = customQuestions 
    ? customQuestions
    : section 
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

// Sound Effects
const playErrorSound = () => {
  createOscillator('sawtooth', 200, 0.5, 0.3); // Low buzz
};

const playCorrectSound = () => {
  createOscillator('sine', 880, 0.1, 0.2); // High ping (A5)
  setTimeout(() => createOscillator('sine', 1760, 0.3, 0.1), 50); // Higher ping (A6)
};

const playStreakSound = (streak: number) => {
  // Pitch goes up with streak
  const baseFreq = 440;
  const multiplier = 1 + (streak * 0.1);
  createOscillator('square', baseFreq * multiplier, 0.4, 0.1);
  
  // Add a little harmony for big streaks
  if (streak % 5 === 0) {
    setTimeout(() => createOscillator('sine', baseFreq * multiplier * 1.5, 0.6, 0.1), 100);
    setTimeout(() => createOscillator('sine', baseFreq * multiplier * 2, 0.8, 0.1), 200);
  }
};

const playCompletionSound = (score: number, total: number) => {
  const percentage = (score / total);
  if (percentage > 0.5) {
    // Major chord arpeggio
    [0, 200, 400, 600].forEach((delay, i) => {
      setTimeout(() => {
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C major
        createOscillator('triangle', freqs[i], 0.5, 0.2);
      }, delay);
    });
  }
};

export default function Quiz({ section, onBack, questions: customQuestions, lessonId, isRetest = false, onComplete }: QuizProps = {}) {
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

  // Chat State - Start open by default
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const questions = selectedQuestions;

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
      
      // Points Calculation: Base 100 + Streak Bonus
      const earnedPoints = 100 + (newStreak * 10);
      setPoints(p => p + earnedPoints);
      setPointAnimation(earnedPoints);
      
      // Sounds & Visuals
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

      // Clear point animation
      setTimeout(() => setPointAnimation(null), 1000);

    } else {
      // Wrong Logic
      setStreak(0);
      playErrorSound();
      setWrongAnswerFlash(answerIndex);
      
      // Clear the flash animation
      setTimeout(() => {
        setWrongAnswerFlash(null);
      }, 1000);
    }
    
    // Auto-advance after a short delay (optional, but good for flow)
    // Keeping manual navigation for now as per original design, but could add auto-advance option later.
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
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 80; // 80% pass threshold
    
    // If onComplete callback provided, call it instead of showing built-in results
    if (onComplete) {
      const wrongAnswers = questions
        .map((q, idx) => ({
          questionId: q.id.toString(),
          questionText: q.question,
          userAnswer: selectedAnswers[idx] ?? -1,
          correctAnswer: q.correctAnswer,
          options: q.options,
        }))
        .filter((_, idx) => selectedAnswers[idx] !== questions[idx].correctAnswer);
      
      onComplete({
        score,
        totalQuestions: questions.length,
        percentage,
        passed,
        wrongAnswers,
      });
      return; // Don't show built-in results screen
    }
    
    playCompletionSound(score, questions.length);
    
    if (score === questions.length) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }

    // Track progress for lesson quizzes
    if (lessonId) {
      const quizId = `${lessonId}-quiz`;
      
      // Create quiz attempt record
      const attempt: QuizAttempt = {
        attemptId: `${Date.now()}`,
        quizId,
        startedAt: new Date(Date.now() - 300000), // Approximate 5 min ago
        completedAt: new Date(),
        score,
        totalQuestions: questions.length,
        percentage,
        answers: questions.map((q, idx) => ({
          questionId: q.id.toString(),
          userAnswer: selectedAnswers[idx]?.toString() || '',
          isCorrect: selectedAnswers[idx] === q.correctAnswer,
        })),
        timeSpent: 300, // Approximate
        passed,
        passThreshold: 80,
      };

      // Save quiz attempt (handles mastery tracking internally)
      saveQuizAttempt(quizId, section || 'Quiz', attempt);

      // Handle lesson mastery tracking
      if (isRetest) {
        // This is a delayed retest
        if (passed) {
          confirmLessonMastery(lessonId);
        } else {
          resetLessonMastery(lessonId);
        }
      } else {
        // First attempt
        if (passed) {
          markLessonMasteryPending(lessonId, 1); // Schedule retest in 1 day
        }
      }

      // Schedule spaced review based on performance
      const performanceRatio = percentage / 100;
      const reviewCount = getQuizProgress(quizId)?.attempts.length || 0;
      scheduleReview(lessonId, new Date(), reviewCount, performanceRatio);
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
    const randomQuestions = getRandomQuestions(questionCount, section, customQuestions);
    setSelectedQuestions(randomQuestions);
    setSelectedAnswers(new Array(questionCount).fill(null));
    setQuizStarted(true);
    setStreak(0);
    setPoints(0);
  };
  
  // Get questions for the selected section or custom questions
  const sectionQuestions = customQuestions 
    ? customQuestions
    : section 
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
    const questionOptions = [10, 20, 30, 50].filter(n => n <= maxQuestions);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12">
            {onBack && (
              <button
                onClick={onBack}
                className="mb-6 flex items-center text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
              >
                <span className="mr-2">←</span> Back to Section Selection
              </button>
            )}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-slate-100 mb-4">
                {section || "Health & Safety"} Quiz
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-400 mb-2">
                {section === "Communication" ? "2365 Communication Test" : "2365 Electrical Knowledge Test"}
              </p>
              <p className="text-gray-500 dark:text-slate-500">
                Total questions available: {sectionQuestions.length}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 mb-6 text-center">
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

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center">
                <span className="text-xl mr-2">ℹ️</span>
                Quiz Information
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Questions are randomly selected from the question bank</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Earn streak bonuses for consecutive correct answers! 🔥</span>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-slate-100 mb-4">Quiz Complete! 🎉</h2>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 dark:text-slate-400">Final Score</div>
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{score}/{questions.length}</div>
                </div>
                 <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 dark:text-slate-400">Total Points</div>
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{points}</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 mb-8">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="text-lg text-gray-700 dark:text-slate-300 mb-8">
                {percentage >= 80 && "Excellent! You have a strong understanding of 2365 electrical health and safety! ⚡"}
                {percentage >= 60 && percentage < 80 && "Good job! Review the questions you missed to improve further. 📚"}
                {percentage < 60 && "Keep studying! Review the material and try again. 💪"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleReview}
                className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-md"
              >
                Review Answers
              </button>
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-gray-600 dark:bg-slate-700 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-slate-600 transition-colors shadow-md"
              >
                Restart Quiz
              </button>
            </div>
          </div>

          {/* Incorrect Questions Section */}
          {incorrectQuestions.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center">
                <span className="mr-3">❌</span>
                Questions You Got Wrong ({incorrectQuestions.length})
              </h3>
              
              <div className="space-y-6">
                {incorrectQuestions.map(({ question, index, userAnswer }) => (
                  <div key={index} className="border-l-4 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 p-6 rounded-r-lg">
                    <div className="mb-4">
                      <span className="inline-block bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                        {question.category}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-3">
                        Question {index + 1}: {question.question}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border-2 border-red-300 dark:border-red-600">
                        <div className="flex items-start">
                          <span className="text-red-500 dark:text-red-400 font-bold mr-3 text-lg">✗</span>
                          <div>
                            <div className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Your Answer:</div>
                            <div className="text-gray-800 dark:text-slate-200">
                              {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border-2 border-green-300 dark:border-green-600">
                        <div className="flex items-start">
                          <span className="text-green-500 dark:text-green-400 font-bold mr-3 text-lg">✓</span>
                          <div>
                            <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">Correct Answer:</div>
                            <div className="text-gray-800 dark:text-slate-200 font-semibold">
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Perfect Score!</h3>
              <p className="text-gray-600 dark:text-slate-400 mt-2">You answered all questions correctly!</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 relative">
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
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        .float-points {
          animation: floatUp 1s ease-out forwards;
        }
      `}</style>
      
      {/* Mobile Chat Toggle Button */}
      <button
        onClick={() => setIsChatCollapsed(!isChatCollapsed)}
        className="md:hidden fixed bottom-6 right-6 z-30 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
        aria-label="Toggle chat assistant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </button>

      {/* Desktop Layout: Sidebar + Quiz Content */}
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Main Quiz Content */}
        <div className="flex-1 max-w-4xl">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                {section || "Health & Safety"} Quiz
                {streak > 1 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 animate-pulse">
                        🔥 {streak} Streak!
                    </span>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
               {/* Points Display */}
               <div className="text-right relative">
                <div className="text-sm text-gray-600 dark:text-slate-400">Points</div>
                <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                    {points}
                </div>
                {pointAnimation && (
                    <div className="absolute top-0 right-0 text-green-500 font-bold text-xl float-points">
                        +{pointAnimation}
                    </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-slate-400">Progress</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {answeredCount}/{questions.length}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -mr-16 -mt-16 z-0 opacity-50 pointer-events-none"></div>
          
          <div className="mb-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full">
                {currentQ.category}
              </span>
              <span className="text-lg font-bold text-gray-400 dark:text-slate-500">
                Q{currentQuestion + 1}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 relative z-10">
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
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 transform ${
                    showCorrectAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400 scale-[1.02] shadow-md'
                      : showWrongAnswer
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400 scale-[1.02] shadow-md'
                      : 'border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:scale-[1.01] hover:shadow-sm'
                  } ${isReviewing || isAnswered ? 'cursor-default' : 'cursor-pointer'} ${isFlashing ? 'flash-wrong' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-300 ${
                      showCorrectAnswer
                        ? 'border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-600'
                        : showWrongAnswer
                        ? 'border-red-500 bg-red-500 dark:border-red-400 dark:bg-red-600'
                        : isSelected
                        ? 'border-indigo-500 bg-indigo-500 dark:border-indigo-400 dark:bg-indigo-600'
                        : 'border-gray-300 dark:border-slate-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-500'
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
                      showCorrectAnswer ? 'text-green-800 dark:text-green-300 font-semibold' :
                      showWrongAnswer ? 'text-red-800 dark:text-red-300' :
                      isSelected ? 'text-indigo-800 dark:text-indigo-300 font-semibold' : 'text-gray-700 dark:text-slate-300'
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
              isCorrect ? 'bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-600' : 'bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-600'
            }`}>
              <div className="flex items-start">
                <span className="text-2xl mr-3">{isCorrect ? '✓' : '✗'}</span>
                <div>
                  <div className={`font-bold mb-1 ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  {!isCorrect && (
                    <div className="text-gray-700 dark:text-slate-300">
                      The correct answer is: <strong>{currentQ.options[currentQ.correctAnswer]}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-600 dark:bg-slate-700 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-slate-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
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
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white transform scale-110 shadow-md'
                        : selectedAnswers[actualIdx] !== null
                        ? 'bg-green-500 dark:bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
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
                className="px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors w-full sm:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors w-full sm:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Next →
              </button>
            )}
          </div>

          {answeredCount < questions.length && currentQuestion === questions.length - 1 && (
            <div className="mt-4 text-center text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
              Please answer all questions before submitting ({questions.length - answeredCount} remaining)
            </div>
          )}
        </div>

        {/* Question Grid - Show on wider screens */}
        <div className="hidden lg:block mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6">
          <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-4">All Questions</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 text-sm ${
                  idx === currentQuestion
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white ring-4 ring-indigo-100 dark:ring-indigo-900 transform scale-110 z-10'
                    : selectedAnswers[idx] !== null
                    ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                }`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        </div>
        
        {/* Chat Assistant - Desktop Sidebar */}
        <ChatAssistant
          currentQuestion={currentQ}
          questionIndex={currentQuestion}
          isCollapsed={isChatCollapsed}
          onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
          context="assessment"
          allowModeSwitch={false}
        />
      </div>
    </div>
  );
}
