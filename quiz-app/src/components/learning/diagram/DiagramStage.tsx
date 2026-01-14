/**
 * Diagram Stage: Circuit diagram with YouTube video integration
 * Supports timestamp controls and interactive video navigation
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { DiagramStageProps } from './types';
import { DiagramBlockContent } from '@/data/lessons/types';

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function DiagramStage({ 
  block, 
  highlightedElements, 
  onAction,
  isExpanded,
  onToggleExpand 
}: DiagramStageProps) {
  const content = block.content as DiagramBlockContent;
  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Extract YouTube video ID from URL
  const getVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const videoId = content.videoUrl ? getVideoId(content.videoUrl) : null;

  // Load YouTube IFrame API
  useEffect(() => {
    if (!videoId) return;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Load API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up callback
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!videoContainerRef.current || !videoId) return;

    playerRef.current = new window.YT.Player(videoContainerRef.current, {
      videoId,
      playerVars: {
        rel: 0, // Don't show related videos
        modestbranding: 1, // Minimal YouTube branding
      },
      events: {
        onReady: () => {
          setIsPlayerReady(true);
        },
      },
    });
  };

  // Function to jump to timestamp
  const jumpToTimestamp = (timeString: string) => {
    if (!isPlayerReady || !playerRef.current) return;

    // Parse time string (e.g., "1:23" or "0:45")
    const parts = timeString.split(':');
    let seconds = 0;
    
    if (parts.length === 2) {
      seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }

    playerRef.current.seekTo(seconds, true);
    playerRef.current.playVideo();
  };

  // Handle control actions
  const handleAction = (action: string, targetIds?: string[], timestamp?: string) => {
    if (action === 'jumpToTimestamp' && timestamp) {
      jumpToTimestamp(timestamp);
    }
    onAction(action as any, targetIds);
  };

  return (
    <div 
      className={`h-full flex flex-col bg-white rounded-2xl border-2 border-indigo-200 shadow-lg overflow-hidden ${
        isExpanded ? 'fixed inset-4 z-50' : 'relative'
      }`}
      id={block.id}
    >
      {/* Diagram Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-indigo-600">📊</span>
            {content.title}
          </h2>
          <p className="text-sm text-gray-600">{content.description}</p>
        </div>
        
        {onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className="ml-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label={isExpanded ? "Minimize diagram" : "Expand diagram"}
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Diagram Canvas / Video */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-indigo-50 overflow-auto">
        <div className="max-w-2xl w-full space-y-4">
          {content.videoUrl ? (
            <>
              {/* YouTube Video */}
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                <div ref={videoContainerRef} className="w-full h-full" />
              </div>

              {/* Timestamp Markers */}
              {content.timestamps && content.timestamps.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Key Moments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {content.timestamps.map((timestamp, idx) => (
                      <button
                        key={idx}
                        onClick={() => jumpToTimestamp(timestamp.time)}
                        disabled={!isPlayerReady}
                        className="px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 disabled:bg-gray-100 disabled:text-gray-400 text-indigo-700 rounded-lg border border-indigo-200 transition-colors flex items-center gap-2"
                        title={timestamp.label}
                      >
                        <span className="font-mono font-semibold">{timestamp.time}</span>
                        <span className="hidden sm:inline">• {timestamp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Placeholder visualization */
            <div className="bg-white rounded-xl border-2 border-dashed border-indigo-300 p-8 text-center">
              <div className="mb-4">
                <svg className="w-20 h-20 mx-auto text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Circuit Diagram Placeholder</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                {content.placeholderText}
              </p>
              
              {/* Element IDs for reference */}
              {content.elementIds && content.elementIds.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {content.elementIds.map((id) => (
                    <span 
                      key={id}
                      className={`px-3 py-1 text-xs font-medium rounded-full border-2 transition-all ${
                        highlightedElements.includes(id)
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-900 shadow-md scale-110'
                          : 'bg-gray-100 border-gray-300 text-gray-700'
                      }`}
                    >
                      {id}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-400 italic">
                Future: Interactive SVG diagram will be implemented here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Diagram Controls */}
      {content.controls && content.controls.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 border-t border-gray-200 bg-gray-50">
          {content.controls.map((control) => (
            <button
              key={control.id}
              onClick={() => handleAction(control.action, control.targetIds, control.timestamp)}
              disabled={control.action === 'jumpToTimestamp' && !isPlayerReady}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                control.action === 'clear'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                  : control.action === 'jumpToTimestamp'
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                  : highlightedElements.some(id => control.targetIds?.includes(id))
                  ? 'bg-yellow-400 text-yellow-900 border-2 border-yellow-500 shadow-md'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-300'
              }`}
            >
              {control.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


