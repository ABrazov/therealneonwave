
import { GameMode } from './types';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 720;

export const WAVE_ANGLES = {
  novato: 22.5,
  normal: 45,
  hyper: 67.5
};

export const COLORS = {
  bg: '#050510',
  grid: '#112244',
  player: '#ffffff',
  portal_gravity: '#ffff00', 
  portal_speed_yellow: '#ffcc00', 
  portal_speed_blue: '#00ccff',   
  portal_speed_green: '#00ff00',  
  portal_speed_pink: '#ff00ff',   
  portal_speed_red: '#ff0000',    
  portal_size_mini: '#ff00ff', 
  portal_size_large: '#77ff77', 
  portal_ship: '#aa00ff', 
  portal_wave: '#00ccff', 
  portal_ufo: '#ffaa00', 
  laser: '#ff0000',
  spike: '#ff3333',
  danger: '#ff0000',
  wall_glow: 'rgba(0, 255, 255, 0.3)'
};

export interface FolderDef {
  id: number;
  name: string;
  color: string;
  mode: GameMode;
}

export const FOLDERS: FolderDef[] = [
  { id: 0, name: "WAVE_ALPHA", color: "#00ffaa", mode: 'WAVE' },
  { id: 1, name: "WAVE_BETA", color: "#00ccff", mode: 'WAVE' },
  { id: 2, name: "WAVE_GAMMA", color: "#0088ff", mode: 'WAVE' },
  { id: 3, name: "WAVE_DELTA", color: "#44ff88", mode: 'WAVE' },
  { id: 10, name: "SHIP_START", color: "#aa00ff", mode: 'SHIP' },
  { id: 11, name: "SHIP_ASCEND", color: "#cc00ff", mode: 'SHIP' },
  { id: 12, name: "SHIP_CORE", color: "#ff00ee", mode: 'SHIP' },
  { id: 13, name: "SHIP_VOID", color: "#6600ff", mode: 'SHIP' },
  { id: 15, name: "UFO_ALPHA", color: "#ffaa00", mode: 'UFO' },
  { id: 16, name: "UFO_BETA", color: "#ff5500", mode: 'UFO' },
  { id: 17, name: "UFO_GALAXY", color: "#ff2200", mode: 'UFO' },
  { id: 18, name: "UFO_OMEGA", color: "#ff0000", mode: 'UFO' },
  { id: 30, name: "NEON_NIGHTMARE", color: "#ff0044", mode: 'WAVE' },
  { id: 31, name: "COSMIC_NIGHTMARE", color: "#ff00aa", mode: 'WAVE' },
  { id: 20, name: "THE_VOID_TRAVEL", color: "#ffffff", mode: 'WAVE' }
];
