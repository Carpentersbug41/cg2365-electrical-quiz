/**
 * JSON Pointer Extractor
 * 
 * Extracts JSON Pointers from issue text descriptions using pattern matching.
 * Fallback when scorer doesn't provide structured pointers.
 */

import { Lesson } from './types';

/**
 * Extract JSON Pointers from issue text description
 */
export function extractPointersFromIssue(issueText: string, lesson: Lesson): string[] {
  const pointers: string[] = [];
  
  // Pattern 1: Direct block reference - "blocks[N]"
  const blockMatches = issueText.matchAll(/blocks?\[(\d+)\]/g);
  for (const match of blockMatches) {
    const blockIndex = parseInt(match[1], 10);
    if (blockIndex < lesson.blocks.length) {
      pointers.push(`/blocks/${blockIndex}`);
    }
  }
  
  // Pattern 2: Block with content reference - "blocks[N].content"
  const blockContentMatches = issueText.matchAll(/blocks?\[(\d+)\]\.content/g);
  for (const match of blockContentMatches) {
    const blockIndex = parseInt(match[1], 10);
    if (blockIndex < lesson.blocks.length) {
      pointers.push(`/blocks/${blockIndex}/content`);
    }
  }
  
  // Pattern 3: Question reference - "question[M]" or "questions[M]"
  const questionMatches = issueText.matchAll(/questions?\[(\d+)\]/g);
  for (const match of questionMatches) {
    const questionIndex = parseInt(match[1], 10);
    // Find which block contains questions
    const questionBlockIndex = lesson.blocks.findIndex(
      b => b.type === 'practice' || b.type === 'spaced-review' || b.type === 'understanding-checks'
    );
    if (questionBlockIndex !== -1) {
      pointers.push(`/blocks/${questionBlockIndex}/content/questions/${questionIndex}`);
    }
  }
  
  // Pattern 4: Block type references
  const blockTypePatterns: Record<string, string> = {
    'outcomes': 'outcomes',
    'learning outcomes': 'outcomes',
    'vocabulary': 'vocab',
    'vocab': 'vocab',
    'explanation': 'explanation',
    'practice': 'practice',
    'spaced review': 'spaced-review',
    'worked example': 'worked-example',
    'guided practice': 'guided-practice',
    'diagram': 'diagram',
    'microbreak': 'microbreak'
  };
  
  const lowerText = issueText.toLowerCase();
  for (const [keyword, blockType] of Object.entries(blockTypePatterns)) {
    if (lowerText.includes(keyword)) {
      const blockIndex = lesson.blocks.findIndex(b => b.type === blockType);
      if (blockIndex !== -1) {
        pointers.push(`/blocks/${blockIndex}`);
        
        // Add content pointer for blocks that have content
        if (blockType !== 'outcomes' && blockType !== 'vocab') {
          pointers.push(`/blocks/${blockIndex}/content`);
        }
      }
    }
  }
  
  // Pattern 5: answerType references
  if (lowerText.includes('answertype') || lowerText.includes('answer type')) {
    // Find all question blocks and add answerType pointers
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'practice' || block.type === 'spaced-review' || block.type === 'understanding-checks') {
        const questions = (block.content as any)?.questions || [];
        questions.forEach((_: any, qIdx: number) => {
          pointers.push(`/blocks/${idx}/content/questions/${qIdx}/answerType`);
        });
      }
    });
  }
  
  // Pattern 6: expectedAnswer references
  if (lowerText.includes('expectedanswer') || lowerText.includes('expected answer')) {
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'practice' || block.type === 'spaced-review' || block.type === 'understanding-checks') {
        const questions = (block.content as any)?.questions || [];
        questions.forEach((_: any, qIdx: number) => {
          pointers.push(`/blocks/${idx}/content/questions/${qIdx}/expectedAnswer`);
        });
      }
    });
  }
  
  // Pattern 7: hint references
  if (lowerText.includes('hint')) {
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'practice' || block.type === 'spaced-review' || block.type === 'understanding-checks') {
        const questions = (block.content as any)?.questions || [];
        questions.forEach((_: any, qIdx: number) => {
          pointers.push(`/blocks/${idx}/content/questions/${qIdx}/hint`);
        });
      }
    });
  }
  
  // Pattern 8: Title references
  if (lowerText.includes('title')) {
    // Add lesson title
    pointers.push('/title');
    
    // Add block titles
    lesson.blocks.forEach((block, idx) => {
      if ((block.content as any)?.title !== undefined) {
        pointers.push(`/blocks/${idx}/content/title`);
      }
    });
  }
  
  // Pattern 9: Description references
  if (lowerText.includes('description')) {
    // Add lesson description
    pointers.push('/description');
    
    // Add block descriptions
    lesson.blocks.forEach((block, idx) => {
      if ((block.content as any)?.description !== undefined) {
        pointers.push(`/blocks/${idx}/content/description`);
      }
    });
  }
  
  // Pattern 10: Learning outcomes
  if (lowerText.includes('learning outcome') || lowerText.includes('learningoutcome')) {
    pointers.push('/learningOutcomes');
  }
  
  // Pattern 11: "Coming up next" / "what's next" references
  if (lowerText.includes('coming up') || lowerText.includes('what\'s next') || lowerText.includes('whats next')) {
    // Usually in microbreak or last explanation block
    const microbreakIndex = lesson.blocks.findIndex(b => b.type === 'microbreak');
    if (microbreakIndex !== -1) {
      pointers.push(`/blocks/${microbreakIndex}/content/notes`);
    }
    
    // Also check explanation blocks
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'explanation' && (block.content as any)?.notes !== undefined) {
        pointers.push(`/blocks/${idx}/content/notes`);
      }
    });
  }
  
  // Pattern 12: Diagram references
  if (lowerText.includes('diagram') || lowerText.includes('visual')) {
    const diagramIndex = lesson.blocks.findIndex(b => b.type === 'diagram');
    if (diagramIndex !== -1) {
      pointers.push(`/blocks/${diagramIndex}`);
      pointers.push(`/blocks/${diagramIndex}/content`);
    }
  }
  
  // Pattern 13: Content field in blocks (generic)
  if (lowerText.includes('content') && !lowerText.includes('blocks[')) {
    // Add all block content pointers for explanation blocks
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'explanation' && (block.content as any)?.content !== undefined) {
        pointers.push(`/blocks/${idx}/content/content`);
      }
    });
  }
  
  // Deduplicate pointers
  return Array.from(new Set(pointers));
}

