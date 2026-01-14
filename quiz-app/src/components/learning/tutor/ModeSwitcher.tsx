/**
 * Mode Switcher: Switch between Teach/Check/Fix modes
 */

'use client';

import { useState } from 'react';
import { TutorMode } from '@/lib/tutor/types';
import { TUTOR_MODE_CONFIGS } from '@/lib/tutor/prompts';

interface ModeSwitcherProps {
  currentMode: TutorMode;
  onModeChange: (mode: TutorMode) => void;
}

export default function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modes: TutorMode[] = ['teach', 'check', 'fix'];

  const handleModeSelect = (mode: TutorMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };

  const currentConfig = TUTOR_MODE_CONFIGS[currentMode];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span className="hidden sm:inline">{currentConfig.displayName}</span>
        <span className="sm:hidden">{currentMode.toUpperCase()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
            {modes.map((mode) => {
              const config = TUTOR_MODE_CONFIGS[mode];
              const isActive = mode === currentMode;

              return (
                <button
                  key={mode}
                  onClick={() => handleModeSelect(mode)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    isActive ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900 mb-1">
                        {config.displayName}
                        {isActive && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">{config.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}






