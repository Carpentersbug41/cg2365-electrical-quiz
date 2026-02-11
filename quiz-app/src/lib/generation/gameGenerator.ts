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

function roundOrder(order: number): number {
  return Math.round(order * 1000) / 1000;
}

/**
 * Games must not appear before relevant teaching.
 * If explanation blocks exist, anchor after the final explanation.
 * Otherwise, anchor after the final vocabulary block.
 */
function getMinimumSafeGameOrder(lesson: Lesson): number {
  const vocabBlocks = lesson.blocks.filter(b => b.type === 'vocab');
  const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');

  const maxVocabOrder = vocabBlocks.length > 0 ? Math.max(...vocabBlocks.map(b => b.order)) : 0;
  const maxExplanationOrder = explanationBlocks.length > 0 ? Math.max(...explanationBlocks.map(b => b.order)) : 0;

  return explanationBlocks.length > 0 ? maxExplanationOrder : maxVocabOrder;
}

/**
 * Build insertion slots that keep microbreaks interleaved with learning blocks.
 * One slot per gap avoids back-to-back microbreaks.
 */
function buildInterleavedGameOrders(lesson: Lesson, requestedCount: number): number[] {
  if (requestedCount <= 0) return [];

  const minSafeOrder = getMinimumSafeGameOrder(lesson);
  const nonMicroBlocks = lesson.blocks
    .filter(b => b.type !== 'microbreak')
    .sort((a, b) => a.order - b.order);
  const existingMicrobreaks = lesson.blocks
    .filter(b => b.type === 'microbreak')
    .sort((a, b) => a.order - b.order);

  const occupiedOrders = new Set(lesson.blocks.map(b => roundOrder(b.order)));
  const slotOrders: number[] = [];

  for (let i = 0; i < nonMicroBlocks.length; i++) {
    const anchor = nonMicroBlocks[i];
    if (anchor.order < minSafeOrder) continue;
    if (anchor.type === 'spaced-review') continue;

    const nextBlock = nonMicroBlocks[i + 1];
    const nextOrder = nextBlock ? nextBlock.order : anchor.order + 1;
    const gap = nextOrder - anchor.order;
    if (gap <= 0.05) continue;

    // Keep one microbreak per gap so there is always learning between microbreaks.
    const hasMicrobreakInGap = existingMicrobreaks.some(
      mb => mb.order > anchor.order && mb.order < nextOrder
    );
    if (hasMicrobreakInGap) continue;

    const offset = Math.min(0.25, gap * 0.4);
    let candidateOrder = roundOrder(anchor.order + Math.max(0.05, offset));

    if (candidateOrder >= nextOrder) {
      candidateOrder = roundOrder(anchor.order + gap / 2);
    }
    if (candidateOrder <= anchor.order || candidateOrder >= nextOrder) {
      continue;
    }

    while (occupiedOrders.has(candidateOrder) && candidateOrder < nextOrder - 0.01) {
      candidateOrder = roundOrder(candidateOrder + 0.01);
    }
    if (candidateOrder <= anchor.order || candidateOrder >= nextOrder) {
      continue;
    }

    slotOrders.push(candidateOrder);
    occupiedOrders.add(candidateOrder);
  }

  const uniqueSlots = [...new Set(slotOrders)].sort((a, b) => a - b);
  if (uniqueSlots.length === 0) return [];

  const finalCount = Math.min(requestedCount, uniqueSlots.length);
  if (requestedCount > uniqueSlots.length) {
    console.warn(
      `[GameGenerator] Requested ${requestedCount} game(s), but only ${uniqueSlots.length} interleaved slot(s) are available. Capping to ${finalCount}.`
    );
  }

  if (finalCount === 1) {
    return [uniqueSlots[Math.floor(uniqueSlots.length / 2)]];
  }

  const selectedOrders: number[] = [];
  let previousIndex = -1;
  for (let i = 0; i < finalCount; i++) {
    let slotIndex = Math.round((i * (uniqueSlots.length - 1)) / (finalCount - 1));
    if (slotIndex <= previousIndex) slotIndex = previousIndex + 1;
    if (slotIndex >= uniqueSlots.length) slotIndex = uniqueSlots.length - 1;

    selectedOrders.push(uniqueSlots[slotIndex]);
    previousIndex = slotIndex;
  }

  return selectedOrders;
}

function getNextMicrobreakNumber(lesson: Lesson): number {
  const maxExistingNumber = lesson.blocks
    .filter(b => b.type === 'microbreak')
    .map(b => {
      const match = b.id.match(/-microbreak-(\d+)$/);
      return match ? Number.parseInt(match[1], 10) : 0;
    })
    .reduce((max, current) => Math.max(max, current), 0);

  return maxExistingNumber + 1;
}

/**
 * Validate that game placement is pedagogically sound (after content it tests).
 * Returns validation errors if placement is problematic.
 */
