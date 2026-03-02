'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLessonById, getLessonsByUnit, LessonIndexEntry } from '@/data/lessons/lessonIndex';
import { getQuizProgress } from '@/lib/progress/progressService';
import { courseHref } from '@/lib/routing/courseHref';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isAdminOverrideEmail } from '@/lib/auth/adminOverrides';

interface MasteryUnlockGateProps {
  lessonId: string;
  children: React.ReactNode;
}

type GateState = 'checking' | 'locked' | 'unlocked';

export default function MasteryUnlockGate({ lessonId, children }: MasteryUnlockGateProps) {
  const [state, setState] = useState<GateState>('checking');
  const [previousLesson, setPreviousLesson] = useState<LessonIndexEntry | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminBypass, setAdminBypass] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAdminRole = async () => {
      const client = getSupabaseBrowserClient();
      if (!client) return;

      const { data: authData } = await client.auth.getUser();
      const userId = authData.user?.id;
      const userEmail = authData.user?.email;
      if (!userId || cancelled) return;

      if (isAdminOverrideEmail(userEmail)) {
        setIsAdmin(true);
        return;
      }

      const { data } = await client
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle<{ role: 'student' | 'admin' }>();

      if (cancelled) return;
      setIsAdmin(data?.role === 'admin');
    };

    void loadAdminRole();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const currentLesson = getLessonById(lessonId);
    if (!currentLesson) {
      setState('unlocked');
      return;
    }

    const lessonsByUnit = getLessonsByUnit();
    const unitLessons = lessonsByUnit[currentLesson.unitNumber] || [];
    const currentIndex = unitLessons.findIndex((lesson) => lesson.id === lessonId);
    if (currentIndex <= 0) {
      setState('unlocked');
      return;
    }

    const previous = unitLessons[currentIndex - 1];
    setPreviousLesson(previous);

    const previousQuiz = getQuizProgress(`${previous.id}-quiz`);
    const currentQuiz = getQuizProgress(`${lessonId}-quiz`);
    const hasCurrentProgress =
      (currentQuiz?.attemptsCount ?? 0) > 0 || Boolean(currentQuiz?.masteryPending || currentQuiz?.masteryAchieved);
    const unlocked = hasCurrentProgress || Boolean(previousQuiz?.masteryAchieved);

    setState(unlocked ? 'unlocked' : 'locked');
  }, [lessonId]);

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300">Checking mastery unlock...</p>
        </div>
      </div>
    );
  }

  if (state === 'locked' && !adminBypass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-indigo-200 dark:border-indigo-700">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🔒</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Lesson Locked</h1>
              <p className="text-gray-700 dark:text-slate-300">
                Master the previous lesson before unlocking this one.
              </p>
            </div>

            {previousLesson && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">Required previous lesson</p>
                <p className="text-amber-800 dark:text-amber-200">
                  {previousLesson.id}: {previousLesson.title}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setAdminBypass(true)}
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-center transition-colors"
                >
                  Proceed (Admin)
                </button>
              )}
              {previousLesson && (
                <Link
                  href={courseHref(`/learn/${previousLesson.id}`)}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-center transition-colors"
                >
                  Go To Previous Lesson
                </Link>
              )}
              <Link
                href={courseHref('/learn')}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg font-semibold text-center transition-colors"
              >
                Back To Lessons
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
