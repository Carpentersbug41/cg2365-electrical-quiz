import { NextResponse } from 'next/server';
import { listApprovedQuestionCountsByUnit } from '@/lib/questions/bankRepo';
import { getLatestSyllabusUnits } from '@/lib/questions/syllabusRepo';

export async function GET() {
  try {
    const [units, approvedRows] = await Promise.all([
      getLatestSyllabusUnits(),
      listApprovedQuestionCountsByUnit(),
    ]);

    const countsByUnit = new Map<string, { total: number; by_level: Record<string, number> }>();
    for (const row of approvedRows) {
      const entry = countsByUnit.get(row.unit_code) ?? { total: 0, by_level: { '2': 0, '3': 0 } };
      entry.total += 1;
      entry.by_level[String(row.level)] = (entry.by_level[String(row.level)] ?? 0) + 1;
      countsByUnit.set(row.unit_code, entry);
    }

    return NextResponse.json({
      units: units.map((unit) => {
        const counts = countsByUnit.get(unit.unit_code) ?? { total: 0, by_level: { '2': 0, '3': 0 } };
        return {
          unit_code: unit.unit_code,
          unit_title: unit.unit_title,
          level_min: unit.level_min,
          level_max: unit.level_max,
          approved_question_count: counts.total,
          approved_by_level: {
            2: counts.by_level['2'] ?? 0,
            3: counts.by_level['3'] ?? 0,
          },
        };
      }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load quiz catalog.' },
      { status: 500 }
    );
  }
}
