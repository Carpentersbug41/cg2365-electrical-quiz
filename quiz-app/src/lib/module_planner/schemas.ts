import {
  CoverageTargets,
  LessonBlueprint,
  LessonLedgerMetadata,
  LoLedgerArtifact,
  M4BlueprintArtifact,
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

function isRangeValue(value: unknown): boolean {
  return value === null || typeof value === 'string' || isStringArray(value);
}

function validateLoLedgerArtifact(value: unknown): value is LoLedgerArtifact {
  if (!isPlainObject(value)) return false;
  if (assertKeys(value, ['lo', 'ledger'], 'LoLedgerArtifact')) return false;
  if (typeof value.lo !== 'string') return false;
  if (!isPlainObject(value.ledger)) return false;
  const legacyKeysOk =
    !assertKeys(
      value.ledger,
      ['taughtConcepts', 'taughtVocab', 'examplesUsed', 'questionTypesUsed', 'doNotTeach', 'lastUpdatedAt', 'sourceLessonIds'],
      'LoLedgerArtifact.ledger'
    );
  const extendedKeysOk =
    !assertKeys(
      value.ledger,
      [
        'alreadyTaughtConcepts',
        'taughtConcepts',
        'taughtVocab',
        'examplesUsed',
        'questionTypesUsed',
        'doNotTeach',
        'lastUpdatedAt',
        'sourceLessonIds',
      ],
      'LoLedgerArtifact.ledger'
    );
  if (!legacyKeysOk && !extendedKeysOk) {
    return false;
  }
  return (
    (value.ledger.alreadyTaughtConcepts === undefined || isStringArray(value.ledger.alreadyTaughtConcepts)) &&
    isStringArray(value.ledger.taughtConcepts) &&
    isStringArray(value.ledger.taughtVocab) &&
    isStringArray(value.ledger.examplesUsed) &&
    isStringArray(value.ledger.questionTypesUsed) &&
    isStringArray(value.ledger.doNotTeach) &&
    typeof value.ledger.lastUpdatedAt === 'string' &&
    isStringArray(value.ledger.sourceLessonIds)
  );
}

function validateLessonLedgerMetadata(value: unknown): value is LessonLedgerMetadata {
  if (!isPlainObject(value)) return false;
  if (
    assertKeys(
      value,
      ['lessonId', 'lo', 'newTeachingConcepts', 'newVocab', 'outOfScopeTopics', 'examplesUsed', 'questionTypesUsed'],
      'LessonLedgerMetadata'
    )
  ) {
    return false;
  }
  return (
    typeof value.lessonId === 'string' &&
    typeof value.lo === 'string' &&
    isStringArray(value.newTeachingConcepts) &&
    isStringArray(value.newVocab) &&
    isStringArray(value.outOfScopeTopics) &&
    isStringArray(value.examplesUsed) &&
    isStringArray(value.questionTypesUsed)
  );
}

export function validateModulePlanRequest(value: unknown): value is ModulePlanRequest {
  if (!isPlainObject(value)) return false;
  if (assertKeys(value, ['syllabusVersionId', 'unit', 'selectedLos', 'constraints', 'orderingPreference', 'notes'], 'ModulePlanRequest')) {
    return false;
  }
  if (typeof value.syllabusVersionId !== 'string') return false;
  if (typeof value.unit !== 'string') return false;
  if (!isStringArray(value.selectedLos)) return false;
  if (typeof value.orderingPreference !== 'string') return false;
  if (typeof value.notes !== 'string') return false;
  if (!isPlainObject(value.constraints)) return false;
  const constraints = value.constraints;
  if (
    assertKeys(
      constraints,
      ['minimiseLessons', 'defaultMaxLessonsPerLO', 'maxAcsPerLesson', 'preferredAcsPerLesson', 'maxLessonsOverrides', 'level', 'audience'],
      'ModulePlanRequest.constraints'
    )
  ) {
    return false;
  }
  if (typeof constraints.minimiseLessons !== 'boolean') return false;
  if (typeof constraints.defaultMaxLessonsPerLO !== 'number') return false;
  if (typeof constraints.maxAcsPerLesson !== 'number') return false;
  if (typeof constraints.preferredAcsPerLesson !== 'number') return false;
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
      const validRange = isRangeValue(target.range);
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
        ['id', 'unit', 'lo', 'acAnchors', 'topic', 'mustHaveTopics', 'level', 'layout', 'prerequisites', 'masterBlueprint'],
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
        isStringArray(item.prerequisites) &&
        isPlainObject(item.masterBlueprint)
      );
  });
}

export function validateM4BlueprintArtifact(value: unknown): value is M4BlueprintArtifact {
  if (!isPlainObject(value)) return false;
  const legacyKeysOk = !assertKeys(value, ['unit', 'generatedAt', 'blueprints', 'loBlueprintSets'], 'M4BlueprintArtifact');
  const extendedKeysOk = !assertKeys(
    value,
    ['unit', 'generatedAt', 'blueprints', 'loBlueprintSets', 'loLedgers', 'lessonLedgerMetadata'],
    'M4BlueprintArtifact'
  );
  if (!legacyKeysOk && !extendedKeysOk) {
    return false;
  }
  if (typeof value.unit !== 'string') return false;
  if (typeof value.generatedAt !== 'string') return false;
  if (!validateLessonBlueprints(value.blueprints)) return false;
  if (!Array.isArray(value.loBlueprintSets)) return false;

  const loSetsValid = value.loBlueprintSets.every((set, index) => {
    if (!isPlainObject(set)) return false;
    if (assertKeys(set, ['lo', 'generatedBy', 'blueprints'], `M4BlueprintArtifact.loBlueprintSets[${index}]`)) {
      return false;
    }
    if (typeof set.lo !== 'string') return false;
    if (set.generatedBy !== 'llm' && set.generatedBy !== 'fallback') return false;
    return validateLessonBlueprints(set.blueprints);
  });
  if (!loSetsValid) return false;
  if (value.loLedgers !== undefined) {
    if (!Array.isArray(value.loLedgers)) return false;
    if (!value.loLedgers.every((entry) => validateLoLedgerArtifact(entry))) return false;
  }
  if (value.lessonLedgerMetadata !== undefined) {
    if (!Array.isArray(value.lessonLedgerMetadata)) return false;
    if (!value.lessonLedgerMetadata.every((entry) => validateLessonLedgerMetadata(entry))) return false;
  }
  return true;
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
