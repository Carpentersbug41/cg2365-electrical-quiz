/**
 * Patch Isolation Scorer for Phase 10 Refinement
 * 
 * Isolates the score impact of individual patches by:
 * 1. Sequential isolation: Apply patches cumulatively and score after each
 * 2. Independent isolation: Apply each patch alone to baseline and score
 * 
 * This identifies which patches help vs harm the score.
 */

import { Lesson, PatchDebug } from './types';
import { RefinementPatch } from './phases/Phase10_Refinement';
import { LLMScoringService, RubricScore } from './llmScoringService';

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply a single patch to a lesson (creates a new cloned lesson)
 */
function applyPatch(lesson: Lesson, patch: RefinementPatch): Lesson {
  // Deep clone the lesson
  const cloned = JSON.parse(JSON.stringify(lesson));
  
  // Apply the patch using the same logic as Phase10_Refinement
  try {
    // Normalize path (support both dot and JSON Pointer)
    let normalizedPath = patch.path;
    if (patch.path.startsWith('/')) {
      normalizedPath = patch.path.substring(1).replace(/\//g, '.');
    }
    
    const parts = normalizedPath.split(/[\.\[\]]/).filter(p => p);
    let current = cloned;
    
    // Navigate to parent
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined) {
        // Create structure if needed (though validator should have rejected this)
        const nextPart = parts[i + 1];
        current[part] = /^\d+$/.test(nextPart) ? [] : {};
      }
      current = current[part];
    }
    
    // Apply the operation
    const lastPart = parts[parts.length - 1];
    const oldValue = current[lastPart];
    
    if (patch.op === 'replace') {
      current[lastPart] = patch.value;
    } else if (patch.op === 'prepend' && typeof oldValue === 'string') {
      current[lastPart] = patch.value + oldValue;
    } else if (patch.op === 'append' && typeof oldValue === 'string') {
      current[lastPart] = oldValue + patch.value;
    } else if (patch.op === 'replaceSubstring') {
      // Handle replaceSubstring operation
      if (typeof oldValue !== 'string') {
        console.warn(`[Isolation] Cannot replaceSubstring on non-string field at ${patch.path}`);
        return cloned; // Return unmodified
      }
      if (!patch.find) {
        console.warn(`[Isolation] replaceSubstring requires 'find' field at ${patch.path}`);
        return cloned; // Return unmodified
      }
      
      const findStr = patch.find as string;
      const replaceStr = patch.value as string;
      
      if (!oldValue.includes(findStr)) {
        console.warn(`[Isolation] Cannot find '${findStr.substring(0, 50)}...' in field at ${patch.path}`);
        return cloned; // Return unmodified
      }
      
      // Apply replacement based on matchIndex
      if (patch.matchIndex === 'all' || patch.matchIndex === undefined) {
        // Replace all occurrences
        current[lastPart] = oldValue.replaceAll(findStr, replaceStr);
      } else if (typeof patch.matchIndex === 'number') {
        // Replace nth occurrence (0-indexed)
        let count = 0;
        const escapedFind = escapeRegex(findStr);
        current[lastPart] = oldValue.replace(new RegExp(escapedFind, 'g'), (match) => {
          return count++ === patch.matchIndex ? replaceStr : match;
        });
      } else {
        // Default: replace all
        current[lastPart] = oldValue.replaceAll(findStr, replaceStr);
      }
    } else {
      // Default to replace
      current[lastPart] = patch.value;
    }
  } catch (error) {
    console.warn(`[Isolation] Failed to apply patch at ${patch.path}:`, error);
  }
  
  return cloned;
}

/**
 * Compute section deltas between two scores
 */
function computeSectionDeltas(before: RubricScore, after: RubricScore): Record<string, number> {
  const deltas: Record<string, number> = {};
  
  // Match sections by name
  for (let i = 0; i < before.details.length; i++) {
    const beforeDetail = before.details[i];
    const afterDetail = after.details.find(d => d.section === beforeDetail.section);
    
    if (afterDetail) {
      const delta = afterDetail.score - beforeDetail.score;
      if (delta !== 0) {
        deltas[beforeDetail.section] = delta;
      }
    }
  }
  
  return deltas;
}

/**
 * Isolate patches to determine individual score impact
 * 
 * @param baselineLesson - The lesson before any patches
 * @param patches - Array of patches to isolate
 * @param scorer - LLM scoring service
 * @returns PatchDebug array with isolation scores attached
 */
