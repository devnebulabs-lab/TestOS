import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { Power, RotateCcw, Lock, AlertTriangle, X } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const PowerMenu: React.FC = () => {
  const {
    isPowerMenuOpen,
    togglePowerMenu,
    restartSystem,
    powerOffSystem,
    toggleLock,
    factoryReset,
  } = useOS();

  if (!isPowerMenuOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6 select-none">
        {/* Deep blur backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => togglePowerMenu(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-2xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-xs bg-slate-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full border-b border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              Power Options
            </span>
            <button
              onClick={() => togglePowerMenu(false)}
              className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {/* 1. POWER OFF */}
            <button
              onClick={powerOffSystem}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 active:scale-95 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 mb-1.5 group-hover:scale-105 transition-transform">
                <Power className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-rose-300">Power Off</span>
            </button>

            {/* 2. RESTART */}
            <button
              onClick={restartSystem}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-1.5 group-hover:scale-105 transition-transform">
                <RotateCcw className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-emerald-300">Restart</span>
            </button>

            {/* 3. SLEEP / LOCK */}
            <button
              onClick={() => {
                toggleLock(true);
                togglePowerMenu(false);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 active:scale-95 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 mb-1.5 group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-sky-300">Sleep</span>
            </button>
          </div>

          {/* Emergency / Factory Reset trigger */}
          <button
            onClick={() => {
              if (confirm('Factory reset TestOS to clean state?')) {
                factoryReset();
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/50 hover:text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Advanced Recovery & Reset</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
