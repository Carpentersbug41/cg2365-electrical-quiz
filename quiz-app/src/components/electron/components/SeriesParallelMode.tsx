import React, { useState } from 'react';
import SimulationCanvas from './SimulationCanvas';
import { Slider } from './Slider';
import { SimulationParams } from '../types';
import { BASE_ELECTRONS, BASE_ATOMS, REF_CURRENT } from '../constants';
import { clamp } from '../utils/math';
import { ArrowLeftRight, Link, Split, Zap, BoxSelect } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type CircuitType = 'series' | 'parallel';

// --- Helper Component for Schematic ---
const CircuitDiagram = ({ type }: { type: CircuitType }) => {
  const strokeColor = "#94a3b8"; // slate-400
  const resistorColor = "#e2e8f0"; // slate-200
  const labelColor = "#cbd5e1"; // slate-300
  const bgColor = "#0f172a"; // slate-900 (matches panel bg)

  const Battery = () => (
    <g transform="translate(40, 60)">
       {/* Gap cover */}
       <rect x={-10} y={-20} width={20} height={40} fill={bgColor} />
       {/* Plates */}
       <line x1={-15} y1={-8} x2={15} y2={-8} stroke={strokeColor} strokeWidth={2} /> {/* Long + */}
       <line x1={-8} y1={8} x2={8} y2={8} stroke={strokeColor} strokeWidth={2} /> {/* Short - */}
       {/* Connectors */}
       <line x1={0} y1={-25} x2={0} y2={-8} stroke={strokeColor} strokeWidth={2} />
       <line x1={0} y1={8} x2={0} y2={25} stroke={strokeColor} strokeWidth={2} />
       
       <text x={-25} y={5} fill="#facc15" fontSize={14} fontWeight="bold" textAnchor="middle">V</text>
    </g>
  );

  const Resistor = ({ x, y, label, vertical = false }: { x: number, y: number, label: string, vertical?: boolean }) => {
    return (
      <g transform={`translate(${x}, ${y}) ${vertical ? 'rotate(90)' : ''}`}>
        {/* Gap cover */}
        <rect x={-22} y={-10} width={44} height={20} fill={bgColor} />
        {/* Zigzag */}
        <polyline 
          points="-20,0 -15,-8 -10,8 -5,-8 0,8 5,-8 10,8 15,-8 20,0" 
          fill="none" 
          stroke={resistorColor} 
          strokeWidth={2}
        />
        <text 
          x={vertical ? 0 : 0} 
          y={vertical ? -20 : -15} 
          transform={vertical ? 'rotate(-90)' : ''}
          fill={labelColor} 
          fontSize={14} 
          fontWeight="bold" 
          textAnchor="middle"
          dy={vertical ? 5 : 0}
          dx={vertical ? 25 : 0}
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full bg-slate-900 rounded-lg p-4 border border-slate-800 flex justify-center items-center mb-6">
      <svg width="280" height="120" viewBox="0 0 280 120">
        {type === 'series' ? (
          <>
            {/* Main Loop */}
            <rect x={40} y={20} width={200} height={80} fill="none" stroke={strokeColor} strokeWidth={2} rx={4} />
            <Battery />
            <Resistor x={100} y={20} label="R₁" />
            <Resistor x={180} y={20} label="R₂" />
          </>
        ) : (
          <>
             {/* Ladder Structure */}
             {/* Rails */}
             <line x1={40} y1={20} x2={240} y2={20} stroke={strokeColor} strokeWidth={2} /> {/* Top Rail */}
             <line x1={40} y1={100} x2={240} y2={100} stroke={strokeColor} strokeWidth={2} /> {/* Bottom Rail */}
             
             {/* Vertical Rungs */}
             <line x1={40} y1={20} x2={40} y2={100} stroke={strokeColor} strokeWidth={2} /> {/* Battery Rung */}
             <line x1={140} y1={20} x2={140} y2={100} stroke={strokeColor} strokeWidth={2} /> {/* R1 Rung */}
             <line x1={240} y1={20} x2={240} y2={100} stroke={strokeColor} strokeWidth={2} /> {/* R2 Rung */}

             <Battery />
             
             <Resistor x={140} y={60} label="R₁" vertical />
             <Resistor x={240} y={60} label="R₂" vertical />

             {/* Junction Dots */}
             <circle cx={140} cy={20} r={3} fill={strokeColor} />
             <circle cx={140} cy={100} r={3} fill={strokeColor} />
             <circle cx={240} cy={20} r={3} fill={strokeColor} />
             <circle cx={240} cy={100} r={3} fill={strokeColor} />
          </>
        )}
      </svg>
    </div>
  );
};


const SeriesParallelMode: React.FC<Props> = ({ onBack }) => {
  const [circuitType, setCircuitType] = useState<CircuitType>('series');
  const [voltage, setVoltage] = useState(20.0); // Total Source Voltage
  const [r1, setR1] = useState(10.0);
  const [r2, setR2] = useState(10.0);

  // --- Physics Calculations ---
  
  // Resistor 1 Physics
  let v1 = 0, i1 = 0;
  // Resistor 2 Physics
  let v2 = 0, i2 = 0;
  
  let totalCurrent = 0;
  let totalResistance = 0;

  if (circuitType === 'series') {
    // SERIES: I is constant, V splits
    totalResistance = r1 + r2;
    totalCurrent = voltage / totalResistance;
    
    i1 = totalCurrent;
    i2 = totalCurrent;
    
    v1 = totalCurrent * r1;
    v2 = totalCurrent * r2;
  } else {
    // PARALLEL: V is constant, I splits
    // 1/Req = 1/R1 + 1/R2
    totalResistance = (r1 * r2) / (r1 + r2);
    
    v1 = voltage;
    v2 = voltage;
    
    i1 = v1 / r1;
    i2 = v2 / r2;
    
    totalCurrent = i1 + i2;
  }

  // --- Helper to map physics to visual params ---
  const getVisualParams = (current: number, resistance: number, vDrop: number): SimulationParams => {
    // VISUAL MODEL:
    
    // Electron Count -> Proportional to Current
    const iRatio = current / REF_CURRENT;
    const eCount = Math.floor(BASE_ELECTRONS * clamp(Math.sqrt(iRatio), 0.2, 3.5));
    
    // Drift Speed -> Result of (Voltage Push / Resistance).
    // This physically simplifies to Current (I).
    // High Resistance = High "Push" (vDrop) needed, but the net flow is still slow.
    // This satisfies "Resistance slows it down".
    const drift = (vDrop / Math.max(0.1, resistance)) * 2.0; 

    // Resistance -> Atom Count
    const rRatio = resistance / 10.0;
    const aCount = Math.floor(BASE_ATOMS * clamp(rRatio, 0.2, 5.0));
    
    // Temp (P = IV)
    const power = current * current * resistance;
    const temp = Math.min(200, 5 + power * 2);

    return {
      electronCount: eCount,
      driftStrength: clamp(drift, 0.1, 8.0), 
      atomCount: aCount,
      wireThickness: 0.5,
      temperature: temp,
      voltageDrop: vDrop,
      isRealMode: true,
    };
  };

  const params1 = getVisualParams(i1, r1, v1);
  const params2 = getVisualParams(i2, r2, v2);

  return (
    <div className="flex flex-col h-full gap-6 p-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BoxSelect className="text-purple-400" /> Series vs Parallel
          </h2>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setCircuitType('series')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
              circuitType === 'series' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link size={16} /> Series
          </button>
          <button
            onClick={() => setCircuitType('parallel')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
              circuitType === 'parallel' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Split size={16} /> Parallel
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-grow">
        
        {/* Main Visuals: Stacked Wires */}
        <div className="flex-grow flex flex-col gap-6">
          
          {/* Wire 1 */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
             <div className="absolute top-0 left-0 bg-slate-900/80 px-3 py-1 text-xs font-bold text-slate-300 border-b border-r border-slate-800 rounded-br-lg z-10">
               Resistor 1 (R₁)
             </div>
             
             {/* Stats Overlay */}
             <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1 pointer-events-none">
                <div className="bg-black/60 backdrop-blur px-3 py-2 rounded border border-white/10 text-right">
                   <div className="text-xl font-mono text-cyan-400 font-bold">{i1.toFixed(2)} A</div>
                   <div className="text-xs text-slate-400">Current</div>
                </div>
                <div className="bg-black/60 backdrop-blur px-3 py-2 rounded border border-white/10 text-right mt-1">
                   <div className="text-lg font-mono text-yellow-400 font-bold">{v1.toFixed(1)} V</div>
                   <div className="text-xs text-slate-400">Voltage Drop</div>
                </div>
             </div>

             <div className="h-[220px]">
               <SimulationCanvas params={params1} />
             </div>
          </div>

          {/* Wire 2 */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
             <div className="absolute top-0 left-0 bg-slate-900/80 px-3 py-1 text-xs font-bold text-slate-300 border-b border-r border-slate-800 rounded-br-lg z-10">
               Resistor 2 (R₂)
             </div>

             {/* Stats Overlay */}
             <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1 pointer-events-none">
                <div className="bg-black/60 backdrop-blur px-3 py-2 rounded border border-white/10 text-right">
                   <div className="text-xl font-mono text-cyan-400 font-bold">{i2.toFixed(2)} A</div>
                   <div className="text-xs text-slate-400">Current</div>
                </div>
                <div className="bg-black/60 backdrop-blur px-3 py-2 rounded border border-white/10 text-right mt-1">
                   <div className="text-lg font-mono text-yellow-400 font-bold">{v2.toFixed(1)} V</div>
                   <div className="text-xs text-slate-400">Voltage Drop</div>
                </div>
             </div>

             <div className="h-[220px]">
               <SimulationCanvas params={params2} />
             </div>
          </div>

        </div>

        {/* Controls Panel */}
        <div className="w-full xl:w-80 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col gap-6 shrink-0 h-fit">
          
          <h3 className="text-lg font-semibold text-white pb-2 border-b border-slate-800">Circuit Diagram</h3>
          
          <CircuitDiagram type={circuitType} />
          
          <div className="space-y-6">
            
            {/* SOURCE VOLTAGE Slider */}
            <div>
              <label className="flex justify-between text-yellow-400 font-bold mb-2">
                <span>Total Voltage (V)</span>
                <span>{voltage.toFixed(1)} V</span>
              </label>
              <Slider 
                value={voltage / 60} 
                onChange={(v) => setVoltage(Math.max(1, v * 60))} 
              />
            </div>

            <div className="w-full h-px bg-slate-800 my-4" />

            {/* R1 Slider */}
            <div>
              <label className="flex justify-between text-white font-bold mb-2">
                <span>Resistance R₁</span>
                <span>{r1.toFixed(1)} Ω</span>
              </label>
              <Slider 
                value={(r1 - 1) / 49} 
                onChange={(v) => setR1(1 + v * 49)} 
              />
            </div>

            {/* R2 Slider */}
            <div>
              <label className="flex justify-between text-white font-bold mb-2">
                <span>Resistance R₂</span>
                <span>{r2.toFixed(1)} Ω</span>
              </label>
              <Slider 
                value={(r2 - 1) / 49} 
                onChange={(v) => setR2(1 + v * 49)} 
              />
            </div>
          </div>

          <div className="bg-purple-900/20 p-4 rounded border border-purple-500/30">
            <h4 className="text-purple-300 font-bold flex items-center gap-2 mb-2">
              <Zap size={16} /> 
              {circuitType === 'series' ? 'Series Rules' : 'Parallel Rules'}
            </h4>
            
            {circuitType === 'series' ? (
              <ul className="text-xs text-purple-200/80 space-y-2 list-disc pl-4">
                <li>Current is the <strong>SAME</strong> everywhere.<br/>(Same number of electrons)</li>
                <li>Voltage <strong>SPLITS</strong> across resistors.<br/>(V₁ + V₂ = Total V)</li>
                <li className="text-yellow-200">
                   <strong>Resistance Effect:</strong><br/>
                   Higher R = Slower Flow.<br/>
                   It takes more Voltage (Push) just to maintain that slow flow.
                </li>
              </ul>
            ) : (
              <ul className="text-xs text-purple-200/80 space-y-2 list-disc pl-4">
                <li>Voltage is the <strong>SAME</strong> across branches.<br/>(Same Potential)</li>
                <li>Current <strong>SPLITS</strong> between branches.<br/>(Low R = More Electrons)</li>
                <li>Total Current = Sum of branches.</li>
              </ul>
            )}
          </div>

          <div className="bg-slate-800 p-4 rounded text-center">
             <div className="text-slate-400 text-xs mb-1">Total Current Drawn</div>
             <div className="text-2xl font-mono font-bold text-white">{totalCurrent.toFixed(2)} A</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SeriesParallelMode;