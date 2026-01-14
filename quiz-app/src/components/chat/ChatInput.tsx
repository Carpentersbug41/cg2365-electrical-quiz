import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  remainingQueries: number;
}

export default function ChatInput({ onSendMessage, disabled, remainingQueries }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      {/* Query Counter */}
      <div className="mb-2 text-sm text-gray-600 dark:text-slate-400 flex items-center justify-between">
        <span>
          {remainingQueries > 0 ? (
            <>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{remainingQueries}</span>{' '}
              {remainingQueries === 1 ? 'query' : 'queries'} remaining
            </>
          ) : (
            <span className="text-red-600 dark:text-red-400 font-semibold">Query limit reached</span>
          )}
        </span>
        <span className="text-xs text-gray-500 dark:text-slate-500">Shift+Enter for new line</span>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || remainingQueries === 0}
          placeholder={
            remainingQueries === 0
              ? 'Query limit reached for this question'
              : 'Ask about this question...'
          }
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
          rows={2}
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim() || remainingQueries === 0}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors self-end"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}


