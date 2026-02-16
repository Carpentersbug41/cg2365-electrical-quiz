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

  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex += 1) {
    const block = blocks[blockIndex];
    const headingPath = block.heading ? [block.heading] : [];
    const unitGuessMatch = block.text.match(/\bUnit\s*(\d+)\b/i);
    const loGuessMatch = block.text.match(/\bLO\s*(\d+)\b/i);
    const unitGuess = unitGuessMatch ? unitGuessMatch[1] : null;
    let loGuess = loGuessMatch ? `LO${loGuessMatch[1]}` : null;

    // If a unit-only intro block appears before the first LO block, inherit the nearest
    // following LO within the same unit so anchor metadata stays useful and deterministic.
    if (!loGuess && unitGuess) {
      for (let nextIndex = blockIndex + 1; nextIndex < blocks.length; nextIndex += 1) {
        const nextBlock = blocks[nextIndex];
        const nextUnitMatch = nextBlock.text.match(/\bUnit\s*(\d+)\b/i);
        const nextUnitGuess = nextUnitMatch ? nextUnitMatch[1] : null;
        if (nextUnitGuess && nextUnitGuess !== unitGuess) break;
        const nextLoMatch = nextBlock.text.match(/\bLO\s*(\d+)\b/i);
        if (nextLoMatch) {
          loGuess = `LO${nextLoMatch[1]}`;
          break;
        }
      }
    }

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

function parseRangeItemsFromLine(line: string): string[] {
  const cleaned = line
    .replace(/^\*\*?\s*/g, '')
    .replace(/^Range\s*:?/i, '')
    .replace(/^[-•]\s*/, '')
    .trim();
  if (!cleaned) return [];
  const byPrimaryDelimiter = cleaned.split(/[;|]/).map((item) => normalizeWhitespace(item)).filter(Boolean);
  const source = byPrimaryDelimiter.length > 1 ? byPrimaryDelimiter : [cleaned];
  const expanded = source.flatMap((item) => {
    if (item.includes(',') && !item.match(/\b(e\.g\.|i\.e\.)\b/i)) {
      return item.split(',').map((part) => normalizeWhitespace(part)).filter(Boolean);
    }
    return [item];
  });
  return Array.from(new Set(expanded)).filter((item) => item.length > 0);
}

function normalizeAcNumberToken(value: string): string {
  return value.replace(/^AC\s*/i, '').trim();
}

function appendLoRange(lo: CanonicalLo, items: string[]): void {
  if (items.length === 0) return;
  lo.range = Array.from(new Set([...(Array.isArray(lo.range) ? lo.range : []), ...items]));
}

function appendAcRange(ac: CanonicalAc, items: string[]): void {
  if (items.length === 0) return;
  const existing = Array.isArray(ac.range)
    ? ac.range
    : typeof ac.range === 'string'
      ? parseRangeItemsFromLine(ac.range)
      : [];
  ac.range = Array.from(new Set([...existing, ...items]));
}

function getAcRangeTargetFromLine(lo: CanonicalLo, line: string): CanonicalAc | null {
  const explicit = line.match(/\b(?:AC|Assessment\s+Criterion)\s*(\d+(?:\.\d+)?)\b/i);
  if (!explicit) return null;
  const token = normalizeAcNumberToken(explicit[1]);
  return lo.acs.find((ac) => normalizeAcNumberToken(ac.acNumber) === token) ?? null;
}

function acKey(unit: string, loNumber: string, acNumber: string): string {
  return `${unit}.LO${loNumber}.AC${acNumber}`;
}

function extractUnitTitleFromHeadingLine(line: string): string | undefined {
  const cleaned = String(line ?? '').trim();
  if (!cleaned) return undefined;
  const stripped = cleaned.replace(/^Unit\s*\d+\b[:\-\s]*/i, '').trim();
  return stripped.length > 0 ? normalizeWhitespace(stripped) : undefined;
}

export function extractCanonicalStructureFromText(cleanedText: string): {
  structures: CanonicalUnitStructure[];
  confidence: number;
} {
  const lines = cleanedText.split('\n').map((line) => line.trim()).filter(Boolean);
  const unitMap = new Map<string, CanonicalUnitStructure>();

  let currentUnit = '';
  let currentLo: CanonicalLo | null = null;
  let currentAc: CanonicalAc | null = null;
  let inRangeSection = false;
  let activeRangeTarget: { type: 'lo' } | { type: 'ac'; ac: CanonicalAc } | null = null;
  let previousLineKind: 'unit' | 'lo' | 'ac' | 'range' | 'other' = 'other';

  for (const line of lines) {
    const unitMatch = line.match(/^Unit\s*(\d+)\b/i);
    if (unitMatch) {
      currentUnit = unitMatch[1];
      const parsedUnitTitle = extractUnitTitleFromHeadingLine(line);
      if (!unitMap.has(currentUnit)) {
        unitMap.set(currentUnit, { unit: currentUnit, unitTitle: parsedUnitTitle, los: [] });
      } else if (parsedUnitTitle) {
        const existing = unitMap.get(currentUnit);
        if (existing && !existing.unitTitle) {
          existing.unitTitle = parsedUnitTitle;
        }
      }
      currentLo = null;
      currentAc = null;
      inRangeSection = false;
      activeRangeTarget = null;
      previousLineKind = 'unit';
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
      currentAc = null;
      inRangeSection = false;
      activeRangeTarget = null;
      previousLineKind = 'lo';
      continue;
    }

    if (!currentUnit || !currentLo) continue;
    if (/^\*{0,2}\s*Range\b/i.test(line)) {
      inRangeSection = true;
      const explicitAcTarget = getAcRangeTargetFromLine(currentLo, line);
      if (explicitAcTarget) {
        activeRangeTarget = { type: 'ac', ac: explicitAcTarget };
      } else if (currentAc && (previousLineKind === 'ac' || currentLo.acs.length === 1)) {
        // Range lines immediately after an AC typically belong to that AC.
        activeRangeTarget = { type: 'ac', ac: currentAc };
      } else {
        activeRangeTarget = { type: 'lo' };
      }
      const inlineItems = parseRangeItemsFromLine(line);
      if (inlineItems.length > 0) {
        if (activeRangeTarget.type === 'ac') {
          appendAcRange(activeRangeTarget.ac, inlineItems);
        } else {
          appendLoRange(currentLo, inlineItems);
        }
      }
      previousLineKind = 'range';
      continue;
    }

    if (inRangeSection) {
      if (
        /^(Unit\s*\d+|LO\s*\d+|Learning Outcome\s*\d+)/i.test(line) ||
        /^-{3,}$/.test(line) ||
        /^\*\*[^*]+\*\*/.test(line) ||
        parseAcLine(line) !== null
      ) {
        inRangeSection = false;
        activeRangeTarget = null;
      } else {
        const rangeItems = parseRangeItemsFromLine(line);
        if (rangeItems.length > 0) {
          if (activeRangeTarget?.type === 'ac') {
            appendAcRange(activeRangeTarget.ac, rangeItems);
          } else {
            appendLoRange(currentLo, rangeItems);
          }
          previousLineKind = 'range';
          continue;
        }
      }
    }

    const parsedAc = parseAcLine(line);
    if (!parsedAc) {
      previousLineKind = 'other';
      continue;
    }

    const acNumberMatch = line.match(/^((?:AC\s*)?\d+(?:\.\d+)?)/i);
    const acNumber = acNumberMatch ? acNumberMatch[1].replace(/^AC\s*/i, '') : `${currentLo.acs.length + 1}`;

    const ac: CanonicalAc = {
      acNumber,
      text: parsedAc,
      acKey: acKey(currentUnit, currentLo.loNumber, acNumber),
    };
    currentLo.acs.push(ac);
    currentAc = ac;
    previousLineKind = 'ac';
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
  return parseAssessmentCriteriaEntriesFromContent(content).map((entry) => entry.text);
}

export function parseAssessmentCriteriaEntriesFromContent(
  content: string
): Array<{ acNumber: string; text: string }> {
  const lines = content.split(/\r?\n/);
  const criteria: Array<{ acNumber: string; text: string }> = [];
  let inAcBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^\*\*(Assessment criteria|AC)\*\*/i.test(line)) {
      inAcBlock = true;
      continue;
    }

    if (inAcBlock && (/^\*\*Range/i.test(line) || /^---+$/.test(line))) {
      break;
    }

    if (!inAcBlock) continue;

    const numbered = line.match(/^(\d+(?:\.\d+)?)\.?\s+(.+)$/);
    if (numbered) {
      criteria.push({
        acNumber: numbered[1],
        text: normalizeWhitespace(numbered[2]),
      });
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet && criteria.length > 0) {
      criteria[criteria.length - 1].text = `${criteria[criteria.length - 1].text} ${normalizeWhitespace(bullet[1])}`;
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
    const headingUnitTitle = Array.isArray(chunk.anchor_json.headingPath)
      ? String(chunk.anchor_json.headingPath[0] ?? '').trim()
      : '';
    const fallbackUnitTitle = `Unit ${chunk.anchor_json.unitGuess ?? ''}`.trim();
    return {
      id: chunk.id,
      unit: chunk.anchor_json.unitGuess ?? '000',
      unitTitle: headingUnitTitle.length > 0 ? headingUnitTitle : fallbackUnitTitle,
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
      byUnit.set(unit, { unit, unitTitle: normalizeWhitespace(String(chunk.unitTitle ?? '')), los: [] });
    } else {
      const existing = byUnit.get(unit);
      if (existing && !existing.unitTitle) {
        const title = normalizeWhitespace(String(chunk.unitTitle ?? ''));
        if (title.length > 0) {
          existing.unitTitle = title;
        }
      }
    }
    const parsedAcEntries = parseAssessmentCriteriaEntriesFromContent(chunk.content);
    const acs: CanonicalAc[] =
      parsedAcEntries.length > 0
        ? parsedAcEntries.map((entry) => ({
            acNumber: normalizeAcNumberToken(entry.acNumber),
            text: entry.text,
            acKey: `${unit}.LO${loNumber}.AC${normalizeAcNumberToken(entry.acNumber)}`,
          }))
        : (chunk.assessmentCriteria ?? []).map((text, i) => {
            const raw = normalizeWhitespace(String(text ?? ''));
            const legacyPrefix = new RegExp(`^${i + 1}\\s+`);
            const normalizedText = raw.replace(legacyPrefix, '').trim();
            const acNumber = `${loNumber}.${i + 1}`;
            return {
              acNumber,
              text: normalizedText,
              acKey: `${unit}.LO${loNumber}.AC${acNumber}`,
            };
          });
    const parsedRange = parseRangeFromContent(chunk.content);
    const rangeItems = parsedRange
      ? parsedRange.split('|').map((item) => normalizeWhitespace(item)).filter(Boolean)
      : [];
    byUnit.get(unit)?.los.push({
      loNumber,
      title: chunk.loTitle,
      acs,
      range: rangeItems.length > 0 ? rangeItems : undefined,
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
