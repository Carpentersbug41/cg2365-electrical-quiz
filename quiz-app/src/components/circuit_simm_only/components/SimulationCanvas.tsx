import React, { useRef, useEffect, useState } from 'react';
import { Electron, Atom, SimulationParams, Vector2 } from '../types';
import { 
  BASE_SPEED, 
  JITTER_STRENGTH, 
  DRIFT_BASE_STRENGTH, 
  MIN_WIRE_HEIGHT, 
  MAX_WIRE_HEIGHT 
} from '../constants';
import { vecAdd, vecSub, vecScale, vecNorm, randomUnitVector, vecLen, clamp, lerp } from '../utils/math';

interface Props {
  params: SimulationParams;
  width?: number;
  height?: number;
}

const SimulationCanvas: React.FC<Props> = ({ params, width: propWidth, height: propHeight }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const electronsRef = useRef<Electron[]>([]);
  const atomsRef = useRef<Atom[]>([]);
  const frameIdRef = useRef<number>(0);
  const paramsRef = useRef(params);

  const [dimensions, setDimensions] = useState({ width: propWidth || 800, height: propHeight || 400 });

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    if (propWidth && propHeight) {
      setDimensions({ width: propWidth, height: propHeight });
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [propWidth, propHeight]);

  // Initialize or adjust pools
  useEffect(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return; // Wait for valid dimensions

    const wireH = lerp(MIN_WIRE_HEIGHT, MAX_WIRE_HEIGHT, params.wireThickness);
    const wireTop = (height - wireH) / 2;
    const wireBottom = wireTop + wireH;
    const electronRadius = 3;

    // Adjust Electron Pool
    const currentCount = electronsRef.current.length;
    if (currentCount < params.electronCount) {
      // Add more
      for (let i = currentCount; i < params.electronCount; i++) {
        electronsRef.current.push({
          id: Math.random(),
          pos: { 
            x: Math.random() * width, 
            y: wireTop + electronRadius + Math.random() * (wireH - electronRadius * 2) 
          },
          vel: { x: 0, y: 0 }
        });
      }
    } else if (currentCount > params.electronCount) {
      // Remove excess
      electronsRef.current.splice(params.electronCount);
    }

    // Ensure existing electrons are within bounds
    electronsRef.current.forEach(electron => {
      if (electron.pos.y < wireTop + electronRadius) {
        electron.pos.y = wireTop + electronRadius + Math.random() * (wireH - electronRadius * 2);
      }
      if (electron.pos.y > wireBottom - electronRadius) {
        electron.pos.y = wireTop + electronRadius + Math.random() * (wireH - electronRadius * 2);
      }
      if (electron.pos.x > width) {
        electron.pos.x = Math.random() * width;
      }
    });

    // Adjust Atom Pool
    const currentAtomCount = atomsRef.current.length;
    if (currentAtomCount !== params.atomCount) {
      const newAtoms: Atom[] = [...atomsRef.current];
      if (params.atomCount > currentAtomCount) {
        for (let i = currentAtomCount; i < params.atomCount; i++) {
          newAtoms.push({
            id: Math.random(),
            pos: { x: Math.random(), y: Math.random() }, // Normalized 0-1
            lastHitTime: 0
          });
        }
      } else {
        newAtoms.splice(params.atomCount);
      }
      atomsRef.current = newAtoms;
    }
  }, [params.electronCount, params.atomCount, params.wireThickness, dimensions.width, dimensions.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const { width, height } = dimensions;
      const currentParams = paramsRef.current;
      
      // Calculate Wire Geometry
      const wireH = lerp(MIN_WIRE_HEIGHT, MAX_WIRE_HEIGHT, currentParams.wireThickness);
      const wireTop = (height - wireH) / 2;
      const wireBottom = wireTop + wireH;
      
      // Clear
      ctx.clearRect(0, 0, width, height);

      // --- Draw Wire Background ---
      let r = 30, g = 41, b = 59; // Base slate-800
      if (currentParams.isRealMode) {
        const t = clamp(currentParams.temperature / 100, 0, 1);
        r = lerp(30, 234, t);
        g = lerp(41, 88, t);
        b = lerp(59, 12, t);
      }
      ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      ctx.fillRect(0, wireTop, width, wireH);
      
      // Wire Borders
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, wireTop);
      ctx.lineTo(width, wireTop);
      ctx.moveTo(0, wireBottom);
      ctx.lineTo(width, wireBottom);
      ctx.stroke();

      // --- Simulation Physics Constants for this Frame ---
      const driftBiasVector = { x: DRIFT_BASE_STRENGTH * currentParams.driftStrength, y: 0 };
      const atomRadius = 6;
      const electronRadius = 3;
      const collisionDistance = atomRadius + electronRadius;
      
      // Vibration based on temp
      const vibration = currentParams.isRealMode ? currentParams.temperature * 0.05 : 0;

      // --- Draw & Update Atoms ---
      ctx.fillStyle = '#64748b'; // slate-500
      
      atomsRef.current.forEach(atom => {
        const ax = atom.pos.x * width;
        const ay = wireTop + atomRadius + (atom.pos.y * (wireH - atomRadius * 2));
        
        const vx = (Math.random() - 0.5) * vibration;
        const vy = (Math.random() - 0.5) * vibration;

        ctx.beginPath();
        
        const now = Date.now();
        if (now - atom.lastHitTime < 100) {
           ctx.fillStyle = '#cbd5e1'; // light flash
        } else {
           ctx.fillStyle = '#64748b';
        }
        
        ctx.arc(ax + vx, ay + vy, atomRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });

      // --- Update & Draw Electrons ---
      ctx.fillStyle = '#22d3ee'; // cyan-400

      electronsRef.current.forEach(electron => {
        const jitter = vecScale(randomUnitVector(), JITTER_STRENGTH);
        const combined = vecAdd(jitter, driftBiasVector);
        
        let direction = vecNorm(combined);
        if (vecLen(combined) === 0) direction = vecNorm(randomUnitVector());

        electron.vel = vecScale(direction, BASE_SPEED);

        let nextPos = vecAdd(electron.pos, electron.vel);

        for (const atom of atomsRef.current) {
           const ax = atom.pos.x * width;
           const ay = wireTop + atomRadius + (atom.pos.y * (wireH - atomRadius * 2));
           
           const dx = nextPos.x - ax;
           const dy = nextPos.y - ay;
           const distSq = dx * dx + dy * dy;
           
           if (distSq < collisionDistance * collisionDistance) {
             atom.lastHitTime = Date.now();
             
             const dist = Math.sqrt(distSq);
             let nx = 0;
             let ny = 0;
             
             if (dist === 0) {
               const angle = Math.random() * Math.PI * 2;
               nx = Math.cos(angle);
               ny = Math.sin(angle);
             } else {
               nx = dx / dist;
               ny = dy / dist;
             }

             const penetration = collisionDistance - dist;
             const bouncePush = 2.0;
             
             nextPos.x += nx * (penetration + bouncePush);
             nextPos.y += ny * (penetration + bouncePush);
             
             break;
           }
        }

        if (nextPos.y < wireTop + electronRadius) nextPos.y = wireTop + electronRadius;
        if (nextPos.y > wireBottom - electronRadius) nextPos.y = wireBottom - electronRadius;

        if (nextPos.x > width) nextPos.x = 0;
        if (nextPos.x < 0) nextPos.x = width;

        electron.pos = nextPos;

        ctx.beginPath();
        ctx.arc(electron.pos.x, electron.pos.y, electronRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      frameIdRef.current = requestAnimationFrame(render);
    };

    frameIdRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="block"
      />
    </div>
  );
};

export default SimulationCanvas;