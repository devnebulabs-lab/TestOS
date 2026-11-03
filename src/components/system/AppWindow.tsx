import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import { getAppIcon } from '../home/AppIconHelper';
import { Minus, X, Maximize2 } from 'lucide-react';
import { StoreApp } from '../apps/StoreApp';
import { BrowserApp } from '../apps/BrowserApp';
import { MessagesApp } from '../apps/MessagesApp';
import { CameraApp } from '../apps/CameraApp';
import { GalleryApp } from '../apps/GalleryApp';
import { MusicApp } from '../apps/MusicApp';
import { NotesApp } from '../apps/NotesApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { WeatherApp } from '../apps/WeatherApp';
import { ClockApp } from '../apps/ClockApp';
import { SettingsApp } from '../apps/SettingsApp';
import { GameApp } from '../apps/GameApp';
import { FilesApp } from '../apps/FilesApp';

export const AppWindow: React.FC = () => {
  const { activeAppId, apps, closeCurrentApp } = useOS();

  if (!activeAppId) return null;

  const currentApp = apps.find((a) => a.id === activeAppId);
  if (!currentApp) return null;

  const renderAppContent = () => {
    switch (activeAppId) {
      case 'store':
        return <StoreApp />;
      case 'browser':
        return <BrowserApp />;
      case 'messages':
        return <MessagesApp />;
      case 'camera':
        return <CameraApp />;
      case 'gallery':
        return <GalleryApp />;
      case 'music':
        return <MusicApp />;
      case 'notes':
        return <NotesApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'weather':
        return <WeatherApp />;
      case 'clock':
        return <ClockApp />;
      case 'settings':
        return <SettingsApp />;
      case 'game':
        return <GameApp />;
      case 'files':
        return <FilesApp />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-white/50 text-xs">
            App not found
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeAppId}
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="absolute inset-0 z-30 flex flex-col bg-slate-950/85 backdrop-blur-2xl overflow-hidden select-none"
      >
        {/* Clouded Window Top Bar */}
        <div className="h-10 px-4 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-lg bg-gradient-to-tr ${currentApp.gradient} flex items-center justify-center text-white shadow-sm`}>
              {getAppIcon(currentApp.icon, 'w-3 h-3')}
            </div>
            <span className="text-xs font-bold tracking-tight text-white/95">
              {currentApp.name}
            </span>
          </div>

          {/* Cloud Window Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={closeCurrentApp}
              className="w-6 h-6 rounded-full hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors"
              title="Minimize to Home"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={closeCurrentApp}
              className="w-6 h-6 rounded-full hover:bg-rose-500/80 hover:text-white text-white/60 flex items-center justify-center transition-colors"
              title="Close App"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {renderAppContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
