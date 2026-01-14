/**
 * Outcomes Block: Learning objectives with Bloom taxonomy
 */

import { BlockProps } from './types';
import { OutcomesBlockContent } from '@/data/lessons/types';

const bloomColors: Record<string, string> = {
  remember: 'bg-blue-100 text-blue-800 border-blue-300',
  understand: 'bg-green-100 text-green-800 border-green-300',
  apply: 'bg-purple-100 text-purple-800 border-purple-300',
  analyze: 'bg-orange-100 text-orange-800 border-orange-300',
  evaluate: 'bg-red-100 text-red-800 border-red-300',
  create: 'bg-pink-100 text-pink-800 border-pink-300',
};

export default function OutcomesBlock({ block }: BlockProps) {
  const content = block.content as OutcomesBlockContent;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200" id={block.id}>
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-indigo-600">🎯</span>
        Learning Outcomes
      </h2>
      <ul className="space-y-3">
        {content.outcomes.map((outcome, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold mt-0.5">
              {index + 1}
            </span>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">{outcome.text}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full border capitalize ${bloomColors[outcome.bloomLevel]}`}>
                {outcome.bloomLevel}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}






