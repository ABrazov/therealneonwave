
import React from 'react';

interface ResultScreenProps {
  results: { win: boolean; percent: number; skillScore?: number };
  isInfinite: boolean;
  onRetry: () => void;
  onQuit: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ results, isInfinite, onRetry, onQuit }) => {
  const isSkillTest = results.skillScore !== undefined;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-30 transition-all animate-in fade-in zoom-in duration-300">
      <h1 className={`text-7xl font-black mb-2 tracking-tighter ${results.win ? 'text-emerald-400' : 'text-red-500'}`}>
        {results.win ? 'SUCCESS' : 'CRASHED'}
      </h1>
      
      <div className="text-center mb-10">
        <p className="text-2xl text-zinc-400 font-bold tracking-widest uppercase">
          {isInfinite 
            ? `Distance: ${(results.percent / 100).toFixed(2)}m` 
            : `Progress: ${results.percent.toFixed(2)}%`}
        </p>
        {isSkillTest && (
          <p className={`text-4xl font-black mt-4 tracking-tighter ${results.skillScore! > 90 ? 'text-amber-400' : 'text-white'}`}>
            SKILL SCORE: {results.skillScore?.toFixed(1)}%
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 w-72">
        <button 
          onClick={onRetry}
          className="py-4 bg-white text-black font-black uppercase text-xl rounded-lg hover:scale-105 transition-all shadow-xl shadow-white/10"
        >
          Re-initialize
        </button>
        <button 
          onClick={onQuit}
          className="py-3 bg-zinc-800 text-zinc-400 font-bold uppercase rounded-lg hover:bg-zinc-700 transition-all text-sm tracking-widest"
        >
          Exit to Menu
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
