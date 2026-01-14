/**
 * Grounding Service (RAG-lite)
 * Injects lesson content into tutor context for grounding
 * MVP: Direct block injection (no vector DB)
 */

import { Block, Lesson } from '@/data/lessons/types';
import { LessonContext } from './types';
import { secureContent } from './securityService';

/**
 * Format a single block for LLM consumption
 */
function formatBlockForContext(block: Block): string {
  const content = block.content as any;
  
  switch (block.type) {
    case 'outcomes':
      return `[${block.id}]
Learning Outcomes:
${content.outcomes.map((o: any, i: number) => `${i + 1}. ${o.text} (${o.bloomLevel})`).join('\n')}`;

    case 'vocab':
      return `[${block.id}]
Key Vocabulary:
${content.terms.map((t: any) => `- **${t.term}**: ${t.definition}`).join('\n')}`;

    case 'explanation':
      return `[${block.id}]
${content.title}
${content.content}
${content.subsections ? content.subsections.map((s: any) => `\n**${s.title}**\n${s.content}`).join('\n') : ''}`;

    case 'worked-example':
      return `[${block.id}]
Worked Example: ${content.title}
Given: ${content.given}
${content.steps.map((step: any) => {
  let stepText = `Step ${step.stepNumber}: ${step.description}`;
  if (step.formula) stepText += `\n  Formula: ${step.formula}`;
  if (step.calculation) stepText += `\n  Calculation: ${step.calculation}`;
  if (step.result) stepText += `\n  Result: ${step.result}`;
  return stepText;
}).join('\n')}
${content.notes ? `\nNote: ${content.notes}` : ''}`;

    case 'guided-practice':
      return `[${block.id}]
Guided Practice: ${content.title}
Problem: ${content.problem}
${content.steps.map((step: any) => 
  `Step ${step.stepNumber}: ${step.prompt}\nExpected: ${Array.isArray(step.expectedAnswer) ? step.expectedAnswer.join(' or ') : step.expectedAnswer}`
).join('\n')}`;

    case 'practice':
      return `[${block.id}]
Practice Questions: ${content.title}
${content.questions.map((q: any, i: number) => 
  `Q${i + 1}: ${q.questionText}\nAnswer type: ${q.answerType}${q.hint ? `\nHint available: ${q.hint}` : ''}`
).join('\n\n')}`;

    case 'spaced-review':
      return `[${block.id}]
Spaced Review: ${content.title}
${content.questions.map((q: any, i: number) => `${i + 1}. ${q}`).join('\n')}
${content.notes ? `\nNote: ${content.notes}` : ''}`;

    case 'diagram':
      return `[${block.id}]
Diagram: ${content.title}
Description: ${content.description}
Type: ${content.diagramType}
Elements: ${content.elementIds.join(', ')}
${content.placeholderText ? `Diagram shows: ${content.placeholderText}` : ''}`;

    default:
      return `[${block.id}]\n${JSON.stringify(content, null, 2)}`;
  }
}

/**
 * Create lesson context for tutor grounding
 * Now includes context budget management
 */
export function createLessonContext(
  lesson: Lesson, 
  blockIds?: string[],
  options?: {
    applyBudget?: boolean;
    currentPracticeBlockId?: string;
  }
): LessonContext {
  // Filter blocks if specific IDs provided, otherwise use all
  let blocksToInclude = blockIds
    ? lesson.blocks.filter(b => blockIds.includes(b.id))
    : lesson.blocks;

  // Note: Context budget is now applied in the API route after formatting
  // This function just prepares the blocks

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    learningOutcomes: lesson.learningOutcomes,
    blocks: blocksToInclude
      .sort((a, b) => a.order - b.order)
      .map(block => ({
        id: block.id,
        type: block.type,
        content: formatBlockForContext(block),
      })),
  };
}

/**
 * Format lesson context as string for LLM injection
 * Now includes security hardening
 */
export function formatLessonContextForLLM(context: LessonContext): string {
  const rawContent = `# Lesson: ${context.lessonTitle} (${context.lessonId})

## Learning Outcomes
${context.learningOutcomes.map((outcome, i) => `${i + 1}. ${outcome}`).join('\n')}

## Lesson Content Blocks

${context.blocks.map(block => block.content).join('\n\n---\n\n')}

---
IMPORTANT: Reference blocks using [block-id] format. Stay within this content. If asked about topics not covered here, redirect to what IS covered.`;

  // Apply security hardening: scan, sanitize, and wrap in delimiters
  const secured = secureContent(rawContent, `lesson-${context.lessonId}`, {
    scan: true,
    sanitize: true,
    wrap: true,
  });

  // Log security issues if detected
  if (secured.security.injectionDetected) {
    console.error(`🚨 Security: Prompt injection attempt detected in lesson ${context.lessonId}`);
    console.error('Injection matches:', secured.security.matches);
  }

  return secured.content;
}

/**
 * Extract block IDs from tutor response (for citation tracking)
 */
export function extractBlockReferences(response: string): string[] {
  const blockIdPattern = /\[([^\]]+)\]/g;
  const matches = response.matchAll(blockIdPattern);
  const blockIds = new Set<string>();
  
  for (const match of matches) {
    blockIds.add(match[1]);
  }
  
  return Array.from(blockIds);
}

/**
 * Validate that tutor response only references provided blocks
 */
export function validateGrounding(
  response: string,
  allowedBlockIds: string[]
): { isValid: boolean; invalidReferences: string[] } {
  const referencedBlocks = extractBlockReferences(response);
  const invalidReferences = referencedBlocks.filter(
    id => !allowedBlockIds.includes(id)
  );
  
  return {
    isValid: invalidReferences.length === 0,
    invalidReferences,
  };
}





