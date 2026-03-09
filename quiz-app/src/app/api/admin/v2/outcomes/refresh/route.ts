import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { refreshV2DailyMetrics } from '@/lib/v2/outcomes/aggregates';

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

function parseDays(raw: string | null): number {
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, value);
}

function buildStartDate(days: number): string {
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function buildEndDate(): string {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const days = parseDays(request.nextUrl.searchParams.get('days'));
    const startDate = buildStartDate(days);
    const endDate = buildEndDate();
    const result = await refreshV2DailyMetrics(adminClient, { startDate, endDate });

    return NextResponse.json({
      success: true,
      window: {
        days,
        start_date: startDate,
        end_date: endDate,
      },
      result,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
