import chunksData from '@/lib/syllabus/chunks.json';
import { SyllabusChunk } from '@/lib/syllabus/syllabusChunker';
import { RetrievedChunkRecord } from './types';

const chunks = chunksData as SyllabusChunk[];

function compareLo(a: string, b: string): number {
  const an = Number.parseInt(a.replace(/^LO/i, ''), 10);
  const bn = Number.parseInt(b.replace(/^LO/i, ''), 10);
  if (Number.isNaN(an) || Number.isNaN(bn)) return a.localeCompare(b);
  return an - bn;
}

export function normalizeLo(lo: string): string {
  const m = lo.trim().match(/^LO?(\d+)$/i);
  if (!m) return lo.trim().toUpperCase();
  return `LO${m[1]}`;
}

export function getAllUnits(): string[] {
  return [...new Set(chunks.map((chunk) => chunk.unit))].sort();
}

export function getUnitChunks(unit: string): SyllabusChunk[] {
  return chunks
    .filter((chunk) => chunk.unit === unit)
    .sort((a, b) => compareLo(a.learningOutcome, b.learningOutcome));
}

export function getUnitLos(unit: string): string[] {
  return getUnitChunks(unit).map((chunk) => chunk.learningOutcome);
}

export function getChunkById(id: string): SyllabusChunk | null {
  return chunks.find((chunk) => chunk.id === id) ?? null;
}

export function getChunksByIds(ids: string[]): SyllabusChunk[] {
  const seen = new Set<string>();
  const result: SyllabusChunk[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const chunk = getChunkById(id);
    if (chunk) result.push(chunk);
  }
  return result.sort((a, b) => compareLo(a.learningOutcome, b.learningOutcome));
}

export function toRetrievedChunkRecords(source: SyllabusChunk[]): RetrievedChunkRecord[] {
  return source.map((chunk) => ({
    id: chunk.id,
    unit: chunk.unit,
    unitTitle: chunk.unitTitle,
    learningOutcome: normalizeLo(chunk.learningOutcome),
    loTitle: chunk.loTitle,
    assessmentCriteria: [...chunk.assessmentCriteria],
    content: chunk.content,
  }));
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
    }));
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
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
      const inline = line.replace(/^\*\*Range[^*]*\*\*:?\s*/i, '').trim();
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

export function getLoNumber(lo: string): number {
  const n = Number.parseInt(lo.replace(/^LO/i, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

export function compareLoTag(a: string, b: string): number {
  return getLoNumber(a) - getLoNumber(b);
}
