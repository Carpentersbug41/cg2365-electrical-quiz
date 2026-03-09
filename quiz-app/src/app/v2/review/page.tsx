'use client';

import { useEffect, useState } from 'react';
import { v2AuthedFetch } from '@/lib/v2/client';
import V2Shell from '@/components/v2/V2Shell';

interface ReviewItem {
  id: string;
  questionStableId: string;
  status: 'due' | 'completed' | 'resolved';
  dueAt: string;
  timesWrong: number;
  timesRight: number;
  lessonId: string | null;
  lessonTitle: string | null;
}

export default function V2ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadQueue() {
    setLoading(true);
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/v2/review/queue', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to load review queue.');
      setItems(Array.isArray(payload.items) ? payload.items : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load queue.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadQueue();
  }, []);

  async function completeItem(reviewItemId: string, correct: boolean) {
    setBusyId(reviewItemId);
    setError(null);
    try {
      const response = await v2AuthedFetch('/api/v2/review/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewItemId, correct }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to update review item.');
      await loadQueue();
    } catch (completeError) {
      setError(completeError instanceof Error ? completeError.message : 'Failed to update item.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <V2Shell title="V2 Review Queue" subtitle="Due and pending V2 review items">
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && <p>No due V2 review items.</p>}
      {error && <p>{error}</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p>{item.lessonId ?? 'Unknown lesson'} - {item.lessonTitle ?? 'Untitled'}</p>
            <p>{item.questionStableId}</p>
            <p>Status: {item.status}</p>
            <p>Wrong: {item.timesWrong} | Right: {item.timesRight}</p>
            {item.lessonId && (
              <p>
                <a href={`/v2/quiz/${encodeURIComponent(item.lessonId)}`}>
                  Open lesson quiz
                </a>
              </p>
            )}
            <button disabled={busyId === item.id} onClick={() => void completeItem(item.id, true)}>
              Mark Correct
            </button>
            <button disabled={busyId === item.id} onClick={() => void completeItem(item.id, false)}>
              Still Wrong
            </button>
          </li>
        ))}
      </ul>
    </V2Shell>
  );
}
