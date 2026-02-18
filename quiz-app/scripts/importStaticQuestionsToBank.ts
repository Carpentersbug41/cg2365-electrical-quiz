import { createSupabaseAdminClient } from '../src/lib/supabase/admin';
import { allTaggedQuestions } from '../src/data/questions';
import { computeQuestionHash } from '../src/lib/questions/hash';

function inferUnitCode(learningOutcomeId: string | undefined): string {
  if (!learningOutcomeId) return 'unknown';
  const match = learningOutcomeId.match(/^(\d{3})-/);
  return match?.[1] ?? 'unknown';
}

function inferLoCode(learningOutcomeId: string | undefined): string | null {
  if (!learningOutcomeId) return null;
  const match = learningOutcomeId.match(/-(LO\d+)$/i);
  return match?.[1]?.toUpperCase() ?? null;
}

function inferLevel(unitCode: string): 2 | 3 {
  return unitCode.startsWith('6') ? 3 : 2;
}

function inferDifficulty(value: unknown): 'easy' | 'med' | 'hard' {
  const numeric = typeof value === 'number' ? value : 3;
  if (numeric <= 2) return 'easy';
  if (numeric >= 5) return 'hard';
  return 'med';
}

async function main() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error('Supabase admin client is unavailable.');
  }

  const rows = allTaggedQuestions
    .filter((question) => Array.isArray(question.options) && question.options.length >= 2)
    .map((question) => {
      const learningOutcomeId = typeof question.learningOutcomeId === 'string' ? question.learningOutcomeId : undefined;
      const unitCode = inferUnitCode(learningOutcomeId);
      const loCode = inferLoCode(learningOutcomeId);
      const correct = question.options[question.correctAnswer] ?? question.options[0];
      const hash = computeQuestionHash({
        stem: question.question,
        options: question.options,
        correct,
        unit_code: unitCode,
        lo_code: loCode,
        ac_code: null,
        format: 'mcq',
      });

      return {
        unit_code: unitCode,
        lo_code: loCode,
        ac_code: null,
        level: inferLevel(unitCode),
        difficulty: inferDifficulty(question.difficulty),
        format: 'mcq',
        stem: question.question,
        options: question.options,
        correct,
        rationale: question.explanation ?? null,
        tags: Array.isArray(question.tags) ? question.tags : [],
        source: 'static',
        status: 'approved',
        hash,
        version: 1,
      };
    });

  const { data, error } = await supabase.from('question_items').upsert(rows, { onConflict: 'hash' }).select('id');
  if (error) {
    throw new Error(error.message);
  }

  console.log(`Imported/upserted ${data?.length ?? 0} static questions into question_items.`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
