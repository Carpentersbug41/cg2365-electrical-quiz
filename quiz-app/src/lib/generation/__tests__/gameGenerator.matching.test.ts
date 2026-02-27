import { describe, expect, it } from 'vitest';
import {
  __testFallbackGameFromDigest,
  __testValidateGameSchemaAndContent,
  LessonDigest,
  Plan,
} from '../gameGenerator';

function normalizeForContainment(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsTerm(definition: string, term: string): boolean {
  return normalizeForContainment(definition).includes(normalizeForContainment(term));
}

describe('gameGenerator matching safeguards', () => {
  const digest: LessonDigest = {
    vocabPairs: [
      {
        term: 'Oscillation',
        definition: 'Oscillation is repetitive motion around an equilibrium position.',
      },
      {
        term: 'Displacement',
        definition: 'Displacement is the distance from the resting point.',
      },
      {
        term: 'Energy Transfer',
        definition: 'Movement of energy through a system without moving matter overall.',
      },
      {
        term: 'Medium',
        definition: 'Physical substance that allows the disturbance to travel.',
      },
    ],
    keyFacts: [
      'Particles in a medium oscillate around fixed positions.',
      'Wave speed depends on properties of the medium.',
      'A wave transfers energy from one place to another.',
      'Displacement can be measured from the equilibrium line.',
      'Frequency describes how often oscillation repeats each second.',
      'Amplitude is the maximum displacement from equilibrium.',
    ],
  };

  it('rejects matching payloads where definition contains the target term', () => {
    const errors = __testValidateGameSchemaAndContent(
      'matching',
      {
        breakType: 'game',
        gameType: 'matching',
        duration: 90,
        pairs: [
          { left: 'Oscillation', right: 'Oscillation is repetitive motion around equilibrium.' },
          { left: 'Displacement', right: 'Distance from the resting position.' },
          { left: 'Medium', right: 'Substance that carries the wave disturbance.' },
          { left: 'Energy Transfer', right: 'Process by which energy moves through a system.' },
        ],
      },
      digest
    );

    expect(errors).toContain('matching definitions must not include the target term text');
  });

  it('fallback matching avoids term-in-definition leakage', () => {
    const plan: Plan = {
      slotId: 'slot-1',
      gameType: 'matching',
      rationale: 'classification slot',
      contentSource: 'vocab',
    };

    const content = __testFallbackGameFromDigest(plan, digest);
    if (content.breakType !== 'game' || content.gameType !== 'matching') {
      throw new Error('Expected matching content');
    }

    expect(content.pairs.length).toBeGreaterThanOrEqual(4);
    expect(content.pairs.some((pair) => containsTerm(pair.right, pair.left))).toBe(false);
  });
});
