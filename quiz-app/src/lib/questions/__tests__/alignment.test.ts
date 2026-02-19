import { describe, expect, test } from 'vitest';
import { evaluateQuestionAlignment } from '../alignment';

describe('evaluateQuestionAlignment', () => {
  test('passes when question overlaps LO/AC scope', () => {
    const result = evaluateQuestionAlignment({
      stem: 'Which roof load-bearing check is required before installing a domestic solar PV array?',
      options: [
        'Confirm roof structure can support panel and wind load',
        'Check cooker circuit polarity only',
        'Measure RCD trip time',
        'Verify Ze at intake only',
      ],
      correct: 'Confirm roof structure can support panel and wind load',
      context: {
        lo_code: 'LO6',
        lo_text: 'Micro-renewable energies',
        ac_code: '6.2',
        ac_text: 'Assess structural and regulatory requirements for domestic roof-mounted solar photovoltaic systems',
        range_notes: 'roof loading, planning constraints, installation suitability',
      },
    });

    expect(result.pass).toBe(true);
  });

  test('fails when question drifts to unrelated testing sequence topic', () => {
    const result = evaluateQuestionAlignment({
      stem: 'Which dead test is performed immediately after ring continuity?',
      options: ['Insulation resistance', 'PFC', 'Functional testing', 'RCD test'],
      correct: 'Insulation resistance',
      context: {
        lo_code: 'LO6',
        lo_text: 'Micro-renewable energies',
        ac_code: '6.2',
        ac_text: 'Assess structural and regulatory requirements for domestic roof-mounted solar photovoltaic systems',
        range_notes: 'roof loading, planning constraints, installation suitability',
      },
    });

    expect(result.pass).toBe(false);
  });

  test('passes broad AC when LO/range overlap exists in options/answer context', () => {
    const result = evaluateQuestionAlignment({
      stem: 'Which technology uses a collector to heat domestic hot water?',
      options: ['Solar thermal', 'Nuclear fission', 'Coal boiler', 'Diesel generator'],
      correct: 'Solar thermal',
      context: {
        lo_code: 'LO6',
        lo_text: 'Micro-renewable energies',
        ac_code: '6.1',
        ac_text: 'Describe types of micro-renewable energy',
        range_notes: 'solar thermal; air-source heat pump; biomass; solar PV; micro-wind; micro-hydro',
      },
    });

    expect(result.pass).toBe(true);
  });
});
