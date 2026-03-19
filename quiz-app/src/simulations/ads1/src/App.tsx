import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

type CircuitState = 'normal' | 'fault' | 'tripped';

export default function App() {
  const [circuitState, setCircuitState] = useState<CircuitState>('normal');

  useEffect(() => {
    if (circuitState === 'fault') {
      const timer = setTimeout(() => {
        setCircuitState('tripped');
      }, 2000); // 2 seconds of fault before tripping
      return () => clearTimeout(timer);
    }
  }, [circuitState]);

  const triggerFault = () => {
    if (circuitState === 'normal') {
      setCircuitState('fault');
    }
  };

  const resetCircuit = () => {
    setCircuitState('normal');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center py-12 px-4">
      <div className="max-w-5xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Automatic Disconnection of Supply (ADS)
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Interactive demonstration of how a protective device (fuse) prevents electric shock by disconnecting the supply when a fault occurs.
          </p>
        </header>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          {/* Circuit Diagram */}
          <div className="relative w-full aspect-[2/1] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
                <marker id="arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Power Supply */}
              <g transform="translate(40, 100)">
                <rect x="0" y="0" width="60" height="200" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                <text x="30" y="100" textAnchor="middle" className="text-sm font-semibold tracking-wider" fill="#64748b" transform="rotate(-90 30 100)">230V AC SUPPLY</text>
                <circle cx="60" cy="50" r="4" fill="#ef4444" />
                <circle cx="60" cy="150" r="4" fill="#3b82f6" />
              </g>

              {/* Wires */}
              {/* Live Wire */}
              <path d="M 100 150 L 200 150" fill="none" stroke="#ef4444" strokeWidth="4" />
              <path d="M 240 150 L 320 150" fill="none" stroke="#ef4444" strokeWidth="4" />
              <path d="M 380 150 L 600 150" fill="none" stroke="#ef4444" strokeWidth="4" />
              
              {/* Neutral Wire */}
              <path d="M 600 250 L 100 250" fill="none" stroke="#3b82f6" strokeWidth="4" />

              {/* Earth Wire */}
              <path d="M 650 300 L 650 350 L 400 350 L 400 370" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="8 4" />
              
              {/* Earth Symbol */}
              <g transform="translate(400, 370)">
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                <line x1="-10" y1="6" x2="10" y2="6" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
                <line x1="-5" y1="12" x2="5" y2="12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* Switch */}
              <g transform="translate(200, 150)">
                <circle cx="0" cy="0" r="4" fill="#ef4444" />
                <circle cx="40" cy="0" r="4" fill="#ef4444" />
                <line x1="0" y1="0" x2="38" y2="0" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <text x="20" y="-15" textAnchor="middle" className="text-xs font-bold tracking-widest" fill="#64748b">SWITCH</text>
              </g>

              {/* Protective Device Label */}
              <g transform="translate(350, 70)">
                <path d="M 0 20 L 0 45" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow-gray)" />
                <rect x="-70" y="-10" width="140" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <text x="0" y="6" textAnchor="middle" className="text-[10px] font-bold tracking-wider" fill="#475569">PROTECTIVE DEVICE</text>
              </g>

              {/* Fuse */}
              <g transform="translate(320, 130)">
                <rect x="0" y="0" width="60" height="40" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
                <text x="30" y="55" textAnchor="middle" className="text-xs font-bold tracking-widest" fill="#64748b">FUSE</text>
                {/* Fuse Wire */}
                {circuitState !== 'tripped' ? (
                  <motion.path 
                    d="M 0 20 L 60 20" 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="3"
                    animate={circuitState === 'fault' ? { stroke: '#ef4444', strokeWidth: 5 } : {}}
                  />
                ) : (
                  <path d="M 0 20 L 20 20 M 40 20 L 60 20" fill="none" stroke="#94a3b8" strokeWidth="3" />
                )}
                {circuitState === 'fault' && (
                  <motion.circle 
                    cx="30" cy="20" r="12" fill="#fef08a" opacity="0.8"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.15 }}
                  />
                )}
                {circuitState === 'tripped' && (
                  <text x="30" y="24" textAnchor="middle" className="text-[10px] font-bold" fill="#ef4444">BLOWN</text>
                )}
              </g>

              {/* Appliance (Washing Machine) */}
              <g transform="translate(600, 100)">
                {/* Metal Casing */}
                <motion.rect 
                  x="0" y="0" width="120" height="200" rx="12" 
                  fill="#f8fafc" 
                  stroke={circuitState === 'fault' ? '#ef4444' : '#cbd5e1'} 
                  strokeWidth="4" 
                  animate={circuitState === 'fault' ? { fill: '#fee2e2' } : { fill: '#f8fafc' }}
                />
                <circle cx="60" cy="100" r="40" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="4" />
                <circle cx="60" cy="100" r="30" fill="#f1f5f9" />
                <rect x="20" y="20" width="30" height="10" rx="2" fill="#cbd5e1" />
                <circle cx="90" cy="25" r="5" fill="#cbd5e1" />
                
                <rect x="-10" y="-35" width="140" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <text x="60" y="-19" textAnchor="middle" className="text-[10px] font-bold tracking-wider" fill="#475569">EXPOSED CONDUCTIVE PART</text>
                <text x="60" y="220" textAnchor="middle" className="text-[11px] font-semibold" fill="#94a3b8">(Metal Casing)</text>

                {/* Internal Motor/Load */}
                <rect x="40" y="70" width="40" height="60" rx="4" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
                
                {/* Internal Wiring */}
                <path d="M 0 50 L 40 80" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 40 120 L 0 150" fill="none" stroke="#3b82f6" strokeWidth="2" />
                
                {/* Earth Connection to Casing */}
                <circle cx="50" cy="200" r="4" fill="#22c55e" />
                <text x="50" y="190" textAnchor="middle" className="text-[10px] font-bold" fill="#22c55e">EARTHED</text>

                {/* Fault Wire */}
                <AnimatePresence>
                  {circuitState !== 'normal' && (
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      d="M 20 65 L 0 100" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </AnimatePresence>
                {circuitState === 'fault' && (
                  <motion.g 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    transform="translate(0, 100)"
                  >
                    <path d="M -10 -10 L 5 5 L -5 5 L 10 20" fill="none" stroke="#eab308" strokeWidth="3" />
                  </motion.g>
                )}
              </g>

              {/* Current Flow Animation */}
              {circuitState === 'normal' && (
                <>
                  {/* Live Current */}
                  <circle r="4" fill="#ef4444">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 100 150 L 600 150 L 640 180" />
                  </circle>
                  <circle r="4" fill="#ef4444">
                    <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 100 150 L 600 150 L 640 180" />
                  </circle>
                  
                  {/* Neutral Current */}
                  <circle r="4" fill="#3b82f6">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 640 220 L 600 250 L 100 250" />
                  </circle>
                  <circle r="4" fill="#3b82f6">
                    <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 640 220 L 600 250 L 100 250" />
                  </circle>
                </>
              )}

              {circuitState === 'fault' && (
                <>
                  {/* High Fault Current - Live to Earth */}
                  <circle r="6" fill="#ef4444">
                    <animateMotion dur="0.4s" repeatCount="indefinite" path="M 100 150 L 600 150 L 620 165 L 600 200 L 650 300 L 650 350 L 400 350 L 400 370" />
                  </circle>
                  <circle r="6" fill="#ef4444">
                    <animateMotion dur="0.4s" begin="0.2s" repeatCount="indefinite" path="M 100 150 L 600 150 L 620 165 L 600 200 L 650 300 L 650 350 L 400 350 L 400 370" />
                  </circle>
                </>
              )}

            </svg>
          </div>

          {/* Controls & Info Panel */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col justify-center gap-4">
              <button
                onClick={triggerFault}
                disabled={circuitState !== 'normal'}
                className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  circuitState === 'normal' 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap size={24} />
                Simulate Fault
              </button>
              
              <button
                onClick={resetCircuit}
                disabled={circuitState === 'normal'}
                className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  circuitState !== 'normal'
                    ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <RotateCcw size={24} />
                Reset Circuit
              </button>
            </div>

            <div className="col-span-1 lg:col-span-2 bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 shadow-inner">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                {circuitState === 'normal' && <ShieldCheck className="text-green-500 w-8 h-8" />}
                {circuitState === 'fault' && <AlertTriangle className="text-yellow-500 w-8 h-8" />}
                {circuitState === 'tripped' && <ShieldCheck className="text-blue-500 w-8 h-8" />}
                <span>
                  {
                    circuitState === 'normal' ? 'Normal Operation' :
                    circuitState === 'fault' ? 'Fault Detected! High Current Flowing' :
                    'Supply Disconnected (Safe)'
                  }
                </span>
              </h3>
              
              <div className="text-slate-600 space-y-3 text-base md:text-lg leading-relaxed">
                {circuitState === 'normal' && (
                  <p>Current flows safely through the live wire, into the appliance, and returns via the neutral wire. The metal casing is earthed but carries no current.</p>
                )}
                {circuitState === 'fault' && (
                  <p><strong>DANGER:</strong> The live wire has touched the metal casing! Because the casing is earthed, a massive fault current surges through the live wire and down the earth wire, bypassing the normal load.</p>
                )}
                {circuitState === 'tripped' && (
                  <p><strong>ADS Complete:</strong> The protective device (fuse) sensed the dangerously high fault current and blew. This broke the circuit, disconnecting the supply and ensuring the exposed conductive part is no longer live.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
