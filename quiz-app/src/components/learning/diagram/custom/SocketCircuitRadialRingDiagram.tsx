'use client';

import React, { useState } from 'react';

type ConductorType = 'earth' | 'neutral' | 'line';
type ActiveWire = ConductorType | null;

const radialPaths: Record<ConductorType, string> = {
  earth: `
    M 130 245 L 300 245 L 300 180
    M 300 180 L 300 120 L 500 120 L 500 180
    M 500 180 L 500 120 L 700 120 L 700 180
  `,
  neutral: `
    M 130 275 L 280 275 L 280 210
    M 280 210 L 280 285 L 480 285 L 480 210
    M 480 210 L 480 285 L 680 285 L 680 210
  `,
  line: `
    M 130 305 L 320 305 L 320 210
    M 320 210 L 320 315 L 520 315 L 520 210
    M 520 210 L 520 315 L 720 315 L 720 210
  `,
};

const ringPaths: Record<ConductorType, string> = {
  earth: `${radialPaths.earth}
    M 700 180 L 700 330 L 110 330 L 110 240 L 130 240
  `,
  neutral: `${radialPaths.neutral}
    M 680 210 L 680 350 L 110 350 L 110 270 L 130 270
  `,
  line: `${radialPaths.line}
    M 720 210 L 720 370 L 110 370 L 110 300 L 130 300
  `,
};

interface WireProps {
  path: string;
  type: ConductorType;
  active: ActiveWire;
  onHover: (type: ActiveWire) => void;
}

function Wire({ path, type, active, onHover }: WireProps) {
  const isEarth = type === 'earth';
  const isNeutral = type === 'neutral';
  const baseColor = isEarth ? '#16a34a' : isNeutral ? '#2563eb' : '#8b4513';
  const opacity = active === null || active === type ? 1 : 0.2;
  const isHighlighted = active === type;

  return (
    <g
      onMouseEnter={() => onHover(type)}
      onMouseLeave={() => onHover(null)}
      style={{ opacity, transition: 'opacity 0.2s', cursor: 'pointer' }}
    >
      <path d={path} fill="none" stroke="transparent" strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
      <path
        d={path}
        fill="none"
        stroke={baseColor}
        strokeWidth={isHighlighted ? '6' : '4'}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ transition: 'stroke-width 0.2s' }}
      />
      {isEarth && (
        <path
          d={path}
          fill="none"
          stroke="#facc15"
          strokeWidth={isHighlighted ? '6' : '4'}
          strokeDasharray="12 12"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ transition: 'stroke-width 0.2s' }}
        />
      )}
    </g>
  );
}

function ConsumerUnit() {
  return (
    <g className="pointer-events-none">
      <rect x="30" y="150" width="120" height="180" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" rx="8" />
      <rect x="30" y="150" width="120" height="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" rx="8" />
      <text x="90" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">Consumer Unit</text>

      <rect x="50" y="200" width="80" height="115" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" rx="4" />
      <rect x="55" y="205" width="70" height="25" fill="#e2e8f0" rx="2" />
      <text x="90" y="222" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">32A MCB</text>

      <circle cx="130" cy="240" r="6" fill="#16a34a" />
      <circle cx="130" cy="270" r="6" fill="#2563eb" />
      <circle cx="130" cy="300" r="6" fill="#8b4513" />
    </g>
  );
}

function Sockets() {
  return (
    <g className="pointer-events-none">
      {[250, 450, 650].map((x, i) => (
        <g key={i}>
          <rect x={x} y={130} width="100" height="100" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" rx="8" />
          <text x={x + 50} y={150} textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">Socket {i + 1}</text>

          <rect x={x + 45} y={165} width="10" height="15" fill="#334155" rx="2" />
          <rect x={x + 25} y={195} width="10" height="15" fill="#334155" rx="2" />
          <rect x={x + 65} y={195} width="10" height="15" fill="#334155" rx="2" />

          <circle cx={x + 50} cy={180} r="4" fill="#16a34a" />
          <circle cx={x + 30} cy={210} r="4" fill="#2563eb" />
          <circle cx={x + 70} cy={210} r="4" fill="#8b4513" />
        </g>
      ))}
    </g>
  );
}

