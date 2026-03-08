import { QuizQuestion } from '@/lib/generation/types';
import { buildWeightedAcSelection, selectQuestionsForQuiz } from './acMixing';
import { listApprovedQuestionsByScope } from './bankRepo';
import { executeQuestionRun, createDefaultQuestionRun } from './generation/orchestrator';
import { getSyllabusUnit } from './syllabusRepo';
import { QuestionItem } from './types';

function normalizeLoCode(value: string): string {
  const token = String(value ?? '').trim().toUpperCase();
  if (!token) return '';
  return token.startsWith('LO') ? token : `LO${token}`;
}

function inferLevelFromUnit(unitCode: string): 2 | 3 {
  const numeric = Number(String(unitCode).replace(/[^\d]/g, ''));
  if (Number.isFinite(numeric) && numeric >= 300) return 3;
  return 2;
}

function extractLoCodesFromLessonContext(lessonId: string, learningOutcomes: string[]): string[] {
  const values = new Set<string>();

  const lessonMatches = lessonId.match(/L(\d+)/gi) ?? [];
  for (const token of lessonMatches) {
    const number = token.replace(/[^0-9]/g, '');
    if (!number) continue;
    values.add(normalizeLoCode(number));
  }

  for (const line of learningOutcomes) {
    const matches = line.match(/\bLO\s*([0-9]+)\b/gi) ?? [];
    for (const token of matches) {
      const number = token.replace(/[^0-9]/g, '');
      if (!number) continue;
      values.add(normalizeLoCode(number));
    }
  }

  return Array.from(values);
}

function toQuizQuestion(item: QuestionItem, index: number, lessonId: string, section: string): QuizQuestion | null {
  const options = Array.isArray(item.options) ? item.options : [];
  if (options.length !== 4) return null;
  const correctRaw = Array.isArray(item.correct) ? item.correct[0] : item.correct;
  const correctIndex = options.findIndex(
    (option) => String(option).trim().toLowerCase() === String(correctRaw).trim().toLowerCase()
  );

  const difficulty =
    item.difficulty === 'easy' ? 2 :
      item.difficulty === 'hard' ? 4 :
        3;

  return {
    id: index + 1,
    question: item.stem,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    section,
    category: `${item.unit_code} ${item.lo_code ?? ''} ${item.ac_code ?? ''}`.trim(),
    tags: item.tags ?? [],
    learningOutcomeId: `${lessonId}-${item.lo_code ?? 'LO1'}`,
    answerType: 'mcq',
    difficulty,
    estimatedTime: 90,
    explanation: item.rationale ?? 'Review the lesson rationale for this question.',
  };
}

function buildApprovedByAc(questions: QuestionItem[]): Map<string, QuestionItem[]> {
  const byAc = new Map<string, QuestionItem[]>();
  for (const question of questions) {
    if (!question.lo_code || !question.ac_code) continue;
    const key = `${question.lo_code}|${question.ac_code}`;
    const rows = byAc.get(key) ?? [];
    rows.push(question);
    byAc.set(key, rows);
  }
  return byAc;
}

export async function buildStrictLessonQuiz(input: {
  lessonId: string;
  unitCode: string;
  desiredCount: number;
  section: string;
  level?: 2 | 3;
  learningOutcomes?: string[];
  allowAutoGenerate?: boolean;
}): Promise<{ success: boolean; questions: QuizQuestion[]; warnings: string[] }> {
  const warnings: string[] = [];
  const unitCode = String(input.unitCode).trim();
  const level = input.level ?? inferLevelFromUnit(unitCode);
  const desiredCount = Math.max(1, Math.min(100, Math.floor(input.desiredCount)));
  const learningOutcomes = Array.isArray(input.learningOutcomes) ? input.learningOutcomes : [];
  const scopedLoCodes = extractLoCodesFromLessonContext(input.lessonId, learningOutcomes);
  const lessonToken = input.lessonId.toUpperCase();

  const loadApproved = async () => {
    const approved = await listApprovedQuestionsByScope({
      unit_code: unitCode,
      level,
      format: 'mcq',
      lo_codes: scopedLoCodes.length > 0 ? scopedLoCodes : undefined,
    });
    return approved;
  };

  let approved = await loadApproved();
  let lessonMatched = approved.filter(
    (question) => typeof question.doc_ref === 'string' && question.doc_ref.toUpperCase().includes(lessonToken)
  );

  const needsGeneration = lessonMatched.length + approved.length < desiredCount || (lessonMatched.length === 0 && approved.length === 0);
  if (input.allowAutoGenerate && needsGeneration) {
    const run = await createDefaultQuestionRun({
      unit_code: unitCode,
      level,
      lo_codes: scopedLoCodes.length > 0 ? scopedLoCodes : null,
      target_count: Math.max(desiredCount, 20),
      created_by: null,
    });
    await executeQuestionRun(run.id);
    warnings.push(`Strict question run generated for scope (run ${run.id}).`);
    approved = await loadApproved();
    lessonMatched = approved.filter(
      (question) => typeof question.doc_ref === 'string' && question.doc_ref.toUpperCase().includes(lessonToken)
    );
  }

  const primaryPool = lessonMatched.length > 0 ? lessonMatched : approved;
  if (primaryPool.length === 0) {
    warnings.push('Strict bank has no approved MCQs for this lesson scope.');
    return { success: false, questions: [], warnings };
  }

  const unit = await getSyllabusUnit(unitCode);
  if (!unit) {
    const random = [...primaryPool].sort(() => Math.random() - 0.5).slice(0, desiredCount);
    const mapped = random
      .map((item, index) => toQuizQuestion(item, index, input.lessonId, input.section))
      .filter((item): item is QuizQuestion => Boolean(item));
    if (mapped.length === 0) {
      warnings.push('Strict bank questions did not satisfy quiz schema requirements.');
      return { success: false, questions: [], warnings };
    }
    return { success: true, questions: mapped, warnings };
  }

  const scopedLos = scopedLoCodes.length > 0
    ? unit.learning_outcomes.filter((lo) => scopedLoCodes.includes(lo.lo_code))
    : unit.learning_outcomes;
  const scopedAcs = scopedLos.flatMap((lo) => lo.assessment_criteria);
  const approvedByAc = buildApprovedByAc(primaryPool);

  const weightedAcKeys = buildWeightedAcSelection({
    acs: scopedAcs,
    coverage: scopedAcs.map((ac) => ({
      ac_key: `${ac.lo_code}|${ac.ac_code}`,
      lo_code: ac.lo_code,
      ac_code: ac.ac_code,
      approved_count: (approvedByAc.get(`${ac.lo_code}|${ac.ac_code}`) ?? []).length,
    })),
    count: desiredCount,
  });

  const selected = selectQuestionsForQuiz({
    desiredCount,
    weightedAcKeys,
    approvedByAcKey: approvedByAc,
    fallbackPool: primaryPool,
  }).selected;

  const mapped = selected
    .map((item, index) => toQuizQuestion(item, index, input.lessonId, input.section))
    .filter((item): item is QuizQuestion => Boolean(item));

  if (mapped.length === 0) {
    warnings.push('Strict selection returned no valid 4-option MCQs.');
    return { success: false, questions: [], warnings };
  }
  if (mapped.length < desiredCount) {
    warnings.push(`Strict selection shortfall: requested ${desiredCount}, built ${mapped.length}.`);
  }

  return {
    success: true,
    questions: mapped,
    warnings,
  };
}

