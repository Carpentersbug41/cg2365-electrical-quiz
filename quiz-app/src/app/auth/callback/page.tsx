'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { DEFAULT_COURSE_PREFIX } from '@/lib/routing/curricula';

function isSafeRedirect(value: string | null): value is string {
  return typeof value === 'string' && value.startsWith('/');
}

function friendlyCallbackError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('otp') || normalized.includes('expired') || normalized.includes('token')) {
    return 'This login link is invalid or expired. Please request a new one.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Please confirm your email and try again.';
  }
  if (normalized.includes('rate limit')) {
    return 'Too many attempts. Please wait a minute and request a new link.';
  }
  return 'Authentication could not be completed. Please try again.';
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      const next = isSafeRedirect(searchParams.get('next')) ? searchParams.get('next')! : `${DEFAULT_COURSE_PREFIX}/learn`;

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
        const { error } = await client.auth.getSession();
        if (error) {
          authError = error.message;
        }
      }

      if (authError) {
        setErrorMessage(friendlyCallbackError(authError));
        return;
      }

      router.replace(next);
    };

    void run();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h1 className="text-xl font-semibold">Completing sign-in...</h1>
        <p className="mt-2 text-sm text-slate-300">
          This page will redirect automatically once authentication is complete.
        </p>
        {errorMessage && (
          <div className="mt-4 space-y-3">
            <p className="rounded-lg bg-rose-950/50 border border-rose-700 p-3 text-sm text-rose-200">
              {errorMessage}
            </p>
            <Link
              href="/auth/sign-in"
              className="inline-flex rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function AuthCallbackFallback() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h1 className="text-xl font-semibold">Completing sign-in...</h1>
        <p className="mt-2 text-sm text-slate-300">Preparing authentication context...</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
