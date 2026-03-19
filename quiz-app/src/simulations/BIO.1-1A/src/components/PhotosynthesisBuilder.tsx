import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Cloud, Droplets, Info } from 'lucide-react';

export default function PhotosynthesisBuilder() {
  const [hasLight, setHasLight] = useState(false);
  const [hasCO2, setHasCO2] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [biomass, setBiomass] = useState(10);

  const isPhotosynthesizing = hasLight && hasCO2 && hasWater;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPhotosynthesizing) {
      interval = setInterval(() => {
        setBiomass((prev) => Math.min(prev + 0.5, 100));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPhotosynthesizing]);

  let statusMessage = "Photosynthesis is happening!";
  let statusColor = "text-green-600";
  if (!hasLight && !hasCO2 && !hasWater) {
    statusMessage = "Turn on inputs to start photosynthesis";
    statusColor = "text-gray-500";
  } else if (!hasLight) {
    statusMessage = "No light = no photosynthesis";
    statusColor = "text-amber-600";
  } else if (!hasWater) {
    statusMessage = "Water is needed";
    statusColor = "text-blue-600";
  } else if (!hasCO2) {
    statusMessage = "Carbon dioxide is needed";
    statusColor = "text-slate-600";
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col border border-sky-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Photosynthesis Builder</h1>
        <p className="text-green-100 mt-2 text-lg">Feed the leaf to grow the plant</p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 p-6 gap-8">
        {/* Controls */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Inputs</h2>
          
          <Toggle 
            active={hasLight} 
            onClick={() => setHasLight(!hasLight)} 
            icon={<Sun className={hasLight ? "text-amber-500" : "text-gray-400"} />}
            label="Light Energy"
            color="bg-amber-100 border-amber-300"
            activeColor="bg-amber-500"
          />
          
          <Toggle 
            active={hasCO2} 
            onClick={() => setHasCO2(!hasCO2)} 
            icon={<Cloud className={hasCO2 ? "text-slate-500" : "text-gray-400"} />}
            label="Carbon Dioxide"
            color="bg-slate-100 border-slate-300"
            activeColor="bg-slate-500"
          />
          
          <Toggle 
            active={hasWater} 
            onClick={() => setHasWater(!hasWater)} 
            icon={<Droplets className={hasWater ? "text-blue-500" : "text-gray-400"} />}
            label="Water"
            color="bg-blue-100 border-blue-300"
            activeColor="bg-blue-500"
          />

          <button 
            onClick={() => setHasLight(false)}
            className="mt-4 py-3 px-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            Dark Box (Light Off)
          </button>
        </div>

        {/* Animation Area */}
        <div className="flex-1 relative bg-sky-50 rounded-2xl border border-sky-100 overflow-hidden min-h-[400px] flex items-end justify-center pb-12">
          
          {/* Environment Elements */}
          <div className="absolute top-4 left-4 text-amber-500 font-bold opacity-80 flex items-center gap-2">
            <Sun size={32} className={hasLight ? "animate-spin-slow" : ""} />
            {hasLight ? "Sunlight Active" : ""}
          </div>

          {/* Particles */}
          {hasLight && isPhotosynthesizing && <LightParticles />}
          {hasCO2 && isPhotosynthesizing && <CO2Particles />}
          {hasWater && isPhotosynthesizing && <WaterParticles />}
          {isPhotosynthesizing && <OxygenParticles />}
          {isPhotosynthesizing && <GlucoseParticles />}

          {/* Plant */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              className="origin-bottom"
              animate={{ scale: 1 + (biomass / 100) * 0.8 }}
              transition={{ type: "spring", bounce: 0.2 }}
            >
              <PlantSVG isPhotosynthesizing={isPhotosynthesizing} />
            </motion.div>
            {/* Soil/Pot */}
            <div className="w-32 h-12 bg-amber-900 rounded-b-2xl rounded-t-sm mt-[-4px] z-20 relative shadow-inner">
               <div className="absolute top-0 w-full h-2 bg-amber-800 rounded-t-sm"></div>
            </div>
          </div>

        </div>

        {/* Status Panel */}
        <div className="w-full md:w-72 flex flex-col gap-6">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Status</h2>
            <p className={`text-lg font-medium ${statusColor} min-h-[3rem]`}>
              {statusMessage}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-lg font-semibold text-green-800">Biomass</h2>
              <span className="text-green-700 font-mono font-bold">{Math.floor(biomass)}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-4 overflow-hidden">
              <motion.div 
                className="bg-green-600 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${biomass}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
              />
            </div>
            <p className="text-sm text-green-700 mt-3 opacity-80">
              Biomass increases when photosynthesis produces glucose.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 mt-auto">
            <h3 className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-wider flex items-center gap-1">
              <Info size={16} /> Reaction
            </h3>
            <div className="text-center font-mono text-sm text-blue-900 bg-white p-3 rounded-xl border border-blue-100">
              <span className={hasCO2 ? "font-bold" : "opacity-50"}>Carbon Dioxide</span>
              <br/>+<br/>
              <span className={hasWater ? "font-bold" : "opacity-50"}>Water</span>
              <br/>+<br/>
              <span className={hasLight ? "font-bold text-amber-600" : "opacity-50"}>Light</span>
              <br/>↓<br/>
              <span className={isPhotosynthesizing ? "font-bold text-emerald-600" : "opacity-50"}>Glucose</span>
              <br/>+<br/>
              <span className={isPhotosynthesizing ? "font-bold text-cyan-600" : "opacity-50"}>Oxygen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick, icon, label, color, activeColor }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
        active ? `${color} shadow-sm` : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${active ? 'bg-white/50' : 'bg-gray-50'}`}>
          {icon}
        </div>
        <span className={`font-semibold ${active ? 'text-gray-900' : 'text-gray-600'}`}>
          {label}
        </span>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? activeColor : 'bg-gray-300'}`}>
        <motion.div 
          className="w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: active ? 24 : 0 }}
        />
      </div>
    </button>
  );
}

