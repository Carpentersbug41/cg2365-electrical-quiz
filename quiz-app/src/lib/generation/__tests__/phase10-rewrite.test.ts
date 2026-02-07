/**
 * Phase 10 v2 Unit Tests
 * Tests validators and holistic rewrite logic
 */

import {
  validateStructuralInvariants,
  validateBlockCompleteness,
  detectCorruption,
  validateCandidate,
} from '../phases/Phase10_Validators';
import { Phase10_Rewrite } from '../phases/Phase10_Rewrite';
import { Lesson, LessonBlock } from '../types';

// Helper to create a minimal valid lesson
function createMockLesson(overrides: Partial<Lesson> = {}): Lesson {
  const defaultLesson: Lesson = {
    id: '201-1A',
    title: 'Test Lesson',
    description: 'Test description',
    layout: 'split-vis',
    unit: 'Unit 201',
    topic: 'Test Topic',
    learningOutcomes: ['Outcome 1', 'Outcome 2'],
    prerequisites: [],
    blocks: [
      {
        id: 'outcomes-1',
        type: 'outcomes',
        order: 1,
        content: {
          outcomes: [
            { text: 'Outcome 1', bloomLevel: 'understand' },
            { text: 'Outcome 2', bloomLevel: 'apply' },
          ],
        },
      },
      {
        id: 'vocab-2',
        type: 'vocab',
        order: 2,
        content: {
          terms: [
            { term: 'Term 1', definition: 'Definition 1' },
            { term: 'Term 2', definition: 'Definition 2' },
          ],
        },
      },
      {
        id: 'explanation-3',
        type: 'explanation',
        order: 3,
        content: {
          title: 'Main Explanation',
          content: 'This is a detailed explanation with enough content to pass validation. It needs to be at least 100 characters long to avoid warnings.',
        },
      },
      {
        id: 'practice-4',
        type: 'practice',
        order: 4,
        content: {
          title: 'Practice Questions',
          questions: [
            {
              id: 'C1-L1-A',
              questionText: 'What is the answer?',
              expectedAnswer: ['answer', 'variant'],
              answerType: 'short-text',
            },
          ],
        },
      },
    ],
    metadata: {
      created: '2025-01-01',
      updated: '2025-01-01',
      version: '1.0',
      author: 'test',
    },
  };

  return { ...defaultLesson, ...overrides };
}

