/**
 * Migration Service
 * Handles version migrations for progress data and lesson content changes
 */

import { ProgressStorage, LessonProgress } from './types';
import { Lesson, BlockIdAliasMap } from '@/data/lessons/types';
import { getCoursePrefixForClient } from '@/lib/routing/curricula';

/**
 * Current progress version
 */
export const CURRENT_PROGRESS_VERSION = 2;
export function getProgressStorageKey(): string {
  const prefix = getCoursePrefixForClient().replace(/\//g, '-').replace(/^-+/, '');
  return `${prefix}-learning-progress`;
}

/**
 * Migration result
 */
export interface MigrationResult {
  migrated: boolean;
  fromVersion: number;
  toVersion: number;
  changesApplied: string[];
  errors: string[];
}

/**
 * Validate progress data against lesson content
 * Removes invalid block IDs and logs warnings
 */
export function validateLessonProgress(
  progress: LessonProgress,
  lesson: Lesson
): {
  validatedProgress: LessonProgress;
  invalidBlockIds: string[];
  migratedBlockIds: string[];
} {
  const validBlockIds = new Set(lesson.blocks.map(b => b.id));
  const blockIdAliases = lesson.blockIdAliases || {};
  
  const invalidBlockIds: string[] = [];
  const migratedBlockIds: string[] = [];
  const validatedBlocksCompleted: string[] = [];

  // Validate and migrate blocksCompleted
  for (const blockId of progress.blocksCompleted) {
    if (validBlockIds.has(blockId)) {
      // Valid block ID
      validatedBlocksCompleted.push(blockId);
    } else if (blockIdAliases[blockId]) {
      // Renamed block - migrate to new ID
      const newBlockId = blockIdAliases[blockId];
      validatedBlocksCompleted.push(newBlockId);
      migratedBlockIds.push(`${blockId} → ${newBlockId}`);
      console.log(`🔄 Migrated block ID: ${blockId} → ${newBlockId}`);
    } else {
      // Invalid block ID - remove it
      invalidBlockIds.push(blockId);
      console.warn(`⚠️  Invalid block ID removed from progress: ${blockId}`);
    }
  }

  // Validate practice attempts
  const validatedPracticeAttempts = progress.practiceAttempts.filter(attempt => {
    const blockId = attempt.blockId;
    
    if (validBlockIds.has(blockId)) {
      return true;
    } else if (blockIdAliases[blockId]) {
      // Migrate block ID in practice attempt
      attempt.blockId = blockIdAliases[blockId];
      migratedBlockIds.push(`${blockId} → ${blockIdAliases[blockId]}`);
      return true;
    } else {
      invalidBlockIds.push(blockId);
      console.warn(`⚠️  Invalid practice attempt removed: ${blockId}`);
      return false;
    }
  });

  const validatedProgress: LessonProgress = {
    ...progress,
    blocksCompleted: validatedBlocksCompleted,
    practiceAttempts: validatedPracticeAttempts,
  };

  return {
    validatedProgress,
    invalidBlockIds,
    migratedBlockIds,
  };
}

/**
 * Migrate progress storage from old version to current version
 */
export function migrateProgressStorage(
  data: ProgressStorage
): MigrationResult {
  const fromVersion = data.progressVersion || 1;
  const toVersion = CURRENT_PROGRESS_VERSION;
  const changesApplied: string[] = [];
  const errors: string[] = [];

  if (fromVersion === toVersion) {
    return {
      migrated: false,
      fromVersion,
      toVersion,
      changesApplied: [],
      errors: [],
    };
  }

  console.log(`🔄 Migrating progress from v${fromVersion} to v${toVersion}`);

  try {
    // Migration: v1 → v2
    if (fromVersion < 2) {
      // Add new fields introduced in v2
      for (const path of data.learningPaths) {
        for (const lesson of path.lessonsProgress) {
          // Add mastery fields if not present
          if (lesson.masteryPending === undefined) {
            lesson.masteryPending = false;
            lesson.masteryAchieved = false;
          }

          // Add mastery fields to practice attempts
          for (const attempt of lesson.practiceAttempts) {
            if (attempt.masteryPending === undefined) {
              attempt.masteryPending = false;
            }
          }
        }

        // Add mastery fields to quiz progress
        for (const quiz of path.quizzesProgress) {
          if (quiz.masteryPending === undefined) {
            quiz.masteryPending = false;
          }
        }
      }

      // Add lessonContentVersions tracking
      if (!data.lessonContentVersions) {
        data.lessonContentVersions = {};
      }

      changesApplied.push('Added mastery pending/achieved fields');
      changesApplied.push('Added lesson content version tracking');
    }

    // Update version
    data.progressVersion = toVersion;
    data.version = `${toVersion}.0`;

    console.log(`✓ Migration complete: ${changesApplied.length} changes applied`);

    return {
      migrated: true,
      fromVersion,
      toVersion,
      changesApplied,
      errors,
    };
  } catch (error) {
    console.error('Migration failed:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');

    return {
      migrated: false,
      fromVersion,
      toVersion,
      changesApplied,
      errors,
    };
  }
}

/**
 * Check if lesson content has changed since last progress save
 * Returns true if progress data may be stale
 */
export function isLessonContentStale(
  lessonId: string,
  currentContentVersion: number,
  progressStorage: ProgressStorage
): boolean {
  const savedVersion = progressStorage.lessonContentVersions?.[lessonId];
  
  if (savedVersion === undefined) {
    // No version tracked yet - not necessarily stale, just first load
    return false;
  }

  return savedVersion < currentContentVersion;
}

/**
 * Update lesson content version in progress storage
 */
export function updateLessonContentVersion(
  progressStorage: ProgressStorage,
  lessonId: string,
  contentVersion: number
): void {
  if (!progressStorage.lessonContentVersions) {
    progressStorage.lessonContentVersions = {};
  }

  progressStorage.lessonContentVersions[lessonId] = contentVersion;
}

/**
 * Safe load with automatic migration
 */
export function safeLoadProgress(): ProgressStorage {
  if (typeof window === 'undefined') {
    return createDefaultStorage();
  }

  try {
    const key = getProgressStorageKey();
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return createDefaultStorage();
    }

    const data: ProgressStorage = JSON.parse(stored);

    // Auto-migrate if needed
    const migrationResult = migrateProgressStorage(data);
    
    if (migrationResult.migrated) {
      console.log('📦 Progress data migrated:', migrationResult);
      // Save migrated data
      localStorage.setItem(key, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Failed to load progress, returning default:', error);
    return createDefaultStorage();
  }
}

/**
 * Create default progress storage
 */
function createDefaultStorage(): ProgressStorage {
  return {
    version: `${CURRENT_PROGRESS_VERSION}.0`,
    progressVersion: CURRENT_PROGRESS_VERSION,
    learningPaths: [],
    spacedReviews: [],
    misconceptions: [],
    lessonContentVersions: {},
  };
}


