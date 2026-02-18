import { NextRequest, NextResponse } from 'next/server';
import { listApprovedQuestionCountsByLo } from '@/lib/questions/bankRepo';
import { getSyllabusUnit } from '@/lib/questions/syllabusRepo';

interface Params {
  params: Promise<{ unit_code: string }>;
}

export async function GET(_request: NextRequest, context: Params) {
  try {
    const { unit_code } = await context.params;
    const unit = await getSyllabusUnit(unit_code);
    if (!unit) {
      return NextResponse.json({ error: `Unknown unit ${unit_code}.` }, { status: 404 });
    }

    const countRows = await listApprovedQuestionCountsByLo(unit_code);
    const counts = new Map<string, number>();
    for (const row of countRows) {
      const key = row.lo_code ?? '';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return NextResponse.json({
      los: unit.learning_outcomes.map((lo) => ({
        lo_code: lo.lo_code,
        lo_title: lo.lo_title,
        lo_text_preview: lo.lo_text.slice(0, 180),
        approved_question_count: counts.get(lo.lo_code) ?? 0,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load unit learning outcomes.' },
      { status: 500 }
    );
  }
}
