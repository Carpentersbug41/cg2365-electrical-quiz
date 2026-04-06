import { NextRequest, NextResponse } from 'next/server';
import { loadDynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/loader';
import { generateDynamicGuidedV2TurnWithDebug } from '@/lib/dynamicGuidedV2/chat';
import {
  appendDynamicRuntimeEvent,
  appendDynamicRuntimeTurn,
  createDynamicRuntimeEventId,
  createDynamicRuntimeTurnId,
  ensureDynamicRuntimeSession,
  loadDynamicRuntimeSession,
  saveDynamicRuntimeSession,
} from '@/lib/dynamicGuidedV2/runtimeSessionStore';
import type { DynamicGuidedV2ThreadTurn } from '@/lib/dynamicGuidedV2/types';
import { getDynamicLessonVersion } from '@/lib/dynamicGuidedV2/versionStore';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId =
      typeof body.sessionId === 'string' && body.sessionId.trim() ? body.sessionId.trim() : '';
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

    const turnResult = await generateDynamicGuidedV2TurnWithDebug({
      lesson,
      step,
      thread,
      learnerMessage,
    });

    const authSession = await getSupabaseSessionFromRequest(request);
    if (sessionId) {
      const existing = await loadDynamicRuntimeSession(sessionId);
      let runtimeSession = ensureDynamicRuntimeSession({
        existing,
        sessionId,
        userId: authSession?.user.id ?? null,
        lessonCode: lesson.lessonCode,
        lessonVersionId: versionId,
        sourceContext: 'dynamic_guided_v2_runtime',
        runtimeSurface: 'dynamic_guided_v2',
        runtimeVariant: null,
        currentStepIndex: stepIndex,
        currentPhase: step.stage,
      });

      if (!existing) {
        runtimeSession = appendDynamicRuntimeEvent(runtimeSession, {
          id: createDynamicRuntimeEventId('session_started'),
          type: 'session_started',
          createdAt: runtimeSession.createdAt,
          payload: {
            lessonCode: lesson.lessonCode,
            lessonVersionId: versionId,
            runtimeSurface: 'dynamic_guided_v2',
          },
        });
      }

      if (learnerMessage) {
        runtimeSession = appendDynamicRuntimeTurn(runtimeSession, {
          id: createDynamicRuntimeTurnId('learner'),
          role: 'learner',
          kind: 'visible_turn',
          content: learnerMessage,
          stepId: step.id,
          phase: step.stage,
          createdAt: new Date().toISOString(),
          meta: {
            stepIndex,
            stage: step.stage,
            role: step.role,
          },
        });
        runtimeSession = appendDynamicRuntimeEvent(runtimeSession, {
          id: createDynamicRuntimeEventId('user_turn_received'),
          type: 'user_turn_received',
          createdAt: new Date().toISOString(),
          payload: {
            stepId: step.id,
            stepIndex,
            stage: step.stage,
            message: learnerMessage,
          },
        });
      }

      const assistantCreatedAt = new Date().toISOString();
      runtimeSession = appendDynamicRuntimeTurn(runtimeSession, {
        id: createDynamicRuntimeTurnId('tutor'),
        role: 'tutor',
        kind: 'visible_turn',
        content: turnResult.response.assistantMessage,
        stepId: step.id,
        phase: step.stage,
        createdAt: assistantCreatedAt,
        meta: {
          stepIndex,
          stage: step.stage,
          role: step.role,
          advance: turnResult.response.advance,
        },
      });
      runtimeSession = appendDynamicRuntimeEvent(runtimeSession, {
        id: createDynamicRuntimeEventId('assistant_turn_debug'),
        type: 'assistant_turn_debug',
        createdAt: assistantCreatedAt,
        payload: {
          stepId: step.id,
          stepIndex,
          stage: step.stage,
          stepRole: step.role,
          systemInstruction: turnResult.debug.systemInstruction,
          prompt: turnResult.debug.prompt,
          conversationHistoryPreview: turnResult.debug.conversationHistoryPreview,
          rawText: turnResult.debug.rawText,
          assistantMessage: turnResult.response.assistantMessage,
          advance: turnResult.response.advance,
        },
      });
      await saveDynamicRuntimeSession(runtimeSession);
    }

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
      response: turnResult.response,
    });
  } catch (error) {
    console.error('[dynamic-guided-v2] chat:error', error);
    return NextResponse.json({ error: 'Unable to generate tutor response.' }, { status: 500 });
  }
}
