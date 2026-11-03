import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { Lock, Flashlight, Camera, ChevronUp } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const LockScreen: React.FC = () => {
  const {
    isLockScreen,
    toggleLock,
    currentTime,
    notifications,
    settings,
    updateSettings,
    openApp,
  } = useOS();

  if (!isLockScreen) return null;

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleUnlock = () => {
    toggleLock(false);
  };

  const toggleFlashlight = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.click();
    updateSettings({ flashlight: !settings.flashlight });
  };

  const quickCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLock(false);
    openApp('camera');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={handleUnlock}
        className="absolute inset-0 z-50 flex flex-col justify-between p-8 text-white select-none backdrop-blur-md bg-black/40 cursor-pointer"
      >
        {/* Top: Status & Lock Icon */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center mb-6 border border-white/15">
            <Lock className="w-4 h-4 text-white/80" />
          </div>

          <p className="text-sm font-medium tracking-wide text-white/80 uppercase">
            {formattedDate}
          </p>
          <h1 className="text-7xl font-extralight tracking-tight my-2 text-glow">
            {formattedTime}
          </h1>
          <p className="text-xs text-white/60">TestOS 1 Secure Shell</p>
        </div>

        {/* Center: Notifications Peek */}
        <div className="flex-1 flex flex-col justify-center items-center py-4">
          {notifications.length > 0 && (
            <div className="w-full max-w-xs glass-cloud rounded-2xl p-3 border border-white/20 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                <span className="font-semibold text-sky-300">{notifications[0].appName}</span>
                <span>{notifications[0].time}</span>
              </div>
              <h4 className="text-xs font-medium text-white truncate">
                {notifications[0].title}
              </h4>
              <p className="text-[11px] text-white/70 line-clamp-1">
                {notifications[0].body}
              </p>
            </div>
          )}
        </div>

        {/* Bottom: Quick Actions & Unlock Instruction */}
        <div className="flex flex-col items-center gap-6 pb-4">
          <div className="flex items-center gap-2 text-xs text-white/70 animate-bounce">
            <ChevronUp className="w-4 h-4" />
            <span>Click or swipe anywhere to unlock</span>
          </div>

          <div className="w-full flex items-center justify-between px-4">
            <button
              onClick={toggleFlashlight}
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                settings.flashlight
                  ? 'bg-yellow-400 text-slate-900 border-yellow-300 shadow-lg shadow-yellow-400/30'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
              title="Flashlight"
              aria-label="Toggle flashlight"
            >
              <Flashlight className="w-5 h-5" />
            </button>

            <button
              onClick={quickCamera}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
              title="Quick Camera"
              aria-label="Open camera"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
