/**
 * Phase 12: Implement Improvements
 * 
 * Applies patch operations from Phase 11 to produce improved lesson JSON.
 * Validates structural invariants and rejects corrupted candidates.
 */

import { Lesson } from '../types';
import { Phase11Suggestions, PatchOperation } from './Phase11_Suggest';
import { validateCandidate } from './Phase10_Validators';
import { safeJsonParse } from '../utils';
import { debugLogger } from '../debugLogger';

export interface Phase12Result {
  success: boolean;
  candidateLesson?: Lesson;
  validationResult?: any;
  error?: string;
  patchesApplied?: number;
}

export class Phase12_Implement {
  /**
   * Apply patches from Phase 11 to create improved lesson
   */
  async implementImprovements(
    originalLesson: Lesson,
    suggestions: Phase11Suggestions
  ): Promise<Phase12Result> {
    const stopTimer = debugLogger.startTimer('Phase 12: Implement Improvements');
    
    console.log(`\n🔨 [Phase12_Implement] Applying improvements to lesson ${originalLesson.id}...`);
    console.log(`   - Fix plans to apply: ${suggestions.fixablePlans.length}`);
    
    debugLogger.phaseHeader('Phase 12: Implement Improvements', originalLesson.id);
    
    debugLogger.logInput('Input', {
      'Lesson ID': originalLesson.id,
      'Block Count': originalLesson.blocks.length,
      'Fixable Plans': suggestions.fixablePlans.length,
      'Blocked Issues': suggestions.blockedIssues.length,
      'Regeneration Needed': suggestions.regenerationNeeded
    });
    
    if (suggestions.fixablePlans.length === 0) {
      console.log(`⚠️ [Phase12_Implement] No fixable plans to apply`);
      debugLogger.logWarning('No fixable plans to apply');
      stopTimer();
      return {
        success: false,
        error: 'No fixable plans to apply',
      };
    }
    
    // Start with a deep clone of the original lesson
    debugLogger.logStep('\n📋 Creating deep clone of original lesson...');
    let candidateLesson: any = JSON.parse(JSON.stringify(originalLesson));
    let patchesApplied = 0;
    
    // Count total patches
    const totalPatches = suggestions.fixablePlans.reduce((sum, plan) => sum + plan.patches.length, 0);
    debugLogger.logStep(`\n🔨 Applying ${totalPatches} patches from ${suggestions.fixablePlans.length} fix plans...`);
    
    // Apply each fix plan
    let patchNum = 0;
    for (const plan of suggestions.fixablePlans) {
      console.log(`  🔧 Applying fix for issue ${plan.issueId}...`);
      
      if (debugLogger.isEnabled()) {
        console.log(`\n  Fix Plan: ${plan.issueId}`);
        console.log(`    Targets: ${plan.targets.join(', ')}`);
        console.log(`    Instructions: ${plan.instructions}`);
        console.log(`    Patches: ${plan.patches.length}`);
      }
      
      for (const patch of plan.patches) {
        patchNum++;
        
        // Verbose: Show patch details
        debugLogger.logPatch(patchNum, totalPatches, patch, plan.issueId);
        
        try {
          // Get value before patch (for verbose logging)
          const beforeValue = debugLogger.isEnabled() ? this.getValueAtPath(candidateLesson, patch.path) : null;
          
          candidateLesson = this.applyPatch(candidateLesson, patch);
          patchesApplied++;
          console.log(`    ✅ Applied ${patch.op} to ${patch.path}`);
          
          // Verbose: Show before/after
          if (debugLogger.isEnabled() && beforeValue !== null) {
            const afterValue = this.getValueAtPath(candidateLesson, patch.path);
            const beforeStrFull = String(beforeValue);
            const afterStrFull = String(afterValue);
            const beforeStr = beforeStrFull.substring(0, 100);
            const afterStr = afterStrFull.substring(0, 100);
            const beforeEllipsis = beforeStrFull.length > 100 ? '...' : '';
            const afterEllipsis = afterStrFull.length > 100 ? '...' : '';
            console.log(`\n    Before: "${beforeStr}${beforeEllipsis}"`);
            console.log(`    After:  "${afterStr}${afterEllipsis}"`);
          }
          
        } catch (error: any) {
          console.error(`    ❌ Failed to apply patch: ${error.message}`);
          debugLogger.logError(`Failed to apply patch: ${error.message}`);
          stopTimer();
          return {
            success: false,
            error: `Failed to apply patch to ${patch.path}: ${error.message}`,
          };
        }
      }
    }
    
    console.log(`✅ [Phase12_Implement] Applied ${patchesApplied} patches`);
    debugLogger.logSuccess(`Applied ${patchesApplied} patches successfully`);
    
    // Validate the candidate
    console.log(`🔍 [Phase12_Implement] Validating candidate...`);
    debugLogger.logStep('\n🔍 Running validators...');
    
    const validationResult = validateCandidate(originalLesson, candidateLesson);
    
    // Verbose: Log validation details
    if (debugLogger.isEnabled()) {
      console.log('\nStructure Validation:');
      console.log(`  ${validationResult.passed ? '✅' : '❌'} Overall: ${validationResult.passed ? 'PASSED' : 'FAILED'}`);
      console.log(`  ✅ Block count: ${originalLesson.blocks.length} = ${candidateLesson.blocks.length}`);
      
      if (validationResult.errors && validationResult.errors.length > 0) {
        console.log('\n  Validation Errors:');
        validationResult.errors.forEach((err: string) => {
          console.log(`    - ${err}`);
        });
      }
      
      if (validationResult.details) {
        console.log('\n  Validation Details:');
        for (const [key, value] of Object.entries(validationResult.details)) {
          console.log(`    - ${key}: ${value}`);
        }
      }
    }
    
    if (!validationResult.passed) {
      console.error(`❌ [Phase12_Implement] Validation failed:`);
      validationResult.errors.forEach((err: string) => {
        console.error(`   - ${err}`);
      });
      debugLogger.logError('Candidate failed validation');
      stopTimer();
      
      return {
        success: false,
        validationResult,
        error: 'Candidate failed validation',
        patchesApplied,
      };
    }
    
    console.log(`✅ [Phase12_Implement] Candidate passed validation`);
    debugLogger.logSuccess('Candidate passed all validation checks');
    
    stopTimer();
    return {
      success: true,
      candidateLesson: candidateLesson as Lesson,
      validationResult,
      patchesApplied,
    };
  }
  
