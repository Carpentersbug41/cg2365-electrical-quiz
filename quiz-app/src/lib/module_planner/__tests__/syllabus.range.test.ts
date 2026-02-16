import { describe, expect, it } from 'vitest';
import { extractCanonicalStructureFromText } from '@/lib/module_planner/syllabus';

describe('syllabus range extraction', () => {
  it('stores AC-specific range on AC5 and not on AC1-AC4', () => {
    const text = [
      'Unit 202',
      'LO5 Alternating current quantities',
      '1. Identify RMS values',
      '2. Identify average values',
      '3. Identify peak-to-peak values',
      '4. Identify periodic time',
      '5. Explain waveform measurements',
      'Range:',
      '- RMS',
      '- average',
      '- peak-to-peak',
      '- periodic time',
      '- frequency',
      '- amplitude',
    ].join('\n');

    const parsed = extractCanonicalStructureFromText(text);
    expect(parsed.structures.length).toBe(1);

    const lo5 = parsed.structures[0].los.find((lo) => lo.loNumber === '5');
    expect(lo5).toBeTruthy();
    if (!lo5) return;

    const ac1 = lo5.acs.find((ac) => ac.acNumber === '1');
    const ac2 = lo5.acs.find((ac) => ac.acNumber === '2');
    const ac3 = lo5.acs.find((ac) => ac.acNumber === '3');
    const ac4 = lo5.acs.find((ac) => ac.acNumber === '4');
    const ac5 = lo5.acs.find((ac) => ac.acNumber === '5');

    expect(ac1?.range).toBeUndefined();
    expect(ac2?.range).toBeUndefined();
    expect(ac3?.range).toBeUndefined();
    expect(ac4?.range).toBeUndefined();
    expect(ac5?.range).toEqual(['RMS', 'average', 'peak-to-peak', 'periodic time', 'frequency', 'amplitude']);
  });
});

