import crypto from 'crypto';
import zlib from 'zlib';
import chunksData from '@/lib/syllabus/chunks.json';
import { SyllabusChunk } from '@/lib/syllabus/syllabusChunker';
import {
  CanonicalAc,
  CanonicalLo,
  CanonicalUnitStructure,
  RetrievedChunkRecord,
  SyllabusChunkAnchor,
  SyllabusChunkRow,
} from './types';
import {
  getSyllabusStructureByVersionAndUnit,
  listSyllabusChunksByVersion,
  listSyllabusStructuresByVersion,
  listSyllabusVersions as listSyllabusVersionsInDb,
  insertSyllabusChunks,
  createSyllabusVersion,
  upsertSyllabusStructure,
  getSyllabusVersionById,
} from './db';

const legacyChunks = chunksData as SyllabusChunk[];

export function normalizeLo(lo: string): string {
  const m = lo.trim().match(/^LO?\s*(\d+)$/i);
  if (!m) return lo.trim().toUpperCase();
  return `LO${m[1]}`;
}

export function getLoNumber(lo: string): number {
  const n = Number.parseInt(normalizeLo(lo).replace(/^LO/i, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

export function compareLoTag(a: string, b: string): number {
  return getLoNumber(a) - getLoNumber(b);
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function computeContentHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function decodePdfEscapes(value: string): string {
  return value
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
}

export function extractTextFromPdfBuffer(buffer: Buffer): string {
  const raw = buffer.toString('latin1');
  const out: string[] = [];

  const singleRegex = /\(([^()]*)\)\s*Tj/g;
  let singleMatch: RegExpExecArray | null;
  while ((singleMatch = singleRegex.exec(raw)) !== null) {
    out.push(decodePdfEscapes(singleMatch[1]));
  }

  const arrayRegex = /\[([\s\S]*?)\]\s*TJ/gm;
  let arrayMatch: RegExpExecArray | null;
  while ((arrayMatch = arrayRegex.exec(raw)) !== null) {
    const group = arrayMatch[1];
    const strings = [...group.matchAll(/\(([^()]*)\)/g)].map((m) => decodePdfEscapes(m[1]));
    if (strings.length > 0) {
      out.push(strings.join(' '));
    }
  }

  if (out.length > 0) {
    return out.join('\n');
  }

  return raw
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

interface ZipCentralEntry {
  fileName: string;
  compressionMethod: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
}

function readUInt16LE(buffer: Buffer, offset: number): number {
  return buffer.readUInt16LE(offset);
}

function readUInt32LE(buffer: Buffer, offset: number): number {
  return buffer.readUInt32LE(offset);
}

function parseZipCentralDirectory(buffer: Buffer): ZipCentralEntry[] {
  const entries: ZipCentralEntry[] = [];
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) return [];

  const centralOffset = readUInt32LE(buffer, eocdOffset + 16);
  const total = readUInt16LE(buffer, eocdOffset + 10);
  let cursor = centralOffset;

  for (let i = 0; i < total; i += 1) {
    if (cursor + 46 > buffer.length) break;
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) break;

    const compressionMethod = readUInt16LE(buffer, cursor + 10);
    const compressedSize = readUInt32LE(buffer, cursor + 20);
    const uncompressedSize = readUInt32LE(buffer, cursor + 24);
    const fileNameLength = readUInt16LE(buffer, cursor + 28);
    const extraLength = readUInt16LE(buffer, cursor + 30);
    const commentLength = readUInt16LE(buffer, cursor + 32);
    const localHeaderOffset = readUInt32LE(buffer, cursor + 42);
    const nameStart = cursor + 46;
    const nameEnd = nameStart + fileNameLength;
    const fileName = buffer.slice(nameStart, nameEnd).toString('utf8');

    entries.push({
      fileName,
      compressionMethod,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
    });

    cursor = nameEnd + extraLength + commentLength;
  }

  return entries;
}

export function extractTextFromDocxBuffer(buffer: Buffer): string {
  const entries = parseZipCentralDirectory(buffer);
  const documentEntry = entries.find((entry) => entry.fileName === 'word/document.xml');
  if (!documentEntry) {
    return '';
  }

  const localOffset = documentEntry.localHeaderOffset;
  if (localOffset + 30 >= buffer.length || buffer.readUInt32LE(localOffset) !== 0x04034b50) {
    return '';
  }

  const fileNameLength = readUInt16LE(buffer, localOffset + 26);
  const extraLength = readUInt16LE(buffer, localOffset + 28);
  const dataStart = localOffset + 30 + fileNameLength + extraLength;
  const dataEnd = dataStart + documentEntry.compressedSize;
  const compressed = buffer.slice(dataStart, dataEnd);

  let xml = '';
  if (documentEntry.compressionMethod === 0) {
    xml = compressed.toString('utf8');
  } else if (documentEntry.compressionMethod === 8) {
    xml = zlib.inflateRawSync(compressed).toString('utf8');
  }

  if (!xml) return '';

  return xml
    .replace(/<w:p[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}

export function cleanExtractedText(raw: string): string {
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').map((line) => line.replace(/\s+/g, ' ').trim());

  const freq = new Map<string, number>();
  lines.forEach((line) => {
    if (line.length >= 4 && line.length <= 120) {
      freq.set(line, (freq.get(line) ?? 0) + 1);
    }
  });

  const repeated = new Set<string>(
    Array.from(freq.entries())
      .filter(([, count]) => count >= 3)
      .map(([line]) => line)
  );

  const filtered = lines
    .filter((line) => line.length > 0)
    .filter((line) => !repeated.has(line))
    .map((line) => line.replace(/(\w+)-\s*$/g, '$1'));

  return filtered.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function splitByHeadings(cleanedText: string): Array<{ heading: string | null; text: string }> {
  const lines = cleanedText.split('\n');
  const blocks: Array<{ heading: string | null; text: string }> = [];
  let currentHeading: string | null = null;
  let current: string[] = [];

  function flush() {
    if (current.length === 0) return;
    blocks.push({ heading: currentHeading, text: current.join('\n').trim() });
    current = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(Unit\s+\d+|LO\s*\d+|Learning Outcome\s+\d+)/i);
    if (headingMatch) {
      flush();
      currentHeading = line;
      current.push(line);
      continue;
    }
    current.push(line);
  }

  flush();
  return blocks.filter((block) => block.text.length > 0);
}

export function buildDeterministicChunks(cleanedText: string): Array<{ text: string; anchor: SyllabusChunkAnchor }> {
  const blocks = splitByHeadings(cleanedText);
  const chunks: Array<{ text: string; anchor: SyllabusChunkAnchor }> = [];

  const minChars = 4200;
  const maxChars = 7000;
  const overlapChars = 700;

  for (const block of blocks) {
    const headingPath = block.heading ? [block.heading] : [];
    const unitGuessMatch = block.text.match(/\bUnit\s*(\d+)\b/i);
    const loGuessMatch = block.text.match(/\bLO\s*(\d+)\b/i);
    const unitGuess = unitGuessMatch ? unitGuessMatch[1] : null;
    const loGuess = loGuessMatch ? `LO${loGuessMatch[1]}` : null;

    if (block.text.length <= maxChars) {
      chunks.push({
        text: block.text,
        anchor: {
          pageStart: null,
          pageEnd: null,
          headingPath,
          unitGuess,
          loGuess,
        },
      });
      continue;
    }

    let start = 0;
    while (start < block.text.length) {
      const end = Math.min(block.text.length, start + maxChars);
      let slice = block.text.slice(start, end);
      if (slice.length < minChars && end < block.text.length) {
        slice = block.text.slice(start, Math.min(block.text.length, start + minChars));
      }
      chunks.push({
        text: slice.trim(),
        anchor: {
          pageStart: null,
          pageEnd: null,
          headingPath,
          unitGuess,
          loGuess,
        },
      });
      if (end >= block.text.length) break;
      start = Math.max(0, end - overlapChars);
    }
  }

  return chunks;
}

function parseAcLine(line: string): string | null {
  const m = line.match(/^((?:AC\s*)?\d+(?:\.\d+)?)[\).:\-\s]+(.+)$/i);
  if (m) {
    return normalizeWhitespace(m[2]);
  }
  return null;
}

function acKey(unit: string, loNumber: string, acNumber: string): string {
  return `${unit}.LO${loNumber}.AC${acNumber}`;
}

export function extractCanonicalStructureFromText(cleanedText: string): {
  structures: CanonicalUnitStructure[];
  confidence: number;
} {
  const lines = cleanedText.split('\n').map((line) => line.trim()).filter(Boolean);
  const unitMap = new Map<string, CanonicalUnitStructure>();

  let currentUnit = '';
  let currentLo: CanonicalLo | null = null;

  for (const line of lines) {
    const unitMatch = line.match(/^Unit\s*(\d+)\b/i);
    if (unitMatch) {
      currentUnit = unitMatch[1];
      if (!unitMap.has(currentUnit)) {
        unitMap.set(currentUnit, { unit: currentUnit, los: [] });
      }
      currentLo = null;
      continue;
    }

    const loMatch = line.match(/^(?:LO|Learning Outcome)\s*(\d+)\b[\s:\-]*([^\n]+)?/i);
    if (loMatch && currentUnit) {
      const loNumber = loMatch[1];
      const title = loMatch[2] ? normalizeWhitespace(loMatch[2]) : undefined;
      const lo: CanonicalLo = {
        loNumber,
        title,
        acs: [],
      };
      unitMap.get(currentUnit)?.los.push(lo);
      currentLo = lo;
      continue;
    }

    if (!currentUnit || !currentLo) continue;
    const parsedAc = parseAcLine(line);
    if (!parsedAc) continue;

    const acNumberMatch = line.match(/^((?:AC\s*)?\d+(?:\.\d+)?)/i);
    const acNumber = acNumberMatch ? acNumberMatch[1].replace(/^AC\s*/i, '') : `${currentLo.acs.length + 1}`;

    currentLo.acs.push({
      acNumber,
      text: parsedAc,
      acKey: acKey(currentUnit, currentLo.loNumber, acNumber),
    });
  }

  const structures = Array.from(unitMap.values()).sort((a, b) => Number(a.unit) - Number(b.unit));
  const loCount = structures.reduce((sum, unit) => sum + unit.los.length, 0);
  const acCount = structures.reduce((sum, unit) => sum + unit.los.reduce((loSum, lo) => loSum + lo.acs.length, 0), 0);
  const confidence = loCount === 0 ? 0 : Math.min(1, acCount / Math.max(1, loCount * 2));

  return { structures, confidence };
}

export function validateCanonicalStructure(structure: CanonicalUnitStructure): string[] {
  const errors: string[] = [];
  const seenLo = new Set<string>();
  const seenAc = new Set<string>();

  for (const lo of structure.los) {
    if (seenLo.has(lo.loNumber)) {
      errors.push(`Duplicate LO number ${lo.loNumber} in unit ${structure.unit}`);
    }
    seenLo.add(lo.loNumber);

    if (lo.acs.length === 0) {
      errors.push(`LO${lo.loNumber} has no AC entries`);
    }

    for (const ac of lo.acs) {
      if (seenAc.has(ac.acKey)) {
        errors.push(`Duplicate AC key ${ac.acKey}`);
      }
      seenAc.add(ac.acKey);
    }
  }

  return errors;
}

export function parseAssessmentCriteriaFromContent(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const criteria: string[] = [];
  let inAcBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^\*\*(Assessment criteria|AC)\*\*/i.test(line)) {
      inAcBlock = true;
      continue;
    }

    if (inAcBlock && /^\*\*Range/i.test(line)) {
      break;
    }

    if (!inAcBlock) continue;

    const numbered = line.match(/^\d+(?:\.\d+)?\.\s*(.+)$/);
    if (numbered) {
      criteria.push(normalizeWhitespace(numbered[1]));
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet && criteria.length > 0) {
      criteria[criteria.length - 1] = `${criteria[criteria.length - 1]} ${normalizeWhitespace(bullet[1])}`;
    }
  }

  return criteria;
}

export function parseRangeFromContent(content: string): string | null {
  const lines = content.split(/\r?\n/);
  const rangeLines: string[] = [];
  let inRange = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inRange && rangeLines.length > 0) break;
      continue;
    }

    if (/^\*\*Range/i.test(line)) {
      inRange = true;
      const inline = line.replace(/^\*\*Range[^*]*\*\*: ?/i, '').trim();
      if (inline.length > 0) {
        rangeLines.push(inline);
      }
      continue;
    }

    if (!inRange) continue;

    if (line.startsWith('---')) break;
    if (line.startsWith('**') && !line.toLowerCase().startsWith('**range')) break;

    if (/^-\s+/.test(line)) {
      rangeLines.push(line.replace(/^-\s+/, '').trim());
      continue;
    }
    rangeLines.push(line);
  }

  if (rangeLines.length === 0) return null;
  return normalizeWhitespace(rangeLines.join(' | '));
}

