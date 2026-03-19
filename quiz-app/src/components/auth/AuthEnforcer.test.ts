import { describe, expect, it } from 'vitest';
import { isPublicPath, normalizeProtectedPathname } from '@/components/auth/AuthEnforcer';

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

describe('isPublicPath', () => {
  it('treats the lesson style lab as public so auth checks do not block it', () => {
    expect(isPublicPath('/lesson-style-lab')).toBe(true);
    expect(isPublicPath('/lesson-style-lab?lessonId=202-5B&theme=swiss')).toBe(true);
  });

  it('keeps protected learning routes behind auth', () => {
    expect(isPublicPath('/learn')).toBe(false);
    expect(isPublicPath('/learn/202-5B')).toBe(false);
  });
});
