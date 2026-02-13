
import React from 'react';
import { GameMode } from '../types';

interface MenuInfiniteProps {
  diff: string;
  setDiff: (d: string) => void;
  speed: number;
  setSpeed: (s: number) => void;
  mode: GameMode;
  setMode: (m: GameMode) => void;
  onBack: () => void;
  onStart: (diff: string, speed: number, mode: GameMode) => void;
}

const MenuInfinite: React.FC<MenuInfiniteProps> = ({ diff, setDiff, speed, setSpeed, mode, setMode, onBack, onStart }) => {
  const diffs = [
    { id: 'easy', label: 'Easy', color: 'border-emerald-500 text-emerald-500' },
    { id: 'medium', label: 'Medium', color: 'border-yellow-500 text-yellow-500' },
    { id: 'hard', label: 'Hard', color: 'border-red-500 text-red-500' },
    { id: 'extreme', label: 'Extreme', color: 'border-purple-600 text-purple-600' },
    { id: 'omega', label: 'Ω OMEGA', color: 'border-white text-white bg-white/10' }
  ];

  const modes = [
    { id: 'WAVE', label: 'Wave', color: 'border-[#00ccff] text-[#00ccff]' },
    { id: 'SHIP', label: 'Ship', color: 'border-[#aa00ff] text-[#aa00ff]' },
    { id: 'UFO', label: 'UFO', color: 'border-[#ffaa00] text-[#ffaa00]' }
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-20">
      <h2 className="text-4xl font-bold mb-8 tracking-widest text-cyan-400">INFINITE SEED</h2>
      
      <div className="flex flex-col gap-4 mb-8 items-center">
        <label className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Select Protocol Mode</label>
        <div className="flex gap-3 justify-center">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as GameMode)}
              className={`px-8 py-3 rounded-lg border-2 font-black uppercase tracking-widest transition-all ${
                mode === m.id ? `${m.color} shadow-[0_0_15px_currentColor] bg-zinc-800` : 'border-zinc-800 text-zinc-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-10 items-center">
        <label className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Difficulty Tier</label>
        <div className="flex gap-3 flex-wrap justify-center w-[850px]">
          {diffs.map((d) => (
            <button
              key={d.id}
              onClick={() => setDiff(d.id)}
              className={`px-6 py-3 rounded-lg border-2 font-bold uppercase tracking-widest transition-all ${
                diff === d.id ? `${d.color} shadow-[0_0_15px_currentColor] bg-zinc-800` : 'border-zinc-800 text-zinc-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-[500px] mb-10">
        <div className="flex justify-between mb-4">
          <label className="text-zinc-500 font-bold uppercase text-xs">Scroll Speed Multiplier</label>
          <span className="text-cyan-400 font-bold">{(speed / 100).toFixed(2)}x</span>
        </div>
        <input 
          type="range" min="5" max="1000" step="5"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
          className="w-full accent-cyan-400 h-2 bg-black rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <button 
        onClick={() => onStart(diff, speed, mode)}
        className="px-16 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all rounded-lg font-black text-xl tracking-[0.2em] shadow-lg hover:shadow-cyan-400/50 uppercase"
      >
        Initiate
      </button>

      <button onClick={onBack} className="mt-8 text-zinc-500 hover:text-white transition-colors underline underline-offset-4 uppercase text-xs tracking-widest">
        Main Menu
      </button>
    </div>
  );
};

export default MenuInfinite;
