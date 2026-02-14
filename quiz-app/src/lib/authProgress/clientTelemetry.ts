import { AttemptPayload, LessonCompletePayload } from './types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

async function getAccessToken(): Promise<string | null> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.access_token) {
    return null;
  }

  return data.session.access_token;
}

async function sendAuthedRequest(path: string, payload?: unknown): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    return;
  }

  const response = await fetch(path, {
    method: payload ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
    keepalive: true,
  });

  if (response.ok || response.status === 401 || response.status === 404) {
    return;
  }

  const body = await response.text();
  throw new Error(`Request failed (${response.status}): ${body}`);
}

export async function logAttempt(payload: AttemptPayload): Promise<void> {
  try {
    await sendAuthedRequest('/api/v1/attempts', payload);
  } catch (error) {
    console.warn('Attempt logging failed:', error);
  }
}

export async function markLessonStarted(lessonId: string): Promise<void> {
  try {
    await sendAuthedRequest('/api/v1/progress/lesson-start', { lessonId });
  } catch (error) {
    console.warn('Lesson-start logging failed:', error);
  }
}

export async function markLessonCompleted(payload: LessonCompletePayload): Promise<void> {
  try {
    await sendAuthedRequest('/api/v1/progress/lesson-complete', payload);
  } catch (error) {
    console.warn('Lesson-complete logging failed:', error);
  }
}

