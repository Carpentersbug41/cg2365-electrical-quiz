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
  it('prefers onboarding when the profile is incomplete', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ onboardingComplete: false }),
      });

    await expect(resolveDefaultPostAuthTarget(fetcher)).resolves.toBe('/onboarding');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      '/api/onboarding/profile',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('prefers V2 learn when enrollment check succeeds', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ onboardingComplete: true }),
      })
      .mockResolvedValueOnce({ ok: true });

    await expect(resolveDefaultPostAuthTarget(fetcher)).resolves.toBe('/v2/learn');
  });

  it('falls back to null when enrollment check fails', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ onboardingComplete: true }),
      })
      .mockResolvedValueOnce({ ok: false });

    await expect(resolveDefaultPostAuthTarget(fetcher)).resolves.toBeNull();
  });
});
