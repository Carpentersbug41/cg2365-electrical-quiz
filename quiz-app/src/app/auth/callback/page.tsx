'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

function isSafeRedirect(value: string | null): value is string {
  return typeof value === 'string' && value.startsWith('/');
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
      const next = isSafeRedirect(searchParams.get('next')) ? searchParams.get('next')! : '/learn';

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
        setErrorMessage(authError);
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
          <p className="mt-4 rounded-lg bg-rose-950/50 border border-rose-700 p-3 text-sm text-rose-200">
            {errorMessage}
          </p>
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
