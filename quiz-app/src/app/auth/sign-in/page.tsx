'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';

type AuthMode = 'sign-in' | 'sign-up';

function isSafeRedirect(value: string | null): value is string {
  return typeof value === 'string' && value.startsWith('/');
}

function friendlyAuthError(message: string, mode: AuthMode): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('email not confirmed')) {
    return 'Check your inbox and confirm your email before signing in.';
  }
  if (normalized.includes('user not found') || normalized.includes('invalid login credentials')) {
    return mode === 'sign-in'
      ? "We couldn't find an account for that email. Try Sign up first."
      : 'That email is not registered yet. Use Sign up to create an account.';
  }
  if (normalized.includes('already registered') || normalized.includes('already been registered')) {
    return 'This email already has an account. Switch to Sign in.';
  }
  if (normalized.includes('signups not allowed') || normalized.includes('signup is disabled')) {
    return 'New sign-ups are currently disabled. Please contact an admin.';
  }
  if (normalized.includes('email rate limit')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  if (normalized.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (normalized.includes('password should be')) {
    return 'Password must meet the minimum length requirement.';
  }
  if (normalized.includes('weak password')) {
    return 'Choose a stronger password and try again.';
  }
  return 'Authentication failed. Please try again.';
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('sign-in');
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    const client = getSupabaseBrowserClient();
    if (!client) {
      setErrorMessage('Supabase environment variables are missing.');
      return;
    }

    setIsSubmitting(true);
    const nextTarget = isSafeRedirect(searchParams.get('next'))
      ? searchParams.get('next')!
      : courseHref('/onboarding');

    if (mode === 'sign-up' && password !== confirmPassword) {
      setIsSubmitting(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    let error: string | null = null;

    if (mode === 'sign-in') {
      const { error: signInError } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        error = signInError.message;
      } else {
        setIsSubmitting(false);
        router.replace(nextTarget);
        return;
      }
    } else {
      const { data, error: signUpError } = await client.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        error = signUpError.message;
      } else if (data.session) {
        setIsSubmitting(false);
        router.replace(nextTarget);
        return;
      } else {
        setStatusMessage('Account created. If email confirmation is enabled, please check your inbox.');
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(friendlyAuthError(error, mode));
      return;
    }
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account access</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in with your email and password.
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
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('sign-in');
                  setStatusMessage(null);
                  setErrorMessage(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  mode === 'sign-in'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('sign-up');
                  setStatusMessage(null);
                  setErrorMessage(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  mode === 'sign-up'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Sign up
              </button>
            </div>
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
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                placeholder="Enter password"
                minLength={6}
              />
            </label>
            {mode === 'sign-up' && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Confirm password
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
                  placeholder="Re-enter password"
                  minLength={6}
                />
              </label>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
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
          <Link href={courseHref('/')} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
