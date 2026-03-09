'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, Square } from 'lucide-react';
import AudioVisualizer from '@/app/simulations/Echo-Questions/components/AudioVisualizer';
import { useSpeechToText } from '@/app/simulations/Echo-Questions/hooks/useSpeechToText';
import { getAudioContext, speakNativeWithEvents } from '@/app/simulations/Echo-Questions/utils/audioUtils';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSafeAppRedirect, resolveDefaultPostAuthTarget } from '@/lib/onboarding/navigation';

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

async function readJsonPayload<T>(response: Response): Promise<T> {
  const raw = await response.text();
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error('The server returned an invalid response. Please refresh and try again.');
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<OnboardingMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [finalSummary, setFinalSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingAmplitude, setSpeakingAmplitude] = useState(0.06);
  const speechTokenRef = useRef(0);
  const boundaryEnergyRef = useRef(0);
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error: sttError,
  } = useSpeechToText();

  const explicitNextTarget = useMemo(() => {
    const next = searchParams.get('next');
    return isSafeAppRedirect(next) ? next : null;
  }, [searchParams]);

  const resolveNextTarget = async () => {
    if (explicitNextTarget) return explicitNextTarget;
    return (
      (await resolveDefaultPostAuthTarget(async (path, init) => authedFetch(path, init))) ??
      '/v2/learn'
    );
  };

  const redirectToSignIn = () => {
    const nextTarget = explicitNextTarget ? `/onboarding?next=${encodeURIComponent(explicitNextTarget)}` : '/onboarding';
    router.replace(`/auth/sign-in?next=${encodeURIComponent(nextTarget)}`);
  };

  const speakText = (text: string) => {
    const safeText = text.trim();
    if (!safeText) return;

    const token = speechTokenRef.current + 1;
    speechTokenRef.current = token;
    setIsSpeaking(true);
    speakNativeWithEvents(
      safeText,
      () => {
        if (speechTokenRef.current !== token) return;
        setIsSpeaking(false);
        setSpeakingAmplitude(0.06);
        boundaryEnergyRef.current = 0;
      },
      {
        onStart: () => {
          boundaryEnergyRef.current = 0.24;
        },
        onBoundary: () => {
          boundaryEnergyRef.current = Math.min(1, boundaryEnergyRef.current + 0.3);
        },
      }
    );
  };

  const toggleRecording = () => {
    if (isLoadingQuestion || isFinalizing) return;

    if (isListening) {
      stopListening();
      return;
    }

    resetTranscript();
    getAudioContext().resume();
    startListening();
  };

  const startInterview = async () => {
    setError(null);
    setIsLoadingQuestion(true);
    try {
      const qResponse = await authedFetch('/api/onboarding/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'next-question', transcript: [] }),
      });
      if (qResponse.status === 401) {
        redirectToSignIn();
        return;
      }
      const qData = await readJsonPayload<{ success?: boolean; message?: string; question?: string }>(qResponse);
      if (!qResponse.ok || qData.success === false || typeof qData.question !== 'string') {
        throw new Error(qData.message ?? 'Failed to start onboarding interview.');
      }
      setMessages([{ role: 'assistant', content: qData.question }]);
      speakText(qData.question);
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
        if (statusResponse.status === 401) {
          redirectToSignIn();
          return;
        }
        const statusData = await readJsonPayload<{
          success?: boolean;
          message?: string;
          onboardingComplete?: boolean;
        }>(statusResponse);
        if (!statusResponse.ok || statusData.success === false) {
          throw new Error(statusData.message ?? 'Failed to load onboarding status.');
        }

        if (cancelled) return;

        if (statusData.onboardingComplete) {
          const nextTarget = await resolveNextTarget();
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
      } finally {
        if (!cancelled) {
          setIsCheckingStatus(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [explicitNextTarget, router]);

  useEffect(() => {
    const merged = `${transcript}${interimTranscript ? ` ${interimTranscript}` : ''}`.trim();
    if (isListening && merged) {
      setInput(merged);
    }
  }, [interimTranscript, isListening, transcript]);

  useEffect(() => {
    if (!sttError) return;
    setError(`Speech input error: ${sttError}`);
  }, [sttError]);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      boundaryEnergyRef.current *= 0.86;
      setSpeakingAmplitude(Math.min(1, 0.05 + boundaryEnergyRef.current));
      frame = window.requestAnimationFrame(tick);
    };

    if (isSpeaking) {
      frame = window.requestAnimationFrame(tick);
    } else {
      setSpeakingAmplitude(0.06);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isSpeaking]);

  useEffect(() => {
    return () => {
      speechTokenRef.current += 1;
      setIsSpeaking(false);
      boundaryEnergyRef.current = 0;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      if (response.status === 401) {
        redirectToSignIn();
        return;
      }
      const data = await readJsonPayload<{ success?: boolean; message?: string; question?: string }>(response);
      if (!response.ok || data.success === false || typeof data.question !== 'string') {
        throw new Error(data.message ?? 'Failed to fetch next onboarding question.');
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.question }]);
      speakText(data.question);
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
      if (response.status === 401) {
        redirectToSignIn();
        return;
      }
      const data = await readJsonPayload<{ success?: boolean; message?: string; profileSummary?: string }>(
        response
      );
      if (!response.ok || data.success === false || typeof data.profileSummary !== 'string') {
        throw new Error(data.message ?? 'Failed to finalize onboarding.');
      }
      setFinalSummary(data.profileSummary);
      const nextTarget = await resolveNextTarget();
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
      resetTranscript();
      return;
    }

    setMessages(transcript);
    setInput('');
    resetTranscript();

    await requestNextQuestion(transcript);
  };

  const onFinalize = async () => {
    if (isFinalizing || isLoadingQuestion) return;
    await finalizeWithTranscript(messages);
  };

  const userTurnCount = messages.filter((msg) => msg.role === 'user').length;
  const canFinalize = userTurnCount >= MIN_RESPONSES_TO_ENABLE_BUTTON && !isLoadingQuestion && !isFinalizing;
  const interviewCapped = userTurnCount >= TARGET_INTERVIEW_RESPONSES;
  const progressPercent = Math.min(100, Math.max(10, Math.round((userTurnCount / TARGET_INTERVIEW_RESPONSES) * 100)));
  const activeStageLabel = isCheckingStatus
    ? 'Checking your tutor profile'
    : isFinalizing
      ? 'Building your tutor profile'
      : isLoadingQuestion
        ? 'Generating the next question'
        : messages.length === 0
          ? 'Ready to begin'
          : interviewCapped
            ? 'Interview complete'
            : 'Interview in progress';

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
          <div data-testid="onboarding-progress" className="mb-4 overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-indigo-200/80">
                  Tutor Calibration
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">{activeStageLabel}</h2>
                <p className="mt-1 text-sm text-slate-300">
                  {isFinalizing
                    ? 'The tutor is turning your answers into a learning profile and preferred teaching style.'
                    : isLoadingQuestion || isCheckingStatus
                      ? 'The system is preparing the next step. This can take a few seconds.'
                      : 'Short answers are enough. The tutor only needs a quick sense of your goals and preferences.'}
                </p>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(99,102,241,0.18)]">
                <div className="relative h-8 w-8">
                  <span className="absolute inset-0 rounded-full border border-indigo-300/40" />
                  <span className="absolute inset-1 rounded-full border border-indigo-300/30" />
                  <span className={`absolute inset-2 rounded-full bg-indigo-400/90 ${isLoadingQuestion || isFinalizing || isCheckingStatus ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-cyan-300 transition-all duration-700 ${
                    isLoadingQuestion || isFinalizing || isCheckingStatus ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${isFinalizing ? 100 : isCheckingStatus ? 15 : progressPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
                <div className={`rounded-xl border px-3 py-2 ${messages.length > 0 || isLoadingQuestion || isCheckingStatus ? 'border-indigo-400/40 bg-indigo-400/10 text-indigo-100' : 'border-white/10 bg-white/5'}`}>
                  1. Start
                </div>
                <div className={`rounded-xl border px-3 py-2 ${userTurnCount > 0 || isLoadingQuestion ? 'border-sky-400/40 bg-sky-400/10 text-sky-100' : 'border-white/10 bg-white/5'}`}>
                  2. Answer
                </div>
                <div className={`rounded-xl border px-3 py-2 ${isFinalizing || finalSummary ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-white/5'}`}>
                  3. Build profile
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            {isLoadingQuestion ? (
              <>
                <AudioVisualizer
                  isActive
                  height="h-20"
                  theme="indigo"
                  mode="playback"
                  simulate
                  forcedAmplitude={0.22}
                />
                <p className="mt-2 text-center text-xs font-semibold uppercase tracking-widest text-indigo-300">
                  Generating your next question
                </p>
              </>
            ) : isListening || isSpeaking ? (
              <>
                <AudioVisualizer
                  isActive
                  height="h-20"
                  theme={isListening ? 'ocean' : 'indigo'}
                  mode={isListening ? 'recording' : 'playback'}
                  simulate={isListening || isSpeaking}
                  forcedAmplitude={isSpeaking ? speakingAmplitude : undefined}
                />
                <p className="mt-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-300">
                  {isListening ? 'Listening' : 'Tutor speaking'}
                </p>
                {interimTranscript && (
                  <p className="mt-1 text-center text-xs text-cyan-300">Listening: {interimTranscript}</p>
                )}
              </>
            ) : (
              <p className="py-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
                Voice ready
              </p>
            )}
          </div>

          <div data-testid="onboarding-thread" className="max-h-[55vh] space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4">
            {messages.length === 0 && !isLoadingQuestion && (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Start the interview to let the tutor ask its first question.
                </p>
                <button
                  data-testid="onboarding-start"
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
                data-testid={`onboarding-message-${message.role}`}
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
              <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:-0.2s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.1s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-100">Generating your next question</p>
                    <p className="text-xs text-slate-300">Adapting tone, pace, and examples from what you have said so far.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              data-testid="onboarding-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your answer..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              disabled={isLoadingQuestion || isFinalizing}
            />
            <button
              data-testid="onboarding-send"
              type="submit"
              disabled={!input.trim() || isLoadingQuestion || isFinalizing}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Send
            </button>
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoadingQuestion || isFinalizing}
              className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isListening
                  ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30'
                  : 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
              } disabled:cursor-not-allowed disabled:opacity-40`}
              aria-label={isListening ? 'Stop recording' : 'Start recording'}
            >
              {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between gap-2">
            <p data-testid="onboarding-counter" className="text-xs text-slate-400">
              Responses captured: {userTurnCount}/{TARGET_INTERVIEW_RESPONSES}
            </p>
            <button
              data-testid="onboarding-complete"
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
              <p data-testid="onboarding-error">{error}</p>
              {messages.length === 0 && (
                <button
                  data-testid="onboarding-retry"
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