describe('Phase 10 v2: Validators', () => {
  describe('validateStructuralInvariants', () => {
    it('should pass when structure is identical', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original)); // Deep clone

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject block count changes', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      candidate.blocks.push({
        id: 'extra-5',
        type: 'microbreak',
        order: 5,
        content: {},
      });

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Block count changed: 4 → 5');
    });

    it('should reject block ID changes', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      candidate.blocks[0].id = 'different-id';

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('ID changed'))).toBe(true);
    });

    it('should reject block type changes', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      candidate.blocks[0].type = 'vocab';

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('type changed'))).toBe(true);
    });

    it('should reject block order changes', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      candidate.blocks[0].order = 99;

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('order changed'))).toBe(true);
    });

    it('should reject lesson ID changes', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      candidate.id = 'different-id';

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Lesson ID changed: 201-1A → different-id');
    });

    it('should reject lesson unit changes', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      candidate.unit = 'Different Unit';

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('unit changed'))).toBe(true);
    });

    it('should reject lesson layout changes', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      candidate.layout = 'linear-flow';

      const result = validateStructuralInvariants(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('layout changed'))).toBe(true);
    });
  });

  describe('validateBlockCompleteness', () => {
    it('should pass for valid outcomes block', () => {
      const lesson = createMockLesson();
      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(true);
    });

    it('should reject empty outcomes array', () => {
      const lesson = createMockLesson();
      lesson.blocks[0].content.outcomes = [];

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('outcomes-1: empty outcomes array');
    });

    it('should reject missing outcomes array', () => {
      const lesson = createMockLesson();
      delete lesson.blocks[0].content.outcomes;

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('outcomes-1: missing outcomes array');
    });

    it('should reject empty vocab terms', () => {
      const lesson = createMockLesson();
      lesson.blocks[1].content.terms = [];

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('vocab-2: empty terms array');
    });

    it('should reject vocab term with empty definition', () => {
      const lesson = createMockLesson();
      lesson.blocks[1].content.terms = [
        { term: 'Term', definition: '' },
      ];

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('missing or empty definition'))).toBe(true);
    });

    it('should reject empty explanation content', () => {
      const lesson = createMockLesson();
      lesson.blocks[2].content.content = '';

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('explanation-3: empty content');
    });

    it('should warn on very short explanation content', () => {
      const lesson = createMockLesson();
      lesson.blocks[2].content.content = 'Too short';

      const result = validateBlockCompleteness(lesson);

      expect(result.warnings.some((w) => w.includes('very short'))).toBe(true);
    });

    it('should reject practice with missing questions array', () => {
      const lesson = createMockLesson();
      delete lesson.blocks[3].content.questions;

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('practice-4: missing questions array');
    });

    it('should reject practice question with non-array expectedAnswer', () => {
      const lesson = createMockLesson();
      (lesson.blocks[3].content.questions as any)[0].expectedAnswer = 'not an array';

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('expectedAnswer must be array'))).toBe(true);
    });

    it('should reject practice question with invalid answerType', () => {
      const lesson = createMockLesson();
      (lesson.blocks[3].content.questions as any)[0].answerType = null;

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('missing or invalid answerType'))).toBe(true);
    });

    it('should allow empty spaced-review for first-in-module', () => {
      const lesson = createMockLesson();
      lesson.blocks.push({
        id: 'spaced-review-5',
        type: 'spaced-review',
        order: 5,
        content: {
          title: 'Foundation Check',
          questions: [],
        },
      });

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(true);
    });

    it('should reject spaced-review with 1-2 questions', () => {
      const lesson = createMockLesson();
      lesson.blocks.push({
        id: 'spaced-review-5',
        type: 'spaced-review',
        order: 5,
        content: {
          title: 'Foundation Check',
          questions: [
            {
              id: 'SR-1',
              questionText: 'Question 1',
              expectedAnswer: ['answer'],
              answerType: 'short-text',
            },
          ],
        },
      });

      const result = validateBlockCompleteness(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('must have 0 or ≥3 questions'))).toBe(true);
    });
  });

  describe('detectCorruption', () => {
    it('should pass for clean lesson', () => {
      const lesson = createMockLesson();
      const result = detectCorruption(lesson);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect [object Object] corruption', () => {
      const lesson = createMockLesson();
      lesson.blocks[2].content.content = 'Some text [object Object] more text';

      const result = detectCorruption(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Detected [object Object] corruption in JSON');
    });

    it('should reject invalid answerType', () => {
      const lesson = createMockLesson();
      (lesson.blocks[3].content.questions as any)[0].answerType = 'invalid-type';

      const result = detectCorruption(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('invalid answerType'))).toBe(true);
    });

    it('should detect placeholder patterns', () => {
      const lesson = createMockLesson();
      lesson.blocks[2].content.content = 'This is [TODO] finish this section';

      const result = detectCorruption(lesson);

      expect(result.warnings.some((w) => w.includes('placeholder pattern'))).toBe(true);
    });

    it('should reject undefined lesson ID', () => {
      const lesson = createMockLesson();
      (lesson as any).id = 'undefined';

      const result = detectCorruption(lesson);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Lesson ID is undefined or null');
    });
  });

  describe('validateCandidate (combined)', () => {
    it('should pass all validators for valid candidate', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      // Make a valid content change
      candidate.blocks[2].content.content = 'Updated explanation content that is much better and more detailed with proper length.';

      const result = validateCandidate(original, candidate);

      expect(result.valid).toBe(true);
    });

    it('should fail if any validator fails', () => {
      const original = createMockLesson();
      const candidate = JSON.parse(JSON.stringify(original));
      // Structural violation
      candidate.blocks[0].id = 'changed-id';
      // Content violation
      candidate.blocks[1].content.terms = [];

      const result = validateCandidate(original, candidate);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1); // Multiple failures
    });
  });

  describe('Phase10_Rewrite', () => {
    let phase10: Phase10_Rewrite;

    beforeEach(() => {
      phase10 = new Phase10_Rewrite();
    });

    describe('Prompt Generation', () => {
      it('should include full original lesson in user prompt', () => {
        const lesson = createMockLesson();
        const rubricScore = {
          total: 85,
          breakdown: {
            schemaCompliance: 18,
            pedagogy: 20,
            questions: 20,
            marking: 17,
            visual: 5,
            safety: 5,
          },
          details: [
            {
              section: 'A1: Schema',
              score: 18,
              maxScore: 20,
              issues: ['Issue 1'],
              suggestions: ['Fix issue 1'],
            },
          ],
          grade: 'Usable',
        };

        const prompts = phase10.getPrompts({ originalLesson: lesson, rubricScore });

        expect(prompts.userPrompt).toContain('"id": "201-1A"');
        expect(prompts.userPrompt).toContain('ORIGINAL LESSON JSON:');
        expect(prompts.userPrompt).toContain('SCORING REPORT');
      });

      it('should format scoring report correctly', () => {
        const lesson = createMockLesson();
        const rubricScore = {
          total: 85,
          breakdown: {
            schemaCompliance: 18,
            pedagogy: 20,
            questions: 20,
            marking: 17,
            visual: 5,
            safety: 5,
          },
          details: [
            {
              section: 'D1: Marking',
              score: 17,
              maxScore: 20,
              issues: ['expectedAnswer too vague'],
              suggestions: ['Add more variants'],
            },
          ],
          grade: 'Usable',
        };

        const prompts = phase10.getPrompts({ originalLesson: lesson, rubricScore });

        expect(prompts.userPrompt).toContain('Total Score: 85/100');
        expect(prompts.userPrompt).toContain('## D1: Marking (17/20)');
        expect(prompts.userPrompt).toContain('- Issue: expectedAnswer too vague');
        expect(prompts.userPrompt).toContain('Suggestion: Add more variants');
      });

      it('should include structural rules in system prompt', () => {
        const prompts = phase10.getPrompts({
          originalLesson: createMockLesson(),
          rubricScore: { total: 85, breakdown: {}, details: [], grade: 'Usable' },
        });

        expect(prompts.systemPrompt).toContain('Do NOT reorder blocks');
        expect(prompts.systemPrompt).toContain('Do NOT add blocks');
        expect(prompts.systemPrompt).toContain('Do NOT remove blocks');
        expect(prompts.systemPrompt).toContain('Do NOT change any block.id values');
        expect(prompts.systemPrompt).toContain('Keep blocks array length EXACTLY the same');
      });

      it('should include answerType preservation rules', () => {
        const prompts = phase10.getPrompts({
          originalLesson: createMockLesson(),
          rubricScore: { total: 85, breakdown: {}, details: [], grade: 'Usable' },
        });

        expect(prompts.systemPrompt).toContain('Do NOT change answerType');
        expect(prompts.systemPrompt).toContain('Prefer keeping answerType unchanged');
      });

      it('should warn about malformed suggestions', () => {
        const prompts = phase10.getPrompts({
          originalLesson: createMockLesson(),
          rubricScore: { total: 85, breakdown: {}, details: [], grade: 'Usable' },
        });

        expect(prompts.systemPrompt).toContain('[object Object]');
        expect(prompts.systemPrompt).toContain('ignore those suggestions');
      });
    });

    describe('Phase Name', () => {
      it('should return correct phase name', () => {
        expect(phase10.getPhaseName()).toBe('Phase 10 v2: Holistic Rewrite');
      });
    });
  });
});
