export type LessonLabThemeId =
  | 'none'
  | 'luxe-editorial'
  | 'glass-aurora'
  | 'coastal-studio'
  | 'midnight-velvet'
  | 'mono-atelier';

export type LessonLabLayoutId = 'plain' | 'luxe' | 'glass' | 'coastal' | 'midnight' | 'mono';

export interface LessonLabThemeConfig {
  id: LessonLabThemeId;
  label: string;
  heroTag: string;
  summary: string;
  mood: string;
  layout: LessonLabLayoutId;
}

export const DEFAULT_LESSON_LAB_THEME: LessonLabThemeId = 'glass-aurora';

export const LESSON_LAB_THEMES: readonly LessonLabThemeConfig[] = [
  {
    id: 'none',
    label: 'No Theme',
    heroTag: 'Pure browser defaults for inspection',
    summary: 'A stripped baseline with no lab shell styling so content can be evaluated in its raw semantic state.',
    mood: 'Utility mode',
    layout: 'plain',
  },
  {
    id: 'luxe-editorial',
    label: 'Luxe Editorial',
    heroTag: 'Magazine-scale serif drama with gallery calm',
    summary: 'Warm ivory layers, couture serif type, and quiet premium spacing inspired by boutique editorial websites.',
    mood: 'Polished, graceful, high-touch',
    layout: 'luxe',
  },
  {
    id: 'glass-aurora',
    label: 'Glass Aurora',
    heroTag: 'Glossy SaaS polish with luminous gradients',
    summary: 'A floating glass interface with soft blur, aurora color bloom, and crisp modern typography.',
    mood: 'Futuristic, glossy, vibrant',
    layout: 'glass',
  },
  {
    id: 'coastal-studio',
    label: 'Coastal Studio',
    heroTag: 'Airy lifestyle brand with sunlit calm',
    summary: 'Soft sand tones, sea-glass accents, rounded cards, and relaxed spacing that feel bright and welcoming.',
    mood: 'Fresh, relaxed, optimistic',
    layout: 'coastal',
  },
  {
    id: 'midnight-velvet',
    label: 'Midnight Velvet',
    heroTag: 'Dark luxury with spotlight contrast',
    summary: 'Cinematic gradients, rich jewel tones, and luminous accents designed to feel expensive and dramatic.',
    mood: 'Moody, luxurious, theatrical',
    layout: 'midnight',
  },
  {
    id: 'mono-atelier',
    label: 'Mono Atelier',
    heroTag: 'Portfolio-grade monochrome with sharp geometry',
    summary: 'Graphic black-and-cream framing, assertive type, and asymmetrical rhythm for a design-studio feel.',
    mood: 'Bold, curated, architectural',
    layout: 'mono',
  },
] as const;

export const LESSON_LAB_THEME_IDS = LESSON_LAB_THEMES.map((theme) => theme.id);

export function isLessonLabTheme(value: string | undefined): value is LessonLabThemeId {
  return typeof value === 'string' && LESSON_LAB_THEME_IDS.includes(value as LessonLabThemeId);
}

export function resolveLessonLabTheme(value: string | undefined): LessonLabThemeId {
  if (isLessonLabTheme(value)) {
    return value;
  }
  return DEFAULT_LESSON_LAB_THEME;
}

export function getLessonLabThemeConfig(themeId: LessonLabThemeId): LessonLabThemeConfig {
  return LESSON_LAB_THEMES.find((theme) => theme.id === themeId) ?? LESSON_LAB_THEMES[1];
}
