'use client';

import { useEffect, useMemo, useState } from 'react';

type TTSStateEventDetail = {
  activeBlockId: string | null;
};

const TTS_STATE_EVENT = 'lesson-block-tts-state';

let activeBlockId: string | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

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
};

export default function BlockTTSButton({ blockId, text, label = 'Read block aloud' }: BlockTTSButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeakingThisBlock, setIsSpeakingThisBlock] = useState(false);
  const speakableText = useMemo(() => toSpeakableText(text), [text]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
    setIsSupported(supported);
    setIsSpeakingThisBlock(activeBlockId === blockId);

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<TTSStateEventDetail>).detail;
      setIsSpeakingThisBlock(detail?.activeBlockId === blockId);
    };

    window.addEventListener(TTS_STATE_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(TTS_STATE_EVENT, handler as EventListener);
    };
  }, [blockId]);

  const toggleSpeech = () => {
    if (!isSupported || !speakableText) return;

    if (activeBlockId === blockId) {
      stopAllSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(speakableText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      if (activeUtterance === utterance) {
        activeBlockId = null;
        activeUtterance = null;
        emitState();
      }
    };

    utterance.onerror = () => {
      if (activeUtterance === utterance) {
        activeBlockId = null;
        activeUtterance = null;
        emitState();
      }
    };

    activeBlockId = blockId;
    activeUtterance = utterance;
    emitState();
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleSpeech}
      className="inline-flex items-center gap-2 rounded-lg border border-white/80 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md ring-1 ring-slate-900/20 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-white dark:text-slate-900 dark:ring-white/30 dark:hover:bg-slate-100"
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
      <span>{isSpeakingThisBlock ? 'Stop audio' : 'Read aloud'}</span>
    </button>
  );
}
