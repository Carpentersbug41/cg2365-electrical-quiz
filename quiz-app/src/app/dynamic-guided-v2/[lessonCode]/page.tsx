import { notFound } from 'next/navigation';
import { readLatestDynamicGeneratedLessonArtifact } from '@/lib/dynamicGuidedV2/generatedLessonArtifactStore';
import { loadDynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/loader';
import { getCurrentDynamicLessonVersionByCode, getDynamicLessonVersion } from '@/lib/dynamicGuidedV2/versionStore';
import { DynamicGuidedV2LessonClient } from './DynamicGuidedV2LessonClient';

export default async function DynamicGuidedV2LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonCode: string }>;
  searchParams?: Promise<{ versionId?: string }>;
}) {
  const { lessonCode } = await params;
  const normalizedLessonCode = lessonCode.trim().toUpperCase();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const versionId =
    typeof resolvedSearchParams?.versionId === 'string' && resolvedSearchParams.versionId.trim()
      ? resolvedSearchParams.versionId.trim()
      : null;
  const explicitVersion = versionId ? await getDynamicLessonVersion(versionId) : null;
  const currentVersion = explicitVersion ? null : await getCurrentDynamicLessonVersionByCode(normalizedLessonCode);
  const generatedArtifact = explicitVersion || currentVersion
    ? null
    : readLatestDynamicGeneratedLessonArtifact(normalizedLessonCode);
  const resolvedVersion = explicitVersion ?? currentVersion;
  const lesson = resolvedVersion?.lesson ?? generatedArtifact?.lesson ?? loadDynamicGuidedV2Lesson(normalizedLessonCode);
  const resolvedVersionId = explicitVersion
    ? versionId
    : resolvedVersion?.summary.id ?? generatedArtifact?.version?.id ?? null;

  if (!lesson || lesson.lessonCode !== normalizedLessonCode) {
    notFound();
  }

  return <DynamicGuidedV2LessonClient lesson={lesson} versionId={resolvedVersionId} />;
}
