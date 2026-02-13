
import React from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  autoclicker: boolean;
  toggleAutoclicker: () => void;
  autoclickerCPS: number;
  setAutoclickerCPS: (v: number) => void;
  practiceMode: boolean;
  togglePracticeMode: () => void;
  perfMode: 'none' | 'basic' | 'full';
  setPerfMode: (m: 'none' | 'basic' | 'full') => void;
  showProgressBar: boolean;
  toggleProgressBar: () => void;
  showProgressPercent: boolean;
  toggleProgressPercent: () => void;
  isMusicEnabled: boolean;
  toggleMusic: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, onClose, autoclicker, toggleAutoclicker, 
  autoclickerCPS, setAutoclickerCPS,
  practiceMode, togglePracticeMode, perfMode, setPerfMode,
  showProgressBar, toggleProgressBar, showProgressPercent, toggleProgressPercent,
  isMusicEnabled, toggleMusic
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
          <h3 className="text-xl font-black tracking-[0.2em] text-white uppercase italic">Calibration Center</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold tracking-widest uppercase">Autopilot</span>
              <button onClick={toggleAutoclicker} className={`w-12 h-6 rounded-full relative ${autoclicker ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${autoclicker ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold tracking-widest uppercase">Practice</span>
              <button onClick={togglePracticeMode} className={`w-12 h-6 rounded-full relative ${practiceMode ? 'bg-purple-500' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${practiceMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">Bot Neural Frequency (CPS)</label>
              <span className="text-emerald-400 font-black font-mono">{autoclickerCPS.toFixed(1)} <span className="text-[8px] text-zinc-600">Hz</span></span>
            </div>
            <input 
              type="range" min="0.1" max="50" step="0.1" 
              value={autoclickerCPS}
              onChange={(e) => setAutoclickerCPS(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-[8px] text-zinc-600 font-bold uppercase">
               <span>Slow (0.1)</span>
               <span>Human (6.0)</span>
               <span>God (50.0)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold tracking-widest uppercase">Progress Bar</span>
              <button onClick={toggleProgressBar} className={`w-12 h-6 rounded-full relative ${showProgressBar ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showProgressBar ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold tracking-widest uppercase">Music</span>
              <button onClick={toggleMusic} className={`w-12 h-6 rounded-full relative ${isMusicEnabled ? 'bg-amber-500' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isMusicEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full mt-10 py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-full hover:scale-105 transition-all">
          Sync Protocols
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
