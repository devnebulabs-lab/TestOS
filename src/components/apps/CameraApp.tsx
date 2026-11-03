import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Camera, SwitchCamera, Sparkles, Image, Zap, RefreshCw } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const CameraApp: React.FC = () => {
  const { openApp } = useOS();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebcam, setHasWebcam] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'cyber' | 'noir' | 'retro' | 'warm'>('normal');
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [recentSnap, setRecentSnap] = useState<string | null>(null);

  // Attempt webcam initialization
  useEffect(() => {
    let stream: MediaStream | null = null;
    const initCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasWebcam(true);
          }
        }
      } catch {
        // Fallback to simulated high-res viewfinder
        setHasWebcam(false);
      }
    };
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const filterStyles = {
    normal: '',
    cyber: 'hue-rotate-90 saturate-200 contrast-125',
    noir: 'grayscale contrast-150',
    retro: 'sepia contrast-110 brightness-95',
    warm: 'sepia-[0.35] saturate-150 brightness-105',
  };

  const handleCapture = () => {
    sounds.shutter();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);

    let photoUrl = '';

    if (hasWebcam && videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoUrl = canvas.toDataURL('image/jpeg');
      }
    } else {
      // Capture simulated scene
      const samplePhotos = [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      ];
      photoUrl = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    }

    if (photoUrl) {
      setRecentSnap(photoUrl);
      try {
        const saved = localStorage.getItem('testos_photos');
        const list = saved ? JSON.parse(saved) : [];
        const newPhoto = {
          id: `snap-${Date.now()}`,
          url: photoUrl,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          caption: `Filter: ${activeFilter.toUpperCase()}`,
        };
        localStorage.setItem('testos_photos', JSON.stringify([newPhoto, ...list]));
      } catch {}
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black text-white select-none overflow-hidden relative">
      {/* Shutter Flash */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-150" />
      )}

      {/* Top Controls */}
      <div className="h-12 px-6 flex items-center justify-between text-xs text-white/80 z-10 bg-black/40 backdrop-blur-md">
        <span className="font-mono text-amber-400 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> AUTO FLASH
        </span>
        <span className="font-semibold tracking-wider text-[11px] uppercase">
          4K HDR · 60 FPS
        </span>
        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
          {hasWebcam ? 'LIVE SENSOR' : 'SIMULATOR'}
        </span>
      </div>

      {/* Viewfinder Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
        {hasWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-all ${filterStyles[activeFilter]}`}
          />
        ) : (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80"
              alt="Viewfinder simulation"
              className={`w-full h-full object-cover transition-all duration-300 ${filterStyles[activeFilter]}`}
            />
            {/* Viewfinder Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-amber-400/80 animate-ping opacity-60" />
              </div>
              <div className="border-b border-white/15" />
              <div className="border-r border-white/15" />
              <div className="border-r border-white/15" />
              <div />
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Filter Switcher Carousel */}
      <div className="py-2.5 bg-black/60 backdrop-blur-md flex items-center justify-center gap-2 overflow-x-auto no-scrollbar z-10">
        {(['normal', 'cyber', 'noir', 'retro', 'warm'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => {
              sounds.click();
              setActiveFilter(filter);
            }}
            className={`px-3 py-1 rounded-full text-xs capitalize transition-all ${
              activeFilter === filter
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-white/60 hover:text-white bg-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Shutter Bar */}
      <div className="h-24 px-8 bg-black/90 flex items-center justify-between z-10 border-t border-white/10">
        {/* Gallery shortcut thumbnail */}
        <button
          onClick={() => openApp('gallery')}
          className="w-12 h-12 rounded-2xl overflow-hidden border border-white/30 bg-slate-800 flex items-center justify-center hover:scale-105 transition-transform"
          title="Open Photos"
        >
          {recentSnap ? (
            <img src={recentSnap} alt="Thumbnail" className="w-full h-full object-cover" />
          ) : (
            <Image className="w-5 h-5 text-white/60" />
          )}
        </button>

        {/* Shutter Button */}
        <button
          onClick={handleCapture}
          className="w-18 h-18 rounded-full border-4 border-white p-1 hover:scale-105 active:scale-90 transition-all flex items-center justify-center shadow-2xl"
          title="Take Photo"
        >
          <div className="w-full h-full rounded-full bg-white hover:bg-slate-200 transition-colors shadow-inner" />
        </button>

        {/* Camera Switch / Reset */}
        <button
          onClick={() => {
            sounds.click();
            setActiveFilter('normal');
          }}
          className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 active:scale-95 transition-all"
          title="Reset filter"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
