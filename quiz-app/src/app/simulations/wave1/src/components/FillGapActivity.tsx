import React, { useState, useEffect } from "react";
import { Play, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GapSentence {
  id: number;
  textParts: string[];
  answer: string;
  options: string[];
}

const sentences: GapSentence[] = [
  {
    id: 1,
    textParts: ["Identify the role of the medium in ", " propagation."],
    answer: "wave",
    options: ["that", "wave", "from"],
  },
  {
    id: 2,
    textParts: [
      "A Wave is defined as a ",
      " that transfers energy and information from one location to another.",
    ],
    answer: "disturbance",
    options: ["oscillation", "disturbance", "information"],
  },
  {
    id: 3,
    textParts: [
      "Recall ",
      " waves transfer energy and information without transferring matter.",
    ],
    answer: "that",
    options: ["that", "wave", "from"],
  },
  {
    id: 4,
    textParts: [
      "A Wave is defined as a disturbance that ",
      " energy and information from one location to another.",
    ],
    answer: "transfers",
    options: ["transfers", "mechanism", "substance"],
  },
  {
    id: 5,
    textParts: ["Waves and ", " Transfer"],
    answer: "energy",
    options: ["energy", "matter", "medium"],
  },
];

export default function FillGapActivity() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(30);
    setScore(0);
    setCurrentSentenceIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setIsFinished(false);
  };

  const handleOptionSelect = (option: string) => {
    if (!isActive) setIsActive(true);

    setSelectedOption(option);
    const correct = option === sentences[currentSentenceIndex].answer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
        } else {
          setIsFinished(true);
          setIsActive(false);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Activity Complete!
        </h3>
        <p className="text-slate-600 mb-6">
          You scored {score} out of {sentences.length}
        </p>
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Try Again
        </button>
      </div>
    );
  }

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Fill Gap Activity
          </h2>
          <p className="text-sm text-slate-500">
            Tap a one-word option to complete the sentence.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-slate-500">
            Score: {score}/{sentences.length}
          </div>
          <div
            className={`text-lg font-bold px-4 py-2 rounded-lg ${timeLeft <= 10 ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}
          >
            00:{timeLeft.toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="p-8">
        {!isActive && timeLeft === 30 ? (
          <div className="text-center py-12">
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-transform hover:scale-105 inline-flex items-center gap-3 shadow-lg shadow-indigo-200"
            >
              <Play size={24} fill="currentColor" />
              Start Activity
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-indigo-500 mb-4 block">
                Question {currentSentenceIndex + 1} of {sentences.length}
              </span>
              <h3 className="text-2xl font-medium text-slate-800 leading-relaxed flex flex-wrap justify-center items-center gap-2">
                {currentSentence.textParts[0]}
                <span
                  className={`inline-block min-w-[120px] h-10 border-b-2 px-4 transition-colors ${
                    isCorrect === true
                      ? "border-green-500 text-green-600"
                      : isCorrect === false
                        ? "border-red-500 text-red-600"
                        : selectedOption
                          ? "border-indigo-500 text-indigo-600"
                          : "border-slate-300"
                  }`}
                >
                  {selectedOption || ""}
                </span>
                {currentSentence.textParts[1]}
              </h3>
            </div>

            <div className="flex justify-center gap-4">
              {currentSentence.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`px-6 py-3 rounded-xl font-medium text-lg transition-all transform hover:scale-105 disabled:hover:scale-100 ${
                    selectedOption === option
                      ? isCorrect
                        ? "bg-green-500 text-white shadow-lg shadow-green-200"
                        : "bg-red-500 text-white shadow-lg shadow-red-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
