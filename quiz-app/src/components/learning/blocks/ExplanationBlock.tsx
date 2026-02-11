/**
 * Explanation Block: Rich text content
 */

import { BlockProps } from './types';
import { ExplanationBlockContent } from '@/data/lessons/types';
import ReactMarkdown from 'react-markdown';

function normalizeExplanationMarkdown(markdown: string): string {
  return markdown
    .replace(/\r\n/g, '\n')
    // Ensure standalone bold section labels render on their own line.
    .replace(/^(\*\*[^*\n].*?\*\*:?)\n(?!\n)/gm, '$1\n\n')
    // Expand compact misconception rows into readable multi-line items.
    .replace(
      /^(\s*[*-]\s+Misconception:\s*)([^|\n]+?)\s*\|\s*Correction:\s*([^|\n]+?)\s*\|\s*AC:\s*([^\n]+)$/gm,
      '$1$2  \n  Correction: $3'
    )
    // Hide assessment criterion metadata in learner-facing views.
    .replace(/^\s*AC:\s*AC\d+\s*$/gm, '');
}

export default function ExplanationBlock({ block }: BlockProps) {
  const content = block.content as ExplanationBlockContent;
  const normalizedContent = normalizeExplanationMarkdown(content.content);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700" id={block.id}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-indigo-600 dark:text-indigo-400">💡</span>
        {content.title}
      </h2>
      <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-4">{children}</p>,
            strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
            em: ({ children }) => <em className="italic text-indigo-700 dark:text-indigo-400">{children}</em>,
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>
      
      {content.subsections && content.subsections.length > 0 && (
        <div className="mt-6 space-y-4">
          {content.subsections.map((subsection, index) => (
            <div key={index} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{subsection.title}</h3>
              <div className="text-gray-700 dark:text-slate-300">
                <ReactMarkdown>{normalizeExplanationMarkdown(subsection.content)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
