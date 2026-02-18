import { NextRequest, NextResponse } from 'next/server';
import { createDefaultQuestionRun } from '@/lib/questions/generation/orchestrator';
import { listQuestionRuns } from '@/lib/questions/bankRepo';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../_utils';

export async function GET(request: NextRequest) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const runs = await listQuestionRuns(100);
    return NextResponse.json({ success: true, runs });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      unit_code?: string;
      level?: 2 | 3;
      lo_codes?: string[] | null;
      target_count?: number;
      format_mix?: Record<string, number>;
      difficulty_mix?: Record<string, number>;
    };
    if (!body.unit_code || !body.level || !body.target_count) {
      return NextResponse.json(
        { success: false, code: 'JSON_SCHEMA_FAIL', message: 'unit_code, level, and target_count are required.' },
        { status: 400 }
      );
    }

    const run = await createDefaultQuestionRun({
      unit_code: body.unit_code,
      level: body.level,
      lo_codes: body.lo_codes ?? null,
      target_count: body.target_count,
      format_mix: body.format_mix,
      difficulty_mix: body.difficulty_mix,
      created_by: null,
    });

    return NextResponse.json({ success: true, run_id: run.id, run });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
