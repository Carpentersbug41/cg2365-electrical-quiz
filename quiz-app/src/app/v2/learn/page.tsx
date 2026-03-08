import Link from 'next/link';
import { listV2PublishedLessons } from '@/lib/v2/publishedLessons';
import V2Shell from '@/components/v2/V2Shell';

export default async function V2LearnPage() {
  const lessons = await listV2PublishedLessons('gcse-science-biology');

  return (
    <V2Shell title="V2 Lessons" subtitle="Source: v2_lesson_versions (published only)">
      {lessons.length === 0 ? (
        <p>No V2 lessons yet.</p>
      ) : (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <p>{lesson.id}</p>
              <p>{lesson.title}</p>
              <p>
                <Link href={`/v2/learn/${encodeURIComponent(lesson.id)}`}>Open lesson</Link>
              </p>
            </li>
          ))}
        </ul>
      )}
      <p><Link href="/v2">Back to V2 Home</Link></p>
    </V2Shell>
  );
}
