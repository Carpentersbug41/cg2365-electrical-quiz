import { NextRequest, NextResponse } from 'next/server';
import {
  buildDeterministicChunks,
  cleanExtractedText,
  computeContentHash,
  extractCanonicalStructureFromText,
  extractTextFromDocxBuffer,
  extractTextFromPdfBuffer,
  listSyllabusVersions,
  validateCanonicalStructure,
} from '@/lib/module_planner/syllabus';
import {
  createSyllabusVersion,
  insertSyllabusChunks,
  updateSyllabusVersionMeta,
  upsertSyllabusStructure,
} from '@/lib/module_planner/db';
import { isModulePlannerEnabled } from '@/lib/module_planner';
import { createLLMClient } from '@/lib/llm/client';
import { getGeminiApiKey, getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { cleanCodeBlocks, preprocessToValidJson, safeJsonParse } from '@/lib/generation/utils';
import { CanonicalUnitStructure } from '@/lib/module_planner/types';
import { getCurriculumScopeFromHeaderOrReferer } from '@/lib/routing/curriculumScope';

function guardUploadAccess(request: NextRequest): NextResponse | null {
  if (!isModulePlannerEnabled()) {
    return NextResponse.json(
      {
        success: false,
        code: 'MODULE_PLANNER_DISABLED',
        message: 'Module planner is disabled by MODULE_PLANNER_ENABLED.',
      },
      { status: 403 }
    );
  }

  const expectedToken = process.env.MODULE_PLANNER_ADMIN_TOKEN;
  if (!expectedToken || expectedToken.trim().length === 0) {
    return null;
  }

  const headerToken = request.headers.get('x-module-admin-token')?.trim();
  const auth = request.headers.get('authorization');
  const bearerToken = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : null;
  const provided = headerToken || bearerToken;
  if (provided !== expectedToken.trim()) {
    return NextResponse.json(
      {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid module admin token.',
      },
      { status: 401 }
    );
  }
  return null;
}

function detectFileType(filename: string): 'pdf' | 'docx' | 'txt' | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.txt')) return 'txt';
  return null;
}

function parseDelimitedLine(line: string): string[] {
  const delimiter = line.includes('\t') ? '\t' : ',';
  if (delimiter === '\t') {
    return line.split('\t').map((part) => part.trim());
  }

  const out: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
}

function tryParseStructuredTable(
  sourceText: string,
  scope: 'cg2365' | 'gcse-science-physics' | 'gcse-science-biology'
): CanonicalUnitStructure[] | null {
  const lines = sourceText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length < 2) return null;

  const header = parseDelimitedLine(lines[0]).map((h) => h.toLowerCase());
  const index = {
    curriculum: header.indexOf('curriculum'),
    unit_code: header.indexOf('unit_code'),
    unit_title: header.indexOf('unit_title'),
    lo_code: header.indexOf('lo_code'),
    lo_title: header.indexOf('lo_title'),
    ac_code: header.indexOf('ac_code'),
    ac_text: header.indexOf('ac_text'),
  };
  if (
    index.unit_code < 0 ||
    index.lo_code < 0 ||
    index.ac_code < 0 ||
    index.ac_text < 0
  ) {
    return null;
  }

  const units = new Map<string, CanonicalUnitStructure>();
  let parsedRows = 0;

  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseDelimitedLine(lines[i]);
    const curriculum = index.curriculum >= 0 ? String(cols[index.curriculum] ?? '').trim() : '';
    if (curriculum && curriculum !== scope) continue;

    const unitCode = String(cols[index.unit_code] ?? '').trim();
    const loCode = String(cols[index.lo_code] ?? '').trim().toUpperCase();
    const acCode = String(cols[index.ac_code] ?? '').trim();
    const acText = String(cols[index.ac_text] ?? '').trim();
    if (!unitCode || !loCode || !acCode || !acText) continue;

    const loNumber = loCode.replace(/^LO/i, '').trim();
    if (!loNumber) continue;

    const unitTitle = index.unit_title >= 0 ? String(cols[index.unit_title] ?? '').trim() : '';
    const loTitle = index.lo_title >= 0 ? String(cols[index.lo_title] ?? '').trim() : '';

    const unit = units.get(unitCode) ?? { unit: unitCode, unitTitle: unitTitle || undefined, los: [] };
    if (!unit.unitTitle && unitTitle) unit.unitTitle = unitTitle;

    const lo = unit.los.find((row) => row.loNumber === loNumber) ?? {
      loNumber,
      title: loTitle || undefined,
      acs: [],
    };
    if (!lo.title && loTitle) lo.title = loTitle;

    if (!lo.acs.some((ac) => ac.acNumber === acCode)) {
      lo.acs.push({
        acNumber: acCode,
        text: acText,
        acKey: `${unitCode}.LO${loNumber}.AC${acCode}`,
      });
    }

    if (!unit.los.some((row) => row.loNumber === loNumber)) {
      unit.los.push(lo);
    }
    units.set(unitCode, unit);
    parsedRows += 1;
  }

  const structures = Array.from(units.values())
    .filter((unit) => unit.los.length > 0)
    .sort((a, b) => a.unit.localeCompare(b.unit, undefined, { numeric: true }));

  return parsedRows > 0 && structures.length > 0 ? structures : null;
}

