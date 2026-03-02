import { describe, expect, it } from 'vitest';
import {
  __testFallbackGameFromDigest,
  __testValidateGameSchemaAndContent,
  LessonDigest,
  Plan,
} from '../gameGenerator';

describe('gameGenerator classify-two-bins safeguards', () => {
  const digest: LessonDigest = {
    vocabPairs: [
      { term: 'Radial Circuit', definition: 'Single branch from source to load without loop return.' },
      { term: 'Line Conductor', definition: 'Carries power from source to load.' },
      { term: 'Neutral Conductor', definition: 'Returns current to source in normal operation.' },
      { term: 'OCPD', definition: 'Trips on overload or short circuit.' },
      { term: 'RCD', definition: 'Trips on earth leakage imbalance.' },
      { term: 'CPC', definition: 'Protective conductor path during fault conditions.' },
    ],
    keyFacts: [
      'A cooker circuit is typically a dedicated radial circuit.',
      'The line conductor carries energy to the load.',
      'The neutral conductor provides the return path in normal operation.',
      'OCPD provides overcurrent protection.',
      'RCD detects earth-leakage imbalance.',
    ],
    misconceptions: [
      'A cooker circuit must be part of the kitchen socket ring.',
      'Radial means the wiring forms a complete loop.',
      'An RCD is the same as overcurrent protection.',
    ],
  };

  it('rejects generic term/definition bins and obvious format split', () => {
    const errors = __testValidateGameSchemaAndContent(
      'classify-two-bins',
      {
        breakType: 'game',
        gameType: 'classify-two-bins',
        leftLabel: 'Term',
        rightLabel: 'Definition',
        items: [
          { text: 'Radial Circuit', correctBin: 'left' },
          { text: 'A wiring topology where the circuit cable runs from the consumer unit to the final appliance without forming a continuous loop back to origin.', correctBin: 'right' },
          { text: 'Line Conductor', correctBin: 'left' },
          { text: 'The conductor that is normally energized and carries electrical power from source to load.', correctBin: 'right' },
          { text: 'Neutral Conductor', correctBin: 'left' },
          { text: 'The conductor that provides the return path for current to the source under normal operating conditions.', correctBin: 'right' },
        ],
      },
      digest
    );

    expect(errors).toContain('classify-two-bins labels must not be generic term/definition-style labels');
    expect(errors).toContain('classify-two-bins must not rely on obvious format split (short terms vs long definitions)');
  });

  it('fallback classify builder does not emit generic bins', () => {
    const plan: Plan = {
      slotId: 'slot-1',
      gameType: 'classify-two-bins',
      rationale: 'classification slot',
      contentSource: 'misconception',
    };

    const content = __testFallbackGameFromDigest(plan, digest);
    if (content.breakType !== 'game' || content.gameType !== 'classify-two-bins') {
      throw new Error('Expected classify-two-bins content');
    }

    expect(['term', 'definition']).not.toContain(content.leftLabel.toLowerCase());
    expect(['term', 'definition']).not.toContain(content.rightLabel.toLowerCase());
    expect(content.items).toHaveLength(6);
    expect(content.items.some(i => i.text.length > 110)).toBe(false);
  });

  it('rejects truncated and correction-style misconception items', () => {
    const errors = __testValidateGameSchemaAndContent(
      'classify-two-bins',
      {
        breakType: 'game',
        gameType: 'classify-two-bins',
        leftLabel: 'Accurate Statement',
        rightLabel: 'Misconception',
        items: [
          { text: 'A cooker circuit is typically a dedicated radial circuit...', correctBin: 'left' },
          { text: 'The line conductor carries energy to the load.', correctBin: 'left' },
          { text: 'The neutral conductor provides the return path in normal operation.', correctBin: 'left' },
          { text: 'A cooker circuit must be part of the kitchen socket ring.', correctBin: 'right' },
          { text: 'Radial means the wiring forms a complete loop.', correctBin: 'right' },
          { text: 'While it uses less standby power, it is less secure because it cannot detect a broken wire.', correctBin: 'right' },
        ],
      },
      digest
    );

    expect(errors).toContain('classify-two-bins items must be complete statements, not truncated with ellipses');
    expect(errors).toContain('classify-two-bins misconception bin includes correction-style statements');
  });
});
