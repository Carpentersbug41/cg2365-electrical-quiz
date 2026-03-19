import { describe, expect, it } from 'vitest';
import { normalizeV2LessonCode } from '@/lib/v2/lessonCode';

describe('normalizeV2LessonCode', () => {
  it('normalizes legacy-style biology lesson codes to V2 codes', () => {
    expect(normalizeV2LessonCode('BIO-1-1A')).toBe('BIO-101-1A');
    expect(normalizeV2LessonCode('bio-7-2b')).toBe('BIO-107-2B');
  });

  it('leaves already-normalized or unsupported codes unchanged', () => {
    expect(normalizeV2LessonCode('BIO-101-1A')).toBe('BIO-101-1A');
    expect(normalizeV2LessonCode('PHY-201-1A')).toBe('PHY-201-1A');
    expect(normalizeV2LessonCode('INVALID')).toBe('INVALID');
  });
});
