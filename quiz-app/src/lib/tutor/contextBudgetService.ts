/**
 * Context Budget Service
 * Manages token/context budget to prevent context window overflow
 * Ensures predictable cost and prevents failures on large lessons
 */

import { Block } from '@/data/lessons/types';
import { LessonContext } from './types';

/**
 * Context Budget Configuration
 */
export interface ContextBudgetConfig {
  maxCharacters: number; // Maximum characters for lesson context
  defaultBlockLimit: number; // Default number of blocks if no specific IDs provided
  priorityBlockTypes: string[]; // Block types that should always be included
}

/**
 * Default budget configuration
 */
export const DEFAULT_CONTEXT_BUDGET: ContextBudgetConfig = {
  maxCharacters: 35000, // ~8-9k tokens for Gemini
  defaultBlockLimit: 10, // Include top 10 blocks by default
  priorityBlockTypes: ['vocab', 'outcomes', 'worked-example'],
};

/**
 * Block with metadata for prioritization
 */
interface BlockWithPriority {
  id: string;
  type: string;
  content: string;
  priority: number; // Higher = more important
  charCount: number;
}

/**
 * Calculate priority score for a block
 */
function calculateBlockPriority(
  block: Block,
  blockIdsRequested?: string[],
  currentPracticeBlockId?: string,
  priorityTypes: string[] = DEFAULT_CONTEXT_BUDGET.priorityBlockTypes
): number {
  let priority = 0;

  // Explicitly requested blocks get highest priority
  if (blockIdsRequested?.includes(block.id)) {
    priority += 100;
  }

  // Current practice block gets high priority
  if (currentPracticeBlockId === block.id) {
    priority += 90;
  }

  // Priority block types (vocab, outcomes, worked-example)
  if (priorityTypes.includes(block.type)) {
    priority += 50;
  }

  // Other block types get base priority by type
  switch (block.type) {
    case 'guided-practice':
      priority += 40;
      break;
    case 'practice':
      priority += 35;
      break;
    case 'explanation':
      priority += 30;
      break;
    case 'spaced-review':
      priority += 20;
      break;
    case 'diagram':
      priority += 25;
      break;
    default:
      priority += 10;
  }

  // Earlier blocks get slight priority (foundational content)
  priority += Math.max(0, 10 - block.order);

  return priority;
}

/**
 * Estimate character count for a block (before formatting)
 */
function estimateBlockCharCount(block: Block): number {
  const content = JSON.stringify(block.content);
  // Add ~30% overhead for formatting
  return Math.ceil(content.length * 1.3);
}

/**
 * Apply context budget to filter and limit blocks
 * Returns filtered blocks and metadata about trimming
 */
export function applyContextBudget(
  blocks: Block[],
  config: ContextBudgetConfig = DEFAULT_CONTEXT_BUDGET,
  options: {
    blockIdsToInclude?: string[];
    currentPracticeBlockId?: string;
    formattedBlockContents?: Map<string, string>; // Pre-formatted block contents for accurate size
  } = {}
): {
  selectedBlocks: Block[];
  trimmed: boolean;
  totalCharacters: number;
  excludedBlockIds: string[];
  reason?: string;
} {
  const { blockIdsToInclude, currentPracticeBlockId, formattedBlockContents } = options;

  // Calculate priority and size for each block
  const blocksWithPriority: BlockWithPriority[] = blocks.map(block => {
    const formattedContent = formattedBlockContents?.get(block.id);
    const charCount = formattedContent 
      ? formattedContent.length 
      : estimateBlockCharCount(block);

    return {
      id: block.id,
      type: block.type,
      content: formattedContent || '',
      priority: calculateBlockPriority(
        block,
        blockIdsToInclude,
        currentPracticeBlockId,
        config.priorityBlockTypes
      ),
      charCount,
    };
  });

  // Sort by priority (highest first)
  blocksWithPriority.sort((a, b) => b.priority - a.priority);

  // Select blocks within budget
  const selectedBlocks: Block[] = [];
  const excludedBlockIds: string[] = [];
  let totalCharacters = 0;
  let reason: string | undefined;

  for (const blockWithPriority of blocksWithPriority) {
    const wouldExceedBudget = totalCharacters + blockWithPriority.charCount > config.maxCharacters;
    const wouldExceedLimit = !blockIdsToInclude && selectedBlocks.length >= config.defaultBlockLimit;

    if (wouldExceedBudget || wouldExceedLimit) {
      excludedBlockIds.push(blockWithPriority.id);
      if (!reason) {
        reason = wouldExceedBudget ? 'character-limit' : 'block-count-limit';
      }
    } else {
      const originalBlock = blocks.find(b => b.id === blockWithPriority.id);
      if (originalBlock) {
        selectedBlocks.push(originalBlock);
        totalCharacters += blockWithPriority.charCount;
      }
    }
  }

  // Sort selected blocks by original order
  selectedBlocks.sort((a, b) => a.order - b.order);

  return {
    selectedBlocks,
    trimmed: excludedBlockIds.length > 0,
    totalCharacters,
    excludedBlockIds,
    reason,
  };
}

/**
 * Log context budget metrics
 */
export function logContextBudget(
  lessonId: string,
  result: ReturnType<typeof applyContextBudget>
): void {
  if (result.trimmed) {
    console.log(`📊 Context Budget Applied for ${lessonId}:`);
    console.log(`  ✓ Included: ${result.selectedBlocks.length} blocks`);
    console.log(`  ✗ Excluded: ${result.excludedBlockIds.length} blocks`);
    console.log(`  📏 Total characters: ${result.totalCharacters.toLocaleString()}`);
    console.log(`  🔍 Reason: ${result.reason}`);
    console.log(`  📋 Excluded blocks: ${result.excludedBlockIds.join(', ')}`);
  } else {
    console.log(`📊 Context Budget: All ${result.selectedBlocks.length} blocks included for ${lessonId}`);
  }
}


