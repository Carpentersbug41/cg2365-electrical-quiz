import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Scissors, Wrench } from 'lucide-react';

const Switch = ({ x, y, isOpen, hinge = 'bottom', onClick, label, labelPos = 'left' }: any) => {
  const contactY = hinge === 'bottom' ? y - 40 : y + 40;
  const textX = labelPos === 'left' ? x - 15 : x + 15;
  const textAnchor = labelPos === 'left' ? 'end' : 'start';
  
  return (
    <g onClick={onClick} className="cursor-pointer group">
      {/* Invisible hit area */}
      <rect x={x - 40} y={Math.min(y, contactY) - 20} width={80} height={80} fill="transparent" />
      {/* Hover highlight */}
      <circle cx={x} cy={Math.min(y, contactY) + 20} r="35" className="fill-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <motion.line
        x1={x} y1={y} x2={x} y2={contactY}
        stroke={isOpen ? "#94a3b8" : "#10b981"}
        strokeWidth="4" strokeLinecap="round"
        animate={{ rotate: isOpen ? (hinge === 'bottom' ? -30 : 30) : 0 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <circle cx={x} cy={y} r="5" className="fill-slate-800 group-hover:fill-slate-600 transition-colors" />
      <circle cx={x} cy={contactY} r="5" className="fill-slate-800 group-hover:fill-slate-600 transition-colors" />
      <text x={textX} y={Math.min(y, contactY) + 24} className="text-[11px] fill-slate-600 font-bold select-none group-hover:fill-slate-900 transition-colors" textAnchor={textAnchor}>
        {label}
      </text>
    </g>
  );
};

const ControlUnit = ({ isAlarmOn }: { isAlarmOn: boolean }) => (
  <g>
    <rect x={100} y={300} width={100} height={80} rx={8} fill="#1e293b" />
    <text x={150} y={335} className="text-[10px] fill-slate-400 font-bold tracking-wider select-none" textAnchor="middle">ALARM</text>
    <text x={150} y={350} className="text-[10px] fill-slate-400 font-bold tracking-wider select-none" textAnchor="middle">CONTROLLER</text>
    
    {/* Terminals */}
    <circle cx={120} cy={300} r="4" fill="#cbd5e1" />
    <circle cx={180} cy={300} r="4" fill="#cbd5e1" />
    <circle cx={200} cy={340} r="4" fill="#cbd5e1" />
    
    {/* Status LED */}
    <circle cx={150} cy={370} r="5" fill={isAlarmOn ? "#ef4444" : "#10b981"} />
    {/* LED Glow */}
    <circle cx={150} cy={370} r="10" fill={isAlarmOn ? "#ef4444" : "#10b981"} opacity="0.3" />
  </g>
);

const AlarmBell = ({ isOn }: { isOn: boolean }) => (
  <g>
    {/* Wire from Control Unit */}
    <line x1={200} y1={340} x2={260} y2={340} stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
    
    {/* Sound waves */}
    {isOn && (
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
        style={{ transformOrigin: "260px 340px" }}
      >
        <circle cx={260} cy={340} r="25" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.8" />
        <circle cx={260} cy={340} r="35" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4" />
      </motion.g>
    )}

    <motion.g
      animate={isOn ? { rotate: [0, -15, 15, -15, 15, 0] } : { rotate: 0 }}
      transition={{ repeat: isOn ? Infinity : 0, duration: 0.3 }}
      style={{ transformOrigin: "260px 340px" }}
    >
      <circle cx={260} cy={340} r="20" fill={isOn ? "#ef4444" : "#f1f5f9"} stroke={isOn ? "#dc2626" : "#cbd5e1"} strokeWidth="2" />
      <g transform="translate(250, 330)">
        <Bell color={isOn ? "#ffffff" : "#64748b"} size={20} />
      </g>
    </motion.g>
  </g>
);

const CircuitParallel = () => {
  const [sw1, setSw1] = useState(false); // false = open
  const [sw2, setSw2] = useState(false);
  
  const isAlarmOn = sw1 || sw2;
  
  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Normally Open (Parallel)</h3>
      <p className="text-sm text-slate-500 mb-8 text-center h-12 max-w-[280px]">
        Sensors are wired in parallel. Closing ANY sensor completes the circuit and triggers the alarm.
      </p>
      
      <svg width={320} height={400} className="overflow-visible">
        {/* Static Wires */}
        <path d="M 120 300 L 120 260 L 80 260 L 80 220" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M 80 180 L 80 140 L 120 140" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M 120 260 L 160 260 L 160 220" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M 160 180 L 160 140 L 120 140" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M 120 140 L 120 100 L 220 100 L 220 300 L 180 300" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        
        {/* Current Flow Animation */}
        {sw1 && (
          <motion.path
            d="M 120 300 L 120 260 L 80 260 L 80 140 L 120 140 L 120 100 L 220 100 L 220 300 L 180 300"
            fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 8" strokeLinejoin="round" strokeLinecap="round"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          />
        )}
        {sw2 && (
          <motion.path
            d="M 120 300 L 120 260 L 160 260 L 160 140 L 120 140 L 120 100 L 220 100 L 220 300 L 180 300"
            fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 8" strokeLinejoin="round" strokeLinecap="round"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          />
        )}
        
        {/* Switches */}
        <Switch x={80} y={220} isOpen={!sw1} hinge="bottom" onClick={() => setSw1(!sw1)} label="Window (NO)" labelPos="left" />
        <Switch x={160} y={220} isOpen={!sw2} hinge="bottom" onClick={() => setSw2(!sw2)} label="Door (NO)" labelPos="right" />
        
        {/* Components */}
        <ControlUnit isAlarmOn={isAlarmOn} />
        <AlarmBell isOn={isAlarmOn} />
      </svg>

      <div className="mt-8 flex gap-3 w-full justify-center">
        <button
          onClick={() => setSw1(!sw1)}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${sw1 ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          {sw1 ? 'Open Window' : 'Close Window'}
        </button>
        <button
          onClick={() => setSw2(!sw2)}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${sw2 ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          {sw2 ? 'Open Door' : 'Close Door'}
        </button>
      </div>
    </div>
  );
};

const CircuitSeries = () => {
  const [sw1, setSw1] = useState(true); // true = closed
  const [sw2, setSw2] = useState(true);
  const [wireCut, setWireCut] = useState(false);
  
  const isLoopClosed = sw1 && sw2 && !wireCut;
  const isAlarmOn = !isLoopClosed;
  
  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Normally Closed (Series)</h3>
      <p className="text-sm text-slate-500 mb-8 text-center h-12 max-w-[280px]">
        Sensors are wired in series. Opening ANY sensor (or cutting the wire) breaks the loop and triggers the alarm.
      </p>
      
      <svg width={320} height={400} className="overflow-visible">
        {/* Static Wires */}
        <path d="M 120 300 L 80 300 L 80 220" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M 80 180 L 80 100 L 220 100 L 220 180" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        
        {/* Cuttable Wire */}
        <path d="M 220 220 L 220 300 L 180 300" fill="none" stroke={wireCut ? "transparent" : "#cbd5e1"} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        
        {wireCut && (
          <g>
            <path d="M 220 220 L 220 250" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M 220 270 L 220 300 L 180 300" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            {/* Spark / Break indicator */}
            <motion.path 
              d="M 210 255 L 230 265 M 210 265 L 230 255" 
              fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              style={{ transformOrigin: "220px 260px" }}
            />
          </g>
        )}
        
        {/* Current Flow Animation */}
        {isLoopClosed && (
          <motion.path
            d="M 120 300 L 80 300 L 80 100 L 220 100 L 220 300 L 180 300"
            fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 8" strokeLinejoin="round" strokeLinecap="round"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          />
        )}
        
        {/* Switches */}
        <Switch x={80} y={220} isOpen={!sw1} hinge="bottom" onClick={() => setSw1(!sw1)} label="Window (NC)" labelPos="left" />
        <Switch x={220} y={180} isOpen={!sw2} hinge="top" onClick={() => setSw2(!sw2)} label="Door (NC)" labelPos="right" />
        
        {/* Components */}
        <ControlUnit isAlarmOn={isAlarmOn} />
        <AlarmBell isOn={isAlarmOn} />
      </svg>

      <div className="mt-8 flex flex-wrap gap-3 w-full justify-center">
        <button
          onClick={() => setSw1(!sw1)}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${!sw1 ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          {!sw1 ? 'Close Window' : 'Open Window'}
        </button>
        <button
          onClick={() => setSw2(!sw2)}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${!sw2 ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          {!sw2 ? 'Close Door' : 'Open Door'}
        </button>
        <button
          onClick={() => setWireCut(!wireCut)}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${wireCut ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-800 text-white hover:bg-slate-700 shadow-md'}`}
        >
          {wireCut ? <><Wrench size={16} /> Repair Wire</> : <><Scissors size={16} /> Cut Wire</>}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-6 font-sans">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Alarm Circuits Explained</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore the difference between Normally Open (Parallel) and Normally Closed (Series) alarm circuits. 
            <strong className="font-semibold text-slate-800"> Click the sensors or use the buttons </strong> to see how each circuit reacts.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <CircuitParallel />
          <CircuitSeries />
        </div>
      </div>
    </div>
  );
}
