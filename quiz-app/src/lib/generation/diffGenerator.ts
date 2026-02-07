/**
 * Diff Generator for Lesson Comparisons
 * 
 * Generates human-readable diffs between two lesson JSONs.
 * Provides detailed block-by-block and field-by-field comparison.
 */

import { Lesson, LessonBlock } from './types';
import * as crypto from 'crypto';

export interface DiffResult {
  summary: DiffSummary;
  changes: Change[];
  diffText: string;
}

export interface DiffSummary {
  totalBlocks: number;
  changedBlocks: number;
  unchangedBlocks: number;
  metadataChanged: boolean;
  beforeHash: string;
  afterHash: string;
}

export interface Change {
  type: 'metadata' | 'block' | 'block-content';
  path: string;
  before: any;
  after: any;
  blockIndex?: number;
  blockId?: string;
  blockType?: string;
}

/**
 * Generate comprehensive diff between two lessons
 */
export function generateLessonDiff(before: Lesson, after: Lesson): DiffResult {
  const changes: Change[] = [];
  
  // Compare metadata
  const metadataChanges = compareMetadata(before, after);
  changes.push(...metadataChanges);
  
  // Compare blocks
  const blockChanges = compareBlocks(before, after);
  changes.push(...blockChanges);
  
  // Generate summary
  const maxBlocks = Math.max(before.blocks?.length || 0, after.blocks?.length || 0);
  const changedBlocksSet = new Set(
    blockChanges
      .filter(c => c.type === 'block' || c.type === 'block-content')
      .map(c => c.blockIndex)
      .filter(i => i !== undefined)
  );
  
  const summary: DiffSummary = {
    totalBlocks: maxBlocks,
    changedBlocks: changedBlocksSet.size,
    unchangedBlocks: maxBlocks - changedBlocksSet.size,
    metadataChanged: metadataChanges.length > 0,
    beforeHash: hashLesson(before),
    afterHash: hashLesson(after),
  };
  
  // Generate text representation
  const diffText = formatDiffAsText(before, after, changes, summary);
  
  return {
    summary,
    changes,
    diffText,
  };
}

/**
 * Compare lesson metadata
 */
function compareMetadata(before: Lesson, after: Lesson): Change[] {
  const changes: Change[] = [];
  
  if (before.id !== after.id) {
    changes.push({
      type: 'metadata',
      path: 'id',
      before: before.id,
      after: after.id,
    });
  }
  
  if (before.title !== after.title) {
    changes.push({
      type: 'metadata',
      path: 'title',
      before: before.title,
      after: after.title,
    });
  }
  
  if (before.description !== after.description) {
    changes.push({
      type: 'metadata',
      path: 'description',
      before: before.description,
      after: after.description,
    });
  }
  
  if (before.layout !== after.layout) {
    changes.push({
      type: 'metadata',
      path: 'layout',
      before: before.layout,
      after: after.layout,
    });
  }
  
  if (before.unit !== after.unit) {
    changes.push({
      type: 'metadata',
      path: 'unit',
      before: before.unit,
      after: after.unit,
    });
  }
  
  if (before.topic !== after.topic) {
    changes.push({
      type: 'metadata',
      path: 'topic',
      before: before.topic,
      after: after.topic,
    });
  }
  
  // Compare arrays
  if (JSON.stringify(before.learningOutcomes) !== JSON.stringify(after.learningOutcomes)) {
    changes.push({
      type: 'metadata',
      path: 'learningOutcomes',
      before: before.learningOutcomes,
      after: after.learningOutcomes,
    });
  }
  
  if (JSON.stringify(before.prerequisites) !== JSON.stringify(after.prerequisites)) {
    changes.push({
      type: 'metadata',
      path: 'prerequisites',
      before: before.prerequisites,
      after: after.prerequisites,
    });
  }
  
  return changes;
}

/**
 * Compare lesson blocks
 */
function compareBlocks(before: Lesson, after: Lesson): Change[] {
  const changes: Change[] = [];
  const maxBlocks = Math.max(before.blocks?.length || 0, after.blocks?.length || 0);
  
  for (let i = 0; i < maxBlocks; i++) {
    const beforeBlock = before.blocks?.[i];
    const afterBlock = after.blocks?.[i];
    
    // Missing block
    if (!beforeBlock || !afterBlock) {
      changes.push({
        type: 'block',
        path: `blocks[${i}]`,
        before: beforeBlock || null,
        after: afterBlock || null,
        blockIndex: i,
        blockId: beforeBlock?.id || afterBlock?.id,
        blockType: beforeBlock?.type || afterBlock?.type,
      });
      continue;
    }
    
    // Block structure changes
    if (beforeBlock.id !== afterBlock.id) {
      changes.push({
        type: 'block',
        path: `blocks[${i}].id`,
        before: beforeBlock.id,
        after: afterBlock.id,
        blockIndex: i,
        blockId: beforeBlock.id,
        blockType: beforeBlock.type,
      });
    }
    
    if (beforeBlock.type !== afterBlock.type) {
      changes.push({
        type: 'block',
        path: `blocks[${i}].type`,
        before: beforeBlock.type,
        after: afterBlock.type,
        blockIndex: i,
        blockId: beforeBlock.id,
        blockType: beforeBlock.type,
      });
    }
    
    if (beforeBlock.order !== afterBlock.order) {
      changes.push({
        type: 'block',
        path: `blocks[${i}].order`,
        before: beforeBlock.order,
        after: afterBlock.order,
        blockIndex: i,
        blockId: beforeBlock.id,
        blockType: beforeBlock.type,
      });
    }
    
    // Content changes
    const contentChanges = compareBlockContent(beforeBlock, afterBlock, i);
    changes.push(...contentChanges);
  }
  
  return changes;
}

