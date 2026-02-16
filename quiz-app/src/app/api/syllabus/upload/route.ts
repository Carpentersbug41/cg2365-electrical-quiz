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
    inputExcerpt: cleanedText.slice(0, 18000),
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

export async function POST(request: NextRequest) {
  const denied = guardUploadAccess(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'file is required (multipart/form-data).' },
        { status: 400 }
      );
    }

    const rawText = await extractTextFromUpload(file);
    const cleanedText = cleanExtractedText(rawText);
    if (!cleanedText || cleanedText.length < 80) {
      return NextResponse.json(
        { success: false, code: 'RAG_EMPTY', message: 'Failed to extract readable text from upload.' },
        { status: 400 }
      );
    }

    const contentHash = computeContentHash(cleanedText);
    const chunks = buildDeterministicChunks(cleanedText);
    let structureResult = extractCanonicalStructureFromText(cleanedText);
    if (structureResult.confidence < 0.45 || structureResult.structures.length === 0) {
      const llmNormalized = await tryNormaliseStructureWithLlm(cleanedText);
      if (llmNormalized && llmNormalized.length > 0) {
        structureResult = {
          structures: llmNormalized,
          confidence: Math.max(structureResult.confidence, 0.5),
        };
      }
    }

    const version = await createSyllabusVersion({
      filename: file.name,
      contentHash,
      metaJson: {
        filename: file.name,
        bytes: file.size,
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
      filename: file.name,
      bytes: file.size,
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
