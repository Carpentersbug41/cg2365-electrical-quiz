'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';

type AdminProfileRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'student' | 'admin';
  course_id: string | null;
  tutor_profile_summary: string | null;
  updated_at: string;
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

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);
  const [draftByUser, setDraftByUser] = useState<Record<string, string>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const filteredProfiles = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return profiles;
    return profiles.filter((row) => {
      const haystack = [
        row.email ?? '',
        row.display_name ?? '',
        row.user_id,
        row.role,
        row.course_id ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [profiles, search]);

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAuthedFetch('/api/admin/users/profiles', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || data.success === false || !Array.isArray(data.profiles)) {
        throw new Error(data.message ?? 'Failed to load user profiles.');
      }
      const nextProfiles = data.profiles as AdminProfileRow[];
      setProfiles(nextProfiles);
      setDraftByUser(
        Object.fromEntries(nextProfiles.map((row) => [row.user_id, row.tutor_profile_summary ?? '']))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfiles();
  }, []);

  const saveProfileSummary = async (userId: string) => {
    setSavingUserId(userId);
    setError(null);
    setInfo(null);
    try {
      const response = await adminAuthedFetch('/api/admin/users/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tutorProfileSummary: draftByUser[userId] ?? '',
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false || !data.profile) {
        throw new Error(data.message ?? 'Failed to save profile summary.');
      }

      const updated = data.profile as AdminProfileRow;
      setProfiles((prev) => prev.map((row) => (row.user_id === userId ? updated : row)));
      setDraftByUser((prev) => ({ ...prev, [userId]: updated.tutor_profile_summary ?? '' }));
      setInfo(`Saved profile injection for ${updated.email ?? updated.user_id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile summary.');
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">User Tutor Profile Injections</h1>
              <p className="mt-2 text-sm text-slate-600">
                Edit the short personalization text injected into tutor prompts. Keep it to 1-3 sentences.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={courseHref('/admin')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back to Admin
              </Link>
              <button
                type="button"
                onClick={() => void loadProfiles()}
                disabled={loading}
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100 disabled:opacity-60"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by email, name, user id, role..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm md:max-w-md"
            />
            <p className="text-sm text-slate-500">
              Showing {filteredProfiles.length} of {profiles.length} users
            </p>
          </div>
        </section>

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

        <section className="space-y-3">
          {filteredProfiles.map((row) => {
            const draft = draftByUser[row.user_id] ?? '';
            const isSaving = savingUserId === row.user_id;
            const unchanged = (row.tutor_profile_summary ?? '') === draft;
            return (
              <article key={row.user_id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{row.display_name ?? row.email ?? row.user_id}</p>
                    <p className="text-xs text-slate-500">
                      {row.email ?? 'No email'} | {row.role} | course {row.course_id ?? '-'}
                    </p>
                    <p className="text-xs text-slate-400">User ID: {row.user_id}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    Updated {new Date(row.updated_at).toLocaleString()}
                  </p>
                </div>
                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Tutor profile injection
                  <textarea
                    value={draft}
                    onChange={(event) =>
                      setDraftByUser((prev) => ({ ...prev, [row.user_id]: event.target.value.slice(0, 500) }))
                    }
                    rows={3}
                    placeholder="Student prefers concise step-by-step explanations and calm encouragement. Use sports examples where relevant."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-500">{draft.length}/500 characters</p>
                  <button
                    type="button"
                    onClick={() => void saveProfileSummary(row.user_id)}
                    disabled={isSaving || unchanged}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </article>
            );
          })}

          {!loading && filteredProfiles.length === 0 && (
            <article className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No users found for this filter.
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