/**
 * Extract pointers for specific rubric sections
 */
export function extractPointersByRubricSection(
  rubricSection: string,
  lesson: Lesson
): string[] {
  const pointers: string[] = [];
  const lowerSection = rubricSection.toLowerCase();
  
  // Schema compliance (A)
  if (lowerSection.includes('schema') || lowerSection.startsWith('a')) {
    pointers.push('/id');
    pointers.push('/unit');
    pointers.push('/topic');
    pointers.push('/layout');
    pointers.push('/blocks');
  }
  
  // Pedagogy / Beginner Clarity (B)
  if (lowerSection.includes('pedagogy') || lowerSection.includes('beginner') || lowerSection.startsWith('b')) {
    // Explanation blocks
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'explanation') {
        pointers.push(`/blocks/${idx}/content`);
      }
    });
    
    // Microbreak
    const microbreakIndex = lesson.blocks.findIndex(b => b.type === 'microbreak');
    if (microbreakIndex !== -1) {
      pointers.push(`/blocks/${microbreakIndex}`);
    }
  }
  
  // Questions Quality (C)
  if (lowerSection.includes('question') || lowerSection.startsWith('c')) {
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'practice' || block.type === 'understanding-checks' || block.type === 'spaced-review') {
        pointers.push(`/blocks/${idx}/content/questions`);
      }
    });
  }
  
  // Marking Robustness (D)
  if (lowerSection.includes('marking') || lowerSection.startsWith('d')) {
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'practice' || block.type === 'understanding-checks' || block.type === 'spaced-review') {
        const questions = (block.content as any)?.questions || [];
        questions.forEach((_: any, qIdx: number) => {
          pointers.push(`/blocks/${idx}/content/questions/${qIdx}/expectedAnswer`);
          pointers.push(`/blocks/${idx}/content/questions/${qIdx}/answerType`);
          pointers.push(`/blocks/${idx}/content/questions/${qIdx}/hint`);
        });
      }
    });
  }
  
  // Visual (E)
  if (lowerSection.includes('visual') || lowerSection.startsWith('e')) {
    const diagramIndex = lesson.blocks.findIndex(b => b.type === 'diagram');
    if (diagramIndex !== -1) {
      pointers.push(`/blocks/${diagramIndex}`);
    }
  }
  
  // Safety (F)
  if (lowerSection.includes('safety') || lowerSection.startsWith('f')) {
    // Safety issues usually in explanations
    lesson.blocks.forEach((block, idx) => {
      if (block.type === 'explanation') {
        pointers.push(`/blocks/${idx}/content/content`);
      }
    });
  }
  
  return Array.from(new Set(pointers));
}

/**
 * Extract the most specific pointer from a set of pointers
 * Prefers longer, more specific paths
 */
export function getMostSpecificPointer(pointers: string[]): string | null {
  if (pointers.length === 0) return null;
  
  // Sort by length (descending) and return the longest (most specific)
  const sorted = [...pointers].sort((a, b) => b.length - a.length);
  return sorted[0];
}

/**
 * Check if a pointer path is a parent of another
 */
export function isParentPointer(parent: string, child: string): boolean {
  return child.startsWith(parent + '/') || child === parent;
}

/**
 * Get all child pointers under a parent path
 */
export function getChildPointers(parent: string, allPointers: string[]): string[] {
  return allPointers.filter(p => p !== parent && p.startsWith(parent + '/'));
}
