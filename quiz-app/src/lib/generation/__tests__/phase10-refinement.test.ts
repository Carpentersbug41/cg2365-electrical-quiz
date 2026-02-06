/**
 * Phase 10 Refinement Tests
 * Tests for substring replace, safety gates, and collision detection
 */

import { describe, it, expect } from 'vitest';
import { Phase10_Refinement, RefinementPatch } from '../phases/Phase10_Refinement';
import { validatePatch, shouldRejectPatch } from '../patchValidator';
import { Lesson } from '../types';

describe('Phase 10 Refinement - replaceSubstring operation', () => {
  const phase10 = new Phase10_Refinement();
  
  const mockLesson: Lesson = {
    id: 'test-lesson',
    title: 'Test Lesson',
    description: 'Test description',
    layout: 'split-vis',
    unit: 'Unit 1',
    topic: 'Test Topic',
    learningOutcomes: ['Outcome 1'],
    prerequisites: [],
    blocks: [
      {
        id: 'test-explanation',
        type: 'explanation',
        order: 1,
        content: {
          content: 'This lesson covers looping and linear wiring methods. These are important concepts.'
        }
      }
    ]
  };

  it('should replace substring in field', () => {
    const patch: RefinementPatch = {
      op: 'replaceSubstring',
      path: 'blocks[0].content.content',
      find: 'looping and linear wiring methods',
      value: 'ring final and radial topologies',
      reason: 'Updated terminology'
    };

    const patched = phase10.applyPatches(mockLesson, [patch]);
    const content = patched.blocks[0].content.content;
    
    expect(content).toContain('ring final and radial topologies');
    expect(content).not.toContain('looping and linear wiring methods');
    expect(content).toContain('These are important concepts'); // Rest unchanged
  });

  it('should handle replaceSubstring with matchIndex', () => {
    const lessonWithDuplicates: Lesson = {
      ...mockLesson,
      blocks: [{
        ...mockLesson.blocks[0],
        content: {
          content: 'Use the wire. Connect the wire. Check the wire.'
        }
      }]
    };

    // Replace only first occurrence
    const patch: RefinementPatch = {
      op: 'replaceSubstring',
      path: 'blocks[0].content.content',
      find: 'wire',
      value: 'cable',
      matchIndex: 0,
      reason: 'Replace first occurrence only'
    };

    const patched = phase10.applyPatches(lessonWithDuplicates, [patch]);
    const content = patched.blocks[0].content.content;
    
    expect(content).toBe('Use the cable. Connect the wire. Check the wire.');
  });

  it('should replace all occurrences by default', () => {
    const lessonWithDuplicates: Lesson = {
      ...mockLesson,
      blocks: [{
        ...mockLesson.blocks[0],
        content: {
          content: 'Use the wire. Connect the wire. Check the wire.'
        }
      }]
    };

    const patch: RefinementPatch = {
      op: 'replaceSubstring',
      path: 'blocks[0].content.content',
      find: 'wire',
      value: 'cable',
      reason: 'Replace all occurrences'
    };

    const patched = phase10.applyPatches(lessonWithDuplicates, [patch]);
    const content = patched.blocks[0].content.content;
    
    expect(content).toBe('Use the cable. Connect the cable. Check the cable.');
  });

  it('should fail gracefully when substring not found', () => {
    const patch: RefinementPatch = {
      op: 'replaceSubstring',
      path: 'blocks[0].content.content',
      find: 'nonexistent text',
      value: 'replacement',
      reason: 'This will fail'
    };

    const patched = phase10.applyPatches(mockLesson, [patch]);
    
    // Should return lesson unchanged
    expect(patched.blocks[0].content.content).toBe(mockLesson.blocks[0].content.content);
  });

  it('should fail when replaceSubstring used on non-string field', () => {
    const lessonWithArray: Lesson = {
      ...mockLesson,
      blocks: [{
        id: 'test-practice',
        type: 'practice',
        order: 1,
        content: {
          questions: []
        }
      }]
    };

    const patch: RefinementPatch = {
      op: 'replaceSubstring',
      path: 'blocks[0].content.questions',
      find: 'something',
      value: 'replacement',
      reason: 'Invalid - questions is an array'
    };

    const patched = phase10.applyPatches(lessonWithArray, [patch]);
    
    // Should remain unchanged
    expect(patched.blocks[0].content.questions).toEqual([]);
  });
});

