import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, ShieldCheck, Radio, Sparkles } from 'lucide-react';
import { resonanceAudio } from '../utils/audio';

interface HeaderProps {
  purity: number;
  activeNodeTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ purity, activeNodeTitle }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const newMuteState = resonanceAudio.toggleMute();
    setIsMuted(newMuteState);
  };

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3 flex items-center justify-between transition-colors">
      {/* Brand and System Identification */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
          <div className="absolute -inset-1 rounded-full bg-amber-500/20 blur-xs"></div>
        </div>
        <div>
          <h1 className="font-cinzel text-lg tracking-wider text-zinc-100 font-bold leading-tight flex items-center gap-2">
            Dream Caught Operating Centre
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Google AI Studio Node · Gemma 4 / V8 Zebra Pipeline · Atlantis 2.0
          </p>
        </div>
      </div>

      {/* Telemetry and Badges */}
      <div className="flex items-center space-x-3 md:space-x-4 text-xs font-mono text-zinc-400">
        <span className="hidden sm:inline-flex items-center space-x-1.5 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-zinc-300">Signal: Pure (Zero Static)</span>
        </span>

        <span className="hidden md:inline-flex items-center space-x-1.5 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Environment: AI Studio Active</span>
        </span>

        <span className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Sival Sovereign Core</span>
        </span>

        {/* Offline Synchronizer Clock */}
        <span className="hidden sm:inline-flex items-center space-x-1 bg-zinc-900/60 px-2.5 py-1.5 rounded-md border border-zinc-800/80 text-zinc-400 text-xs font-mono">
          <Radio className="w-3 h-3 text-amber-500/80" />
          <span>{time || '00:00:00'} UTC</span>
        </span>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute Resonance Tone' : 'Mute Resonance Tone'}
          className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </header>
  );
};
