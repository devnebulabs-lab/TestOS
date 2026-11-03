import React from 'react';
import { useOS } from '../../context/OSContext';
import { Skull, AlertTriangle } from 'lucide-react';

export const GlitchBreakScreen: React.FC = () => {
  const { isGlitching } = useOS();

  if (!isGlitching) return null;

  return (
    <div className="absolute inset-0 z-50 bg-red-950 text-red-400 flex flex-col items-center justify-center p-6 select-none font-mono overflow-hidden animate-pulse">
      {/* Glitch Scanlines & Noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255, 0, 0, 0.2) 0px, rgba(255, 0, 0, 0.2) 2px, transparent 2px, transparent 4px)',
        }}
      />

      {/* Random distorted artifact bars */}
      <div className="absolute top-1/4 w-full h-8 bg-red-600/60 blur-xs -skew-x-12 animate-ping" />
      <div className="absolute bottom-1/3 w-3/4 h-12 bg-white/20 blur-xs skew-y-6" />

      {/* Main Glitch Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-sm">
        <div className="w-20 h-20 rounded-full bg-red-600 text-black flex items-center justify-center shadow-2xl animate-spin">
          <Skull className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-black text-white tracking-widest uppercase animate-bounce">
          SYSTEM ERROR
        </h1>

        <div className="bg-black/80 border-2 border-red-500 rounded-2xl p-4 text-xs text-left space-y-1 text-red-300 w-full shadow-2xl">
          <p className="text-red-500 font-bold">FATAL: KERNEL INTEGRITY CORRUPTED</p>
          <p>0xDEADBEEF: ROOT PARTITION PURGED</p>
          <p>ALL APPS DESTROYED BY tottalynotahack</p>
          <p className="text-white font-bold animate-pulse">
            EMERGENCY SHUTDOWN IN PROGRESS...
          </p>
        </div>

        <p className="text-xs text-white/80 font-bold">
          REBOOTING TO TESTOS RECOVERY ENVIRONMENT...
        </p>
      </div>
    </div>
  );
};
