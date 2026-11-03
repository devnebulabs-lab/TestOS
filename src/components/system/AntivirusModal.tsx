import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { ShieldAlert, AlertTriangle, ShieldCheck, Skull } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const AntivirusModal: React.FC = () => {
  const { isAntivirusAlertOpen, quarantineVirus, bypassAntivirusAndInstall } = useOS();

  if (!isAntivirusAlertOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6 select-none">
        {/* Backdrop blur with flashing pulse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="relative z-10 w-full max-w-sm bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 shadow-2xl shadow-rose-900/40 flex flex-col items-center text-center space-y-4"
        >
          {/* Flashing Antivirus Icon */}
          <div className="w-18 h-18 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30 animate-bounce">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-rose-400">
              TestAntivirus Security Guard
            </span>
            <h2 className="text-2xl font-black text-white mt-1 tracking-tight">
              HEY! We detect a vires
            </h2>
            <p className="text-xs text-rose-200/80 mt-1.5 leading-relaxed font-mono">
              Suspicious file: <span className="text-white font-bold">tottalynotahack.apk</span>
              <br />
              Signature: Trojan.Malware.DestructivePayload
            </p>
          </div>

          {/* Action Buttons: "Quarantine" vs "dont care" */}
          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            {/* Quarantine Button */}
            <button
              onClick={quarantineVirus}
              className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Quarantine</span>
            </button>

            {/* dont care Button */}
            <button
              onClick={bypassAntivirusAndInstall}
              className="py-3 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Skull className="w-4 h-4" />
              <span>dont care</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
