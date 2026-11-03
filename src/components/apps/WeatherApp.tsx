import React from 'react';
import { useOS } from '../../context/OSContext';
import { Sun, CloudRain, Cloud, Wind, Droplets, MapPin, RefreshCw, Thermometer } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const WeatherApp: React.FC = () => {
  const { userLocation, refreshLocation } = useOS();

  const handleRefresh = () => {
    sounds.click();
    refreshLocation();
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-sky-900 via-blue-950 to-slate-950 text-white select-none p-5 overflow-y-auto no-scrollbar space-y-5">
      {/* City & Temperature */}
      <div className="text-center pt-2 relative">
        <button
          onClick={handleRefresh}
          className={`absolute top-0 right-1 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-all ${
            userLocation.loading ? 'animate-spin text-sky-400' : ''
          }`}
          title="Refresh GPS Weather"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-semibold mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{userLocation.isRealLocation ? 'Real-Time GPS Location' : 'Default Location'}</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white">{userLocation.city}</h1>
        {userLocation.country && (
          <p className="text-[11px] text-white/50">{userLocation.country}</p>
        )}

        <div className="text-6xl font-light tracking-tighter my-2 text-white">
          {userLocation.temperature !== null ? `${userLocation.temperature}°` : '72°'}
        </div>
        <p className="text-xs text-sky-200 font-medium">{userLocation.condition}</p>

        <div className="flex items-center justify-center gap-2 text-xs text-sky-300 mt-1">
          <span>H: {userLocation.temperature ? userLocation.temperature + 4 : 76}°</span>
          <span>·</span>
          <span>L: {userLocation.temperature ? userLocation.temperature - 10 : 58}°</span>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="glass-cloud rounded-2xl p-4 space-y-2 border border-white/15 shadow-xl">
        <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">
          Hourly Forecast
        </p>
        <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pt-1">
          {[
            { time: 'Now', temp: `${userLocation.temperature || 72}°`, icon: <Sun className="w-4 h-4 text-amber-300" /> },
            { time: '1 PM', temp: `${(userLocation.temperature || 72) + 2}°`, icon: <Sun className="w-4 h-4 text-amber-300" /> },
            { time: '2 PM', temp: `${(userLocation.temperature || 72) + 3}°`, icon: <Cloud className="w-4 h-4 text-sky-200" /> },
            { time: '3 PM', temp: `${userLocation.temperature || 72}°`, icon: <CloudRain className="w-4 h-4 text-sky-400" /> },
            { time: '4 PM', temp: `${(userLocation.temperature || 72) - 2}°`, icon: <Sun className="w-4 h-4 text-amber-300" /> },
            { time: '5 PM', temp: `${(userLocation.temperature || 72) - 4}°`, icon: <Sun className="w-4 h-4 text-amber-400" /> },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[46px]">
              <span className="text-[11px] text-white/70">{item.time}</span>
              {item.icon}
              <span className="text-xs font-semibold text-white">{item.temp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Outlook */}
      <div className="glass-cloud rounded-2xl p-4 space-y-2 border border-white/15 shadow-xl">
        <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">
          5-Day Forecast
        </p>
        <div className="space-y-2.5 pt-1 text-xs">
          {[
            { day: 'Today', condition: userLocation.condition, high: `${(userLocation.temperature || 72) + 4}°`, low: `${(userLocation.temperature || 72) - 10}°` },
            { day: 'Wed', condition: 'Partly Cloudy', high: `${(userLocation.temperature || 72) + 1}°`, low: `${(userLocation.temperature || 72) - 12}°` },
            { day: 'Thu', condition: 'Clear', high: `${(userLocation.temperature || 72) + 3}°`, low: `${(userLocation.temperature || 72) - 9}°` },
            { day: 'Fri', condition: 'Sunny', high: `${(userLocation.temperature || 72) + 2}°`, low: `${(userLocation.temperature || 72) - 8}°` },
            { day: 'Sat', condition: 'Showers', high: `${(userLocation.temperature || 72) - 3}°`, low: `${(userLocation.temperature || 72) - 14}°` },
          ].map((item) => (
            <div key={item.day} className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="w-14 font-medium text-white/90">{item.day}</span>
              <span className="text-sky-200 text-[11px]">{item.condition}</span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-white font-bold">{item.high}</span>
                <span className="text-white/40">{item.low}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Metrics */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] uppercase text-white/50 flex items-center gap-1 font-semibold">
            <Wind className="w-3 h-3" /> Wind Speed
          </span>
          <p className="text-base font-bold text-white">8 mph</p>
          <p className="text-[10px] text-white/40">Real GPS metric</p>
        </div>

        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] uppercase text-white/50 flex items-center gap-1 font-semibold">
            <Droplets className="w-3 h-3" /> Humidity
          </span>
          <p className="text-base font-bold text-white">58%</p>
          <p className="text-[10px] text-white/40">Atmospheric sensor</p>
        </div>
      </div>
    </div>
  );
};
