import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ArrowLeftRight, Info, Magnet as MagnetIcon, RefreshCcw, Eye, Minus, Maximize2, GripHorizontal } from 'lucide-react';

type Magnet = {
  id: string;
  x: number;
  y: number;
  angle: number;
  length: number;
  strength: number;
  flipped: boolean;
};

function getField(x: number, y: number, poles: { x: number, y: number, strength: number }[]) {
  let bx = 0, by = 0;
  for (let i = 0; i < poles.length; i++) {
    const p = poles[i];
    const dx = x - p.x;
    const dy = y - p.y;
    const distSq = dx * dx + dy * dy + 100; // softening
    const mag = p.strength / (distSq * Math.sqrt(distSq));
    bx += dx * mag;
    by += dy * mag;
  }
  return { bx, by };
}

function isPointInMagnet(px: number, py: number, m: Magnet, viewMode: 'side' | 'end') {
  if (viewMode === 'end') {
    const dx = px - m.x;
    const dy = py - m.y;
    const radius = Math.max(20, m.length / 6);
    return dx * dx + dy * dy <= radius * radius;
  }
  const dx = px - m.x;
  const dy = py - m.y;
  const cos = Math.cos(-m.angle);
  const sin = Math.sin(-m.angle);
  const rx = dx * cos - dy * sin;
  const ry = dx * sin + dy * cos;
  return Math.abs(rx) <= m.length / 2 && Math.abs(ry) <= 16;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [magnets, setMagnets] = useState<Magnet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'lines' | 'arrows'>('lines');
  const [viewMode, setViewMode] = useState<'side' | 'end'>('side');
  const [fluxDensity, setFluxDensity] = useState(60);
  const [strength, setStrength] = useState(1000);
  const [magnetSize, setMagnetSize] = useState(150);
  const [snapAngles, setSnapAngles] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [uiPos, setUiPos] = useState({ x: 16, y: 16 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [uiScale, setUiScale] = useState(0.9);
  const [isDraggingUI, setIsDraggingUI] = useState(false);
  const uiDragOffset = useRef({ x: 0, y: 0 });

  // Initialize dimensions and default magnets
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!initialized && dimensions.width > 0) {
      setMagnets([
        { id: '1', x: dimensions.width / 2 - 120, y: dimensions.height / 2, angle: 0, length: 150, strength: 1000, flipped: false },
        { id: '2', x: dimensions.width / 2 + 120, y: dimensions.height / 2, angle: 0, length: 150, strength: 1000, flipped: false },
      ]);
      setInitialized(true);
    }
  }, [dimensions, initialized]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key === 'q' || e.key === 'Q') {
        const delta = snapAngles ? Math.PI / 4 : 0.1;
        setMagnets(ms => ms.map(m => m.id === selectedId ? { ...m, angle: m.angle - delta } : m));
      }
      if (e.key === 'e' || e.key === 'E') {
        const delta = snapAngles ? Math.PI / 4 : 0.1;
        setMagnets(ms => ms.map(m => m.id === selectedId ? { ...m, angle: m.angle + delta } : m));
      }
      if (e.key === 'f' || e.key === 'F' || e.key === ' ') {
        setMagnets(ms => ms.map(m => m.id === selectedId ? { ...m, flipped: !m.flipped } : m));
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setMagnets(ms => ms.filter(m => m.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, snapAngles]);

  // Prevent default scroll on wheel over canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      if (selectedId && viewMode === 'side') {
        e.preventDefault();
        const delta = e.deltaY > 0 ? (snapAngles ? Math.PI / 4 : 0.1) : (snapAngles ? -Math.PI / 4 : -0.1);
        setMagnets(ms => ms.map(m => m.id === selectedId ? { ...m, angle: m.angle + delta } : m));
      }
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [selectedId, snapAngles, viewMode]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)'; // slate-300 with opacity
      ctx.lineWidth = 1;
      const gridSize = 40;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }

    const poles = magnets.flatMap(m => {
      if (viewMode === 'end') {
        // In end view, we only see one pole facing the viewer
        return [{ x: m.x, y: m.y, strength: m.flipped ? -m.strength : m.strength }];
      }
      
      const dx = Math.cos(m.angle) * (m.length / 2);
      const dy = Math.sin(m.angle) * (m.length / 2);
      const nx = m.x + (m.flipped ? -dx : dx);
      const ny = m.y + (m.flipped ? -dy : dy);
      const sx = m.x - (m.flipped ? -dx : dx);
      const sy = m.y - (m.flipped ? -dy : dy);
      return [
        { x: nx, y: ny, strength: m.strength },
        { x: sx, y: sy, strength: -m.strength }
      ];
    });

    const spacing = 110 - fluxDensity;

    if (poles.length > 0) {
      if (mode === 'lines') {
        const stepSize = 4;
        const maxSteps = 45;
        for (let sy = 0; sy < height; sy += spacing) {
          for (let sx = 0; sx < width; sx += spacing) {
            const { bx, by } = getField(sx, sy, poles);
            const bMag = Math.sqrt(bx * bx + by * by);
            if (bMag < 1e-6) continue;

            const opacity = Math.min(0.65, Math.max(0.05, bMag * 2.5));
            ctx.beginPath();
            ctx.strokeStyle = `rgba(15, 23, 42, ${opacity})`;
            ctx.lineWidth = 1.5;

            // trace forward
            let px = sx, py = sy;
            ctx.moveTo(px, py);
            for (let i = 0; i < maxSteps; i++) {
              const { bx: fbx, by: fby } = getField(px, py, poles);
              const fMag = Math.sqrt(fbx * fbx + fby * fby);
              if (fMag < 1e-6) break;
              px += (fbx / fMag) * stepSize;
              py += (fby / fMag) * stepSize;
              ctx.lineTo(px, py);
            }

            // trace backward
            px = sx; py = sy;
            ctx.moveTo(px, py);
            for (let i = 0; i < maxSteps; i++) {
              const { bx: bbx, by: bby } = getField(px, py, poles);
              const bMag2 = Math.sqrt(bbx * bbx + bby * bby);
              if (bMag2 < 1e-6) break;
              px -= (bbx / bMag2) * stepSize;
              py -= (bby / bMag2) * stepSize;
              ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
        }
      } else {
        for (let sy = 0; sy < height; sy += spacing) {
          for (let sx = 0; sx < width; sx += spacing) {
            const { bx, by } = getField(sx, sy, poles);
            const bMag = Math.sqrt(bx * bx + by * by);
            if (bMag < 1e-6) continue;
            
            const opacity = Math.min(0.8, Math.max(0.1, bMag * 2.5));
            ctx.beginPath();
            ctx.strokeStyle = `rgba(15, 23, 42, ${opacity})`;
            ctx.lineWidth = 1.5;
            
            const dirX = bx / bMag;
            const dirY = by / bMag;
            const arrowLen = Math.min(spacing * 0.8, 16);
            ctx.moveTo(sx - dirX * arrowLen / 2, sy - dirY * arrowLen / 2);
            ctx.lineTo(sx + dirX * arrowLen / 2, sy + dirY * arrowLen / 2);
            
            const headLen = 5;
            const angle = Math.atan2(dirY, dirX);
            ctx.lineTo(sx + dirX * arrowLen / 2 - headLen * Math.cos(angle - Math.PI / 6),
                       sy + dirY * arrowLen / 2 - headLen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(sx + dirX * arrowLen / 2, sy + dirY * arrowLen / 2);
            ctx.lineTo(sx + dirX * arrowLen / 2 - headLen * Math.cos(angle + Math.PI / 6),
                       sy + dirY * arrowLen / 2 - headLen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
          }
        }
      }
    }

    for (const m of magnets) {
      ctx.save();
      ctx.translate(m.x, m.y);
      
      if (viewMode === 'end') {
        const radius = Math.max(20, m.length / 6);
        
        if (m.id === selectedId) {
          ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
          ctx.shadowBlur = 20;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // N is red, S is blue
        const colorEnd = m.flipped ? '#3b82f6' : '#ef4444';
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = colorEnd;
        ctx.fill();
        
        // Gradient overlay
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        grad.addColorStop(0, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.7, 'rgba(255,255,255,0.1)');
        grad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.max(14, radius * 0.8)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;
        ctx.fillText(m.flipped ? 'S' : 'N', 0, 0);
        
      } else {
        ctx.rotate(m.angle);

        const w = m.length;
        const h = 32;
        const cornerRadius = 4;

        if (m.id === selectedId) {
          ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
          ctx.shadowBlur = 20;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, cornerRadius + 2);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Draw rotation handle
          ctx.beginPath();
          ctx.moveTo(0, -h / 2 - 4);
          ctx.lineTo(0, -h / 2 - 35);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#94a3b8';
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, -h / 2 - 35, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        const rightColor = m.flipped ? '#3b82f6' : '#ef4444';
        const leftColor = m.flipped ? '#ef4444' : '#3b82f6';

        // Draw magnet body with rounded corners
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, cornerRadius);
        ctx.clip();

        // Right half
        ctx.fillStyle = rightColor;
        ctx.fillRect(0, -h / 2, w / 2, h);

        // Left half
        ctx.fillStyle = leftColor;
        ctx.fillRect(-w / 2, -h / 2, w / 2, h);

        // Gradient overlay for 3D effect
        const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
        grad.addColorStop(0, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.1)');
        grad.addColorStop(0.6, 'rgba(0,0,0,0.05)');
        grad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = grad;
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Inner shadow/highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2);

        ctx.restore(); // Remove clip

        // Outer border
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, cornerRadius);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Subtle text shadow for readability
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;

        const rightLabel = m.flipped ? 'S' : 'N';
        const leftLabel = m.flipped ? 'N' : 'S';

        ctx.save();
        ctx.translate(w / 4, 0);
        ctx.rotate(-m.angle);
        ctx.fillText(rightLabel, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.translate(-w / 4, 0);
        ctx.rotate(-m.angle);
        ctx.fillText(leftLabel, 0, 0);
        ctx.restore();
      }

      ctx.restore();
    }

  }, [magnets, mode, fluxDensity, selectedId, dimensions, showGrid, viewMode]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedId && viewMode === 'side') {
      const m = magnets.find(m => m.id === selectedId);
      if (m) {
        const dx = x - m.x;
        const dy = y - m.y;
        const cos = Math.cos(-m.angle);
        const sin = Math.sin(-m.angle);
        const rx = dx * cos - dy * sin;
        const ry = dx * sin + dy * cos;

        const hDist = Math.sqrt(rx * rx + (ry + 50) * (ry + 50));
        if (hDist <= 20) { // Rotation handle hit radius
          setIsRotating(true);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          return;
        }
      }
    }

    let clickedId: string | null = null;
    for (let i = magnets.length - 1; i >= 0; i--) {
      if (isPointInMagnet(x, y, magnets[i], viewMode)) {
        clickedId = magnets[i].id;
        dragOffset.current = { x: x - magnets[i].x, y: y - magnets[i].y };
        break;
      }
    }

    setSelectedId(clickedId);
    if (clickedId) {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!selectedId) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isRotating && viewMode === 'side') {
      const m = magnets.find(m => m.id === selectedId);
      if (m) {
        let newAngle = Math.atan2(y - m.y, x - m.x) + Math.PI / 2;
        if (snapAngles) {
          const snap = Math.PI / 4;
          newAngle = Math.round(newAngle / snap) * snap;
        }
        setMagnets(ms => ms.map(m => m.id === selectedId ? { ...m, angle: newAngle } : m));
      }
      return;
    }

    if (isDragging) {
      setMagnets(ms => ms.map(m =>
        m.id === selectedId
          ? { ...m, x: x - dragOffset.current.x, y: y - dragOffset.current.y }
          : m
      ));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setIsRotating(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleUIDragStart = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDraggingUI(true);
    uiDragOffset.current = { x: e.clientX - uiPos.x, y: e.clientY - uiPos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleUIDragMove = (e: React.PointerEvent) => {
    if (!isDraggingUI) return;
    setUiPos({
      x: e.clientX - uiDragOffset.current.x,
      y: e.clientY - uiDragOffset.current.y
    });
  };

  const handleUIDragEnd = (e: React.PointerEvent) => {
    setIsDraggingUI(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = magnets.length - 1; i >= 0; i--) {
      if (isPointInMagnet(x, y, magnets[i], viewMode)) {
        const id = magnets[i].id;
        setMagnets(ms => ms.map(m => m.id === id ? { ...m, flipped: !m.flipped } : m));
        setSelectedId(id);
        break;
      }
    }
  };

  const presets = {
    'N-S Attraction': () => {
      if (viewMode === 'end') {
        setMagnets([
          { id: '1', x: dimensions.width / 2 - 60, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false },
          { id: '2', x: dimensions.width / 2 + 60, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: true },
        ]);
      } else {
        setMagnets([
          { id: '1', x: dimensions.width / 2 - 120, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false },
          { id: '2', x: dimensions.width / 2 + 120, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false },
        ]);
      }
    },
    'N-N Repulsion': () => {
      if (viewMode === 'end') {
        setMagnets([
          { id: '1', x: dimensions.width / 2 - 60, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false },
          { id: '2', x: dimensions.width / 2 + 60, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false },
        ]);
      } else {
        setMagnets([
          { id: '1', x: dimensions.width / 2 - 120, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false },
          { id: '2', x: dimensions.width / 2 + 120, y: dimensions.height / 2, angle: Math.PI, length: magnetSize, strength, flipped: false },
        ]);
      }
    },
    'S-S Repulsion': () => {
      if (viewMode === 'end') {
        setMagnets([
          { id: '1', x: dimensions.width / 2 - 60, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: true },
          { id: '2', x: dimensions.width / 2 + 60, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: true },
        ]);
      } else {
        setMagnets([
          { id: '1', x: dimensions.width / 2 - 120, y: dimensions.height / 2, angle: Math.PI, length: magnetSize, strength, flipped: false },
          { id: '2', x: dimensions.width / 2 + 120, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false },
        ]);
      }
    },
    'Stacked': () => {
      if (viewMode === 'end') {
        setMagnets([
          { id: '1', x: dimensions.width / 2, y: dimensions.height / 2 - 60, angle: 0, length: magnetSize, strength, flipped: false },
          { id: '2', x: dimensions.width / 2, y: dimensions.height / 2 + 60, angle: 0, length: magnetSize, strength, flipped: true },
        ]);
      } else {
        setMagnets([
          { id: '1', x: dimensions.width / 2, y: dimensions.height / 2 - 60, angle: 0, length: magnetSize, strength, flipped: false },
          { id: '2', x: dimensions.width / 2, y: dimensions.height / 2 + 60, angle: 0, length: magnetSize, strength, flipped: false },
        ]);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden font-sans">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 touch-none cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      />

      <div
        className="absolute flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 z-50"
        style={{
          left: uiPos.x,
          top: uiPos.y,
          transform: `scale(${uiScale})`,
          transformOrigin: 'top left',
          width: '280px',
          maxHeight: 'calc(100vh - 2rem)',
        }}
      >
        <div
          className={`flex items-center justify-between p-3.5 cursor-grab active:cursor-grabbing ${!isMinimized ? 'border-b border-slate-100/80' : ''}`}
          onPointerDown={handleUIDragStart}
          onPointerMove={handleUIDragMove}
          onPointerUp={handleUIDragEnd}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <MagnetIcon size={16} />
            </div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">Magnetic Field</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
            </button>
            <button 
              onClick={() => { setMagnets([]); setSelectedId(null); }}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear All"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-4 overflow-y-auto custom-scrollbar space-y-5">
            <section>
            <button
              onClick={() => setMagnets([...magnets, { id: Math.random().toString(), x: dimensions.width / 2, y: dimensions.height / 2, angle: 0, length: magnetSize, strength, flipped: false }])}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-slate-900/20"
            >
              <Plus size={18} /> Add Magnet
            </button>
            
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setMagnets(ms => ms.map(m => m.id === selectedId ? { ...m, flipped: !m.flipped } : m))}
                disabled={!selectedId}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
              >
                <ArrowLeftRight size={16} /> Flip
              </button>
              <button
                onClick={() => { setMagnets(ms => ms.filter(m => m.id !== selectedId)); setSelectedId(null); }}
                disabled={!selectedId}
                className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Perspective</h2>
            <div className="flex bg-slate-100/80 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('side')}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${viewMode === 'side' ? 'bg-white shadow-sm font-semibold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Side View
              </button>
              <button
                onClick={() => setViewMode('end')}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${viewMode === 'end' ? 'bg-white shadow-sm font-semibold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Eye size={14} /> End View
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Presets</h2>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={presets['N-S Attraction']} className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm transition-colors font-medium">N-S Attract</button>
              <button onClick={presets['N-N Repulsion']} className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm transition-colors font-medium">N-N Repel</button>
              <button onClick={presets['S-S Repulsion']} className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm transition-colors font-medium">S-S Repel</button>
              <button onClick={presets['Stacked']} className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm transition-colors font-medium">Stacked</button>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">View Options</h2>
            <div className="flex bg-slate-100/80 p-1 rounded-xl mb-4">
              <button
                onClick={() => setMode('lines')}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-all ${mode === 'lines' ? 'bg-white shadow-sm font-semibold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Field Lines
              </button>
              <button
                onClick={() => setMode('arrows')}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-all ${mode === 'arrows' ? 'bg-white shadow-sm font-semibold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Vector Arrows
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-600">Flux Density (Lines)</label>
                  <span className="text-xs text-slate-400">{fluxDensity}%</span>
                </div>
                <input
                  type="range"
                  min="20" max="100" step="5"
                  value={fluxDensity}
                  onChange={e => setFluxDensity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-600">Magnet Strength</label>
                  <span className="text-xs text-slate-400">{strength}</span>
                </div>
                <input
                  type="range"
                  min="500" max="3000" step="100"
                  value={strength}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setStrength(val);
                    setMagnets(ms => ms.map(m => ({ ...m, strength: val })));
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-600">Magnet Size</label>
                  <span className="text-xs text-slate-400">{magnetSize}px</span>
                </div>
                <input
                  type="range"
                  min="50" max="300" step="10"
                  value={magnetSize}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setMagnetSize(val);
                    setMagnets(ms => ms.map(m => ({ ...m, length: val })));
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-600">UI Scale</label>
                  <span className="text-xs text-slate-400">{Math.round(uiScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.75" max="1.5" step="0.05"
                  value={uiScale}
                  onChange={e => setUiScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3 pt-2 border-t border-slate-100">
            {viewMode === 'side' && (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={snapAngles}
                    onChange={e => setSnapAngles(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Snap to 45° angles</span>
              </label>
            )}

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={e => setShowGrid(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Show background grid</span>
            </label>
          </section>

          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50 text-xs text-blue-800/80 space-y-2 leading-relaxed">
            <p className="flex items-start gap-2"><Info size={16} className="mt-0.5 shrink-0 text-blue-500" /> <span><strong>Drag</strong> to move magnets.</span></p>
            {viewMode === 'side' && <p className="pl-6"><strong>Scroll</strong>, <strong>Q/E</strong>, or drag handle to rotate.</p>}
            <p className="pl-6"><strong>Double-click</strong>, <strong>F</strong>, or <strong>Space</strong> to flip polarity.</p>
            <p className="pl-6"><strong>Del</strong> to remove.</p>
          </div>
        </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(203, 213, 225, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.8);
        }
      `}</style>
    </div>
  );
}
