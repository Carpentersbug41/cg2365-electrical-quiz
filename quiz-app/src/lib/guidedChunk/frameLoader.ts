import { getGuidedChunkFrameByCode } from '@/data/guided-chunk';
import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';
import { loadGeneratedGuidedChunkFrame } from '@/lib/guidedChunk/generatedFrameStore';
import { loadGuidedChunkVersionFrame, loadPublishedGuidedChunkFrame } from '@/lib/guidedChunk/versionStore';

type LoadGuidedChunkFrameOptions = {
  previewVersionId?: string | null;
  allowGeneratedFallback?: boolean;
};

export async function loadGuidedChunkFrame(
  lessonCode: string,
  options?: LoadGuidedChunkFrameOptions
): Promise<GuidedChunkFrame | null> {
  if (options?.previewVersionId) {
    return loadGuidedChunkVersionFrame(options.previewVersionId);
  }

  return (
    (await loadPublishedGuidedChunkFrame(lessonCode)) ??
    (options?.allowGeneratedFallback ? await loadGeneratedGuidedChunkFrame(lessonCode) : null) ??
    getGuidedChunkFrameByCode(lessonCode)
  );
}
