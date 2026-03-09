import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getV2PublishedLessonRecordByCode } from '@/lib/v2/publishedLessons';
import { listV2PublishedQuizQuestions } from '@/lib/v2/questionBank';
import { extractV2QuizQuestionsFromLesson } from '@/lib/v2/questionRuntime';
import V2RuntimeEventTracker from '@/components/v2/V2RuntimeEventTracker';
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
  const questions =
    questionsFromBank.length > 0 ? questionsFromBank : extractV2QuizQuestionsFromLesson(lesson);

  return (
    <V2Shell title="V2 Quiz" subtitle={lesson.id}>
      <V2RuntimeEventTracker lessonId={lesson.id} eventType="quiz_started" />
      <p>
        <Link href={`/v2/learn/${encodeURIComponent(lesson.id)}`}>Back to lesson</Link>
      </p>
      <V2QuizRunner lessonId={lesson.id} questions={questions} />
    </V2Shell>
  );
}
