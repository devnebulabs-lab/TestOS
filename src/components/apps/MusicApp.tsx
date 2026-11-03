import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc, Repeat, Heart } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  baseFreq: number;
}

const TRACKS: Track[] = [
  {
    id: 't1',
    title: 'Clouded Horizon',
    artist: 'TestOS Ambient Labs',
    duration: '3:24',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    baseFreq: 220, // A3
  },
  {
    id: 't2',
    title: 'Neon Cyber Skyline',
    artist: 'SynthWave Architect',
    duration: '2:56',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
    baseFreq: 330, // E4
  },
  {
    id: 't3',
    title: 'Midnight Rain Lofi',
    artist: 'Chilled Byte',
    duration: '4:10',
    cover: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300&auto=format&fit=crop&q=80',
    baseFreq: 174.6, // F3
  },
];

export const MusicApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(15);
  const [isLiked, setIsLiked] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Update progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const startAudio = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      stopAudio();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Gentle pulsating ambient tremolo
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(2, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(15, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch {}
  };

  const stopAudio = () => {
    try {
      if (gainRef.current && audioContextRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContextRef.current.currentTime + 0.2
        );
        setTimeout(() => {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          oscRef.current = null;
        }, 220);
      }
    } catch {}
  };

  const togglePlay = () => {
    sounds.click();
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(currentTrack.baseFreq);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    sounds.click();
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    setProgress(0);
    if (isPlaying) {
      startAudio(TRACKS[nextIdx].baseFreq);
    }
  };

  const prevTrack = () => {
    sounds.click();
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    setProgress(0);
    if (isPlaying) {
      startAudio(TRACKS[prevIdx].baseFreq);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white select-none p-5 overflow-hidden justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
          Groove Music
        </span>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-1.5 rounded-full transition-colors ${
            isLiked ? 'text-rose-400' : 'text-white/40 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
        </button>
      </div>

      {/* Album Art & Visualizer */}
      <div className="flex flex-col items-center my-auto">
        <div className="relative group">
          <div
            className={`w-48 h-48 rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <Disc
                className={`w-12 h-12 text-white/80 ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '6s' }}
              />
            </div>
          </div>
        </div>

        {/* Track Title */}
        <div className="text-center mt-5">
          <h2 className="text-base font-bold text-white tracking-tight">{currentTrack.title}</h2>
          <p className="text-xs text-sky-300/80 mt-0.5">{currentTrack.artist}</p>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex items-end justify-center gap-1.5 h-8 mt-4">
          {[40, 70, 95, 60, 85, 45, 100, 75, 55, 90, 65, 50].map((height, i) => (
            <div
              key={i}
              className={`w-1 bg-gradient-to-t from-sky-500 to-indigo-400 rounded-full transition-all duration-200 ${
                isPlaying ? 'opacity-90' : 'opacity-25 h-1.5!'
              }`}
              style={{
                height: isPlaying ? `${Math.max(15, (height * (progress % 5 + 1)) / 4)}%` : '6px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrubber & Controls */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden cursor-pointer">
            <div
              className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/50 font-mono">
            <span>0:{progress < 10 ? `0${progress}` : progress}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prevTrack}
            className="p-2 text-white/70 hover:text-white transition-colors active:scale-90"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-90 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-white/70 hover:text-white transition-colors active:scale-90"
            title="Next track"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