function validateGamePlacement(lesson: Lesson, gameOrder: number, gameIndex: number): string[] {
  const errors: string[] = [];

  const vocabBlocks = lesson.blocks.filter(b => b.type === 'vocab');
  const maxVocabOrder = vocabBlocks.length > 0 ? Math.max(...vocabBlocks.map(b => b.order)) : 0;
  if (vocabBlocks.length > 0 && gameOrder <= maxVocabOrder) {
    errors.push(`Game ${gameIndex + 1} at order ${gameOrder} appears before vocab block (order ${maxVocabOrder})`);
  }

  const explanationBlocks = lesson.blocks.filter(b => b.type === 'explanation');
  const maxExplanationOrder = explanationBlocks.length > 0 ? Math.max(...explanationBlocks.map(b => b.order)) : 0;
  if (explanationBlocks.length > 0 && gameOrder <= maxExplanationOrder) {
    errors.push(`Game ${gameIndex + 1} at order ${gameOrder} appears before explanation blocks (last at order ${maxExplanationOrder})`);
  }

  return errors;
}

/**
 * Generate microbreak games for a lesson using LLM.
 */
export async function generateMicrobreaksForLesson(
  lesson: Lesson,
  options?: GameGenerationOptions
): Promise<Block[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const requestedCount = Math.max(0, options?.count || 2);
  const hasManualPlacement = Boolean(options?.insertAfterBlocks && options.insertAfterBlocks.length > 0);
  const plannedOrders = hasManualPlacement ? [] : buildInterleavedGameOrders(lesson, requestedCount);
  const count = hasManualPlacement ? requestedCount : plannedOrders.length;

  if (count === 0) {
    console.warn(`[GameGenerator] No valid insertion slot available for lesson ${lesson.id}.`);
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.8,
      responseMimeType: 'application/json',
    }
  });

  const vocabBlocks = lesson.blocks
    .filter(b => b.type === 'vocab')
    .map(b => b.content as VocabBlockContent);

  const explanationBlocks = lesson.blocks
    .filter(b => b.type === 'explanation')
    .map(b => b.content as ExplanationBlockContent);

  const vocabTerms = vocabBlocks.flatMap(v =>
    v.terms.map(t => ({ term: t.term, definition: t.definition }))
  );

  const keyConcepts = explanationBlocks.map(e => ({
    title: e.title,
    content: e.content.substring(0, 500)
  }));

  const gameTypes = options?.gameTypes || ['matching', 'sorting'];

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
    const parsed = JSON.parse(responseText);
    if (!Array.isArray(parsed)) {
      throw new Error('LLM response is not an array of game objects');
    }

    const games = (parsed as MicrobreakContent[]).slice(0, count);
    if (games.length < count) {
      console.warn(`[GameGenerator] LLM returned ${games.length}/${count} game(s).`);
    }

    const blocks: Block[] = [];
    const validationErrors: string[] = [];
    const nextMicrobreakNumber = getNextMicrobreakNumber(lesson);
    const occupiedOrders = new Set(lesson.blocks.map(b => roundOrder(b.order)));

    for (let index = 0; index < games.length; index++) {
      const game = games[index];

      let order: number;
      if (hasManualPlacement) {
        const targetBlockId = options?.insertAfterBlocks?.[index];
        const targetBlock = targetBlockId
          ? lesson.blocks.find(b => b.id === targetBlockId)
          : undefined;
        order = targetBlock ? roundOrder(targetBlock.order + 0.2) : roundOrder(lesson.blocks.length + index + 1);
      } else {
        order = plannedOrders[index];
      }

      while (occupiedOrders.has(order)) {
        order = roundOrder(order + 0.01);
      }
      occupiedOrders.add(order);

      const errors = validateGamePlacement(lesson, order, index);
      if (errors.length > 0) validationErrors.push(...errors);

      blocks.push({
        id: `${lesson.id}-microbreak-${nextMicrobreakNumber + index}`,
        type: 'microbreak',
        content: game,
        order
      });
    }

    if (validationErrors.length > 0) {
      console.warn('[GameGenerator] Game placement validation warnings:');
      validationErrors.forEach(err => console.warn(`  - ${err}`));
    }

    console.log(`[GameGenerator] Generated ${blocks.length} microbreak game(s) for lesson ${lesson.id}`);
    return blocks;
  } catch (error) {
    console.error('Failed to generate microbreak games:', error);
    throw new Error(`Game generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a simple matching game manually (fallback if LLM fails).
 */
export function generateSimpleMatchingGame(lesson: Lesson, blockIndex: number = 1): Block {
  const vocabBlock = lesson.blocks.find(b => b.type === 'vocab');
  if (!vocabBlock) {
    throw new Error('No vocabulary block found in lesson');
  }

  const vocabContent = vocabBlock.content as VocabBlockContent;
  const pairs = vocabContent.terms.slice(0, 5).map(t => ({
    left: t.term,
    right: t.definition.substring(0, 50)
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
 * Generate a simple sorting game manually (fallback if LLM fails).
 */
export function generateSimpleSortingGame(lesson: Lesson, categories: [string, string], blockIndex: number = 2): Block {
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
