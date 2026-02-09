import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiModelWithDefault, getGeminiApiKey } from '@/lib/config/geminiConfig';
import { Lesson, Block, MicrobreakContent, VocabBlockContent, ExplanationBlockContent } from '@/data/lessons/types';

const GAME_GENERATION_PROMPT = `You are an educational game designer creating microbreak activities for electrical engineering lessons.

CRITICAL RULES:
- Use ONLY concepts already covered in this lesson
- Keep items SHORT (5-10 words max per item)
- Target 70% easy wins, 30% light discrimination
- No multi-step reasoning required
- No new information - only reinforcement
- All content must be directly from the lesson vocabulary and explanations

Your goal is to create quick, low-effort engagement activities that reduce cognitive fatigue while reinforcing key concepts.`;

interface GameGenerationOptions {
  gameTypes?: Array<'matching' | 'sorting' | 'spot-error' | 'tap-label' | 'quick-win'>;
  insertAfterBlocks?: string[]; // Block IDs to insert after
  count?: number;
}

/**
 * Calculate smart placement order for a game based on lesson structure.
 * Games should only appear AFTER the content they test (vocab and explanations).
 * 
 * Strategy:
 * 1. Find minimum safe order (after all vocab and explanation blocks)
 * 2. Identify optimal insertion points (after check/practice blocks)
 * 3. Distribute games evenly across these insertion points
 * 4. Fallback: place after minimum order with small spacing
 */
function calculateSmartGameOrder(lesson: Lesson, gameIndex: number, totalGames: number): number {
  // Find all teaching content blocks
  const vocabBlocks = lesson.blocks.filter(b => b.type === 'vocab');
  const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');
  const checkBlocks = lesson.blocks.filter(b => 
    b.type === 'practice' && (b.content as any).mode === 'check'
  );
  const workedExampleBlocks = lesson.blocks.filter(b => b.type === 'worked-example');
  
  // Calculate minimum order: after last vocab AND last explanation
  const minVocabOrder = vocabBlocks.length > 0 
    ? Math.max(...vocabBlocks.map(b => b.order)) 
    : 0;
  const minExplanationOrder = explanationBlocks.length > 0 
    ? Math.max(...explanationBlocks.map(b => b.order)) 
    : 0;
  const minOrder = Math.max(minVocabOrder, minExplanationOrder);
  
  // Find valid insertion points (after check/practice blocks that come after teaching content)
  const validInsertionPoints = [
    ...checkBlocks.map(b => ({ order: b.order, type: 'check' })),
    ...workedExampleBlocks.map(b => ({ order: b.order, type: 'worked-example' }))
  ]
    .filter(point => point.order > minOrder)
    .map(point => point.order)
    .sort((a, b) => a - b);
  
  // Remove duplicates and sort
  const uniqueInsertionPoints = [...new Set(validInsertionPoints)].sort((a, b) => a - b);
  
  // Distribute games across valid insertion points
  if (uniqueInsertionPoints.length > 0) {
    const pointIndex = Math.min(
      Math.floor(gameIndex * uniqueInsertionPoints.length / totalGames),
      uniqueInsertionPoints.length - 1
    );
    const insertionOrder = uniqueInsertionPoints[pointIndex] + 0.5;
    
    console.log(`📍 Game ${gameIndex + 1}/${totalGames}: Placing at order ${insertionOrder} (after ${uniqueInsertionPoints.length} valid points, min order: ${minOrder})`);
    return insertionOrder;
  }
  
  // Fallback: place after minimum order with small incremental spacing
  const fallbackOrder = minOrder + 0.5 + (gameIndex * 0.1);
  console.log(`📍 Game ${gameIndex + 1}/${totalGames}: Using fallback placement at order ${fallbackOrder} (no check blocks found, min order: ${minOrder})`);
  return fallbackOrder;
}

/**
 * Validate that game placement is pedagogically sound (after content it tests).
 * Returns validation errors if placement is problematic.
 */
function validateGamePlacement(lesson: Lesson, gameOrder: number, gameIndex: number): string[] {
  const errors: string[] = [];
  
  // Check if game comes after all vocab blocks
  const vocabBlocks = lesson.blocks.filter(b => b.type === 'vocab');
  const maxVocabOrder = vocabBlocks.length > 0 ? Math.max(...vocabBlocks.map(b => b.order)) : 0;
  if (vocabBlocks.length > 0 && gameOrder <= maxVocabOrder) {
    errors.push(`Game ${gameIndex + 1} at order ${gameOrder} appears before vocab block (order ${maxVocabOrder})`);
  }
  
  // Check if game comes after all explanation blocks
  const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');
  const maxExplanationOrder = explanationBlocks.length > 0 ? Math.max(...explanationBlocks.map(b => b.order)) : 0;
  if (explanationBlocks.length > 0 && gameOrder <= maxExplanationOrder) {
    errors.push(`Game ${gameIndex + 1} at order ${gameOrder} appears before explanation blocks (last at order ${maxExplanationOrder})`);
  }
  
  return errors;
}

/**
 * Generate microbreak games for a lesson using LLM
 */
