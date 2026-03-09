'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { v2AuthedFetch } from '@/lib/v2/client';

interface V2AuthGateProps {
  children: ReactNode;
}

export default function V2AuthGate({ children }: V2AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const qs = searchParams.toString();
      const next = `${pathname || '/v2'}${qs ? `?${qs}` : ''}`;
      const client = getSupabaseBrowserClient();
      if (!client) {
        router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
        return;
      }
      const { data, error } = await client.auth.getSession();
      if (!active) return;
      if (error || !data.session?.user) {
        router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
        return;
      }
      const onboardingResponse = await v2AuthedFetch('/api/onboarding/profile', {
        method: 'GET',
        cache: 'no-store',
      });
      if (!active) return;
      if (onboardingResponse.ok) {
        const onboardingPayload = await onboardingResponse.json().catch(() => null);
        if (onboardingPayload && onboardingPayload.onboardingComplete === false) {
          router.replace(`/onboarding?next=${encodeURIComponent(next)}`);
          return;
        }
      }
      const enrollmentResponse = await v2AuthedFetch('/api/v2/enrollment/ensure', { method: 'POST' });
      if (!active) return;
      if (!enrollmentResponse.ok) {
        const payload = await enrollmentResponse.json().catch(() => null);
        setGateError(
          payload?.message && typeof payload.message === 'string'
            ? payload.message
            : 'This account does not have V2 access.'
        );
        return;
      }
      setAuthorized(true);
    };

    void run();
    return () => {
      active = false;
    };
  }, [pathname, router, searchParams]);

  if (gateError) {
    return (
      <main>
        <h1>V2 access blocked</h1>
        <p>{gateError}</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main>
        <h1>Checking V2 sign-in...</h1>
      </main>
    );
  }

  return <>{children}</>;
}
