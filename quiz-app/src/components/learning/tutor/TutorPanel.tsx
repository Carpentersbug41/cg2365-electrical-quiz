/**
 * Tutor Panel: Main tutor UI container
 * Manages tutor state and interactions
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { TutorMode, TutorMessage } from '@/lib/tutor/types';
import { Block } from '@/data/lessons/types';
import { createLessonContext } from '@/lib/tutor/groundingService';
import TutorMessageComponent from './TutorMessage';
import TutorInput from './TutorInput';
import ModeSwitcher from './ModeSwitcher';

interface TutorPanelProps {
  lessonId: string;
  lessonTitle: string;
  blocks: Block[];
  mode?: TutorMode;
  isBottomSheet?: boolean;
  onBlockReferenceClick?: (blockId: string) => void;
  onClose?: () => void; // For closing the tutor panel when clicking a reference
}

export default function TutorPanel({
  lessonId,
  lessonTitle,
  blocks,
  mode: initialMode = 'teach',
  isBottomSheet = false,
  onBlockReferenceClick,
  onClose,
}: TutorPanelProps) {
  const [mode, setMode] = useState<TutorMode>(initialMode);
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your tutor for this lesson. I'm currently in **${initialMode.toUpperCase()} mode**. ${
        initialMode === 'teach' 
          ? 'Feel free to ask questions, and I\'ll guide you step-by-step.' 
          : initialMode === 'check'
          ? 'I can clarify question wording, but I won\'t give hints during assessment.'
          : 'I\'ll help you fix specific misunderstandings quickly.'
      }`,
      timestamp: new Date(),
      mode: initialMode,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Scroll within the messages container only, not the entire page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll to bottom for new messages, not on initial mount
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Create lesson context
      const lessonContext = createLessonContext({
        id: lessonId,
        title: lessonTitle,
        description: '',
        layout: 'split-vis',
        unit: '',
        topic: '',
        learningOutcomes: [],
        blocks,
        metadata: { created: '', updated: '', version: '' },
      });

      // Prepare history (last 10 messages for context window management)
      // Gemini requires history to start with a user message, so filter out initial assistant messages
      const historyMessages = messages.slice(-10);
      const firstUserIndex = historyMessages.findIndex(msg => msg.role === 'user');
      const validHistory = firstUserIndex >= 0 ? historyMessages.slice(firstUserIndex) : [];
      
      const history = validHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call tutor API
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          mode,
          lessonContext,
          history,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: TutorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        mode,
        blockReferences: data.blockReferences,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Tutor error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: TutorMode) => {
    setMode(newMode);
    
    // Add system message about mode change
    const modeChangeMessage: TutorMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Mode switched to **${newMode.toUpperCase()}**. ${
        newMode === 'teach'
          ? 'I\'ll now provide supportive coaching and scaffolding.'
          : newMode === 'check'
          ? 'I\'m now in assessment mode. I can only clarify questions, not provide hints.'
          : 'I\'ll help you fix specific misunderstandings with targeted corrections.'
      }`,
      timestamp: new Date(),
      mode: newMode,
    };

    setMessages(prev => [...prev, modeChangeMessage]);
  };

  const handleBlockReferenceClick = (blockId: string) => {
    // Call parent handler if provided
    if (onBlockReferenceClick) {
      onBlockReferenceClick(blockId);
      // Optionally close the tutor panel
      onClose?.();
      return;
    }

    // Default behavior: scroll to block
    const blockElement = document.getElementById(blockId);
    if (blockElement) {
      blockElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      
      // Add a highlight effect
      blockElement.classList.add('ring-4', 'ring-indigo-500', 'ring-opacity-50');
      setTimeout(() => {
        blockElement.classList.remove('ring-4', 'ring-indigo-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  return (
    <div 
      className={`flex flex-col bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-lg overflow-hidden ${
        isBottomSheet ? 'h-full' : 'h-auto'
      }`}
      id="tutor-panel"
    >
      {/* Tutor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">🤖</span>
            AI Tutor
          </h3>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
            {mode === 'teach' && 'Coaching mode - I\'ll guide you step-by-step'}
            {mode === 'check' && 'Assessment mode - Minimal help during tests'}
            {mode === 'fix' && 'Fix mode - Targeting specific errors'}
          </p>
        </div>
        
        <ModeSwitcher currentMode={mode} onModeChange={handleModeChange} />
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-3 ${isBottomSheet ? '' : 'max-h-[400px]'}`}>
        {messages.map(message => (
          <TutorMessageComponent 
            key={message.id} 
            message={message} 
            onBlockReferenceClick={handleBlockReferenceClick}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent"></div>
            <span>Tutor is thinking...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-lg p-3 text-sm text-red-800 dark:text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <TutorInput onSend={handleSendMessage} disabled={isLoading} mode={mode} />
    </div>
  );
}

