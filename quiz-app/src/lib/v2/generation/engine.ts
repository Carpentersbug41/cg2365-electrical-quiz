import { FileGenerator } from '@/lib/generation/fileGenerator';
import type { GenerationRequest as LegacyGenerationRequest } from '@/lib/generation/types';
import type { V2Lesson } from '@/lib/v2/contentTypes';

export type V2GenerationRequest = LegacyGenerationRequest;

export async function generateV2LessonDraft(request: V2GenerationRequest): Promise<V2Lesson> {
  const generator = new FileGenerator();
  const generated = await generator.generateLesson(request);
  if (!generated.success || !generated.content) {
    throw new Error(generated.error || 'Generation pipeline failed to produce lesson content.');
  }
  return generated.content as V2Lesson;
}
