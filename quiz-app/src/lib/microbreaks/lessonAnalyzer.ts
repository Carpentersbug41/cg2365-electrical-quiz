import { Lesson, VocabBlockContent, ExplanationBlockContent } from '@/data/lessons/types';

export interface LessonAnalysis {
  hasVocab: boolean;
  vocabTermCount: number;
  hasExplanations: boolean;
  explanationCount: number;
  existingMicrobreaks: number;
  totalBlocks: number;
  recommendedGames: Array<'matching' | 'sorting' | 'spot-error' | 'tap-label' | 'quick-win'>;
  suitableForGames: boolean;
  warnings: string[];
}

/**
 * Analyze a lesson to determine suitability for game generation
 */
export function analyzeLessonForGames(lesson: Lesson): LessonAnalysis {
  const vocabBlocks = lesson.blocks.filter(b => b.type === 'vocab');
  const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');
  const microbreakBlocks = lesson.blocks.filter(b => b.type === 'microbreak');
  
  // Count vocab terms
  const vocabTermCount = vocabBlocks.reduce((sum, block) => {
    const content = block.content as VocabBlockContent;
    return sum + (content.terms?.length || 0);
  }, 0);
  
  // Count explanations
  const explanationCount = explanationBlocks.length;
  
  // Build recommendations based on content
  const recommendedGames: Array<'matching' | 'sorting' | 'spot-error' | 'tap-label' | 'quick-win'> = [];
  const warnings: string[] = [];
  
  // Matching game - good if vocab exists
  if (vocabTermCount >= 4) {
    recommendedGames.push('matching');
  } else if (vocabTermCount > 0) {
    warnings.push(`Only ${vocabTermCount} vocab terms. Matching games work best with 4+ terms.`);
  }
  
  // Quick win - good for any vocab
  if (vocabTermCount >= 3) {
    recommendedGames.push('quick-win');
  }
  
  // Sorting - needs categories (harder to auto-detect, but recommend if vocab exists)
  if (vocabTermCount >= 6 || explanationCount >= 2) {
    recommendedGames.push('sorting');
  }
  
  // Spot error - needs explanations with procedures/steps
  if (explanationCount >= 2) {
    recommendedGames.push('spot-error');
  }
  
  // Tap to label - needs diagrams
  const hasDiagram = lesson.blocks.some(b => b.type === 'diagram');
  if (hasDiagram) {
    recommendedGames.push('tap-label');
  }
  
  // Overall suitability
  const suitableForGames = vocabTermCount >= 3 || explanationCount >= 2;
  
  if (!suitableForGames) {
    warnings.push('Lesson has minimal content for game generation. Consider adding more vocabulary or explanations.');
  }
  
  if (microbreakBlocks.length >= 3) {
    warnings.push(`Lesson already has ${microbreakBlocks.length} microbreaks. Adding more may interrupt flow.`);
  }
  
  return {
    hasVocab: vocabTermCount > 0,
    vocabTermCount,
    hasExplanations: explanationCount > 0,
    explanationCount,
    existingMicrobreaks: microbreakBlocks.length,
    totalBlocks: lesson.blocks.length,
    recommendedGames,
    suitableForGames,
    warnings
  };
}

/**
 * Get a human-readable description of game suitability
 */
export function getGameSuitabilityDescription(analysis: LessonAnalysis): string {
  if (!analysis.suitableForGames) {
    return 'Limited content for games';
  }
  
  if (analysis.existingMicrobreaks >= 3) {
    return 'Already has multiple games';
  }
  
  if (analysis.vocabTermCount >= 6 && analysis.explanationCount >= 2) {
    return 'Excellent for all game types';
  }
  
  if (analysis.vocabTermCount >= 4) {
    return 'Good for vocabulary-based games';
  }
  
  if (analysis.explanationCount >= 2) {
    return 'Good for concept-based games';
  }
  
  return 'Suitable for basic games';
}
