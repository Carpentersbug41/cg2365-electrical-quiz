import { describe, expect, it } from 'vitest';
import { normalizeProtectedPathname } from '@/components/auth/AuthEnforcer';

describe('normalizeProtectedPathname', () => {
  it('strips the GCSE Biology prefix so onboarding is recognized correctly', () => {
    expect(normalizeProtectedPathname('/gcse/science/biology/onboarding')).toBe('/onboarding');
    expect(normalizeProtectedPathname('/gcse/science/biology/v2/learn')).toBe('/v2/learn');
  });

  it('strips the 2365 prefix and preserves root', () => {
    expect(normalizeProtectedPathname('/2365')).toBe('/');
    expect(normalizeProtectedPathname('/2365/learn')).toBe('/learn');
  });
});
