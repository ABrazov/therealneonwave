
import React from 'react';
import { WaveType, GameMode } from '../types';

interface MenuHomeProps {
  waveType: WaveType;
  setWaveType: (t: WaveType) => void;
  onShowFolders: () => void;
  onShowInfinite: () => void;
  onStartSkillTest: (mode: GameMode) => void;
}

const MenuHome: React.FC<MenuHomeProps> = ({ 
  waveType, setWaveType,
  onShowFolders, onShowInfinite, onStartSkillTest
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-20">
      <div className="text-center mb-12 animate-pulse">
        <h1 className="text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 italic">
          NEON WAVE
        </h1>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 mt-2" />
      </div>

      <div className="flex gap-4 mb-12 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
        {(['novato', 'normal', 'hyper'] as WaveType[]).map((type) => (
          <button
            key={type}
            onClick={() => setWaveType(type)}
            className={`px-8 py-3 rounded-xl border-2 transition-all flex flex-col items-center ${
              waveType === type 
                ? 'border-cyan-400 bg-cyan-400/20 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
            }`}
          >
            <span className="font-black uppercase text-xs tracking-widest">{type}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 w-96">
        <button onClick={onShowFolders} className="bg-white text-black p-5 rounded-xl font-black text-xl uppercase transition-all hover:scale-105 shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
          Launch Protocols
        </button>
        <button onClick={onShowInfinite} className="border-2 border-zinc-800 p-4 rounded-xl font-black text-zinc-400 uppercase transition-all hover:border-purple-500 hover:text-white hover:bg-purple-500/10">
          Infinite Stream
        </button>
        
        <div className="mt-8">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 text-center">Neural Calibration Tests</p>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => onStartSkillTest('UFO')} className="bg-zinc-900/50 border border-amber-500/30 p-4 rounded-xl hover:border-amber-400 transition-all group">
              <div className="text-amber-400 font-black text-xs group-hover:scale-110 transition-transform">UFO</div>
            </button>
            <button onClick={() => onStartSkillTest('SHIP')} className="bg-zinc-900/50 border border-purple-500/30 p-4 rounded-xl hover:border-purple-400 transition-all group">
              <div className="text-purple-400 font-black text-xs group-hover:scale-110 transition-transform">SHIP</div>
            </button>
            <button onClick={() => onStartSkillTest('WAVE')} className="bg-zinc-900/50 border border-cyan-500/30 p-4 rounded-xl hover:border-cyan-400 transition-all group">
              <div className="text-cyan-400 font-black text-xs group-hover:scale-110 transition-transform">WAVE</div>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center opacity-30">
        <span className="text-[9px] font-bold tracking-[1em] text-white">SYSTEM ONLINE // VER OMEGA_01</span>
      </div>
    </div>
  );
};

export default MenuHome;
