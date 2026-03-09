export function isSafeAppRedirect(value: string | null): value is string {
  return typeof value === 'string' && value.startsWith('/');
}

export async function resolveDefaultPostAuthTarget(fetcher: (path: string, init?: RequestInit) => Promise<Response>) {
  try {
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

