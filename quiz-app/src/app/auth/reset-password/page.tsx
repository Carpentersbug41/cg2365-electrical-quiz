'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';

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

function isSafeRedirect(value: string | null): value is string {
  return typeof value === 'string' && value.startsWith('/');
}

function friendlyResetError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('expired') || normalized.includes('token') || normalized.includes('otp')) {
    return 'This reset link is invalid or expired. Request a new password reset email.';
  }
  if (normalized.includes('password should be')) {
    return 'Password must meet the minimum length requirement.';
  }
  if (normalized.includes('weak password')) {
    return 'Choose a stronger password and try again.';
  }
  return 'Password reset failed. Please try again.';
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const client = getSupabaseBrowserClient();
      if (!client) {
        setErrorMessage('Supabase environment variables are missing.');
        return;
      }

      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const authCode = searchParams.get('code');

      let authError: string | null = null;

      if (tokenHash && type) {
        const { error } = await client.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        });
        if (error) {
          authError = error.message;
        }
      } else if (authCode) {
        const { error } = await client.auth.exchangeCodeForSession(authCode);
        if (error) {
          authError = error.message;
        }
      } else {
        const { data, error } = await client.auth.getSession();
        if (error) {
          authError = error.message;
        } else if (!data.session) {
          authError = 'Missing recovery session.';
        }
      }

      if (authError) {
        setErrorMessage(friendlyResetError(authError));
        return;
      }

      setIsReady(true);
    };

    void run();
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setErrorMessage('Supabase environment variables are missing.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await client.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(friendlyResetError(error.message));
      return;
    }

    setStatusMessage('Password updated. Redirecting to sign in...');
    window.setTimeout(() => {
      const next = isSafeRedirect(searchParams.get('next'))
        ? searchParams.get('next')!
        : courseHref('/onboarding');
      router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Choose a new password for your account.
        </p>

        {isReady && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                New password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 pr-11 text-slate-900 dark:text-slate-100"
                  placeholder="Enter new password"
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

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm new password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 pr-11 text-slate-900 dark:text-slate-100"
                  placeholder="Re-enter new password"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Updating...' : 'Update password'}
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

        {!isReady && !errorMessage && (
          <p className="mt-4 rounded-lg bg-sky-50 dark:bg-sky-900/30 p-3 text-sm text-sky-800 dark:text-sky-300">
            Validating reset link...
          </p>
        )}

        <div className="mt-6 text-sm">
          <Link href="/auth/sign-in" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
