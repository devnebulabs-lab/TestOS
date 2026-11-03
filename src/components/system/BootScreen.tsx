import React from 'react';
import { useOS } from '../../context/OSContext';
import { Sparkles, Terminal, RotateCcw, Shield, Play } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const BootScreen: React.FC = () => {
  const {
    bootState,
    bootProgress,
    bootStatusText,
    setBootState,
    factoryReset,
    isCorruptedRecovery,
  } = useOS();

  const [bootError, setBootError] = React.useState<string | null>(null);

  if (bootState !== 'booting' && bootState !== 'boot_options') return null;

  const handleOpenBootOptions = () => {
    sounds.click();
    setBootState('boot_options');
  };

  const handleContinueNormalBoot = () => {
    if (isCorruptedRecovery) {
      sounds.alarm();
      setBootError('CRITICAL: Kernel damaged by tottalynotahack. You MUST Factory Reset!');
      return;
    }
    sounds.click();
    setBootState('booting');
  };

  const handleFactoryResetConfirm = () => {
    sounds.haptic();
    factoryReset();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#04060c] text-white flex flex-col items-center justify-between p-8 select-none font-sans overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-sky-500 rounded-full blur-[140px]" />
      </div>

      {/* Top Bios / Version info */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-white/40 z-10">
        <span>TestOS UEFI v1.0.0</span>
        <span>SecureBoot: Active</span>
      </div>

      {/* Center Branding & Progress */}
      <div className="flex flex-col items-center justify-center my-auto z-10 max-w-sm w-full text-center">
        {bootState === 'booting' ? (
          <>
            {/* Glowing Logo */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-sky-500/30 mb-8 border border-white/20 animate-pulse">
              <Sparkles className="w-10 h-10" />
            </div>

            {/* TestOS Name */}
            <h1 className="text-4xl font-black tracking-tight text-white mb-1">
              TestOS 1
            </h1>
            <p className="text-xs uppercase tracking-widest text-sky-400 font-mono font-medium mb-10">
              Mobile Operating System · Generation 1
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner mb-3">
              <div
                className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-150 shadow-md"
                style={{ width: `${bootProgress}%` }}
              />
            </div>

            {/* Status Text & Percentage */}
            <div className="flex items-center justify-between w-full text-[11px] font-mono text-white/60 mb-8 px-1">
              <span className="truncate max-w-[220px]">{bootStatusText}</span>
              <span className="text-sky-300 font-bold">{bootProgress}%</span>
            </div>

            {/* Boot Options Button */}
            <button
              onClick={handleOpenBootOptions}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs text-white/70 hover:text-white transition-all flex items-center gap-2 active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Boot Options (F8 / ESC)</span>
            </button>
          </>
        ) : (
          /* BOOT OPTIONS / RECOVERY MENU */
          <div className="w-full bg-slate-900/95 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-2xl text-left">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <Terminal className={`w-5 h-5 ${isCorruptedRecovery ? 'text-rose-400' : 'text-sky-400'}`} />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isCorruptedRecovery ? 'Critical System Recovery' : 'Startup & Boot Options'}
                </h3>
                <p className="text-[10px] text-white/50">TestOS 1 Recovery Environment</p>
              </div>
            </div>

            {/* Corrupted Recovery Notice */}
            {isCorruptedRecovery && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <p className="font-bold">CRITICAL: OS Corrupted by tottalynotahack!</p>
                <p className="text-[11px] text-white/70">
                  Applications were purged and the kernel was corrupted. You have to factory reset your phone to restore TestOS 1!
                </p>
              </div>
            )}

            {bootError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-[11px] text-rose-300 font-mono">
                {bootError}
              </div>
            )}

            <div className="space-y-2 pt-1">
              {/* Option 1: Normal Boot */}
              <button
                onClick={handleContinueNormalBoot}
                className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-all active:scale-98 group ${
                  isCorruptedRecovery
                    ? 'opacity-40 bg-white/5 border-white/5 cursor-not-allowed'
                    : 'bg-white/5 hover:bg-white/15 border-white/10'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-sky-300">
                    Continue Normal Boot
                  </h4>
                  <p className="text-[10px] text-white/50">
                    {isCorruptedRecovery ? 'Unavailable (System Damaged)' : 'Load current user session'}
                  </p>
                </div>
              </button>

              {/* Option 2: Factory Reset */}
              <button
                onClick={handleFactoryResetConfirm}
                className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-all active:scale-98 group ${
                  isCorruptedRecovery
                    ? 'bg-rose-500 hover:bg-rose-400 border-rose-400 text-white shadow-xl shadow-rose-900/50 ring-2 ring-rose-400/50 animate-pulse'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCorruptedRecovery
                      ? 'bg-black text-rose-400 font-bold'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      isCorruptedRecovery ? 'text-white' : 'text-rose-300'
                    }`}
                  >
                    Factory Reset & Wipe Storage
                  </h4>
                  <p
                    className={`text-[10px] ${
                      isCorruptedRecovery ? 'text-white/80 font-medium' : 'text-white/50'
                    }`}
                  >
                    Restores clean apps and repairs TestOS 1
                  </p>
                </div>
              </button>

              {/* Option 3: Safe Mode */}
              <button
                onClick={handleContinueNormalBoot}
                className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center gap-3 text-left transition-all active:scale-98 group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300">
                    Boot into Safe Diagnostics
                  </h4>
                  <p className="text-[10px] text-white/50">Minimal drivers and sandbox</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="text-[11px] text-white/30 font-mono z-10">
        TestOS Cloud Platform · Build 2026.11
      </div>
    </div>
  );
};
