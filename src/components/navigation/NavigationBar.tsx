import React from 'react';
import { useOS } from '../../context/OSContext';

export const NavigationBar: React.FC = () => {
  const { settings, handleBackAction, closeCurrentApp, toggleRecents, isRecentsOpen } = useOS();

  if (settings.navigationMode === 'gestures') {
    return (
      <nav aria-label="Gesture navigation" className="h-6 w-full flex items-center justify-center relative z-40 select-none pb-1">
        <button
          onClick={closeCurrentApp}
          className="w-32 h-1 bg-white/40 hover:bg-white/60 active:scale-95 transition-all rounded-full shadow-sm"
          title="Swipe up for Home"
          aria-label="Home"
        />
      </nav>
    );
  }

  return (
    <nav aria-label="System navigation" className="h-11 w-full flex items-center justify-around px-8 relative z-40 select-none bg-black/25 backdrop-blur-md border-t border-white/10 transition-colors">
      {/* 1. BACK BUTTON */}
      <button
        onClick={handleBackAction}
        className="w-12 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white active:bg-white/15 active:scale-90 transition-all duration-150 focus:outline-none"
        title="Back"
        aria-label="Back button"
      >
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* 2. HOME BUTTON */}
      <button
        onClick={closeCurrentApp}
        className="w-12 h-9 flex items-center justify-center rounded-xl text-white/80 hover:text-white active:bg-white/15 active:scale-90 transition-all duration-150 focus:outline-none"
        title="Home"
        aria-label="Home button"
      >
        <div className="w-4 h-4 rounded-full border-2 border-current shadow-sm hover:scale-105 transition-transform" />
      </button>

      {/* 3. APP SWITCHER / RECENTS BUTTON */}
      <button
        onClick={() => toggleRecents()}
        className={`w-12 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white active:bg-white/15 active:scale-90 transition-all duration-150 focus:outline-none ${
          isRecentsOpen ? 'text-sky-400 font-bold' : ''
        }`}
        title="Recent Apps Overview"
        aria-label="Recent apps switcher"
      >
        <div
          className={`w-4 h-4 rounded-sm border-2 border-current transition-transform ${
            isRecentsOpen ? 'scale-110 bg-sky-400/30' : ''
          }`}
        />
      </button>
    </nav>
  );
};
