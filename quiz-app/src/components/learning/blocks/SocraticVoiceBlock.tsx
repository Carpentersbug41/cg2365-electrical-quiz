'use client';

import { useEffect, useRef, useState } from 'react';
import { BlockProps } from './types';
import { SocraticBlockContent } from '@/data/lessons/types';
import { useSpeechToText } from '@/app/simulations/Echo-Questions/hooks/useSpeechToText';
import { getAudioContext, speakNativeWithEvents } from '@/app/simulations/Echo-Questions/utils/audioUtils';
import AudioVisualizer from '@/app/simulations/Echo-Questions/components/AudioVisualizer';
import { Mic, Send, Sparkles, Square } from 'lucide-react';
import { authedFetch } from '@/lib/api/authedFetch';

type SocraticTurn = {
  question: string;
  answer: string;
  level: number;
  correct: boolean;
  score?: number;
  misconceptionCode?: string | null;
  intent?: 'diagnose' | 'repair' | 'verify' | 'transfer';
};

type SocraticTurnResponse = {
  success: boolean;
  question?: string;
  questionLevel?: number;
  questionIntent?: 'diagnose' | 'repair' | 'verify' | 'transfer';
  askedCount: number;
  complete: boolean;
  feedback?: string;
  correct?: boolean;
  score?: number;
  misconceptionCode?: string | null;
  nextAction?: 'retry' | 'advance' | 'repair';
  mandatoryRetest?: boolean;
  nextLevel?: number;
  error?: string;
};

