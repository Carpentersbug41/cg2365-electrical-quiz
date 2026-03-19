import { NextRequest, NextResponse } from 'next/server';
import { listGcseBiologyPhase1LessonProfiles } from '@/data/v2/gcse/biology/phase1LessonProfiles';
import { generateGuidedChunkFrame } from '@/lib/generation/guidedChunk';
import { saveGeneratedGuidedChunkFrame } from '@/lib/guidedChunk/generatedFrameStore';
import { createGuidedLessonDraftVersion } from '@/lib/guidedChunk/versionStore';
import { getV2ActorUserId, guardV2AdminAccess } from '@/lib/v2/admin/api';

type BatchRequest = {
  lessonCodes?: string[];
};

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  let body: BatchRequest = {};

  try {
    body = (await request.json()) as BatchRequest;
  } catch {
    body = {};
  }

  const allProfiles = listGcseBiologyPhase1LessonProfiles();
  const requestedCodes = new Set((body.lessonCodes ?? []).map((code) => code.trim().toUpperCase()).filter(Boolean));
  const profiles =
    requestedCodes.size > 0
      ? allProfiles.filter((profile) => requestedCodes.has(profile.lessonCode))
      : allProfiles;

  if (profiles.length === 0) {
    return NextResponse.json({ error: 'No matching Biology Phase 1 lesson profiles found.' }, { status: 400 });
  }

  const results: Array<{
    lessonCode: string;
    success: boolean;
    versionId?: string;
    status?: string;
    score?: number;
    grade?: string;
    error?: string;
  }> = [];
  const actorUserId = await getV2ActorUserId(request);

  for (const profile of profiles) {
    try {
      const generated = await generateGuidedChunkFrame({
        lessonCode: `${profile.lessonCode}-gc`,
        title: profile.topic,
        unit: profile.lessonCode.split('-').slice(0, 2).join('-'),
        topic: profile.topic,
        sourceText: `${profile.mustHaveTopics}\n\n${profile.additionalInstructions}`,
        sourceRefs: ['gcse-biology-phase1-batch'],
        targetAudience: 'GCSE Biology learner',
        curriculum: 'gcse-science-biology',
        lessonProfileNotes: profile.additionalInstructions,
      });
      await saveGeneratedGuidedChunkFrame(generated.frame, {
        curriculum: 'gcse-science-biology',
        qualityScore: generated.score?.total ?? null,
        grade: generated.score?.grade ?? null,
      });
      const version = await createGuidedLessonDraftVersion({
        frame: generated.frame,
        curriculum: 'gcse-science-biology',
        qualityScore: generated.score?.total ?? null,
        grade: generated.score?.grade ?? null,
        report: generated.score ?? null,
        validation: generated.validation ? { passed: generated.validation.passed, issues: generated.validation.issues } : null,
        createdBy: actorUserId,
        source: 'ai',
      });
      results.push({
        lessonCode: generated.frame.lessonCode,
        success: true,
        versionId: version.id,
        status: version.status,
        score: generated.score?.total,
        grade: generated.score?.grade,
      });
    } catch (error) {
      results.push({
        lessonCode: profile.lessonCode,
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed.',
      });
    }
  }

  return NextResponse.json({
    count: results.length,
    results,
  });
}
