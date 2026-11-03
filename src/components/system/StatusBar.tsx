import React from 'react';
import { useOS } from '../../context/OSContext';
import { Wifi, Battery, BatteryCharging, Volume2, VolumeX, Moon } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    currentTime,
    batteryLevel,
    isCharging,
    settings,
    toggleControlCenter,
    activeAppId,
    apps,
  } = useOS();

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const activeApp = apps.find((a) => a.id === activeAppId);

  return (
    <header
      onClick={() => toggleControlCenter()}
      className="w-full h-8 pt-1 px-5 flex items-center justify-between text-xs font-semibold text-white/90 select-none cursor-pointer z-50 transition-colors hover:bg-white/5 active:bg-white/10"
      title="Click or swipe down for Control Center"
      aria-label="Status bar"
    >
      {/* Left: Time & Active App indicator */}
      <div className="flex items-center gap-2">
        <span className="tracking-tight font-medium text-[13px]">{formattedTime}</span>
        {activeApp && (
          <span className="hidden sm:inline-block text-[11px] text-white/50 max-w-[80px] truncate">
            {activeApp.name}
          </span>
        )}
      </div>

      {/* Center: Dynamic Punch Hole / Speaker Notch */}
      <div className="flex items-center justify-center">
        <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 px-2 border border-white/10 shadow-inner group">
          <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" title="System Ready" />
          <div className="w-1 h-1 rounded-full bg-blue-500/60" />
        </div>
      </div>

      {/* Right: Connectivity & Battery */}
      <div className="flex items-center gap-1.5 text-white/80">
        {settings.dnd && <Moon className="w-3 h-3 text-purple-300" />}
        {settings.volume === 0 ? (
          <VolumeX className="w-3 h-3 text-rose-400" />
        ) : (
          <Volume2 className="w-3 h-3 text-white/70" />
        )}
        
        {settings.wifiEnabled ? (
          <Wifi className="w-3.5 h-3.5" />
        ) : (
          <span className="text-[10px] text-white/40">5G</span>
        )}

        <div className="flex items-center gap-0.5">
          <span className="text-[11px] font-mono">{batteryLevel}%</span>
          {isCharging ? (
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Battery className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    </header>
  );
};
