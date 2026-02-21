/**
 * Explanation Block: Rich text content
 */

import { BlockProps } from './types';
import { ExplanationBlockContent } from '@/data/lessons/types';
import ReactMarkdown from 'react-markdown';
import BlockTTSButton from '../tts/BlockTTSButton';

function normalizeExplanationMarkdown(markdown: string): string {
  return markdown
    .replace(/\r\n/g, '\n')
    // Promote common bold-only section labels into real headings.
    .replace(
      /^\*\*(In this lesson|What this is|Why it matters|Key facts \/ rules|How to recognise it|How to calculate it|Common mistakes|Key Points|Quick recap|Coming Up Next)\*\*:?\s*$/gm,
      '### $1'
    )
    // Ensure standalone bold section labels render on their own line.
    .replace(/^(\*\*[^*\n].*?\*\*:?)\n(?!\n)/gm, '$1\n\n')
    // Promote simple plain-text section labels into headings.
    .replace(
      /^(Misconceptions \(targeted\):|Concrete Anchor:|Micro-scenario:)\s*$/gm,
      '### $1'
    )
    // Render inline anchor/scenario labels as callouts instead of italic paragraphs.
    .replace(/^\*?(Concrete Anchor:)\s*(.+?)\*?\s*$/gm, '> **$1** $2')
    .replace(/^\*?(Micro-scenario:)\s*(.+?)\*?\s*$/gm, '> **$1** $2')
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
  const ttsSubsections = (content.subsections || [])
    .map((subsection) => `${subsection.title}. ${normalizeExplanationMarkdown(subsection.content)}`)
    .join(' ');
  const ttsText = `${content.title}. ${normalizedContent} ${ttsSubsections}`;
  const markdownComponents = {
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-6 md:mt-7 mb-3 text-[1.02rem] md:text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-indigo-400 dark:border-indigo-500 pl-3">
        {children}
      </h3>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => <ul className="mb-5 space-y-2 marker:text-indigo-500">{children}</ul>,
    ol: ({ children }: { children?: React.ReactNode }) => <ol className="mb-5 space-y-2 marker:text-indigo-500">{children}</ol>,
    li: ({ children }: { children?: React.ReactNode }) => <li className="pl-1 text-[1.01rem] leading-7 md:leading-8">{children}</li>,
    p: ({ children }: { children?: React.ReactNode }) => <p className="mb-4 text-[1.02rem] leading-7 md:leading-8">{children}</p>,
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-5 rounded-lg border border-indigo-200/70 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-900/20 px-3.5 md:px-4 py-3 text-indigo-900 dark:text-indigo-100 not-italic">
        {children}
      </blockquote>
    ),
    a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
      <a href={href} className="font-medium underline decoration-indigo-400 underline-offset-2 text-indigo-700 dark:text-indigo-300">
        {children}
      </a>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic text-indigo-700 dark:text-indigo-400">{children}</em>,
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 md:p-6 border border-gray-200 dark:border-slate-700" id={block.id}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-indigo-600 dark:text-indigo-400">EX</span>
          {content.title}
        </h2>
        <BlockTTSButton blockId={block.id} text={ttsText} label={`Read ${content.title} aloud`} />
      </div>
      <div className="prose prose-sm md:prose-base prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 leading-7 md:leading-8 prose-p:max-w-[72ch] prose-li:max-w-[68ch]">
        <ReactMarkdown components={markdownComponents}>
          {normalizedContent}
        </ReactMarkdown>
      </div>
      
      {content.subsections && content.subsections.length > 0 && (
        <div className="mt-6 space-y-4">
          {content.subsections.map((subsection, index) => (
            <div key={index} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 md:p-5 border border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{subsection.title}</h3>
              <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 prose-p:max-w-[72ch] prose-li:max-w-[68ch]">
                <ReactMarkdown components={markdownComponents}>{normalizeExplanationMarkdown(subsection.content)}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


