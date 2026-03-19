import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';
import { lesson2034AFrame } from './2365/lesson2034A';
import { lesson20413AFrame } from './2365/lesson20413A';

const FRAME_MAP: Record<string, GuidedChunkFrame> = {
  '203-4A': lesson2034AFrame,
  '204-13A': lesson20413AFrame,
};

export function getGuidedChunkFrameByCode(lessonCode: string): GuidedChunkFrame | null {
  return FRAME_MAP[lessonCode] ?? null;
}
