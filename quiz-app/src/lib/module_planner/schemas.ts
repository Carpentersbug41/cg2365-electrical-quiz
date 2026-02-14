import {
  CoverageTargets,
  LessonBlueprint,
  MinimalLessonPlan,
  ModulePlanRequest,
  UnitStructure,
  ValidationResult,
} from './types';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function assertKeys(
  value: Record<string, unknown>,
  allowed: string[],
  path: string
): string | null {
  const extras = Object.keys(value).filter((key) => !allowed.includes(key));
  if (extras.length > 0) {
    return `${path} contains unexpected keys: ${extras.join(', ')}`;
  }
  const missing = allowed.filter((key) => !(key in value));
  if (missing.length > 0) {
    return `${path} is missing keys: ${missing.join(', ')}`;
  }
  return null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function validateModulePlanRequest(value: unknown): value is ModulePlanRequest {
  if (!isPlainObject(value)) return false;
  if (assertKeys(value, ['unit', 'selectedLos', 'constraints', 'orderingPreference', 'notes'], 'ModulePlanRequest')) {
    return false;
  }
  if (typeof value.unit !== 'string') return false;
  if (!isStringArray(value.selectedLos)) return false;
  if (typeof value.orderingPreference !== 'string') return false;
  if (typeof value.notes !== 'string') return false;
  if (!isPlainObject(value.constraints)) return false;
  const constraints = value.constraints;
  if (
    assertKeys(
      constraints,
      ['minimiseLessons', 'defaultMaxLessonsPerLO', 'maxLessonsOverrides', 'level', 'audience'],
      'ModulePlanRequest.constraints'
    )
  ) {
    return false;
  }
  if (typeof constraints.minimiseLessons !== 'boolean') return false;
  if (typeof constraints.defaultMaxLessonsPerLO !== 'number') return false;
  if (!isPlainObject(constraints.maxLessonsOverrides)) return false;
  if (typeof constraints.level !== 'string') return false;
  if (typeof constraints.audience !== 'string') return false;
  return true;
}

export function validateUnitStructure(value: unknown): value is UnitStructure {
  if (!isPlainObject(value)) return false;
  if (assertKeys(value, ['unit', 'unitTitle', 'los'], 'UnitStructure')) return false;
  if (typeof value.unit !== 'string') return false;
  if (typeof value.unitTitle !== 'string') return false;
  if (!Array.isArray(value.los)) return false;
  return value.los.every((lo, index) => {
    if (!isPlainObject(lo)) return false;
    if (assertKeys(lo, ['lo', 'title', 'sourceChunkIds'], `UnitStructure.los[${index}]`)) return false;
    return typeof lo.lo === 'string' && typeof lo.title === 'string' && isStringArray(lo.sourceChunkIds);
  });
}

export function validateCoverageTargets(value: unknown): value is CoverageTargets {
  if (!isPlainObject(value)) return false;
  if (assertKeys(value, ['unit', 'los'], 'CoverageTargets')) return false;
  if (typeof value.unit !== 'string') return false;
  if (!Array.isArray(value.los)) return false;
  return value.los.every((lo, loIndex) => {
    if (!isPlainObject(lo)) return false;
    if (assertKeys(lo, ['lo', 'coverageTargets'], `CoverageTargets.los[${loIndex}]`)) return false;
    if (typeof lo.lo !== 'string' || !Array.isArray(lo.coverageTargets)) return false;
    return lo.coverageTargets.every((target, targetIndex) => {
      if (!isPlainObject(target)) return false;
      if (
        assertKeys(
          target,
          ['acKey', 'acText', 'range', 'sourceChunkIds'],
          `CoverageTargets.los[${loIndex}].coverageTargets[${targetIndex}]`
        )
      ) {
        return false;
      }
      const validRange = target.range === null || typeof target.range === 'string';
      return (
        typeof target.acKey === 'string' &&
        typeof target.acText === 'string' &&
        validRange &&
        isStringArray(target.sourceChunkIds)
      );
    });
  });
}

export function validateMinimalLessonPlan(value: unknown): value is MinimalLessonPlan {
  if (!isPlainObject(value)) return false;
  if (assertKeys(value, ['unit', 'los'], 'MinimalLessonPlan')) return false;
  if (typeof value.unit !== 'string') return false;
  if (!Array.isArray(value.los)) return false;
  return value.los.every((lo, loIndex) => {
    if (!isPlainObject(lo)) return false;
    if (assertKeys(lo, ['lo', 'lessonCount', 'lessons'], `MinimalLessonPlan.los[${loIndex}]`)) return false;
    if (typeof lo.lo !== 'string' || typeof lo.lessonCount !== 'number' || !Array.isArray(lo.lessons)) {
      return false;
    }
    return lo.lessons.every((lesson, lessonIndex) => {
      if (!isPlainObject(lesson)) return false;
      if (
        assertKeys(
          lesson,
          ['topicCode', 'title', 'coversAcKeys', 'whySplit'],
          `MinimalLessonPlan.los[${loIndex}].lessons[${lessonIndex}]`
        )
      ) {
        return false;
      }
      const validWhySplit = lesson.whySplit === null || typeof lesson.whySplit === 'string';
      return (
        typeof lesson.topicCode === 'string' &&
        typeof lesson.title === 'string' &&
        isStringArray(lesson.coversAcKeys) &&
        validWhySplit
      );
    });
  });
}

export function validateLessonBlueprints(value: unknown): value is LessonBlueprint[] {
  if (!Array.isArray(value)) return false;
  return value.every((item, index) => {
    if (!isPlainObject(item)) return false;
    if (
      assertKeys(
        item,
        ['id', 'unit', 'lo', 'acAnchors', 'topic', 'mustHaveTopics', 'level', 'layout', 'prerequisites'],
        `LessonBlueprint[${index}]`
      )
    ) {
      return false;
    }
    const layoutValid = item.layout === 'split-vis' || item.layout === 'linear-flow';
    return (
      typeof item.id === 'string' &&
      typeof item.unit === 'string' &&
      typeof item.lo === 'string' &&
      typeof item.topic === 'string' &&
      typeof item.level === 'string' &&
      layoutValid &&
      isStringArray(item.acAnchors) &&
      isStringArray(item.mustHaveTopics) &&
      isStringArray(item.prerequisites)
    );
  });
}

export function validateValidationResult(value: unknown): value is ValidationResult {
  if (!isPlainObject(value)) return false;
  if (assertKeys(value, ['valid', 'issues'], 'ValidationResult')) return false;
  if (typeof value.valid !== 'boolean') return false;
  if (!Array.isArray(value.issues)) return false;
  return value.issues.every((issue, index) => {
    if (!isPlainObject(issue)) return false;
    const keyCheck = assertKeys(issue, ['stage', 'severity', 'code', 'message', 'meta'], `ValidationResult.issues[${index}]`);
    if (keyCheck) return false;
    const metaValid = issue.meta === undefined || issue.meta === null || isPlainObject(issue.meta);
    return (
      typeof issue.stage === 'string' &&
      (issue.severity === 'error' || issue.severity === 'warn') &&
      typeof issue.code === 'string' &&
      typeof issue.message === 'string' &&
      metaValid
    );
  });
}

