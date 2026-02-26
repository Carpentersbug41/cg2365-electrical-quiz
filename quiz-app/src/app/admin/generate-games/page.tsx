'use client';

import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameGeneratorForm from '@/components/admin/GameGeneratorForm';

export default function GenerateGamesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedLessonFilename = searchParams.get('lesson');

  return (
    <div className="admin-page min-h-screen bg-[linear-gradient(120deg,#f5f7fa_0%,#eef9f8_42%,#fff4e8_100%)] dark:bg-[linear-gradient(120deg,#0f172a_0%,#042f2e_45%,#3f1d0e_100%)]">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/15" />
        <div className="absolute bottom-0 -left-20 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/15" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-black/5 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300/70 dark:bg-slate-700/70" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#0ea5e9,#06b6d4_55%,#f59e0b)] flex items-center justify-center shadow-lg shadow-cyan-900/20">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Microbreak Game Generator
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Build high-energy lesson interruptions in seconds
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-cyan-300/70 bg-cyan-100/80 px-3 py-1 text-xs font-semibold text-cyan-900 dark:border-cyan-600/60 dark:bg-cyan-900/30 dark:text-cyan-200">
                <Sparkles className="h-3 w-3" />
                Admin Tool
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[linear-gradient(135deg,#cffafe,#fde68a)] dark:bg-[linear-gradient(135deg,#164e63,#78350f)] flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-cyan-700 dark:text-cyan-200" />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                About Microbreak Games
              </h2>
              <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
                Microbreaks are short activities (60-120 seconds) that reduce cognitive fatigue while reinforcing key concepts. They are strategically placed throughout lessons to help learners maintain focus and improve retention.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-semibold bg-cyan-100 text-cyan-900 rounded-full dark:bg-cyan-900/40 dark:text-cyan-200">
                  Matching: Term -&gt; Definition
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-900 rounded-full dark:bg-emerald-900/40 dark:text-emerald-200">
                  Sorting: Two Categories
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-900 rounded-full dark:bg-amber-900/40 dark:text-amber-200">
                  Spot the Error
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-rose-100 text-rose-900 rounded-full dark:bg-rose-900/40 dark:text-rose-200">
                  Quick Win Sprint
                </span>
              </div>
            </div>
          </div>
        </div>

        <GameGeneratorForm initialSelectedLessonFilename={preselectedLessonFilename} />

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            Games are generated using AI based on the lesson&apos;s vocabulary and content.
            {' '}
            <span className="font-semibold text-slate-900 dark:text-white">Preview before saving</span> to ensure quality.
          </p>
        </div>
      </main>
    </div>
  );
}
