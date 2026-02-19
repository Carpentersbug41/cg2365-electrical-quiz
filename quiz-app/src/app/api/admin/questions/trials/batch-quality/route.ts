import { NextRequest, NextResponse } from 'next/server';
import { createLLMClient } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { listApprovedQuestionsByScope } from '@/lib/questions/bankRepo';
import { getSyllabusUnit } from '@/lib/questions/syllabusRepo';
import { createBatchGenerationPrompt } from '@/lib/questions/generation/promptBuilder';
import { evaluateQuestionAlignment } from '@/lib/questions/alignment';
import { findNearDuplicate, type QuestionSimilarityLike } from '@/lib/questions/similarity';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../../_utils';

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: unknown): string[] {
  const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'must', 'which']);
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length >= 3 && !stop.has(token));
}

function jaccard(tokensA: string[], tokensB: string[]): number {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function stripCodeFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function parseQuestionsPayload(raw: string): { questions: unknown[]; recovered: boolean } {
  const cleaned = stripCodeFences(raw);
  try {
    const parsed = JSON.parse(cleaned) as { questions?: unknown[] };
    return {
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      recovered: false,
    };
  } catch {
    // Recovery pass: isolate first top-level object boundaries.
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const sliced = cleaned.slice(start, end + 1);
      try {
        const parsed = JSON.parse(sliced) as { questions?: unknown[] };
        return {
          questions: Array.isArray(parsed.questions) ? parsed.questions : [],
          recovered: true,
        };
      } catch {
        return { questions: [], recovered: true };
      }
    }
    return { questions: [], recovered: true };
  }
}

function isValidMcq(row: unknown): boolean {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
  const item = row as Record<string, unknown>;
  const stem = String(item.stem ?? '').trim();
  const options = Array.isArray(item.options) ? item.options.map((x) => String(x).trim()).filter((x) => x.length > 0) : [];
  const correct = String(item.correct ?? '').trim();
  if (stem.length < 20) return false;
  if (options.length !== 4) return false;
  if (new Set(options.map((x) => x.toLowerCase())).size !== options.length) return false;
  if (options.some((x) => /^all of the above$/i.test(x))) return false;
  if (!options.some((x) => x.toLowerCase() === correct.toLowerCase())) return false;
  return true;
}

type TrialQuestion = {
  unit_code: string;
  lo_code: string;
  ac_code: string;
  level: number;
  difficulty: string;
  format: string;
  stem: string;
  options: string[];
  correct: string;
  rationale: string;
};

function normalizeGeneratedQuestion(item: unknown, unitCode: string, loCode: string, level: number): TrialQuestion {
  const row = (item ?? {}) as Record<string, unknown>;
  const rawDifficulty = String(row.difficulty ?? 'med').trim().toLowerCase();
  const difficulty = rawDifficulty === 'low' ? 'easy' : rawDifficulty;
  return {
    unit_code: String(row.unit_code ?? unitCode),
    lo_code: String(row.lo_code ?? loCode),
    ac_code: String(row.ac_code ?? ''),
    level: Number(row.level ?? level),
    difficulty,
    format: String(row.format ?? 'mcq'),
    stem: String(row.stem ?? ''),
    options: Array.isArray(row.options) ? row.options.map((x) => String(x)) : [],
    correct: String(row.correct ?? ''),
    rationale: String(row.rationale ?? ''),
  };
}

