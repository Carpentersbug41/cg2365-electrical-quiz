import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export type DynamicRuntimeSurface = 'simple_chatbot' | 'dynamic_guided_v2';

export type DynamicRuntimeSessionStatus = 'started' | 'completed' | 'abandoned';

export type DynamicRuntimeSessionTurn = {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'learner' | 'tutor';
  kind: string;
  content: string | null;
  stepId?: string | null;
  phase?: string | null;
  createdAt: string;
  meta?: Record<string, unknown> | null;
};

export type DynamicRuntimeSessionEvent = {
  id: string;
  type:
    | 'session_started'
    | 'user_turn_received'
    | 'assistant_turn_debug'
    | 'phase_transition'
    | 'auto_advance'
    | 'session_completed'
    | 'session_error';
  createdAt: string;
  payload: Record<string, unknown>;
};

export type DynamicRuntimeSession = {
  id: string;
  userId: string | null;
  lessonCode: string;
  lessonVersionId: string | null;
  sourceContext: string;
  runtimeSurface: DynamicRuntimeSurface;
  runtimeVariant: string | null;
  status: DynamicRuntimeSessionStatus;
  currentStepIndex: number | null;
  currentPhase: string | null;
  createdAt: string;
  updatedAt: string;
  thread: DynamicRuntimeSessionTurn[];
  events: DynamicRuntimeSessionEvent[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function createRuntimeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createDynamicRuntimeSessionId(): string {
  return createRuntimeId('dgv2-session');
}

export function createDynamicRuntimeEventId(type: DynamicRuntimeSessionEvent['type']): string {
  return createRuntimeId(`dgv2-${type}`);
}

export function createDynamicRuntimeTurnId(role: DynamicRuntimeSessionTurn['role']): string {
  return createRuntimeId(`dgv2-${role}`);
}

export async function loadDynamicRuntimeSession(sessionId: string): Promise<DynamicRuntimeSession | null> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return null;

  const { data, error } = await adminClient
    .from('dgv2_sessions')
    .select('session_json')
    .eq('id', sessionId)
    .limit(1)
    .maybeSingle<{ session_json: DynamicRuntimeSession }>();

  if (error || !data?.session_json) {
    return null;
  }

  return data.session_json;
}

export async function saveDynamicRuntimeSession(session: DynamicRuntimeSession): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    console.warn('[dgv2-runtime-session] save skipped: admin client unavailable', {
      sessionId: session.id,
      lessonCode: session.lessonCode,
      runtimeSurface: session.runtimeSurface,
    });
    return;
  }

  const { error } = await adminClient.from('dgv2_sessions').upsert(
    {
      id: session.id,
      user_id: session.userId,
      lesson_code: session.lessonCode,
      lesson_version_id: session.lessonVersionId,
      source_context: session.sourceContext,
      runtime_surface: session.runtimeSurface,
      runtime_variant: session.runtimeVariant,
      status: session.status,
      thread_count: session.thread.length,
      event_count: session.events.length,
      current_step_index: session.currentStepIndex,
      current_phase: session.currentPhase,
      session_json: session,
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.warn('[dgv2-runtime-session] session upsert failed', {
      sessionId: session.id,
      lessonCode: session.lessonCode,
      runtimeSurface: session.runtimeSurface,
      error: error.message,
    });
    return;
  }

  const { error: turnsDeleteError } = await adminClient.from('dgv2_session_turns').delete().eq('session_id', session.id);
  if (turnsDeleteError) {
    console.warn('[dgv2-runtime-session] turn delete failed', {
      sessionId: session.id,
      error: turnsDeleteError.message,
    });
    return;
  }

  if (session.thread.length > 0) {
    const { error: turnsInsertError } = await adminClient.from('dgv2_session_turns').insert(
      session.thread.map((turn, turnIndex) => ({
        session_id: session.id,
        turn_id: turn.id,
        turn_index: turnIndex,
        lesson_code: session.lessonCode,
        lesson_version_id: session.lessonVersionId,
        role: turn.role,
        kind: turn.kind,
        content_text: turn.content,
        turn_json: turn,
        created_at: turn.createdAt,
      }))
    );
    if (turnsInsertError) {
      console.warn('[dgv2-runtime-session] turn insert failed', {
        sessionId: session.id,
        error: turnsInsertError.message,
      });
      return;
    }
  }

  const { error: eventsDeleteError } = await adminClient.from('dgv2_session_events').delete().eq('session_id', session.id);
  if (eventsDeleteError) {
    console.warn('[dgv2-runtime-session] event delete failed', {
      sessionId: session.id,
      error: eventsDeleteError.message,
    });
    return;
  }

  if (session.events.length > 0) {
    const { error: eventsInsertError } = await adminClient.from('dgv2_session_events').insert(
      session.events.map((event, eventIndex) => ({
        session_id: session.id,
        event_id: event.id,
        event_index: eventIndex,
        lesson_code: session.lessonCode,
        lesson_version_id: session.lessonVersionId,
        event_type: event.type,
        payload_json: event.payload,
        created_at: event.createdAt,
      }))
    );
    if (eventsInsertError) {
      console.warn('[dgv2-runtime-session] event insert failed', {
        sessionId: session.id,
        error: eventsInsertError.message,
      });
    }
  }
}

export function ensureDynamicRuntimeSession(params: {
  existing: DynamicRuntimeSession | null;
  sessionId: string;
  userId: string | null;
  lessonCode: string;
  lessonVersionId: string | null;
  sourceContext: string;
  runtimeSurface: DynamicRuntimeSurface;
  runtimeVariant: string | null;
  currentStepIndex: number | null;
  currentPhase: string | null;
}): DynamicRuntimeSession {
  const now = new Date().toISOString();

  if (params.existing) {
    return {
      ...params.existing,
      userId: params.userId,
      lessonCode: params.lessonCode,
      lessonVersionId: params.lessonVersionId,
      sourceContext: params.sourceContext,
      runtimeSurface: params.runtimeSurface,
      runtimeVariant: params.runtimeVariant,
      currentStepIndex: params.currentStepIndex,
      currentPhase: params.currentPhase,
      updatedAt: now,
    };
  }

  return {
    id: params.sessionId,
    userId: params.userId,
    lessonCode: params.lessonCode,
    lessonVersionId: params.lessonVersionId,
    sourceContext: params.sourceContext,
    runtimeSurface: params.runtimeSurface,
    runtimeVariant: params.runtimeVariant,
    status: 'started',
    currentStepIndex: params.currentStepIndex,
    currentPhase: params.currentPhase,
    createdAt: now,
    updatedAt: now,
    thread: [],
    events: [],
  };
}

export function appendDynamicRuntimeTurn(
  session: DynamicRuntimeSession,
  turn: DynamicRuntimeSessionTurn
): DynamicRuntimeSession {
  return {
    ...session,
    updatedAt: turn.createdAt,
    thread: [...session.thread, turn],
  };
}

export function appendDynamicRuntimeEvent(
  session: DynamicRuntimeSession,
  event: DynamicRuntimeSessionEvent
): DynamicRuntimeSession {
  return {
    ...session,
    updatedAt: event.createdAt,
    events: [...session.events, event],
  };
}

export function sanitizeEventPayload(payload: unknown): Record<string, unknown> {
  if (!isRecord(payload)) return {};
  return payload;
}
