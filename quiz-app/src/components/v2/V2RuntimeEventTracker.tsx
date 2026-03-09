'use client';

import { useEffect } from 'react';
import { v2AuthedFetch } from '@/lib/v2/client';

interface V2RuntimeEventTrackerProps {
  lessonId: string;
  eventType: 'lesson_started' | 'quiz_started';
}

export default function V2RuntimeEventTracker({ lessonId, eventType }: V2RuntimeEventTrackerProps) {
  useEffect(() => {
    let cancelled = false;

    async function sendEvent() {
      try {
        await v2AuthedFetch('/api/v2/runtime/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            eventType,
            sourceContext: 'v2_runtime_tracker',
          }),
        });
      } catch (error) {
        if (!cancelled) {
          console.warn('[V2 Runtime Event Tracker] Failed to send event:', error);
        }
      }
    }

    void sendEvent();

    return () => {
      cancelled = true;
    };
  }, [eventType, lessonId]);

  return null;
}