export async function POST(request: NextRequest) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      unit_code?: string;
      lo_code?: string;
      level?: 2 | 3;
      count?: number;
      context_injections?: string[];
    };
    const unitCode = String(body.unit_code ?? '').trim();
    const loCode = String(body.lo_code ?? '').trim().toUpperCase();
    const level = Number(body.level ?? 2);
    const count = Math.max(10, Math.min(80, Number(body.count ?? 50)));
    const contextInjections = Array.isArray(body.context_injections)
      ? body.context_injections.map((row) => String(row ?? '').trim()).filter((row) => row.length > 0).slice(0, 12)
      : [];
    if (!unitCode || !loCode || (level !== 2 && level !== 3)) {
      return NextResponse.json(
        { success: false, message: 'unit_code, lo_code, and level (2 or 3) are required.' },
        { status: 400 }
      );
    }

    const unit = await getSyllabusUnit(unitCode);
    if (!unit) {
      return NextResponse.json({ success: false, message: `Unknown unit ${unitCode}.` }, { status: 404 });
    }
    const lo = unit.learning_outcomes.find((row) => String(row.lo_code).toUpperCase() === loCode);
    if (!lo) {
      return NextResponse.json({ success: false, message: `Unknown LO ${loCode} for unit ${unitCode}.` }, { status: 404 });
    }
    const acList = lo.assessment_criteria.map((row) => row.ac_code).filter((x) => x.length > 0);
    if (acList.length === 0) {
      return NextResponse.json({ success: false, message: `No ACs found for ${unitCode} ${loCode}.` }, { status: 400 });
    }

    const approvedScope = await listApprovedQuestionsByScope({
      unit_code: unitCode,
      level,
      lo_codes: [loCode],
      format: 'mcq',
    });
    const antiDupHistory = approvedScope
      .slice(0, 20)
      .map((row, idx) => `${idx + 1}. [${row.lo_code ?? '-'}|${row.ac_code ?? '-'}] Q: ${row.stem} | A: ${String(row.correct)}`)
      .join('\n');

    const llm = createLLMClient();
    const modelName = getGeminiModelWithDefault();
    const model = llm.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 16000,
        responseMimeType: 'application/json',
      },
    });

    const acByCode = new Map(
      lo.assessment_criteria.map((ac) => [
        String(ac.ac_code).trim(),
        { ac_text: ac.ac_text ?? '', range_notes: ac.range_notes ?? null },
      ])
    );
    const loAlignmentText = [lo.lo_text ?? lo.lo_title ?? '', ...contextInjections].join(' ').trim();
    const maxAttempts = 6;
    const accepted: TrialQuestion[] = [];
    const acceptedSimilarity: QuestionSimilarityLike[] = [];
    const allNormalized: TrialQuestion[] = [];
    const acceptanceReasons: string[] = [];
    let parsedCount = 0;

    const started = Date.now();
    for (let attempt = 1; attempt <= maxAttempts && accepted.length < count; attempt += 1) {
      const remaining = count - accepted.length;
      const requestCount = Math.min(80, Math.max(remaining * 2, 20));
      const carryHistory = accepted
        .slice(-20)
        .map((row, idx) => `${idx + 1}. [${row.lo_code}|${row.ac_code}] Q: ${row.stem} | A: ${row.correct}`)
        .join('\n');
      const prompt = createBatchGenerationPrompt({
        unit_code: unitCode,
        lo_code: loCode,
        level: level as 2 | 3,
        count: requestCount,
        lo_text: lo.lo_text ?? lo.lo_title ?? `Learning outcome ${loCode}`,
        ac_list: lo.assessment_criteria.map((ac) => ({
          ac_code: ac.ac_code,
          ac_text: ac.ac_text,
          range_notes: ac.range_notes,
        })),
        anti_duplicate_history: [antiDupHistory, carryHistory].filter((x) => x.length > 0).join('\n'),
        context_injections: [
          ...contextInjections,
          'Use the LO and AC text as the source of truth for topic scope.',
          'Do not switch to adjacent topics unless explicitly present in AC text/range notes.',
          'Return exactly the requested count.',
        ],
      });

      const generation = await model.generateContent(prompt);
      const raw = generation.response.text();
      const parsed = parseQuestionsPayload(raw);
      const questions = parsed.questions;
      parsedCount += questions.length;
      const normalizedBatch = questions.map((item) => normalizeGeneratedQuestion(item, unitCode, loCode, level));
      allNormalized.push(...normalizedBatch);

      for (const item of normalizedBatch) {
        if (accepted.length >= count) break;
        if (!isValidMcq(item)) continue;
        const acContext = acByCode.get(String(item.ac_code).trim());
        const alignment = evaluateQuestionAlignment({
          stem: item.stem,
          options: item.options,
          correct: item.correct,
          context: {
            lo_code: loCode,
            lo_text: loAlignmentText,
            ac_code: item.ac_code,
            ac_text: acContext?.ac_text ?? '',
            range_notes: acContext?.range_notes ?? null,
          },
        });
        if (!alignment.pass) continue;
        const isDup = accepted.some((row) => normalizeText(row.stem) === normalizeText(item.stem));
        if (isDup) continue;
        const candidateSimilarity: QuestionSimilarityLike = {
          unit_code: item.unit_code,
          lo_code: item.lo_code,
          ac_code: item.ac_code,
          format: item.format,
          stem: item.stem,
          options: item.options,
          correct: item.correct,
        };
        const near = findNearDuplicate(candidateSimilarity, acceptedSimilarity);
        if (near) continue;
        accepted.push(item);
        acceptedSimilarity.push(candidateSimilarity);
      }

      acceptanceReasons.push(
        `Attempt ${attempt}: parsed ${questions.length}, accepted ${accepted.length}/${count}${parsed.recovered ? ' (recovered malformed JSON)' : ''}.`
      );
    }
    const elapsedMs = Date.now() - started;
    const normalizedQuestions = accepted;

    const validFlags = allNormalized.map((item) => isValidMcq(item));
    const validCount = validFlags.filter(Boolean).length;
    const invalidCount = allNormalized.length - validCount;
    const alignmentChecks = allNormalized.map((item) => {
      const acContext = acByCode.get(String(item.ac_code).trim());
      return evaluateQuestionAlignment({
        stem: item.stem,
        options: item.options,
        correct: item.correct,
        context: {
          lo_code: loCode,
          lo_text: loAlignmentText,
          ac_code: item.ac_code,
          ac_text: acContext?.ac_text ?? '',
          range_notes: acContext?.range_notes ?? null,
        },
      });
    });
    const alignmentPassCount = alignmentChecks.filter((row) => row.pass).length;
    const alignmentFailCount = alignmentChecks.length - alignmentPassCount;
    const alignmentExamples = alignmentChecks
      .map((row, idx) => ({ row, idx }))
      .filter((entry) => !entry.row.pass)
      .slice(0, 10)
      .map((entry) => ({
        i: entry.idx + 1,
        score: Number(entry.row.score.toFixed(3)),
        threshold: Number(entry.row.threshold.toFixed(3)),
        reasons: entry.row.reasons,
        matched_terms: entry.row.matched_terms,
        stem: String(allNormalized[entry.idx]?.stem ?? '').slice(0, 220),
      }));

    const stemNorm = normalizedQuestions.map((q) => normalizeText(q.stem));
    const exactDupStemCount = stemNorm.length - new Set(stemNorm).size;

    let nearDupPairs = 0;
    let answerCorrelatedPairs = 0;
    const examples: Array<Record<string, unknown>> = [];
    for (let i = 0; i < normalizedQuestions.length; i += 1) {
      for (let j = i + 1; j < normalizedQuestions.length; j += 1) {
        const qi = normalizedQuestions[i];
        const qj = normalizedQuestions[j];
        const stemScore = jaccard(tokenize(qi.stem), tokenize(qj.stem));
        const answerScore = jaccard(tokenize(qi.correct), tokenize(qj.correct));
        const near = stemScore >= 0.58;
        const answerCorrelated = answerScore >= 0.65 && stemScore >= 0.48;
        if (near) nearDupPairs += 1;
        if (answerCorrelated) answerCorrelatedPairs += 1;
        if ((near || answerCorrelated) && examples.length < 15) {
          examples.push({
            i: i + 1,
            j: j + 1,
            stemScore: Number(stemScore.toFixed(3)),
            answerScore: Number(answerScore.toFixed(3)),
            stemA: String(qi.stem ?? '').slice(0, 180),
            stemB: String(qj.stem ?? '').slice(0, 180),
            answerA: String(qi.correct ?? '').slice(0, 120),
            answerB: String(qj.correct ?? '').slice(0, 120),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      trial: {
        unit_code: unitCode,
        lo_code: loCode,
        level,
        requested_count: count,
        model: modelName,
        elapsed_ms: elapsedMs,
      },
      output: {
        parsed_count: parsedCount,
        accepted_count: normalizedQuestions.length,
        attempt_summary: acceptanceReasons,
        valid_count: validCount,
        invalid_count: invalidCount,
        alignment_pass_count: alignmentPassCount,
        alignment_fail_count: alignmentFailCount,
        exact_dup_stem_count: exactDupStemCount,
        near_dup_pairs: nearDupPairs,
        answer_correlated_pairs: answerCorrelatedPairs,
      },
      examples,
      alignment_examples: alignmentExamples,
      questions: normalizedQuestions,
      attempted_questions: allNormalized,
    });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
