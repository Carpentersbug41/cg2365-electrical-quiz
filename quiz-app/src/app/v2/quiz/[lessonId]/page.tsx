import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getV2PublishedLessonRecordByCode } from '@/lib/v2/publishedLessons';
import { listV2PublishedQuizQuestions } from '@/lib/v2/questionBank';
import V2QuizRunner from '@/components/v2/V2QuizRunner';
import V2Shell from '@/components/v2/V2Shell';

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function V2QuizPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lessonRecord = await getV2PublishedLessonRecordByCode(lessonId);
  if (!lessonRecord) notFound();

  const questionsFromBank = await listV2PublishedQuizQuestions(lessonRecord.lessonId);
  const lesson = lessonRecord.lesson;

  return (
    <V2Shell title="V2 Quiz" subtitle={lesson.id}>
      <p>
        <Link href={`/v2/learn/${encodeURIComponent(lesson.id)}`}>Back to lesson</Link>
      </p>
      {questionsFromBank.length === 0 ? (
        <p>This lesson has no published question-bank coverage yet. Quiz runtime is blocked until questions are published.</p>
      ) : (
        <V2QuizRunner lessonId={lesson.id} questions={questionsFromBank} />
      )}
    </V2Shell>
  );
}
