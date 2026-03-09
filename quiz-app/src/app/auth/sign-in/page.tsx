'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';
import { isSafeAppRedirect, resolveDefaultPostAuthTarget } from '@/lib/onboarding/navigation';

type AuthMode = 'sign-in' | 'sign-up';

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-4 4.8" />
      <path d="M6.2 6.3C3.7 8.1 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 2.1-.2" />
    </svg>
  );
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
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
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
    const explicitNextTarget = isSafeAppRedirect(searchParams.get('next')) ? searchParams.get('next')! : null;

    if (mode === 'sign-up' && password !== confirmPassword) {
      setIsSubmitting(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    let error: string | null = null;

    if (mode === 'sign-in') {
      const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        error = signInError.message;
      } else {
        const nextTarget =
          explicitNextTarget ??
          (await resolveDefaultPostAuthTarget(async (path, init) => {
            const token = signInData.session?.access_token ?? '';
            const headers = new Headers(init?.headers);
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return fetch(path, {
              ...init,
              headers,
            });
          })) ??
          courseHref('/onboarding');
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
        const nextTarget = explicitNextTarget ?? courseHref('/onboarding');
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

  const handleForgotPassword = async () => {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Enter your email address first, then use Forgot password.');
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setErrorMessage('Supabase environment variables are missing.');
      return;
    }

    setIsSendingReset(true);
    const redirectTo =
      typeof window === 'undefined' ? undefined : `${window.location.origin}/auth/reset-password`;

    const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setIsSendingReset(false);

    if (error) {
      setErrorMessage(friendlyAuthError(error.message, 'sign-in'));
      return;
    }

    setStatusMessage('Password reset email sent. Check your inbox and spam folder.');
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
                  setShowPassword(false);
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
                  setShowPassword(false);
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
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Password
                </span>
                {mode === 'sign-in' && (
                  <button
                    type="button"
                    onClick={() => void handleForgotPassword()}
                    disabled={isSendingReset}
                    className="text-xs font-medium text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-indigo-400"
                  >
                    {isSendingReset ? 'Sending...' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 pr-11 text-slate-900 dark:text-slate-100"
                  placeholder="Enter password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </label>
            {mode === 'sign-up' && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Confirm password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 pr-11 text-slate-900 dark:text-slate-100"
                    placeholder="Re-enter password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
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
