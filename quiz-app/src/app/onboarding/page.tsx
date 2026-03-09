'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { courseHref } from '@/lib/routing/courseHref';

type OnboardingRole = 'assistant' | 'user';

type OnboardingMessage = {
  role: OnboardingRole;
  content: string;
};

const MIN_RESPONSES_TO_ENABLE_BUTTON = 5;
const TARGET_INTERVIEW_RESPONSES = 10;
const FINAL_WRAP_UP_PROMPT =
  'Thanks, that is enough to personalize your tutor. Please click "Complete Onboarding" when you are ready.';

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const client = getSupabaseBrowserClient();
  const session = client ? await client.auth.getSession() : null;
  const token = session?.data.session?.access_token ?? null;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(path, {
    ...init,
    headers,
  });
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<OnboardingMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalSummary, setFinalSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nextTarget = useMemo(() => {
    const next = searchParams.get('next');
    return next && next.startsWith('/') ? next : courseHref('/learn');
  }, [searchParams]);

  const startInterview = async () => {
    setError(null);
    setIsLoadingQuestion(true);
    try {
      const qResponse = await authedFetch('/api/onboarding/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'next-question', transcript: [] }),
      });
      const qData = await qResponse.json();
      if (!qResponse.ok || qData.success === false || typeof qData.question !== 'string') {
        throw new Error(qData.message ?? 'Failed to start onboarding interview.');
      }
      setMessages([{ role: 'assistant', content: qData.question }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start onboarding.');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setError(null);
      try {
        const statusResponse = await authedFetch('/api/onboarding/profile', { cache: 'no-store' });
        const statusData = await statusResponse.json();
        if (!statusResponse.ok || statusData.success === false) {
          throw new Error(statusData.message ?? 'Failed to load onboarding status.');
        }

        if (cancelled) return;

        if (statusData.onboardingComplete) {
          router.replace(nextTarget);
          return;
        }

        if (cancelled) return;
        if (messages.length === 0) {
          await startInterview();
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to start onboarding.');
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [nextTarget, router]);

  const requestNextQuestion = async (transcript: OnboardingMessage[]) => {
    setIsLoadingQuestion(true);
    setError(null);
    try {
      const response = await authedFetch('/api/onboarding/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'next-question',
          transcript,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false || typeof data.question !== 'string') {
        throw new Error(data.message ?? 'Failed to fetch next onboarding question.');
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.question }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch next onboarding question.');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const finalizeWithTranscript = async (transcript: OnboardingMessage[]) => {
    setIsFinalizing(true);
    setError(null);
    try {
      const response = await authedFetch('/api/onboarding/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finalize',
          transcript,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false || typeof data.profileSummary !== 'string') {
        throw new Error(data.message ?? 'Failed to finalize onboarding.');
      }
      setFinalSummary(data.profileSummary);
      setTimeout(() => {
        router.replace(nextTarget);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize onboarding.');
    } finally {
      setIsFinalizing(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoadingQuestion || isFinalizing) return;

    const userMessage: OnboardingMessage = {
      role: 'user',
      content: input.trim().slice(0, 1000),
    };
    const transcript = [...messages, userMessage];
    const userTurnCountAfterSubmit = transcript.filter((msg) => msg.role === 'user').length;
    const hasWrapUpPrompt = transcript.some(
      (msg) => msg.role === 'assistant' && msg.content === FINAL_WRAP_UP_PROMPT
    );

    if (userTurnCountAfterSubmit >= TARGET_INTERVIEW_RESPONSES) {
      if (!hasWrapUpPrompt) {
        const transcriptWithWrapUp = [
          ...transcript,
          { role: 'assistant' as const, content: FINAL_WRAP_UP_PROMPT },
        ];
        setMessages(transcriptWithWrapUp);
      } else {
        setMessages(transcript);
      }
      setInput('');
      return;
    }

    setMessages(transcript);
    setInput('');

    await requestNextQuestion(transcript);
  };

  const onFinalize = async () => {
    if (isFinalizing || isLoadingQuestion) return;
    await finalizeWithTranscript(messages);
  };

  const userTurnCount = messages.filter((msg) => msg.role === 'user').length;
  const canFinalize = userTurnCount >= MIN_RESPONSES_TO_ENABLE_BUTTON && !isLoadingQuestion && !isFinalizing;
  const interviewCapped = userTurnCount >= TARGET_INTERVIEW_RESPONSES;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Tutor Onboarding</p>
          <h1 className="mt-2 text-2xl font-bold">Quick Interview</h1>
          <p className="mt-2 text-sm text-slate-300">
            Answer a few short questions so the AI tutor can adapt tone, pacing, and examples to you. We also ask about hobbies and interests.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <div className="max-h-[55vh] space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4">
            {messages.length === 0 && !isLoadingQuestion && (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Start the interview to let the tutor ask its first question.
                </p>
                <button
                  type="button"
                  onClick={() => void startInterview()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Start interview
                </button>
              </div>
            )}
            {messages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}-${message.content.slice(0, 12)}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-700 bg-slate-900 text-slate-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoadingQuestion && (
              <p className="text-xs text-slate-400">Interviewer is preparing the next question...</p>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your answer..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              disabled={isLoadingQuestion || isFinalizing}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoadingQuestion || isFinalizing}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              Responses captured: {userTurnCount}/{TARGET_INTERVIEW_RESPONSES}
            </p>
            <button
              type="button"
              onClick={onFinalize}
              disabled={!canFinalize}
              className="rounded-lg border border-emerald-500 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {isFinalizing ? 'Finalizing...' : 'Complete Onboarding'}
            </button>
          </div>

          {error && (
            <div className="mt-3 space-y-2 text-sm text-rose-300">
              <p>{error}</p>
              {messages.length === 0 && (
                <button
                  type="button"
                  onClick={() => void startInterview()}
                  className="rounded-lg border border-rose-400 px-4 py-2 text-sm font-semibold text-rose-200"
                >
                  Retry interview start
                </button>
              )}
            </div>
          )}
          {interviewCapped && (
            <p className="mt-3 text-sm text-emerald-300">
              Interview complete. Click <strong>Complete Onboarding</strong> to finish.
            </p>
          )}
          {finalSummary && (
            <div className="mt-3 rounded-lg border border-emerald-700 bg-emerald-900/30 p-3 text-sm text-emerald-200">
              <p className="font-semibold">Profile saved</p>
              <p className="mt-1">{finalSummary}</p>
              <p className="mt-1 text-xs text-emerald-300">Redirecting...</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
