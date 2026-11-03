import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { X, Trash2, Layers } from 'lucide-react';
import { AppId } from '../../types/os';
import { getAppIcon } from '../home/AppIconHelper';

export const RecentsSwitcher: React.FC = () => {
  const {
    isRecentsOpen,
    toggleRecents,
    runningApps,
    apps,
    openApp,
    killApp,
    clearAllRecents,
    activeAppId,
  } = useOS();

  if (!isRecentsOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 overflow-hidden flex flex-col justify-between">
        {/* Clouded Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => toggleRecents()}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xl"
        />

        {/* Top Header */}
        <div className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between text-white select-none">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold tracking-wide">Recent Apps</h2>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">
              {runningApps.length} active
            </span>
          </div>

          {runningApps.length > 0 && (
            <button
              onClick={clearAllRecents}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-xs text-white/80 transition-all border border-white/10 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Apps Card Deck / Horizontal Scroll View */}
        <div className="relative z-10 flex-1 flex items-center justify-start overflow-x-auto px-8 py-4 gap-6 no-scrollbar snap-x snap-mandatory">
          {runningApps.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center text-white/50 py-12">
              <Layers className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-sm font-medium">No recently opened apps</p>
              <p className="text-xs text-white/30 mt-1">
                Open apps from the Home screen or Store
              </p>
            </div>
          ) : (
            runningApps.map((appId: AppId, index: number) => {
              const app = apps.find((a) => a.id === appId);
              if (!app) return null;
              const isCurrent = activeAppId === appId;

              return (
                <motion.div
                  key={appId}
                  initial={{ opacity: 0, y: 50, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -80, scale: 0.7 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.04,
                  }}
                  drag="y"
                  dragConstraints={{ top: -150, bottom: 50 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y < -80 || info.velocity.y < -300) {
                      killApp(appId);
                    }
                  }}
                  className="flex-shrink-0 w-64 h-[72%] max-h-[440px] snap-center flex flex-col rounded-3xl overflow-hidden glass-cloud border border-white/25 shadow-2xl relative cursor-pointer group active:scale-[0.98] transition-transform"
                  onClick={() => openApp(appId)}
                >
                  {/* Card Header */}
                  <div className="h-11 px-4 bg-black/40 backdrop-blur-md flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-lg bg-white/15 flex items-center justify-center text-white">
                        {getAppIcon(app.icon, 'w-3.5 h-3.5')}
                      </div>
                      <span className="text-xs font-semibold text-white tracking-wide">
                        {app.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-sky-500/30 text-sky-300 px-1.5 py-0.5 rounded-md font-medium">
                          Active
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        killApp(appId);
                      }}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-rose-500/80 hover:text-white text-white/60 flex items-center justify-center transition-colors"
                      title="Swipe up or click to close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Snapshot Body (Frosted preview simulation) */}
                  <div className="flex-1 bg-gradient-to-b from-slate-900/60 to-black/80 p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-2 opacity-70">
                      <div className="h-4 w-28 bg-white/20 rounded-md" />
                      <div className="h-2 w-full bg-white/10 rounded-sm" />
                      <div className="h-2 w-4/5 bg-white/10 rounded-sm" />
                      <div className="h-16 w-full bg-white/5 rounded-xl border border-white/10 mt-3 flex items-center justify-center text-xs text-white/40">
                        Live Preview Snapshot
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10">
                      <span>Swipe up to close</span>
                      <span className="text-sky-300 font-medium">Tap to resume</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom dismiss indicator */}
        <div className="relative z-10 pb-4 text-center select-none">
          <button
            onClick={() => toggleRecents()}
            className="text-xs text-white/50 hover:text-white tracking-wide transition-colors py-1 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
          >
            Tap anywhere to dismiss
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
};
