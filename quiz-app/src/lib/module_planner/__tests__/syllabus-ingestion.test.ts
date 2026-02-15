import { describe, expect, it } from 'vitest';
import {
  buildDeterministicChunks,
  cleanExtractedText,
  extractCanonicalStructureFromText,
  validateCanonicalStructure,
} from '@/lib/module_planner/syllabus';

describe('syllabus ingestion utilities', () => {
  it('cleans repeated headers and hyphenation stably', () => {
    const raw = [
      'City & Guilds 2365',
      'Unit 210',
      'Learning out-',
      'come details',
      'City & Guilds 2365',
      'Unit 210',
      'AC1.1 Explain signalling principles',
      'City & Guilds 2365',
      'Unit 210',
      'AC1.2 Describe safe communication protocols',
    ].join('\n');

    const cleanedA = cleanExtractedText(raw);
    const cleanedB = cleanExtractedText(raw);

    expect(cleanedA).toBe(cleanedB);
    expect(cleanedA.toLowerCase()).not.toContain('city & guilds 2365');
    expect(cleanedA.toLowerCase()).toContain('learning out');
  });

  it('builds deterministic chunks with anchor metadata', () => {
    const text = [
      'Unit 210 Communication',
      'LO1 Understand communications',
      'AC1.1 Explain analogue signalling',
      ''.padEnd(9000, 'A'),
    ].join('\n');

    const chunks = buildDeterministicChunks(text);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].anchor.unitGuess).toBe('210');
    expect(chunks[0].anchor.loGuess).toBe('LO1');
    expect(Array.isArray(chunks[0].anchor.headingPath)).toBe(true);
  });

  it('extracts canonical unit->LO->AC structure and validates uniqueness', () => {
    const text = [
      'Unit 210 Communication',
      'LO1 Understand signalling',
      '1.1 Explain analogue signalling',
      '1.2 Explain digital signalling',
      'LO2 Understand protocols',
      '2.1 Describe protocol handshakes',
    ].join('\n');

    const { structures, confidence } = extractCanonicalStructureFromText(text);
    expect(confidence).toBeGreaterThan(0);
    expect(structures.length).toBe(1);
    expect(structures[0].unit).toBe('210');
    expect(structures[0].los.length).toBe(2);
    expect(structures[0].los[0].acs.length).toBe(2);

    const errors = validateCanonicalStructure(structures[0]);
    expect(errors).toEqual([]);
  });
});
