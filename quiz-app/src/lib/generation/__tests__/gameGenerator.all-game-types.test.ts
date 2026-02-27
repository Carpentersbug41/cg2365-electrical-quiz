import { describe, expect, it } from 'vitest';
import { GameType } from '@/data/lessons/types';
import {
  __testFallbackGameFromDigest,
  __testValidateGameSchemaAndContent,
  LessonDigest,
  Plan,
} from '../gameGenerator';

const ALL_GAME_TYPES: GameType[] = [
  'matching',
  'sorting',
  'spot-error',
  'tap-label',
  'quick-win',
  'sequencing',
  'fill-gap',
  'is-correct-why',
  'diagnosis-ranked',
  'classify-two-bins',
  'scenario-match',
  'formula-build',
  'tap-the-line',
  'tap-the-word',
  'elimination',
];

const RICH_DIGEST: LessonDigest = {
  vocabPairs: [
    { term: 'Oscillation', definition: 'Repeated motion around an equilibrium point.' },
    { term: 'Displacement', definition: 'Distance from equilibrium at a given moment.' },
    { term: 'Amplitude', definition: 'Maximum displacement from equilibrium.' },
    { term: 'Frequency', definition: 'Number of oscillations each second.' },
    { term: 'Wavelength', definition: 'Distance between repeating points on a wave.' },
    { term: 'Medium', definition: 'Material that allows a wave disturbance to travel.' },
    { term: 'RCD', definition: 'Trips when leakage current imbalance is detected.' },
    { term: 'OCPD', definition: 'Protective device that interrupts excessive current.' },
  ],
  keyFacts: [
    'Wave speed can be calculated using v = f * λ.',
    'Particles in a medium oscillate about fixed positions.',
    'A wave transfers energy without bulk transfer of matter.',
    'Higher frequency means more oscillations per second.',
    'Amplitude relates to wave energy in many contexts.',
    'A radial circuit runs from source to load without loop return.',
    'An RCD protects against electric shock from leakage faults.',
    'An OCPD protects against overload and short-circuit current.',
    'Like poles repel and unlike poles attract.',
    'Magnetic flux density can be written as B = Φ / A.',
  ],
  procedures: [
    'Isolate supply and verify dead.',
    'Select the correct instrument range.',
    'Connect probes to the required test points.',
    'Perform the measurement and record value.',
    'Compare result against expected limits.',
    'Restore installation to safe operating state.',
  ],
  misconceptions: [
    'A wave carries particles of the medium forward with it.',
    'An RCD and OCPD provide identical protection functions.',
    'Radial circuits always form a complete loop path.',
  ],
  diagram: {
    id: 'diag-1',
    labels: ['Supply', 'Load', 'Switch', 'Fuse'],
    imageUrl: '/images/lessons/wave-diagram.png',
  },
};

describe('gameGenerator all game types fallback validity', () => {
  it('produces valid fallback content for every supported game type', () => {
    for (const gameType of ALL_GAME_TYPES) {
      const plan: Plan = {
        slotId: `slot-${gameType}`,
        gameType,
        rationale: `fallback validation for ${gameType}`,
        contentSource: 'facts',
      };

      const content = __testFallbackGameFromDigest(plan, RICH_DIGEST);
      const errors = __testValidateGameSchemaAndContent(gameType, content, RICH_DIGEST);

      expect(
        errors,
        `expected no validation errors for ${gameType}, received: ${errors.join(' | ')}`,
      ).toEqual([]);
    }
  });
});
