import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS } from '../../context/OSContext';
import {
  Wifi,
  Bluetooth,
  Plane,
  Flashlight,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  Trash2,
  X,
  Lock,
  Power,
  MapPin,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const ControlCenter: React.FC = () => {
  const {
    isControlCenterOpen,
    toggleControlCenter,
    togglePowerMenu,
    settings,
    updateSettings,
    notifications,
    dismissNotification,
    clearAllNotifications,
    openApp,
    toggleLock,
    userLocation,
    refreshLocation,
  } = useOS();

  if (!isControlCenterOpen) return null;

  const toggleSound = () => {
    updateSettings({ soundsEnabled: !settings.soundsEnabled });
    sounds.click();
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 overflow-hidden flex flex-col justify-start">
        {/* Deep blur backdrop over the entire OS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => toggleControlCenter(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-3xl"
        />

        {/* Clouded Drawer Content */}
        <motion.div
          initial={{ y: '-100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.8 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-h-[90%] bg-slate-900/85 backdrop-blur-3xl border-b border-white/20 rounded-b-[36px] p-5 shadow-2xl flex flex-col text-white select-none overflow-y-auto no-scrollbar"
        >
          {/* Header with Power Button */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wide uppercase text-white/80">
                Control Center
              </span>
              <span className="text-xs text-sky-400 font-mono">TestOS 1</span>
            </div>

            <div className="flex items-center gap-2">
              {/* POWER BUTTON IN CONTROL CENTER */}
              <button
                onClick={() => {
                  toggleControlCenter(false);
                  togglePowerMenu(true);
                }}
                className="p-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/30 active:scale-90 transition-all flex items-center gap-1 px-2.5 text-xs font-semibold"
                title="Power & Reboot Options"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Power</span>
              </button>

              <button
                onClick={() => toggleControlCenter(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 active:scale-90 transition-all"
                aria-label="Close Control Center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Toggles Grid */}
          <div className="grid grid-cols-4 gap-2.5 my-4">
            {/* Wi-Fi */}
            <button
              onClick={() => {
                updateSettings({ wifiEnabled: !settings.wifiEnabled });
                sounds.click();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border ${
                settings.wifiEnabled
                  ? 'bg-sky-500/30 border-sky-400/50 text-sky-300 shadow-lg shadow-sky-500/20'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              <Wifi className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Wi-Fi</span>
            </button>

            {/* Bluetooth */}
            <button
              onClick={() => {
                updateSettings({ bluetoothEnabled: !settings.bluetoothEnabled });
                sounds.click();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border ${
                settings.bluetoothEnabled
                  ? 'bg-blue-600/30 border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              <Bluetooth className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Bluetooth</span>
            </button>

            {/* Airplane Mode */}
            <button
              onClick={() => {
                updateSettings({ airplaneMode: !settings.airplaneMode });
                sounds.click();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border ${
                settings.airplaneMode
                  ? 'bg-amber-500/30 border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              <Plane className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Airplane</span>
            </button>

            {/* Flashlight */}
            <button
              onClick={() => {
                updateSettings({ flashlight: !settings.flashlight });
                sounds.click();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border ${
                settings.flashlight
                  ? 'bg-yellow-400/30 border-yellow-300/50 text-yellow-200 shadow-lg shadow-yellow-400/20'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              <Flashlight className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Flashlight</span>
            </button>

            {/* Do Not Disturb */}
            <button
              onClick={() => {
                updateSettings({ dnd: !settings.dnd });
                sounds.click();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border ${
                settings.dnd
                  ? 'bg-purple-600/30 border-purple-400/50 text-purple-300'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              <Moon className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">DND</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border ${
                settings.soundsEnabled
                  ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
              }`}
            >
              {settings.soundsEnabled ? (
                <Volume2 className="w-5 h-5 mb-1" />
              ) : (
                <VolumeX className="w-5 h-5 mb-1" />
              )}
              <span className="text-[11px] font-medium">Haptics</span>
            </button>

            {/* Lock Device */}
            <button
              onClick={() => toggleLock(true)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 active:scale-95 transition-all"
            >
              <Lock className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Lock</span>
            </button>

            {/* Location Sensor Refresh */}
            <button
              onClick={() => {
                sounds.click();
                refreshLocation();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                userLocation.isRealLocation
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium truncate max-w-[60px]">
                {userLocation.isRealLocation ? 'GPS Active' : 'GPS Loc'}
              </span>
            </button>
          </div>

          {/* Sliders: Brightness & Volume */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sun className="w-3.5 h-3.5" /> Brightness
                </span>
                <span className="font-mono">{settings.brightness}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.brightness}
                onChange={(e) => updateSettings({ brightness: Number(e.target.value) })}
                className="w-full accent-white h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Volume2 className="w-3.5 h-3.5" /> Volume
                </span>
                <span className="font-mono">{settings.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                className="w-full accent-sky-400 h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3 h-3" /> Notifications ({notifications.length})
              </span>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-3 text-xs text-white/40">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      openApp(notif.appId);
                      dismissNotification(notif.id);
                    }}
                    className="p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl flex items-start justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-sky-300">{notif.appName}</span>
                        <span className="text-[10px] text-white/40">{notif.time}</span>
                      </div>
                      <h4 className="text-xs font-medium text-white truncate">{notif.title}</h4>
                      <p className="text-[11px] text-white/70 line-clamp-1">{notif.body}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notif.id);
                      }}
                      className="text-white/40 hover:text-white/80 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Swipe handle bottom */}
          <div className="w-full flex justify-center pt-3 mt-1">
            <div
              onClick={() => toggleControlCenter(false)}
              className="w-12 h-1 bg-white/40 rounded-full cursor-pointer hover:bg-white/70 transition-colors"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
