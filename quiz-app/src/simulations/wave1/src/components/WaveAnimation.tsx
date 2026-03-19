import React, { useEffect, useRef, useState } from "react";

export default function WaveAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveType, setWaveType] = useState<'transverse' | 'longitudinal'>('transverse');
  const [amplitude, setAmplitude] = useState(50);
  const [wavelength, setWavelength] = useState(300);
  const [frequency, setFrequency] = useState(1);
  const [showParticles, setShowParticles] = useState(true);
  const [showWave, setShowWave] = useState(true);
  const [highlightParticle, setHighlightParticle] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) / 1000; // time in seconds

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw Equilibrium Line
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.strokeStyle = "#e5e7eb"; // gray-200
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      const k = (2 * Math.PI) / wavelength;
      const omega = 2 * Math.PI * frequency;

      if (waveType === 'transverse') {
        // Draw Wave
        if (showWave) {
          ctx.beginPath();
          for (let x = 0; x < width; x++) {
            const y = centerY + Math.sin(x * k - time * omega) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = "#3b82f6"; // blue-500
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw Particles
        if (showParticles) {
          const numParticles = 40;
          const spacing = width / numParticles;

          for (let i = 0; i <= numParticles; i++) {
            const x = i * spacing;
            const y = centerY + Math.sin(x * k - time * omega) * amplitude;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);

            if (highlightParticle && i === Math.floor(numParticles / 2)) {
              ctx.fillStyle = "#ef4444"; // red-500
              ctx.fill();

              // Draw displacement line
              ctx.beginPath();
              ctx.moveTo(x, centerY);
              ctx.lineTo(x, y);
              ctx.strokeStyle = "#ef4444";
              ctx.lineWidth = 1;
              ctx.stroke();
            } else {
              ctx.fillStyle = "#60a5fa"; // blue-400
              ctx.fill();
            }
          }
        }
      } else {
        // Longitudinal Wave
        if (showWave) {
          // Draw a faint sine wave to represent pressure/density
          ctx.beginPath();
          for (let x = 0; x < width; x++) {
            const y = centerY + Math.sin(x * k - time * omega) * (amplitude * 0.5);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"; // faint blue
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (showParticles) {
          const numCols = 40;
          const numRows = 7;
          const spacingX = width / numCols;
          const spacingY = 16;
          const startY = centerY - ((numRows - 1) * spacingY) / 2;

          for (let row = 0; row < numRows; row++) {
            for (let col = 0; col <= numCols; col++) {
              const x0 = col * spacingX;
              const y0 = startY + row * spacingY;
              const x = x0 + Math.sin(x0 * k - time * omega) * amplitude;

              ctx.beginPath();
              ctx.arc(x, y0, 3, 0, Math.PI * 2);

              if (highlightParticle && col === Math.floor(numCols / 2) && row === Math.floor(numRows / 2)) {
                ctx.fillStyle = "#ef4444"; // red-500
                ctx.fill();

                // Draw displacement line
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(x, y0);
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 1;
                ctx.stroke();
              } else {
                ctx.fillStyle = "#60a5fa"; // blue-400
                ctx.fill();
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [waveType, amplitude, wavelength, frequency, showParticles, showWave, highlightParticle]);

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Interactive Wave Demonstration
        </h3>
        
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setWaveType('transverse')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${waveType === 'transverse' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Transverse
          </button>
          <button
            onClick={() => setWaveType('longitudinal')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${waveType === 'longitudinal' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Longitudinal
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 text-sm mb-1">
        <span className="flex items-center gap-1 text-red-500 font-medium">
          <div className="w-3 h-3 rounded-full bg-red-500"></div> Highlighted Particle
        </span>
      </div>

      <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <canvas
          ref={canvasRef}
          width={800}
          height={256}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Amplitude (Energy)
              </label>
              <span className="text-sm text-gray-500">{amplitude} px</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Wavelength
              </label>
              <span className="text-sm text-gray-500">{wavelength} px</span>
            </div>
            <input
              type="range"
              min="100"
              max="800"
              step="10"
              value={wavelength}
              onChange={(e) => setWavelength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <span className="text-sm text-gray-500">{frequency.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-3 flex flex-col justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showWave}
              onChange={(e) => setShowWave(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Show Wave (Energy Transfer)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showParticles}
              onChange={(e) => setShowParticles(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Show Particles (Medium)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightParticle}
              onChange={(e) => setHighlightParticle(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Highlight Single Particle (Oscillation)
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
        <strong>Observation:</strong> {waveType === 'transverse' 
          ? "Notice how the red particle only moves up and down (perpendicular to the wave direction) around the center line (Equilibrium). It does not travel left or right with the wave."
          : "Notice how the red particle moves left and right (parallel to the wave direction) around its starting position (Equilibrium). It does not travel continuously with the wave."}
        {" "}This proves that waves transfer energy, not matter.
      </div>
    </div>
  );
}
