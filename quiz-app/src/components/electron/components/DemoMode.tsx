import React, { useState, useEffect } from 'react';
import { AppMode, SimulationParams } from '../types';
import SimulationCanvas from './SimulationCanvas';
import { Slider } from './Slider'; // We will create this
import { Info, MousePointerClick, Zap, ShieldAlert, ArrowRight } from 'lucide-react';
import { BASE_ELECTRONS, BASE_ATOMS, R_REF } from '../constants';

interface Props {
  mode: AppMode;
  onBack: () => void;
}

const DemoMode: React.FC<Props> = ({ mode, onBack }) => {
  const [value, setValue] = useState(0.5); // 0 to 1

  // Params Logic
  const getParams = (): SimulationParams => {
    const baseParams: SimulationParams = {
      electronCount: 100,
      driftStrength: 1.0,
      atomCount: 30,
      wireThickness: 0.5,
      temperature: 0,
      isRealMode: false,
    };

    switch (mode) {
      case AppMode.CURRENT:
        // Slider affects electron count
        // Low: 20, High: 200
        baseParams.electronCount = Math.floor(20 + value * 180);
        baseParams.driftStrength = 1.0; // Fixed
        baseParams.atomCount = 20; // Fixed low-ish
        break;

      case AppMode.VOLTAGE:
        // Slider affects drift bias
        // Low: 0.1 (random), High: 2.5 (strong drift)
        baseParams.electronCount = 100; // Fixed
        baseParams.driftStrength = value * 2.5; 
        baseParams.atomCount = 30; // Fixed
        break;

      case AppMode.RESISTANCE:
        // Slider affects atom count
        // Low: 5, High: 150
        baseParams.electronCount = 100; // Fixed
        baseParams.driftStrength = 1.0; // Fixed
        baseParams.atomCount = Math.floor(5 + value * 145);
        break;
      
      default:
        break;
    }
    return baseParams;
  };

  const getInfo = () => {
    switch (mode) {
      case AppMode.CURRENT:
        return {
          title: "Current (I)",
          desc: "Current is the rate of electron flow. Increase current to see MORE electrons flowing. Note that their individual speed doesn't change!",
          label: "Current Level"
        };
      case AppMode.VOLTAGE:
        return {
          title: "Voltage (V)",
          desc: "Voltage is the electrical 'push'. Higher voltage aligns the electron movement more strongly in one direction. It doesn't make them faster, just more directed.",
          label: "Voltage Level"
        };
      case AppMode.RESISTANCE:
        return {
          title: "Resistance (R)",
          desc: "Resistance opposes flow. More resistance means more obstacles (atoms) for electrons to collide with, scattering their path.",
          label: "Resistance Level"
        };
      default: return { title: "", desc: "", label: "" };
    }
  };

  const info = getInfo();
  const params = getParams();

  return (
    <div className="flex flex-col h-full gap-6 p-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          &larr; Back to Menu
        </button>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          {mode === AppMode.CURRENT && <MousePointerClick className="text-cyan-400" />}
          {mode === AppMode.VOLTAGE && <Zap className="text-yellow-400" />}
          {mode === AppMode.RESISTANCE && <ShieldAlert className="text-red-400" />}
          {info.title} Demo
        </h2>
      </div>

      {/* Main Content: Canvas & Controls */}
      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
        
        {/* Canvas Container */}
        <div className="flex-grow min-h-[300px] lg:h-auto relative">
          <SimulationCanvas 
            params={params} 
            width={800} 
            height={400} 
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-xs text-slate-300 p-2 rounded pointer-events-none">
            Speed: Constant<br/>
            {mode === AppMode.CURRENT ? <strong>Electrons: Varying</strong> : "Electrons: Fixed"}<br/>
            {mode === AppMode.VOLTAGE ? <strong>Drift: Varying</strong> : "Drift: Fixed"}<br/>
            {mode === AppMode.RESISTANCE ? <strong>Atoms: Varying</strong> : "Atoms: Fixed"}
          </div>
        </div>

        {/* Controls Side Panel */}
        <div className="w-full lg:w-80 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col gap-8 shrink-0">
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Info size={18} /> Concept
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {info.desc}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-slate-200 font-medium flex justify-between">
              <span>{info.label}</span>
              <span className="text-slate-400">{Math.round(value * 100)}%</span>
            </label>
            <Slider value={value} onChange={setValue} />
            <div className="flex justify-between text-xs text-slate-500 uppercase font-bold tracking-wider">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DemoMode;

