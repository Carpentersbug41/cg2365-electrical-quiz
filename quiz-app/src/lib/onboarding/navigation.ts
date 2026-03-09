export function isSafeAppRedirect(value: string | null): value is string {
  return typeof value === 'string' && value.startsWith('/');
}

async function isOnboardingComplete(fetcher: (path: string, init?: RequestInit) => Promise<Response>) {
  const response = await fetcher('/api/onboarding/profile', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) {
    return null;
  }

  const payload = (await response.json().catch(() => null)) as { onboardingComplete?: boolean } | null;
  if (!payload || typeof payload.onboardingComplete !== 'boolean') {
    return null;
  }

  return payload.onboardingComplete;
}

export async function resolveDefaultPostAuthTarget(fetcher: (path: string, init?: RequestInit) => Promise<Response>) {
  try {
    const onboardingComplete = await isOnboardingComplete(fetcher);
    if (onboardingComplete === false) {
      return '/onboarding';
    }

    const response = await fetcher('/api/v2/enrollment/ensure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      return '/v2/learn';
    }
  } catch {
    // Fall through to legacy onboarding path.
  }

  return null;
}
