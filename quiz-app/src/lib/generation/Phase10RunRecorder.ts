/**
 * Phase 10 Run Recorder
 * 
 * Records comprehensive debug artifacts for every Phase 10 run to enable
 * complete replayable visibility into prompts, model outputs, scoring,
 * validation, patch application, and diffs.
 * 
 * Folder structure: /reports/phase10_runs/<lessonId>/<runId>/
 * Each run generates 10-17 files including INDEX.json master manifest.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Lesson } from './types';
import { RubricScore } from './llmScoringService';
import { getDebugArtifactsConfig } from './config';

interface IndexData {
  lessonId: string;
  runId: string;
  timestampUtc: string;
  phase10Strategy: 'rewrite' | 'patch';
  models: Record<string, string>;
  
  // Run configuration snapshot
  runConfig: {
    threshold: number;
    strategy: string;
    maxAttempts: number;
    modelRouting: Record<string, string>;
    hardGates: Record<string, boolean>;
  } | null;
  
  scoreBefore: {
    total: number;
    grade: string;
    breakdownFile: string;
    promptFile: string;
    outputFile: string;
    metadata: {
      finishReason?: string;
      tokenCounts?: {
        prompt: number;
        completion: number;
        total: number;
      };
      safetyBlocks?: any[];
      truncated?: boolean;
    } | null;
  } | null;
  
  scoreAfter: {
    total: number;
    grade: string;
    breakdownFile: string;
    promptFile: string;
    outputFile: string;
    metadata: {
      finishReason?: string;
      tokenCounts?: {
        prompt: number;
        completion: number;
        total: number;
      };
      safetyBlocks?: any[];
      truncated?: boolean;
    } | null;
  } | null;
  
  // Score stability check (optional - re-score same lesson multiple times)
  scoreStability: {
    enabled: boolean;
    runs: Array<{
      runNumber: number;
      total: number;
      grade: string;
      file: string;
    }>;
  } | null;
  
  // NEW: Fix plan
  fixPlan: {
    file: string;
    promptFile: string;
    itemCount: number;
    fixableCount: number;
    blockedCount: number;
  } | null;
  
  // NEW: Issue lifecycle
  issueLifecycle: {
    file: string;
    totalIssues: number;
    fixed: number;
    unmoved: number;
    blocked: number;
  } | null;
  
  // NEW: Pointer diff
  pointerDiff: {
    file: string;
    changeCount: number;
  } | null;
  
  // NEW: Blockers summary
  blockers: {
    file: string;
    totalBlocked: number;
    pointsBlocked: number;
  } | null;
  
  validator: {
    passed: boolean;
    warnings: number;
    file: string;
  } | null;
  
  patching: {
    patchCountProposed: number;
    patchCountApplied: number;
    applyFile: string | null;
    parseFile: string | null;
  };
  
  // LLM response metadata for rewrite step
  rewriteMetadata: {
    promptFile: string;
    outputFile: string;
    finishReason?: string;
    tokenCounts?: {
      prompt: number;
      completion: number;
      total: number;
    };
    safetyBlocks?: any[];
    truncated?: boolean;
    repaired?: boolean;
  } | null;
  
  status: 'success' | 'failed' | 'partial';
  failure: {
    step: string;
    message: string;
  } | null;
  files: string[];
}

export class Phase10RunRecorder {
  private lessonId: string;
  private strategy: 'rewrite' | 'patch';
  private models: Record<string, string>;
  private runId: string | null = null;
  private runDir: string | null = null;
  private writtenFiles: string[] = [];
  private indexData: IndexData;
  
  constructor(
    lessonId: string,
    strategy: 'rewrite' | 'patch',
    models: Record<string, string>
  ) {
    this.lessonId = lessonId;
    this.strategy = strategy;
    this.models = models;
    
    // Initialize index data
    this.indexData = {
      lessonId,
      runId: '',
      timestampUtc: new Date().toISOString(),
      phase10Strategy: strategy,
      models,
      runConfig: null,
      scoreBefore: null,
      scoreAfter: null,
      scoreStability: null,
      fixPlan: null,
      issueLifecycle: null,
      pointerDiff: null,
      blockers: null,
      validator: null,
      patching: {
        patchCountProposed: 0,
        patchCountApplied: 0,
        applyFile: null,
        parseFile: null,
      },
      rewriteMetadata: null,
      status: 'success',
      failure: null,
      files: [],
    };
  }
  
  /**
   * Initialize run folder and return runId
   */
  async startRun(): Promise<string> {
    const config = getDebugArtifactsConfig();
    
    // Generate unique runId with timestamp, strategy, and model
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
    const modelShort = this.models.rewrite || this.models.generator || 'unknown';
    const modelName = modelShort.split('/').pop() || modelShort;
    this.runId = `${this.lessonId}__${timestamp}__${this.strategy}__${modelName}`;
    this.indexData.runId = this.runId;
    
    // Create run directory in its own folder: <outputPath>/<runId>/
    const baseDir = path.isAbsolute(config.outputPath)
      ? config.outputPath
      : path.join(process.cwd(), config.outputPath);
    
    this.runDir = path.join(baseDir, this.runId);
    
    // Ensure directory exists
    if (!fs.existsSync(this.runDir)) {
      fs.mkdirSync(this.runDir, { recursive: true });
    }
    
    console.log(`\n📁 [Phase10Recorder] Run artifacts will be saved to: ${this.runDir}`);
    
    return this.runId;
  }
  
  /**
   * Write JSON data to file
   */
  async writeJson(filename: string, data: any): Promise<void> {
    if (!this.runDir) {
      throw new Error('Run not started. Call startRun() first.');
    }
    
    try {
      const filepath = path.join(this.runDir, filename);
      const redactedData = this.redactSecrets(data);
      fs.writeFileSync(filepath, JSON.stringify(redactedData, null, 2), 'utf-8');
      this.writtenFiles.push(filename);
      console.log(`   ✓ Wrote ${filename}`);
    } catch (error) {
      console.error(`   ✗ Failed to write ${filename}:`, error);
      // Don't throw - recording failures should not crash Phase 10
    }
  }
  
  /**
   * Write text data to file
   */
  async writeText(filename: string, text: string): Promise<void> {
    if (!this.runDir) {
      throw new Error('Run not started. Call startRun() first.');
    }
    
    try {
      const filepath = path.join(this.runDir, filename);
      const redactedText = this.redactSecretsFromString(text);
      fs.writeFileSync(filepath, redactedText, 'utf-8');
      this.writtenFiles.push(filename);
      console.log(`   ✓ Wrote ${filename}`);
    } catch (error) {
      console.error(`   ✗ Failed to write ${filename}:`, error);
      // Don't throw - recording failures should not crash Phase 10
    }
  }
  
  /**
   * Write prompt with metadata
   */
  async writePrompt(
    filename: string,
    step: string,
    model: string,
    system: string,
    user: string,
    metadata?: any
  ): Promise<void> {
    const promptData = {
      step,
      model,
      temperature: 0,
      maxTokens: metadata?.maxTokens || 24000,
      system: system,
      user: user,
      inputRefs: metadata?.inputRefs || [],
      notes: metadata?.notes || '',
      timestamp: new Date().toISOString(),
    };
    
    await this.writeJson(filename, promptData);
  }
  
  /**
   * Write human-readable diff between two lessons
   */
  async writeDiff(beforeLesson: Lesson, afterLesson: Lesson): Promise<void> {
    if (!this.runDir) {
      throw new Error('Run not started. Call startRun() first.');
    }
    
    try {
      const filename = '17_diff.txt';
      const filepath = path.join(this.runDir, filename);
      
      // Generate diff text
      const diffText = this.generateDiffText(beforeLesson, afterLesson);
      
      fs.writeFileSync(filepath, diffText, 'utf-8');
      this.writtenFiles.push(filename);
      console.log(`   ✓ Wrote ${filename}`);
      
      // NEW: Also generate and write pointer diff
      const { generatePointerDiff } = await import('./pointerDiffGenerator');
      const pointerDiff = generatePointerDiff(beforeLesson, afterLesson);
      this.recordPointerDiff(pointerDiff);
    } catch (error) {
      console.error(`   ✗ Failed to write diff:`, error);
      // Don't throw - recording failures should not crash Phase 10
    }
  }
  
  /**
   * Record run configuration snapshot
   */
  recordRunConfig(config: {
    threshold: number;
    strategy: string;
    maxAttempts: number;
    modelRouting: Record<string, string>;
    hardGates: Record<string, boolean>;
  }): void {
    this.indexData.runConfig = config;
    this.writeJson('00_run_config.json', config).catch(() => {});
  }
  
  /**
   * Record score with full prompt/output and LLM metadata
   */
  recordScoreWithMetadata(
    when: 'before' | 'after',
    score: RubricScore,
    promptFile: string,
    outputFile: string,
    metadata?: {
      finishReason?: string;
      tokenCounts?: { prompt: number; completion: number; total: number };
      safetyBlocks?: any[];
      truncated?: boolean;
    }
  ): void {
    const scoreData = {
      total: score.total,
      grade: score.grade,
      breakdownFile: when === 'before' ? '01_score_before.json' : '11_score_after.json',
      promptFile,
      outputFile,
      metadata: metadata || null,
    };
    
    if (when === 'before') {
      this.indexData.scoreBefore = scoreData;
      this.writeJson('01_score_before.json', score).catch(() => {});
    } else {
      this.indexData.scoreAfter = scoreData;
      this.writeJson('11_score_after.json', score).catch(() => {});
    }
  }
  
  /**
   * Record score (before or after refinement) - legacy method
   */
  recordScore(when: 'before' | 'after', score: RubricScore): void {
    // Use new method with default file names
    this.recordScoreWithMetadata(
      when,
      score,
      when === 'before' ? '05_prompt_score_before.json' : '12_prompt_score_after.json',
      when === 'before' ? '06_output_score_before.txt' : '13_output_score_after.txt'
    );
  }
  
  /**
   * Record rewrite LLM response metadata
   */
  recordRewriteMetadata(metadata: {
    promptFile: string;
    outputFile: string;
    finishReason?: string;
    tokenCounts?: { prompt: number; completion: number; total: number };
    safetyBlocks?: any[];
    truncated?: boolean;
    repaired?: boolean;
  }): void {
    this.indexData.rewriteMetadata = metadata;
  }
  
  /**
   * Record score stability check results
   */
  recordScoreStability(runs: Array<{
    runNumber: number;
    total: number;
    grade: string;
    file: string;
  }>): void {
    this.indexData.scoreStability = {
      enabled: true,
      runs,
    };
    
    // Write stability report
    this.writeJson('18_score_stability.json', {
      enabled: true,
      runs,
      analysis: {
        mean: runs.reduce((sum, r) => sum + r.total, 0) / runs.length,
        min: Math.min(...runs.map(r => r.total)),
        max: Math.max(...runs.map(r => r.total)),
        range: Math.max(...runs.map(r => r.total)) - Math.min(...runs.map(r => r.total)),
      }
    }).catch(() => {});
  }
  
  /**
   * Record fix plan
   */
  recordFixPlan(plan: any): void {
    const fixableCount = plan.plan.filter((p: any) => 
      p.fixability === 'deterministic' || p.fixability === 'llm_editable'
    ).length;
    const blockedCount = plan.plan.filter((p: any) => 
      p.fixability === 'blocked_by_policy' || p.fixability === 'requires_regeneration'
    ).length;
    
    this.indexData.fixPlan = {
      file: '04_plan.json',
      promptFile: '04_prompt_plan.json',
      itemCount: plan.plan.length,
      fixableCount,
      blockedCount
    };
  }
  
  /**
   * Record issue lifecycle
   */
  recordIssueLifecycle(lifecycle: any): void {
    const fixed = lifecycle.issues.filter((i: any) => i.outcome === 'fixed').length;
    const unmoved = lifecycle.issues.filter((i: any) => i.outcome === 'unmoved').length;
    const blocked = lifecycle.issues.filter((i: any) => 
      i.fixability === 'blocked_by_policy' || i.fixability === 'requires_regeneration'
    ).length;
    
    this.indexData.issueLifecycle = {
      file: '18_issue_lifecycle.json',
      totalIssues: lifecycle.issues.length,
      fixed,
      unmoved,
      blocked
    };
    
    // Write lifecycle file
    this.writeJson('18_issue_lifecycle.json', lifecycle).catch(() => {});
  }
  
  /**
   * Record pointer diff
   */
  recordPointerDiff(diff: any): void {
    this.indexData.pointerDiff = {
      file: '19_pointer_diff.json',
      changeCount: diff.changes.length
    };
    
    // Write pointer diff file
    this.writeJson('19_pointer_diff.json', diff).catch(() => {});
  }
  
  /**
   * Record blockers summary
   */
  recordBlockers(blockersSummary: any): void {
    this.indexData.blockers = {
      file: '21_blockers.json',
      totalBlocked: blockersSummary.summary.totalBlocked,
      pointsBlocked: blockersSummary.summary.pointsBlocked
    };
    
    // Write blockers file
    this.writeJson('21_blockers.json', blockersSummary).catch(() => {});
  }
  
  /**
   * Record validation results
   */
  recordValidation(result: any): void {
    this.indexData.validator = {
      passed: result.valid || false,
      warnings: result.warnings?.length || 0,
      file: '16_validation.json',
    };
    
    // Write validation file
    this.writeJson('16_validation.json', result).catch(() => {});
  }
  
  /**
   * Record parse result (patches or parse error)
   */
  recordParseResult(patches?: any[], parseError?: string): void {
    if (parseError) {
      const errorData = {
        error: parseError,
        timestamp: new Date().toISOString(),
      };
      this.writeJson('14_patches_parse_error.json', errorData).catch(() => {});
      this.indexData.patching.parseFile = '14_patches_parse_error.json';
    } else if (patches) {
      this.writeJson('14_patches_parsed.json', patches).catch(() => {});
      this.indexData.patching.parseFile = '14_patches_parsed.json';
      this.indexData.patching.patchCountProposed = patches.length;
    }
  }
  
  /**
   * Record patch application result
   */
  recordApplyResult(result: any): void {
    this.writeJson('15_apply_result.json', result).catch(() => {});
    this.indexData.patching.applyFile = '15_apply_result.json';
    
    if (result.applied) {
      this.indexData.patching.patchCountApplied = result.applied.length;
    }
  }
  
  /**
   * Record status (success, failed, partial)
   */
  recordStatus(
    status: 'success' | 'failed' | 'partial',
    failure?: { step: string; message: string }
  ): void {
    this.indexData.status = status;
    if (failure) {
      this.indexData.failure = failure;
    }
  }
  
  /**
   * Finalize run by writing INDEX.json
   */
  async finalize(): Promise<void> {
    if (!this.runDir) {
      console.warn('   ⚠ Cannot finalize: run not started');
      return;
    }
    
    try {
      // Update files list
      this.indexData.files = this.writtenFiles.sort();
      
      // Write INDEX.json
      const indexPath = path.join(this.runDir, 'INDEX.json');
      fs.writeFileSync(indexPath, JSON.stringify(this.indexData, null, 2), 'utf-8');
      console.log(`   ✓ Wrote INDEX.json`);
      
      // Generate and write combined markdown file
      const combined = this.generateCombinedMarkdown();
      const combinedPath = path.join(this.runDir, 'COMBINED.md');
      fs.writeFileSync(combinedPath, combined, 'utf-8');
      console.log(`   ✓ Wrote COMBINED.md`);
      
      console.log(`\n📦 [Phase10Recorder] Finalized: ${this.writtenFiles.length + 2} files written`);
      console.log(`📁 [Phase10Recorder] Folder: ${this.runDir}`);
    } catch (error) {
      console.error(`   ✗ Failed to write INDEX.json:`, error);
    }
  }
  
  /**
   * Generate combined markdown file with all run information
   */
  private generateCombinedMarkdown(): string {
    const lines: string[] = [];
    
    // Header
    lines.push('# Phase 10 Debug Run');
    lines.push('');
    lines.push(`**Run ID:** ${this.runId}`);
    lines.push(`**Lesson:** ${this.lessonId}`);
    lines.push(`**Strategy:** ${this.strategy}`);
    lines.push(`**Timestamp:** ${this.indexData.timestampUtc}`);
    lines.push(`**Status:** ${this.indexData.status}`);
    lines.push('');
    lines.push('=' .repeat(80));
    lines.push('');
    
    // Run Configuration
    if (this.indexData.runConfig) {
      lines.push('## Run Configuration');
      lines.push('');
      lines.push(`- **Threshold:** ${this.indexData.runConfig.threshold}`);
      lines.push(`- **Strategy:** ${this.indexData.runConfig.strategy}`);
      lines.push(`- **Max Attempts:** ${this.indexData.runConfig.maxAttempts}`);
      lines.push(`- **Model Routing:** ${JSON.stringify(this.indexData.runConfig.modelRouting, null, 2)}`);
      lines.push(`- **Hard Gates:** ${JSON.stringify(this.indexData.runConfig.hardGates, null, 2)}`);
      lines.push('');
      lines.push('=' .repeat(80));
      lines.push('');
    }
    
    // Summary
    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Score Before:** ${this.indexData.scoreBefore?.total || 'N/A'}/100 (${this.indexData.scoreBefore?.grade || 'N/A'})`);
    lines.push(`- **Score After:** ${this.indexData.scoreAfter?.total || 'N/A'}/100 (${this.indexData.scoreAfter?.grade || 'N/A'})`);
    
    if (this.indexData.scoreAfter && this.indexData.scoreBefore) {
      const delta = this.indexData.scoreAfter.total - this.indexData.scoreBefore.total;
      lines.push(`- **Delta:** ${delta > 0 ? '+' : ''}${delta} points`);
    }
    
    lines.push(`- **Validation:** ${this.indexData.validator?.passed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (this.indexData.validator && this.indexData.validator.warnings > 0) {
      lines.push(`- **Warnings:** ${this.indexData.validator.warnings}`);
    }
    
    // Score stability
    if (this.indexData.scoreStability?.enabled) {
      lines.push('');
      lines.push('### Score Stability Check');
      const runs = this.indexData.scoreStability.runs;
      const scores = runs.map(r => r.total);
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const range = Math.max(...scores) - Math.min(...scores);
      lines.push(`- **Runs:** ${runs.length}`);
      lines.push(`- **Mean:** ${mean.toFixed(1)}`);
      lines.push(`- **Range:** ${range} points (${Math.min(...scores)} - ${Math.max(...scores)})`);
      lines.push(`- **Stable:** ${range <= 3 ? '✅ YES' : '⚠️ NO'}`);
    }
    
    if (this.indexData.failure) {
      lines.push('');
      lines.push(`**Failure:**`);
      lines.push(`- Step: ${this.indexData.failure.step}`);
      lines.push(`- Message: ${this.indexData.failure.message}`);
    }
    
    lines.push('');
    lines.push('=' .repeat(80));
    lines.push('');
    
    // === EXACT INPUT/OUTPUT LESSON FILES ===
    lines.push('## Input & Output Lesson Files');
    lines.push('');
    
    const lessonFiles = [
      { name: '00_input_lesson.json', title: 'Input Lesson (Before Refinement)' },
      { name: '10_output_lesson.json', title: 'Output Lesson (After Refinement)' },
    ];
    
    for (const file of lessonFiles) {
      const filepath = path.join(this.runDir!, file.name);
      if (fs.existsSync(filepath)) {
        lines.push(`### ${file.title}`);
        lines.push('');
        lines.push(`**File:** \`${file.name}\``);
        lines.push('');
        try {
          const content = fs.readFileSync(filepath, 'utf-8');
          lines.push('```json');
          lines.push(content);
          lines.push('```');
        } catch (error) {
          lines.push('```');
          lines.push(`Error reading file: ${error}`);
          lines.push('```');
        }
        lines.push('');
        lines.push('---');
        lines.push('');
      }
    }
    
    // === SCORING PROMPTS + OUTPUTS ===
    lines.push('## Scoring');
    lines.push('');
    
    const scoringPairs = [
      {
        promptFile: '05_prompt_score_before.json',
        outputFile: '06_output_score_before.txt',
        resultFile: '01_score_before.json',
        title: 'Score Before Refinement',
        metadata: this.indexData.scoreBefore?.metadata
      },
      {
        promptFile: '12_prompt_score_after.json',
        outputFile: '13_output_score_after.txt',
        resultFile: '11_score_after.json',
        title: 'Score After Refinement',
        metadata: this.indexData.scoreAfter?.metadata
      },
    ];
    
    for (const pair of scoringPairs) {
      lines.push(`### ${pair.title}`);
      lines.push('');
      
      // Prompt
      const promptPath = path.join(this.runDir!, pair.promptFile);
      if (fs.existsSync(promptPath)) {
        try {
          const promptData = JSON.parse(fs.readFileSync(promptPath, 'utf-8'));
          lines.push('#### Scoring Prompt');
          lines.push('');
          lines.push(`**Model:** ${promptData.model || 'N/A'}`);
          lines.push(`**Temperature:** ${promptData.temperature ?? 'N/A'}`);
          lines.push(`**Max Tokens:** ${promptData.maxTokens || 'N/A'}`);
          lines.push('');
          
          if (promptData.system) {
            lines.push('**System Prompt:**');
            lines.push('```');
            lines.push(promptData.system);
            lines.push('```');
            lines.push('');
          }
          
          if (promptData.user) {
            lines.push('**User Prompt:**');
            lines.push('```');
            lines.push(promptData.user);
            lines.push('```');
            lines.push('');
          }
        } catch (error) {
          lines.push(`Error parsing prompt: ${error}`);
          lines.push('');
        }
      }
      
      // Raw output
      const outputPath = path.join(this.runDir!, pair.outputFile);
      if (fs.existsSync(outputPath)) {
        lines.push('#### Raw Scoring Output');
        lines.push('');
        if (pair.metadata) {
          lines.push(`**Finish Reason:** ${pair.metadata.finishReason || 'N/A'}`);
          if (pair.metadata.tokenCounts) {
            lines.push(`**Token Counts:** Prompt: ${pair.metadata.tokenCounts.prompt}, Completion: ${pair.metadata.tokenCounts.completion}, Total: ${pair.metadata.tokenCounts.total}`);
          }
          if (pair.metadata.truncated) {
            lines.push(`**⚠️ TRUNCATED:** Model output was cut off!`);
          }
          if (pair.metadata.safetyBlocks && pair.metadata.safetyBlocks.length > 0) {
            lines.push(`**⚠️ SAFETY BLOCKS:** ${JSON.stringify(pair.metadata.safetyBlocks)}`);
          }
          lines.push('');
        }
        try {
          const content = fs.readFileSync(outputPath, 'utf-8');
          lines.push('```');
          lines.push(content);
          lines.push('```');
        } catch (error) {
          lines.push(`Error reading output: ${error}`);
        }
        lines.push('');
      }
      
      // Parsed result
      const resultPath = path.join(this.runDir!, pair.resultFile);
      if (fs.existsSync(resultPath)) {
        lines.push('#### Parsed Score');
        lines.push('');
        try {
          const content = fs.readFileSync(resultPath, 'utf-8');
          lines.push('```json');
          lines.push(content);
          lines.push('```');
        } catch (error) {
          lines.push(`Error reading result: ${error}`);
        }
        lines.push('');
      }
      
      lines.push('---');
      lines.push('');
    }
    
    // === REWRITE PROMPT + OUTPUT ===
    lines.push('## Rewrite Step');
    lines.push('');
    
    const promptPath = path.join(this.runDir!, '02_prompt_rewrite.json');
    if (fs.existsSync(promptPath)) {
      try {
        const promptData = JSON.parse(fs.readFileSync(promptPath, 'utf-8'));
        
        lines.push('### Rewrite Prompt');
        lines.push('');
        lines.push(`**Timestamp:** ${promptData.timestamp || 'N/A'}`);
        lines.push(`**Model:** ${promptData.model || 'N/A'}`);
        lines.push(`**Temperature:** ${promptData.temperature ?? 'N/A'}`);
        lines.push(`**Max Tokens:** ${promptData.maxTokens || 'N/A'}`);
        lines.push('');
        
        if (promptData.system) {
          lines.push('#### System Prompt');
          lines.push('');
          lines.push('```');
          lines.push(promptData.system);
          lines.push('```');
          lines.push('');
        }
        
        if (promptData.user) {
          lines.push('#### User Prompt');
          lines.push('');
          lines.push('```');
          lines.push(promptData.user);
          lines.push('```');
          lines.push('');
        }
      } catch (error) {
        lines.push(`Error parsing rewrite prompt: ${error}`);
        lines.push('');
      }
    }
    
    const outputPath = path.join(this.runDir!, '03_output_rewrite.txt');
    if (fs.existsSync(outputPath)) {
      lines.push('### Rewrite Output (Raw Model Response)');
      lines.push('');
      
      if (this.indexData.rewriteMetadata) {
        const meta = this.indexData.rewriteMetadata;
        lines.push(`**Finish Reason:** ${meta.finishReason || 'N/A'}`);
        if (meta.tokenCounts) {
          lines.push(`**Token Counts:** Prompt: ${meta.tokenCounts.prompt}, Completion: ${meta.tokenCounts.completion}, Total: ${meta.tokenCounts.total}`);
        }
        if (meta.truncated) {
          lines.push(`**⚠️ TRUNCATED:** Model output was cut off!`);
        }
        if (meta.repaired) {
          lines.push(`**⚠️ REPAIRED:** Output was auto-repaired after truncation/corruption`);
        }
        if (meta.safetyBlocks && meta.safetyBlocks.length > 0) {
          lines.push(`**⚠️ SAFETY BLOCKS:** ${JSON.stringify(meta.safetyBlocks)}`);
        }
        lines.push('');
      }
      
      try {
        const content = fs.readFileSync(outputPath, 'utf-8');
        lines.push('```json');
        lines.push(content);
        lines.push('```');
      } catch (error) {
        lines.push(`Error reading output: ${error}`);
      }
      lines.push('');
    }
    
    lines.push('---');
    lines.push('');
    
    // === PATCH/PARSE ARTIFACTS ===
    lines.push('## Patch/Parse Artifacts');
    lines.push('');
    lines.push('_These files exist even for rewrite strategy to show whether patch logic was invoked._');
    lines.push('');
    
    const patchFile = path.join(this.runDir!, '14_patches_parsed.json');
    if (fs.existsSync(patchFile)) {
      lines.push('### Patches Parsed');
      lines.push('');
      lines.push(`**File:** \`14_patches_parsed.json\``);
      lines.push('');
      try {
        const content = fs.readFileSync(patchFile, 'utf-8');
        lines.push('```json');
        lines.push(content);
        lines.push('```');
      } catch (error) {
        lines.push(`Error reading patches: ${error}`);
      }
      lines.push('');
    }
    
    lines.push('---');
    lines.push('');
    
    // === NEW: FIX PLAN ===
    if (this.indexData.fixPlan) {
      lines.push('## Fix Plan');
      lines.push('');
      lines.push(`**Items:** ${this.indexData.fixPlan.itemCount}`);
      lines.push(`**Fixable:** ${this.indexData.fixPlan.fixableCount}`);
      lines.push(`**Blocked:** ${this.indexData.fixPlan.blockedCount}`);
      lines.push('');
      
      const planPath = path.join(this.runDir!, '04_plan.json');
      if (fs.existsSync(planPath)) {
        try {
          const content = fs.readFileSync(planPath, 'utf-8');
          lines.push('```json');
          lines.push(content);
          lines.push('```');
        } catch (error) {
          lines.push(`Error reading plan: ${error}`);
        }
        lines.push('');
      }
      
      lines.push('---');
      lines.push('');
    }
    
    // === NEW: ISSUE LIFECYCLE ===
    if (this.indexData.issueLifecycle) {
      lines.push('## Issue Lifecycle');
      lines.push('');
      lines.push(`**Total Issues:** ${this.indexData.issueLifecycle.totalIssues}`);
      lines.push(`**Fixed:** ${this.indexData.issueLifecycle.fixed}`);
      lines.push(`**Unmoved:** ${this.indexData.issueLifecycle.unmoved}`);
      lines.push(`**Blocked:** ${this.indexData.issueLifecycle.blocked}`);
      lines.push('');
      
      const lifecyclePath = path.join(this.runDir!, '18_issue_lifecycle.json');
      if (fs.existsSync(lifecyclePath)) {
        try {
          const content = fs.readFileSync(lifecyclePath, 'utf-8');
          lines.push('```json');
          lines.push(content);
          lines.push('```');
        } catch (error) {
          lines.push(`Error reading lifecycle: ${error}`);
        }
        lines.push('');
      }
      
      lines.push('---');
      lines.push('');
    }
    
    // === NEW: POINTER DIFF ===
    if (this.indexData.pointerDiff) {
      lines.push('## Pointer Diff (JSON Pointer Format)');
      lines.push('');
      lines.push(`**Changes:** ${this.indexData.pointerDiff.changeCount}`);
      lines.push('');
      
      const pointerDiffPath = path.join(this.runDir!, '19_pointer_diff.json');
      if (fs.existsSync(pointerDiffPath)) {
        try {
          const content = fs.readFileSync(pointerDiffPath, 'utf-8');
          lines.push('```json');
          lines.push(content);
          lines.push('```');
        } catch (error) {
          lines.push(`Error reading pointer diff: ${error}`);
        }
        lines.push('');
      }
      
      lines.push('---');
      lines.push('');
    }
    
    // === NEW: BLOCKERS SUMMARY ===
    if (this.indexData.blockers) {
      lines.push('## Blockers Summary');
      lines.push('');
      lines.push(`**Total Blocked:** ${this.indexData.blockers.totalBlocked}`);
      lines.push(`**Points Blocked:** ${this.indexData.blockers.pointsBlocked}`);
      lines.push('');
      
      const blockersPath = path.join(this.runDir!, '21_blockers.json');
      if (fs.existsSync(blockersPath)) {
        try {
          const content = fs.readFileSync(blockersPath, 'utf-8');
          lines.push('```json');
          lines.push(content);
          lines.push('```');
        } catch (error) {
          lines.push(`Error reading blockers: ${error}`);
        }
        lines.push('');
      }
      
      lines.push('---');
      lines.push('');
    }
    
    // === OTHER FILES ===
    const otherFiles = [
      { name: 'INDEX.json', title: 'Index Manifest', format: 'json' },
      { name: '16_validation.json', title: 'Validation Results', format: 'json' },
      { name: '17_diff.txt', title: 'Human-Readable Diff', format: 'text' },
      { name: '20_score_stability.json', title: 'Score Stability Analysis', format: 'json' },
    ];
    
    for (const file of otherFiles) {
      const filepath = path.join(this.runDir!, file.name);
      
      if (fs.existsSync(filepath)) {
        lines.push(`## ${file.title}`);
        lines.push('');
        lines.push(`**File:** \`${file.name}\``);
        lines.push('');
        
        try {
          const content = fs.readFileSync(filepath, 'utf-8');
          
          if (file.format === 'json') {
            lines.push('```json');
            lines.push(content);
            lines.push('```');
          } else {
            lines.push('```');
            lines.push(content);
            lines.push('```');
          }
        } catch (error) {
          lines.push('```');
          lines.push(`Error reading file: ${error}`);
          lines.push('```');
        }
        
        lines.push('');
        lines.push('---');
        lines.push('');
      }
    }
    
    // Footer
    lines.push('## End of Report');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Total files: ${this.writtenFiles.length + 2}`);
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Redact secrets from objects
   */
  private redactSecrets(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.redactSecrets(item));
    }
    
    const redacted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const keyLower = key.toLowerCase();
      
      // Redact sensitive keys
      if (
        keyLower.includes('api') && keyLower.includes('key') ||
        keyLower.includes('apikey') ||
        keyLower === 'authorization' ||
        keyLower === 'password' ||
        keyLower === 'secret' ||
        keyLower === 'token'
      ) {
        redacted[key] = '***REDACTED***';
      } else if (typeof value === 'object') {
        redacted[key] = this.redactSecrets(value);
      } else {
        redacted[key] = value;
      }
    }
    
    return redacted;
  }
  
  /**
   * Redact secrets from strings
   */
  private redactSecretsFromString(text: string): string {
    // Redact common API key patterns
    let redacted = text;
    
    // Gemini API keys (format: AIza...)
    redacted = redacted.replace(/AIza[0-9A-Za-z-_]{35}/g, '***REDACTED_API_KEY***');
    
    // Generic API key patterns
    redacted = redacted.replace(/api[_-]?key['":\s]+['"]\w+['"]/gi, 'api_key: "***REDACTED***"');
    
    // Authorization headers
    redacted = redacted.replace(/authorization['":\s]+['"](Bearer\s+)?[A-Za-z0-9-._~+/]+=*['"]/gi, 'authorization: "***REDACTED***"');
    
    return redacted;
  }
  
  /**
   * Generate human-readable diff text between two lessons
   */
  private generateDiffText(before: Lesson, after: Lesson): string {
    const lines: string[] = [];
    
    lines.push('# Phase 10 Lesson Diff');
    lines.push('');
    lines.push(`Lesson: ${before.id}`);
    lines.push(`Timestamp: ${new Date().toISOString()}`);
    lines.push('');
    lines.push('=' .repeat(80));
    lines.push('');
    
    // Compare top-level metadata
    lines.push('## Metadata Changes');
    lines.push('');
    
    if (before.title !== after.title) {
      lines.push(`Title:`);
      lines.push(`  BEFORE: ${before.title}`);
      lines.push(`  AFTER:  ${after.title}`);
      lines.push('');
    }
    
    if (before.description !== after.description) {
      lines.push(`Description:`);
      lines.push(`  BEFORE: ${before.description}`);
      lines.push(`  AFTER:  ${after.description}`);
      lines.push('');
    }
    
    // Compare learning outcomes
    const outcomesBefore = JSON.stringify(before.learningOutcomes);
    const outcomesAfter = JSON.stringify(after.learningOutcomes);
    if (outcomesBefore !== outcomesAfter) {
      lines.push(`Learning Outcomes: CHANGED`);
      lines.push('');
    }
    
    // Compare blocks
    lines.push('## Block Changes');
    lines.push('');
    
    const maxBlocks = Math.max(before.blocks?.length || 0, after.blocks?.length || 0);
    let changedBlockCount = 0;
    
    for (let i = 0; i < maxBlocks; i++) {
      const beforeBlock = before.blocks?.[i];
      const afterBlock = after.blocks?.[i];
      
      if (!beforeBlock || !afterBlock) {
        lines.push(`Block ${i}: MISSING IN ${!beforeBlock ? 'BEFORE' : 'AFTER'}`);
        lines.push('');
        changedBlockCount++;
        continue;
      }
      
      // Check if block changed
      const beforeJson = JSON.stringify(beforeBlock);
      const afterJson = JSON.stringify(afterBlock);
      
      if (beforeJson !== afterJson) {
        changedBlockCount++;
        lines.push(`Block ${i}: ${beforeBlock.type} (${beforeBlock.id}) - CHANGED`);
        lines.push('');
        
        // Show specific changes
        if (beforeBlock.type !== afterBlock.type) {
          lines.push(`  Type: ${beforeBlock.type} → ${afterBlock.type}`);
        }
        
        if (beforeBlock.id !== afterBlock.id) {
          lines.push(`  ID: ${beforeBlock.id} → ${afterBlock.id}`);
        }
        
        // Compare content (simplified)
        const beforeContent = JSON.stringify(beforeBlock.content, null, 2);
        const afterContent = JSON.stringify(afterBlock.content, null, 2);
        
        if (beforeContent !== afterContent) {
          lines.push(`  Content: CHANGED (${beforeContent.length} → ${afterContent.length} chars)`);
          
          // Show first level keys that changed
          const beforeKeys = Object.keys(beforeBlock.content || {});
          const afterKeys = Object.keys(afterBlock.content || {});
          const allKeys = new Set([...beforeKeys, ...afterKeys]);
          
          for (const key of allKeys) {
            const beforeVal = (beforeBlock.content as any)?.[key];
            const afterVal = (afterBlock.content as any)?.[key];
            
            if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
              lines.push(`    - ${key}: CHANGED`);
            }
          }
        }
        
        lines.push('');
      }
    }
    
    lines.push('=' .repeat(80));
    lines.push('');
    lines.push(`Summary: ${changedBlockCount} of ${maxBlocks} blocks changed`);
    lines.push('');
    
    // Add hashes for verification
    const beforeHash = this.hashLesson(before);
    const afterHash = this.hashLesson(after);
    lines.push(`Before Hash: ${beforeHash}`);
    lines.push(`After Hash:  ${afterHash}`);
    
    return lines.join('\n');
  }
  
  /**
   * Generate SHA-256 hash of lesson for verification
   */
  private hashLesson(lesson: Lesson): string {
    const json = JSON.stringify(lesson, null, 0);
    return crypto.createHash('sha256').update(json).digest('hex').substring(0, 16);
  }
}
