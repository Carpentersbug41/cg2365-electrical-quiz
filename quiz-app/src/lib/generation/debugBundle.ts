/**
 * Debug Bundle Collector for Phase 10 Refinement
 * 
 * Captures comprehensive diagnostic data during generation to make
 * Phase 10 refinement regressions immediately explainable.
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  GenerationDebugBundle,
  PatchDebug,
  IssueToFix,
  PostmortemAnalysis,
  Lesson,
} from './types';
import { RubricScore } from './llmScoringService';

/**
 * Collector that builds up a debug bundle throughout generation
 */
export class DebugBundleCollector {
  private bundle: GenerationDebugBundle;

  constructor(metadata: {
    runId?: string;
    timestampISO?: string;
    lessonMeta: GenerationDebugBundle['lessonMeta'];
    models: GenerationDebugBundle['models'];
    config: GenerationDebugBundle['config'];
  }) {
    this.bundle = {
      runId: metadata.runId || uuidv4(),
      timestampISO: metadata.timestampISO || new Date().toISOString(),
      lessonMeta: metadata.lessonMeta,
      models: metadata.models,
      config: metadata.config,
      baseline: {
        lesson: null,
        score: null,
      },
      diffs: {
        changedPaths: [],
        changedBlocks: [],
        idAudit: {
          invalidIds: [],
          duplicateIds: [],
        },
      },
    };
  }

  /**
   * Record baseline lesson and score before Phase 10
   */
  recordBaseline(lesson: Lesson, score: RubricScore, issues: IssueToFix[]): void {
    this.bundle.baseline = {
      lesson,
      score,
    };

    // Initialize Phase 10 section with extracted issues
    if (!this.bundle.phase10) {
      this.bundle.phase10 = {
        triggered: false,
        extractedIssues: issues,
        prompts: { system: '', user: '' },
        llmRawResponse: '',
        patches: [],
        accepted: false,
      };
    } else {
      this.bundle.phase10.extractedIssues = issues;
    }
  }

  /**
   * Record Phase 10 prompts
   */
  recordPhase10Prompts(systemPrompt: string, userPrompt: string): void {
    if (!this.bundle.phase10) {
      this.bundle.phase10 = {
        triggered: true,
        extractedIssues: [],
        prompts: { system: '', user: '' },
        llmRawResponse: '',
        patches: [],
        accepted: false,
      };
    }

    this.bundle.phase10.triggered = true;
    this.bundle.phase10.prompts = {
      system: systemPrompt,
      user: userPrompt,
    };
  }

  /**
   * Record Phase 10 LLM response
   */
  recordPhase10Response(rawResponse: string, parsed?: any): void {
    if (!this.bundle.phase10) return;

    this.bundle.phase10.llmRawResponse = rawResponse;
    this.bundle.phase10.llmParsed = parsed;
  }

  /**
   * Record patches (with validation and isolation results)
   */
  recordPatches(patches: PatchDebug[]): void {
    if (!this.bundle.phase10) return;

    this.bundle.phase10.patches = patches;
  }

  /**
   * Record refined lesson and score
   */
  recordRefined(lesson: Lesson, score: RubricScore): void {
    if (!this.bundle.phase10) return;

    this.bundle.phase10.refined = {
      lesson,
      score,
    };

    // Compute diffs
    this.computeDiffs();
  }

  /**
   * Record Phase 10 acceptance decision
   */
  recordAcceptance(accepted: boolean, reason?: string): void {
    if (!this.bundle.phase10) return;

    this.bundle.phase10.accepted = accepted;
    if (reason) {
      this.bundle.phase10.rejectionReason = reason;
    }
  }

  /**
   * Record postmortem analysis
   */
  recordPostmortem(analysis: PostmortemAnalysis): void {
    this.bundle.postmortem = analysis;
  }