/**
 * Compare block content in detail
 */
function compareBlockContent(before: LessonBlock, after: LessonBlock, index: number): Change[] {
  const changes: Change[] = [];
  
  const beforeContent = before.content as Record<string, unknown>;
  const afterContent = after.content as Record<string, unknown>;
  
  const allKeys = new Set([
    ...Object.keys(beforeContent || {}),
    ...Object.keys(afterContent || {}),
  ]);
  
  for (const key of allKeys) {
    const beforeVal = beforeContent?.[key];
    const afterVal = afterContent?.[key];
    
    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      changes.push({
        type: 'block-content',
        path: `blocks[${index}].content.${key}`,
        before: beforeVal,
        after: afterVal,
        blockIndex: index,
        blockId: before.id,
        blockType: before.type,
      });
    }
  }
  
  return changes;
}

/**
 * Format diff as human-readable text
 */
function formatDiffAsText(
  before: Lesson,
  after: Lesson,
  changes: Change[],
  summary: DiffSummary
): string {
  const lines: string[] = [];
  
  // Header
  lines.push('# Phase 10 Lesson Diff');
  lines.push('');
  lines.push(`Lesson ID: ${before.id}`);
  lines.push(`Timestamp: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('=' .repeat(80));
  lines.push('');
  
  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`Total Changes: ${changes.length}`);
  lines.push(`Blocks: ${summary.changedBlocks} of ${summary.totalBlocks} changed`);
  lines.push(`Metadata: ${summary.metadataChanged ? 'CHANGED' : 'unchanged'}`);
  lines.push('');
  lines.push(`Before Hash: ${summary.beforeHash}`);
  lines.push(`After Hash:  ${summary.afterHash}`);
  lines.push('');
  lines.push('=' .repeat(80));
  lines.push('');
  
  // Metadata changes
  const metadataChanges = changes.filter(c => c.type === 'metadata');
  if (metadataChanges.length > 0) {
    lines.push('## Metadata Changes');
    lines.push('');
    
    for (const change of metadataChanges) {
      lines.push(`### ${change.path}`);
      lines.push('');
      lines.push('BEFORE:');
      lines.push(formatValue(change.before));
      lines.push('');
      lines.push('AFTER:');
      lines.push(formatValue(change.after));
      lines.push('');
    }
    
    lines.push('=' .repeat(80));
    lines.push('');
  }
  
  // Block changes (grouped by block)
  const blockChanges = changes.filter(c => c.type === 'block' || c.type === 'block-content');
  if (blockChanges.length > 0) {
    lines.push('## Block Changes');
    lines.push('');
    
    // Group by block index
    const changesByBlock = new Map<number, Change[]>();
    for (const change of blockChanges) {
      if (change.blockIndex !== undefined) {
        if (!changesByBlock.has(change.blockIndex)) {
          changesByBlock.set(change.blockIndex, []);
        }
        changesByBlock.get(change.blockIndex)!.push(change);
      }
    }
    
    // Sort by block index
    const sortedIndices = Array.from(changesByBlock.keys()).sort((a, b) => a - b);
    
    for (const blockIndex of sortedIndices) {
      const blockChanges = changesByBlock.get(blockIndex)!;
      const firstChange = blockChanges[0];
      
      lines.push(`### Block ${blockIndex}: ${firstChange.blockType} (${firstChange.blockId})`);
      lines.push('');
      lines.push(`Changes: ${blockChanges.length}`);
      lines.push('');
      
      for (const change of blockChanges) {
        const pathShort = change.path.replace(`blocks[${blockIndex}].`, '');
        lines.push(`#### ${pathShort}`);
        lines.push('');
        
        if (change.type === 'block-content') {
          // Show abbreviated content for block-content changes
          const beforeStr = formatValue(change.before, 200);
          const afterStr = formatValue(change.after, 200);
          
          lines.push('BEFORE:');
          lines.push(beforeStr);
          lines.push('');
          lines.push('AFTER:');
          lines.push(afterStr);
        } else {
          lines.push(`BEFORE: ${formatValue(change.before, 100)}`);
          lines.push(`AFTER:  ${formatValue(change.after, 100)}`);
        }
        
        lines.push('');
      }
      
      lines.push('-' .repeat(80));
      lines.push('');
    }
  }
  
  return lines.join('\n');
}

/**
 * Format value for display (with optional max length)
 */
function formatValue(value: any, maxLength?: number): string {
  let str: string;
  
  if (value === null) {
    str = 'null';
  } else if (value === undefined) {
    str = 'undefined';
  } else if (typeof value === 'string') {
    str = value;
  } else if (Array.isArray(value)) {
    str = JSON.stringify(value, null, 2);
  } else if (typeof value === 'object') {
    str = JSON.stringify(value, null, 2);
  } else {
    str = String(value);
  }
  
  if (maxLength && str.length > maxLength) {
    return str.substring(0, maxLength) + '... [truncated]';
  }
  
  return str;
}

/**
 * Generate SHA-256 hash of lesson
 */
function hashLesson(lesson: Lesson): string {
  const json = JSON.stringify(lesson, null, 0);
  return crypto.createHash('sha256').update(json).digest('hex').substring(0, 16);
}

/**
 * Export unified interface
 */
export const DiffGenerator = {
  generateLessonDiff,
  compareMetadata,
  compareBlocks,
  compareBlockContent,
  formatDiffAsText,
  hashLesson,
};
