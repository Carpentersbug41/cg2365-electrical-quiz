export function normalizeV2LessonCode(rawLessonCode: string): string {
  const lessonCode = rawLessonCode.trim().toUpperCase();
  const exactParts = lessonCode.split('-');
  if (exactParts.length !== 3) return lessonCode;

  const [prefix, unit, tail] = exactParts;
  if (!prefix || !unit || !tail) return lessonCode;
  if (unit.length >= 3 || !/^\d+$/.test(unit)) return lessonCode;

  return `${prefix}-${100 + Number.parseInt(unit, 10)}-${tail}`;
}