  /**
   * Compute diffs between baseline and refined lessons
   */
  private computeDiffs(): void {
    if (!this.bundle.baseline.lesson || !this.bundle.phase10?.refined?.lesson) {
      return;
    }

    const baseline = this.bundle.baseline.lesson;
    const refined = this.bundle.phase10.refined.lesson;

    // Find changed paths by doing deep comparison
    const changedPaths = this.findChangedPaths(baseline, refined);
    this.bundle.diffs.changedPaths = changedPaths;

    // Find changed blocks
    const changedBlocks: number[] = [];
    for (let i = 0; i < Math.max(baseline.blocks?.length || 0, refined.blocks?.length || 0); i++) {
      const baseBlock = baseline.blocks?.[i];
      const refBlock = refined.blocks?.[i];

      if (JSON.stringify(baseBlock) !== JSON.stringify(refBlock)) {
        changedBlocks.push(i);
      }
    }
    this.bundle.diffs.changedBlocks = changedBlocks;

    // ID audit
    this.bundle.diffs.idAudit = this.auditIds(refined);
  }

  /**
   * Find all changed paths between two objects
   */
  private findChangedPaths(obj1: any, obj2: any, prefix: string = ''): string[] {
    const changes: string[] = [];

    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

    for (const key of keys) {
      const path = prefix ? `${prefix}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      if (val1 === val2) continue;

      if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
        if (Array.isArray(val1) && Array.isArray(val2)) {
          // For arrays, check if they're different
          if (JSON.stringify(val1) !== JSON.stringify(val2)) {
            changes.push(path);
          }
        } else {
          // Recurse into objects
          changes.push(...this.findChangedPaths(val1, val2, path));
        }
      } else {
        // Values are different
        changes.push(path);
      }
    }

    return changes;
  }

  /**
   * Audit IDs in lesson for invalid/duplicate IDs
   */
  private auditIds(lesson: Lesson): { invalidIds: string[]; duplicateIds: string[] } {
    const invalidIds: string[] = [];
    const duplicateIds: string[] = [];
    const seenIds = new Set<string>();

    // Check block IDs
    const blockIdPattern = /^(outcomes|vocab|diagram|explanation|worked-example|guided-practice|practice|integrative|spaced-review|microbreak)-\d+$/;
    
    for (const block of lesson.blocks || []) {
      if (!block.id) {
        invalidIds.push(`[Block ${block.order}] Missing ID`);
        continue;
      }

      if (!blockIdPattern.test(block.id)) {
        invalidIds.push(block.id);
      }

      if (seenIds.has(block.id)) {
        duplicateIds.push(block.id);
      }
      seenIds.add(block.id);

      // Check question IDs in practice blocks
      if (block.type === 'practice' && block.content) {
        const questions = (block.content as any).questions || [];
        for (const q of questions) {
          if (q.id) {
            if (seenIds.has(q.id)) {
              duplicateIds.push(q.id);
            }
            seenIds.add(q.id);
          }
        }
      }
    }

    return { invalidIds, duplicateIds };
  }

  /**
   * Get the complete debug bundle
   */
  getBundle(): GenerationDebugBundle {
    return this.bundle;
  }
}

/**
 * Save debug bundle to disk (.json and .md formats)
 */
export async function saveDebugBundle(bundle: GenerationDebugBundle): Promise<void> {
  try {
    const debugRunsDir = path.join(process.cwd(), 'quiz-app', 'src', 'data', 'diagnostics', 'debug_runs');

    // Ensure directory exists
    if (!fs.existsSync(debugRunsDir)) {
      fs.mkdirSync(debugRunsDir, { recursive: true });
    }

    // Save JSON file
    const jsonPath = path.join(debugRunsDir, `${bundle.runId}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(bundle, null, 2), 'utf-8');

    // Generate and save Markdown report
    const markdown = generateMarkdownReport(bundle);
    const mdPath = path.join(debugRunsDir, `${bundle.runId}.md`);
    fs.writeFileSync(mdPath, markdown, 'utf-8');

    console.log(`\n💾 [Debug Bundle] Saved debug bundle:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   MD:   ${mdPath}`);
  } catch (error) {
    console.error('❌ [Debug Bundle] Error saving debug bundle:', error);
    // Don't throw - saving debug bundle should not break generation
  }
}

