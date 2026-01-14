import React from 'react';

interface Props {
  value: number; // 0 to 1
  onChange: (val: number) => void;
}

export const Slider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
    />
  );
};








