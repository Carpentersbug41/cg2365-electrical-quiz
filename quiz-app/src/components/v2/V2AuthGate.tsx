'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface V2AuthGateProps {
  children: ReactNode;
}

export default function V2AuthGate({ children }: V2AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const client = getSupabaseBrowserClient();
      if (!client) {
        const qs = searchParams.toString();
        const next = `${pathname || '/v2'}${qs ? `?${qs}` : ''}`;
        router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
        return;
      }
      const { data, error } = await client.auth.getSession();
      if (!active) return;
      if (error || !data.session?.user) {
        const qs = searchParams.toString();
        const next = `${pathname || '/v2'}${qs ? `?${qs}` : ''}`;
        router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
        return;
      }
      setAuthorized(true);
    };

    void run();
    return () => {
      active = false;
    };
  }, [pathname, router, searchParams]);

  if (!authorized) {
    return (
      <main>
        <h1>Checking V2 sign-in...</h1>
      </main>
    );
  }

  return <>{children}</>;
}

