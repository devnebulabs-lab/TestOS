import React from 'react';
import { useOS } from '../../context/OSContext';
import { StatusBar } from './StatusBar';
import { NavigationBar } from '../navigation/NavigationBar';
import { ControlCenter } from './ControlCenter';
import { RecentsSwitcher } from './RecentsSwitcher';
import { LockScreen } from './LockScreen';
import { PowerMenu } from './PowerMenu';
import { BootScreen } from './BootScreen';
import { WelcomeWizard } from './WelcomeWizard';
import { HomeScreen } from '../home/HomeScreen';
import { AppDrawer } from '../home/AppDrawer';
import { AppWindow } from './AppWindow';
import { Power } from 'lucide-react';

export const DeviceContainer: React.FC = () => {
  const {
    bootState,
    powerOnSystem,
    currentWallpaper,
  } = useOS();

  // 1. If System is Powered Off
  if (bootState === 'power_off') {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <button
          onClick={powerOnSystem}
          className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex flex-col items-center justify-center gap-1 text-white/70 hover:text-white transition-all shadow-2xl active:scale-95 group"
        >
          <Power className="w-8 h-8 group-hover:scale-110 transition-transform text-sky-400" />
        </button>
        <p className="text-xs text-white/40 mt-4 font-mono">Press Power to Turn On TestOS</p>
      </div>
    );
  }

  // 2. Automatic Fullscreen Edge-to-Edge Adaptive Mobile OS
  return (
    <div className="w-full h-screen relative overflow-hidden select-none font-sans bg-black">
      {/* Dynamic Background Wallpaper */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: currentWallpaper.value,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Subtle Specular Sheen */}
      <div className="absolute inset-0 pointer-events-none device-sheen opacity-20 z-10" />

      {/* OS Core Layout Container */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between overflow-hidden">
        {/* Top Status Bar (Click to open Control Center) */}
        <StatusBar />

        {/* Main Viewport Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Home Screen (Widgets, Dock, App Grid) */}
          <HomeScreen />

          {/* Running Active App Window */}
          <AppWindow />

          {/* App Drawer (Swipe up from bottom or tap drawer icon) */}
          <AppDrawer />

          {/* Multitasking Recents 3D Carousel Switcher */}
          <RecentsSwitcher />

          {/* Control Center & Notifications (Swipe/click top) */}
          <ControlCenter />

          {/* Lock Screen */}
          <LockScreen />

          {/* System Power Menu (Power off, Restart, Sleep) */}
          <PowerMenu />
        </main>

        {/* 3-Button Navigation Bar (Back, Home, Recents) */}
        <NavigationBar />
      </div>

      {/* Boot Screen & Boot Options Overlay */}
      {(bootState === 'booting' || bootState === 'boot_options') && <BootScreen />}

      {/* Welcome Setup Wizard Overlay (First boot or after factory reset) */}
      {bootState === 'welcome' && <WelcomeWizard />}
    </div>
  );
};
