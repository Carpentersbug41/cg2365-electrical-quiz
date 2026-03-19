'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';
import { SUPPORTED_COURSE_PREFIXES } from '@/lib/routing/curricula';

interface AuthEnforcerProps {
  children: ReactNode;
}

const PUBLIC_PATH_PREFIXES = ['/auth', '/lesson-style-lab'];
const ONBOARDING_PATH = '/onboarding';
const SESSION_CHECK_TIMEOUT_MS = 8000;
const DEV_BYPASS_PATHS = new Set(['/simple-chatbot', '/admin/dynamic-generate', '/admin/dynamic-module']);
const DEV_BYPASS_QUERY_KEY = 'devBypassAuth';

export function normalizeProtectedPathname(pathname: string): string {
  for (const prefix of SUPPORTED_COURSE_PREFIXES) {
    if (pathname === prefix) {
      return '/';
    }
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length);
    }
  }
  return pathname;
}

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isV2Path(pathname: string): boolean {
  return pathname === '/v2' || pathname.startsWith('/v2/');
}

function isOnboardingPath(pathname: string): boolean {
  return pathname === ONBOARDING_PATH || pathname.startsWith(`${ONBOARDING_PATH}/`);
}

function isLocalDevelopmentHost(hostname: string | null | undefined): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
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
    () => normalizeProtectedPathname(pathname || '/'),
    [pathname]
  );
  const nextTarget = useMemo(() => {
    const qs = searchParams?.toString() ?? '';
    return `${normalizedPathname || '/'}${qs ? `?${qs}` : ''}`;
  }, [normalizedPathname, searchParams]);
  const allowSimpleChatbotDevBypass = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const windowNormalizedPath = normalizeProtectedPathname(window.location.pathname || '/');
    const effectivePath = DEV_BYPASS_PATHS.has(normalizedPathname) ? normalizedPathname : windowNormalizedPath;
    if (!DEV_BYPASS_PATHS.has(effectivePath)) return false;
    const queryValue =
      searchParams?.get(DEV_BYPASS_QUERY_KEY) ??
      new URLSearchParams(window.location.search).get(DEV_BYPASS_QUERY_KEY) ??
      '';
    if (queryValue !== '1') return false;
    return isLocalDevelopmentHost(window.location.hostname);
  }, [normalizedPathname, searchParams]);

  useEffect(() => {
    const currentPath = normalizedPathname || '/';
    if (allowSimpleChatbotDevBypass) {
      setAuthorized(true);
      return;
    }
    if (isPublicPath(currentPath) || isV2Path(currentPath) || isOnboardingPath(currentPath)) {
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
  }, [allowSimpleChatbotDevBypass, nextTarget, normalizedPathname, router]);

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
