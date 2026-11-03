import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const GameApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('testos_game_highscore') || '0');
    } catch {
      return 0;
    }
  });

  const playerRef = useRef({ x: 150, y: 380, width: 28, height: 36, speed: 7 });
  const asteroidsRef = useRef<{ x: number; y: number; radius: number; speed: number }[]>([]);
  const crystalsRef = useRef<{ x: number; y: number; radius: number; speed: number }[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    sounds.click();
    setScore(0);
    setGameState('playing');
    playerRef.current.x = 150;
    asteroidsRef.current = [];
    crystalsRef.current = [];
  };

  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = 0;
    let spawnTimer = 0;

    const gameLoop = () => {
      // 1. Clear background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw faint stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 37 + (localScore * 2)) % canvas.width;
        const sy = (i * 61 + (localScore * 3)) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // 2. Move player
      const player = playerRef.current;
      if (keysRef.current.left && player.x > 15) player.x -= player.speed;
      if (keysRef.current.right && player.x < canvas.width - player.width - 15)
        player.x += player.speed;

      // Draw player spaceship
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

      // Rocket flame
      ctx.fillStyle = localScore % 2 === 0 ? '#f97316' : '#eab308';
      ctx.beginPath();
      ctx.moveTo(-6, player.height / 2);
      ctx.lineTo(6, player.height / 2);
      ctx.lineTo(0, player.height / 2 + 10);
      ctx.closePath();
      ctx.fill();

      // Spaceship body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -player.height / 2);
      ctx.lineTo(player.width / 2, player.height / 2);
      ctx.lineTo(-player.width / 2, player.height / 2);
      ctx.closePath();
      ctx.fill();

      // Cockpit glow
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Spawn obstacles and crystals
      spawnTimer++;
      if (spawnTimer % 35 === 0) {
        asteroidsRef.current.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          radius: Math.random() * 8 + 12,
          speed: Math.random() * 2 + 3.5,
        });
      }
      if (spawnTimer % 60 === 0) {
        crystalsRef.current.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          radius: 9,
          speed: 3,
        });
      }

      // 4. Update and draw asteroids
      for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
        const ast = asteroidsRef.current[i];
        ast.y += ast.speed;

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner darker core
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.arc(ast.x - 2, ast.y - 2, ast.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Collision check with player
        const dx = ast.x - (player.x + player.width / 2);
        const dy = ast.y - (player.y + player.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ast.radius + player.width / 2) {
          // Game over!
          sounds.haptic();
          setGameState('gameover');
          setScore(localScore);
          if (localScore > highScore) {
            setHighScore(localScore);
            try {
              localStorage.setItem('testos_game_highscore', localScore.toString());
            } catch {}
          }
          return;
        }

        // Cleanup offscreen
        if (ast.y > canvas.height + 30) {
          asteroidsRef.current.splice(i, 1);
          localScore += 5;
          setScore(localScore);
        }
      }

      // 5. Update and draw crystals
      for (let i = crystalsRef.current.length - 1; i >= 0; i--) {
        const cry = crystalsRef.current[i];
        cry.y += cry.speed;

        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(cry.x, cry.y, cry.radius, 0, Math.PI * 2);
        ctx.fill();

        // Collision with player
        const dx = cry.x - (player.x + player.width / 2);
        const dy = cry.y - (player.y + player.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < cry.radius + player.width / 2) {
          sounds.click();
          crystalsRef.current.splice(i, 1);
          localScore += 25;
          setScore(localScore);
          continue;
        }

        if (cry.y > canvas.height + 20) {
          crystalsRef.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, highScore]);

  // Touch/Button controls for mobile
  const handleSteer = (dir: 'left' | 'right') => {
    const player = playerRef.current;
    if (dir === 'left' && player.x > 20) player.x -= 24;
    if (dir === 'right' && player.x < 300 - player.width - 20) player.x += 24;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none overflow-hidden relative justify-between">
      {/* Top Header */}
      <div className="h-12 px-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 text-xs text-sky-400 font-bold">
          <Sparkles className="w-4 h-4" /> Galaxy Runner
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-white/60">
            Score: <strong className="text-white">{score}</strong>
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> {highScore}
          </span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={320}
          height={420}
          className="border border-white/10 rounded-2xl shadow-2xl"
        />

        {/* Start / Menu Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Galaxy Runner</h2>
              <p className="text-xs text-white/60 max-w-xs mt-1">
                Dodge cosmic asteroids & collect emerald quantum crystals!
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all active:scale-95"
            >
              Start Mission
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <h2 className="text-2xl font-black text-rose-400">Mission Terminated</h2>
            <p className="text-xs text-white/60">Spaceship collided with deep-space asteroid</p>
            <div className="p-3 bg-white/10 rounded-xl border border-white/15 font-mono text-sm">
              Final Score: <span className="text-sky-300 font-bold">{score}</span>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Bottom On-Screen Touch Controls */}
      <div className="h-16 px-6 bg-slate-900/90 border-t border-white/10 flex items-center justify-between z-10">
        <button
          onClick={() => handleSteer('left')}
          className="w-24 h-11 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-lg font-bold flex items-center justify-center transition-all"
        >
          ◀ Left
        </button>
        <span className="text-[10px] text-white/40">Use Buttons or A/D keys</span>
        <button
          onClick={() => handleSteer('right')}
          className="w-24 h-11 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-lg font-bold flex items-center justify-center transition-all"
        >
          Right ▶
        </button>
      </div>
    </div>
  );
};