export default function SocraticVoiceBlock({ block, lessonId }: BlockProps) {
  const content = block.content as SocraticBlockContent;
  const resolvedLessonId = lessonId ?? block.id.split('-').slice(0, 2).join('-');
  const configuredQuestionCount = Math.max(8, Math.min(10, Number(content.questionCount || 8)));
  const configuredStartLevel = Math.max(1, Math.min(4, Number(content.startLevel || 1)));

  const [question, setQuestion] = useState<string>('');
  const [questionLevel, setQuestionLevel] = useState<number>(configuredStartLevel);
  const [questionIntent, setQuestionIntent] = useState<'diagnose' | 'repair' | 'verify' | 'transfer'>('diagnose');
  const [askedCount, setAskedCount] = useState<number>(0);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [history, setHistory] = useState<SocraticTurn[]>([]);
  const [lastFeedback, setLastFeedback] = useState<string>('');
  const [lastNextAction, setLastNextAction] = useState<'retry' | 'advance' | 'repair' | ''>('');
  const [activeMisconceptionCode, setActiveMisconceptionCode] = useState<string>('');
  const [mandatoryRetest, setMandatoryRetest] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingAmplitude, setSpeakingAmplitude] = useState<number>(0.06);
  const prevIsListeningRef = useRef<boolean>(false);
  const speechTokenRef = useRef<number>(0);
  const boundaryEnergyRef = useRef<number>(0);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error: sttError,
  } = useSpeechToText();

  useEffect(() => {
    if (!content.allowVoiceInput) return;
    if (!isListening && !transcript && !interimTranscript) return;

    const merged = `${transcript}${interimTranscript ? ` ${interimTranscript}` : ''}`.trim();
    if (merged) {
      setAnswerInput(merged);
    }
  }, [content.allowVoiceInput, isListening, transcript, interimTranscript]);

  useEffect(() => {
    if (!sttError) return;
    setErrorMessage(`Speech input error: ${sttError}`);
  }, [sttError]);

  const speakText = (text: string, onEnded?: () => void) => {
    if (!content.allowVoiceOutput) {
      if (onEnded) onEnded();
      return;
    }
    const token = speechTokenRef.current + 1;
    speechTokenRef.current = token;
    setIsSpeaking(true);
    speakNativeWithEvents(
      text,
      () => {
        // Ignore stale callbacks from interrupted/canceled previous utterances.
        if (speechTokenRef.current === token) {
          setIsSpeaking(false);
          setSpeakingAmplitude(0.06);
          boundaryEnergyRef.current = 0;
        }
        if (onEnded) onEnded();
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

  const fetchFirstQuestion = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await authedFetch('/api/socratic/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: resolvedLessonId,
          blockId: block.id,
          questionCount: configuredQuestionCount,
          startLevel: configuredStartLevel,
          askedCount: 0,
          history: [],
        }),
      });

      const data = (await response.json()) as SocraticTurnResponse;
      if (!response.ok || !data.success || !data.question) {
        throw new Error(data.error || 'Failed to start Socratic session.');
      }

      setQuestion(data.question);
      setQuestionLevel(data.questionLevel ?? configuredStartLevel);
      setQuestionIntent(data.questionIntent ?? 'diagnose');
      setAskedCount(data.askedCount);
      setComplete(Boolean(data.complete));
      setLastFeedback('');
      setLastNextAction('');
      setMandatoryRetest(false);
      setActiveMisconceptionCode('');
      speakText(data.question);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start Socratic session.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (content.enabled === false) return;
    void fetchFirstQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id, resolvedLessonId]);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      // Smooth decay between spoken word boundaries so wave "breathes" with TTS cadence.
      boundaryEnergyRef.current *= 0.86;
      const ambient = 0.05;
      const pulse = boundaryEnergyRef.current;
      setSpeakingAmplitude(Math.min(1, ambient + pulse));
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
      setSpeakingAmplitude(0.06);
      boundaryEnergyRef.current = 0;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const wasListening = prevIsListeningRef.current;
    const hasFinalTranscript = Boolean(transcript.trim());
    if (
      content.allowVoiceInput &&
      wasListening &&
      !isListening &&
      hasFinalTranscript &&
      !isLoading &&
      !complete &&
      question
    ) {
      const finalAnswer = transcript.trim();
      void handleSubmitAnswer(finalAnswer);
    }
    prevIsListeningRef.current = isListening;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript, content.allowVoiceInput, isLoading, complete, question]);

  const toggleRecording = () => {
    if (!content.allowVoiceInput) return;
    if (isListening) {
      stopListening();
      return;
    }
    getAudioContext().resume();
    startListening();
  };

  const handleSubmitAnswer = async (answerOverride?: string) => {
    const trimmed = (answerOverride ?? answerInput).trim();
    if (!trimmed || !question || complete || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await authedFetch('/api/socratic/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: resolvedLessonId,
          blockId: block.id,
          questionCount: configuredQuestionCount,
          startLevel: configuredStartLevel,
          askedCount,
          history,
          previousQuestion: question,
          previousLevel: questionLevel,
          userAnswer: trimmed,
        }),
      });

      const data = (await response.json()) as SocraticTurnResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process answer.');
      }

      setLastFeedback(data.feedback || '');
      setLastNextAction(data.nextAction ?? '');
      setMandatoryRetest(Boolean(data.mandatoryRetest));
      setActiveMisconceptionCode(data.misconceptionCode ?? '');
      setHistory((prev) => [
        ...prev,
        {
          question,
          answer: trimmed,
          level: questionLevel,
          correct: Boolean(data.correct),
          score: typeof data.score === 'number' ? data.score : undefined,
          misconceptionCode: data.misconceptionCode ?? null,
          intent: questionIntent,
        },
      ]);
      setAnswerInput('');
      resetTranscript();

      if (data.feedback) {
        speakText(data.feedback);
      }

      if (data.complete || !data.question) {
        setComplete(true);
        setAskedCount(data.askedCount);
        if (data.feedback) {
          speakText(data.feedback);
        }
        return;
      }

      const nextLevel = data.questionLevel ?? data.nextLevel ?? questionLevel;
      const nextQuestionText = data.question;
      setQuestion(data.question);
      setQuestionLevel(nextLevel);
      setQuestionIntent(data.questionIntent ?? questionIntent);
      setAskedCount(data.askedCount);

      if (data.feedback) {
        speakText(data.feedback, () => {
          speakText(nextQuestionText);
        });
      } else {
        speakText(nextQuestionText);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process answer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (content.enabled === false) return null;

  const levelStats = history.reduce(
    (acc, turn) => {
      const level = Math.max(1, Math.min(4, turn.level));
      acc[level].asked += 1;
      if (turn.correct) acc[level].correct += 1;
      return acc;
    },
    {
      1: { asked: 0, correct: 0 },
      2: { asked: 0, correct: 0 },
      3: { asked: 0, correct: 0 },
      4: { asked: 0, correct: 0 },
    } as Record<number, { asked: number; correct: number }>
  );

  return (
    <div
      id={block.id}
      className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950 p-5 shadow-2xl shadow-slate-900/40"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Socratic Voice Questions
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Starts at Level {configuredStartLevel}. One question at a time for {configuredQuestionCount} questions.
          </p>
        </div>
        <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          {askedCount}/{configuredQuestionCount}
        </span>
      </div>
      <div className="relative z-10 mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
          Intent: {questionIntent}
        </span>
        <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">
          Last action: {lastNextAction || 'n/a'}
        </span>
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200"
          >
            L{level}: {levelStats[level].correct}/{levelStats[level].asked}
          </span>
        ))}
      </div>

      <div className="relative z-10 mb-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        {question ? (
          <>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-300">{`Level ${questionLevel}`}</p>
            <p className="text-base text-slate-100">{question}</p>
          </>
        ) : (
          <p className="text-sm text-slate-300">{isLoading ? 'Preparing first question...' : 'Ready to start.'}</p>
        )}
      </div>

      {lastFeedback && (
        <div className="relative z-10 mb-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-indigo-300">Feedback</p>
          <p className="text-sm text-slate-100">{lastFeedback}</p>
        </div>
      )}
      {mandatoryRetest && !complete && (
        <div className="relative z-10 mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-300">Mandatory Retest Active</p>
          <p className="text-sm text-amber-100">
            You are in a repair/verification loop at this level. Clear this check before progressing.
            {activeMisconceptionCode ? ` Focus misconception: ${activeMisconceptionCode}.` : ''}
          </p>
        </div>
      )}

      {!complete && (
        <div className="relative z-10 space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            {isListening || isSpeaking ? (
              <AudioVisualizer
                isActive
                height="h-20"
                theme={isListening ? 'ocean' : 'indigo'}
                mode={isListening ? 'recording' : 'playback'}
                simulate={isSpeaking}
                forcedAmplitude={isSpeaking ? speakingAmplitude : undefined}
              />
            ) : (
              <p className="py-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
                Voice Ready
              </p>
            )}
            {interimTranscript && (
              <p className="mt-2 text-xs text-cyan-300">Listening: {interimTranscript}</p>
            )}
          </div>

          <textarea
            value={answerInput}
            onChange={(event) => setAnswerInput(event.target.value)}
            rows={3}
            placeholder={isListening ? 'Listening...' : 'Speak or type your answer...'}
            className="w-full resize-y rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-500"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => void handleSubmitAnswer()}
              disabled={!answerInput.trim() || isLoading || !question}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Processing...' : 'Submit'}
            </button>

            {content.allowVoiceInput && (
              <button
                onClick={toggleRecording}
                disabled={isLoading}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  isListening
                    ? 'border-red-400/50 bg-red-500/20 text-red-200 hover:bg-red-500/30'
                    : 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? 'Stop & Submit' : 'Speak'}
              </button>
            )}
          </div>
        </div>
      )}

      {complete && (
        <div className="relative z-10 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-200">
          Socratic session complete.
        </div>
      )}

      {errorMessage && <p className="relative z-10 mt-3 text-sm text-red-300">{errorMessage}</p>}
    </div>
  );
}
