import GuidedChunkLessonClient from './GuidedChunkLessonClient';

type PageProps = {
  params: Promise<{
    lessonCode: string;
  }>;
  searchParams: Promise<{
    versionId?: string;
    sourceContext?: string;
  }>;
};

export default async function GuidedChunkLessonPage({ params, searchParams }: PageProps) {
  const { lessonCode } = await params;
  const query = await searchParams;
  return (
    <GuidedChunkLessonClient
      lessonCode={lessonCode}
      previewVersionId={typeof query.versionId === 'string' ? query.versionId : undefined}
      sourceContext={typeof query.sourceContext === 'string' ? query.sourceContext : undefined}
    />
  );
}
