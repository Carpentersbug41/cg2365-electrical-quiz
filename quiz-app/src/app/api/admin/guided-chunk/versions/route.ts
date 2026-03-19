import { NextRequest, NextResponse } from 'next/server';
import { listGuidedLessonVersions } from '@/lib/guidedChunk/versionStore';
import { guardV2AdminAccess } from '@/lib/v2/admin/api';

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  return NextResponse.json({
    versions: await listGuidedLessonVersions(),
  });
}
