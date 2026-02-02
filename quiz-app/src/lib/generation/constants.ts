/**
 * Constants for lesson generation system
 */

// Approved question tags (from types.ts)
export const APPROVED_TAGS = [
  'series',
  'parallel',
  'mixed-circuit',
  'ohms-law',
  'current-rule',
  'voltage-rule',
  'resistance-rule',
  'calculation',
  'discrimination',
  'explanation',
  'conceptual',
  'application',
  'ac-dc',
  'frequency',
  'transformers',
  'electromagnetic-induction',
  'generator-components',
  'sine-wave',
  'rms-peak',
  'magnetism',
  'electromagnets',
  'magnetic-poles',
  'relays',
  'power',
  'energy',
  'conversion',
  'units',
  'terminology',
  'health-safety',
  'legislation',
  'ppe',
  'risk-assessment',
  'cables',
  'wiring',
  'installation',
] as const;

// Approved misconception codes (from misconceptionCodes.ts)
export const APPROVED_MISCONCEPTION_CODES = [
  'USED_PARALLEL_RULE',
  'USED_SERIES_RULE',
  'UNITS_MISSING',
  'WRONG_UNITS',
  'MULTIPLIED_INSTEAD',
  'DIVIDED_INSTEAD',
  'RECIPROCAL_ERROR',
  'SIGN_ERROR',
  'ROUNDING_ERROR',
  'FORMULA_NOT_REARRANGED',
  'CONFUSED_I_V_R',
  'TOPOLOGY_CONFUSION',
  'CONFUSED_AC_WITH_DC',
  'CONFUSED_AC_DC_SOURCES',
  'CONFUSED_FREQUENCY_WITH_VOLTAGE',
  'CONFUSED_FREQUENCY_WITH_CURRENT',
  'CONFUSED_RMS_WITH_PEAK',
  'CONFUSED_TRANSFORMER_WITH_AC_DC',
  'CONFUSED_AC_DC_GENERATOR_PARTS',
  'CONFUSED_TERMINOLOGY',
  'OTHER',
] as const;

// Sections
export const SECTIONS = [
  'Science 2365 Level 2',
  'Health & Safety Level 1',
  'Health & Safety Level 2',
  'Electrical Installations Technology',
] as const;

// Bloom's taxonomy levels
export const BLOOM_LEVELS = [
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
  'create',
] as const;

// Cognitive levels for questions
export const COGNITIVE_LEVELS = [
  'recall',
  'connection',
  'synthesis',
] as const;

// Diagram types (expanded to support all units)
export const DIAGRAM_TYPES = [
  'series',
  'parallel',
  'circuit',
  'plan',
  'wiring',
  'schematic',
  'block',
  'procedure',
  'table',
  'graph',
  'other',
] as const;

// Answer types
export const ANSWER_TYPES = [
  'mcq',
  'numeric',
  'short-text',
  'step-by-step',
  'true-false',
  'matching',
] as const;

// Difficulty distribution
export const DIFFICULTY_DISTRIBUTION = {
  easy: 15,    // 30%
  medium: 25,  // 50%
  hard: 10,    // 20%
} as const;

// Question type distribution percentages
export const QUESTION_TYPE_DISTRIBUTION = {
  discrimination: 20,
  conceptual: 20,
  calculation: 40,
  application: 20,
} as const;

// Block order constants
export const BLOCK_ORDER = {
  OUTCOMES: 1,
  VOCAB: 2,
  DIAGRAM: 3,
  EXPLANATION: 4,
  UNDERSTANDING_CHECK: 4.5,
  WORKED_EXAMPLE: 5,
  GUIDED_PRACTICE: 6,
  PRACTICE: 7,
  INTEGRATIVE: 9.5,
  SPACED_REVIEW: 8,
} as const;

// Git configuration
export const GIT_CONFIG = {
  COMMIT_PREFIX: 'feat: Add',
  REMOTE: 'origin',
} as const;

// Generation limits
export const GENERATION_LIMITS = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
  MAX_TOKENS: 8000,
  BATCH_SIZE: 10,
} as const;