export async function isolatePatches(
  baselineLesson: Lesson,
  patches: RefinementPatch[],
  scorer: LLMScoringService
): Promise<PatchDebug[]> {
  console.log(`\n🔬 [Isolation] Starting patch isolation scoring for ${patches.length} patches`);
  console.log(`🔬 [Isolation] This will make ${patches.length * 2} scoring calls (sequential + independent)`);
  
  const patchesDebug: PatchDebug[] = patches.map((p, idx) => ({
    index: idx,
    op: p.op,
    path: p.path,
    from: p.from,
    value: p.value,
    reason: p.reason,
    oldValue: p.oldValue,
    appliedValue: p.newValue,
    applyStatus: 'applied' as const,
    validation: {
      pathStyle: 'unknown' as const,
      targetExists: true,
      fromProvided: false,
      fromMatches: true,
      wouldCreateStructure: false,
      allowedOp: true,
      allowedPath: true,
      reasons: [],
    },
  }));
  
  // Sequential Isolation: Apply patches cumulatively
  console.log(`\n🔬 [Isolation] Starting sequential isolation...`);
  let currentLesson = baselineLesson;
  let previousScore = await scorer.scoreLesson(currentLesson);
  console.log(`   Baseline score: ${previousScore.total}/100`);
  
  for (let i = 0; i < patches.length; i++) {
    console.log(`   Applying patch ${i + 1}/${patches.length}: ${patches[i].path}...`);
    
    // Apply patch i to current lesson
    currentLesson = applyPatch(currentLesson, patches[i]);
    
    // Score the lesson with this patch applied
    const currentScore = await scorer.scoreLesson(currentLesson);
    
    // Calculate deltas
    const totalDelta = currentScore.total - previousScore.total;
    const sectionDeltas = computeSectionDeltas(previousScore, currentScore);
    
    patchesDebug[i].scoreDeltaSequential = totalDelta;
    patchesDebug[i].sectionDeltasSequential = sectionDeltas;
    
    console.log(`      Score: ${previousScore.total} → ${currentScore.total} (${totalDelta > 0 ? '+' : ''}${totalDelta})`);
    
    // Flag harmful patches
    if (totalDelta <= -4) {
      console.log(`      ⚠️  HARMFUL PATCH DETECTED (${totalDelta} points)`);
    } else if (totalDelta <= -2) {
      console.log(`      ⚠️  Warning: patch caused score decline (${totalDelta} points)`);
    }
    
    previousScore = currentScore;
  }
  
  // Independent Isolation: Apply each patch alone to baseline
  console.log(`\n🔬 [Isolation] Starting independent isolation...`);
  const baselineScore = await scorer.scoreLesson(baselineLesson);
  console.log(`   Baseline score: ${baselineScore.total}/100`);
  
  for (let i = 0; i < patches.length; i++) {
    console.log(`   Testing patch ${i + 1}/${patches.length} independently: ${patches[i].path}...`);
    
    // Apply only patch i to baseline
    const isolatedLesson = applyPatch(baselineLesson, patches[i]);
    
    // Score the lesson with only this patch
    const isolatedScore = await scorer.scoreLesson(isolatedLesson);
    
    // Calculate deltas
    const totalDelta = isolatedScore.total - baselineScore.total;
    const sectionDeltas = computeSectionDeltas(baselineScore, isolatedScore);
    
    patchesDebug[i].scoreDeltaIndependent = totalDelta;
    patchesDebug[i].sectionDeltasIndependent = sectionDeltas;
    
    console.log(`      Score: ${baselineScore.total} → ${isolatedScore.total} (${totalDelta > 0 ? '+' : ''}${totalDelta})`);
  }
  
  console.log(`\n🔬 [Isolation] Patch isolation complete!`);
  
  // Summary of harmful patches
  const harmfulSequential = patchesDebug.filter(p => (p.scoreDeltaSequential || 0) <= -2);
  const harmfulIndependent = patchesDebug.filter(p => (p.scoreDeltaIndependent || 0) <= -2);
  
  if (harmfulSequential.length > 0) {
    console.log(`\n⚠️  [Isolation] Found ${harmfulSequential.length} harmful patches (sequential):`);
    harmfulSequential.forEach(p => {
      console.log(`   Patch ${p.index + 1} (${p.path}): ${p.scoreDeltaSequential} points`);
    });
  }
  
  if (harmfulIndependent.length > 0) {
    console.log(`\n⚠️  [Isolation] Found ${harmfulIndependent.length} harmful patches (independent):`);
    harmfulIndependent.forEach(p => {
      console.log(`   Patch ${p.index + 1} (${p.path}): ${p.scoreDeltaIndependent} points`);
    });
  }
  
  if (harmfulSequential.length === 0 && harmfulIndependent.length === 0) {
    console.log(`\n✅ [Isolation] No harmful patches detected!`);
  }
  
  return patchesDebug;
}
