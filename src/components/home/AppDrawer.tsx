import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { getAppIcon } from './AppIconHelper';
import { Search, X, ChevronDown, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const AppDrawer: React.FC = () => {
  const { isAppDrawerOpen, toggleAppDrawer, apps, openApp } = useOS();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAppDrawerOpen) return null;

  // Filter installed apps
  const installedApps = apps.filter((a) => a.isInstalled);
  const filteredApps = installedApps.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-40 flex flex-col justify-end select-none">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => toggleAppDrawer(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
        />

        {/* Sliding Drawer Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 w-full h-[88%] bg-slate-950/85 backdrop-blur-3xl border-t border-white/20 rounded-t-[36px] p-5 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Swipe Handle */}
          <div
            onClick={() => toggleAppDrawer(false)}
            className="w-full flex flex-col items-center justify-center pb-3 cursor-pointer group"
          >
            <div className="w-12 h-1.5 bg-white/40 group-hover:bg-white/70 rounded-full transition-colors mb-2" />
            <div className="flex items-center gap-1 text-white/50 text-[11px] font-semibold uppercase tracking-wider">
              <span>App Drawer</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Search bar */}
          <div className="relative my-2">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search all installed apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/15 focus:border-sky-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Apps Grid */}
          <div className="flex-1 overflow-y-auto py-3 no-scrollbar">
            <div className="grid grid-cols-4 gap-y-6 gap-x-3">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => openApp(app.id)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white shadow-xl border border-white/20 group-hover:scale-105 group-active:scale-95 transition-all duration-150`}
                  >
                    {getAppIcon(app.icon, 'w-7 h-7 drop-shadow-md')}
                  </div>
                  <span className="text-[11px] font-medium text-white/90 mt-1.5 text-center truncate max-w-[64px]">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-12 text-xs text-white/40">
                No apps matching "{searchQuery}"
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
