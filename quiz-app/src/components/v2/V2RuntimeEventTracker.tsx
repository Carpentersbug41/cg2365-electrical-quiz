'use client';

import { useEffect } from 'react';
import { v2AuthedFetch } from '@/lib/v2/client';

interface V2RuntimeEventTrackerProps {
  lessonId: string;
  eventType: 'lesson_started';
}

export default function V2RuntimeEventTracker({ lessonId, eventType }: V2RuntimeEventTrackerProps) {
  useEffect(() => {
    let cancelled = false;

    async function startSession() {
      try {
        await v2AuthedFetch('/api/v2/runtime/lesson-session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            sourceContext: 'v2_runtime_tracker',
          }),
        });
      } catch (error) {
        if (!cancelled) {
          console.warn('[V2 Runtime Event Tracker] Failed to send event:', error);
        }
      }
    }

    void startSession();

    return () => {
      cancelled = true;
    };
  }, [eventType, lessonId]);

  return null;
}
