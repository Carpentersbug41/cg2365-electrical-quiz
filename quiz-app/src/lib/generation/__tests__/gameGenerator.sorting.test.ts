import { describe, expect, it } from 'vitest';
import {
  __testFallbackGameFromDigest,
  __testValidateGameSchemaAndContent,
  LessonDigest,
  Plan,
} from '../gameGenerator';

describe('gameGenerator sorting safeguards', () => {
  const digest: LessonDigest = {
    vocabPairs: [
      { term: 'Radial Circuit', definition: 'Single branch from source to load without a loop return.' },
      { term: 'Line Conductor', definition: 'Carries power from source to load in normal operation.' },
      { term: 'Neutral Conductor', definition: 'Provides the normal current return path to source.' },
    ],
    keyFacts: [
      'Cooker Circuit Fundamentals',
      'In this lesson you will learn to define a cooker circuit.',
      '- This knowledge is applied in residential and commercial systems.',
      'Radial circuits do not loop back to the source.',
      'A dedicated protective device is required at the consumer unit.',
    ],
  };

  it('rejects sorting payloads that use lesson-framing prose as items', () => {
    const errors = __testValidateGameSchemaAndContent(
      'sorting',
      {
        breakType: 'game',
        gameType: 'sorting',
        duration: 90,
        buckets: ['Role', 'Responsibility'],
        items: [
          { text: 'Cooker Circuit Fundamentals', correctBucket: 0 },
          { text: 'In this lesson - You will learn to define a cooker circuit as a dedicated radial circuit.', correctBucket: 1 },
          { text: '- This knowledge is applied when designing electrical systems.', correctBucket: 0 },
          { text: '- Key takeaways include basic path components and load classification.', correctBucket: 1 },
          { text: 'What this is In technical installations, a cooker circuit is a specific type of radial circuit.', correctBucket: 0 },
          { text: 'Unlike a ring final circuit, a radial circuit is a single branch.', correctBucket: 1 },
        ],
      },
      digest
    );

    expect(errors).toContain('sorting items must be concise concepts, not lesson framing or long prose');
  });

  it('fallback sorting builds concise gameplay items', () => {
    const plan: Plan = {
      slotId: 'slot-1',
      gameType: 'sorting',
      rationale: 'classification slot',
      contentSource: 'vocab',
    };

    const content = __testFallbackGameFromDigest(plan, digest);
    if (content.breakType !== 'game' || content.gameType !== 'sorting') {
      throw new Error('Expected sorting content');
    }

    expect(content.items).toHaveLength(6);
    expect(content.items.some(i => i.text.toLowerCase().startsWith('in this lesson'))).toBe(false);
    expect(content.items.some(i => i.text.startsWith('-'))).toBe(false);
    expect(content.items.some(i => i.text.length > 100)).toBe(false);
  });
});
