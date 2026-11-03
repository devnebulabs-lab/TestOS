import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Sparkles, ArrowRight, ArrowLeft, Check, Smartphone, Navigation, MapPin, Image } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const WelcomeWizard: React.FC = () => {
  const { bootState, completeWelcomeWizard, wallpapers, refreshLocation } = useOS();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('Alex');
  const [selectedWallpaper, setSelectedWallpaper] = useState('aurora-dream');
  const [navMode, setNavMode] = useState<'3-button' | 'gestures'>('3-button');
  const [enableLocation, setEnableLocation] = useState(true);

  if (bootState !== 'welcome') return null;

  const handleNext = () => {
    sounds.click();
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (enableLocation) {
        refreshLocation();
      }
      completeWelcomeWizard(username, selectedWallpaper, navMode);
    }
  };

  const handlePrev = () => {
    sounds.click();
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl text-white flex flex-col justify-between p-6 select-none font-sans overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 right-10 w-72 h-72 bg-sky-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
            T
          </div>
          <span className="text-xs font-bold tracking-tight">TestOS 1 Setup</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-6 bg-sky-400' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Step Content */}
      <div className="flex-1 flex flex-col justify-center my-auto max-w-sm mx-auto w-full z-10 py-4">
        {/* STEP 1: Welcome & Name */}
        {step === 1 && (
          <div className="space-y-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-2xl shadow-sky-500/25">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Welcome to TestOS 1
              </h1>
              <p className="text-xs text-white/60 mt-1">
                Your modern mobile operating system in the cloud
              </p>
            </div>

            <div className="text-left space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-white/70">What should we call you?</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/10 border border-white/15 focus:border-sky-400 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none transition-all font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Wallpaper Picker */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Image className="w-5 h-5 text-sky-400" /> Choose Your Wallpaper
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Select from dynamic mesh gradients or scenic photography
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto no-scrollbar pr-1 pt-1">
              {wallpapers.slice(0, 6).map((wp) => {
                const isSelected = selectedWallpaper === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => {
                      sounds.click();
                      setSelectedWallpaper(wp.id);
                    }}
                    className={`aspect-video rounded-2xl p-2.5 flex flex-col justify-end cursor-pointer border-2 transition-all relative overflow-hidden group shadow-md ${
                      isSelected
                        ? 'border-sky-400 ring-2 ring-sky-400/40 scale-102'
                        : 'border-white/15 hover:border-white/30'
                    }`}
                    style={{ background: wp.value, backgroundSize: 'cover' }}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white drop-shadow truncate">
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

        {/* STEP 3: Navigation Mode */}
        {step === 3 && (
          <div className="space-y-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5 text-sky-400" /> Navigation Style
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Choose how you want to move between apps
              </p>
            </div>

            <div className="space-y-3 pt-2 text-left">
              {/* Option A: 3-Button */}
              <div
                onClick={() => {
                  sounds.click();
                  setNavMode('3-button');
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  navMode === '3-button'
                    ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-sky-300">
                      ◀ ⚪ ▢
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Classic 3-Button Bar</h4>
                      <p className="text-[11px] text-white/50">
                        Dedicated Back, Home, and Recents buttons
                      </p>
                    </div>
                  </div>
                  {navMode === '3-button' && (
                    <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Option B: Gestures */}
              <div
                onClick={() => {
                  sounds.click();
                  setNavMode('gestures');
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  navMode === 'gestures'
                    ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <div className="w-6 h-1 bg-white/80 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Gesture Navigation</h4>
                      <p className="text-[11px] text-white/50">
                        Minimalist swipe pill navigation
                      </p>
                    </div>
                  </div>
                  {navMode === 'gestures' && (
                    <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Real Location */}
        {step === 4 && (
          <div className="space-y-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Geolocation</h2>
              <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto">
                TestOS can connect to your browser's real GPS sensor to display live weather forecasts and local radar for your exact location.
              </p>
            </div>

            <div
              onClick={() => {
                sounds.click();
                setEnableLocation(!enableLocation);
              }}
              className="p-4 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-between cursor-pointer hover:bg-white/10 text-left"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Enable Real Location</h4>
                  <p className="text-[10px] text-white/50">Fetch real city temperature & radar</p>
                </div>
              </div>
              <div
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  enableLocation ? 'bg-emerald-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    enableLocation ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
        >
          <span>{step === 4 ? 'Complete Setup & Launch' : 'Continue'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
