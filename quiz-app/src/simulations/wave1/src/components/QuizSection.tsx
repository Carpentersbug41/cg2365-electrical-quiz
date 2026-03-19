import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  id: number;
  type: "recall" | "connection" | "synthesis";
  question: string;
  hint: string;
  answerKeywords: string[];
  explanation: string;
}

interface QuizProps {
  title: string;
  questions: Question[];
}

export default function QuizSection({ title, questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<
    Record<number, "correct" | "incorrect" | null>
  >({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});

  const handleSubmit = (id: number) => {
    const answer = answers[id] || "";
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    const isCorrect = question.answerKeywords.some((keyword) =>
      answer.toLowerCase().includes(keyword.toLowerCase()),
    );

    setFeedback((prev) => ({
      ...prev,
      [id]: isCorrect ? "correct" : "incorrect",
    }));

    if (
      isCorrect &&
      currentQuestionIndex < questions.length - 1 &&
      currentQuestionIndex === questions.findIndex((q) => q.id === id)
    ) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-slate-50 border-b border-gray-100 p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500">
            Questions unlock as you complete each one in order
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {questions.map((q, index) => {
          const isUnlocked = index <= currentQuestionIndex;
          const isCompleted = feedback[q.id] === "correct";
          const currentFeedback = feedback[q.id];

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isUnlocked ? 1 : 0.5, y: 0 }}
              className={`relative p-6 rounded-xl border-2 transition-colors ${
                isCompleted
                  ? "border-green-100 bg-green-50/30"
                  : isUnlocked
                    ? "border-indigo-100 bg-white shadow-sm"
                    : "border-gray-100 bg-gray-50"
              }`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Lock size={24} />
                    <span className="text-sm font-medium">
                      Complete previous question to unlock
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1 block">
                    Question {index + 1} of {questions.length} • Level{" "}
                    {q.type === "recall"
                      ? "1: Recall"
                      : q.type === "connection"
                        ? "2: Connection"
                        : "3: Synthesis"}
                  </span>
                  <h3 className="text-lg font-medium text-slate-800">
                    {q.question}
                  </h3>
                </div>
                {isCompleted && (
                  <CheckCircle2
                    className="text-green-500 flex-shrink-0"
                    size={24}
                  />
                )}
              </div>

              <div className="space-y-4">
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  disabled={!isUnlocked || isCompleted}
                  placeholder="Type your answer... (explain your thinking)"
                  className="w-full min-h-[100px] p-4 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500"
                />

                <AnimatePresence>
                  {currentFeedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={`p-4 rounded-lg flex items-start gap-3 ${
                        currentFeedback === "correct"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      {currentFeedback === "correct" ? (
                        <CheckCircle2 className="mt-0.5" size={18} />
                      ) : (
                        <XCircle className="mt-0.5" size={18} />
                      )}
                      <div>
                        <p className="font-medium">
                          {currentFeedback === "correct"
                            ? "Correct!"
                            : "Not quite right. Try again."}
                        </p>
                        {currentFeedback === "correct" && (
                          <p className="text-sm mt-1 opacity-90">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isCompleted && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        setShowHint((prev) => ({
                          ...prev,
                          [q.id]: !prev[q.id],
                        }))
                      }
                      className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle size={16} />
                      Need a hint?
                    </button>
                    <button
                      onClick={() => handleSubmit(q.id)}
                      disabled={!answers[q.id]?.trim()}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      Submit Answer
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {showHint[q.id] && !isCompleted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm"
                    >
                      <strong className="block mb-1">Hint:</strong>
                      {q.hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