interface CircuitProps {
  svgPaths: Record<ConductorType, string>;
  active: ActiveWire;
  onHover: (type: ActiveWire) => void;
  isRing?: boolean;
}

function Circuit({ svgPaths, active, onHover, isRing = false }: CircuitProps) {
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto bg-slate-50 rounded-xl border border-slate-200">
      <Wire path={svgPaths.earth} type="earth" active={active} onHover={onHover} />
      <Wire path={svgPaths.neutral} type="neutral" active={active} onHover={onHover} />
      <Wire path={svgPaths.line} type="line" active={active} onHover={onHover} />

      <ConsumerUnit />
      <Sockets />

      <text x="200" y="240" fontSize="12" fill="#16a34a" fontWeight="600" className="pointer-events-none">CPC</text>
      <text x="200" y="270" fontSize="12" fill="#2563eb" fontWeight="600" className="pointer-events-none">Neutral</text>
      <text x="200" y="300" fontSize="12" fill="#8b4513" fontWeight="600" className="pointer-events-none">Line</text>

      {isRing && (
        <>
          <text x="400" y="325" fontSize="12" fill="#16a34a" fontWeight="600" textAnchor="middle" className="pointer-events-none">CPC Return Path</text>
          <text x="400" y="345" fontSize="12" fill="#2563eb" fontWeight="600" textAnchor="middle" className="pointer-events-none">Neutral Return Path</text>
          <text x="400" y="365" fontSize="12" fill="#8b4513" fontWeight="600" textAnchor="middle" className="pointer-events-none">Line Return Path</text>
        </>
      )}
    </svg>
  );
}

interface LegendProps {
  active: ActiveWire;
  onHover: (type: ActiveWire) => void;
}

function Legend({ active, onHover }: LegendProps) {
  return (
    <div className="flex flex-wrap gap-6 justify-center mt-8 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <div
        className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${active && active !== 'line' ? 'opacity-40 grayscale' : 'opacity-100 scale-105'}`}
        onMouseEnter={() => onHover('line')}
        onMouseLeave={() => onHover(null)}
      >
        <div className="w-8 h-1.5 bg-[#8b4513] rounded-full"></div>
        <span className="text-sm font-semibold text-slate-700">Line Conductor</span>
      </div>
      <div
        className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${active && active !== 'neutral' ? 'opacity-40 grayscale' : 'opacity-100 scale-105'}`}
        onMouseEnter={() => onHover('neutral')}
        onMouseLeave={() => onHover(null)}
      >
        <div className="w-8 h-1.5 bg-[#2563eb] rounded-full"></div>
        <span className="text-sm font-semibold text-slate-700">Neutral Conductor</span>
      </div>
      <div
        className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${active && active !== 'earth' ? 'opacity-40 grayscale' : 'opacity-100 scale-105'}`}
        onMouseEnter={() => onHover('earth')}
        onMouseLeave={() => onHover(null)}
      >
        <div className="w-8 h-1.5 bg-[#16a34a] rounded-full relative overflow-hidden">
          <div className="absolute inset-0 border-t-2 border-dashed border-[#facc15]"></div>
        </div>
        <span className="text-sm font-semibold text-slate-700">Circuit Protective Conductor (CPC)</span>
      </div>
    </div>
  );
}

export default function SocketCircuitRadialRingDiagram() {
  const [activeWire, setActiveWire] = useState<ActiveWire>(null);

  return (
    <div className="w-full p-2 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-2">
          <h3 className="text-2xl font-bold tracking-tight mb-1">Socket Circuits: Radial vs Ring Final</h3>
          <p className="text-slate-600">Interactive diagrams showing the wiring paths of standard socket circuits.</p>
        </div>

        <Legend active={activeWire} onHover={setActiveWire} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="text-xl font-bold mb-5 text-center text-slate-800">Radial Circuit</h4>
            <Circuit svgPaths={radialPaths} active={activeWire} onHover={setActiveWire} />
            <p className="mt-3 text-sm text-slate-500 text-center">A linear arrangement terminating at the final outlet.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="text-xl font-bold mb-5 text-center text-slate-800">Ring Final Circuit</h4>
            <Circuit svgPaths={ringPaths} active={activeWire} onHover={setActiveWire} isRing />
            <p className="mt-3 text-sm text-slate-500 text-center">A continuous loop returning to the consumer unit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
