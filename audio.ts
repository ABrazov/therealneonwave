
let audioCtx: AudioContext | null = null;
let musicInterval: number | null = null;
let currentStep = 0;
let activeSongIndex = 0;
let playingPractice = false;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// --- EFECTOS DE SONIDO ---

export const playJumpSound = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

export const playPortalSound = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

export const playModeSound = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

export const playCrashSound = () => {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
};

export const playCheckpointSound = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

// --- MÚSICA SEQUENCER ---

const NOTES: Record<string, number> = {
  'G2': 98.00, 'A2': 110.00, 'Bb2': 116.54, 'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25
};

const PRACTICE_SONG = {
  name: "Stay Inside Me (Practice)",
  bpm: 100,
  lead: ['C5', null, 'Bb4', null, 'G4', null, 'Bb4', null, 'C5', null, 'Eb5', null, 'D5', null, 'Bb4', null, 'C5', null, 'Bb4', null, 'G4', null, 'Bb4', null, 'Eb4', null, 'F4', null, 'G4', null, null, null],
  bass: ['C2', null, 'C2', null, 'Eb2', null, 'Eb2', null, 'F2', null, 'F2', null, 'Bb1', null, 'Bb1', null, 'C2', null, 'C2', null, 'Eb2', null, 'Eb2', null, 'G1', null, 'G1', null, 'Bb1', null, 'Bb1', null]
};

const SONGS = [
  {
    name: "Stereo Madness",
    bpm: 126,
    lead: ['C4', null, 'C4', null, 'Eb4', null, 'F4', null, 'C4', null, 'C4', null, 'Bb3', null, 'Bb3', null, 'C4', null, 'C4', null, 'Eb4', null, 'F4', null, 'G4', null, 'Bb4', null, 'C5', null, null, null],
    bass: ['C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'Bb1', 'Bb1', 'Bb1', 'Bb1', 'Bb1', 'Bb1', 'Bb1', 'Bb1', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'Eb2', 'Eb2', 'Eb2', 'Eb2', 'F2', 'F2', 'F2', 'F2']
  },
  {
    name: "Back on Track",
    bpm: 128,
    lead: ['G4', null, 'G4', null, 'A4', null, 'B4', null, 'D5', null, 'D5', null, 'B4', null, 'G4', null, 'G4', null, 'G4', null, 'A4', null, 'B4', null, 'A4', null, 'G4', null, 'E4', null, null, null],
    bass: ['G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'D3', 'D3', 'D3', 'D3', 'C3', 'C3', 'C3', 'C3']
  },
  {
    name: "Polargeist",
    bpm: 130,
    lead: ['A4', 'C5', 'E5', null, 'D5', 'C5', 'B4', null, 'A4', 'C5', 'E5', null, 'G5', 'F5', 'E5', null, 'A4', 'C5', 'E5', null, 'D5', 'C5', 'B4', null, 'G4', 'B4', 'D5', null, 'A4', null, null, null],
    bass: ['A2', 'A2', 'A2', 'A2', 'F2', 'F2', 'F2', 'F2', 'A2', 'A2', 'A2', 'A2', 'G2', 'G2', 'G2', 'G2', 'A2', 'A2', 'A2', 'A2', 'F2', 'F2', 'F2', 'F2', 'G2', 'G2', 'G2', 'G2', 'A2', 'A2', 'A2', 'A2']
  }
];

const playTick = (ctx: AudioContext, step: number) => {
  const time = ctx.currentTime;
  const song = playingPractice ? PRACTICE_SONG : SONGS[activeSongIndex];
  const isDownbeat = step % 4 === 0;
  const isBackbeat = step % 4 === 2;
  const isOffbeat = step % 2 === 1;

  // Percussion (Slightly softer for practice)
  const volMult = playingPractice ? 0.6 : 1.0;

  if (isDownbeat) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(playingPractice ? 110 : 150, time);
    osc.frequency.exponentialRampToValueAtTime(playingPractice ? 35 : 45, time + 0.12);
    gain.gain.setValueAtTime(0.2 * volMult, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  if (isBackbeat) {
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06 * volMult, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start(time);
  }

  // Bass
  const bRaw = song.bass[step % 32];
  if (bRaw) {
    const bBase = bRaw.substring(0, bRaw.length - 1);
    const bOct = parseInt(bRaw.substring(bRaw.length - 1)) + 1;
    const bFreq = NOTES[`${bBase}${bOct}`] || 100;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = playingPractice ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(bFreq, time);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(playingPractice ? 200 : 300, time);
    gain.gain.setValueAtTime(0.12 * volMult, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  // Lead
  const lRaw = song.lead[step % 32];
  if (lRaw) {
    const lFreq = NOTES[lRaw];
    if (lFreq) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = playingPractice ? 'sine' : 'square';
      osc.frequency.setValueAtTime(lFreq, time);
      gain.gain.setValueAtTime(0.03 * volMult, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + (playingPractice ? 0.4 : 0.2));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + (playingPractice ? 0.4 : 0.2));
    }
  }
};

export const startMusic = (isPractice: boolean = false) => {
  if (musicInterval) return;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  
  playingPractice = isPractice;
  activeSongIndex = Math.floor(Math.random() * SONGS.length);
  currentStep = 0;
  const song = playingPractice ? PRACTICE_SONG : SONGS[activeSongIndex];
  const stepTime = (60 / song.bpm) / 2;

  musicInterval = window.setInterval(() => {
    playTick(ctx, currentStep);
    currentStep++;
  }, stepTime * 1000);
};

export const stopMusic = () => {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
};
