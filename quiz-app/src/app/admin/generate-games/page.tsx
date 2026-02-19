'use client';

import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GameGeneratorForm from '@/components/admin/GameGeneratorForm';

export default function GenerateGamesPage() {
  const router = useRouter();

  return (
    <div className="admin-page min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300 dark:bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Microbreak Game Generator
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-slate-400">
                    Create engaging microbreak activities for lessons
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                Admin Tool
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                About Microbreak Games
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                Microbreaks are short, engaging activities (60-120 seconds) that reduce cognitive fatigue 
                while reinforcing key concepts. They&apos;re strategically placed throughout lessons to help learners 
                maintain focus and improve retention.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                  Matching: Term ↔ Definition
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                  Sorting: Two Categories
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full">
                  Spot the Error
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full">
                  Quick Win Sprint
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Generator Form */}
        <GameGeneratorForm />

        {/* Footer Help */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
          <p>
            Games are generated using AI based on the lesson&apos;s vocabulary and content.
            {' '}
            <span className="font-medium">Preview before saving</span> to ensure quality.
          </p>
        </div>
      </main>
    </div>
  );
}
