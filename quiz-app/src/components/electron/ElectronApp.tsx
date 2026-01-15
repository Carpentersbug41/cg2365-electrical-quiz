'use client';

import React, { useState } from 'react';
import { AppMode } from './types';
import DemoMode from './components/DemoMode';
import RealMode from './components/RealMode';
import { Cpu, Zap, MousePointerClick, ShieldAlert, Activity } from 'lucide-react';

export default function ElectronApp() {
  const [mode, setMode] = useState<AppMode | null>(null);

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-4">
          <Cpu className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Circuit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Simulator</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          An interactive playground to understand how electricity actually works inside a wire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
        {/* Concept Cards */}
        <button 
          onClick={() => setMode(AppMode.CURRENT)}
          className="group relative flex flex-col items-start p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300 text-left"
        >
          <div className="bg-cyan-500/10 p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform">
             <MousePointerClick className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Current</h3>
          <p className="text-slate-400 text-sm">Understand electron flow rate. Why does &quot;Amps&quot; mean &quot;Quantity&quot;?</p>
        </button>

        <button 
          onClick={() => setMode(AppMode.VOLTAGE)}
          className="group relative flex flex-col items-start p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-yellow-500/50 hover:bg-slate-800 transition-all duration-300 text-left"
        >
          <div className="bg-yellow-500/10 p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform">
             <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Voltage</h3>
          <p className="text-slate-400 text-sm">Visualize the &quot;push&quot;. How does potential difference affect motion?</p>
        </button>

        <button 
          onClick={() => setMode(AppMode.RESISTANCE)}
          className="group relative flex flex-col items-start p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-red-500/50 hover:bg-slate-800 transition-all duration-300 text-left"
        >
          <div className="bg-red-500/10 p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform">
             <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Resistance</h3>
          <p className="text-slate-400 text-sm">See the obstacles. How do collisions slow down the flow?</p>
        </button>

        <button 
          onClick={() => setMode(AppMode.REAL)}
          className="group relative flex flex-col items-start p-8 bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-700 rounded-2xl hover:border-green-400 hover:from-slate-800 hover:to-slate-900 transition-all duration-300 text-left shadow-lg shadow-green-900/10"
        >
          <div className="bg-green-500/10 p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform">
             <Activity className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Real Circuit</h3>
          <p className="text-slate-400 text-sm">Combine them all. Ohm&apos;s Law, Geometry, and Heating effects.</p>
        </button>
      </div>
      
      <footer className="text-slate-600 text-sm">
        Educational Physics Model • Simplified for visual clarity
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {!mode && renderMenu()}
      {(mode === AppMode.CURRENT || mode === AppMode.VOLTAGE || mode === AppMode.RESISTANCE) && (
        <DemoMode mode={mode} onBack={() => setMode(null)} />
      )}
      {mode === AppMode.REAL && (
        <RealMode onBack={() => setMode(null)} />
      )}
    </div>
  );
}
