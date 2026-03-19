import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { GenerationJobError, runGenerationJobById } from '@/lib/v2/generation/runGenerationJob';

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const { jobId } = await context.params;
    if (!jobId) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'jobId is required.' },
        { status: 400 }
      );
    }

    try {
      const result = await runGenerationJobById(adminClient, jobId, 'manual-admin');

      return NextResponse.json({
        success: true,
        message: 'Generation job completed. Draft lesson version created.',
        output: result.output,
      });
    } catch (runError) {
      if (runError instanceof GenerationJobError) {
        return NextResponse.json(
          { success: false, code: runError.code, message: runError.message },
          { status: runError.status }
        );
      }
      throw runError;
    }
  } catch (error) {
    return toV2AdminError(error);
  }
}
