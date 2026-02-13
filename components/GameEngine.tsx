
import React, { useEffect, useRef } from 'react';
import { LevelConfig, WaveType, Player, Obstacle, ObstacleType, GameMode } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, WAVE_ANGLES, COLORS } from '../constants';
import { mulberry32, generateId } from '../utils';
import { 
  playJumpSound, 
  playPortalSound, 
  playCrashSound, 
  playModeSound, 
  playCheckpointSound,
  startMusic,
  stopMusic
} from '../audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface GameEngineProps {
  level: LevelConfig;
  seed: number;
  waveType: WaveType;
  autoclicker: boolean;
  autoclickerCPS: number;
  practiceMode: boolean;
  perfMode: 'none' | 'basic' | 'full';
  isMusicEnabled: boolean;
  onGameOver: (win: boolean, distance: number, totalLen: number, finalSkillScore?: number) => void;
  onUpdateProgress: (distance: number, totalLen: number, currentSkillScore?: number) => void;
  onCheckpointChange: (count: number) => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ 
  level, seed, waveType, autoclicker, autoclickerCPS, practiceMode, perfMode, isMusicEnabled, onGameOver, onUpdateProgress, onCheckpointChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastBotActionTime = useRef<number>(0);
  
  const gameStateRef = useRef({
    playing: true,
    distance: 0,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    stars: Array.from({ length: 60 }, () => ({ x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT, s: Math.random() * 2 })),
    shake: 0,
    rand: mulberry32(level.id + seed),
    botTargetY: CANVAS_HEIGHT / 2,
    checkpoints: [] as any[],
    flashEffect: 0,
    lastGeneratedWorldX: 400,
    lastWallHeight: CANVAS_HEIGHT / 2 - level.gap / 2,
    skillPenalty: 0,
    isCurrentlyColliding: false
  });

  const playerRef = useRef<Player>({
    x: 150,
    y: CANVAS_HEIGHT / 2,
    vy: 0,
    size: 10,
    angle: 0,
    isHolding: false,
    gravityInverted: false,
    speedMultiplier: 1.0,
    isMini: false,
    mode: level.startingMode || 'WAVE',
    trail: []
  });

  const keysRef = useRef<Set<string>>(new Set());

  const spawnParticles = (x: number, y: number, color: string, count: number, speed: number = 200) => {
    const state = gameStateRef.current;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const s = Math.random() * speed;
      state.particles.push({
        x, y, vx: Math.cos(ang) * s, vy: Math.sin(ang) * s,
        life: 1, maxLife: 0.4 + Math.random() * 0.4,
        color, size: 1 + Math.random() * 3
      });
    }
  };

  const generateSegment = () => {
    const state = gameStateRef.current;
    const { obsFreq, gap } = level;
    const nextWorldX = state.lastGeneratedWorldX + obsFreq;
    state.lastGeneratedWorldX = nextWorldX;
    const prevY = state.lastWallHeight;
    const margin = 50;
    const maxH = CANVAS_HEIGHT - margin - gap;
    const minH = margin;
    let newGapTop = prevY;

    if (level.isSkillTest) {
      if (playerRef.current.mode === 'UFO') {
        newGapTop = 150 + state.rand() * (CANVAS_HEIGHT - 350 - gap);
        state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: 0, w: 90, h: newGapTop, x: 0 });
        state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: newGapTop + gap, w: 90, h: CANVAS_HEIGHT, x: 0 });
        state.obstacles.push({ id: generateId(), type: ObstacleType.SPIKE, worldX: nextWorldX - 50, y: newGapTop + gap, w: 45, h: 45, x: 0, data: { dir: 'up' } });
      } else if (playerRef.current.mode === 'SHIP') {
        const shipGap = 100;
        const change = (state.rand() - 0.5) * 90;
        newGapTop = Math.max(minH, Math.min(CANVAS_HEIGHT - margin - shipGap, prevY + change));
        state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: 0, w: 220, h: newGapTop, x: 0 });
        state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: newGapTop + shipGap, w: 220, h: CANVAS_HEIGHT, x: 0 });
      } else {
        const change = (state.rand() - 0.5) * 450;
        newGapTop = Math.max(minH, Math.min(maxH, prevY + change));
        state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: 0, w: 60, h: newGapTop, x: 0 });
        state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: newGapTop + gap, w: 60, h: CANVAS_HEIGHT, x: 0 });
        state.obstacles.push({ id: generateId(), type: ObstacleType.SPIKE, worldX: nextWorldX, y: state.rand() > 0.5 ? newGapTop : newGapTop + gap, w: 40, h: 40, x: 0, data: { dir: state.rand() > 0.5 ? 'down' : 'up' } });
      }
    } else {
      const angle = WAVE_ANGLES[waveType as keyof typeof WAVE_ANGLES];
      const direction = state.rand() > 0.5 ? 1 : -1;
      let change = (60 + state.rand() * 320) * direction;
      newGapTop = Math.max(minH, Math.min(maxH, prevY + change));
      state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: 0, w: 55, h: newGapTop, x: 0 });
      state.obstacles.push({ id: generateId(), type: ObstacleType.WALL, worldX: nextWorldX, y: newGapTop + gap, w: 55, h: CANVAS_HEIGHT, x: 0 });
      
      const middleX = nextWorldX + obsFreq / 2;
      if (state.rand() < 0.12) {
        state.obstacles.push({ id: generateId(), type: ObstacleType.PORTAL_GRAVITY, worldX: middleX, y: newGapTop, w: 65, h: gap, x: 0 });
      }
    }
    state.lastWallHeight = newGapTop;
  };

  const handleAction = () => {
    const p = playerRef.current;
    if (p.mode === 'UFO' && gameStateRef.current.playing) {
      p.vy = p.gravityInverted ? 650 : -650;
      playJumpSound();
      spawnParticles(p.x, p.y, level.color, 8, 120);
    }
  };

  const updateBotLogic = (now: number) => {
    const p = playerRef.current;
    const state = gameStateRef.current;
    const clickInterval = 1000 / autoclickerCPS;

    // Solo recalcular si ha pasado el tiempo de CPS
    if (now - lastBotActionTime.current < clickInterval) return;

    // Buscar el obstáculo más cercano por delante
    const upcoming = state.obstacles
      .filter(o => o.worldX + o.w > state.distance && o.type === ObstacleType.WALL)
      .sort((a, b) => a.worldX - b.worldX);

    let targetY = CANVAS_HEIGHT / 2;
    if (upcoming.length > 0) {
      // Encontrar el hueco entre los muros superior e inferior
      const nextX = upcoming[0].worldX;
      const wallsAtX = upcoming.filter(o => o.worldX === nextX);
      if (wallsAtX.length >= 2) {
        const topWall = wallsAtX.find(o => o.y === 0);
        const bottomWall = wallsAtX.find(o => o.y > 0);
        if (topWall && bottomWall) {
          targetY = topWall.h + (bottomWall.y - topWall.h) / 2;
        }
      } else if (wallsAtX.length === 1) {
        const wall = wallsAtX[0];
        targetY = wall.y === 0 ? wall.h + 100 : wall.y - 100;
      }
    }

    state.botTargetY = targetY;

    if (p.mode === 'WAVE') {
      const threshold = p.gravityInverted ? -4 : 4;
      const diff = p.y - targetY;
      p.isHolding = p.gravityInverted ? diff < threshold : diff > threshold;
    } else if (p.mode === 'SHIP') {
      const diff = p.y - targetY;
      // El bot del Ship necesita un poco más de margen para no oscilar violentamente
      p.isHolding = p.gravityInverted ? diff < -10 : diff > 10;
    } else if (p.mode === 'UFO') {
      const distToTarget = Math.abs(p.y - targetY);
      const isBelow = p.gravityInverted ? (p.y < targetY - 20) : (p.y > targetY + 20);
      const isFallingFast = p.gravityInverted ? (p.vy < -200) : (p.vy > 200);
      
      if (isBelow || isFallingFast || distToTarget > 60) {
        handleAction();
      }
    }
    
    lastBotActionTime.current = now;
  };

  const update = (dt: number) => {
    if (!gameStateRef.current.playing) return;
    const p = playerRef.current;
    const state = gameStateRef.current;
    const now = performance.now();

    if (state.flashEffect > 0) state.flashEffect -= dt * 2;

    // AI / Bot Update
    if (autoclicker) {
      updateBotLogic(now);
    }

    // Control Check (Keys & Bot State)
    const isActive = keysRef.current.has('Space') || keysRef.current.has('ArrowUp') || keysRef.current.has('KeyW') || p.isHolding;

    const currentSpeed = level.speed * p.speedMultiplier;
    const angle = WAVE_ANGLES[waveType as keyof typeof WAVE_ANGLES];

    if (p.mode === 'WAVE') {
      const moveUp = p.gravityInverted ? !isActive : isActive;
      p.y += moveUp ? -currentSpeed * Math.tan(angle * (Math.PI / 180)) * dt : currentSpeed * Math.tan(angle * (Math.PI / 180)) * dt;
      p.angle = moveUp ? -angle * (Math.PI / 180) : angle * (Math.PI / 180);
    } else {
      const gravity = (p.mode === 'SHIP' ? 2000 : 2400) * (p.gravityInverted ? -1 : 1);
      const thrust = (p.mode === 'SHIP' ? 4400 : 0) * (p.gravityInverted ? -1 : 1);
      p.vy += gravity * dt;
      if (isActive && p.mode === 'SHIP') p.vy -= thrust * dt;
      p.vy = Math.max(-1000, Math.min(1000, p.vy));
      p.y += p.vy * dt;
      p.angle = (p.vy / 1000) * (Math.PI / 4);
    }

    state.distance += currentSpeed * dt;
    p.trail.push({ x: p.x, y: p.y, distance: state.distance });
    if (p.trail.length > 80) p.trail.shift();

    if (state.playing && Math.random() < 0.3) {
      spawnParticles(p.x - 10, p.y, level.color, 1, 50);
    }

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const part = state.particles[i];
      part.x += part.vx * dt; part.y += part.vy * dt; part.life -= dt;
      if (part.life <= 0) state.particles.splice(i, 1);
    }

    if (state.lastGeneratedWorldX < state.distance + CANVAS_WIDTH + 600) generateSegment();

    const isOutOfBounds = p.y < 0 || p.y > CANVAS_HEIGHT;
    const hittingObstacle = checkCollisions(p, state);
    state.isCurrentlyColliding = hittingObstacle;

    if (isOutOfBounds || (hittingObstacle && !level.isSkillTest)) {
      state.playing = false; state.shake = 40;
      spawnParticles(p.x, p.y, '#ffffff', 40, 500);
      playCrashSound(); stopMusic();
      onGameOver(false, state.distance, level.length, level.isSkillTest ? Math.max(0, 100 - state.skillPenalty) : undefined);
    } else if (hittingObstacle && level.isSkillTest) {
      state.skillPenalty += 50 * dt;
      state.shake = 6;
    }

    onUpdateProgress(state.distance, level.length, Math.max(0, 100 - state.skillPenalty));
    if (state.distance >= level.length) {
      state.playing = false; stopMusic();
      onGameOver(true, state.distance, level.length, Math.max(0, 100 - state.skillPenalty));
    }
  };

  const checkCollisions = (p: Player, state: any) => {
    const size = 12;
    const hitBox = { l: p.x - size, r: p.x + size, t: p.y - size, b: p.y + size };
    for (const o of state.obstacles) {
      const sx = o.worldX - state.distance + p.x;
      if (sx > p.x + 150 || sx + o.w < p.x - 100) continue;
      if (hitBox.r > sx && hitBox.l < sx + o.w && hitBox.b > o.y && hitBox.t < o.y + o.h) {
        if (o.type === ObstacleType.WALL) return true;
        if (o.type === ObstacleType.SPIKE) {
          const cx = sx + o.w / 2;
          const cy = o.data.dir === 'up' ? o.y - 15 : o.y + 15;
          if (Math.hypot(p.x - cx, p.y - cy) < 22) return true;
        }
        if (o.type === ObstacleType.PORTAL_GRAVITY && !o.data?.triggered) {
          p.gravityInverted = !p.gravityInverted; p.vy = 0;
          o.data = { triggered: true }; playPortalSound();
          state.flashEffect = 0.6;
        }
      }
    }
    return false;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const state = gameStateRef.current;
    const p = playerRef.current;
    ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.save();
    if (state.shake > 0) { ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake); state.shake *= 0.92; }
    
    // Grid Background
    ctx.strokeStyle = '#112244'; ctx.lineWidth = 1;
    const gridOffset1 = (state.distance * 0.4) % 100;
    for (let x = -gridOffset1; x < CANVAS_WIDTH; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke(); }
    for (let y = 0; y < CANVAS_HEIGHT; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke(); }

    // Trail
    if (p.trail.length > 1) {
      ctx.beginPath(); ctx.moveTo(p.trail[0].distance - state.distance + p.x, p.trail[0].y);
      p.trail.forEach(t => ctx.lineTo(t.distance - state.distance + p.x, t.y));
      ctx.strokeStyle = level.color; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.shadowBlur = 10; ctx.shadowColor = level.color;
      ctx.stroke(); ctx.shadowBlur = 0;
    }

    // Obstacles
    state.obstacles.forEach(o => {
      const sx = o.worldX - state.distance + p.x;
      if (sx < -100 || sx > CANVAS_WIDTH + 100) return;
      if (o.type === ObstacleType.WALL) {
        ctx.fillStyle = level.color; ctx.shadowBlur = 15; ctx.shadowColor = level.color;
        ctx.fillRect(sx, o.y, o.w, o.h);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; ctx.strokeRect(sx + 8, o.y + 8, o.w - 16, o.h - 16);
        ctx.shadowBlur = 0;
      } else if (o.type === ObstacleType.SPIKE) {
        ctx.fillStyle = COLORS.spike; ctx.beginPath();
        if (o.data.dir === 'up') { ctx.moveTo(sx, o.y); ctx.lineTo(sx + o.w/2, o.y - o.h); ctx.lineTo(sx + o.w, o.y); }
        else { ctx.moveTo(sx, o.y); ctx.lineTo(sx + o.w/2, o.y + o.h); ctx.lineTo(sx + o.w, o.y); }
        ctx.fill();
      } else if (o.type === ObstacleType.PORTAL_GRAVITY) {
        ctx.strokeStyle = COLORS.portal_gravity; ctx.lineWidth = 6; ctx.shadowBlur = 20; ctx.shadowColor = COLORS.portal_gravity;
        ctx.strokeRect(sx, o.y, o.w, o.h); ctx.fillStyle = 'rgba(255,255,0,0.1)'; ctx.fillRect(sx, o.y, o.w, o.h);
        ctx.shadowBlur = 0;
      }
    });

    // Particles
    state.particles.forEach(part => {
      ctx.globalAlpha = part.life / part.maxLife;
      ctx.fillStyle = part.color;
      ctx.fillRect(part.x, part.y, part.size, part.size);
    });
    ctx.globalAlpha = 1;

    // Player
    if (state.playing) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.fillStyle = state.isCurrentlyColliding ? '#ff3333' : '#ffffff';
      ctx.shadowBlur = 20; ctx.shadowColor = level.color;
      if (p.mode === 'WAVE') { ctx.beginPath(); ctx.moveTo(-15, -15); ctx.lineTo(15, 0); ctx.lineTo(-15, 15); ctx.fill(); }
      else if (p.mode === 'SHIP') { ctx.fillRect(-15, -8, 30, 16); ctx.strokeRect(-12, -5, 24, 10); }
      else { ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.restore();
    }

    if (state.flashEffect > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${state.flashEffect * 0.4})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    ctx.restore();
  };

  const loop = (time: number) => {
    const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
    lastTimeRef.current = time;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { update(dt); draw(ctx); }
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    gameStateRef.current.obstacles = [];
    for (let i = 0; i < 6; i++) generateSegment();
    if (isMusicEnabled) startMusic(practiceMode);
    
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(loop);

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        if (playerRef.current.mode === 'UFO') handleAction();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    return () => { 
      stopMusic(); cancelAnimationFrame(requestRef.current); 
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [level, isMusicEnabled]);

  return (
    <canvas 
      ref={canvasRef} 
      width={CANVAS_WIDTH} 
      height={CANVAS_HEIGHT} 
      className="block w-full h-full cursor-none"
      onMouseDown={() => { playerRef.current.isHolding = true; if (playerRef.current.mode === 'UFO') handleAction(); }}
      onMouseUp={() => { playerRef.current.isHolding = false; }}
    />
  );
};

export default GameEngine;