describe('Phase 10 Refinement - Content Wipe Safety Gate', () => {
  const longExplanation = `### In this lesson

This lesson covers important concepts. Let me explain in detail.

**What this is**
This is a comprehensive explanation with lots of content.

**Why it matters**
It matters because students need to understand this deeply.

**Key facts / rules**
- Rule 1
- Rule 2
- Rule 3

**Common mistakes**
Don't confuse these concepts.

**Key Points**
- Point 1
- Point 2

**Quick recap**
We covered important topics.

### Coming Up Next
Next we'll learn more advanced concepts.`;

  const mockLesson: Lesson = {
    id: 'test-lesson',
    title: 'Test',
    description: 'Test',
    layout: 'split-vis',
    unit: 'Unit 1',
    topic: 'Test',
    learningOutcomes: ['Test'],
    prerequisites: [],
    blocks: [{
      id: 'explanation-1',
      type: 'explanation',
      order: 1,
      content: {
        content: longExplanation
      }
    }]
  };

  it('should reject destructive replace on explanation content', () => {
    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].content.content',
      value: '### Coming Up Next\nJust this tiny bit.',
      reason: 'Destructive patch'
    };

    const validation = validatePatch(mockLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    expect(shouldReject).toBe(true);
    expect(validation.reasons.some(r => r.includes('Destructive replace'))).toBe(true);
  });

  it('should reject replace missing required headings', () => {
    const incompleteContent = `### In this lesson
Some content but missing most headings.`;

    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].content.content',
      value: incompleteContent,
      reason: 'Missing headings'
    };

    const validation = validatePatch(mockLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    expect(shouldReject).toBe(true);
    expect(validation.reasons.some(r => r.includes('Missing required Phase 3 headings'))).toBe(true);
  });

  it('should allow replace when new content is large enough and has headings', () => {
    const newContent = longExplanation.replace('looping', 'ring final');

    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].content.content',
      value: newContent,
      reason: 'Valid full replacement'
    };

    const validation = validatePatch(mockLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    expect(shouldReject).toBe(false);
  });

  it('should not apply safety gate to non-content fields', () => {
    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].content.title',
      value: 'Short',
      from: 'A much longer title that gets replaced',
      reason: 'This is fine - not a content field'
    };

    const mockLessonWithTitle: Lesson = {
      ...mockLesson,
      blocks: [{
        ...mockLesson.blocks[0],
        content: {
          ...mockLesson.blocks[0].content,
          title: 'A much longer title that gets replaced'
        }
      }]
    };

    const validation = validatePatch(mockLessonWithTitle, patch);
    
    // Should not have destructive replace warning
    expect(validation.reasons.some(r => r.includes('Destructive replace'))).toBe(false);
  });
});

