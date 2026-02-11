/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Debug Logger for Phase 10-13 Pipeline
 * 
 * Provides verbose debug output controlled by environment variables.
 * Helps debug and understand the pedagogical scoring and improvement pipeline.
 */

export class DebugLogger {
  private enabled: boolean;
  private showPrompts: boolean;
  private showTiming: boolean;
  private indent: number = 0;
  private timers: Map<string, number> = new Map();
  
  constructor() {
    this.enabled = process.env.DEBUG_PHASE10 === 'true';
    this.showPrompts = process.env.DEBUG_PHASE10_PROMPTS === 'true';
    this.showTiming = process.env.DEBUG_PHASE10_TIMING === 'true' || this.enabled;
  }
  
  /**
   * Check if debug logging is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
  
  /**
   * Phase header with box
   */
  phaseHeader(phaseName: string, lessonId?: string): void {
    if (!this.enabled) return;
    
    const width = 60;
    const title = lessonId ? `${phaseName} | ${lessonId}` : phaseName;
    const padding = Math.max(0, width - title.length - 2);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    
    console.log('\n┌' + '─'.repeat(width) + '┐');
    console.log('│ ' + ' '.repeat(leftPad) + title + ' '.repeat(rightPad) + ' │');
    console.log('└' + '─'.repeat(width) + '┘\n');
  }
  
  /**
   * Section separator
   */
  separator(): void {
    if (!this.enabled) return;
    console.log('─'.repeat(60));
  }
  
