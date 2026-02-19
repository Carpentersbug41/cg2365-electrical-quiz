import { NextRequest, NextResponse } from 'next/server';
import { listQuestionsByScope } from '@/lib/questions/bankRepo';
import { evaluateQuestionAlignment } from '@/lib/questions/alignment';
import { findNearDuplicate, QuestionSimilarityLike, toSimilarityLike } from '@/lib/questions/similarity';
import { validateQuestionDraft } from '@/lib/questions/validation';
import { getSyllabusUnit } from '@/lib/questions/syllabusRepo';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../_utils';

export async function POST(request: NextRequest) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      unit_code?: string;
      level?: 2 | 3;
      lo_codes?: string[] | null;
      include_retired?: boolean;
      limit?: number;
    };
    const unitCode = String(body.unit_code ?? '').trim();
    const level = Number(body.level ?? 2);
    const loCodes = Array.isArray(body.lo_codes)
      ? body.lo_codes.map((row) => String(row).trim()).filter((row) => row.length > 0)
      : [];
    const includeRetired = Boolean(body.include_retired ?? false);
    const limit = Number(body.limit ?? 500);

    if (!unitCode || (level !== 2 && level !== 3)) {
      return NextResponse.json({ success: false, message: 'unit_code and level (2 or 3) are required.' }, { status: 400 });
    }

    const unit = await getSyllabusUnit(unitCode);
    const loTextByCode = new Map<string, string>();
    const acByKey = new Map<string, { ac_text: string; range_notes: string | null }>();
    for (const lo of unit?.learning_outcomes ?? []) {
      loTextByCode.set(lo.lo_code, lo.lo_text);
      for (const ac of lo.assessment_criteria ?? []) {
        acByKey.set(`${ac.lo_code}|${ac.ac_code}`, {
          ac_text: ac.ac_text,
          range_notes: ac.range_notes ?? null,
        });
      }
    }

    const questions = await listQuestionsByScope({
      unit_code: unitCode,
      level,
      lo_codes: loCodes.length > 0 ? loCodes : undefined,
      include_retired: includeRetired,
      limit,
    });

    const pool: QuestionSimilarityLike[] = questions.map((q) => toSimilarityLike(q));
    const issues: Array<{ question_id: string; status: string; reasons: string[] }> = [];
    let validCount = 0;
    let alignmentFailCount = 0;
    let schemaFailCount = 0;
    let nearDupCount = 0;

    for (const row of questions) {
      const reasons: string[] = [];
      const draftValidation = validateQuestionDraft({
        generation_run_id: row.generation_run_id,
        unit_code: row.unit_code,
        lo_code: row.lo_code,
        ac_code: row.ac_code,
        level: row.level as 2 | 3,
        difficulty: row.difficulty,
        format: row.format,
        stem: row.stem,
        options: row.options,
        correct: row.correct,
        rationale: row.rationale,
        tags: row.tags,
        source: row.source,
        status: row.status,
        hash: row.hash,
        version: row.version,
        doc_ref: row.doc_ref,
      });
      if (!draftValidation.valid) {
        schemaFailCount += 1;
        reasons.push(...draftValidation.reasons);
      }

      const acKey = `${row.lo_code ?? ''}|${row.ac_code ?? ''}`;
      const ac = acByKey.get(acKey);
      const alignment = evaluateQuestionAlignment({
        stem: row.stem,
        options: row.options,
        correct: row.correct,
        context: {
          lo_code: row.lo_code ?? '',
          lo_text: loTextByCode.get(row.lo_code ?? ''),
          ac_code: row.ac_code ?? '',
          ac_text: ac?.ac_text,
          range_notes: ac?.range_notes ?? null,
        },
      });
      if (!alignment.pass) {
        alignmentFailCount += 1;
        reasons.push(`Alignment failed (${alignment.score.toFixed(2)} < ${alignment.threshold.toFixed(2)}).`);
      }

      const candidate = toSimilarityLike(row);
      const near = findNearDuplicate(
        candidate,
        pool.filter((other) => other.id !== row.id)
      );
      if (near) {
        nearDupCount += 1;
        reasons.push(`Near-duplicate of ${near.question.id ?? '(unknown)'} (${near.score.toFixed(2)}).`);
      }

      if (reasons.length > 0) {
        issues.push({
          question_id: row.id,
          status: row.status,
          reasons: Array.from(new Set(reasons)).slice(0, 8),
        });
      } else {
        validCount += 1;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        unit_code: unitCode,
        level,
        checked_count: questions.length,
        valid_count: validCount,
        issue_count: issues.length,
        schema_fail_count: schemaFailCount,
        alignment_fail_count: alignmentFailCount,
        near_duplicate_count: nearDupCount,
      },
      issues: issues.slice(0, 300),
    });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
