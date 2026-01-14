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
  width: number;
  height: number;
}

const SimulationCanvas: React.FC<Props> = ({ params, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const electronsRef = useRef<Electron[]>([]);
  const atomsRef = useRef<Atom[]>([]);
  const frameIdRef = useRef<number>(0);
  
  // Keep track of atoms to preserve positions when count changes slightly
  // or regenerate when count changes drastically.
  
  // Initialize or adjust pools
  useEffect(() => {
    // Adjust Electron Pool
    const currentCount = electronsRef.current.length;
    if (currentCount < params.electronCount) {
      // Add more
      for (let i = currentCount; i < params.electronCount; i++) {
        electronsRef.current.push({
          id: Math.random(),
          pos: { x: Math.random() * width, y: Math.random() * height }, // will be clamped later
          vel: { x: 0, y: 0 }
        });
      }
    } else if (currentCount > params.electronCount) {
      // Remove excess
      electronsRef.current.splice(params.electronCount);
    }

    // Adjust Atom Pool
    // We regenerate atoms if the count changes significantly to avoid weird "pop-in" of obstacles
    // or just add/remove from end. For stable simulation, let's just resize array.
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
  }, [params.electronCount, params.atomCount, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 1;
      
      // Calculate Wire Geometry
      const wireH = lerp(MIN_WIRE_HEIGHT, MAX_WIRE_HEIGHT, params.wireThickness);
      const wireTop = (height - wireH) / 2;
      const wireBottom = wireTop + wireH;
      
      // Clear
      ctx.clearRect(0, 0, width, height);

      // --- Draw Wire Background ---
      // Real mode heating color interpolation
      // Cold: Slate-800 (#1e293b) -> Hot: Orange-600 (#ea580c)
      let r = 30, g = 41, b = 59; // Base slate-800
      if (params.isRealMode) {
        // Simple linear interpolation based on temp (0-100 range approx)
        const t = clamp(params.temperature / 100, 0, 1);
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
      const driftBiasVector = { x: DRIFT_BASE_STRENGTH * params.driftStrength, y: 0 };
      const atomRadius = 6;
      const electronRadius = 3;
      const collisionDistance = atomRadius + electronRadius;
      
      // Vibration based on temp
      const vibration = params.isRealMode ? params.temperature * 0.05 : 0;

      // --- Draw & Update Atoms ---
      ctx.fillStyle = '#64748b'; // slate-500
      
      atomsRef.current.forEach(atom => {
        // Map normalized pos to screen
        const ax = atom.pos.x * width;
        const ay = wireTop + atomRadius + (atom.pos.y * (wireH - atomRadius * 2));
        
        // Vibration
        const vx = (Math.random() - 0.5) * vibration;
        const vy = (Math.random() - 0.5) * vibration;

        // Draw
        ctx.beginPath();
        
        // Flash if hit recently
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
        // 1. Calculate Velocity Direction
        // Jitter
        const jitter = vecScale(randomUnitVector(), JITTER_STRENGTH);
        
        // Combined force
        const combined = vecAdd(jitter, driftBiasVector);
        
        // Normalize to get direction
        let direction = vecNorm(combined);
        // Fallback if zero length (rare)
        if (vecLen(combined) === 0) direction = vecNorm(randomUnitVector());

        // Velocity magnitude is ALWAYS BASE_SPEED
        electron.vel = vecScale(direction, BASE_SPEED);

        // 2. Move
        let nextPos = vecAdd(electron.pos, electron.vel);

        // 3. Collision with Atoms
        // Improved collision: Push out instead of random scatter
        for (const atom of atomsRef.current) {
           const ax = atom.pos.x * width;
           const ay = wireTop + atomRadius + (atom.pos.y * (wireH - atomRadius * 2));
           
           const dx = nextPos.x - ax;
           const dy = nextPos.y - ay;
           const distSq = dx * dx + dy * dy;
           
           // Check collision (squared to save sqrt for non-collisions)
           if (distSq < collisionDistance * collisionDistance) {
             atom.lastHitTime = Date.now();
             
             const dist = Math.sqrt(distSq);
             // Normal vector (Atom -> Electron)
             let nx = 0;
             let ny = 0;
             
             if (dist === 0) {
               // Degenerate case (exact center overlap): pick random direction
               const angle = Math.random() * Math.PI * 2;
               nx = Math.cos(angle);
               ny = Math.sin(angle);
             } else {
               nx = dx / dist;
               ny = dy / dist;
             }

             // Hard resolve: Push electron out of the atom
             // Move it to exactly the radius boundary + a small epsilon to prevent re-collision next frame
             const penetration = collisionDistance - dist;
             const bouncePush = 2.0; // Extra push to simulate "bounce" displacement
             
             nextPos.x += nx * (penetration + bouncePush);
             nextPos.y += ny * (penetration + bouncePush);
             
             // We only resolve one collision per frame to prevent infinite loops in dense clusters
             break;
           }
        }

        // 4. Boundary Constraints
        // Y Axis Clamp
        if (nextPos.y < wireTop + electronRadius) nextPos.y = wireTop + electronRadius;
        if (nextPos.y > wireBottom - electronRadius) nextPos.y = wireBottom - electronRadius;

        // X Axis Wrap
        if (nextPos.x > width) nextPos.x = 0;
        if (nextPos.x < 0) nextPos.x = width;

        electron.pos = nextPos;

        // Draw
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
  }, [params, width, height]);

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="block"
      />
    </div>
  );
};

export default SimulationCanvas;