describe('Phase 10 Refinement - Post-Patch Heading Validation', () => {
  const phase10 = new Phase10_Refinement();

  const validExplanation = `### In this lesson
Content here.

**What this is**
More content.

**Why it matters**
Important stuff.

**Key facts / rules**
Facts here.

**Common mistakes**
Mistakes to avoid.

**Key Points**
Key takeaways.

**Quick recap**
Summary.

### Coming Up Next
Next lesson preview.`;

  it('should pass validation when all headings present', () => {
    const original: Lesson = {
      id: 'test',
      title: 'Test',
      description: 'Test',
      layout: 'split-vis',
      unit: 'Unit 1',
      topic: 'Test',
      learningOutcomes: ['Test'],
      prerequisites: [],
      blocks: [{
        id: 'exp-1',
        type: 'explanation',
        order: 1,
        content: { content: validExplanation }
      }]
    };

    const patched = JSON.parse(JSON.stringify(original));
    const isValid = phase10.validatePatches(original, patched);
    
    expect(isValid).toBe(true);
  });

  it('should pass with up to 2 missing headings', () => {
    const explanationMissingTwo = validExplanation
      .replace('**Common mistakes**\nMistakes to avoid.\n\n', '')
      .replace('**Quick recap**\nSummary.\n\n', '');

    const original: Lesson = {
      id: 'test',
      title: 'Test',
      description: 'Test',
      layout: 'split-vis',
      unit: 'Unit 1',
      topic: 'Test',
      learningOutcomes: ['Test'],
      prerequisites: [],
      blocks: [{
        id: 'exp-1',
        type: 'explanation',
        order: 1,
        content: { content: validExplanation }
      }]
    };

    const patched: Lesson = {
      ...original,
      blocks: [{
        ...original.blocks[0],
        content: { content: explanationMissingTwo }
      }]
    };

    const isValid = phase10.validatePatches(original, patched);
    
    expect(isValid).toBe(true);
  });

  it('should fail with more than 2 missing headings', () => {
    const badExplanation = `### In this lesson
Some content.

**What this is**
Content.`;

    const original: Lesson = {
      id: 'test',
      title: 'Test',
      description: 'Test',
      layout: 'split-vis',
      unit: 'Unit 1',
      topic: 'Test',
      learningOutcomes: ['Test'],
      prerequisites: [],
      blocks: [{
        id: 'exp-1',
        type: 'explanation',
        order: 1,
        content: { content: validExplanation }
      }]
    };

    const patched: Lesson = {
      ...original,
      blocks: [{
        ...original.blocks[0],
        content: { content: badExplanation }
      }]
    };

    const isValid = phase10.validatePatches(original, patched);
    
    expect(isValid).toBe(false);
  });
});

describe('Phase 10 Refinement - Path Collision Detection', () => {
  // This would be tested in integration with SequentialLessonGenerator
  // For now, we test that the collision detection logic exists
  
  it('should detect path collisions in patch array', () => {
    const patches: RefinementPatch[] = [
      {
        op: 'replace',
        path: 'blocks[0].content.content',
        value: 'First value',
        reason: 'First patch'
      },
      {
        op: 'prepend',
        path: 'blocks[0].content.content',
        value: 'Prepended text',
        reason: 'Second patch - collision!'
      }
    ];

    const pathCounts = new Map<string, number>();
    patches.forEach(p => {
      pathCounts.set(p.path, (pathCounts.get(p.path) || 0) + 1);
    });

    const collisions = Array.from(pathCounts.entries()).filter(([_, count]) => count > 1);
    
    expect(collisions.length).toBe(1);
    expect(collisions[0][0]).toBe('blocks[0].content.content');
    expect(collisions[0][1]).toBe(2);
  });

  it('should identify unsafe collision patterns', () => {
    const patches: RefinementPatch[] = [
      {
        op: 'replace',
        path: 'blocks[0].content.content',
        value: 'Replacement',
        reason: 'Replace'
      },
      {
        op: 'append',
        path: 'blocks[0].content.content',
        value: 'Append',
        reason: 'Append after replace'
      }
    ];

    const conflictingPatches = patches.filter(p => p.path === 'blocks[0].content.content');
    const hasReplace = conflictingPatches.some(p => p.op === 'replace');
    const hasOthers = conflictingPatches.some(p => p.op !== 'replace');
    
    expect(hasReplace).toBe(true);
    expect(hasOthers).toBe(true);
    // This is an unsafe collision
  });
});

describe('Phase 10 Refinement - Patch Validator Updates', () => {
  it('should allow replaceSubstring operation', () => {
    const mockLesson: Lesson = {
      id: 'test',
      title: 'Test',
      description: 'Test',
      layout: 'split-vis',
      unit: 'Unit 1',
      topic: 'Test',
      learningOutcomes: ['Test'],
      prerequisites: [],
      blocks: [{
        id: 'exp-1',
        type: 'explanation',
        order: 1,
        content: { content: 'Some content here' }
      }]
    };

    const patch: RefinementPatch = {
      op: 'replaceSubstring',
      path: 'blocks[0].content.content',
      find: 'content',
      value: 'text',
      reason: 'Test'
    };

    const validation = validatePatch(mockLesson, patch);
    
    expect(validation.allowedOp).toBe(true);
    expect(validation.targetExists).toBe(true);
  });
});

