import { NextRequest, NextResponse } from 'next/server';
import { guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import {
  deleteDynamicLessonVersion,
  getDynamicLessonVersion,
  listDynamicLessonVersions,
} from '@/lib/dynamicGuidedV2/versionStore';

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const lessonCode = request.nextUrl.searchParams.get('lessonCode')?.trim().toUpperCase() ?? '';
    const versionId = request.nextUrl.searchParams.get('versionId')?.trim() ?? '';

    if (versionId) {
      const version = await getDynamicLessonVersion(versionId);
      if (!version) {
        return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Version not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, version });
    }

    const versions = await listDynamicLessonVersions(lessonCode || undefined);
    return NextResponse.json({ success: true, versions });
  } catch (error) {
    return toV2AdminError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const versionId = request.nextUrl.searchParams.get('versionId')?.trim() ?? '';
    if (!versionId) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'versionId is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteDynamicLessonVersion(versionId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Version not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return toV2AdminError(error);
  }
}
