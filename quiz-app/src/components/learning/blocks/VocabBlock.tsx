/**
 * Vocabulary Block: Term/definition pairs
 */

import { BlockProps } from './types';
import { VocabBlockContent } from '@/data/lessons/types';

export default function VocabBlock({ block }: BlockProps) {
  const content = block.content as VocabBlockContent;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200" id={block.id}>
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-indigo-600">📚</span>
        Key Vocabulary
      </h2>
      <div className="grid gap-4">
        {content.terms.map((term, index) => (
          <div key={index} className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
            <h3 className="font-bold text-indigo-900 mb-2">{term.term}</h3>
            <p className="text-gray-700 leading-relaxed">{term.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}






