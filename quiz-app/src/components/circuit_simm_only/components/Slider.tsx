import React from 'react';

interface Props {
  value: number; // 0 to 1
  onChange: (val: number) => void;
}

export const Slider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="relative w-full h-6 flex items-center group">
      <div className="absolute w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-75 ease-out"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
      <div 
        className="absolute h-4 w-4 bg-white rounded-full shadow-md pointer-events-none group-hover:scale-125 transition-transform duration-150"
        style={{ left: `calc(${value * 100}% - 8px)` }}
      />
    </div>
  );
};
