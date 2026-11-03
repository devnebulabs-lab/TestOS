import React, { useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { getAppIcon } from './AppIconHelper';
import { Search, Sun, CloudRain, ChevronUp, MapPin, Grid } from 'lucide-react';
import { AppMetadata } from '../../types/os';

export const HomeScreen: React.FC = () => {
  const { apps, openApp, currentTime, userLocation, toggleAppDrawer } = useOS();
  const touchStartY = useRef<number | null>(null);

  // Primary dock apps
  const dockAppIds = ['browser', 'store', 'messages', 'camera'];
  const dockApps = dockAppIds
    .map((id) => apps.find((a) => a.id === id && a.isInstalled))
    .filter(Boolean) as AppMetadata[];

  // Primary home screen grid apps
  const gridApps = apps.filter((app) => app.isInstalled && !dockAppIds.includes(app.id));

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Touch gesture for swipe up to open App Drawer
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    // Swipe up threshold
    if (diff > 45) {
      toggleAppDrawer(true);
    }
    touchStartY.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex-1 flex flex-col justify-between p-5 pt-3 select-none overflow-hidden relative z-10"
    >
      {/* Top Glass Widget: Clock, Weather & Quick Search */}
      <div className="space-y-3">
        {/* Weather & Clock Widget with Real Geolocation */}
        <div
          onClick={() => openApp('weather')}
          className="glass-cloud rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all shadow-lg group active:scale-[0.99]"
        >
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-white tracking-tight">{formattedTime}</span>
              <span className="text-xs text-white/70 font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sky-200 mt-1">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-medium">
                {userLocation.temperature !== null ? `${userLocation.temperature}°F` : '72°F'} ·{' '}
                {userLocation.city}
              </span>
              {userLocation.isRealLocation && (
                <span className="flex items-center text-[10px] text-emerald-300 font-mono" title="Live GPS Sensor">
                  <MapPin className="w-2.5 h-2.5 ml-0.5" />
                </span>
              )}
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 group-hover:scale-105 transition-transform">
            <CloudRain className="w-6 h-6 text-sky-300" />
          </div>
        </div>

        {/* Quick Search Bar (opens browser search) */}
        <div
          onClick={() => openApp('browser')}
          className="glass-cloud rounded-2xl px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/15 transition-all shadow-md group"
        >
          <Search className="w-4 h-4 text-white/60 group-hover:text-sky-300 transition-colors" />
          <span className="text-xs text-white/50 flex-1">Search the web or type URL...</span>
          <span className="text-[10px] text-white/40 uppercase font-mono px-1.5 py-0.5 rounded bg-white/10">
            CloudNet
          </span>
        </div>
      </div>

      {/* App Grid: 4 columns */}
      <div className="flex-1 py-4 flex items-start overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-4 gap-y-5 gap-x-3 w-full">
          {gridApps.slice(0, 8).map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center group focus:outline-none"
            >
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white shadow-xl shadow-black/25 border border-white/20 group-hover:scale-105 group-active:scale-95 transition-all duration-150`}
                >
                  {getAppIcon(app.icon, 'w-7 h-7 drop-shadow-md')}
                </div>

                {Boolean(app.badgeCount && app.badgeCount > 0) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {app.badgeCount}
                  </span>
                )}
              </div>

              <span className="text-[11px] font-medium text-white/90 mt-1.5 tracking-tight text-center truncate max-w-[64px] drop-shadow">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Swipe up / App Drawer trigger */}
      <div className="w-full flex justify-center pb-2">
        <button
          onClick={() => toggleAppDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[11px] font-medium transition-all backdrop-blur-md border border-white/10"
        >
          <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
          <span>App Drawer</span>
        </button>
      </div>

      {/* Pinned Bottom Dock */}
      <div className="glass-cloud-heavy rounded-3xl p-3 flex items-center justify-around shadow-2xl relative border border-white/25">
        {dockApps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="flex flex-col items-center group relative focus:outline-none"
            title={app.name}
          >
            <div
              className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white shadow-lg shadow-black/30 border border-white/25 group-hover:scale-105 group-active:scale-95 transition-all duration-150`}
            >
              {getAppIcon(app.icon, 'w-6 h-6 drop-shadow')}
            </div>

            {Boolean(app.badgeCount && app.badgeCount > 0) && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {app.badgeCount}
              </span>
            )}
          </button>
        ))}

        {/* Dedicated App Drawer launcher icon in dock */}
        <button
          onClick={() => toggleAppDrawer(true)}
          className="flex flex-col items-center group relative focus:outline-none"
          title="All Apps"
        >
          <div className="w-13 h-13 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 active:scale-95 transition-all">
            <Grid className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
};
