'use client';

import { useState } from 'react';
import Link from 'next/link';
import Quiz from '@/components/Quiz';
import { questions } from '@/data/questions';
import { getLessonsByUnit, unitMetadata } from '@/data/lessons/lessonIndex';

type TabType = 'topic' | 'lesson';

export default function QuizPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('topic');
  
  // Calculate question counts for each section
  const healthAndSafetyCount = questions.filter(q => q.section === "Health and Safety").length;
  const communicationCount = questions.filter(q => q.section === "Communication").length;
  const scienceCount = questions.filter(q => q.section === "Science 2365 Level 2").length;

  // Get lessons organized by unit
  const lessonsByUnit = getLessonsByUnit();

  // Section selection screen
  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-5xl w-full">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              &larr; Back to Home
            </Link>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
                2365 Quiz Platform
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-300">
                Choose how you want to practice
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-slate-700 p-1 bg-gray-100 dark:bg-slate-900">
                <button
                  onClick={() => setActiveTab('topic')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'topic'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                  }`}
                >
                  By Topic
                </button>
                <button
                  onClick={() => setActiveTab('lesson')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'lesson'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                  }`}
                >
                  By Lesson
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'topic' && (
              <div>
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

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center text-lg">
                    <span className="text-2xl mr-3">ℹ️</span>
                    Getting Started
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold">1.</span>
                      <span>Choose a test section from the options above</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold">2.</span>
                      <span>Select how many questions you want to practice</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold">3.</span>
                      <span>Answer all questions and review your results</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'lesson' && (
              <div>
                <div className="space-y-6 mb-8">
                  {Object.entries(lessonsByUnit).map(([unitNumber, lessons]) => {
                    const metadata = unitMetadata[unitNumber as keyof typeof unitMetadata];
                    if (!metadata) return null;

                    const colorClasses = {
                      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
                      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                    };

                    return (
                      <div key={unitNumber} className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">{metadata.icon}</span>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                              {metadata.fullName}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Unit {unitNumber}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {lessons.filter(lesson => lesson.available && lesson.questionCount > 0).map(lesson => (
                            <Link
                              key={lesson.id}
                              href={`/learn/${lesson.id}/quiz`}
                              className={`block p-6 bg-gradient-to-br ${colorClasses[metadata.color as keyof typeof colorClasses]} text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold mb-1">{lesson.title}</h3>
                                  <p className="text-sm opacity-90 mb-2">{lesson.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                                  {lesson.topic}
                                </span>
                                <span className="text-sm font-semibold">
                                  {lesson.questionCount} questions →
                                </span>
                              </div>
                            </Link>
                          ))}

                          {lessons.filter(lesson => lesson.available && lesson.questionCount > 0).length === 0 && (
                            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-slate-400">
                              <p className="text-lg mb-2">📚 No quizzes available yet</p>
                              <p className="text-sm">Check back soon for more lessons!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center text-lg">
                    <span className="text-2xl mr-3">💡</span>
                    Lesson-Specific Quizzes
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span>Each quiz tests knowledge from a specific lesson</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span>Questions are tailored to the learning outcomes of that lesson</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span>Perfect for reviewing after completing a lesson</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
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
