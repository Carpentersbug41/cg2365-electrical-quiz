'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Question } from '@/data/questions';

interface ChatAssistantProps {
  currentQuestion: Question;
  questionIndex: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  context?: 'lesson' | 'assessment'; // Assessment context locks to Check mode
  allowModeSwitch?: boolean; // Whether to show mode switcher
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MAX_QUERIES_PER_QUESTION = 3;

export default function ChatAssistant({
  currentQuestion,
  questionIndex,
  isCollapsed,
  onToggleCollapse,
  context = 'lesson',
  allowModeSwitch = true,
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryCount, setQueryCount] = useState<{ [key: number]: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get query count for current question
  const currentQueryCount = queryCount[questionIndex] || 0;
  const remainingQueries = MAX_QUERIES_PER_QUESTION - currentQueryCount;

  // Reset chat history when question changes
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [questionIndex]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (userMessage: string) => {
    if (remainingQueries <= 0) return;

    // Add user message immediately
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare question context
      const questionContext = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        options: currentQuestion.options,
        category: currentQuestion.category,
        section: currentQuestion.section,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          questionContext,
          contextType: context, // 'lesson' or 'assessment'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from assistant');
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Increment query count only on successful response
      setQueryCount((prev) => ({
        ...prev,
        [questionIndex]: (prev[questionIndex] || 0) + 1,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  // Mobile detection with resize listener
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    // Mobile: Bottom sheet modal
    return (
      <>
        {/* Overlay */}
        {!isCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onToggleCollapse}
            aria-hidden="true"
          />
        )}

        {/* Bottom Sheet */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl z-50 md:hidden transition-transform duration-300 ${
            isCollapsed ? 'translate-y-full' : 'translate-y-0'
          }`}
          style={{ height: '75vh' }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <button
              onClick={onToggleCollapse}
              className="w-12 h-1.5 bg-gray-300 dark:bg-slate-600 rounded-full"
              aria-label="Close chat"
            />
          </div>

          {/* Header */}
          <div className="px-4 pb-3 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Quiz Assistant</h3>
              </div>
              <button
                onClick={onToggleCollapse}
                className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 p-2"
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Question {questionIndex + 1} • {currentQuestion.category}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ height: 'calc(75vh - 180px)' }}>
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 dark:text-slate-400 mt-8">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm">Ask me anything about this question!</p>
                <p className="text-xs mt-2">I&apos;m here to help you understand the concepts.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            remainingQueries={remainingQueries}
          />
        </div>
      </>
    );
  }

  // Desktop: Sidebar
  return (
    <div
      className={`hidden md:flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-96'
      }`}
    >
      {isCollapsed ? (
        // Collapsed state - vertical button
        <button
          onClick={onToggleCollapse}
          className="flex flex-col items-center justify-center h-full py-8 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-colors"
          aria-label="Open chat assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <span className="text-xs font-semibold writing-mode-vertical-rl transform rotate-180">
            Assistant
          </span>
        </button>
      ) : (
        // Expanded state
        <>
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Quiz Assistant</h3>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                Question {questionIndex + 1} • {currentQuestion.category}
              </p>
            </div>
            <button
              onClick={onToggleCollapse}
              className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Collapse chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 dark:text-slate-400 mt-8">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm">Ask me anything about this question!</p>
                <p className="text-xs mt-2 text-gray-400 dark:text-slate-500">
                  I&apos;m here to help you understand the concepts.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <span className="text-red-500 dark:text-red-400 mr-2">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline mt-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            remainingQueries={remainingQueries}
          />
        </>
      )}
    </div>
  );
}

