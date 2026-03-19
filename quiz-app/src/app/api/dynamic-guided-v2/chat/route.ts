import { NextRequest, NextResponse } from 'next/server';
import { loadDynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/loader';
import { generateDynamicGuidedV2Turn } from '@/lib/dynamicGuidedV2/chat';
import type { DynamicGuidedV2ThreadTurn } from '@/lib/dynamicGuidedV2/types';
import { getDynamicLessonVersion } from '@/lib/dynamicGuidedV2/versionStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lessonCode = typeof body.lessonCode === 'string' ? body.lessonCode : '';
    const versionId = typeof body.versionId === 'string' && body.versionId.trim() ? body.versionId.trim() : null;
    const stepIndex = typeof body.stepIndex === 'number' ? body.stepIndex : -1;
    const learnerMessage = typeof body.learnerMessage === 'string' && body.learnerMessage.trim() ? body.learnerMessage.trim() : undefined;
    const thread = Array.isArray(body.thread) ? (body.thread as DynamicGuidedV2ThreadTurn[]) : [];

    const version = versionId ? await getDynamicLessonVersion(versionId) : null;
    const lesson = version?.lesson ?? loadDynamicGuidedV2Lesson(lessonCode);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });
    }

    const step = lesson.steps[stepIndex];
    if (!step) {
      return NextResponse.json({ error: 'Step not found.' }, { status: 404 });
    }

    const response = await generateDynamicGuidedV2Turn({
      lesson,
      step,
      thread,
      learnerMessage,
    });

    return NextResponse.json({
      lesson: {
        lessonCode: lesson.lessonCode,
        title: lesson.title,
      },
      step: {
        id: step.id,
        title: step.title,
        role: step.role,
        stage: step.stage,
        completionMode: step.completionMode,
        questionText: step.questionText ?? null,
        asset: step.asset ?? null,
      },
      response,
    });
  } catch (error) {
    console.error('[dynamic-guided-v2] chat:error', error);
    return NextResponse.json({ error: 'Unable to generate tutor response.' }, { status: 500 });
  }
}
