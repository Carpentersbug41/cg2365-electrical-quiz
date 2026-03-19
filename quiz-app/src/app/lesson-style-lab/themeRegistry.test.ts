import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LESSON_LAB_THEME,
  isLessonLabTheme,
  resolveLessonLabTheme,
} from '@/app/lesson-style-lab/themeRegistry';

describe('lesson style lab theme registry', () => {
  it('accepts the supported showcase theme ids', () => {
    expect(isLessonLabTheme('luxe-editorial')).toBe(true);
    expect(isLessonLabTheme('glass-aurora')).toBe(true);
    expect(isLessonLabTheme('coastal-studio')).toBe(true);
    expect(isLessonLabTheme('midnight-velvet')).toBe(true);
    expect(isLessonLabTheme('mono-atelier')).toBe(true);
    expect(isLessonLabTheme('none')).toBe(true);
  });

  it('rejects legacy theme ids and unknown values', () => {
    expect(isLessonLabTheme('swiss')).toBe(false);
    expect(isLessonLabTheme('studio')).toBe(false);
    expect(isLessonLabTheme('unknown-theme')).toBe(false);
  });

  it('falls back to the default showcase theme when the query param is invalid', () => {
    expect(resolveLessonLabTheme(undefined)).toBe(DEFAULT_LESSON_LAB_THEME);
    expect(resolveLessonLabTheme('swiss')).toBe(DEFAULT_LESSON_LAB_THEME);
    expect(resolveLessonLabTheme('bad-theme')).toBe(DEFAULT_LESSON_LAB_THEME);
  });

  it('preserves no-theme and valid art-directed themes', () => {
    expect(resolveLessonLabTheme('none')).toBe('none');
    expect(resolveLessonLabTheme('mono-atelier')).toBe('mono-atelier');
  });
});