/**
 * Generate markdown report from debug bundle
 */
function generateMarkdownReport(bundle: GenerationDebugBundle): string {
  const lines: string[] = [];

  // Header
  lines.push('# Phase 10 Debug Report');
  lines.push('');
  lines.push(`**Run ID:** ${bundle.runId}`);
  lines.push(`**Lesson:** ${bundle.lessonMeta.id} - ${bundle.lessonMeta.title || 'N/A'}`);
  lines.push(`**Timestamp:** ${bundle.timestampISO}`);
  lines.push('');

  // Outcome
  lines.push('## Outcome');
  lines.push('');
  lines.push(`- **Baseline Score:** ${bundle.baseline.score?.total || 'N/A'}/100`);
  
  if (bundle.phase10?.refined?.score) {
    const delta = (bundle.phase10.refined.score.total || 0) - (bundle.baseline.score?.total || 0);
    lines.push(`- **Refined Score:** ${bundle.phase10.refined.score.total}/100`);
    lines.push(`- **Delta:** ${delta > 0 ? '+' : ''}${delta} points`);
    lines.push(`- **Accepted:** ${bundle.phase10.accepted ? 'Yes' : 'No'}`);
  } else {
    lines.push(`- **Refined Score:** N/A (Phase 10 not triggered or failed)`);
  }
  lines.push('');

  // Scores by Section
  if (bundle.baseline.score?.details && bundle.phase10?.refined?.score?.details) {
    lines.push('## Scores by Section');
    lines.push('');
    lines.push('| Section | Before | After | Delta |');
    lines.push('|---------|--------|-------|-------|');

    const baseDetails = bundle.baseline.score.details;
    const refDetails = bundle.phase10.refined.score.details;

    for (let i = 0; i < baseDetails.length; i++) {
      const base = baseDetails[i];
      const ref = refDetails[i];

      if (ref) {
        const delta = ref.score - base.score;
        const deltaStr = delta > 0 ? `+${delta}` : `${delta}`;
        lines.push(`| ${base.section} | ${base.score}/${base.maxScore} | ${ref.score}/${ref.maxScore} | ${deltaStr} |`);
      } else {
        lines.push(`| ${base.section} | ${base.score}/${base.maxScore} | N/A | N/A |`);
      }
    }
    lines.push('');
  }

  // Issues Targeted
  if (bundle.phase10?.extractedIssues && bundle.phase10.extractedIssues.length > 0) {
    lines.push('## Issues Targeted');
    lines.push('');
    bundle.phase10.extractedIssues.forEach((issue, idx) => {
      lines.push(`${idx + 1}. **[${issue.section}]** ${issue.issue}`);
      lines.push(`   - Suggestion: ${issue.suggestion}`);
      lines.push(`   - Points lost: ${issue.pointsLost}, Severity: ${issue.severity.toFixed(1)}`);
      lines.push('');
    });
  }

  // Patches Applied
  if (bundle.phase10?.patches && bundle.phase10.patches.length > 0) {
    lines.push('## Patches Applied');
    lines.push('');
    bundle.phase10.patches.forEach((patch, idx) => {
      lines.push(`### ${idx + 1}. Status: ${patch.applyStatus}`);
      lines.push('');
      lines.push(`- **Op:** ${patch.op}`);
      lines.push(`- **Path:** \`${patch.path}\``);
      lines.push(`- **Old Value:** \`${JSON.stringify(patch.oldValue)}\``);
      lines.push(`- **New Value:** \`${JSON.stringify(patch.value)}\``);
      lines.push(`- **Reason:** ${patch.reason || 'N/A'}`);
      
      // Validation
      const val = patch.validation;
      const checks = [
        val.targetExists ? '✓ targetExists' : '✗ targetExists',
        val.fromMatches ? '✓ fromMatches' : (val.fromProvided ? '✗ fromMatches' : 'N/A fromMatches'),
        !val.wouldCreateStructure ? '✓ safeStructure' : '✗ wouldCreateStructure',
        val.allowedOp ? '✓ allowedOp' : '✗ allowedOp',
        val.allowedPath ? '✓ allowedPath' : '✗ allowedPath',
      ];
      lines.push(`- **Validation:** ${checks.join(', ')}`);

      // Isolation scores
      if (patch.scoreDeltaSequential !== undefined) {
        lines.push(`- **Isolation (Sequential):** ${patch.scoreDeltaSequential > 0 ? '+' : ''}${patch.scoreDeltaSequential} total`);
        if (patch.sectionDeltasSequential) {
          const sections = Object.entries(patch.sectionDeltasSequential)
            .filter(([, delta]) => delta !== 0)
            .map(([section, delta]) => `${section}: ${delta > 0 ? '+' : ''}${delta}`)
            .join(', ');
          if (sections) {
            lines.push(`  - Sections: ${sections}`);
          }
        }
      }

      if (patch.scoreDeltaIndependent !== undefined) {
        lines.push(`- **Isolation (Independent):** ${patch.scoreDeltaIndependent > 0 ? '+' : ''}${patch.scoreDeltaIndependent} total`);
        if (patch.sectionDeltasIndependent) {
          const sections = Object.entries(patch.sectionDeltasIndependent)
            .filter(([, delta]) => delta !== 0)
            .map(([section, delta]) => `${section}: ${delta > 0 ? '+' : ''}${delta}`)
            .join(', ');
          if (sections) {
            lines.push(`  - Sections: ${sections}`);
          }
        }
      }

      lines.push('');
    });
  }

  // Postmortem Analysis
  if (bundle.postmortem) {
    lines.push('## Postmortem Analysis');
    lines.push('');
    lines.push(`**Root Cause:** ${bundle.postmortem.rootCause}`);
    lines.push('');

    if (bundle.postmortem.harmfulPatches && bundle.postmortem.harmfulPatches.length > 0) {
      lines.push('**Harmful Patches:**');
      bundle.postmortem.harmfulPatches.forEach((hp) => {
        lines.push(`- Patch ${hp.patchIndex}: ${hp.why} (${hp.pointsLost} points)`);
      });
      lines.push('');
    }

    if (bundle.postmortem.recommendations && bundle.postmortem.recommendations.length > 0) {
      lines.push('**Recommendations:**');
      bundle.postmortem.recommendations.forEach((rec) => {
        lines.push(`- ${rec}`);
      });
      lines.push('');
    }
  }

  // Diffs
  if (bundle.diffs.changedPaths.length > 0) {
    lines.push('## Changed Paths');
    lines.push('');
    bundle.diffs.changedPaths.slice(0, 20).forEach((p) => {
      lines.push(`- \`${p}\``);
    });
    if (bundle.diffs.changedPaths.length > 20) {
      lines.push(`- ... and ${bundle.diffs.changedPaths.length - 20} more`);
    }
    lines.push('');
  }

  // ID Audit
  if (bundle.diffs.idAudit.invalidIds.length > 0 || bundle.diffs.idAudit.duplicateIds.length > 0) {
    lines.push('## ID Audit Issues');
    lines.push('');
    if (bundle.diffs.idAudit.invalidIds.length > 0) {
      lines.push('**Invalid IDs:**');
      bundle.diffs.idAudit.invalidIds.forEach((id) => {
        lines.push(`- ${id}`);
      });
      lines.push('');
    }
    if (bundle.diffs.idAudit.duplicateIds.length > 0) {
      lines.push('**Duplicate IDs:**');
      bundle.diffs.idAudit.duplicateIds.forEach((id) => {
        lines.push(`- ${id}`);
      });
      lines.push('');
    }
  }

  return lines.join('\n');
}