// SVG Plant Component
function PlantSVG({ isPhotosynthesizing }: { isPhotosynthesizing: boolean }) {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" className="overflow-visible">
      {/* Stem */}
      <path d="M80,200 Q80,100 80,40" stroke="#4ade80" strokeWidth="8" fill="none" strokeLinecap="round" />
      
      {/* Left Leaf */}
      <motion.g 
        style={{ originX: "100%", originY: "100%" }}
        animate={isPhotosynthesizing ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <path d="M80,140 Q30,140 20,90 Q50,80 80,140" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
        <path d="M80,140 Q50,115 20,90" stroke="#16a34a" strokeWidth="2" fill="none" />
      </motion.g>

      {/* Right Leaf */}
      <motion.g 
        style={{ originX: "0%", originY: "100%" }}
        animate={isPhotosynthesizing ? { rotate: [2, -2, 2] } : { rotate: 0 }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      >
        <path d="M80,100 Q130,100 140,50 Q110,40 80,100" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
        <path d="M80,100 Q110,75 140,50" stroke="#16a34a" strokeWidth="2" fill="none" />
      </motion.g>

      {/* Top Leaf */}
      <motion.g 
        style={{ originX: "50%", originY: "100%" }}
        animate={isPhotosynthesizing ? { rotate: [-1, 1, -1] } : { rotate: 0 }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <path d="M80,40 Q50,0 80,-30 Q110,0 80,40" fill="#4ade80" stroke="#22c55e" strokeWidth="2" />
        <path d="M80,40 Q80,5 80,-30" stroke="#22c55e" strokeWidth="2" fill="none" />
      </motion.g>
    </svg>
  );
}

// Particle Components
function LightParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`light-${i}`}
          className="absolute w-1 h-16 bg-amber-300 rounded-full blur-[1px]"
          style={{ left: `${20 + i * 15}%`, top: '-10%' }}
          animate={{
            y: ['0vh', '60vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

function CO2Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`co2-${i}`}
          className="absolute flex items-center justify-center"
          style={{ left: i % 2 === 0 ? '-5%' : '105%', top: `${30 + i * 10}%` }}
          animate={{
            x: i % 2 === 0 ? ['0vw', '25vw'] : ['0vw', '-25vw'],
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        >
          <div className="bg-slate-500 text-white text-[8px] font-bold px-1 rounded-sm">CO₂</div>
        </motion.div>
      ))}
    </div>
  );
}

function WaterParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`h2o-${i}`}
          className="absolute"
          style={{ left: `${45 + Math.random() * 10}%`, bottom: '0%' }}
          animate={{
            y: ['0px', '-150px'],
            x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut"
          }}
        >
          <div className="w-2 h-3 bg-blue-400 rounded-full rounded-t-none" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 50%)' }}></div>
        </motion.div>
      ))}
    </div>
  );
}

function OxygenParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`o2-${i}`}
          className="absolute flex items-center justify-center"
          style={{ left: `${40 + Math.random() * 20}%`, top: '40%' }}
          animate={{
            y: ['0px', '-100px'],
            x: [0, i % 2 === 0 ? 50 : -50],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut"
          }}
        >
          <div className="bg-cyan-100 border border-cyan-400 text-cyan-700 text-[8px] font-bold px-1 rounded-full">O₂</div>
        </motion.div>
      ))}
    </div>
  );
}

function GlucoseParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`glucose-${i}`}
          className="absolute"
          style={{ top: '50%' }}
          animate={{
            y: ['0px', '80px'],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 90]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.3,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-6 bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <span className="text-[6px] font-bold text-emerald-700">C₆</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
