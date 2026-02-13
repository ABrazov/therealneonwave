
import React from 'react';
import { WaveType } from '../types';

interface HUDProps {
  levelName: string;
  color: string;
  waveType: WaveType;
  progress: number;
  distance: number;
  isInfinite: boolean;
  autoclicker: boolean;
  autoclickerCPS: number;
  practiceMode: boolean;
  checkpointCount: number;
  showProgressBar: boolean;
  showProgressPercent: boolean;
  isMusicEnabled: boolean;
  isSkillTest?: boolean;
  skillScore?: number;
}

const HUD: React.FC<HUDProps> = ({ 
  levelName, color, waveType, progress, distance, 
  isInfinite, autoclicker, autoclickerCPS, practiceMode, checkpointCount,
  showProgressBar, showProgressPercent, isMusicEnabled,
  isSkillTest, skillScore
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col p-6 z-10">
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold uppercase tracking-widest" style={{ color }}>{levelName}</span>
            <div className="flex gap-2">
              <span className="px-3 py-0.5 rounded border border-white text-[10px] font-bold text-white uppercase">{waveType}</span>
              {autoclicker && (
                <span className="px-3 py-0.5 rounded border border-emerald-500 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                  BOT: {autoclickerCPS.toFixed(1)} CPS
                </span>
              )}
            </div>
          </div>
        </div>

        {!isInfinite && (showProgressBar || showProgressPercent) && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 px-4 py-2 rounded-full border border-white/5">
            {showProgressBar && (
              <div className="w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            )}
            {showProgressPercent && (
              <span className="text-xs font-black text-white font-mono">{progress.toFixed(1)}%</span>
            )}
          </div>
        )}

        {isSkillTest && (
          <div className="bg-black/40 px-6 py-2 rounded-xl border border-amber-500/30 backdrop-blur-md">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">ACCURACY</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{skillScore?.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HUD;
