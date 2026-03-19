import { NextRequest, NextResponse } from 'next/server';
import { generateGuidedChunkFrame } from '@/lib/generation/guidedChunk';
import { saveGeneratedGuidedChunkFrame } from '@/lib/guidedChunk/generatedFrameStore';
import { createGuidedLessonDraftVersion } from '@/lib/guidedChunk/versionStore';
import { guardV2AdminAccess, getV2ActorUserId } from '@/lib/v2/admin/api';

type GenerateGuidedChunkRequest = {
  lessonCode?: string;
  title?: string;
  unit?: string;
  topic?: string;
  sourceText?: string;
  sourceRefs?: string[];
  targetAudience?: string;
  curriculum?: 'cg2365' | 'gcse-science-biology' | 'gcse-science-physics' | 'gcse-biology' | 'gcse-physics';
  lessonProfileNotes?: string;
};

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  let body: GenerateGuidedChunkRequest;

  try {
    body = (await request.json()) as GenerateGuidedChunkRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const lessonCode = body.lessonCode?.trim();
  const title = body.title?.trim();
  const unit = body.unit?.trim();
  const topic = body.topic?.trim();
  const sourceText = body.sourceText?.trim();

  if (!lessonCode || !title || !unit || !topic || !sourceText) {
    return NextResponse.json(
      { error: 'lessonCode, title, unit, topic, and sourceText are required.' },
      { status: 400 }
    );
  }

  try {
    const actorUserId = await getV2ActorUserId(request);
    const result = await generateGuidedChunkFrame({
      lessonCode,
      title,
      unit,
      topic,
      sourceText,
      sourceRefs: Array.isArray(body.sourceRefs) ? body.sourceRefs : undefined,
      targetAudience: body.targetAudience?.trim(),
      curriculum: body.curriculum,
      lessonProfileNotes: body.lessonProfileNotes?.trim(),
    });
    await saveGeneratedGuidedChunkFrame(result.frame, {
      curriculum: body.curriculum ?? null,
      qualityScore: result.score?.total ?? null,
      grade: result.score?.grade ?? null,
    });
    const version = await createGuidedLessonDraftVersion({
      frame: result.frame,
      curriculum: body.curriculum ?? null,
      qualityScore: result.score?.total ?? null,
      grade: result.score?.grade ?? null,
      report: result.score ?? null,
      validation: result.validation ? { passed: result.validation.passed, issues: result.validation.issues } : null,
      createdBy: actorUserId,
      source: 'ai',
    });

    return NextResponse.json({
      ...result,
      version,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Guided chunk generation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
