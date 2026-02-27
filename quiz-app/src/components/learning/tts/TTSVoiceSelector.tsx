'use client';

import { useEffect, useState } from 'react';
import { TTS_VOICE_STORAGE_KEY } from './constants';

function hasSpeechSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    typeof window.speechSynthesis !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
}

export default function TTSVoiceSelector() {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported = hasSpeechSupport();
    setIsSupported(supported);
    if (!supported) return;

    const hydrateVoices = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      setVoices(loadedVoices);
      if (loadedVoices.length === 0) return;

      const storedVoiceName = window.localStorage.getItem(TTS_VOICE_STORAGE_KEY);
      const selected = storedVoiceName && loadedVoices.some((voice) => voice.name === storedVoiceName)
        ? storedVoiceName
        : loadedVoices[0].name;

      setSelectedVoiceName(selected);
      window.localStorage.setItem(TTS_VOICE_STORAGE_KEY, selected);
    };

    hydrateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', hydrateVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', hydrateVoices);
    };
  }, []);

  if (!isSupported || voices.length === 0) return null;

  return (
    <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-slate-300">
      <span className="hidden sm:inline">Voice</span>
      <select
        value={selectedVoiceName}
        onChange={(event) => {
          const nextVoice = event.target.value;
          setSelectedVoiceName(nextVoice);
          window.localStorage.setItem(TTS_VOICE_STORAGE_KEY, nextVoice);
        }}
        className="max-w-[12rem] rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-gray-900 dark:text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label="Select read aloud voice"
        title="Select read aloud voice"
      >
        {voices.map((voice) => (
          <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
    </label>
  );
}
