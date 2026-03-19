import { NextRequest, NextResponse } from 'next/server';
import { getDynamicLessonVersion } from '@/lib/dynamicGuidedV2/versionStore';

interface Params {
  params: Promise<{ versionId: string }>;
}

export async function GET(_request: NextRequest, context: Params) {
  const { versionId } = await context.params;
  const version = await getDynamicLessonVersion(versionId);
  if (!version) {
    return NextResponse.json({ success: false, message: 'Version not found.' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    summary: version.summary,
    lesson: version.lesson,
    phaseArtifacts: version.phaseArtifacts,
    sourceRefs: version.sourceRefs,
  });
}
