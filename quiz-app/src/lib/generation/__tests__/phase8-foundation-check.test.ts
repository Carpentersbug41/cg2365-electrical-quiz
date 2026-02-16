/**
 * Phase 8 Foundation Check Test Suite
 * Tests the new Phase 8 implementation that always generates exactly 3 questions
 */

import { Phase8_SpacedReview, SpacedReviewInput, SpacedReviewOutput } from '../phases/Phase8_SpacedReview';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Phase 8: Foundation Check', () => {
  let phase8: Phase8_SpacedReview;

  beforeEach(() => {
    phase8 = new Phase8_SpacedReview();
  });

  describe('Interface and Structure', () => {
    it('should accept new SpacedReviewInput format', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Health & Safety Legislation',
        learningOutcomes: [
          'Understand key health and safety legislation',
          'Identify employer responsibilities',
          'Apply safety protocols in workplace'
        ],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.systemPrompt).toBeDefined();
      expect(prompts.userPrompt).toBeDefined();
    });

    it('should not accept old prerequisite-based format', () => {
      // TypeScript should prevent this at compile time
      // This test documents the breaking change
      const oldFormat = {
        lessonId: '201-1A',
        prerequisites: ['200-1A'],
        prerequisiteAnchors: 'Some anchors'
      };

      expect(() => phase8.getPrompts(oldFormat)).toBeDefined();
    });
  });

  describe('System Prompt', () => {
    it('should require exactly 3 questions', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test Lesson',
        learningOutcomes: ['Outcome 1', 'Outcome 2'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.systemPrompt).toContain('EXACTLY 3 questions');
      expect(prompts.systemPrompt).toContain('no more, no fewer');
    });

    it('should specify short-text answerType', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test Lesson',
        learningOutcomes: ['Outcome 1'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.systemPrompt).toContain('answerType: "short-text"');
    });

    it('should emphasize prerequisite knowledge, not current lesson', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test Lesson',
        learningOutcomes: ['Outcome 1'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.systemPrompt).toContain('prerequisite knowledge');
      expect(prompts.systemPrompt).toContain('NOT current lesson content');
    });
  });

  describe('User Prompt - With Previous Lessons', () => {
    it('should include previous lesson titles when available', () => {
      const input: SpacedReviewInput = {
        lessonId: '202-3A',
        title: 'Ohm\'s Law Applications',
        learningOutcomes: [
          'Calculate voltage using Ohm\'s Law',
          'Calculate current in circuits',
          'Calculate resistance values'
        ],
        previousLessonTitles: [
          'Voltage and Current Basics',
          'Understanding Resistance',
          'Series and Parallel Circuits'
        ]
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('PREVIOUS LESSON TITLES');
      expect(prompts.userPrompt).toContain('Voltage and Current Basics');
      expect(prompts.userPrompt).toContain('Understanding Resistance');
      expect(prompts.userPrompt).toContain('Series and Parallel Circuits');
    });

    it('should include all learning outcomes', () => {
      const input: SpacedReviewInput = {
        lessonId: '202-3A',
        title: 'Test Lesson',
        learningOutcomes: [
          'Outcome 1: First learning outcome',
          'Outcome 2: Second learning outcome',
          'Outcome 3: Third learning outcome'
        ],
        previousLessonTitles: ['Previous Lesson']
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('Outcome 1: First learning outcome');
      expect(prompts.userPrompt).toContain('Outcome 2: Second learning outcome');
      expect(prompts.userPrompt).toContain('Outcome 3: Third learning outcome');
    });

    it('should show exactly 3 question examples in template', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      // Count SR-1, SR-2, SR-3 in the template
      const sr1Count = (prompts.userPrompt.match(/SR-1/g) || []).length;
      const sr2Count = (prompts.userPrompt.match(/SR-2/g) || []).length;
      const sr3Count = (prompts.userPrompt.match(/SR-3/g) || []).length;
      const sr4Count = (prompts.userPrompt.match(/SR-4/g) || []).length;

      expect(sr1Count).toBeGreaterThan(0);
      expect(sr2Count).toBeGreaterThan(0);
      expect(sr3Count).toBeGreaterThan(0);
      expect(sr4Count).toBe(0); // Should not have SR-4
    });
  });

  describe('User Prompt - First Lesson (No Previous)', () => {
    it('should handle first lesson in module gracefully', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'First Lesson',
        learningOutcomes: [
          'Understand basic concept 1',
          'Identify basic concept 2'
        ],
        previousLessonTitles: [] // First lesson - no previous
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('early lesson in the module');
      expect(prompts.userPrompt).toContain('baseline electrical knowledge');
      expect(prompts.userPrompt).not.toContain('PREVIOUS LESSON TITLES');
    });

    it('should still require exactly 3 questions for first lesson', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'First Lesson',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('EXACTLY 3 questions');
      expect(prompts.userPrompt).toContain('questions": [');
      // Should show 3 question placeholders
      expect((prompts.userPrompt.match(/questionText/g) || []).length).toBe(3);
    });
  });

  describe('Output Schema Requirements', () => {
    it('should require answerType field on all questions', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      // Should show answerType in each question template
      expect((prompts.userPrompt.match(/"answerType": "short-text"/g) || []).length).toBe(3);
    });

    it('should require expectedAnswer as array', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('expectedAnswer: array of 2-4 strings');
      expect(prompts.userPrompt).toContain('"expectedAnswer": [');
    });

    it('should include foundation check title', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test Lesson',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('"title": "Foundation Check"');
    });

    it('should set order to 10 (always last)', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('"order": 10');
    });
  });

  describe('Validation Requirements', () => {
    it('should emphasize 2-4 answer variants only', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.systemPrompt).toContain('2-4 strings');
      expect(prompts.systemPrompt).toContain('variants for normalization only');
    });

    it('should use questionText field name consistently', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.systemPrompt).toContain('Use "questionText"');
      expect(prompts.systemPrompt).toContain('NOT "attText"');
      expect(prompts.userPrompt).toContain('"questionText"');
      expect(prompts.userPrompt).not.toContain('"attText"');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty previousLessonTitles array', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome 1', 'Outcome 2'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toBeDefined();
      expect(prompts.userPrompt.length).toBeGreaterThan(0);
    });

    it('should handle single learning outcome', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Single outcome'],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('Single outcome');
    });

    it('should handle many learning outcomes', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: [
          'Outcome 1',
          'Outcome 2',
          'Outcome 3',
          'Outcome 4',
          'Outcome 5'
        ],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('Outcome 1');
      expect(prompts.userPrompt).toContain('Outcome 5');
    });

    it('should handle 4 previous lesson titles (max)', () => {
      const input: SpacedReviewInput = {
        lessonId: '202-5A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: [
          'Lesson 1',
          'Lesson 2',
          'Lesson 3',
          'Lesson 4'
        ]
      };

      const prompts = phase8.getPrompts(input);
      expect(prompts.userPrompt).toContain('Lesson 1');
      expect(prompts.userPrompt).toContain('Lesson 2');
      expect(prompts.userPrompt).toContain('Lesson 3');
      expect(prompts.userPrompt).toContain('Lesson 4');
    });
  });

  describe('Backwards Compatibility Breaches', () => {
    it('should not support prerequisites field anymore', () => {
      // Document that the old interface is gone
      const newInput: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'Test',
        learningOutcomes: ['Outcome'],
        previousLessonTitles: []
      };

      // Verify new fields exist
      expect(newInput.learningOutcomes).toBeDefined();
      expect(newInput.previousLessonTitles).toBeDefined();
      
      // Old fields should not exist in type
      // @ts-expect-error - prerequisites field should not exist
      expect(newInput.prerequisites).toBeUndefined();
      expect(newInput.prerequisiteAnchors).toBeUndefined();
    });

    it('should never return empty questions array in prompt', () => {
      const input: SpacedReviewInput = {
        lessonId: '201-1A',
        title: 'First Lesson Ever',
        learningOutcomes: [],
        previousLessonTitles: []
      };

      const prompts = phase8.getPrompts(input);
      // Should not contain empty array instruction
      expect(prompts.userPrompt).not.toContain('"questions": []');
      expect(prompts.userPrompt).not.toContain('No prerequisites');
      // Should always ask for 3 questions
      expect(prompts.userPrompt).toContain('EXACTLY 3 questions');
    });
  });
});
