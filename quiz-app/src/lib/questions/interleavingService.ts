/**
 * Interleaving Service
 * Creates mixed question sets for deep learning and discrimination practice
 * 
 * Theory: Interleaving forces learners to discriminate between similar concepts,
 * leading to better long-term retention and transfer compared to blocked practice.
 */

import { TaggedQuestion, QuestionTag } from '@/data/questions/types';

export interface InterleavedQuizConfig {
  /**
   * Question pools to interleave
   * Each pool represents a concept (e.g., 'series', 'parallel')
   */
  pools: {
    tag: QuestionTag;
    count: number; // How many questions from this pool
  }[];

  /**
   * Discrimination question count
   * These force learners to identify which concept applies
   */
  discriminationCount: number;

  /**
   * Interleaving strategy
   */
  strategy: 'random' | 'alternating' | 'progressive';

  /**
   * Difficulty progression (optional)
   */
  difficultyProgression?: 'easy-to-hard' | 'mixed';
}

/**
 * Interleaving Strategy Types
 */
type InterleavingStrategy = 'random' | 'alternating' | 'progressive';

/**
 * Create an interleaved question set
 * 
 * @param allQuestions - Full question bank
 * @param config - Interleaving configuration
 * @returns Strategically ordered question set
 */
export function createInterleavedQuiz(
  allQuestions: TaggedQuestion[],
  config: InterleavedQuizConfig
): TaggedQuestion[] {
  const result: TaggedQuestion[] = [];

  // Step 1: Collect discrimination questions
  const discriminationQuestions = allQuestions
    .filter(q => q.tags.includes('discrimination'))
    .sort(() => Math.random() - 0.5)
    .slice(0, config.discriminationCount);

  // Step 2: Collect questions from each pool
  const poolQuestions: TaggedQuestion[][] = config.pools.map(pool => {
    return allQuestions
      .filter(q => 
        q.tags.includes(pool.tag) && 
        !q.tags.includes('discrimination') // Exclude discrimination from pools
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, pool.count);
  });

  // Step 3: Apply interleaving strategy
  switch (config.strategy) {
    case 'alternating':
      result.push(...alternateQuestions(poolQuestions, discriminationQuestions));
      break;
    
    case 'progressive':
      result.push(...progressiveInterleave(poolQuestions, discriminationQuestions));
      break;
    
    case 'random':
    default:
      result.push(...randomInterleave(poolQuestions, discriminationQuestions));
      break;
  }

  // Step 4: Apply difficulty progression if specified
  if (config.difficultyProgression === 'easy-to-hard') {
    return sortByDifficulty(result);
  }

  return result;
}

/**
 * Alternating Strategy
 * Systematically alternates between pools: A, B, Disc, A, B, Disc...
 */
function alternateQuestions(
  pools: TaggedQuestion[][],
  discrimination: TaggedQuestion[]
): TaggedQuestion[] {
  const result: TaggedQuestion[] = [];
  const maxLength = Math.max(...pools.map(p => p.length));
  
  for (let i = 0; i < maxLength; i++) {
    // Add one from each pool
    for (const pool of pools) {
      if (pool[i]) {
        result.push(pool[i]);
      }
    }
    
    // Add discrimination question periodically
    if (discrimination[i]) {
      result.push(discrimination[i]);
    }
  }
  
  return result;
}

/**
 * Progressive Strategy
 * Start with discrimination to prime learners, then interleave application
 * Pattern: Disc, A, B, Disc, A, A, B, B, Disc...
 */
function progressiveInterleave(
  pools: TaggedQuestion[][],
  discrimination: TaggedQuestion[]
): TaggedQuestion[] {
  const result: TaggedQuestion[] = [];
  
  // Phase 1: Start with discrimination to establish the difference
  const initialDisc = discrimination.slice(0, 2);
  result.push(...initialDisc);
  
  // Phase 2: Light interleaving (one from each)
  const midLength = Math.min(...pools.map(p => p.length)) / 2;
  for (let i = 0; i < midLength; i++) {
    for (const pool of pools) {
      if (pool[i]) {
        result.push(pool[i]);
      }
    }
    
    // Add discrimination periodically
    if (discrimination[i + 2]) {
      result.push(discrimination[i + 2]);
    }
  }
  
  // Phase 3: Heavier practice from each pool
  for (const pool of pools) {
    const remaining = pool.slice(Math.floor(midLength));
    result.push(...remaining);
  }
  
  // Phase 4: Final discrimination check
  const finalDisc = discrimination.slice(initialDisc.length + Math.floor(midLength));
  result.push(...finalDisc);
  
  return result;
}

