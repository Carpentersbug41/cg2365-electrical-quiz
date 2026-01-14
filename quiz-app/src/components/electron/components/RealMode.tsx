import React, { useState, useEffect, useRef } from 'react';
import { SimulationParams } from '../types';
import SimulationCanvas from './SimulationCanvas';
import { Slider } from './Slider';
import { BASE_ELECTRONS, BASE_ATOMS, REF_CURRENT, MIN_E_SCALE, MAX_E_SCALE } from '../constants';
import { clamp, lerp } from '../utils/math';
import { Flame, Activity, ArrowRight, BatteryWarning } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const RealMode: React.FC<Props> = ({ onBack }) => {
  // Independent States
  // Primary Controls: Voltage (Push), Resistance (Obstacle), Thickness (Geometry)
  const [voltage, setVoltage] = useState(20.0);       // Volts
  const [resistance, setResistance] = useState(10.0); // Ohms
  const [thickness, setThickness] = useState(0.5);    // 0 to 1 (Visual Thickness)

  // Derived Physics
  // Ohm's Law: I = V / R
  const current = voltage / Math.max(0.1, resistance); 
  const power = voltage * current; // P = V * I

  // Temperature Simulation State
  const [temp, setTemp] = useState(5); // Start cold (5°C)

  useEffect(() => {
    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000; // seconds
      lastTime = now;

      // Thermal Physics
      // Volume scales with thickness (Surface Area for cooling)
      const physLength = 5.0; 
      const physArea = 0.2 + thickness * 1.8; 
      
      const volume = physArea * physLength;
      const surface = Math.sqrt(physArea) * physLength * 4; 
      
      // Heat Capacity (Mass)
      const heatCap = 5.0 + volume * 8.0; 
      
      // Cooling (Surface area based)
      const ambient = 5.0; // Bassline temperature much lower
      const coolingRate = 2.0 + surface * 0.5; 

      // Heat Gain (Power)
      const heatGain = power * 50; 
      const coolingLoss = coolingRate * (temp - ambient);

      const deltaT = (heatGain - coolingLoss) / heatCap * dt;
      setTemp(t => Math.max(ambient, t + deltaT));

    }, 50);

    return () => clearInterval(interval);
  }, [voltage, resistance, thickness, power, temp]);

  // Map to Visual Parameters for Canvas
  const getVisualParams = (): SimulationParams => {
    // 1. Current -> Electron Count
    const currentRatio = current / REF_CURRENT; 
    const eCount = Math.floor(BASE_ELECTRONS * clamp(currentRatio, 0.1, 4.0));

    // 2. Resistance -> Atom Count
    // "Resistance increases the number of atoms"
    const rRatio = resistance / 10.0; 
    const aCount = Math.floor(BASE_ATOMS * clamp(rRatio, 0.2, 6.0));

    // 3. Thickness -> Wire Thickness
    const visThickness = thickness;

    // 4. Drift Speed
    // v_d = J / ne = (I/A) / ne.
    // Speed is proportional to Current / Thickness.
    const effArea = 0.1 + thickness * 0.9;
    const densityFactor = 1.0 / effArea;
    const drift = (current * densityFactor) * 0.6; 

    return {
      electronCount: eCount,
      driftStrength: clamp(drift, 0.1, 8.0), // Cap speed
      atomCount: aCount,
      wireThickness: visThickness, 
      temperature: temp,
      isRealMode: true,
    };
  };

  const params = getVisualParams();

  return (
    <div className="flex flex-col h-full gap-6 p-4 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          &larr; Back to Menu
        </button>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-green-400" /> Real Circuit Simulation
        </h2>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-grow">
        
        {/* Main Canvas Area */}
        <div className="flex-grow flex flex-col gap-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
            <SimulationCanvas 
              params={params} 
              width={800} 
              height={400} 
            />
             {/* Overlay HUD */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
              <div className="bg-black/70 backdrop-blur p-3 rounded-lg border border-white/10 text-right">
                <div className="text-xs text-slate-400 uppercase font-bold">Temperature</div>
                <div className={`text-2xl font-mono font-bold ${temp > 200 ? 'text-red-500 animate-pulse' : temp > 80 ? 'text-orange-400' : 'text-blue-300'}`}>
                  {Math.round(temp)}°C
                </div>
              </div>
            </div>
          </div>
          
          {/* Equation Visualizer */}
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
                <div className="text-xs text-slate-400 mb-1">Total Current (I)</div>
                <div className="text-xl font-mono text-cyan-400">{current.toFixed(2)} A</div>
                <div className="text-xs text-slate-500 mt-1">I = V / R</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
                <div className="text-xs text-slate-400 mb-1">Power Dissipated (P)</div>
                <div className="text-xl font-mono text-orange-400">{power.toFixed(1)} W</div>
                <div className="text-xs text-slate-500 mt-1">P = V × I</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
                <div className="text-xs text-slate-400 mb-1">Drift Speed</div>
                <div className="text-xl font-mono text-green-400">{params.driftStrength.toFixed(1)}x</div>
                <div className="text-xs text-slate-500 mt-1">v ∝ I / Area</div>
             </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full xl:w-80 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col gap-8 shrink-0 h-fit">
          
          <div className="space-y-6">
            
            {/* VOLTAGE Slider (Restored) */}
            <div>
              <label className="flex justify-between text-yellow-400 font-bold mb-2">
                <span>Voltage (Volts)</span>
                <span>{voltage.toFixed(1)} V</span>
              </label>
              <Slider 
                value={voltage / 60} 
                onChange={(v) => setVoltage(v * 60)} 
              />
              <p className="text-xs text-slate-500 mt-2">
                Pressure. The "push" from the battery.
              </p>
            </div>

            {/* RESISTANCE Slider */}
            <div>
              <label className="flex justify-between text-white font-bold mb-2">
                <span>Resistance (Ohms)</span>
                <span>{resistance.toFixed(1)} Ω</span>
              </label>
              <Slider 
                value={(resistance - 1) / 49} 
                onChange={(v) => setResistance(1 + v * 49)} 
              />
              <p className="text-xs text-slate-500 mt-2">
                Opposition. Adds collision atoms.
              </p>
            </div>

            {/* THICKNESS Slider */}
            <div>
              <label className="flex justify-between text-slate-300 font-bold mb-2">
                <span>Wire Thickness</span>
                <span>{(thickness * 100).toFixed(0)}%</span>
              </label>
              <Slider 
                value={thickness} 
                onChange={setThickness} 
              />
              <p className="text-xs text-slate-500 mt-2">
                Physical size. Thinner = Higher Density = Hotter.
              </p>
            </div>
            
            <div className="border-t border-slate-800 pt-4">
               {/* CURRENT Slider (Bi-directional) */}
               <div>
                <label className="flex justify-between text-cyan-400 font-bold mb-2">
                  <span>Current (Amps)</span>
                  <span>{current.toFixed(2)} A</span>
                </label>
                {/* We allow setting current by calculating required voltage. Max scale 10A visual. */}
                <Slider 
                  value={Math.min(1, current / 10.0)} 
                  onChange={(v) => {
                    const targetI = v * 10.0;
                    setVoltage(clamp(targetI * resistance, 0, 60));
                  }} 
                />
                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                  <BatteryWarning size={12}/> Adjusts Voltage to match (V = I×R)
                </p>
              </div>
            </div>

          </div>

          <div className="bg-orange-950/30 p-4 rounded border border-orange-900/50">
            <h4 className="text-orange-400 font-bold flex items-center gap-2 mb-2">
              <Flame size={16} /> Temperature
            </h4>
            <p className="text-xs text-orange-200/70 leading-relaxed">
              Ambient: 5°C<br/>
              Current generates heat (Power).<br/>
              Surface area (Thickness) provides cooling.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RealMode;
