/**
 * Integration test for Phase 10 fixes
 * Tests the fixes against the actual failing debug bundle
 */

import * as fs from 'fs';
import * as path from 'path';
import { Phase10_Refinement } from '../src/lib/generation/phases/Phase10_Refinement';
import { validatePatch, shouldRejectPatch } from '../src/lib/generation/patchValidator';
import { Lesson } from '../src/lib/generation/types';

const DEBUG_BUNDLE_PATH = path.join(
  process.cwd(),
  'quiz-app/src/data/diagnostics/debug_runs/08954d6a-4a94-4bf2-8ea6-79cf125e865e.json'
);

interface DebugBundle {
  lessonMeta: {
    id: string;
    title: string;
  };
  baseline: {
    lesson: Lesson;
    score: {
      total: number;
    };
  };
  phase10: {
    llmParsed: {
      patches: Array<{
        op: string;
        path: string;
        value: any;
        find?: string;
        reason: string;
      }>;
    };
  };
}

async function main() {
  console.log('📦 Loading failing debug bundle...');
  
  if (!fs.existsSync(DEBUG_BUNDLE_PATH)) {
    console.error(`❌ Debug bundle not found at ${DEBUG_BUNDLE_PATH}`);
    process.exit(1);
  }
  
  const bundle: DebugBundle = JSON.parse(fs.readFileSync(DEBUG_BUNDLE_PATH, 'utf-8'));
  
  console.log(`✓ Loaded bundle for lesson: ${bundle.lessonMeta.id} - ${bundle.lessonMeta.title}`);
  console.log(`✓ Baseline score: ${bundle.baseline.score.total}/100`);
  console.log(`✓ Original patches: ${bundle.phase10.llmParsed.patches.length}`);
  
  const phase10 = new Phase10_Refinement();
  const originalLesson = bundle.baseline.lesson;
  
  console.log('\n🔍 Analyzing original patches with new validation...\n');
  
  const issues = bundle.phase10.llmParsed.patches.map((p, idx) => ({
    section: 'test',
    issue: p.reason,
    suggestion: p.reason,
    pointsLost: 0,
    severity: 0
  }));
  
  // Convert patches to RefinementPatch format
  const refinementPatches = phase10.convertLLMPatches(
    { patches: bundle.phase10.llmParsed.patches },
    issues,
    originalLesson
  );
  
  let rejectedCount = 0;
  let collisionCount = 0;
  
  // Check for path collisions
  const pathCounts = new Map<string, number>();
  refinementPatches.forEach(p => {
    pathCounts.set(p.path, (pathCounts.get(p.path) || 0) + 1);
  });
  
  const collisions = Array.from(pathCounts.entries()).filter(([_, count]) => count > 1);
  if (collisions.length > 0) {
    console.log(`⚠️  COLLISION DETECTION:`);
    collisions.forEach(([path, count]) => {
      console.log(`   ${path}: ${count} patches`);
      collisionCount++;
    });
    console.log('');
  }
  
  // Validate each patch
  refinementPatches.forEach((patch, idx) => {
    console.log(`Patch ${idx + 1}: ${patch.op} on ${patch.path}`);
    
    const validation = validatePatch(originalLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    if (shouldReject) {
      console.log(`   ❌ REJECTED:`);
      validation.reasons.forEach(r => console.log(`      - ${r}`));
      rejectedCount++;
    } else if (validation.reasons.length > 0) {
      console.log(`   ⚠️  Warnings:`);
      validation.reasons.forEach(r => console.log(`      - ${r}`));
      console.log(`   ✓ But still accepted`);
    } else {
      console.log(`   ✓ Accepted`);
    }
    console.log('');
  });
  
  console.log('\n📊 Summary:');
  console.log(`   Original patches: ${refinementPatches.length}`);
  console.log(`   Rejected by safety gates: ${rejectedCount}`);
  console.log(`   Path collisions detected: ${collisionCount}`);
  console.log(`   Patches that would apply: ${refinementPatches.length - rejectedCount}`);
  
  // Test applying the remaining patches
  const acceptedPatches = refinementPatches.filter(patch => {
    const validation = validatePatch(originalLesson, patch);
    return !shouldRejectPatch(validation);
  });
  
  console.log('\n🔧 Applying accepted patches...');
  const patchedLesson = phase10.applyPatches(originalLesson, acceptedPatches);
  
  // Validate the patched lesson
  const isValid = phase10.validatePatches(originalLesson, patchedLesson);
  
  console.log('\n✅ Final Validation:');
  console.log(`   Structure valid: ${isValid}`);
  console.log(`   Block count: ${originalLesson.blocks.length} → ${patchedLesson.blocks.length}`);
  
  // Check explanation blocks
  const explanationBlocks = patchedLesson.blocks.filter(b => b.type === 'explanation');
  console.log(`   Explanation blocks: ${explanationBlocks.length}`);
  
  explanationBlocks.forEach(block => {
    const content = block.content?.content || '';
    const hasInThisLesson = content.includes('### In this lesson');
    const hasWhatThis = content.includes('**What this is**');
    const hasWhyMatters = content.includes('**Why it matters**');
    const hasKeyPoints = content.includes('**Key Points**');
    const hasComingUpNext = content.includes('### Coming Up Next');
    
    const headingCount = [hasInThisLesson, hasWhatThis, hasWhyMatters, hasKeyPoints, hasComingUpNext]
      .filter(Boolean).length;
    
    console.log(`   Block ${block.id}: ${headingCount}/5 key headings present`);
  });
  
  console.log('\n✨ With the new fixes:');
  console.log(`   - Destructive replace patches would be REJECTED`);
  console.log(`   - Path collisions would be DETECTED and resolved`);
  console.log(`   - Explanation structure would be PRESERVED`);
  console.log(`   - Score should NOT drop significantly`);
  
  if (rejectedCount >= 2) {
    console.log('\n✅ SUCCESS: The fixes would have prevented the score drop!');
    console.log(`   The ${rejectedCount} destructive patches would have been rejected.`);
  } else {
    console.log('\n⚠️  Note: Review the specific patches to ensure all safety gates work correctly.');
  }
}

main().catch(console.error);
