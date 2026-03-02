import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Tv, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CircuitAnimation() {
  const [isDedicated, setIsDedicated] = useState(false);
  const [isTripped, setIsTripped] = useState(false);
  const [tvOn, setTvOn] = useState(true);
  const [heaterOn, setHeaterOn] = useState(true);

  // Logic for tripping the shared circuit
  useEffect(() => {
    if (!isDedicated && tvOn && heaterOn) {
      const timer = setTimeout(() => {
        setIsTripped(true);
      }, 2000); // Trip after 2 seconds of overload
      return () => clearTimeout(timer);
    } else {
      setIsTripped(false);
    }
  }, [isDedicated, tvOn, heaterOn]);

  const currentActive = !isTripped;
  const tvCurrent = currentActive && tvOn;
  const heaterCurrent = currentActive && heaterOn;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-4 sm:p-8 bg-slate-50 rounded-3xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Dedicated Circuit</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          A shared circuit can overload when multiple appliances run simultaneously. 
          Moving a high-power appliance to its own dedicated circuit prevents the protective device from tripping.
        </p>
      </div>

      <div className="relative w-full aspect-[2/1] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <defs>
            <style>
              {`
                .flow-active {
                  stroke-dasharray: 12 12;
                  animation: flow 0.8s linear infinite;
                }
                .flow-overload {
                  stroke-dasharray: 12 12;
                  animation: flow 0.3s linear infinite;
                  stroke: #ef4444;
                }
                @keyframes flow {
                  from { stroke-dashoffset: 24; }
                  to { stroke-dashoffset: 0; }
                }
              `}
            </style>
          </defs>

          {/* Consumer Unit */}
          <rect x="40" y="80" width="120" height="240" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
          <text x="100" y="115" textAnchor="middle" className="text-sm font-bold fill-slate-700">Consumer Unit</text>
          
          {/* Breakers */}
          <AnimatePresence>
            {!isDedicated && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <rect x="140" y="195" width="20" height="30" rx="4" fill={isTripped ? "#ef4444" : "#10b981"} />
                <text x="130" y="215" textAnchor="end" className="text-xs font-semibold fill-slate-600">15A</text>
              </motion.g>
            )}
            {isDedicated && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <rect x="140" y="145" width="20" height="30" rx="4" fill="#10b981" />
                <text x="130" y="165" textAnchor="end" className="text-xs font-semibold fill-slate-600">15A</text>
                
                <rect x="140" y="245" width="20" height="30" rx="4" fill="#10b981" />
                <text x="130" y="265" textAnchor="end" className="text-xs font-semibold fill-slate-600">20A</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Wires */}
          <g fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            {/* Shared Paths */}
            {!isDedicated && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Main Shared Wire */}
                <path 
                  d="M 160 210 L 350 210" 
                  stroke={isTripped ? "#ef4444" : "#e2e8f0"} 
                />
                <path 
                  d="M 160 210 L 350 210" 
                  stroke={isTripped ? "#ef4444" : "#3b82f6"} 
                  className={isTripped ? "" : (tvOn && heaterOn ? "flow-overload" : (tvOn || heaterOn ? "flow-active" : ""))}
                  opacity={currentActive && (tvOn || heaterOn) ? 1 : 0}
                />

                {/* Split to TV */}
                <path d="M 350 210 L 350 160 L 480 160" stroke={isTripped ? "#ef4444" : "#e2e8f0"} />
                <path 
                  d="M 350 210 L 350 160 L 480 160" 
                  stroke={isTripped ? "#ef4444" : "#3b82f6"} 
                  className={isTripped ? "" : (tvOn ? "flow-active" : "")}
                  opacity={tvCurrent ? 1 : 0}
                />

                {/* Split to Heater */}
                <path d="M 350 210 L 350 260 L 480 260" stroke={isTripped ? "#ef4444" : "#e2e8f0"} />
                <path 
                  d="M 350 210 L 350 260 L 480 260" 
                  stroke={isTripped ? "#ef4444" : "#3b82f6"} 
                  className={isTripped ? "" : (heaterOn ? "flow-active" : "")}
                  opacity={heaterCurrent ? 1 : 0}
                />
              </motion.g>
            )}

            {/* Dedicated Paths */}
            {isDedicated && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* TV Wire */}
                <path d="M 160 160 L 480 160" stroke="#e2e8f0" />
                <path 
                  d="M 160 160 L 480 160" 
                  stroke="#3b82f6" 
                  className={tvOn ? "flow-active" : ""}
                  opacity={tvOn ? 1 : 0}
                />

                {/* Heater Wire */}
                <path d="M 160 260 L 480 260" stroke="#e2e8f0" />
                <path 
                  d="M 160 260 L 480 260" 
                  stroke="#3b82f6" 
                  className={heaterOn ? "flow-active" : ""}
                  opacity={heaterOn ? 1 : 0}
                />
              </motion.g>
            )}

            {/* Switch to Load Wires */}
            {/* TV */}
            <path d="M 520 160 L 620 160" stroke="#e2e8f0" />
            <path 
              d="M 520 160 L 620 160" 
              stroke={!isDedicated && isTripped ? "#ef4444" : "#3b82f6"} 
              className={!isTripped && tvOn ? "flow-active" : ""}
              opacity={tvCurrent || (isDedicated && tvOn) ? 1 : 0}
            />
            
            {/* Heater */}
            <path d="M 520 260 L 620 260" stroke="#e2e8f0" />
            <path 
              d="M 520 260 L 620 260" 
              stroke={!isDedicated && isTripped ? "#ef4444" : "#3b82f6"} 
              className={!isTripped && heaterOn ? "flow-active" : ""}
              opacity={heaterCurrent || (isDedicated && heaterOn) ? 1 : 0}
            />
          </g>

          {/* Switches */}
          {/* TV Switch */}
          <g transform="translate(480, 140)" className="cursor-pointer" onClick={() => setTvOn(!tvOn)}>
            <rect x="0" y="0" width="40" height="40" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="20" cy="20" r="10" fill={tvOn ? "#10b981" : "#cbd5e1"} />
            <text x="20" y="-8" textAnchor="middle" className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider">Switch</text>
          </g>

          {/* Heater Switch */}
          <g transform="translate(480, 240)" className="cursor-pointer" onClick={() => setHeaterOn(!heaterOn)}>
            <rect x="0" y="0" width="40" height="40" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="20" cy="20" r="10" fill={heaterOn ? "#10b981" : "#cbd5e1"} />
            <text x="20" y="-8" textAnchor="middle" className="text-[10px] font-bold fill-slate-500 uppercase tracking-wider">Switch</text>
          </g>

          {/* Loads */}
          {/* TV Load */}
          <g transform="translate(620, 120)">
            <rect x="0" y="0" width="80" height="80" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <foreignObject x="20" y="15" width="40" height="40">
              <Tv className={`w-10 h-10 transition-colors duration-300 ${tvCurrent || (isDedicated && tvOn) ? "text-blue-500" : "text-slate-300"}`} />
            </foreignObject>
            <text x="40" y="70" textAnchor="middle" className="text-xs font-bold fill-slate-700">TV (2A)</text>
          </g>

          {/* Heater Load */}
          <g transform="translate(620, 220)">
            <rect x="0" y="0" width="80" height="80" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <foreignObject x="20" y="15" width="40" height="40">
              <Flame className={`w-10 h-10 transition-colors duration-300 ${heaterCurrent || (isDedicated && heaterOn) ? "text-orange-500" : "text-slate-300"}`} />
            </foreignObject>
            <text x="40" y="70" textAnchor="middle" className="text-xs font-bold fill-slate-700">Heater (16A)</text>
          </g>

          {/* Status Overlays */}
          <AnimatePresence>
            {!isDedicated && isTripped && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transform="translate(250, 180)"
              >
                <rect x="0" y="0" width="180" height="60" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
                <foreignObject x="12" y="18" width="24" height="24">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </foreignObject>
                <text x="46" y="28" className="text-xs font-bold fill-red-700">Overload Detected!</text>
                <text x="46" y="44" className="text-[10px] font-semibold fill-red-600">Breaker Tripped (18A {'>'} 15A)</text>
              </motion.g>
            )}

            {isDedicated && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transform="translate(250, 180)"
              >
                <rect x="0" y="0" width="180" height="60" rx="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                <foreignObject x="12" y="18" width="24" height="24">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </foreignObject>
                <text x="46" y="28" className="text-xs font-bold fill-green-700">Normal Operation</text>
                <text x="46" y="44" className="text-[10px] font-semibold fill-green-600">Current within limits</text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setIsDedicated(false)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            !isDedicated 
              ? 'bg-slate-800 text-white shadow-md ring-2 ring-slate-800 ring-offset-2' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Shared Circuit
        </button>
        <button
          onClick={() => {
            setIsDedicated(true);
            setTvOn(true);
            setHeaterOn(true);
          }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            isDedicated 
              ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2' 
              : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          <Zap className="w-5 h-5" />
          Move to Dedicated Circuit
        </button>
      </div>
    </div>
  );
}
