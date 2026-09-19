import React, { useState, useEffect, useRef } from 'react';
import { Radio, Zap, Activity, Waves } from 'lucide-react';
import { resonanceAudio } from '../utils/audio';

interface ResonanceTransmitterProps {
  purity: number;
  onPurityChange: (val: number) => void;
}

export const ResonanceTransmitter: React.FC<ResonanceTransmitterProps> = ({
  purity,
  onPurityChange,
}) => {
  const [statusText, setStatusText] = useState('Ready to transmit.');
  const [statusClass, setStatusClass] = useState('text-zinc-500');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [pulseCount, setPulseCount] = useState(7);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Oscilloscope wave rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background grid lines
      ctx.strokeStyle = 'rgba(39, 39, 42, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw harmonic wave
      ctx.lineWidth = 1.75;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(0.5, '#c084fc');
      gradient.addColorStop(1, '#10b981');
      ctx.strokeStyle = gradient;

      ctx.beginPath();

      // Noise factor derived from purity (100% purity = 0 noise, 80% = noticeable jitter)
      const noiseAmp = Math.max(0, (100 - purity) * 0.4);
      const waveFreq = 0.045;
      const amplitude = isBroadcasting ? height * 0.38 : height * 0.28;

      for (let x = 0; x < width; x++) {
        const noise = (Math.random() - 0.5) * noiseAmp;
        const y =
          height / 2 +
          Math.sin(x * waveFreq + phase) * amplitude +
          Math.sin(x * (waveFreq * 2) - phase * 1.5) * (amplitude * 0.2) +
          noise;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      phase += isBroadcasting ? 0.12 : 0.04;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [purity, isBroadcasting]);

  const triggerResonance = () => {
    setIsBroadcasting(true);
    resonanceAudio.playPulse(purity);
    setPulseCount((prev) => prev + 1);

    setStatusText('Transmitting sovereign frequency across AI Studio node...');
    setStatusClass('text-amber-400 animate-pulse');

    setTimeout(() => {
      setStatusText('AI Studio Signal locked. Zero distortion detected.');
      setStatusClass('text-emerald-400 font-medium');
      setIsBroadcasting(false);
    }, 1200);
  };

  const calculatedFreq = (432 * (purity / 100)).toFixed(1);
  const snr = (70 + (purity - 80) * 1.5).toFixed(1);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm glow-purple relative overflow-hidden">
      {/* Top ambient highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="font-cinzel text-base text-zinc-200 font-semibold flex items-center gap-1.5">
          <Waves className="w-4 h-4 text-purple-400" />
          Resonance Transmitter
        </h3>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          Pulse #{pulseCount}
        </span>
      </div>

      <p className="text-xs text-zinc-400 mb-3">
        Emit a direct frequency test across the Google AI Studio pipeline.
      </p>

      {/* Live Waveform Oscilloscope */}
      <div className="relative mb-3 bg-zinc-950/80 rounded-lg p-1 border border-zinc-800/90 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={320}
          height={64}
          className="w-full h-16 block rounded"
        />
        <div className="absolute bottom-1.5 left-2 flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
          <span>{calculatedFreq} Hz</span>
          <span>·</span>
          <span>SNR: +{snr} dB</span>
        </div>
        <div className="absolute top-1.5 right-2 flex items-center space-x-1 text-[10px] font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${isBroadcasting ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`}></span>
          <span className="text-zinc-400">{isBroadcasting ? 'Broadcasting' : 'Oscillator Steady'}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" />
              Frequency Purity
            </span>
            <span id="purity-val" className="text-purple-400 font-bold">
              {purity.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="90"
            max="100"
            value={purity}
            step="0.1"
            onChange={(e) => onPurityChange(parseFloat(e.target.value))}
            className="w-full accent-purple-500 bg-zinc-950 cursor-pointer h-1.5 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-600 mt-1">
            <span>90.0% (Studio Baseline)</span>
            <span>95.0%</span>
            <span>100.0% (Pure Signal)</span>
          </div>
        </div>

        <button
          onClick={triggerResonance}
          disabled={isBroadcasting}
          className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-zinc-950 font-semibold font-mono text-xs rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{isBroadcasting ? 'Broadcasting AI Studio Pulse...' : 'Broadcast AI Studio Pulse'}</span>
        </button>

        <div id="broadcast-status" className={`text-center font-mono text-xs h-4 transition-all ${statusClass}`}>
          {statusText}
        </div>
      </div>
    </div>
  );
};
