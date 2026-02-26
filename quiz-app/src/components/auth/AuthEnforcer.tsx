'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface AuthEnforcerProps {
  children: ReactNode;
}

const COURSE_PREFIX = '/2365';
const PUBLIC_PATH_PREFIXES = ['/auth'];

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

export default function AuthEnforcer({ children }: AuthEnforcerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const normalizedPathname = useMemo(
    () => normalizePathname(pathname || '/'),
    [pathname]
  );

  useEffect(() => {
    const currentPath = normalizedPathname || '/';
    if (isPublicPath(currentPath)) {
      setAuthorized(true);
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      const nextTarget = `${currentPath}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
      setAuthorized(false);
      return;
    }

    let isActive = true;

    const validateSession = async () => {
      const { data, error } = await client.auth.getUser();
      if (!isActive) {
        return;
      }

      if (error || !data.user) {
        const nextTarget = `${currentPath}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    };

    void validateSession();

    const { data: authSubscription } = client.auth.onAuthStateChange((event, session) => {
      if (!isActive || isPublicPath(currentPath)) {
        return;
      }

      if (event === 'SIGNED_OUT' || !session?.user) {
        const nextTarget = `${currentPath}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    });

    return () => {
      isActive = false;
      authSubscription.subscription.unsubscribe();
    };
  }, [normalizedPathname, router, searchParams]);

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
