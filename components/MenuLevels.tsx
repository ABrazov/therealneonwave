
import React from 'react';
import { FOLDERS } from '../constants';
import { LevelConfig } from '../types';

interface MenuLevelsProps {
  storySpeed: number;
  setStorySpeed: (v: number) => void;
  onBack: () => void;
  onStartLevel: (l: LevelConfig) => void;
}

const MenuLevels: React.FC<MenuLevelsProps> = ({ storySpeed, setStorySpeed, onBack, onStartLevel }) => {
  // Generate all levels for all folders
  const allLevels: { folderName: string; color: string; levels: LevelConfig[] }[] = FOLDERS.map((folder, folderIdx) => {
    const isTravelSector = folder.name === "THE_VOID_TRAVEL";
    const levelCount = isTravelSector ? 5 : 10; // ahora 5 niveles travel

    const levels: LevelConfig[] = Array.from({ length: levelCount }).map((_, i) => {
      const globalId = folderIdx * 10 + i;
      
      if (isTravelSector) {
        if (i === 0) {
          return {
            id: 200,
            name: "ETERNAL VOYAGE 18:00",
            speed: 600,
            gap: 190,
            obsFreq: 500,
            length: 648000,
            color: "#ffffff",
            features: ['spikes', 'portals'],
            startingMode: 'WAVE'
          };
        }
        if (i === 1) {
          return {
            id: 201,
            name: "GALACTIC CARRIER 15:00",
            speed: 600,
            gap: 210,
            obsFreq: 520,
            length: 540000,
            color: "#aa00ff",
            features: ['spikes', 'portals'],
            startingMode: 'SHIP'
          };
        }
        if (i === 2) {
          return {
            id: 202,
            name: "ORBITAL JUMPER 12:00",
            speed: 600,
            gap: 230,
            obsFreq: 550,
            length: 432000,
            color: "#ffaa00",
            features: ['spikes', 'portals'],
            startingMode: 'UFO'
          };
        }
        if (i === 3) {
          return {
            id: 203,
            name: "VOID SURFER 30:00",
            speed: 620,
            gap: 180,
            obsFreq: 480,
            length: 1800000, // 30 min
            color: "#00ffff",
            features: ['spikes', 'portals'],
            startingMode: 'WAVE'
          };
        }
        if (i === 4) {
          return {
            id: 204,
            name: "INFINITE FREIGHTER 60:00",
            speed: 640,
            gap: 170,
            obsFreq: 450,
            length: 3600000, // 60 min
            color: "#ff0066",
            features: ['spikes', 'portals'],
            startingMode: 'SHIP'
          };
        }
      }

      const difficultyScale = Math.max(0, folderIdx * 2 + i - 5);
      const baseSpeed = 480 + (difficultyScale * 8);
      const baseGap = Math.max(70, 260 - (difficultyScale * 1.5));
      const baseFreq = Math.max(180, 500 - (difficultyScale * 2));

      return {
        id: globalId,
        name: `${folder.mode} L-${globalId + 1}`,
        speed: baseSpeed,
        gap: baseGap,
        obsFreq: baseFreq,
        length: 10000 + (globalId * 500),
        color: folder.color,
        features: globalId > 20 ? ['spikes', 'portals'] : [],
        startingMode: folder.mode
      };
    });
    return { folderName: folder.name, color: folder.color, levels };
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-black/95 z-20 p-8 overflow-hidden">
      {/* resto del componente sin cambios */}
    </div>
  );
};

export default MenuLevels;