  /**
   * Get value at JSON Pointer path (for debug logging)
   */
  private getValueAtPath(obj: any, path: string): any {
    const parts = path.split('/').filter(p => p !== '');
    let current = obj;
    
    for (const part of parts) {
      const key = this.parsePathPart(part);
      if (current[key] === undefined) {
        return null;
      }
      current = current[key];
    }
    
    return current;
  }
  
  /**
   * Apply a single patch operation to the lesson
   */
  private applyPatch(lesson: any, patch: PatchOperation): any {
    const path = patch.path;
    
    // Convert JSON Pointer to property path
    const parts = path.split('/').filter(p => p !== '');
    
    if (parts.length === 0) {
      throw new Error('Invalid path: empty');
    }
    
    // Navigate to parent object
    let current: any = lesson;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const key = this.parsePathPart(part);
      
      if (current[key] === undefined) {
        throw new Error(`Path not found: ${path} (missing ${key})`);
      }
      
      current = current[key];
    }
    
    // Get the final property name
    const finalKey = this.parsePathPart(parts[parts.length - 1]);
    
    // Apply the operation
    switch (patch.op) {
      case 'replaceSubstring':
        return this.applyReplaceSubstring(current, finalKey, patch);
      
      case 'append':
        return this.applyAppend(current, finalKey, patch);
      
      case 'prepend':
        return this.applyPrepend(current, finalKey, patch);
      
      case 'replace':
        return this.applyReplace(current, finalKey, patch);
      
      default:
        throw new Error(`Unknown patch operation: ${(patch as any).op}`);
    }
    
    return lesson;
  }
  
  /**
   * Parse a path part (handle array indices)
   */
  private parsePathPart(part: string): string | number {
    // Check if it's a number (array index)
    const num = parseInt(part, 10);
    if (!isNaN(num) && num.toString() === part) {
      return num;
    }
    return part;
  }
  
  /**
   * Apply replaceSubstring operation
   */
  private applyReplaceSubstring(obj: any, key: string | number, patch: PatchOperation): any {
    if (typeof obj[key] !== 'string') {
      throw new Error(`replaceSubstring requires string value at ${key}`);
    }
    
    if (!patch.find) {
      throw new Error('replaceSubstring requires "find" parameter');
    }
    
    const oldValue = obj[key];
    const newValue = oldValue.replace(patch.find, patch.value);
    
    if (oldValue === newValue) {
      console.warn(`  ⚠️ replaceSubstring had no effect (find text not found)`);
    }
    
    obj[key] = newValue;
    return obj;
  }
  
  /**
   * Apply append operation
   */
  private applyAppend(obj: any, key: string | number, patch: PatchOperation): any {
    const currentValue = obj[key];
    
    if (typeof currentValue === 'string') {
      obj[key] = currentValue + patch.value;
    } else if (Array.isArray(currentValue)) {
      obj[key] = [...currentValue, patch.value];
    } else {
      throw new Error(`append requires string or array at ${key}`);
    }
    
    return obj;
  }
  
  /**
   * Apply prepend operation
   */
  private applyPrepend(obj: any, key: string | number, patch: PatchOperation): any {
    const currentValue = obj[key];
    
    if (typeof currentValue === 'string') {
      obj[key] = patch.value + currentValue;
    } else if (Array.isArray(currentValue)) {
      obj[key] = [patch.value, ...currentValue];
    } else {
      throw new Error(`prepend requires string or array at ${key}`);
    }
    
    return obj;
  }
  
  /**
   * Apply replace operation
   */
  private applyReplace(obj: any, key: string | number, patch: PatchOperation): any {
    // For replace, we completely replace the value
    // The "from" field is optional and just for context/validation
    obj[key] = patch.value;
    return obj;
  }
}
