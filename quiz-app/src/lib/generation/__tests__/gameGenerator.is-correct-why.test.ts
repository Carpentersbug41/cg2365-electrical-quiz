import { describe, expect, it } from 'vitest';
import {
  __testFallbackGameFromDigest,
  __testLooksLikeDeclarativeStatement,
  __testValidateGameSchemaAndContent,
  LessonDigest,
  Plan,
} from '../gameGenerator';

describe('gameGenerator is-correct-why safeguards', () => {
  const digest: LessonDigest = {
    vocabPairs: [
      { term: 'Magnetic Flux', definition: 'Total magnetic field through an area' },
      { term: 'Flux Density', definition: 'Field concentration per unit area' },
      { term: 'Pole', definition: 'Region where magnetic effect is strongest' },
    ],
    keyFacts: [
      'Magnetic Properties and Field Concepts',
      'In this lesson you will learn how magnets interact with one another.',
      'Like poles repel and unlike poles attract.',
      'Flux density is flux per unit area.',
      'A current-carrying conductor creates a magnetic field.',
    ],
    misconceptions: [
      'All magnetic parts automatically pull toward each other.',
      'Flux density and total flux are always the same.',
    ],
  };

  it('identifies declarative statements and rejects headings/framing', () => {
    expect(__testLooksLikeDeclarativeStatement('Like poles repel and unlike poles attract.')).toBe(true);
    expect(__testLooksLikeDeclarativeStatement('Magnetic Properties and Field Concepts')).toBe(false);
    expect(__testLooksLikeDeclarativeStatement('In this lesson you will learn magnetism.')).toBe(false);
  });

  it('rejects is-correct-why payloads with non-statement prompt and framing reasons', () => {
    const errors = __testValidateGameSchemaAndContent(
      'is-correct-why',
      {
        breakType: 'game',
        gameType: 'is-correct-why',
        statement: 'Magnetic Properties and Field Concepts',
        isCorrect: true,
        reasons: [
          'In this lesson you will learn how magnets interact.',
          'Like poles repel and unlike poles attract.',
          'All magnetic parts automatically pull toward each other.',
        ],
        correctReasonIndex: 1,
      },
      digest
    );

    expect(errors).toContain('is-correct-why statement must be a testable declarative statement');
    expect(errors).toContain('is-correct-why reasons must be gameplay options, not lesson framing text');
  });

  it('fallback builder avoids heading/framing facts for is-correct-why', () => {
    const plan: Plan = {
      slotId: 'slot-1',
      gameType: 'is-correct-why',
      rationale: 'reasoning slot',
      contentSource: 'facts',
    };

    const content = __testFallbackGameFromDigest(plan, digest);
    if (content.breakType !== 'game' || content.gameType !== 'is-correct-why') {
      throw new Error('Expected is-correct-why content');
    }

    expect(content.statement.toLowerCase()).not.toContain('in this lesson');
    expect(content.statement).not.toBe('Magnetic Properties and Field Concepts');
    expect(__testLooksLikeDeclarativeStatement(content.statement)).toBe(true);
    expect(content.reasons.some((r: string) => r.toLowerCase().includes('in this lesson'))).toBe(false);
  });
});
