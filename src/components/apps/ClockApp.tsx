import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { Play, Pause, RotateCcw, Flag, Globe, Timer, Watch } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const ClockApp: React.FC = () => {
  const [tab, setTab] = useState<'stopwatch' | 'timer' | 'world'>('stopwatch');

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer state
  const [timerDuration, setTimerDuration] = useState(60); // 60s
  const [timerRemaining, setTimerRemaining] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Stopwatch effect
  useEffect(() => {
    if (swRunning) {
      swIntervalRef.current = setInterval(() => {
        setSwTime((prev) => prev + 10);
      }, 10);
    } else if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current);
    }
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    };
  }, [swRunning]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            sounds.notification();
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining]);

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    sounds.click();
    setLaps([swTime, ...laps]);
  };

  const resetStopwatch = () => {
    sounds.haptic();
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none p-5 justify-between">
      {/* Top Tabs */}
      <div className="flex items-center justify-around bg-white/5 p-1 rounded-2xl border border-white/10">
        <button
          onClick={() => setTab('stopwatch')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'stopwatch' ? 'bg-sky-500 text-white shadow' : 'text-white/60 hover:text-white'
          }`}
        >
          <Watch className="w-3.5 h-3.5" /> Stopwatch
        </button>
        <button
          onClick={() => setTab('timer')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'timer' ? 'bg-sky-500 text-white shadow' : 'text-white/60 hover:text-white'
          }`}
        >
          <Timer className="w-3.5 h-3.5" /> Timer
        </button>
        <button
          onClick={() => setTab('world')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'world' ? 'bg-sky-500 text-white shadow' : 'text-white/60 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> World
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        {tab === 'stopwatch' && (
          <div className="w-full flex-1 flex flex-col items-center justify-between">
            <div className="my-auto text-5xl font-extralight font-mono tracking-tight text-white">
              {formatStopwatch(swTime)}
            </div>

            {/* Laps List */}
            <div className="w-full max-h-36 overflow-y-auto space-y-1.5 my-4 px-2 no-scrollbar">
              {laps.map((lap, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 border-b border-white/5 font-mono"
                >
                  <span className="text-white/40">Lap {laps.length - idx}</span>
                  <span className="text-white font-medium">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 w-full">
              <button
                onClick={resetStopwatch}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {swRunning && (
                <button
                  onClick={handleLap}
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-sky-400 flex items-center justify-center transition-all"
                  title="Lap"
                >
                  <Flag className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => {
                  sounds.click();
                  setSwRunning(!swRunning);
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-95 shadow-xl transition-all ${
                  swRunning
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {swRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </div>
          </div>
        )}

        {tab === 'timer' && (
          <div className="w-full flex-1 flex flex-col items-center justify-between">
            <div className="my-auto flex flex-col items-center">
              <div className="text-5xl font-extralight font-mono text-white mb-2">
                {Math.floor(timerRemaining / 60)}:
                {(timerRemaining % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-xs text-sky-400">
                {timerRemaining === 0 ? 'Time Up! 🔔' : 'Focus Timer'}
              </p>
            </div>

            {/* Preset duration buttons */}
            <div className="flex items-center gap-2 mb-6">
              {[30, 60, 300, 900].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    sounds.click();
                    setTimerDuration(sec);
                    setTimerRemaining(sec);
                    setTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    timerDuration === sec
                      ? 'bg-sky-500 text-white font-bold'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => {
                  sounds.haptic();
                  setTimerRemaining(timerDuration);
                  setTimerRunning(false);
                }}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  sounds.click();
                  setTimerRunning(!timerRunning);
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-95 shadow-xl transition-all ${
                  timerRunning
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {timerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </div>
          </div>
        )}

        {tab === 'world' && (
          <div className="w-full flex-1 flex flex-col justify-start space-y-3 pt-2">
            {[
              { city: 'San Francisco', time: '10:42 AM', offset: 'Local Time', code: 'PST' },
              { city: 'New York', time: '1:42 PM', offset: '+3 hrs', code: 'EST' },
              { city: 'London', time: '6:42 PM', offset: '+8 hrs', code: 'GMT' },
              { city: 'Tokyo', time: '3:42 AM (+1)', offset: '+17 hrs', code: 'JST' },
            ].map((item) => (
              <div
                key={item.city}
                className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{item.city}</h3>
                  <span className="text-[11px] text-white/40">{item.offset}</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold font-mono text-white">{item.time}</div>
                  <span className="text-[10px] text-sky-400 font-mono">{item.code}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