  /**
   * Log input data
   */
  logInput(label: string, data: any): void {
    if (!this.enabled) return;
    
    console.log(`\n${this.getIndent()}🔍 ${label}:`);
    this.indent++;
    
    if (typeof data === 'object' && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
          console.log(`${this.getIndent()}- ${key}: (none)`);
        } else if (typeof value === 'object') {
          const jsonStr = JSON.stringify(value);
          const preview = jsonStr.substring(0, 100);
          const ellipsis = jsonStr.length > 100 ? '...' : '';
          console.log(`${this.getIndent()}- ${key}: ${preview}${ellipsis}`);
        } else {
          console.log(`${this.getIndent()}- ${key}: ${value}`);
        }
      }
    } else {
      console.log(`${this.getIndent()}${data}`);
    }
    
    this.dedent();
  }
  
  /**
   * Log output data
   */
  logOutput(label: string, data: any): void {
    if (!this.enabled) return;
    
    console.log(`\n${this.getIndent()}📊 ${label}:`);
    this.indent++;
    
    if (typeof data === 'object' && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          console.log(`${this.getIndent()}- ${key}: [${value.length} items]`);
        } else if (typeof value === 'object' && value !== null) {
          console.log(`${this.getIndent()}- ${key}:`);
          this.indent++;
          for (const [k, v] of Object.entries(value)) {
            console.log(`${this.getIndent()}• ${k}: ${v}`);
          }
          this.dedent();
        } else {
          console.log(`${this.getIndent()}- ${key}: ${value}`);
        }
      }
    } else {
      console.log(`${this.getIndent()}${data}`);
    }
    
    this.dedent();
  }
  
  /**
   * Log prompt (truncated unless showPrompts=true)
   */
  logPrompt(type: 'system' | 'user', content: string): void {
    if (!this.enabled) return;
    
    const label = type === 'system' ? '📝 System Prompt' : '📝 User Prompt';
    console.log(`\n${this.getIndent()}${label} (${content.length} chars):`);
    
    if (this.showPrompts) {
      console.log(this.getIndent() + '─'.repeat(60));
      console.log(content);
      console.log(this.getIndent() + '─'.repeat(60));
    } else {
      const preview = content.substring(0, 200).replace(/\n/g, ' ');
      const ellipsis = content.length > 200 ? '...' : '';
      console.log(`${this.getIndent()}${preview}${ellipsis}`);
      console.log(`${this.getIndent()}(set DEBUG_PHASE10_PROMPTS=true to see full prompt)`);
    }
  }
  
  /**
   * Log LLM call start
   */
  logLLMCall(model: string): void {
    if (!this.enabled) return;
    console.log(`\n${this.getIndent()}⏱️  Calling LLM (model: ${model})...`);
  }
  
  /**
   * Log LLM response
   */
  logLLMResponse(response: string, durationMs: number): void {
    if (!this.enabled) return;
    
    const durationSec = (durationMs / 1000).toFixed(2);
    console.log(`\n${this.getIndent()}✅ LLM Response (${response.length} chars, took ${durationSec}s):`);
    
    if (this.showPrompts) {
      console.log(this.getIndent() + '─'.repeat(60));
      console.log(response);
      console.log(this.getIndent() + '─'.repeat(60));
    } else {
      const preview = response.substring(0, 200).replace(/\n/g, ' ');
      const ellipsis = response.length > 200 ? '...' : '';
      console.log(`${this.getIndent()}${preview}${ellipsis}`);
      console.log(`${this.getIndent()}(set DEBUG_PHASE10_PROMPTS=true to see full response)`);
    }
  }
  
  /**
   * Log JSON data
   */
  logJSON(label: string, data: any, maxDepth: number = 3): void {
    if (!this.enabled) return;
    
    console.log(`\n${this.getIndent()}${label}:`);
    try {
      const json = JSON.stringify(data, null, 2);
      const lines = json.split('\n');
      if (lines.length > 20 && !this.showPrompts) {
        console.log(lines.slice(0, 20).join('\n'));
        console.log(`${this.getIndent()}... (${lines.length - 20} more lines)`);
      } else {
        console.log(json);
      }
    } catch (error) {
      console.log(`${this.getIndent()}(Cannot stringify: ${error})`);
    }
  }
  
  /**
   * Log a progress step
   */
  logStep(step: string): void {
    if (!this.enabled) return;
    console.log(`${this.getIndent()}${step}`);
  }
  
  /**
   * Log success message
   */
  logSuccess(message: string): void {
    if (!this.enabled) return;
    console.log(`${this.getIndent()}✅ ${message}`);
  }
  
  /**
   * Log warning message
   */
  logWarning(message: string): void {
    if (!this.enabled) return;
    console.log(`${this.getIndent()}⚠️  ${message}`);
  }
  
  /**
   * Log error message
   */
  logError(message: string): void {
    if (!this.enabled) return;
    console.log(`${this.getIndent()}❌ ${message}`);
  }
  
  /**
   * Start a timer and return a function to stop it
   */
  startTimer(label: string): () => void {
    if (!this.showTiming) return () => {};
    
    const startTime = Date.now();
    this.timers.set(label, startTime);
    
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const durationSec = (duration / 1000).toFixed(2);
      
      if (this.enabled) {
        console.log(`\n${this.getIndent()}⏱️  ${label} completed in ${durationSec}s`);
      }
      
      this.timers.delete(label);
    };
  }
  
  /**
   * Log a comparison table
   */
  logComparison(rows: Array<{label: string, before: any, after: any, delta?: any}>): void {
    if (!this.enabled) return;
    
    console.log(`\n${this.getIndent()}📈 Comparison:`);
    
    // Calculate column widths
    const labelWidth = Math.max(...rows.map(r => r.label.length), 20);
    const beforeWidth = Math.max(...rows.map(r => String(r.before).length), 8);
    const afterWidth = Math.max(...rows.map(r => String(r.after).length), 8);
    const deltaWidth = Math.max(...rows.map(r => String(r.delta || '').length), 6);
    
    // Header
    const header = `${this.getIndent()}${'Category'.padEnd(labelWidth)}  ${'Original'.padEnd(beforeWidth)}  ${'Candidate'.padEnd(afterWidth)}  ${'Delta'.padEnd(deltaWidth)}`;
    console.log(header);
    console.log(this.getIndent() + '─'.repeat(header.length - this.getIndent().length));
    
    // Rows
    for (const row of rows) {
      const label = row.label.padEnd(labelWidth);
      const before = String(row.before).padEnd(beforeWidth);
      const after = String(row.after).padEnd(afterWidth);
      const delta = row.delta !== undefined ? String(row.delta).padEnd(deltaWidth) : '';
      console.log(`${this.getIndent()}${label}  ${before}  ${after}  ${delta}`);
    }
    
    // Footer separator for total
    const lastRow = rows[rows.length - 1];
    if (lastRow && lastRow.label.includes('TOTAL')) {
      const totalLine = this.getIndent() + '─'.repeat(header.length - this.getIndent().length);
      console.log(totalLine.substring(0, totalLine.lastIndexOf('─') - 10));
    }
  }
  
  /**
   * Log detailed issues list
   */
  logIssues(issues: any[]): void {
    if (!this.enabled) return;
    
    console.log(`\n${this.getIndent()}📋 Issues (${issues.length}):`);
    this.indent++;
    
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];
      console.log(`\n${this.getIndent()}${i + 1}. ${issue.id} [${issue.category}]`);
      this.indent++;
      console.log(`${this.getIndent()}Problem: ${issue.problem}`);
      console.log(`${this.getIndent()}Why it matters: ${issue.whyItMatters}`);
      if (issue.jsonPointers && issue.jsonPointers.length > 0) {
        console.log(`${this.getIndent()}Paths: ${issue.jsonPointers.join(', ')}`);
      }
      if (issue.excerpt) {
        const excerpt = issue.excerpt.substring(0, 100);
        const ellipsis = issue.excerpt.length > 100 ? '...' : '';
        console.log(`${this.getIndent()}Excerpt: "${excerpt}${ellipsis}"`);
      }
      if (issue.alignmentGap) {
        console.log(`${this.getIndent()}Alignment gap: ${issue.alignmentGap}`);
      }
      this.dedent();
    }
    
    this.dedent();
  }
  
  /**
   * Log patch details
   */
  logPatch(patchNum: number, total: number, patch: any, issueId?: string): void {
    if (!this.enabled) return;
    
    const issueLabel = issueId ? `: ${issueId}` : '';
    console.log(`\n${this.getIndent()}Patch ${patchNum}/${total}${issueLabel}`);
    this.indent++;
    console.log(`${this.getIndent()}Operation: ${patch.op}`);
    console.log(`${this.getIndent()}Path: ${patch.path}`);
    if (patch.find) {
      const find = patch.find.substring(0, 80);
      const ellipsis = patch.find.length > 80 ? '...' : '';
      console.log(`${this.getIndent()}Find: "${find}${ellipsis}"`);
    }
    if (patch.value) {
      const valueStr = String(patch.value);
      const value = valueStr.substring(0, 80);
      const ellipsis = valueStr.length > 80 ? '...' : '';
      console.log(`${this.getIndent()}Value: "${value}${ellipsis}"`);
    }
    this.dedent();
  }
  
  /**
   * Increase indentation
   */
  indentMore(): void {
    this.indent++;
  }
  
  /**
   * Decrease indentation
   */
  dedent(): void {
    this.indent = Math.max(0, this.indent - 1);
  }
  
  /**
   * Get current indentation string
   */
  private getIndent(): string {
    return '  '.repeat(this.indent);
  }
}

// Global instance
export const debugLogger = new DebugLogger();

