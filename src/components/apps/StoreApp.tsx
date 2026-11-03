import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId, AppMetadata, AppCategory } from '../../types/os';
import { getAppIcon } from '../home/AppIconHelper';
import {
  Search,
  Star,
  Download,
  Trash2,
  CheckCircle,
  ExternalLink,
  Info,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StoreApp: React.FC = () => {
  const { apps, installApp, uninstallApp, openApp, registerBackHandler } = useOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<AppMetadata | null>(null);
  const [installingId, setInstallingId] = useState<AppId | null>(null);

  // Register back handler to close app details if open
  React.useEffect(() => {
    return registerBackHandler(() => {
      if (selectedApp) {
        setSelectedApp(null);
        return true;
      }
      return false;
    });
  }, [selectedApp, registerBackHandler]);

  const categories: { label: string; value: AppCategory | 'all' }[] = [
    { label: 'All Apps', value: 'all' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Tools', value: 'tools' },
    { label: 'Social', value: 'social' },
    { label: 'Productivity', value: 'productivity' },
    { label: 'System', value: 'system' },
  ];

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = async (appId: AppId) => {
    setInstallingId(appId);
    try {
      await installApp(appId);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } finally {
      setInstallingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/80 backdrop-blur-xl text-white select-none overflow-hidden">
      {/* Top Header & Search */}
      <div className="p-4 border-b border-white/10 bg-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">TestOS Store</h1>
              <p className="text-[10px] text-white/50">Curated cloud applications</p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-white/70">
            TestOS 1
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search apps, games, utilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Featured App Banner if 'all' and no search */}
        {selectedCategory === 'all' && !searchQuery && (
          <div
            onClick={() => {
              const gameApp = apps.find((a) => a.id === 'game');
              if (gameApp) setSelectedApp(gameApp);
            }}
            className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-pink-900/60 border border-purple-500/30 cursor-pointer shadow-xl group hover:border-purple-400/50 transition-all"
          >
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-pink-300 tracking-wider">
                  Featured Game
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Galaxy Runner Arcade
                </h3>
                <p className="text-xs text-white/70 max-w-xs mt-1">
                  Dodge cosmic asteroids & collect quantum crystals in this retro space dodger.
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-white/80">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-300" /> 4.9
                  </span>
                  <span>·</span>
                  <span>19 MB</span>
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                {getAppIcon('Gamepad2', 'w-8 h-8')}
              </div>
            </div>
          </div>
        )}

        {/* App List */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider px-1">
            {selectedCategory === 'all' ? 'All Applications' : `${selectedCategory} Apps`} (
            {filteredApps.length})
          </h2>

          {filteredApps.length === 0 ? (
            <div className="text-center py-10 text-white/40 text-xs">
              No apps found matching "{searchQuery}"
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99]"
              >
                {/* Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}
                  >
                    {getAppIcon(app.icon, 'w-6 h-6')}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {app.name}
                    </h3>
                    <p className="text-xs text-white/60 truncate max-w-[180px]">
                      {app.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> {app.rating}
                      </span>
                      <span>·</span>
                      <span>{app.downloadSize}</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div onClick={(e) => e.stopPropagation()}>
                  {installingId === app.id ? (
                    <div className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-medium flex items-center gap-1.5 animate-pulse">
                      <div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                      <span>Installing</span>
                    </div>
                  ) : app.isInstalled ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openApp(app.id)}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all"
                      >
                        Open
                      </button>
                      {!app.isPreinstalled && (
                        <button
                          onClick={() => uninstallApp(app.id)}
                          className="p-1.5 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Uninstall"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInstall(app.id)}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Get</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* App Details Modal Overlay */}
      {selectedApp && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-2xl flex flex-col p-5 overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button
              onClick={() => setSelectedApp(null)}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </button>
            <span className="text-xs text-white/40">Details</span>
          </div>

          {/* App Hero */}
          <div className="flex items-center gap-4 py-5">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedApp.gradient} flex items-center justify-center text-white shadow-xl flex-shrink-0`}
            >
              {getAppIcon(selectedApp.icon, 'w-8 h-8')}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white">{selectedApp.name}</h2>
              <p className="text-xs text-sky-300 capitalize">{selectedApp.category} App</p>
              <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" /> {selectedApp.rating}
                </span>
                <span>·</span>
                <span>{selectedApp.reviewsCount.toLocaleString()} ratings</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="py-2 flex items-center gap-2">
            {installingId === selectedApp.id ? (
              <div className="flex-1 py-2.5 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-medium flex items-center justify-center gap-2 animate-pulse">
                <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span>Downloading & Installing...</span>
              </div>
            ) : selectedApp.isInstalled ? (
              <div className="flex-1 flex gap-2">
                <button
                  onClick={() => openApp(selectedApp.id)}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all"
                >
                  Open App
                </button>
                {!selectedApp.isPreinstalled && (
                  <button
                    onClick={() => {
                      uninstallApp(selectedApp.id);
                      setSelectedApp({ ...selectedApp, isInstalled: false });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold transition-all"
                  >
                    Uninstall
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleInstall(selectedApp.id)}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Download className="w-4 h-4" /> Install Application
              </button>
            )}
          </div>

          {/* Meta specs */}
          <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
            <div>
              <p className="text-[10px] text-white/40 uppercase">Size</p>
              <p className="text-xs font-semibold text-white mt-0.5">
                {selectedApp.downloadSize}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase">Version</p>
              <p className="text-xs font-semibold text-white mt-0.5">
                {selectedApp.version}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase">Compatibility</p>
              <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                TestOS 1
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 mt-2">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              About this app
            </h3>
            <p className="text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
              {selectedApp.description}
            </p>
          </div>

          {/* Verification Badge */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Verified safe for TestOS sandbox runtime environment.</span>
          </div>
        </div>
      )}
    </div>
  );
};
