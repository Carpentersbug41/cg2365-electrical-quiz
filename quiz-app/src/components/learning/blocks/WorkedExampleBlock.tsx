/**
 * Worked Example Block: Step-by-step solution model
 */

import { BlockProps } from './types';
import { WorkedExampleBlockContent } from '@/data/lessons/types';

export default function WorkedExampleBlock({ block }: BlockProps) {
  const content = block.content as WorkedExampleBlockContent;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200" id={block.id}>
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-green-600">✏️</span>
        {content.title}
        <span className="ml-auto px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full border border-green-300">
          I Do (Model)
        </span>
      </h2>
      
      <div className="bg-white rounded-xl p-4 mb-4 border border-green-200">
        <p className="text-sm font-semibold text-gray-600 mb-2">Given:</p>
        <p className="text-gray-800">{content.given}</p>
      </div>

      <div className="space-y-4">
        {content.steps.map((step) => (
          <div key={step.stepNumber} className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                {step.stepNumber}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-2">{step.description}</p>
                
                {step.formula && (
                  <div className="bg-gray-50 rounded-lg px-4 py-2 mb-2 font-mono text-sm text-gray-800 border border-gray-200">
                    {step.formula}
                  </div>
                )}
                
                {step.calculation && (
                  <div className="bg-gray-50 rounded-lg px-4 py-2 mb-2 font-mono text-sm text-gray-800 border border-gray-200">
                    {step.calculation}
                  </div>
                )}
                
                {step.result && (
                  <div className="bg-green-100 rounded-lg px-4 py-2 font-mono text-sm font-bold text-green-900 border border-green-300">
                    Result: {step.result}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {content.notes && (
        <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-amber-900 flex items-start gap-2">
            <span className="text-amber-600 flex-shrink-0">💡</span>
            <span>{content.notes}</span>
          </p>
        </div>
      )}
    </div>
  );
}






