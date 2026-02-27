'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { courseHref } from '@/lib/routing/courseHref';

type LessonOption = {
  lessonId: string;
  title: string;
};

type LessonsStatusResponse = {
  success: boolean;
  lessons?: LessonOption[];
  error?: string;
};

type CloneResponse = {
  success: boolean;
  error?: string;
  lessonId?: string;
  embedUrl?: string;
  repo?: {
    owner: string;
    name: string;
    path: string;
  };
};

export default function AdminSimulationsPage() {
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CloneResponse | null>(null);

  const [lessonId, setLessonId] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [embedPath, setEmbedPath] = useState('');
  const [overwrite, setOverwrite] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadLessons = async () => {
      setIsLoadingLessons(true);
      setError(null);

      try {
        const response = await fetch('/api/lessons-status');
        const data = (await response.json()) as LessonsStatusResponse;
        if (!response.ok || !data.success || !Array.isArray(data.lessons)) {
          throw new Error(data.error || 'Failed to load lessons.');
        }

        if (!mounted) return;
        setLessons(data.lessons);
        if (data.lessons.length > 0) {
          setLessonId(data.lessons[0].lessonId);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load lessons.');
      } finally {
        if (mounted) setIsLoadingLessons(false);
      }
    };

    void loadLessons();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedLessonTitle = useMemo(() => {
    const selected = lessons.find((lesson) => lesson.lessonId === lessonId);
    return selected?.title ?? '';
  }, [lessons, lessonId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lessonId || !repoUrl.trim()) {
      setError('Lesson and GitHub URL are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/simulations/clone-to-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          repoUrl: repoUrl.trim(),
          embedPath: embedPath.trim() || undefined,
          overwrite,
        }),
      });

      const data = (await response.json()) as CloneResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Clone/update failed.');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Clone/update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold">Simulation Clone + Lesson Iframe Linker</h1>
          <p className="mt-2 text-sm text-slate-600">
            Clone a GitHub repo into <code>src/app/simulations</code> and set the selected lesson&apos;s diagram
            <code className="ml-1">embedUrl</code>.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Lesson</span>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={lessonId}
                onChange={(event) => setLessonId(event.target.value)}
                disabled={isLoadingLessons || isSubmitting}
              >
                {lessons.map((lesson) => (
                  <option key={lesson.lessonId} value={lesson.lessonId}>
                    {lesson.lessonId} - {lesson.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">GitHub Repo URL</span>
              <input
                type="url"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                placeholder="https://github.com/owner/repo.git"
                className="rounded-lg border border-slate-300 px-3 py-2"
                disabled={isSubmitting}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Embed Path (optional)</span>
              <input
                type="text"
                value={embedPath}
                onChange={(event) => setEmbedPath(event.target.value)}
                placeholder="index.html or /custom/path"
                className="rounded-lg border border-slate-300 px-3 py-2"
                disabled={isSubmitting}
              />
            </label>

            <label className="mt-7 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(event) => setOverwrite(event.target.checked)}
                disabled={isSubmitting}
              />
              Overwrite existing simulation folder if present
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoadingLessons}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Cloning + Updating...' : 'Clone and Link to Lesson'}
          </button>

          {error && <p className="text-sm font-medium text-red-700">{error}</p>}
        </form>

        {result?.success && (
          <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-sm text-emerald-900">
            <p className="font-semibold">Updated lesson iframe successfully.</p>
            <p className="mt-2">
              Lesson: <strong>{result.lessonId}</strong>
              {selectedLessonTitle ? ` (${selectedLessonTitle})` : ''}
            </p>
            <p>Embed URL: <code>{result.embedUrl}</code></p>
            <p>Cloned to: <code>{result.repo?.path}</code></p>
            <a
              className="mt-3 inline-block rounded-md border border-emerald-500 px-3 py-1.5 font-medium hover:bg-emerald-100"
              href={courseHref(`/learn/${result.lessonId ?? ''}`)}
            >
              Open lesson
            </a>
          </section>
        )}
      </div>
    </main>
  );
}

