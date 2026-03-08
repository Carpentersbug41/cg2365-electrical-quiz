'use client';

import { useEffect, useState } from 'react';
import { authedFetch } from '@/lib/api/authedFetch';
import V2Shell from '@/components/v2/V2Shell';

interface ProgressSummary {
  masteredLessons: number;
  totalLessons: number;
  totalAttempts: number;
  averageBestScore: number;
}

interface ProgressLesson {
  lessonId: string;
  lessonTitle: string;
  bestScorePercent: number;
  attemptsCount: number;
  masteryStatus: 'pending' | 'achieved';
  achievedAt: string | null;
}

export default function V2ProgressPage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [lessons, setLessons] = useState<ProgressLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authedFetch('/api/v2/progress/summary', { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Failed to load V2 progress.');
        if (cancelled) return;
        setSummary(payload.summary ?? null);
        setLessons(Array.isArray(payload.lessons) ? payload.lessons : []);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : 'Failed to load progress.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <V2Shell title="V2 Progress" subtitle="Learner outcomes from v2_mastery_records">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {summary && (
        <section>
          <p>Mastered lessons: {summary.masteredLessons}/{summary.totalLessons}</p>
          <p>Total attempts: {summary.totalAttempts}</p>
          <p>Average best score: {summary.averageBestScore}%</p>
        </section>
      )}
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.lessonId}>
            <p>{lesson.lessonId} - {lesson.lessonTitle}</p>
            <p>Status: {lesson.masteryStatus}</p>
            <p>Best score: {lesson.bestScorePercent}%</p>
            <p>Attempts: {lesson.attemptsCount}</p>
            <p>
              <a href={`/v2/learn/${encodeURIComponent(lesson.lessonId)}`}>
                Open lesson
              </a>
            </p>
          </li>
        ))}
      </ul>
    </V2Shell>
  );
}
