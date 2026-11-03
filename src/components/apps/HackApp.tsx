import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Skull, AlertOctagon, Terminal } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const HackApp: React.FC = () => {
  const { triggerVirusPayload } = useOS();
  const [phase, setPhase] = useState<'deleting' | 'restart_countdown'>('deleting');
  const [logs, setLogs] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(10);

  // Phase 1: Terminal log app deletion
  useEffect(() => {
    const deleteSequence = [
      '[+] Initializing tottalynotahack payload...',
      '[!] Escalating root privileges on TestOS 1...',
      '[-] Deleting CloudNet Browser... DELETED',
      '[-] Deleting Messages & Conversations... DELETED',
      '[-] Deleting Camera & Photos... DELETED',
      '[-] Deleting Notes & Calculator... DELETED',
      '[-] Deleting Weather & Clock... DELETED',
      '[-] Deleting Store & System Apps... DELETED',
      '[!] All applications deleted except tottalynotahack.',
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < deleteSequence.length) {
        setLogs((prev) => [...prev, deleteSequence[current]]);
        sounds.click();
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          sounds.alarm();
          setPhase('restart_countdown');
        }, 600);
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  // Phase 2: Countdown 10 to 1
  useEffect(() => {
    if (phase !== 'restart_countdown') return;

    sounds.countdownBeep(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Trigger the red glitch and system crash!
          triggerVirusPayload();
          return 0;
        }
        const next = prev - 1;
        sounds.countdownBeep(next <= 3);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, triggerVirusPayload]);

  return (
    <div className="flex-1 flex flex-col bg-black text-rose-500 font-mono select-none p-5 overflow-hidden justify-between">
      {phase === 'deleting' ? (
        // TERMINAL DELETION LOG
        <div className="flex-1 flex flex-col justify-start space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-500/30 text-xs font-bold text-rose-400">
            <Terminal className="w-4 h-4" />
            <span>tottalynotahack.sh - Running System Wipe</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 text-xs text-rose-300">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-rose-500/60 animate-pulse">
            Processing root partitions...
          </div>
        </div>
      ) : (
        // MAJOR RESTART COUNTDOWN SCREEN
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-rose-600/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center animate-ping">
            <AlertOctagon className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Your phone needs a major restart.
            </h2>
            <p className="text-xs text-rose-300">
              Critical system partition failure detected.
            </p>
          </div>

          {/* Countdown display */}
          <div className="p-6 rounded-3xl bg-rose-950/60 border border-rose-500/40 shadow-2xl flex flex-col items-center">
            <span className="text-xs text-rose-300 uppercase font-bold tracking-widest mb-1">
              Restarting in
            </span>
            <div className="text-7xl font-black text-white font-mono animate-pulse">
              {countdown}
            </div>
            <span className="text-[10px] text-rose-400/80 mt-2 font-mono">
              10 9 8 7 6 5 4 3 2 1
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
