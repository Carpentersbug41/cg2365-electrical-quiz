'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';

interface AuthEnforcerProps {
  children: ReactNode;
}

const COURSE_PREFIX = '/2365';
const PUBLIC_PATH_PREFIXES = ['/auth'];
const ONBOARDING_PATH = '/onboarding';
const SESSION_CHECK_TIMEOUT_MS = 8000;

function normalizePathname(pathname: string): string {
  if (pathname === COURSE_PREFIX) {
    return '/';
  }
  if (pathname.startsWith(`${COURSE_PREFIX}/`)) {
    return pathname.slice(COURSE_PREFIX.length);
  }
  return pathname;
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isOnboardingPath(pathname: string): boolean {
  return pathname === ONBOARDING_PATH || pathname.startsWith(`${ONBOARDING_PATH}/`);
}

function hasOnboardingSummary(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return await new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new Error(`${label} timed out after ${timeoutMs}ms`);
      error.name = 'TimeoutError';
      reject(error);
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export default function AuthEnforcer({ children }: AuthEnforcerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const normalizedPathname = useMemo(
    () => normalizePathname(pathname || '/'),
    [pathname]
  );
  const nextTarget = useMemo(() => {
    const qs = searchParams.toString();
    return `${normalizedPathname || '/'}${qs ? `?${qs}` : ''}`;
  }, [normalizedPathname, searchParams]);

  useEffect(() => {
    const currentPath = normalizedPathname || '/';
    if (isPublicPath(currentPath)) {
      setAuthorized(true);
      return;
    }

    setAuthorized(false);

    const client = getSupabaseBrowserClient();
    if (!client) {
      router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
      setAuthorized(false);
      return;
    }

    let isActive = true;

    const validateSession = async () => {
      try {
        const { data, error } = await withTimeout(
          client.auth.getSession(),
          SESSION_CHECK_TIMEOUT_MS,
          'Supabase session check'
        );
        if (!isActive) {
          return;
        }

        const session = data.session;
        if (error || !session?.user) {
          router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
          setAuthorized(false);
          return;
        }

        setAuthorized(true);

        if (!isOnboardingPath(currentPath)) {
          const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('tutor_profile_summary')
            .eq('user_id', session.user.id)
            .maybeSingle<{ tutor_profile_summary: string | null }>();

          if (!isActive) {
            return;
          }

          if (profileError || !hasOnboardingSummary(profile?.tutor_profile_summary ?? null)) {
            router.replace(`${courseHref('/onboarding')}?next=${encodeURIComponent(nextTarget)}`);
            setAuthorized(false);
            return;
          }
        }
      } catch {
        router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
        setAuthorized(false);
      }
    };

    void validateSession();

    const { data: authSubscription } = client.auth.onAuthStateChange((event, session) => {
      if (!isActive || isPublicPath(currentPath)) {
        return;
      }

      if (event === 'SIGNED_OUT' || !session?.user) {
        router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
        setAuthorized(false);
        return;
      }

      void validateSession();
    });

    return () => {
      isActive = false;
      authSubscription.subscription.unsubscribe();
    };
  }, [nextTarget, normalizedPathname, router]);

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h1 className="text-xl font-semibold">Checking sign-in...</h1>
        <p className="mt-2 text-sm text-slate-300">
          Redirecting to sign-in if needed.
        </p>
      </div>
    </main>
  );
}
