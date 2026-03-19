import { notFound } from 'next/navigation';
import { loadDynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/loader';
import { getDynamicLessonVersion } from '@/lib/dynamicGuidedV2/versionStore';
import { DynamicGuidedV2LessonClient } from './DynamicGuidedV2LessonClient';

export default async function DynamicGuidedV2LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonCode: string }>;
  searchParams?: Promise<{ versionId?: string }>;
}) {
  const { lessonCode } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const versionId =
    typeof resolvedSearchParams?.versionId === 'string' && resolvedSearchParams.versionId.trim()
      ? resolvedSearchParams.versionId.trim()
      : null;
  const version = versionId ? await getDynamicLessonVersion(versionId) : null;
  const lesson = version?.lesson ?? loadDynamicGuidedV2Lesson(lessonCode);

  if (!lesson || lesson.lessonCode !== lessonCode) {
    notFound();
  }

  return <DynamicGuidedV2LessonClient lesson={lesson} versionId={versionId} />;
}
