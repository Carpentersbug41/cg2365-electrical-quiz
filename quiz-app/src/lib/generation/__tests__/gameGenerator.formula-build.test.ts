import { describe, expect, it } from 'vitest';
import {
  __testFallbackGameFromDigest,
  __testValidateGameSchemaAndContent,
  LessonDigest,
  Plan,
} from '../gameGenerator';

describe('gameGenerator formula-build safeguards', () => {
  const digest: LessonDigest = {
    vocabPairs: [
      { term: 'Magnetic Flux Density', definition: 'Field strength per unit area' },
      { term: 'Magnetic Flux', definition: 'Total magnetic field quantity' },
      { term: 'Area', definition: 'Cross-sectional area in m²' },
    ],
    keyFacts: [
      'The standard formula is B = Φ / A.',
      'Flux density increases when area decreases for fixed flux.',
    ],
  };

  it('extracts a symbolic formula from prose and uses it in fallback formula-build', () => {
    const plan: Plan = {
      slotId: 'slot-1',
      gameType: 'formula-build',
      rationale: 'ordering slot',
      contentSource: 'facts',
    };

    const content = __testFallbackGameFromDigest(plan, digest);
    if (content.breakType !== 'game' || content.gameType !== 'formula-build') {
      throw new Error('Expected formula-build content');
    }

    expect(content.correctSequence).toEqual(['B', '=', 'Φ', '/', 'A']);
    expect(content.tokens.length).toBeGreaterThan(content.correctSequence.length);
    expect(content.tokens.join(' ')).not.toContain('standard');
    expect(content.tokens.join(' ')).not.toContain('formula');
  });

  it('rejects sentence-fragment formula payloads', () => {
    const errors = __testValidateGameSchemaAndContent(
      'formula-build',
      {
        breakType: 'game',
        gameType: 'formula-build',
        prompt: 'Build the target formula from the tokens.',
        tokens: ['The', 'Electromagnetism', 'Magnetic', 'nda', 'mul', 'sta', 'for', 'rd'],
        correctSequence: ['The', 'sta', 'nda', 'rd', 'for', 'mul'],
        timerSeconds: 11,
      },
      digest
    );

    expect(errors).toContain('formula-build correctSequence must be a valid symbolic formula');
    expect(errors).toContain('formula-build tokens must only contain formula symbols/operators');
  });
});
