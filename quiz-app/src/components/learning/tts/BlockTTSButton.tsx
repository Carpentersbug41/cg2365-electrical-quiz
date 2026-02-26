'use client';

import { useEffect, useMemo, useState } from 'react';

type TTSStateEventDetail = {
  activeBlockId: string | null;
};

const TTS_STATE_EVENT = 'lesson-block-tts-state';

let activeBlockId: string | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let speechReady = false;
const TTS_VOICE_STORAGE_KEY = 'tts-preferred-voice';

const PREFERRED_VOICE_NAME_HINTS = [
  'google uk english female',
  'google uk english male',
  'google us english',
  'microsoft aria',
  'microsoft guy',
  'microsoft jenny',
  'microsoft ryan',
  'microsoft sonia',
  'samantha',
  'daniel',
  'serena',
  'alex',
];

const HIGH_QUALITY_HINTS = ['natural', 'neural', 'online', 'enhanced', 'premium'];
const LOW_QUALITY_HINTS = ['espeak', 'festival', 'compact'];

function emitState() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<TTSStateEventDetail>(TTS_STATE_EVENT, {
      detail: { activeBlockId },
    })
  );
}

function stopAllSpeech() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  activeBlockId = null;
  activeUtterance = null;
  emitState();
}

function hasSpeechSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    typeof window.speechSynthesis !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!hasSpeechSupport()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!Array.isArray(voices) || voices.length === 0) return null;

  const preferredVoiceName =
    typeof window !== 'undefined' ? window.localStorage.getItem(TTS_VOICE_STORAGE_KEY)?.toLowerCase() : null;
  const browserLang = (typeof navigator !== 'undefined' ? navigator.language : 'en-GB').toLowerCase();
  const browserBaseLang = browserLang.split('-')[0];

  const scoreVoice = (voice: SpeechSynthesisVoice): number => {
    const name = voice.name.toLowerCase();
    const lang = (voice.lang || '').toLowerCase();
    const baseLang = lang.split('-')[0];
    let score = 0;

    if (preferredVoiceName && name === preferredVoiceName) score += 1000;
    if (lang === browserLang) score += 80;
    if (baseLang === browserBaseLang) score += 60;
    if (lang.startsWith('en-')) score += 40;
    if (voice.default) score += 20;
    if (PREFERRED_VOICE_NAME_HINTS.some((hint) => name.includes(hint))) score += 50;
    if (HIGH_QUALITY_HINTS.some((hint) => name.includes(hint))) score += 25;
    if (LOW_QUALITY_HINTS.some((hint) => name.includes(hint))) score -= 30;

    return score;
  };

  return voices.reduce<SpeechSynthesisVoice | null>((best, voice) => {
    if (!best) return voice;
    return scoreVoice(voice) > scoreVoice(best) ? voice : best;
  }, null);
}

function toSpeakableText(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

type BlockTTSButtonProps = {
  blockId: string;
  text: string;
  label?: string;
  iconOnly?: boolean;
};

export default function BlockTTSButton({
  blockId,
  text,
  label = 'Read block aloud',
  iconOnly = false,
}: BlockTTSButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeakingThisBlock, setIsSpeakingThisBlock] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const speakableText = useMemo(() => toSpeakableText(text), [text]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported = hasSpeechSupport();
    setIsSupported(supported);
    setIsSpeakingThisBlock(activeBlockId === blockId);
    if (!supported) return;

    const hydrateVoices = () => {
      const hasVoices = window.speechSynthesis.getVoices().length > 0;
      speechReady = hasVoices;
    };
    hydrateVoices();

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<TTSStateEventDetail>).detail;
      setIsSpeakingThisBlock(detail?.activeBlockId === blockId);
    };

    window.speechSynthesis.addEventListener('voiceschanged', hydrateVoices);
    window.addEventListener(TTS_STATE_EVENT, handler as EventListener);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', hydrateVoices);
      window.removeEventListener(TTS_STATE_EVENT, handler as EventListener);
    };
  }, [blockId]);

  const waitForVoices = async (): Promise<void> => {
    if (!hasSpeechSupport()) return;
    const synth = window.speechSynthesis;
    if (speechReady || synth.getVoices().length > 0) {
      speechReady = true;
      return;
    }

    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        speechReady = synth.getVoices().length > 0;
        synth.removeEventListener('voiceschanged', onVoicesChanged);
        resolve();
      };
      const onVoicesChanged = () => done();
      synth.addEventListener('voiceschanged', onVoicesChanged);
      window.setTimeout(done, 1200);
    });
  };

  const toggleSpeech = async () => {
    if (!isSupported || !speakableText) return;

    if (activeBlockId === blockId) {
      stopAllSpeech();
      return;
    }

    setIsPreparing(true);
    await waitForVoices();
    const synth = window.speechSynthesis;
    synth.cancel();
    if (synth.paused) synth.resume();

    const utterance = new window.SpeechSynthesisUtterance(speakableText);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    if (voice?.name) window.localStorage.setItem(TTS_VOICE_STORAGE_KEY, voice.name);
    utterance.lang = voice?.lang || 'en-GB';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      setIsPreparing(false);
    };

    utterance.onend = () => {
      if (activeUtterance === utterance) {
        activeBlockId = null;
        activeUtterance = null;
        setIsPreparing(false);
        emitState();
      }
    };

    utterance.onerror = () => {
      if (activeUtterance === utterance) {
        activeBlockId = null;
        activeUtterance = null;
        setIsPreparing(false);
        emitState();
      }
    };

    activeBlockId = blockId;
    activeUtterance = utterance;
    emitState();
    try {
      synth.speak(utterance);
      window.setTimeout(() => {
        if (activeUtterance === utterance && !synth.speaking) {
          stopAllSpeech();
          setIsPreparing(false);
        }
      }, 2000);
    } catch {
      stopAllSpeech();
      setIsPreparing(false);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={() => void toggleSpeech()}
      disabled={isPreparing}
      className={`inline-flex items-center rounded-lg border border-white/80 bg-slate-900 text-xs font-semibold text-white shadow-md ring-1 ring-slate-900/20 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-white dark:text-slate-900 dark:ring-white/30 dark:hover:bg-slate-100 ${
        iconOnly ? 'h-8 w-8 justify-center p-0' : 'gap-2 px-3 py-1.5'
      } disabled:cursor-not-allowed disabled:opacity-60`}
      aria-label={label}
      title={label}
    >
      <span
        aria-hidden
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
      >
        {isSpeakingThisBlock ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <rect x="5" y="5" width="10" height="10" rx="1.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M6 4.8c0-.86.95-1.38 1.68-.91l7.24 4.7a1.1 1.1 0 010 1.82l-7.24 4.7A1.08 1.08 0 016 14.2V4.8z" />
          </svg>
        )}
      </span>
      {!iconOnly ? <span>{isPreparing ? 'Preparing audio...' : isSpeakingThisBlock ? 'Stop audio' : 'Read aloud'}</span> : null}
    </button>
  );
}
