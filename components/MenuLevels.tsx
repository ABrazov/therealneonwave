
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
            startingMode: 'WAVE'
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
            <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <div className="flex flex-col">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-cyan-400">GLOBAL PROTOCOLS</h2>
          <span className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing all data sectors</span>
        </div>
        
        <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex flex-col">
            <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Timeline Speed Sync</label>
            <div className="flex items-center gap-4">
               <input 
                type="range" 
                min="5" max="1000" 
                value={storySpeed}
                onChange={(e) => setStorySpeed(parseInt(e.target.value))}
                className="w-40 accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-mono font-bold text-sm">{(storySpeed / 100).toFixed(2)}x</span>
            </div>
          </div>
        </div>

        <button onClick={onBack} className="px-6 py-2 border border-zinc-700 text-zinc-500 hover:text-white hover:border-white transition-all rounded-lg uppercase text-[10px] font-black tracking-widest">
          Exit System
        </button>
      </div>

      <div className="w-full max-w-5xl overflow-y-auto flex-1 pr-4 custom-scroll space-y-16 pb-20">
        {allLevels.map((section, sIdx) => {
          const isTravelSector = section.folderName === "THE_VOID_TRAVEL";
          
          return (
            <div key={sIdx} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-0.5 flex-1" style={{ background: `linear-gradient(to right, transparent, ${section.color}44)` }}></div>
                <h3 className={`text-sm font-black tracking-[0.3em] uppercase ${isTravelSector ? 'text-xl scale-110' : ''}`} style={{ color: section.color }}>
                  {isTravelSector ? "★ SPECIAL TRAVEL PROTOCOLS ★" : `Sector: ${section.folderName}`}
                </h3>
                <div className="h-0.5 flex-1" style={{ background: `linear-gradient(to left, transparent, ${section.color}44)` }}></div>
              </div>
              
              <div className={`grid gap-4 ${isTravelSector ? 'grid-cols-1 md:grid-cols-3 gap-10 justify-items-center' : 'grid-cols-5 md:grid-cols-10'}`}>
                {section.levels.map((l) => {
                  const isEpic = l.id >= 200;
                  return (
                    <button
                      key={l.id}
                      onClick={() => onStartLevel(l)}
                      className={`relative bg-zinc-900 border rounded-xl flex flex-col items-center justify-center hover:bg-zinc-800 hover:border-white transition-all hover:scale-105 group overflow-hidden ${isEpic ? 'w-64 h-32 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] ring-2 ring-white/10' : 'aspect-square border-zinc-800'}`}
                    >
                      <span className={`z-10 font-black text-center uppercase tracking-tighter px-2 transition-all group-hover:scale-110 ${isEpic ? 'text-xs' : 'text-[10px]'}`} style={{ color: l.color }}>
                        {isEpic ? l.name : l.id + 1}
                      </span>
                      {isEpic && (
                        <span className="z-10 text-[8px] text-zinc-500 font-bold mt-2 tracking-[0.3em]">
                          ULTRA-LONG DATASTREAM
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                        <div className="h-full bg-white opacity-0 group-hover:opacity-40 transition-opacity" style={{ width: '100%' }}></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MenuLevels;