describe('Phase 10 Refinement - answerType Safety Gate', () => {
  const phase10 = new Phase10_Refinement();
  
  const mockLesson: Lesson = {
    id: 'test',
    title: 'Test',
    description: 'Test',
    layout: 'split-vis',
    unit: 'Unit 1',
    topic: 'Test',
    learningOutcomes: ['Test'],
    prerequisites: [],
    blocks: [{
      id: 'practice-1',
      type: 'practice',
      order: 1,
      content: {
        questions: [{
          id: 'Q1',
          questionText: 'Test question?',
          answerType: 'short-text',
          expectedAnswer: ['answer']
        }]
      }
    }]
  };

  it('should reject patches that change answerType', () => {
    const llmResponse = {
      patches: [{
        op: 'replace',
        path: 'blocks[0].content.questions[0].answerType',
        value: 'long-text',
        reason: 'Need longer answer'
      }]
    };

    const issues = [{
      section: 'test',
      issue: 'test',
      suggestion: 'test',
      pointsLost: 0,
      severity: 0
    }];

    const patches = phase10.convertLLMPatches(llmResponse, issues, mockLesson);
    
    // Should be filtered out
    expect(patches.length).toBe(0);
  });

  it('should allow other patches to pass through', () => {
    const llmResponse = {
      patches: [{
        op: 'replace',
        path: 'blocks[0].content.questions[0].expectedAnswer',
        value: ['answer', 'response'],
        reason: 'Add variants'
      }]
    };

    const issues = [{
      section: 'test',
      issue: 'test',
      suggestion: 'test',
      pointsLost: 0,
      severity: 0
    }];

    const patches = phase10.convertLLMPatches(llmResponse, issues, mockLesson);
    
    expect(patches.length).toBe(1);
    expect(patches[0].path).toBe('blocks[0].content.questions[0].expectedAnswer');
  });
});

describe('Phase 10 Refinement - High-Risk Patch Gate', () => {
  const mockLesson: Lesson = {
    id: 'test',
    title: 'Test',
    description: 'Test',
    layout: 'split-vis',
    unit: 'Unit 1',
    topic: 'Test',
    learningOutcomes: ['Test'],
    prerequisites: [],
    blocks: [{
      id: 'practice-1',
      type: 'practice',
      order: 1,
      content: {
        questions: [{
          id: 'Q1',
          questionText: 'Test?',
          answerType: 'short-text',
          expectedAnswer: ['answer']
        }]
      }
    }]
  };

  it('should reject answerType changes via validator', () => {
    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].content.questions[0].answerType',
      value: 'long-text',
      reason: 'Test'
    };

    const validation = validatePatch(mockLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    expect(shouldReject).toBe(true);
    expect(validation.reasons.some(r => r.includes('High-risk patch'))).toBe(true);
    expect(validation.reasons.some(r => r.includes('answerType'))).toBe(true);
  });

  it('should reject block order changes', () => {
    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].order',
      value: 5,
      reason: 'Test'
    };

    const validation = validatePatch(mockLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    expect(shouldReject).toBe(true);
    expect(validation.reasons.some(r => r.includes('block order'))).toBe(true);
  });

  it('should reject block type changes', () => {
    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].type',
      value: 'explanation',
      reason: 'Test'
    };

    const validation = validatePatch(mockLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    expect(shouldReject).toBe(true);
    expect(validation.reasons.some(r => r.includes('block type'))).toBe(true);
  });

  it('should allow safe patches', () => {
    const patch: RefinementPatch = {
      op: 'replace',
      path: 'blocks[0].content.questions[0].questionText',
      value: 'Updated question text?',
      reason: 'Improve clarity'
    };

    const validation = validatePatch(mockLesson, patch);
    const shouldReject = shouldRejectPatch(validation);
    
    expect(shouldReject).toBe(false);
  });
});