export async function generateMicrobreaksForLesson(
  lesson: Lesson,
  options?: GameGenerationOptions
): Promise<Block[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.8,
      responseMimeType: 'application/json',
    }
  });

  // Extract lesson content for context
  const vocabBlocks = lesson.blocks
    .filter(b => b.type === 'vocab')
    .map(b => b.content as VocabBlockContent);

  const explanationBlocks = lesson.blocks
    .filter(b => b.type === 'explanation')
    .map(b => b.content as ExplanationBlockContent);

  // Build vocab list
  const vocabTerms = vocabBlocks.flatMap(v => 
    v.terms.map(t => ({ term: t.term, definition: t.definition }))
  );

  // Build key concepts list
  const keyConcepts = explanationBlocks.map(e => ({
    title: e.title,
    content: e.content.substring(0, 500) // Limit to avoid token overflow
  }));

  const gameTypes = options?.gameTypes || ['matching', 'sorting'];
  const count = options?.count || 2;

  const prompt = `${GAME_GENERATION_PROMPT}

Lesson Title: ${lesson.title}
Lesson Description: ${lesson.description}

Vocabulary Terms (${vocabTerms.length} terms):
${JSON.stringify(vocabTerms, null, 2)}

Key Concepts:
${JSON.stringify(keyConcepts, null, 2)}

Generate ${count} microbreak games using these types: ${gameTypes.join(', ')}

For MATCHING games:
- Create 4-6 pairs from vocab terms or concept relationships
- Format: { "breakType": "game", "gameType": "matching", "duration": 90, "pairs": [{"left": "...", "right": "..."}, ...] }

For SORTING games:
- Create 2 clear categories and 6-8 items to sort
- Format: { "breakType": "game", "gameType": "sorting", "duration": 90, "buckets": ["Category1", "Category2"], "items": [{"text": "...", "correctBucket": 0}, ...] }

For SPOT-ERROR games:
- Create a scenario with 3-4 options, one containing an error
- Format: { "breakType": "game", "gameType": "spot-error", "duration": 60, "scenario": "...", "options": [{"text": "...", "isError": false}, ...], "explanation": "..." }

For QUICK-WIN games:
- Create 5-7 very easy recall questions from the vocab
- Format: { "breakType": "game", "gameType": "quick-win", "duration": 90, "questions": [{"question": "...", "answer": "..."}, ...] }

Return a JSON array of ${count} game objects. Use variety in game types if multiple types are requested.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const games: MicrobreakContent[] = JSON.parse(responseText);

    // Validate and convert to Block objects with smart placement
    const blocks: Block[] = [];
    const validationErrors: string[] = [];
    
    for (let index = 0; index < games.length; index++) {
      const game = games[index];
      
      // Determine order using smart placement algorithm
      let order: number;
      if (options?.insertAfterBlocks && options.insertAfterBlocks[index]) {
        // Manual placement: respect user-specified insertion point
        const targetBlock = lesson.blocks.find(b => b.id === options.insertAfterBlocks![index]);
        order = targetBlock ? targetBlock.order + 0.5 : (lesson.blocks.length + index + 1);
        console.log(`📍 Game ${index + 1}/${count}: Manual placement after block ${options.insertAfterBlocks[index]} at order ${order}`);
      } else {
        // Smart placement: place after teaching content
        order = calculateSmartGameOrder(lesson, index, count);
      }
      
      // Validate placement
      const errors = validateGamePlacement(lesson, order, index);
      if (errors.length > 0) {
        validationErrors.push(...errors);
      }

      blocks.push({
        id: `${lesson.id}-microbreak-${index + 1}`,
        type: 'microbreak' as const,
        content: game,
        order
      });
    }
    
    // Log validation warnings if any
    if (validationErrors.length > 0) {
      console.warn('⚠️ Game placement validation warnings:');
      validationErrors.forEach(err => console.warn(`  - ${err}`));
    }

    console.log(`✓ Generated ${blocks.length} microbreak games for lesson ${lesson.id}`);
    return blocks;

  } catch (error) {
    console.error('Failed to generate microbreak games:', error);
    throw new Error(`Game generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a simple matching game manually (fallback if LLM fails)
 */
export function generateSimpleMatchingGame(lesson: Lesson, blockIndex: number = 1): Block {
  // Extract vocab terms
  const vocabBlock = lesson.blocks.find(b => b.type === 'vocab');
  if (!vocabBlock) {
    throw new Error('No vocabulary block found in lesson');
  }

  const vocabContent = vocabBlock.content as VocabBlockContent;
  const pairs = vocabContent.terms.slice(0, 5).map(t => ({
    left: t.term,
    right: t.definition.substring(0, 50) // Truncate long definitions
  }));

  return {
    id: `${lesson.id}-microbreak-${blockIndex}`,
    type: 'microbreak',
    content: {
      breakType: 'game',
      gameType: 'matching',
      duration: 90,
      pairs
    },
    order: lesson.blocks.length + blockIndex
  };
}

/**
 * Generate a simple sorting game manually (fallback if LLM fails)
 */
export function generateSimpleSortingGame(lesson: Lesson, categories: [string, string], blockIndex: number = 2): Block {
  // This would need domain-specific logic to categorize items
  // For now, return a template that needs manual completion
  
  return {
    id: `${lesson.id}-microbreak-${blockIndex}`,
    type: 'microbreak',
    content: {
      breakType: 'game',
      gameType: 'sorting',
      duration: 90,
      buckets: categories,
      items: [
        { text: 'Example item 1', correctBucket: 0 },
        { text: 'Example item 2', correctBucket: 1 },
        { text: 'Example item 3', correctBucket: 0 },
        { text: 'Example item 4', correctBucket: 1 },
      ]
    },
    order: lesson.blocks.length + blockIndex
  };
}