async function extractTextFromUpload(file: File): Promise<string> {
  const filename = file.name || 'upload.txt';
  const type = detectFileType(filename);
  if (!type) {
    throw new Error('Unsupported file type. Upload PDF, DOCX, or TXT.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (type === 'txt') {
    return buffer.toString('utf8');
  }
  if (type === 'pdf') {
    return extractTextFromPdfBuffer(buffer);
  }
  return extractTextFromDocxBuffer(buffer);
}

async function tryNormaliseStructureWithLlm(cleanedText: string): Promise<CanonicalUnitStructure[] | null> {
  if (!getGeminiApiKey()) return null;
  let modelName: string;
  try {
    modelName = getGeminiModelWithDefault();
  } catch {
    return null;
  }

  const client = createLLMClient();
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 5000,
      responseMimeType: 'application/json',
    },
    systemInstruction:
      'Normalise curriculum structure only. Extract units, LOs, AC numbers and text. Do not invent content.',
  });

  const prompt = JSON.stringify({
    task: 'extract_curriculum_structure',
    inputExcerpt: cleanedText.slice(0, 20000),
    schema: {
      structures: [
        {
          unit: 'string',
          los: [
            {
              loNumber: 'string',
              title: 'string',
              range: ['string'],
              acs: [
                {
                  acNumber: 'string',
                  text: 'string',
                  range: ['string'],
                },
              ],
            },
          ],
        },
      ],
    },
    rules: [
      'Only include keys supported by source text.',
      'Do not invent LOs or ACs.',
      'Return strict JSON only.',
    ],
  });

  const response = await model.generateContent(prompt);
  const raw = cleanCodeBlocks(response.response.text());
  const parsed = safeJsonParse<{ structures?: Array<Record<string, unknown>> }>(preprocessToValidJson(raw));
  if (!parsed.success || !parsed.data?.structures || !Array.isArray(parsed.data.structures)) return null;

  const normalized: CanonicalUnitStructure[] = parsed.data.structures
    .map((entry) => {
      const normalizeRangeList = (value: unknown): string[] => {
        if (Array.isArray(value)) {
          return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
        }
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return trimmed.length > 0 ? [trimmed] : [];
        }
        return [];
      };
      const unit = String(entry.unit ?? '').trim();
      const losRaw = Array.isArray(entry.los) ? entry.los : [];
        const los = losRaw.map((loEntry) => {
          const loObj = loEntry as Record<string, unknown>;
          const loNumber = String(loObj.loNumber ?? '').trim();
          const loRange = normalizeRangeList(loObj.range);
          const acsRaw = Array.isArray(loObj.acs) ? loObj.acs : [];
          const acs = acsRaw.map((acEntry) => {
            const acObj = acEntry as Record<string, unknown>;
            const acNumber = String(acObj.acNumber ?? '').trim();
            const text = String(acObj.text ?? '').trim();
            const acRange = normalizeRangeList(acObj.range);
            return {
              acNumber,
              text,
              acKey: `${unit}.LO${loNumber}.AC${acNumber}`,
              range: acRange.length > 0 ? acRange : undefined,
            };
          });
          return {
            loNumber,
            title: String(loObj.title ?? '').trim() || undefined,
            acs,
            range: loRange.length > 0 ? loRange : undefined,
          };
        });
      return { unit, los };
    })
    .filter((unit) => unit.unit.length > 0 && unit.los.length > 0);

  if (normalized.length === 0) return null;
  return normalized;
}

