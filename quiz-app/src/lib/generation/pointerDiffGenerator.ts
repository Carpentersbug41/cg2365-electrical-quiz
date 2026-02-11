/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * JSON Pointer Diff Generator
 * 
 * Generates RFC 6901 JSON Pointer-based diffs between two lesson objects.
 * Provides machine-readable paths and human-readable summaries.
 */

import { Lesson } from './types';

export interface PointerChange {
  op: 'replace' | 'add' | 'remove';
  path: string;              // RFC 6901 JSON Pointer format
  before?: any;
  after?: any;
  summary: string;           // Human-readable change description
}

export interface PointerDiff {
  lessonId: string;
  timestamp: string;
  changes: PointerChange[];
}

/**
 * Generate JSON Pointer diff between two lessons
 */
export function generatePointerDiff(before: Lesson, after: Lesson): PointerDiff {
  const changes: PointerChange[] = [];
  
  // Compare lessons recursively
  compareObjects(before, after, '', changes);
  
  return {
    lessonId: after.id,
    timestamp: new Date().toISOString(),
    changes
  };
}

/**
 * Recursively compare two objects and generate pointer changes
 */
function compareObjects(
  before: any,
  after: any,
  basePath: string,
  changes: PointerChange[]
): void {
  // Handle null/undefined
  if (before === null || before === undefined) {
    if (after !== null && after !== undefined) {
      changes.push({
        op: 'add',
        path: basePath || '/',
        after: after,
        summary: `Added value at ${basePath || '/'}`
      });
    }
    return;
  }
  
  if (after === null || after === undefined) {
    changes.push({
      op: 'remove',
      path: basePath || '/',
      before: before,
      summary: `Removed value at ${basePath || '/'}`
    });
    return;
  }
  
  // Handle primitive types
  if (typeof before !== 'object' || typeof after !== 'object') {
    if (before !== after) {
      changes.push({
        op: 'replace',
        path: basePath || '/',
        before: before,
        after: after,
        summary: generateSummary(basePath, before, after)
      });
    }
    return;
  }
  
  // Handle arrays
  if (Array.isArray(before) && Array.isArray(after)) {
    compareArrays(before, after, basePath, changes);
    return;
  }
  
  // Handle objects
  if (Array.isArray(before) !== Array.isArray(after)) {
    // Type changed from array to object or vice versa
    changes.push({
      op: 'replace',
      path: basePath || '/',
      before: before,
      after: after,
      summary: `Type changed at ${basePath || '/'} from ${Array.isArray(before) ? 'array' : 'object'} to ${Array.isArray(after) ? 'array' : 'object'}`
    });
    return;
  }
  
  // Compare object keys
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);
  const allKeys = new Set([...beforeKeys, ...afterKeys]);
  
  for (const key of allKeys) {
    const newPath = basePath ? `${basePath}/${escapePointer(key)}` : `/${escapePointer(key)}`;
    
    if (!(key in before) && key in after) {
      // Key added
      changes.push({
        op: 'add',
        path: newPath,
        after: after[key],
        summary: `Added ${formatKeyPath(newPath)}`
      });
    } else if (key in before && !(key in after)) {
      // Key removed
      changes.push({
        op: 'remove',
        path: newPath,
        before: before[key],
        summary: `Removed ${formatKeyPath(newPath)}`
      });
    } else {
      // Key exists in both - recurse
      compareObjects(before[key], after[key], newPath, changes);
    }
  }
}

/**
 * Compare arrays and generate changes
 */
function compareArrays(
  before: any[],
  after: any[],
  basePath: string,
  changes: PointerChange[]
): void {
  const maxLen = Math.max(before.length, after.length);
  
  for (let i = 0; i < maxLen; i++) {
    const newPath = `${basePath}/${i}`;
    
    if (i >= before.length) {
      // Element added
      changes.push({
        op: 'add',
        path: newPath,
        after: after[i],
        summary: `Added element at ${formatKeyPath(newPath)}`
      });
    } else if (i >= after.length) {
      // Element removed
      changes.push({
        op: 'remove',
        path: newPath,
        before: before[i],
        summary: `Removed element at ${formatKeyPath(newPath)}`
      });
    } else {
      // Element exists in both - recurse
      compareObjects(before[i], after[i], newPath, changes);
    }
  }
}

/**
 * Escape special characters for JSON Pointer (RFC 6901)
 * ~ must be escaped as ~0
 * / must be escaped as ~1
 */
function escapePointer(key: string): string {
  return key.replace(/~/g, '~0').replace(/\//g, '~1');
}

/**
 * Format a JSON Pointer path for human-readable display
 */
function formatKeyPath(path: string): string {
  // Remove leading slash and replace slashes with dots for readability
  const formatted = path.substring(1).replace(/\//g, '.');
  
  // Unescape JSON Pointer encoding
  return formatted.replace(/~1/g, '/').replace(/~0/g, '~');
}

/**
 * Generate human-readable summary for a change
 */
function generateSummary(path: string, before: any, after: any): string {
  const formattedPath = formatKeyPath(path);
  
  // Special handling for specific paths
  if (path.includes('/content/content')) {
    return `Updated content in ${formattedPath.split('.content.content')[0]}`;
  }
  
  if (path.includes('/questionText')) {
    return `Modified question text at ${formattedPath}`;
  }
  
  if (path.includes('/expectedAnswer')) {
    return `Updated expected answer at ${formattedPath}`;
  }
  
  if (path.includes('/answerType')) {
    return `Changed answer type from "${before}" to "${after}" at ${formattedPath}`;
  }
  
  if (path.includes('/hint')) {
    return `Modified hint at ${formattedPath}`;
  }
  
  if (path.includes('/title')) {
    return `Changed title from "${before}" to "${after}" at ${formattedPath}`;
  }
  
  if (path.includes('/description')) {
    return `Updated description at ${formattedPath}`;
  }
  
  if (path.includes('/text')) {
    return `Changed text at ${formattedPath}`;
  }
  
  // Generic summary
  const beforeStr = typeof before === 'string' && before.length > 50 
    ? `"${before.substring(0, 50)}..."` 
    : JSON.stringify(before);
  const afterStr = typeof after === 'string' && after.length > 50 
    ? `"${after.substring(0, 50)}..."` 
    : JSON.stringify(after);
  
  return `Changed ${formattedPath} from ${beforeStr} to ${afterStr}`;
}

/**
 * Filter changes to only include significant ones (optional utility)
 */
export function filterSignificantChanges(diff: PointerDiff): PointerDiff {
  // Filter out noise like timestamp changes, metadata updates, etc.
  const significantChanges = diff.changes.filter(change => {
    // Keep all content changes
    if (change.path.includes('/content/')) return true;
    if (change.path.includes('/questions/')) return true;
    if (change.path.includes('/learningOutcomes')) return true;
    if (change.path.includes('/blocks/')) return true;
    
    // Filter out metadata that doesn't affect lesson quality
    if (change.path.includes('/generatedAt')) return false;
    if (change.path.includes('/version')) return false;
    
    return true;
  });
  
  return {
    ...diff,
    changes: significantChanges
  };
}

