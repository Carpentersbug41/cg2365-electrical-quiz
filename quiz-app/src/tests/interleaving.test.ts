/**
 * Interleaving Service Tests
 * Validates that interleaving works correctly
 */

import { describe, it, expect } from 'vitest';
import { 
  createInterleavedQuiz, 
  createSeriesParallelMixedQuiz,
  validateInterleaving,
  SERIES_PARALLEL_INTERLEAVED_CONFIG
} from '@/lib/questions/interleavingService';
import { allTaggedQuestions } from '@/data/questions/index';
import { TaggedQuestion } from '@/data/questions/types';

describe('Interleaving Service', () => {
  
  describe('createInterleavedQuiz', () => {
    it('should create a quiz with questions from all pools', () => {
      const config = {
        pools: [
          { tag: 'series' as const, count: 3 },
          { tag: 'parallel' as const, count: 3 }
        ],
        discriminationCount: 2,
        strategy: 'alternating' as const
      };

      const result = createInterleavedQuiz(allTaggedQuestions, config);

      // Should have questions from series, parallel, and discrimination
      const hasSeriesQuestions = result.some(q => q.tags.includes('series'));
      const hasParallelQuestions = result.some(q => q.tags.includes('parallel'));
      const hasDiscriminationQuestions = result.some(q => q.tags.includes('discrimination'));

      expect(hasSeriesQuestions).toBe(true);
      expect(hasParallelQuestions).toBe(true);
      expect(hasDiscriminationQuestions).toBe(true);
    });

    it('should respect question counts from config', () => {
      const config = {
        pools: [
          { tag: 'series' as const, count: 5 },
          { tag: 'parallel' as const, count: 5 }
        ],
        discriminationCount: 4,
        strategy: 'random' as const
      };

      const result = createInterleavedQuiz(allTaggedQuestions, config);

      // Total should be approximately count + discrimination
      // (may vary slightly due to randomization and availability)
      expect(result.length).toBeGreaterThanOrEqual(10);
      expect(result.length).toBeLessThanOrEqual(15);
    });

    it('should apply easy-to-hard progression when specified', () => {
      const config = {
        pools: [
          { tag: 'series' as const, count: 5 },
          { tag: 'parallel' as const, count: 5 }
        ],
        discriminationCount: 2,
        strategy: 'random' as const,
        difficultyProgression: 'easy-to-hard' as const
      };

      const result = createInterleavedQuiz(allTaggedQuestions, config);

      // Check that questions are sorted by difficulty
      for (let i = 0; i < result.length - 1; i++) {
        const currentDiff = result[i].difficulty || 3;
        const nextDiff = result[i + 1].difficulty || 3;
        expect(nextDiff).toBeGreaterThanOrEqual(currentDiff);
      }
    });
  });

  describe('createSeriesParallelMixedQuiz', () => {
    it('should create a properly interleaved quiz', () => {
      const result = createSeriesParallelMixedQuiz(allTaggedQuestions);

      expect(result.length).toBeGreaterThan(0);

      // Validate interleaving
      const stats = validateInterleaving(result);
      
      expect(stats.seriesCount).toBeGreaterThan(0);
      expect(stats.parallelCount).toBeGreaterThan(0);
      expect(stats.discriminationCount).toBeGreaterThan(0);
    });

    it('should use the predefined config', () => {
      const result = createSeriesParallelMixedQuiz(allTaggedQuestions);
      
      // Check that we have roughly the expected counts
      const stats = validateInterleaving(result);
      
      // Note: Some questions may have multiple tags (e.g., both 'series' and 'discrimination')
      // So counts may be slightly higher than pool size
      expect(stats.seriesCount).toBeGreaterThan(0);
      expect(stats.parallelCount).toBeGreaterThan(0);
      expect(stats.discriminationCount).toBeGreaterThanOrEqual(
        SERIES_PARALLEL_INTERLEAVED_CONFIG.discriminationCount
      );
      
      // Total should be reasonable
      expect(stats.totalQuestions).toBeGreaterThanOrEqual(10);
      expect(stats.totalQuestions).toBeLessThanOrEqual(20);
    });
  });

  describe('validateInterleaving', () => {
    it('should correctly identify proper interleaving', () => {
      // Create a properly interleaved set (manual)
      const seriesQ: TaggedQuestion = {
        id: 1,
        question: 'Series test',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        section: 'Test',
        category: 'Test',
        tags: ['series'],
        learningOutcomeId: 'test-1',
        answerType: 'mcq'
      };

      const parallelQ: TaggedQuestion = {
        id: 2,
        question: 'Parallel test',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        section: 'Test',
        category: 'Test',
        tags: ['parallel'],
        learningOutcomeId: 'test-2',
        answerType: 'mcq'
      };

      const discQ: TaggedQuestion = {
        id: 3,
        question: 'Discrimination test',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        section: 'Test',
        category: 'Test',
        tags: ['discrimination'],
        learningOutcomeId: 'test-3',
        answerType: 'mcq'
      };

      // Good interleaving: S, P, D, S, P
      const goodInterleaving = [seriesQ, parallelQ, discQ, seriesQ, parallelQ];
      const stats = validateInterleaving(goodInterleaving);

      expect(stats.isProperlyInterleaved).toBe(true);
      expect(stats.longestBlock).toBeLessThanOrEqual(2);
    });

    it('should correctly identify poor interleaving', () => {
      // Create poorly interleaved set (blocked)
      const seriesQuestions = Array(5).fill(null).map((_, i) => ({
        id: i,
        question: 'Series test',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        section: 'Test',
        category: 'Test',
        tags: ['series'],
        learningOutcomeId: 'test-1',
        answerType: 'mcq' as const
      }));

      const parallelQuestions = Array(5).fill(null).map((_, i) => ({
        id: i + 10,
        question: 'Parallel test',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        section: 'Test',
        category: 'Test',
        tags: ['parallel'],
        learningOutcomeId: 'test-2',
        answerType: 'mcq' as const
      }));

      // Poor interleaving: all series, then all parallel
      const poorInterleaving = [...seriesQuestions, ...parallelQuestions];
      const stats = validateInterleaving(poorInterleaving);

      expect(stats.isProperlyInterleaved).toBe(false);
      expect(stats.longestBlock).toBeGreaterThan(2);
    });

    it('should return correct statistics', () => {
      const result = createSeriesParallelMixedQuiz(allTaggedQuestions);
      const stats = validateInterleaving(result);

      expect(stats.totalQuestions).toBe(result.length);
      expect(stats.seriesCount + stats.parallelCount).toBeGreaterThan(0);
      expect(stats.discriminationCount).toBeGreaterThan(0);
      expect(stats.longestBlock).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Interleaving Strategies', () => {
    it('alternating strategy should alternate between pools', () => {
      const config = {
        pools: [
          { tag: 'series' as const, count: 3 },
          { tag: 'parallel' as const, count: 3 }
        ],
        discriminationCount: 2,
        strategy: 'alternating' as const
      };

      const result = createInterleavedQuiz(allTaggedQuestions, config);
      const stats = validateInterleaving(result);

      // Alternating should produce proper interleaving
      expect(stats.isProperlyInterleaved).toBe(true);
    });

    it('progressive strategy should include discrimination early', () => {
      const config = {
        pools: [
          { tag: 'series' as const, count: 4 },
          { tag: 'parallel' as const, count: 4 }
        ],
        discriminationCount: 4,
        strategy: 'progressive' as const
      };

      const result = createInterleavedQuiz(allTaggedQuestions, config);

      // First few questions should include discrimination
      const firstThree = result.slice(0, 3);
      const hasEarlyDisc = firstThree.some(q => q.tags.includes('discrimination'));
      
      expect(hasEarlyDisc).toBe(true);
    });
  });

  describe('Question Bank Coverage', () => {
    it('should have discrimination questions available', () => {
      const discriminationQuestions = allTaggedQuestions.filter(q => 
        q.tags.includes('discrimination')
      );

      expect(discriminationQuestions.length).toBeGreaterThan(0);
    });

    it('should have series questions available', () => {
      const seriesQuestions = allTaggedQuestions.filter(q => 
        q.tags.includes('series') && !q.tags.includes('discrimination')
      );

      expect(seriesQuestions.length).toBeGreaterThan(0);
    });

    it('should have parallel questions available', () => {
      const parallelQuestions = allTaggedQuestions.filter(q => 
        q.tags.includes('parallel') && !q.tags.includes('discrimination')
      );

      expect(parallelQuestions.length).toBeGreaterThan(0);
    });
  });
});

