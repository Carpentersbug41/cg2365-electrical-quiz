'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';

type PromptSettingsResponse = {
  success: boolean;
  settings: {
    lessonGenerationProfile: string;
    tutorResponseProfile: string;
  };
  limits?: {
    maxChars: number;
    minSentences: number;
    maxSentences: number;
  };
  message?: string;
};

async function adminAuthedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const client = getSupabaseBrowserClient();
  const session = client ? await client.auth.getSession() : null;
  const token = session?.data.session?.access_token ?? null;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

function sentenceCount(value: string): number {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  if (!trimmed) return 0;
  return trimmed
    .split(/(?<=[.!?])\s+/)
    .map((piece) => piece.trim())
    .filter(Boolean).length;
}

export default function AdminPromptProfilesPage() {
  const [lessonGenerationProfile, setLessonGenerationProfile] = useState('');
  const [tutorResponseProfile, setTutorResponseProfile] = useState('');
  const [savedLessonProfile, setSavedLessonProfile] = useState('');
  const [savedTutorProfile, setSavedTutorProfile] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [maxChars, setMaxChars] = useState(500);
  const [minSentences, setMinSentences] = useState(2);
  const [maxSentences, setMaxSentences] = useState(3);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAuthedFetch('/api/admin/prompt-injections', { cache: 'no-store' });
      const data = (await response.json()) as PromptSettingsResponse;
      if (!response.ok || data.success === false || !data.settings) {
        throw new Error(data.message ?? 'Failed to load prompt settings.');
      }

      setLessonGenerationProfile(data.settings.lessonGenerationProfile ?? '');
      setTutorResponseProfile(data.settings.tutorResponseProfile ?? '');
      setSavedLessonProfile(data.settings.lessonGenerationProfile ?? '');
      setSavedTutorProfile(data.settings.tutorResponseProfile ?? '');

      if (data.limits) {
        setMaxChars(data.limits.maxChars);
        setMinSentences(data.limits.minSentences);
        setMaxSentences(data.limits.maxSentences);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompt settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const changed = useMemo(
    () =>
      lessonGenerationProfile !== savedLessonProfile ||
      tutorResponseProfile !== savedTutorProfile,
    [lessonGenerationProfile, savedLessonProfile, tutorResponseProfile, savedTutorProfile]
  );

  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch('/api/admin/prompt-injections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonGenerationProfile,
          tutorResponseProfile,
        }),
      });
      const data = (await response.json()) as PromptSettingsResponse;
      if (!response.ok || data.success === false || !data.settings) {
        throw new Error(data.message ?? 'Failed to save prompt settings.');
      }

      setLessonGenerationProfile(data.settings.lessonGenerationProfile ?? '');
      setTutorResponseProfile(data.settings.tutorResponseProfile ?? '');
      setSavedLessonProfile(data.settings.lessonGenerationProfile ?? '');
      setSavedTutorProfile(data.settings.tutorResponseProfile ?? '');
      setInfo('Prompt injections updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt settings.');
    } finally {
      setSaving(false);
    }
  };

  const lessonSentenceCount = sentenceCount(lessonGenerationProfile);
  const tutorSentenceCount = sentenceCount(tutorResponseProfile);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Prompt Profile Injections</h1>
              <p className="mt-2 text-sm text-slate-600">
                Configure global 2-3 sentence profile injections for lesson generation and tutor/marking/socratic responses.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={courseHref('/admin')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back to Admin
              </Link>
              <Link
                href={courseHref('/admin/users')}
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
              >
                User Profiles
              </Link>
            </div>
          </div>
        </header>

        {error && (
          <section className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </section>
        )}
        {info && (
          <section className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">
            {info}
          </section>
        )}

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Lesson Generation Profile</h2>
          <p className="text-sm text-slate-600">
            Injected into lesson generation prompts to define tone, style, and target general learner profile.
          </p>
          <textarea
            value={lessonGenerationProfile}
            onChange={(event) => setLessonGenerationProfile(event.target.value.slice(0, maxChars))}
            rows={4}
            placeholder="Primary audience is beginner technical learners. Use clear, confidence-building language and practical examples. Keep explanations concise and outcome-aligned."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <p className="text-xs text-slate-500">
            {lessonGenerationProfile.length}/{maxChars} chars | {lessonSentenceCount} sentence(s) (required {minSentences}-{maxSentences})
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tutor/Marker/Socratic Profile</h2>
          <p className="text-sm text-slate-600">
            Global response profile for interactive learner-facing AI endpoints. Per-user onboarding profile still applies on top.
          </p>
          <textarea
            value={tutorResponseProfile}
            onChange={(event) => setTutorResponseProfile(event.target.value.slice(0, maxChars))}
            rows={4}
            placeholder="Respond with concise supportive coaching tailored to learner pace. Prioritize short hints and clear feedback before technical depth. Guide reasoning without giving away full solutions unless mode allows."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <p className="text-xs text-slate-500">
            {tutorResponseProfile.length}/{maxChars} chars | {tutorSentenceCount} sentence(s) (required {minSentences}-{maxSentences})
          </p>
        </section>

        <section className="flex justify-end">
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={loading || saving || !changed}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Prompt Profiles'}
          </button>
        </section>
      </div>
    </main>
  );
}