async function tryDeriveGcseStructureWithLlm(
  cleanedText: string,
  subject: 'physics' | 'biology'
): Promise<CanonicalUnitStructure[] | null> {
  if (!getGeminiApiKey()) return null;
  let modelName: string;
  try {
    modelName = getGeminiModelWithDefault();
  } catch {
    return null;
  }

  const client = createLLMClient();
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 5000,
      responseMimeType: 'application/json',
    },
    systemInstruction:
      'You normalize GCSE science specs into a Unit/LO/AC structure for planning. Stay faithful to source content.',
  });

  const prompt = JSON.stringify({
    task: 'derive_gcse_curriculum_structure',
    inputExcerpt: cleanedText.slice(0, 20000),
    schema: {
      structures: [
        {
          unit: `${subject === 'biology' ? 'BIO' : 'PHY'}-<topic-code>`,
          unitTitle: 'string',
          los: [
            {
              loNumber: '1',
              title: 'string',
              acs: [
                {
                  acNumber: '1.1',
                  text: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
    rules: [
      'Use only content present in the source excerpt.',
      'Convert topic-based statements into planner-friendly LO/AC entries.',
      'Create at least 1 AC per LO.',
      `Unit code must start with ${subject === 'biology' ? 'BIO-' : 'PHY-'}.`,
      'Return strict JSON only.',
    ],
  });

  const response = await model.generateContent(prompt);
  const raw = cleanCodeBlocks(response.response.text());
  const parsed = safeJsonParse<{ structures?: Array<Record<string, unknown>> }>(preprocessToValidJson(raw));
  if (!parsed.success || !parsed.data?.structures || !Array.isArray(parsed.data.structures)) return null;

  const normalized: CanonicalUnitStructure[] = parsed.data.structures
    .map((entry) => {
      const unit = String(entry.unit ?? '').trim().toUpperCase();
      const losRaw = Array.isArray(entry.los) ? entry.los : [];
      const los = losRaw
        .map((loEntry) => {
          const loObj = loEntry as Record<string, unknown>;
          const loNumber = String(loObj.loNumber ?? '').trim();
          const acsRaw = Array.isArray(loObj.acs) ? loObj.acs : [];
          const acs = acsRaw
            .map((acEntry) => {
              const acObj = acEntry as Record<string, unknown>;
              const acNumber = String(acObj.acNumber ?? '').trim();
              const text = String(acObj.text ?? '').trim();
              if (!acNumber || !text) return null;
              return {
                acNumber,
                text,
                acKey: `${unit}.LO${loNumber}.AC${acNumber}`,
              };
            })
            .filter((ac): ac is NonNullable<typeof ac> => ac !== null);
          if (!loNumber || acs.length === 0) return null;
          return {
            loNumber,
            title: String(loObj.title ?? '').trim() || undefined,
            acs,
          };
        })
        .filter((lo): lo is NonNullable<typeof lo> => lo !== null);

      return {
        unit,
        unitTitle: String(entry.unitTitle ?? '').trim() || undefined,
        los,
      };
    })
    .filter((unit) => unit.los.length > 0);
  const expectedPrefix = subject === 'biology' ? /^BIO-/i : /^PHY-/i;
  const filtered = normalized.filter((unit) => expectedPrefix.test(unit.unit) && unit.los.length > 0);

  if (filtered.length === 0) return null;
  return filtered;
}

function mergeNormalizedStructures(structures: CanonicalUnitStructure[]): CanonicalUnitStructure[] {
  const byUnit = new Map<string, CanonicalUnitStructure>();

  for (const unit of structures) {
    const unitKey = String(unit.unit ?? '').trim();
    if (!unitKey) continue;

    const existingUnit = byUnit.get(unitKey) ?? { unit: unitKey, los: [] };
    if (!existingUnit.unitTitle && unit.unitTitle) {
      existingUnit.unitTitle = unit.unitTitle;
    }

    const loMap = new Map(existingUnit.los.map((lo) => [lo.loNumber, lo]));
    for (const lo of unit.los) {
      const loKey = String(lo.loNumber ?? '').trim();
      if (!loKey) continue;
      const existingLo = loMap.get(loKey) ?? { loNumber: loKey, acs: [] };
      if (!existingLo.title && lo.title) {
        existingLo.title = lo.title;
      }

      const acMap = new Map(existingLo.acs.map((ac) => [ac.acNumber, ac]));
      for (const ac of lo.acs) {
        const acKey = String(ac.acNumber ?? '').trim();
        if (!acKey) continue;
        if (!acMap.has(acKey)) {
          acMap.set(acKey, {
            acNumber: acKey,
            text: ac.text,
            acKey: `${unitKey}.LO${loKey}.AC${acKey}`,
            range: ac.range,
          });
        }
      }
      existingLo.acs = Array.from(acMap.values());
      loMap.set(loKey, existingLo);
    }

    existingUnit.los = Array.from(loMap.values());
    byUnit.set(unitKey, existingUnit);
  }

  return Array.from(byUnit.values())
    .filter((unit) => unit.los.length > 0)
    .sort((a, b) => a.unit.localeCompare(b.unit, undefined, { numeric: true }));
}

async function tryNormaliseStructureWithLlmBatched(cleanedText: string): Promise<CanonicalUnitStructure[] | null> {
  const batchSize = 18000;
  const maxBatches = 8;
  const batches: string[] = [];

  for (let i = 0; i < cleanedText.length && batches.length < maxBatches; i += batchSize) {
    batches.push(cleanedText.slice(i, i + batchSize));
  }

  const all: CanonicalUnitStructure[] = [];
  for (const batch of batches) {
    const one = await tryNormaliseStructureWithLlm(batch);
    if (one && one.length > 0) all.push(...one);
  }

  if (all.length === 0) return null;
  const merged = mergeNormalizedStructures(all);
  return merged.length > 0 ? merged : null;
}

async function tryDeriveGcseStructureWithLlmBatched(
  cleanedText: string,
  subject: 'physics' | 'biology'
): Promise<CanonicalUnitStructure[] | null> {
  const batchSize = 16000;
  const maxBatches = 10;
  const batches: string[] = [];

  for (let i = 0; i < cleanedText.length && batches.length < maxBatches; i += batchSize) {
    batches.push(cleanedText.slice(i, i + batchSize));
  }

  const all: CanonicalUnitStructure[] = [];
  for (const batch of batches) {
    const one = await tryDeriveGcseStructureWithLlm(batch, subject);
    if (one && one.length > 0) all.push(...one);
  }
  if (all.length === 0) return null;
  const merged = mergeNormalizedStructures(all);
  return merged.length > 0 ? merged : null;
}

export async function POST(request: NextRequest) {
  const denied = guardUploadAccess(request);
  if (denied) return denied;
  const scope = getCurriculumScopeFromHeaderOrReferer(
    request.headers.get('x-course-prefix'),
    request.headers.get('referer')
  );

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'file is required (multipart/form-data).' },
        { status: 400 }
      );
    }

    const fileType = detectFileType(file.name || 'upload.txt');
    const rawText = await extractTextFromUpload(file);
    const cleanedText = cleanExtractedText(rawText);
    const minChars = fileType === 'txt' ? 20 : 80;
    if (!cleanedText || cleanedText.length < minChars) {
      return NextResponse.json(
        {
          success: false,
          code: 'RAG_EMPTY',
          message: `Failed to extract readable text from upload (extracted ${cleanedText?.length ?? 0} chars; minimum ${minChars} for ${fileType ?? 'unknown'}).`,
        },
        { status: 400 }
      );
    }

    const contentHash = computeContentHash(cleanedText);
    const chunks = buildDeterministicChunks(cleanedText);
    let structureSource: 'table' | 'heuristic' | 'llm' | 'llm-batched' | 'gcse-llm-batched' = 'heuristic';
    let structureResult = extractCanonicalStructureFromText(cleanedText);
    const tableStructured = tryParseStructuredTable(rawText, scope) ?? tryParseStructuredTable(cleanedText, scope);
    if (tableStructured && tableStructured.length > 0) {
      structureResult = {
        structures: tableStructured,
        confidence: Math.max(structureResult.confidence, 0.95),
      };
      structureSource = 'table';
    }
    if (structureResult.confidence < 0.45 || structureResult.structures.length === 0) {
      const llmNormalized = await tryNormaliseStructureWithLlm(cleanedText);
      if (llmNormalized && llmNormalized.length > 0) {
        structureResult = {
          structures: llmNormalized,
          confidence: Math.max(structureResult.confidence, 0.5),
        };
        structureSource = 'llm';
      } else {
        const batchedNormalized = await tryNormaliseStructureWithLlmBatched(cleanedText);
        if (batchedNormalized && batchedNormalized.length > 0) {
          structureResult = {
            structures: batchedNormalized,
            confidence: Math.max(structureResult.confidence, 0.55),
          };
          structureSource = 'llm-batched';
        }
      }
    }
    if (
      (scope === 'gcse-science-physics' || scope === 'gcse-science-biology') &&
      (structureResult.confidence < 0.45 || structureResult.structures.length === 0)
    ) {
      const derived = await tryDeriveGcseStructureWithLlmBatched(
        cleanedText,
        scope === 'gcse-science-biology' ? 'biology' : 'physics'
      );
      if (derived && derived.length > 0) {
        structureResult = {
          structures: derived,
          confidence: Math.max(structureResult.confidence, 0.6),
        };
        structureSource = 'gcse-llm-batched';
      }
    }

    const version = await createSyllabusVersion({
      filename: file.name,
      contentHash,
      curriculum: scope,
      metaJson: {
        curriculum: scope,
        filename: file.name,
        bytes: file.size,
        extractionSource: fileType,
        structureSource,
        extractedChars: cleanedText.length,
        structureConfidence: structureResult.confidence,
      },
    });

    await insertSyllabusChunks(
      version.id,
      chunks.map((chunk, idx) => ({
        ordinal: idx,
        text: chunk.text,
        anchorJson: {
          ...chunk.anchor,
          pageStart: chunk.anchor.pageStart ?? idx + 1,
          pageEnd: chunk.anchor.pageEnd ?? idx + 1,
        },
      }))
    );

    let loCount = 0;
    let acCount = 0;
    for (const unit of structureResult.structures) {
      const errors = validateCanonicalStructure(unit);
      if (errors.length > 0) continue;
      await upsertSyllabusStructure({
        syllabusVersionId: version.id,
        unit: unit.unit,
        structureJson: unit,
      });
      loCount += unit.los.length;
      acCount += unit.los.reduce((sum, lo) => sum + lo.acs.length, 0);
    }

    await updateSyllabusVersionMeta(version.id, {
      curriculum: scope,
      filename: file.name,
      bytes: file.size,
      extractionSource: fileType,
      structureSource,
      extractedChars: cleanedText.length,
      chunkCount: chunks.length,
      structureConfidence: structureResult.confidence,
      unitsFound: structureResult.structures.map((u) => u.unit),
      loCount,
      acCount,
    });

    return NextResponse.json({
      success: true,
      syllabusVersionId: version.id,
      filename: version.filename,
      contentHash: version.content_hash,
      chunkCount: chunks.length,
      loCount,
      acCount,
      debug: {
        extractionSource: fileType,
        structureSource,
        extractedChars: cleanedText.length,
        structureConfidence: structureResult.confidence,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to upload syllabus.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const denied = guardUploadAccess(request);
  if (denied) return denied;

  try {
    const versions = await listSyllabusVersions();
    return NextResponse.json({
      success: true,
      versions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to list syllabus versions.',
      },
      { status: 500 }
    );
  }
}
