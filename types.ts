
export type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER' | 'WIN' | 'FOLDERS' | 'LEVEL_SELECT' | 'INFINITE_CONFIG';

export type WaveType = 'novato' | 'normal' | 'hyper';

export type GameMode = 'WAVE' | 'SHIP' | 'UFO';

export enum ObstacleType {
  WALL = 'WALL',
  SPIKE = 'SPIKE',
  MONSTER = 'MONSTER',
  PORTAL_GRAVITY = 'PORTAL_GRAVITY',
  PORTAL_SPEED_YELLOW = 'PORTAL_SPEED_YELLOW', // 0.8x
  PORTAL_SPEED_BLUE = 'PORTAL_SPEED_BLUE',     // 1.0x
  PORTAL_SPEED_GREEN = 'PORTAL_SPEED_GREEN',   // 1.3x
  PORTAL_SPEED_PINK = 'PORTAL_SPEED_PINK',     // 1.5x
  PORTAL_SPEED_RED = 'PORTAL_SPEED_RED',       // 1.8x
  PORTAL_SIZE_MINI = 'PORTAL_SIZE_MINI',
  PORTAL_SIZE_LARGE = 'PORTAL_SIZE_LARGE',
  PORTAL_SHIP = 'PORTAL_SHIP',
  PORTAL_WAVE = 'PORTAL_WAVE',
  PORTAL_UFO = 'PORTAL_UFO',
  LASER = 'LASER'
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number; 
  worldX: number; 
  y: number;
  w: number;
  h: number;
  data?: any;
}

export interface Player {
  x: number;
  y: number;
  vy: number;
  size: number;
  angle: number;
  isHolding: boolean;
  gravityInverted: boolean;
  speedMultiplier: number;
  isMini: boolean;
  mode: GameMode;
  trail: { x: number; y: number; distance: number }[];
}

export interface LevelConfig {
  id: number;
  name: string;
  speed: number;
  gap: number;
  obsFreq: number;
  length: number;
  color: string;
  features: string[];
  startingMode: GameMode;
  isSkillTest?: boolean;
}