export function toRetrievedChunkRecords(source: SyllabusChunkRow[]): RetrievedChunkRecord[] {
  return source.map((chunk) => {
    const loGuess = chunk.anchor_json.loGuess ?? 'LO0';
    const learningOutcome = normalizeLo(loGuess);
    const loTitleLine = chunk.text.split('\n').find((line) => /^(LO|Learning Outcome)\s*\d+/i.test(line));
    return {
      id: chunk.id,
      unit: chunk.anchor_json.unitGuess ?? '000',
      unitTitle: `Unit ${chunk.anchor_json.unitGuess ?? ''}`.trim(),
      learningOutcome,
      loTitle: loTitleLine ?? learningOutcome,
      assessmentCriteria: parseAssessmentCriteriaFromContent(chunk.text),
      content: chunk.text,
      pageStart: chunk.anchor_json.pageStart ?? null,
      pageEnd: chunk.anchor_json.pageEnd ?? null,
    };
  });
}

export function serializeRetrievedChunkRecords(records: RetrievedChunkRecord[]): string {
  return JSON.stringify(records);
}

export function deserializeRetrievedChunkRecords(value: string): RetrievedChunkRecord[] {
  if (!value || value.trim().length === 0) return [];
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item) => item as Partial<RetrievedChunkRecord>)
    .filter((item) => Boolean(item.id && item.unit && item.learningOutcome && item.content))
    .map((item) => ({
      id: String(item.id),
      unit: String(item.unit),
      unitTitle: String(item.unitTitle ?? ''),
      learningOutcome: normalizeLo(String(item.learningOutcome)),
      loTitle: String(item.loTitle ?? ''),
      assessmentCriteria: Array.isArray(item.assessmentCriteria)
        ? item.assessmentCriteria.map((criterion) => String(criterion))
        : [],
      content: String(item.content),
      pageStart: typeof item.pageStart === 'number' ? item.pageStart : null,
      pageEnd: typeof item.pageEnd === 'number' ? item.pageEnd : null,
    }));
}

