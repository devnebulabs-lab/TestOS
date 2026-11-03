import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import {
  Smartphone,
  Sun,
  Volume2,
  MapPin,
  Navigation,
  Battery,
  RotateCcw,
  Sparkles,
  Shield,
  Check,
  Search,
  HardDrive,
  Cpu,
  Power,
  RefreshCw,
  Sliders,
  Image,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Skull,
  Trash2,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const SettingsApp: React.FC = () => {
  const {
    settings,
    updateSettings,
    wallpapers,
    userLocation,
    refreshLocation,
    factoryReset,
    setBootState,
    togglePowerMenu,
    batteryLevel,
    isCharging,
    apps,
    uninstallApp,
    addNotification,
  } = useOS();

  const [activeTab, setActiveTab] = useState<
    'all' | 'about' | 'display' | 'sound' | 'location' | 'navigation' | 'battery' | 'wallpapers' | 'antivirus'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<{ threat: boolean; name?: string } | null>(null);

  const hackAppInstalled = apps.some((a) => a.id === 'tottalynotahack' && a.isInstalled);

  const handleFactoryReset = () => {
    if (confirm('Are you sure you want to factory reset TestOS? All notes, installed apps, and custom settings will be wiped and you will be returned to the Welcome Setup.')) {
      sounds.haptic();
      factoryReset();
    }
  };

  const handleRerunWelcome = () => {
    sounds.click();
    setBootState('welcome');
  };

  const handleStartScan = () => {
    sounds.click();
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 20;
        if (next >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          if (hackAppInstalled) {
            sounds.alarm();
            setScanResult({ threat: true, name: 'tottalynotahack (Trojan.Wiper.Payload)' });
          } else {
            sounds.notification();
            setScanResult({ threat: false });
          }
          return 100;
        }
        return next;
      });
    }, 180);
  };

  const handleQuarantineFromSettings = () => {
    sounds.haptic();
    uninstallApp('tottalynotahack');
    setScanResult({ threat: false });
    addNotification({
      appId: 'settings',
      title: 'Threat Neutralized',
      body: 'TestAntivirus removed tottalynotahack from TestOS storage.',
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab !== 'all' ? (
              <button
                onClick={() => setActiveTab('all')}
                className="text-xs text-sky-400 font-semibold hover:underline"
              >
                ← All Settings
              </button>
            ) : (
              <h1 className="text-base font-bold tracking-tight">Android Settings</h1>
            )}
          </div>
          <span className="text-[11px] font-mono text-white/50">TestOS 1</span>
        </div>

        {/* Search */}
        {activeTab === 'all' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search settings (sound, display, about)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/15 focus:border-sky-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Main Settings Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* VIEW ALL CATEGORIES */}
        {activeTab === 'all' && !searchQuery && (
          <>
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-slate-900/40 border border-sky-500/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                  {settings.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{settings.username}</h3>
                  <p className="text-[11px] text-sky-300">TestOS Administrator</p>
                </div>
              </div>
              <button
                onClick={handleRerunWelcome}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white/80 transition-colors"
              >
                Setup Wizard
              </button>
            </div>

            {/* Android-like Category List */}
            <div className="space-y-2">
              {/* 1. About Phone */}
              <div
                onClick={() => setActiveTab('about')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">About Phone</h4>
                    <p className="text-[10px] text-white/50">Device specs, RAM, processor, storage</p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>

              {/* TestAntivirus & Security */}
              <div
                onClick={() => setActiveTab('antivirus')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  hackAppInstalled
                    ? 'bg-rose-500/20 border-rose-500/40 shadow-lg shadow-rose-950/40 animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      hackAppInstalled
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {hackAppInstalled ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">TestAntivirus & Security</h4>
                      {hackAppInstalled && (
                        <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold">
                          THREAT FOUND
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/50">
                      {hackAppInstalled
                        ? 'Trojan detected: tottalynotahack! Tap to scan'
                        : 'Real-time shield & malware quarantine'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>

              {/* 2. Display & Brightness */}
              <div
                onClick={() => setActiveTab('display')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Display & Brightness</h4>
                    <p className="text-[10px] text-white/50">Brightness slider, clouded glass blur</p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>

              {/* 3. Wallpapers */}
              <div
                onClick={() => setActiveTab('wallpapers')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Image className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Wallpaper & Styles</h4>
                    <p className="text-[10px] text-white/50">8 dynamic mesh & photography backgrounds</p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>

              {/* 4. Sound & Vibration */}
              <div
                onClick={() => setActiveTab('sound')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sound & Haptics</h4>
                    <p className="text-[10px] text-white/50">Web Audio synthesis, volume slider</p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>

              {/* 5. Location & GPS */}
              <div
                onClick={() => setActiveTab('location')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Location & Privacy</h4>
                    <p className="text-[10px] text-white/50">
                      {userLocation.isRealLocation ? `GPS: ${userLocation.city}` : 'Default GPS'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>

              {/* 6. System Navigation */}
              <div
                onClick={() => setActiveTab('navigation')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">System Navigation</h4>
                    <p className="text-[10px] text-white/50">
                      Current: {settings.navigationMode === '3-button' ? '3-Button Bar' : 'Gestures'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>

              {/* 7. Battery & Power */}
              <div
                onClick={() => setActiveTab('battery')}
                className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Battery className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Battery & Power Options</h4>
                    <p className="text-[10px] text-white/50">
                      {batteryLevel}% · {isCharging ? 'Charging' : 'Normal'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-white/40">→</span>
              </div>
            </div>

            {/* Quick Factory Reset Bar */}
            <div className="pt-2">
              <button
                onClick={handleFactoryReset}
                className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <RotateCcw className="w-4 h-4" /> Reset TestOS to Factory State
              </button>
            </div>
          </>
        )}

        {/* TAB: ABOUT PHONE */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">TestOS 1 Flagship Mobile</h3>
                  <p className="text-[11px] text-emerald-400">Official Release · Generation 1</p>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-white/5">
                <div className="flex justify-between pt-1">
                  <span className="text-white/50">Device Model</span>
                  <span className="font-semibold text-white">TestOS 1</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-white/50 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" /> Processor
                  </span>
                  <span className="font-semibold text-white">Quantum Octa-Core Silicon X</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-white/50">RAM Memory</span>
                  <span className="font-mono text-white font-semibold">12 GB LPDDR5X</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-white/50 flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" /> Storage
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">24.5 GB / 128 GB</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-white/50">Kernel Version</span>
                  <span className="font-mono text-white/70">TestOS-Cloud-6.1-wasm</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-white/50">Security Patch</span>
                  <span className="text-emerald-400">November 2, 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: DISPLAY */}
        {activeTab === 'display' && (
          <div className="space-y-4">
            {/* Brightness */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-white">
                  <Sun className="w-4 h-4 text-amber-400" /> Screen Brightness
                </span>
                <span className="font-mono text-sky-400">{settings.brightness}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.brightness}
                onChange={(e) => updateSettings({ brightness: Number(e.target.value) })}
                className="w-full accent-amber-400 h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cloud Glass Blur */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Cloud Glass Blur Level
              </span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['subtle', 'medium', 'deep'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      sounds.click();
                      updateSettings({ blurIntensity: level });
                    }}
                    className={`py-2 rounded-xl text-xs capitalize transition-all border ${
                      settings.blurIntensity === level
                        ? 'bg-sky-500/25 border-sky-400 text-sky-300 font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: WALLPAPERS */}
        {activeTab === 'wallpapers' && (
          <div className="space-y-3">
            <p className="text-xs text-white/70">
              Select any cool wallpaper to apply across TestOS:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {wallpapers.map((wp) => {
                const isSelected = settings.wallpaper === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => {
                      sounds.notification();
                      updateSettings({ wallpaper: wp.id });
                    }}
                    className={`aspect-video rounded-2xl p-3 flex flex-col justify-end cursor-pointer border-2 transition-all relative overflow-hidden group shadow-lg ${
                      isSelected
                        ? 'border-sky-400 ring-2 ring-sky-400/40 scale-102'
                        : 'border-white/15 hover:border-white/30'
                    }`}
                    style={{ background: wp.value, backgroundSize: 'cover' }}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white drop-shadow truncate">
                        {wp.name}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: SOUND */}
        {activeTab === 'sound' && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-white">
                  <Volume2 className="w-4 h-4 text-emerald-400" /> Master Volume
                </span>
                <span className="font-mono text-emerald-400">{settings.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">UI Clicks & Haptics</h4>
                <p className="text-[10px] text-white/50">Synthesized Web Audio sound effects</p>
              </div>
              <button
                onClick={() => {
                  sounds.click();
                  updateSettings({ soundsEnabled: !settings.soundsEnabled });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings.soundsEnabled ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.soundsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* TAB: LOCATION */}
        {activeTab === 'location' && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time GPS Location Sensor</span>
                </div>
                <button
                  onClick={() => {
                    sounds.click();
                    refreshLocation();
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80"
                  title="Refresh GPS"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/50">Status</span>
                  <span className="text-emerald-400 font-semibold">
                    {userLocation.isRealLocation ? 'Active · GPS Connected' : 'Simulated GPS'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Current City</span>
                  <span className="font-bold text-white">{userLocation.city}</span>
                </div>
                {userLocation.latitude !== null && (
                  <div className="flex justify-between font-mono text-[10px] text-white/60">
                    <span>Coordinates</span>
                    <span>
                      {userLocation.latitude.toFixed(4)}, {userLocation.longitude?.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: NAVIGATION */}
        {activeTab === 'navigation' && (
          <div className="space-y-3">
            <p className="text-xs text-white/70">
              Select your preferred navigation bar style:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  sounds.click();
                  updateSettings({ navigationMode: '3-button' });
                }}
                className={`p-4 rounded-2xl border text-xs flex flex-col items-center gap-2 transition-all ${
                  settings.navigationMode === '3-button'
                    ? 'bg-sky-500/25 border-sky-400 text-sky-200 font-bold shadow-md'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="text-base">◀ ⚪ ▢</span>
                <span>Classic 3-Button Bar</span>
              </button>

              <button
                onClick={() => {
                  sounds.click();
                  updateSettings({ navigationMode: 'gestures' });
                }}
                className={`p-4 rounded-2xl border text-xs flex flex-col items-center gap-2 transition-all ${
                  settings.navigationMode === 'gestures'
                    ? 'bg-sky-500/25 border-sky-400 text-sky-200 font-bold shadow-md'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="w-12 h-1 bg-current rounded-full my-1.5" />
                <span>Gesture Pill</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: BATTERY */}
        {activeTab === 'battery' && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-white">
                  <Battery className="w-4 h-4 text-emerald-400" /> Battery Status
                </span>
                <span className="font-mono text-emerald-400 font-bold">{batteryLevel}%</span>
              </div>
              <p className="text-[11px] text-white/60">
                {isCharging ? 'Device is connected to power' : 'Normal battery discharge'}
              </p>
            </div>

            <button
              onClick={() => togglePowerMenu(true)}
              className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Power className="w-4 h-4" /> Open System Power Menu
            </button>
          </div>
        )}

        {/* TAB: ANTIVIRUS & SECURITY */}
        {activeTab === 'antivirus' && (
          <div className="space-y-4">
            {/* Status Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                hackAppInstalled
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  hackAppInstalled ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/50' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {hackAppInstalled ? <ShieldAlert className="w-6 h-6 animate-bounce" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white">
                  {hackAppInstalled ? 'Threat Found on Device!' : 'TestOS 1 is Fully Protected'}
                </h3>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {hackAppInstalled
                    ? 'tottalynotahack is installed and poses a severe system wipe threat!'
                    : 'Real-time background shield is actively monitoring packages.'}
                </p>
              </div>
            </div>

            {/* Quarantine Action if Threat Detected */}
            {hackAppInstalled && (
              <div className="p-4 bg-rose-950/70 border-2 border-rose-500/60 rounded-2xl space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                  <Skull className="w-4 h-4" />
                  <span>Detected Malware: tottalynotahack</span>
                </div>
                <p className="text-[11px] text-rose-200/80 leading-relaxed font-mono">
                  Payload Type: Trojan.SystemWiper
                  <br />
                  Action: Scheduled to erase all system apps and corrupt kernel!
                </p>
                <button
                  onClick={handleQuarantineFromSettings}
                  className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Quarantine & Remove Threat Immediately</span>
                </button>
              </div>
            )}

            {/* Live Scan Trigger */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Manual Antivirus Scan</h4>
                  <p className="text-[10px] text-white/50">Scans all installed applications & storage</p>
                </div>
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Scanning...' : 'Scan Now'}</span>
                </button>
              </div>

              {isScanning && (
                <div className="space-y-1.5 pt-2">
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-400 h-full rounded-full transition-all duration-150"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-sky-300">
                    Inspecting packages... {scanProgress}%
                  </p>
                </div>
              )}

              {scanResult && !isScanning && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    scanResult.threat
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {scanResult.threat ? (
                    <div className="flex items-center justify-between">
                      <span className="font-bold">⚠️ Warning: {scanResult.name}</span>
                      <button
                        onClick={handleQuarantineFromSettings}
                        className="px-2.5 py-1 bg-rose-500 text-white font-bold rounded-lg text-[10px]"
                      >
                        Quarantine
                      </button>
                    </div>
                  ) : (
                    <span>✅ Scan Complete: 0 threats found. System is clean.</span>
                  )}
                </div>
              )}
            </div>

            {/* Antivirus Database Specs */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Engine</span>
                <span className="font-semibold text-white">TestAntivirus 1.0 Core</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/50">Signatures</span>
                <span className="font-mono text-emerald-400">v1.0.4 - Live Cloud</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Store Protection</span>
                <span className="text-sky-400 font-semibold">Active & Intercepting</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
