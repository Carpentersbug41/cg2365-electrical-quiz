'use client';

import { useState } from 'react';
import Link from 'next/link';
import Quiz from '@/components/Quiz';
import { questions } from '@/data/questions';

export default function QuizPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  // Calculate question counts for each section
  const healthAndSafetyCount = questions.filter(q => q.section === "Health and Safety").length;
  const communicationCount = questions.filter(q => q.section === "Communication").length;
  const scienceCount = questions.filter(q => q.section === "Science 2365 Level 2").length;

  // Section selection screen
  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              &larr; Back to Home
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                2365 Quiz Platform
              </h1>
              <p className="text-xl text-gray-600">
                Select a test section to begin
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Health and Safety Section */}
              <button
                onClick={() => setSelectedSection("Health and Safety")}
                className="group relative p-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 flex flex-col justify-between"
              >
                <div className="text-center w-full">
                  <div className="text-6xl mb-4">⚡</div>
                  <h2 className="text-2xl font-bold mb-3">Health & Safety</h2>
                  <p className="text-red-100 text-lg mb-4">
                    2365 Level 2 & 3 (201/601)
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm w-full">
                  <p className="text-sm font-semibold">{healthAndSafetyCount} Questions Available</p>
                </div>
              </button>

              {/* Communication Section */}
              <button
                onClick={() => setSelectedSection("Communication")}
                className="group relative p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 flex flex-col justify-between"
              >
                <div className="text-center w-full">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold mb-3">Communication</h2>
                  <p className="text-blue-100 text-lg mb-4">
                    2365 Level 2 (210)
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm w-full">
                  <p className="text-sm font-semibold">{communicationCount} Questions Available</p>
                </div>
              </button>

              {/* Science Section */}
              <button
                onClick={() => setSelectedSection("Science 2365 Level 2")}
                className="group relative p-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 flex flex-col justify-between"
              >
                <div className="text-center w-full">
                  <div className="text-6xl mb-4">🔬</div>
                  <h2 className="text-2xl font-bold mb-3">Science</h2>
                  <p className="text-green-100 text-lg mb-4">
                    2365 Level 2 (202)
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm w-full">
                  <p className="text-sm font-semibold">{scienceCount} Questions Available</p>
                </div>
              </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <h3 className="font-semibold text-indigo-900 mb-3 flex items-center text-lg">
                <span className="text-2xl mr-3">ℹ️</span>
                Getting Started
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 text-indigo-600 font-bold">1.</span>
                  <span>Choose a test section from the options above</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-indigo-600 font-bold">2.</span>
                  <span>Select how many questions you want to practice</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-indigo-600 font-bold">3.</span>
                  <span>Answer all questions and review your results</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen with selected section
  return (
    <Quiz 
      section={selectedSection} 
      onBack={() => setSelectedSection(null)} 
    />
  );
}



