import { NextRequest, NextResponse } from 'next/server';
import { listQuestionsByScope } from '@/lib/questions/bankRepo';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../_utils';

export async function GET(request: NextRequest) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const unitCode = String(searchParams.get('unit_code') ?? '').trim();
    const level = Number(searchParams.get('level') ?? 2);
    const loCodesRaw = String(searchParams.get('lo_codes') ?? '').trim();
    const status = String(searchParams.get('status') ?? '').trim() || undefined;
    const includeRetired = String(searchParams.get('include_retired') ?? 'false').toLowerCase() === 'true';
    const limit = Number(searchParams.get('limit') ?? 500);

    if (!unitCode || (level !== 2 && level !== 3)) {
      return NextResponse.json(
        { success: false, message: 'unit_code and level (2 or 3) are required.' },
        { status: 400 }
      );
    }

    const loCodes = loCodesRaw
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const questions = await listQuestionsByScope({
      unit_code: unitCode,
      level,
      lo_codes: loCodes.length > 0 ? loCodes : undefined,
      status,
      include_retired: includeRetired,
      limit,
    });

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
    });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
