
import React, { useState } from 'react';
import { GameState, WaveType, LevelConfig, GameMode } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import GameEngine from './components/GameEngine';
import MenuHome from './components/MenuHome';
import MenuLevels from './components/MenuLevels';
import MenuInfinite from './components/MenuInfinite';
import ResultScreen from './components/ResultScreen';
import HUD from './components/HUD';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [baseLevel, setBaseLevel] = useState<LevelConfig | null>(null);
  const [waveType, setWaveType] = useState<WaveType>('normal');
  const [distance, setDistance] = useState(0);
  const [progress, setProgress] = useState(0);
  const [skillScore, setSkillScore] = useState(100);
  
  // Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoclicker, setAutoclicker] = useState(false);
  const [autoclickerCPS, setAutoclickerCPS] = useState(15);
  const [practiceMode, setPracticeMode] = useState(false);
  const [perfMode, setPerfMode] = useState<'none' | 'basic' | 'full'>('full');
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [showProgressPercent, setShowProgressPercent] = useState(true);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  const [checkpointCount, setCheckpointCount] = useState(0);
  const [infiniteDiff, setInfiniteDiff] = useState('easy');
  const [infSpeed, setInfSpeed] = useState(100);
  const [infMode, setInfMode] = useState<GameMode>('WAVE');
  const [storySpeed, setStorySpeed] = useState(100);
  const [attemptId, setAttemptId] = useState(0);
  const [levelSeed, setLevelSeed] = useState(0);

  const [lastAttemptResults, setLastAttemptResults] = useState<{ win: boolean; percent: number; skillScore?: number }>({ win: false, percent: 0 });

  const handleStartStory = (level: LevelConfig) => {
    const newSeed = Date.now();
    setLevelSeed(newSeed);
    setAttemptId(prev => prev + 1);
    setBaseLevel(level);
    const speedMult = storySpeed / 100;
    const finalLevel = { ...level, speed: level.speed * speedMult };
    setCurrentLevel(finalLevel);
    setDistance(0);
    setProgress(0);
    setGameState('PLAYING');
    setIsSettingsOpen(false);
    setCheckpointCount(0);
  };

  const handleStartInfinite = (diff: string, speed: number, mode: GameMode) => {
    const newSeed = Date.now();
    setLevelSeed(newSeed);
    setAttemptId(prev => prev + 1);
    setInfiniteDiff(diff);
    setInfSpeed(speed);
    setInfMode(mode);
    const diffMap: any = {
      easy: { color: '#0f0', gap: 210, freq: 400 },
      medium: { color: '#ff0', gap: 160, freq: 350 },
      hard: { color: '#f00', gap: 120, freq: 300 },
      extreme: { color: '#b0f', gap: 95, freq: 260 },
      omega: { color: '#ffffff', gap: 75, freq: 220 }
    };
    const p = diffMap[diff];
    const baseSpeed = diff === 'omega' ? 800 : 500;
    const finalSpeed = baseSpeed * (speed / 100);
    const level: LevelConfig = {
      id: -1,
      name: `INF: ${diff.toUpperCase()}`,
      speed: baseSpeed,
      gap: p.gap,
      obsFreq: p.freq,
      length: Infinity,
      color: p.color,
      features: ['spikes', 'portals', 'monsters'],
      startingMode: mode
    };
    setBaseLevel(level);
    setCurrentLevel({ ...level, speed: finalSpeed });
    setDistance(0);
    setProgress(0);
    setGameState('PLAYING');
    setIsSettingsOpen(false);
    setCheckpointCount(0);
  };

  const handleStartSkillTest = (mode: GameMode) => {
    const newSeed = Date.now();
    setLevelSeed(newSeed);
    setAttemptId(prev => prev + 1);
    const level: LevelConfig = {
      id: -2,
      name: `${mode} SKILL TEST`,
      speed: 600,
      gap: 130,
      obsFreq: 350,
      length: 12000,
      color: mode === 'WAVE' ? '#00ccff' : mode === 'SHIP' ? '#aa00ff' : '#ffaa00',
      features: ['spikes'],
      startingMode: mode,
      isSkillTest: true
    };
    setBaseLevel(level);
    setCurrentLevel(level);
    setDistance(0);
    setProgress(0);
    setSkillScore(100);
    setGameState('PLAYING');
    setIsSettingsOpen(false);
    setCheckpointCount(0);
  };

  const onGameOver = (win: boolean, dist: number, totalLen: number, finalSkillScore?: number) => {
    const finalPercent = totalLen === Infinity ? dist : Math.min(100, (dist / totalLen) * 100);
    setLastAttemptResults({ 
      win, 
      percent: finalPercent, 
      skillScore: currentLevel?.isSkillTest ? (finalSkillScore ?? 100) : undefined 
    });
    setGameState(win ? 'WIN' : 'GAMEOVER');
  };

  const onUpdateProgress = (dist: number, totalLen: number, currentSkillScore?: number) => {
    setDistance(dist);
    if (totalLen !== Infinity) {
      const p = Math.min(100, Math.max(0, (dist / totalLen) * 100));
      setProgress(p);
    }
    if (currentLevel?.isSkillTest && currentSkillScore !== undefined) {
      setSkillScore(currentSkillScore);
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-[#020205] overflow-hidden select-none text-white font-['Fredoka']">
      <div 
        id="game-container"
        className="relative border-4 border-white/5 shadow-2xl overflow-hidden max-w-[98vw] max-h-[98vh]"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, background: '#000', aspectRatio: '3/2' }}
      >
        {gameState !== 'PLAYING' && (
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="absolute top-6 right-6 z-50 p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/30 transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 text-zinc-400 group-hover:text-white transition-transform duration-500 ${isSettingsOpen ? 'rotate-90' : 'rotate-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        )}

        <SettingsPanel 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          autoclicker={autoclicker}
          toggleAutoclicker={() => setAutoclicker(!autoclicker)}
          autoclickerCPS={autoclickerCPS}
          setAutoclickerCPS={setAutoclickerCPS}
          practiceMode={practiceMode}
          togglePracticeMode={() => setPracticeMode(!practiceMode)}
          perfMode={perfMode}
          setPerfMode={setPerfMode}
          showProgressBar={showProgressBar}
          toggleProgressBar={() => setShowProgressBar(!showProgressBar)}
          showProgressPercent={showProgressPercent}
          toggleProgressPercent={() => setShowProgressPercent(!showProgressPercent)}
          isMusicEnabled={isMusicEnabled}
          toggleMusic={() => setIsMusicEnabled(!isMusicEnabled)}
        />

        {(gameState === 'PLAYING' || gameState === 'GAMEOVER' || gameState === 'WIN') && currentLevel && (
          <>
            <GameEngine 
              key={attemptId}
              level={currentLevel}
              seed={levelSeed}
              waveType={waveType}
              autoclicker={autoclicker}
              autoclickerCPS={autoclickerCPS}
              practiceMode={practiceMode}
              perfMode={perfMode}
              isMusicEnabled={isMusicEnabled}
              onGameOver={onGameOver}
              onUpdateProgress={onUpdateProgress}
              onCheckpointChange={setCheckpointCount}
            />
            <HUD 
              levelName={currentLevel.name}
              color={currentLevel.color}
              waveType={waveType}
              progress={progress}
              distance={distance}
              isInfinite={currentLevel.length === Infinity}
              autoclicker={autoclicker}
              autoclickerCPS={autoclickerCPS}
              practiceMode={practiceMode}
              checkpointCount={checkpointCount}
              showProgressBar={showProgressBar}
              showProgressPercent={showProgressPercent}
              isMusicEnabled={isMusicEnabled}
              isSkillTest={currentLevel.isSkillTest}
              skillScore={skillScore}
            />
          </>
        )}

        {gameState === 'MENU' && (
          <MenuHome 
            waveType={waveType}
            setWaveType={setWaveType}
            onShowFolders={() => setGameState('LEVEL_SELECT')}
            onShowInfinite={() => setGameState('INFINITE_CONFIG')}
            onStartSkillTest={handleStartSkillTest}
          />
        )}

        {gameState === 'LEVEL_SELECT' && (
          <MenuLevels 
            storySpeed={storySpeed}
            setStorySpeed={setStorySpeed}
            onBack={() => setGameState('MENU')}
            onStartLevel={handleStartStory}
          />
        )}

        {gameState === 'INFINITE_CONFIG' && (
          <MenuInfinite 
            diff={infiniteDiff}
            setDiff={setInfiniteDiff}
            speed={infSpeed}
            setSpeed={setInfSpeed}
            mode={infMode}
            setMode={setInfMode}
            onBack={() => setGameState('MENU')}
            onStart={handleStartInfinite}
          />
        )}

        {(gameState === 'GAMEOVER' || gameState === 'WIN') && (
          <ResultScreen 
            results={lastAttemptResults}
            isInfinite={currentLevel?.length === Infinity}
            onRetry={() => {
              if (baseLevel) {
                 if (baseLevel.id === -1) handleStartInfinite(infiniteDiff, infSpeed, infMode);
                 else if (baseLevel.id === -2) handleStartSkillTest(baseLevel.startingMode);
                 else handleStartStory(baseLevel);
              }
            }}
            onQuit={() => {
              setGameState('MENU');
              setCurrentLevel(null);
              setBaseLevel(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
