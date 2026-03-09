import { describe, expect, it, vi } from 'vitest';
import { isSafeAppRedirect, resolveDefaultPostAuthTarget } from '@/lib/onboarding/navigation';

describe('isSafeAppRedirect', () => {
  it('accepts app-relative paths only', () => {
    expect(isSafeAppRedirect('/v2/learn')).toBe(true);
    expect(isSafeAppRedirect('https://example.com')).toBe(false);
    expect(isSafeAppRedirect(null)).toBe(false);
  });
});

describe('resolveDefaultPostAuthTarget', () => {
  it('prefers V2 learn when enrollment check succeeds', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    await expect(resolveDefaultPostAuthTarget(fetcher)).resolves.toBe('/v2/learn');
  });

  it('falls back to null when enrollment check fails', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false });
    await expect(resolveDefaultPostAuthTarget(fetcher)).resolves.toBeNull();
  });
});