export async function getAllUnits(versionId: string): Promise<string[]> {
  const structures = await listSyllabusStructuresByVersion(versionId);
  return structures.map((item) => item.unit).sort();
}

export async function getUnitLos(versionId: string, unit: string): Promise<string[]> {
  const structure = await getSyllabusStructureByVersionAndUnit(versionId, unit);
  if (!structure) return [];
  return structure.structure_json.los.map((lo) => `LO${lo.loNumber}`).sort(compareLoTag);
}

export async function getChunksForUnitLO(
  versionId: string,
  unit: string,
  loNumber: string,
  limit: number
): Promise<SyllabusChunkRow[]> {
  const chunks = await listSyllabusChunksByVersion(versionId);
  const normalizedLo = normalizeLo(loNumber);

  const direct = chunks.filter(
    (chunk) =>
      String(chunk.anchor_json.unitGuess ?? '').replace(/\D/g, '') === unit.replace(/\D/g, '') &&
      normalizeLo(chunk.anchor_json.loGuess ?? '') === normalizedLo
  );

  if (direct.length > 0) return direct.slice(0, limit);

  const loNumeric = getLoNumber(normalizedLo);
  const patterns = [
    new RegExp(`\\bUnit\\s*${unit}\\b`, 'i'),
    new RegExp(`\\bLO\\s*${loNumeric}\\b`, 'i'),
    new RegExp(`\\b${unit}\\.${loNumeric}\\b`, 'i'),
  ];

  const scored = chunks
    .map((chunk) => {
      const score = patterns.reduce((acc, pattern) => acc + (pattern.test(chunk.text) ? 1 : 0), 0);
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.ordinal - b.chunk.ordinal)
    .slice(0, limit)
    .map((item) => item.chunk);

  return scored;
}

export async function getChunksByIds(versionId: string, ids: string[]): Promise<SyllabusChunkRow[]> {
  const chunks = await listSyllabusChunksByVersion(versionId);
  const set = new Set(ids);
  return chunks.filter((chunk) => set.has(chunk.id));
}

export async function getChunkById(versionId: string, id: string): Promise<SyllabusChunkRow | null> {
  const chunks = await listSyllabusChunksByVersion(versionId);
  return chunks.find((chunk) => chunk.id === id) ?? null;
}

export async function seedLegacyChunksAsDefaultVersionIfNeeded(): Promise<string | null> {
  const existing = await listSyllabusVersionsInDb();
  if (existing.length > 0) {
    return existing[0].id;
  }

  const raw = legacyChunks.map((chunk) => chunk.content).join('\n\n');
  const cleaned = cleanExtractedText(raw);
  const version = await createSyllabusVersion({
    filename: 'legacy-chunks.json',
    contentHash: computeContentHash(cleaned),
    metaJson: {
      source: 'seed',
      seededFrom: 'src/lib/syllabus/chunks.json',
    },
  });

  const chunkRows = legacyChunks.map((chunk, index) => ({
    ordinal: index,
    text: chunk.content,
    anchorJson: {
      pageStart: index + 1,
      pageEnd: index + 1,
      headingPath: [chunk.unitTitle, chunk.loTitle],
      unitGuess: chunk.unit,
      loGuess: normalizeLo(chunk.learningOutcome),
    } satisfies SyllabusChunkAnchor,
  }));

  await insertSyllabusChunks(version.id, chunkRows);

  const byUnit = new Map<string, CanonicalUnitStructure>();
  for (const chunk of legacyChunks) {
    const unit = chunk.unit;
    const loNumber = String(getLoNumber(chunk.learningOutcome));
    if (!byUnit.has(unit)) {
      byUnit.set(unit, { unit, los: [] });
    }
    const acs: CanonicalAc[] = (chunk.assessmentCriteria ?? []).map((text, i) => ({
      acNumber: `${loNumber}.${i + 1}`,
      text,
      acKey: `${unit}.LO${loNumber}.AC${loNumber}.${i + 1}`,
    }));
    byUnit.get(unit)?.los.push({
      loNumber,
      title: chunk.loTitle,
      acs,
    });
  }

  for (const [unit, structure] of byUnit.entries()) {
    await upsertSyllabusStructure({ syllabusVersionId: version.id, unit, structureJson: structure });
  }

  return version.id;
}

export async function ensureSyllabusVersionExists(versionId: string): Promise<void> {
  const version = await getSyllabusVersionById(versionId);
  if (!version) {
    throw new Error(`Syllabus version not found: ${versionId}`);
  }
}

export async function listSyllabusVersions() {
  return listSyllabusVersionsInDb();
}
