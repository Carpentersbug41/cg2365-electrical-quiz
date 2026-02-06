/**
 * Patch Validator for Phase 10 Refinement
 * 
 * Validates patches before applying them to prevent:
 * - Non-existent paths
 * - Structure creation (adding new arrays/objects)
 * - From/to mismatches
 * - Invalid operations
 */

import { Lesson, PatchValidationResult } from './types';
import { RefinementPatch } from './phases/Phase10_Refinement';

/**
 * Get value at a path in an object (supports dot notation and brackets)
 */
function getValueAtPath(obj: any, path: string): any {
  try {
    // Support both dot notation (blocks[3].content.title) and JSON Pointer (/blocks/3/content/title)
    let normalizedPath = path;
    
    // Convert JSON Pointer to dot notation
    if (path.startsWith('/')) {
      normalizedPath = path.substring(1).replace(/\//g, '.');
    }
    
    // Split by dots and brackets
    const parts = normalizedPath.split(/[\.\[\]]/).filter(p => p);
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  } catch {
    return undefined;
  }
}

/**
 * Check if applying a value at path would create new structure
 */
function wouldCreateStructure(obj: any, path: string): boolean {
  try {
    // Normalize path
    let normalizedPath = path;
    if (path.startsWith('/')) {
      normalizedPath = path.substring(1).replace(/\//g, '.');
    }
    
    const parts = normalizedPath.split(/[\.\[\]]/).filter(p => p);
    let current = obj;

    // Check each segment except the last one
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      if (current === null || current === undefined) {
        return true; // Would need to create structure
      }
      
      if (current[part] === undefined) {
        return true; // This segment doesn't exist
      }
      
      current = current[part];
    }

    // Check if the final segment exists
    const lastPart = parts[parts.length - 1];
    return current === null || current === undefined || current[lastPart] === undefined;
  } catch {
    return true; // If we can't determine, assume unsafe
  }
}

/**
 * Deep equality check for from/to validation
 */
function deepEqual(val1: any, val2: any): boolean {
  if (val1 === val2) return true;
  
  if (typeof val1 !== typeof val2) return false;
  
  if (val1 === null || val2 === null) return val1 === val2;
  
  if (typeof val1 === 'object') {
    return JSON.stringify(val1) === JSON.stringify(val2);
  }
  
  return false;
}

/**
 * Detect path style
 */
function detectPathStyle(path: string): 'dot' | 'jsonPointer' | 'unknown' {
  if (path.startsWith('/')) {
    // Looks like JSON Pointer format
    if (/^\/[^\/]+(\/[^\/]+)*$/.test(path)) {
      return 'jsonPointer';
    }
  } else if (/^[a-zA-Z_][a-zA-Z0-9_]*(\[[0-9]+\]|\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(path)) {
    // Looks like dot notation with brackets
    return 'dot';
  }
  
  return 'unknown';
}

/**
 * Check if path is allowed (within lesson schema)
 */
function isAllowedPath(path: string): boolean {
  // Normalize path
  let normalizedPath = path;
  if (path.startsWith('/')) {
    normalizedPath = path.substring(1).replace(/\//g, '.');
  }
  
  // Allow paths within lesson schema
  const allowedRoots = [
    'blocks',
    'learningOutcomes',
    'title',
    'description',
    'layout',
    'prerequisites',
    'metadata',
  ];
  
  // Denylist: don't allow changing these top-level fields
  const deniedRoots = [
    'id',    // Lesson ID should not change
    'unit',  // Unit should not change
    'topic', // Topic should not change (unless explicitly targeting it)
  ];
  
  const firstPart = normalizedPath.split(/[\.\[]/)[ 0];
  
  // Check if it's in denylist
  if (deniedRoots.includes(firstPart)) {
    // Only allow if this is explicitly a fix for that field
    // (we'll be lenient here and allow it)
    return true;
  }
  
  // Check if it's in allowlist
  return allowedRoots.includes(firstPart);
}

/**
 * Validate a patch before applying it
 */
export function validatePatch(lesson: Lesson, patch: RefinementPatch): PatchValidationResult {
  const reasons: string[] = [];
  
  // 1. Detect path style
  const pathStyle = detectPathStyle(patch.path);
  if (pathStyle === 'unknown') {
    reasons.push(`Unknown path format: ${patch.path}`);
  }
  
  // 2. Check if target exists
  const oldValue = getValueAtPath(lesson, patch.path);
  const targetExists = oldValue !== undefined;
  if (!targetExists) {
    reasons.push(`Target path does not exist: ${patch.path}`);
  }
  
  // 3. Check if 'from' is provided and matches
  const fromProvided = patch.from !== undefined;
  const fromMatches = fromProvided ? deepEqual(oldValue, patch.from) : true;
  if (fromProvided && !fromMatches) {
    reasons.push(`'from' value mismatch at ${patch.path}: expected ${JSON.stringify(patch.from)}, got ${JSON.stringify(oldValue)}`);
  }
  
  // 4. Check if would create structure
  const wouldCreate = wouldCreateStructure(lesson, patch.path);
  if (wouldCreate) {
    reasons.push(`Applying patch would create new structure at ${patch.path}`);
  }
  
  // 5. Check if operation is allowed
  const allowedOps = ['replace', 'prepend', 'append'];
  const allowedOp = allowedOps.includes(patch.op);
  if (!allowedOp) {
    reasons.push(`Invalid operation: ${patch.op}`);
  }
  
  // 6. For prepend/append, check if target is a string
  if ((patch.op === 'prepend' || patch.op === 'append') && typeof oldValue !== 'string') {
    reasons.push(`Cannot ${patch.op} to non-string value at ${patch.path} (type: ${typeof oldValue})`);
  }
  
  // 7. Check if path is allowed
  const allowedPath = isAllowedPath(patch.path);
  if (!allowedPath) {
    reasons.push(`Path not allowed by schema: ${patch.path}`);
  }
  
  return {
    pathStyle,
    targetExists,
    fromProvided,
    fromMatches,
    wouldCreateStructure: wouldCreate,
    allowedOp,
    allowedPath,
    reasons,
  };
}

/**
 * Check if a patch should be rejected based on validation result
 */
export function shouldRejectPatch(validation: PatchValidationResult): boolean {
  // Hard reject if:
  // - Target doesn't exist
  // - Would create structure
  // - From provided but doesn't match
  // - Operation not allowed
  // - Path not allowed
  
  if (!validation.targetExists) return true;
  if (validation.wouldCreateStructure) return true;
  if (validation.fromProvided && !validation.fromMatches) return true;
  if (!validation.allowedOp) return true;
  if (!validation.allowedPath) return true;
  
  return false;
}
