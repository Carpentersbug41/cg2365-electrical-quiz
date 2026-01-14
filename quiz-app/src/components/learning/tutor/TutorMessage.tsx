/**
 * Tutor Message: Single message bubble
 */

import { TutorMessage } from '@/lib/tutor/types';
import ReactMarkdown from 'react-markdown';

interface TutorMessageProps {
  message: TutorMessage;
  onBlockReferenceClick?: (blockId: string) => void;
}

export default function TutorMessageComponent({ 
  message, 
  onBlockReferenceClick 
}: TutorMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl p-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-900 border border-gray-200'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {!isUser && message.blockReferences && message.blockReferences.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-300">
            <p className="text-xs text-gray-600 flex items-center gap-1 flex-wrap">
              <span className="font-semibold">📌 References:</span>
              {message.blockReferences.map((ref, idx) => (
                <button
                  key={idx}
                  onClick={() => onBlockReferenceClick?.(ref)}
                  className="px-2 py-0.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800 rounded text-xs font-mono transition-colors cursor-pointer border border-indigo-200 hover:border-indigo-300"
                  title={`Jump to ${ref}`}
                >
                  [{ref}]
                </button>
              ))}
            </p>
          </div>
        )}

        <p className="text-xs mt-2 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}





