import type { Metadata } from 'next';
import GuidedChunkMockup from './GuidedChunkMockup';

export const metadata: Metadata = {
  title: 'Guided Chunk Lesson Mockup',
};

export default function GuidedChunkLessonMockupPage() {
  return <GuidedChunkMockup />;
}
