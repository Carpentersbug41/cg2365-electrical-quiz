import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getV2PublishedLessonByCode } from '@/lib/v2/publishedLessons';
import V2Shell from '@/components/v2/V2Shell';
import V2RuntimeEventTracker from '@/components/v2/V2RuntimeEventTracker';
import type {
  V2Block as Block,
  V2DiagramBlockContent as DiagramBlockContent,
  V2ExplanationBlockContent as ExplanationBlockContent,
  V2GuidedPracticeBlockContent as GuidedPracticeBlockContent,
  V2MicrobreakContent as MicrobreakContent,
  V2OutcomesBlockContent as OutcomesBlockContent,
  V2PracticeBlockContent as PracticeBlockContent,
  V2SocraticBlockContent as SocraticBlockContent,
  V2SpacedReviewBlockContent as SpacedReviewBlockContent,
  V2VocabBlockContent as VocabBlockContent,
  V2WorkedExampleBlockContent as WorkedExampleBlockContent,
} from '@/lib/v2/contentTypes';

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function V2LessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = await getV2PublishedLessonByCode(lessonId);
  if (!lesson) notFound();

  return (
    <V2Shell title={lesson.title} subtitle={lesson.id}>
      <V2RuntimeEventTracker lessonId={lesson.id} eventType="lesson_started" />
      <p>
        <Link href="/v2/learn">Back to V2 Lessons</Link>
      </p>
      <p>
        <Link href={`/v2/quiz/${encodeURIComponent(lesson.id)}`}>Start V2 Quiz</Link>
      </p>
      <p>
        <Link href="/v2/review">Open V2 Review Queue</Link> | <Link href="/v2/progress">Open V2 Progress</Link>
      </p>
      <h1>{lesson.title}</h1>
      <p>{lesson.id}</p>
      <p>{lesson.description}</p>

      <h2>Learning Outcomes</h2>
      <ul>
        {lesson.learningOutcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>

      <h2>Blocks</h2>
      <ol>
        {lesson.blocks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((block) => (
            <li key={block.id}>
              <BlockRenderer block={block} />
            </li>
          ))}
      </ol>
    </V2Shell>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === 'outcomes') {
    const content = block.content as OutcomesBlockContent;
    return (
      <section>
        <h3>{block.id} (outcomes)</h3>
        <ul>
          {content.outcomes.map((outcome, index) => (
            <li key={`${block.id}-${index}`}>{outcome.text}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === 'vocab') {
    const content = block.content as VocabBlockContent;
    return (
      <section>
        <h3>{block.id} (vocab)</h3>
        <ul>
          {content.terms.map((term, index) => (
            <li key={`${block.id}-${index}`}>
              <strong>{term.term}:</strong> {term.definition}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === 'explanation') {
    const content = block.content as ExplanationBlockContent;
    return (
      <section>
        <h3>{block.id} (explanation)</h3>
        <h4>{content.title}</h4>
        <p>{content.content}</p>
      </section>
    );
  }

  if (block.type === 'practice') {
    const content = block.content as PracticeBlockContent;
    return (
      <section>
        <h3>{block.id} (practice)</h3>
        <h4>{content.title}</h4>
        <ol>
          {content.questions.map((question) => (
            <li key={question.id}>{question.questionText}</li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === 'spaced-review') {
    const content = block.content as SpacedReviewBlockContent;
    return (
      <section>
        <h3>{block.id} (spaced-review)</h3>
        <h4>{content.title}</h4>
        <ol>
          {content.questions.map((question) => (
            <li key={question.id}>{question.questionText}</li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === 'worked-example') {
    const content = block.content as WorkedExampleBlockContent;
    return (
      <section>
        <h3>{block.id} (worked-example)</h3>
        <h4>{content.title}</h4>
        <p>{content.given}</p>
        <ol>
          {content.steps.map((step) => (
            <li key={`${block.id}-${step.stepNumber}`}>
              <p>{step.description}</p>
              {step.formula && <p>Formula: {step.formula}</p>}
              {step.calculation && <p>Calculation: {step.calculation}</p>}
              {step.result && <p>Result: {step.result}</p>}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === 'guided-practice') {
    const content = block.content as GuidedPracticeBlockContent;
    return (
      <section>
        <h3>{block.id} (guided-practice)</h3>
        <h4>{content.title}</h4>
        <p>{content.problem}</p>
        <ol>
          {content.steps.map((step) => (
            <li key={`${block.id}-${step.stepNumber}`}>{step.prompt}</li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === 'diagram') {
    const content = block.content as DiagramBlockContent;
    return (
      <section>
        <h3>{block.id} (diagram)</h3>
        <h4>{content.title}</h4>
        <p>{content.description}</p>
        {content.imageUrl && <p>Image: {content.imageUrl}</p>}
        {content.videoUrl && <p>Video: {content.videoUrl}</p>}
        {Array.isArray(content.elementIds) && content.elementIds.length > 0 && (
          <p>Elements: {content.elementIds.join(', ')}</p>
        )}
      </section>
    );
  }

  if (block.type === 'microbreak') {
    const content = block.content as MicrobreakContent;
    return (
      <section>
        <h3>{block.id} (microbreak)</h3>
        <p>{content.breakType === 'rest' ? 'Rest break' : `Game: ${content.gameType}`}</p>
      </section>
    );
  }

  if (block.type === 'socratic') {
    const content = block.content as SocraticBlockContent;
    return (
      <section>
        <h3>{block.id} (socratic)</h3>
        <h4>{content.title}</h4>
        <p>Questions: {content.questionCount}</p>
      </section>
    );
  }

  return (
    <section>
      <h3>{block.id} ({block.type})</h3>
      <p>Block renderer for this type is pending.</p>
    </section>
  );
}