/**
 * Random Strategy
 * Fully randomized order (maintains unpredictability)
 */
function randomInterleave(
  pools: TaggedQuestion[][],
  discrimination: TaggedQuestion[]
): TaggedQuestion[] {
  const allQuestions = [
    ...pools.flat(),
    ...discrimination
  ];
  
  return allQuestions.sort(() => Math.random() - 0.5);
}

/**
 * Sort questions by difficulty
 */
function sortByDifficulty(questions: TaggedQuestion[]): TaggedQuestion[] {
  return questions.sort((a, b) => {
    const diffA = a.difficulty || 3;
    const diffB = b.difficulty || 3;
    return diffA - diffB;
  });
}

/**
 * Pre-configured interleaved quiz: Series vs Parallel
 * This is the MVP implementation
 */
export const SERIES_PARALLEL_INTERLEAVED_CONFIG: InterleavedQuizConfig = {
  pools: [
    { tag: 'series', count: 5 },
    { tag: 'parallel', count: 5 }
  ],
  discriminationCount: 4,
  strategy: 'alternating', // Clear pattern helps learning
  difficultyProgression: 'easy-to-hard'
};

/**
 * Create the Series/Parallel mixed quiz
 * This is what learners should take after completing both lesson 202-4A and 202-4B
 */
export function createSeriesParallelMixedQuiz(
  allQuestions: TaggedQuestion[]
): TaggedQuestion[] {
  return createInterleavedQuiz(allQuestions, SERIES_PARALLEL_INTERLEAVED_CONFIG);
}

/**
 * Validate that interleaving is working
 * Returns statistics about the question mix
 */
export function validateInterleaving(questions: TaggedQuestion[]): {
  totalQuestions: number;
  seriesCount: number;
  parallelCount: number;
  discriminationCount: number;
  longestBlock: number;
  isProperlyInterleaved: boolean;
} {
  let seriesCount = 0;
  let parallelCount = 0;
  let discriminationCount = 0;
  
  questions.forEach(q => {
    if (q.tags.includes('series')) seriesCount++;
    if (q.tags.includes('parallel')) parallelCount++;
    if (q.tags.includes('discrimination')) discriminationCount++;
  });
  
  // Check for longest consecutive block of same type
  let longestBlock = 1;
  let currentBlock = 1;
  let currentType = questions[0]?.tags.includes('series') ? 'series' : 
                    questions[0]?.tags.includes('parallel') ? 'parallel' : 'disc';
  
  for (let i = 1; i < questions.length; i++) {
    const type = questions[i].tags.includes('series') ? 'series' : 
                 questions[i].tags.includes('parallel') ? 'parallel' : 'disc';
    
    if (type === currentType && type !== 'disc') {
      currentBlock++;
      longestBlock = Math.max(longestBlock, currentBlock);
    } else {
      currentBlock = 1;
      currentType = type;
    }
  }
  
  // Properly interleaved if longest block ≤ 2 (allows occasional doubles)
  const isProperlyInterleaved = longestBlock <= 2;
  
  return {
    totalQuestions: questions.length,
    seriesCount,
    parallelCount,
    discriminationCount,
    longestBlock,
    isProperlyInterleaved
  };
}

/**
 * Check if learner is eligible for an interleaved quiz
 * Requires mastery of all prerequisite lessons
 */
export function checkInterleavingEligibility(
  quizId: string,
  prerequisites: string[]
): {
  eligible: boolean;
  missingPrerequisites: string[];
} {
  if (typeof window === 'undefined') {
    return { eligible: false, missingPrerequisites: prerequisites };
  }

  // Import dynamically to avoid circular dependencies
  const { getQuizProgress } = require('@/lib/progress/progressService');
  
  const missingPrerequisites: string[] = [];
  
  for (const prereqId of prerequisites) {
    const progress = getQuizProgress(`${prereqId}-quiz`);
    if (!progress?.masteryAchieved) {
      missingPrerequisites.push(prereqId);
    }
  }
  
  return {
    eligible: missingPrerequisites.length === 0,
    missingPrerequisites
  };
}
