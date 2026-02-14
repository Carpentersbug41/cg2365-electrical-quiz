'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return;
    }

    client.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: authSubscription } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    const client = getSupabaseBrowserClient();
    if (!client) {
      setErrorMessage('Supabase environment variables are missing.');
      return;
    }

    setIsSubmitting(true);
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=/learn`
        : undefined;

    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setStatusMessage('Magic link sent. Check your email to continue.');
  };

  const handleSignOut = async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return;
    }

    await client.auth.signOut();
    setStatusMessage('Signed out.');
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Use an email magic link to enable server-side progress tracking.
        </p>

        {user ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 p-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              Signed in as <strong>{user.email}</strong>
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending link...' : 'Send magic link'}
            </button>
          </form>
        )}

        {statusMessage && (
          <p className="mt-4 rounded-lg bg-sky-50 dark:bg-sky-900/30 p-3 text-sm text-sky-800 dark:text-sky-300">
            {statusMessage}
          </p>
        )}

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-900/30 p-3 text-sm text-rose-800 dark:text-rose-300">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 text-sm">
          <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
