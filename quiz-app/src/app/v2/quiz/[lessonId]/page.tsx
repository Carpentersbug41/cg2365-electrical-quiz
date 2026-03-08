import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getV2PublishedLessonByCode } from '@/lib/v2/publishedLessons';
import { extractV2QuizQuestionsFromLesson } from '@/lib/v2/lessonQuestions';
import V2QuizRunner from '@/components/v2/V2QuizRunner';
import V2Shell from '@/components/v2/V2Shell';

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function V2QuizPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = await getV2PublishedLessonByCode(lessonId);
  if (!lesson) notFound();

  const questions = extractV2QuizQuestionsFromLesson(lesson);

  return (
    <V2Shell title="V2 Quiz" subtitle={lesson.id}>
      <p>
        <Link href={`/v2/learn/${encodeURIComponent(lesson.id)}`}>Back to lesson</Link>
      </p>
      <V2QuizRunner lessonId={lesson.id} questions={questions} />
    </V2Shell>
  );
}
