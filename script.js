/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FLAPPYTYPE - Complete Browser Game Engine
 * Neon Cyberpunk Typing & Flying Arcade Game
 * Plain Vanilla JavaScript & HTML5 Canvas
 */

// ============================================================================
// 1. SOUND SYNTHESIS ENGINE (Web Audio API - 100% Offline, Zero Latency)
// ============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('flappytype_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('flappytype_muted', this.muted);
    return this.muted;
  }

  // Play a soft frequency swoop for wing flap / jet thrust
  playFlap() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Play crisp mechanical click for correct letter keystroke
  playKeyClick() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Play low buzzer on typo / incorrect key
  playErrorBuzz() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Play triumphant major chord arpeggio on word completion
  playWordSuccess(comboLevel = 1) {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const baseFreq = 440;
    const notes = [1, 1.25, 1.5, 2].map(ratio => baseFreq * ratio);

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * (1 + (comboLevel - 1) * 0.1), now + idx * 0.04);

      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.25);
    });
  }

  // Play collision / shield shatter boom
  playHit() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Play descending melancholic chime on mission failure
  playGameOver() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const notes = [380, 320, 260, 180];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.18, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.35);
    });
  }

  // Play fanfare when setting a new high score
  playHighScore() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }
}

// ============================================================================
// 2. WORD BANK (Rich Cyber Words + Funny Combinations)
// ============================================================================
const WORD_BANK = {
  // Simple words for Easy difficulty or early rounds
  simple: [
    'neo', 'fly', 'sky', 'zap', 'wing', 'bird', 'dash', 'fast', 'jump', 'flap',
    'glow', 'pipe', 'code', 'data', 'zoom', 'byte', 'fire', 'core', 'warp', 'gear',
    'volt', 'beam', 'echo', 'grid', 'pulse', 'spark', 'cloud', 'solar', 'sonic', 'blaze'
  ],

  // Medium technology and action words
  medium: [
    'cyber', 'vector', 'matrix', 'orbital', 'lasers', 'hyper', 'velocity', 'arcade',
    'crypto', 'stellar', 'quantum', 'synthesizer', 'glitch', 'neon', 'shield', 'gravity',
    'dynamo', 'booster', 'thruster', 'horizon', 'turbine', 'vortex', 'specter', 'phantom',
    'avalanche', 'circuit', 'terminal', 'overload', 'ignition', 'reactor', 'teleport'
  ],

  // Tricky long words for Hard difficulty
  complex: [
    'superconductor', 'electromagnetic', 'accelerator', 'nanotechnology',
    'synchronization', 'thermodynamic', 'decentralized', 'gravitational',
    'bioluminescence', 'countermeasure', 'subterranean', 'interstellar'
  ],

  // Funny word combinations requested in prompt
  funny: [
    'a tiny lion',
    'a dancing penguin',
    'disco potato',
    'quantum hamster',
    'sneaky taco',
    'ninja banana',
    'turbo snail',
    'caffeinated sloth',
    'pixel pancake',
    'funky robot',
    'cosmic llama',
    'invisible cat',
    'burrito wizard',
    'sleepy dragon',
    'bubblegum knight',
    'flying waffle',
    'galactic pickle',
    'laser chinchilla',
    'polite velociraptor',
    'dramatic hedgehog',
    'party cactus',
    'hovering muffin',
    'super pug'
  ]
};

// ============================================================================
// 3. DIFFICULTY CONFIGURATIONS
// ============================================================================
const DIFFICULTY_CONFIG = {
  easy: {
    name: 'EASY',
    shields: 3,
    pipeSpeed: 2.2,
    pipeGap: 190,
    pipeInterval: 2400, // ms between pipes
    wordSpeedBonusThreshold: 3.5, // seconds for fast bonus
    pool: ['simple', 'funny']
  },
  medium: {
    name: 'MEDIUM',
    shields: 2,
    pipeSpeed: 2.8,
    pipeGap: 160,
    pipeInterval: 2000,
    wordSpeedBonusThreshold: 2.5,
    pool: ['simple', 'medium', 'funny']
  },
  hard: {
    name: 'HARD',
    shields: 1,
    pipeSpeed: 3.6,
    pipeGap: 135,
    pipeInterval: 1700,
    wordSpeedBonusThreshold: 2.0,
    pool: ['medium', 'complex', 'funny']
  }
};

// ============================================================================
// 4. MAIN FLAPPYTYPE GAME CLASS
// ============================================================================
class FlappyTypeGame {
  constructor() {
    this.sound = new SoundEngine();

    // Game States: 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
    this.state = 'START';
    this.difficulty = 'medium';

    // Canvas references
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    // DOM UI elements
    this.hudScore = document.getElementById('hud-score');
    this.hudBestScore = document.getElementById('hud-best-score');
    this.hudWpm = document.getElementById('hud-wpm');
    this.hudPeakWpm = document.getElementById('hud-peak-wpm');
    this.hudAccuracy = document.getElementById('hud-accuracy');
    this.hudWordsCount = document.getElementById('hud-words-count');
    this.hudCombo = document.getElementById('hud-combo');
    this.hudComboFill = document.getElementById('hud-combo-fill');
    this.hudShieldsContainer = document.getElementById('hud-shields-container');
    this.hudShieldStatus = document.getElementById('hud-shield-status');
    this.currentDiffDisplay = document.getElementById('current-diff-display');
    this.keystrokeReceptor = document.getElementById('keystroke-receptor');

    this.dockStreakBadge = document.getElementById('dock-streak-badge');
    this.targetWordLetters = document.getElementById('target-word-letters');
    this.queueWord1 = document.getElementById('queue-word-1');
    this.queueWord2 = document.getElementById('queue-word-2');
    this.typingDock = document.getElementById('typing-dock');
    this.combatFeedbackLayer = document.getElementById('combat-feedback-layer');

    // Screens
    this.screenStart = document.getElementById('screen-start');
    this.screenPause = document.getElementById('screen-pause');
    this.screenGameOver = document.getElementById('screen-gameover');

    // Stats
    this.score = 0;
    this.survivalScore = 0;
    this.bestScore = 0;
    this.wordsCompleted = 0;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.consecutiveWords = 0;
    this.comboMultiplier = 1.0;
    this.peakWpm = 0;
    this.currentWpm = 0;
    this.gameStartTime = 0;
    this.activePlayTime = 0;
    this.lastFrameTime = performance.now();
    this.shields = 2;
    this.maxShields = 2;

    // Bird Entity
    this.bird = {
      x: 120,
      y: 250,
      radius: 18,
      velocity: 0,
      gravity: 0.38,
      flapStrength: -7.2,
      maxVelocity: 11,
      rotation: 0,
      invulnerableTimer: 0,
      wingCycle: 0
    };

    // Obstacles & Game World
    this.pipes = [];
    this.lastPipeSpawn = 0;
    this.particles = [];
    this.backgroundStars = [];
    this.cityBuildings = [];
    this.groundGridOffset = 0;

    // Word Queue System
    this.currentWord = '';
    this.wordQueue = [];
    this.typedCharIndex = 0;
    this.wordSpawnTime = 0;

    // High Scores table
    this.highScores = {
      easy: parseInt(localStorage.getItem('flappytype_hs_easy') || '0', 10),
      medium: parseInt(localStorage.getItem('flappytype_hs_medium') || '0', 10),
      hard: parseInt(localStorage.getItem('flappytype_hs_hard') || '0', 10)
    };

    this.init();
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------
  init() {
    this.setupResize();
    this.generateBackgroundDecorations();
    this.setupAudioUI();
    this.setupEventListeners();
    this.updateRecordDisplays();
    this.setDifficulty('medium');

    // Start rendering loop
    requestAnimationFrame((t) => this.loop(t));
  }

  setupResize() {
    const resize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;

      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.resetTransform();
      this.ctx.scale(this.dpr, this.dpr);

      // Re-center bird horizontally proportionately
      this.bird.x = Math.max(90, Math.min(180, this.width * 0.22));
    };

    window.addEventListener('resize', resize);
    resize();
  }

  generateBackgroundDecorations() {
    // Generate twinkling cyberpunk stars
    this.backgroundStars = [];
    for (let i = 0; i < 90; i++) {
      this.backgroundStars.push({
        x: Math.random() * 2000,
        y: Math.random() * 500,
        size: Math.random() * 2 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        color: Math.random() > 0.4 ? '#00f0ff' : '#ff2a85'
      });
    }

    // Generate neon city skyline silhouettes
    this.cityBuildings = [];
    let currentX = 0;
    while (currentX < 2400) {
      const bWidth = 35 + Math.random() * 65;
      const bHeight = 80 + Math.random() * 160;
      this.cityBuildings.push({
        x: currentX,
        width: bWidth,
        height: bHeight,
        windows: Math.random() > 0.2
      });
      currentX += bWidth + 8;
    }
  }

  setupAudioUI() {
    const btnSound = document.getElementById('btn-toggle-sound');
    const iconOn = document.getElementById('icon-sound-on');
    const iconOff = document.getElementById('icon-sound-off');

    const updateSoundIcons = () => {
      if (this.sound.muted) {
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
      } else {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
      }
    };

    updateSoundIcons();

    btnSound.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.init();
      this.sound.toggleMute();
      updateSoundIcons();
      this.focusReceptor();
    });
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENERS & INPUT HANDLING
  // --------------------------------------------------------------------------
  setupEventListeners() {
    // Canvas click keeps keyboard receptor focused
    this.canvas.addEventListener('pointerdown', (e) => {
      this.focusReceptor();
    });

    // Mobile / Touch Flap Button (virtual ArrowUp)
    const btnMobileFlap = document.getElementById('btn-mobile-flap');
    if (btnMobileFlap) {
      btnMobileFlap.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.handlePlayerFlap();
        this.focusReceptor();
      });
    }

    // Global Key Listener (Window capture)
    window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e), { passive: false });

    // Direct listener on keystroke receptor to guarantee Shift and flap keys are never trapped
    this.keystrokeReceptor.addEventListener('keydown', (e) => {
      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'ArrowUp' || e.code === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        this.handlePlayerFlap();
      }
    });

    // Keystroke input listener for virtual / IME keyboards (with deduplication guard)
    this.keystrokeReceptor.addEventListener('input', (e) => {
      const char = e.data;
      // Only process if NOT already handled by keydown within the last 100ms
      if (char && (!this.lastKeyProcessedTimestamp || performance.now() - this.lastKeyProcessedTimestamp > 100)) {
        this.handleLetterTyping(char);
      }
      this.keystrokeReceptor.value = '';
    });

    // Ensure hidden input stays focused on game arena click
    document.getElementById('arena-container').addEventListener('click', () => {
      this.focusReceptor();
    });

    // Difficulty Buttons on Start Screen
    document.querySelectorAll('.diff-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const diff = e.currentTarget.getAttribute('data-diff');
        this.setDifficulty(diff);
      });
    });

    // Start / Resume / Restart Buttons
    document.getElementById('btn-start-game').addEventListener('click', () => this.startGame());
    document.getElementById('btn-pause').addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePause();
    });
    document.getElementById('btn-resume-game').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-restart-from-pause').addEventListener('click', () => {
      this.screenPause.classList.add('hidden');
      this.startGame();
    });
    document.getElementById('btn-play-again').addEventListener('click', () => this.startGame());
    document.getElementById('btn-back-to-menu').addEventListener('click', () => this.showStartScreen());

    // Standalone ZIP Download
    document.getElementById('btn-download-zip').addEventListener('click', (e) => {
      e.stopPropagation();
      this.downloadProjectZip();
    });
  }

  focusReceptor() {
    if (this.keystrokeReceptor && this.state === 'PLAYING') {
      this.keystrokeReceptor.focus({preventScroll: true});
    }
  }

  setDifficulty(diffKey) {
    if (!DIFFICULTY_CONFIG[diffKey]) return;
    this.difficulty = diffKey;
    const cfg = DIFFICULTY_CONFIG[diffKey];

    this.maxShields = cfg.shields;
    this.shields = cfg.shields;
    this.currentDiffDisplay.textContent = cfg.name;

    // Update active UI buttons
    document.querySelectorAll('.diff-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-diff') === diffKey);
    });

    this.updateShieldsUI();
    this.updateRecordDisplays();
  }

  updateRecordDisplays() {
    document.getElementById('rec-easy').textContent = this.highScores.easy;
    document.getElementById('rec-medium').textContent = this.highScores.medium;
    document.getElementById('rec-hard').textContent = this.highScores.hard;

    this.bestScore = this.highScores[this.difficulty] || 0;
    this.hudBestScore.textContent = this.bestScore;
  }

  // --------------------------------------------------------------------------
  // FLAP AND KEYBOARD LOGIC (SHIFT KEY FLAPS)
  // --------------------------------------------------------------------------
  handlePlayerFlap() {
    this.sound.init();
    if (this.state === 'START') {
      this.startGame();
      return;
    }
    if (this.state === 'GAMEOVER') {
      this.startGame();
      return;
    }
    if (this.state === 'PAUSED') {
      return;
    }

    if (this.state === 'PLAYING') {
      this.bird.velocity = this.bird.flapStrength;
      this.bird.wingCycle = 1.0;
      this.sound.playFlap();

      // Emit thruster jet particles behind bird
      this.createThrusterBurst(this.bird.x - 14, this.bird.y + 4);
    }
  }

  handleGlobalKeyDown(e) {
    // Ensure audio context is ready on first key
    this.sound.init();

    // 1. Pause / Resume: ONLY Escape (NEVER 'P' or 'p', so typing 'penguin' or 'pipe' never pauses!)
    if (e.key === 'Escape') {
      e.preventDefault();
      if (this.state === 'PLAYING' || this.state === 'PAUSED') {
        this.togglePause();
      }
      return;
    }

    // 2. Start or Restart with Shift, ArrowUp, Enter, or Space on Overlay Screens
    if (this.state === 'START' && (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'ArrowUp' || e.code === 'ArrowUp' || e.code === 'Space' || e.key === 'Enter')) {
      e.preventDefault();
      this.startGame();
      return;
    }
    if (this.state === 'GAMEOVER' && (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'ArrowUp' || e.code === 'ArrowUp' || e.code === 'Space' || e.key === 'Enter')) {
      e.preventDefault();
      this.startGame();
      return;
    }

    // 3. In-game controls
    if (this.state === 'PLAYING') {
      // SHIFT (Left Shift or Right Shift) FLAPS THE BIRD! (ArrowUp also accepted)
      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'ArrowUp' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.handlePlayerFlap();
        return;
      }

      // Space key is strictly for typing spaces in phrases (e.g. "a tiny lion") - DOES NOT FLAP!
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        this.lastKeyProcessedTimestamp = performance.now();
        if (this.currentWord && this.currentWord[this.typedCharIndex] === ' ') {
          this.handleLetterTyping(' ');
        }
        return;
      }

      // Standard letter typing (including 'P' and 'p' without pausing)
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key !== ' ') {
          // Prevent default so the letter isn't also placed in the hidden input to trigger duplicate 'input' event!
          e.preventDefault();
          this.lastKeyProcessedTimestamp = performance.now();
          this.handleLetterTyping(e.key);
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // TYPING MECHANIC & WORD EVALUATION
  // --------------------------------------------------------------------------
  handleLetterTyping(char) {
    if (this.state !== 'PLAYING' || !this.currentWord) return;

    this.totalKeystrokes++;
    const targetChar = this.currentWord[this.typedCharIndex];

    // Case-insensitive letter matching
    if (char.toLowerCase() === targetChar.toLowerCase()) {
      // MATCH (CORRECT): Show green, NO vibration!
      this.correctKeystrokes++;
      this.typedCharIndex++;
      this.sound.playKeyClick();

      this.triggerCorrectFeedback();
      this.renderTargetWord();

      // Check if word completed!
      if (this.typedCharIndex >= this.currentWord.length) {
        this.completeWordSuccess();
      }
    } else {
      // TYPO (WRONG): Show in RED (NO frame vibration)
      this.handleTypo();
    }

    this.updateHUDStats();
  }

  triggerCorrectFeedback() {
    // Clear any active error styling
    this.typingDock.classList.remove('dock-error');
    const wordBox = document.getElementById('word-display-box');
    if (wordBox) wordBox.classList.remove('error-box');

    // Add smooth green glow without shaking
    this.typingDock.classList.add('dock-correct');
    if (wordBox) {
      wordBox.classList.add('correct-pulse');
    }

    clearTimeout(this.correctPulseTimer);
    this.correctPulseTimer = setTimeout(() => {
      this.typingDock.classList.remove('dock-correct');
      if (wordBox) wordBox.classList.remove('correct-pulse');
    }, 220);
  }

  handleTypo() {
    this.sound.playErrorBuzz();

    // Red color feedback on wrong typing - NO physical frame vibration
    const wordBox = document.getElementById('word-display-box');

    this.typingDock.classList.remove('dock-correct', 'dock-error');
    if (wordBox) wordBox.classList.remove('correct-pulse', 'error-box');

    // Add static red warning glow (stays rock-solid still)
    this.typingDock.classList.add('dock-error');
    if (wordBox) wordBox.classList.add('error-box');

    clearTimeout(this.errorTimer);
    this.errorTimer = setTimeout(() => {
      this.typingDock.classList.remove('dock-error');
      if (wordBox) wordBox.classList.remove('error-box');
    }, 350);

    // Reset current combo streak without giving score
    this.consecutiveWords = 0;
    this.comboMultiplier = 1.0;
    this.updateComboUI();

    // Flash current target character in bright red
    const chars = this.targetWordLetters.querySelectorAll('.word-char');
    if (chars[this.typedCharIndex]) {
      chars[this.typedCharIndex].classList.add('error');
      setTimeout(() => {
        if (chars[this.typedCharIndex]) {
          chars[this.typedCharIndex].classList.remove('error');
        }
      }, 350);
    }

    this.spawnCombatFloatText(this.bird.x + 30, this.bird.y - 15, 'MISFIRE!', '#ff3366');
  }

  completeWordSuccess() {
    const elapsedSeconds = (performance.now() - this.wordSpawnTime) / 1000;
    const cfg = DIFFICULTY_CONFIG[this.difficulty];

    // 1. Scoring Calculation
    let wordPoints = 100;
    let isFast = false;

    // Fast typing bonus
    if (elapsedSeconds <= cfg.wordSpeedBonusThreshold) {
      wordPoints += 150;
      isFast = true;
    } else if (elapsedSeconds <= cfg.wordSpeedBonusThreshold * 1.5) {
      wordPoints += 75;
    }

    // Apply combo multiplier
    const totalAward = Math.round(wordPoints * this.comboMultiplier);
    this.score += totalAward;
    this.wordsCompleted++;
    this.consecutiveWords++;

    // Increment combo multiplier up to 4.0x
    this.comboMultiplier = Math.min(4.0, +(1.0 + (this.consecutiveWords * 0.25)).toFixed(2));

    // Shield Recovery reward for 5x streak!
    if (this.consecutiveWords > 0 && this.consecutiveWords % 5 === 0) {
      if (this.shields < this.maxShields) {
        this.shields++;
        this.updateShieldsUI();
        this.spawnCombatFloatText(this.bird.x, this.bird.y - 35, '+1 SHIELD RESTORED!', '#00f59b');
      } else {
        this.score += 300;
        this.spawnCombatFloatText(this.bird.x, this.bird.y - 35, '+300 OVERCHARGED!', '#ffbe0b');
      }
    }

    // Sound effect with combo pitch scaling
    this.sound.playWordSuccess(this.comboMultiplier);

    // Particle Burst on bird & dock
    this.createWordBurstParticles(this.bird.x, this.bird.y);

    // Floating text indicator
    const popupText = isFast 
      ? `+${totalAward} FAST COMBO ${this.comboMultiplier}x!` 
      : `+${totalAward} (${this.comboMultiplier}x)`;
    this.spawnCombatFloatText(
      this.bird.x + 20, 
      this.bird.y - 20, 
      popupText, 
      this.comboMultiplier > 2 ? '#ffbe0b' : '#00f0ff'
    );

    // Dock success flash
    this.typingDock.classList.remove('dock-success');
    void this.typingDock.offsetWidth;
    this.typingDock.classList.add('dock-success');
    setTimeout(() => this.typingDock.classList.remove('dock-success'), 400);

    // Advance to next word from queue
    this.advanceWordQueue();
    this.updateHUDStats();
    this.updateComboUI();
  }

  // --------------------------------------------------------------------------
  // WORD QUEUE MANAGEMENT
  // --------------------------------------------------------------------------
  pullRandomWord() {
    const cfg = DIFFICULTY_CONFIG[this.difficulty];
    // Random pool picker (weighted to introduce funny words ~35% of the time)
    const isFunny = Math.random() < 0.35;
    let pool = isFunny ? WORD_BANK.funny : WORD_BANK[cfg.pool[Math.floor(Math.random() * cfg.pool.length)]];
    if (!pool || pool.length === 0) pool = WORD_BANK.simple;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  initWordQueue() {
    this.wordQueue = [
      this.pullRandomWord(),
      this.pullRandomWord(),
      this.pullRandomWord()
    ];
    this.advanceWordQueue();
  }

  advanceWordQueue() {
    this.currentWord = this.wordQueue.shift() || this.pullRandomWord();
    this.wordQueue.push(this.pullRandomWord());
    this.typedCharIndex = 0;
    this.wordSpawnTime = performance.now();

    this.renderTargetWord();
    this.renderQueuePreview();
  }

  renderTargetWord() {
    this.targetWordLetters.innerHTML = '';
    const word = this.currentWord;

    for (let i = 0; i < word.length; i++) {
      const span = document.createElement('span');
      span.className = 'word-char';
      const char = word[i];

      if (char === ' ') {
        span.classList.add('space-char');
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }

      if (i < this.typedCharIndex) {
        span.classList.add('matched');
      } else if (i === this.typedCharIndex) {
        span.classList.add('current');
      }

      this.targetWordLetters.appendChild(span);
    }

    this.dockStreakBadge.textContent = `${this.consecutiveWords} STREAK`;
  }

  renderQueuePreview() {
    if (this.queueWord1 && this.wordQueue[0]) {
      this.queueWord1.textContent = this.wordQueue[0];
    }
    if (this.queueWord2 && this.wordQueue[1]) {
      this.queueWord2.textContent = this.wordQueue[1];
    }
  }

  // --------------------------------------------------------------------------
  // GAME LIFECYCLE & STATE TRANSITIONS
  // --------------------------------------------------------------------------
  startGame() {
    this.state = 'PLAYING';
    const cfg = DIFFICULTY_CONFIG[this.difficulty];

    // Reset Bird
    this.bird.x = Math.max(90, Math.min(180, this.width * 0.22));
    this.bird.y = this.height * 0.42;
    this.bird.velocity = 0;
    this.bird.rotation = 0;
    this.bird.invulnerableTimer = 0;

    // Reset stats
    this.score = 0;
    this.survivalScore = 0;
    this.wordsCompleted = 0;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.consecutiveWords = 0;
    this.comboMultiplier = 1.0;
    this.peakWpm = 0;
    this.currentWpm = 0;
    this.shields = cfg.shields;
    this.maxShields = cfg.shields;

    this.pipes = [];
    this.particles = [];
    this.lastPipeSpawn = performance.now() + 800; // brief delay before first pipe
    this.gameStartTime = performance.now();
    this.activePlayTime = 0;
    this.lastFrameTime = performance.now();

    // Hide overlays
    this.screenStart.classList.add('hidden');
    this.screenPause.classList.add('hidden');
    this.screenGameOver.classList.add('hidden');

    this.updateShieldsUI();
    this.updateComboUI();
    this.initWordQueue();
    this.updateHUDStats();

    // Automatically focus hidden input for smooth typing
    setTimeout(() => this.focusReceptor(), 80);
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      // Populate pause modal stats
      document.getElementById('pause-score').textContent = this.score;
      document.getElementById('pause-wpm').textContent = this.currentWpm;
      const acc = this.totalKeystrokes > 0 ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100) : 100;
      document.getElementById('pause-accuracy').textContent = `${acc}%`;

      this.screenPause.classList.remove('hidden');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.lastFrameTime = performance.now();
      this.screenPause.classList.add('hidden');
      this.focusReceptor();
    }
  }

  showStartScreen() {
    this.state = 'START';
    this.screenGameOver.classList.add('hidden');
    this.screenPause.classList.add('hidden');
    this.screenStart.classList.remove('hidden');
    this.updateRecordDisplays();
  }

  triggerGameOver(cause = 'COLLISION DETECTED') {
    this.state = 'GAMEOVER';
    this.sound.playGameOver();

    // Check High Score
    const diffKey = this.difficulty;
    const isNewHigh = this.score > (this.highScores[diffKey] || 0);
    if (isNewHigh) {
      this.highScores[diffKey] = this.score;
      localStorage.setItem(`flappytype_hs_${diffKey}`, this.score.toString());
      this.sound.playHighScore();
    }

    // Populate Game Over Screen details
    document.getElementById('go-final-score').textContent = this.score;
    document.getElementById('go-cause').textContent = cause;
    document.getElementById('go-words').textContent = this.wordsCompleted;
    document.getElementById('go-peak-wpm').innerHTML = `${this.peakWpm} <small>WPM</small>`;

    const acc = this.totalKeystrokes > 0 ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100) : 100;
    document.getElementById('go-accuracy').textContent = `${acc}%`;
    document.getElementById('go-max-combo').textContent = `${this.comboMultiplier.toFixed(1)}x`;

    const totalSecs = Math.floor(this.activePlayTime / 1000);
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    document.getElementById('go-time').textContent = `${mins}:${secs}`;
    document.getElementById('go-difficulty').textContent = DIFFICULTY_CONFIG[this.difficulty].name;

    const highBadge = document.getElementById('gameover-high-badge');
    if (isNewHigh) {
      highBadge.classList.remove('hidden');
    } else {
      highBadge.classList.add('hidden');
    }

    this.updateRecordDisplays();
    this.screenGameOver.classList.remove('hidden');
  }

  // --------------------------------------------------------------------------
  // HUD UPDATES & ANALYTICS
  // --------------------------------------------------------------------------
  updateHUDStats() {
    this.hudScore.textContent = this.score;

    // Standard typing speed WPM formula: (correct characters typed / 5) / (minutes elapsed)
    if (this.activePlayTime >= 1200 && this.correctKeystrokes > 0) {
      const minutesElapsed = this.activePlayTime / 60000;
      this.currentWpm = Math.max(0, Math.round((this.correctKeystrokes / 5) / minutesElapsed));
    } else {
      this.currentWpm = 0;
    }

    if (this.currentWpm > this.peakWpm) {
      this.peakWpm = this.currentWpm;
    }
    this.hudWpm.textContent = this.currentWpm;
    this.hudPeakWpm.textContent = this.peakWpm;

    // Accuracy: (correctKeystrokes / totalKeystrokes) * 100%
    const acc = this.totalKeystrokes > 0 
      ? Math.min(100, Math.max(0, Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100))) 
      : 100;
    this.hudAccuracy.textContent = `${acc}%`;
    this.hudWordsCount.textContent = this.wordsCompleted;
  }

  updateComboUI() {
    this.hudCombo.textContent = `${this.comboMultiplier.toFixed(1)}x`;
    const percentage = Math.min(100, ((this.comboMultiplier - 1.0) / 3.0) * 100);
    this.hudComboFill.style.width = `${percentage}%`;
  }

  updateShieldsUI() {
    this.hudShieldsContainer.innerHTML = '';
    for (let i = 0; i < this.maxShields; i++) {
      const dot = document.createElement('span');
      dot.className = 'shield-dot';
      if (i < this.shields) {
        dot.classList.add('active');
      }
      this.hudShieldsContainer.appendChild(dot);
    }

    if (this.shields > 0) {
      this.hudShieldStatus.textContent = `${this.shields} ACTIVE`;
      this.hudShieldStatus.style.color = 'var(--neon-cyan)';
    } else {
      this.hudShieldStatus.textContent = 'CRITICAL';
      this.hudShieldStatus.style.color = 'var(--neon-red)';
    }
  }

  spawnCombatFloatText(x, y, text, color = '#00f0ff') {
    const el = document.createElement('div');
    el.className = 'combat-float-text';
    el.textContent = text;
    el.style.left = `${Math.max(10, Math.min(this.width - 150, x))}px`;
    el.style.top = `${Math.max(20, Math.min(this.height - 100, y))}px`;
    el.style.color = color;

    this.combatFeedbackLayer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1300);
  }

  // --------------------------------------------------------------------------
  // PHYSICS & UPDATE LOOP
  // --------------------------------------------------------------------------
  loop(timestamp) {
    const dt = Math.min(32, timestamp - this.lastFrameTime);
    this.lastFrameTime = timestamp;

    if (this.state === 'PLAYING') {
      this.activePlayTime += dt;
      this.updatePhysics(dt, timestamp);

      // Continuously update live WPM & HUD stats (throttled to 120ms to prevent DOM thrash)
      if (!this.lastHudUpdate || timestamp - this.lastHudUpdate > 120) {
        this.updateHUDStats();
        this.lastHudUpdate = timestamp;
      }
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  updatePhysics(dt, timestamp) {
    const cfg = DIFFICULTY_CONFIG[this.difficulty];

    // 1. Bird Physics
    this.bird.velocity += this.bird.gravity;
    if (this.bird.velocity > this.bird.maxVelocity) {
      this.bird.velocity = this.bird.maxVelocity;
    }
    this.bird.y += this.bird.velocity;

    // Wing flap animation cycle
    this.bird.wingCycle = Math.max(0, this.bird.wingCycle - 0.04);

    // Calculate rotation angle based on velocity (-25 deg up to +70 deg diving)
    const targetRot = Math.min(Math.PI / 2.5, Math.max(-Math.PI / 7, (this.bird.velocity * 0.08)));
    this.bird.rotation += (targetRot - this.bird.rotation) * 0.15;

    // Invulnerability decay
    if (this.bird.invulnerableTimer > 0) {
      this.bird.invulnerableTimer -= dt;
    }

    // Floor collision
    const floorY = this.height - 40;
    if (this.bird.y + this.bird.radius >= floorY) {
      this.bird.y = floorY - this.bird.radius;
      this.handleDamage('GROUND IMPACT');
      return;
    }

    // Ceiling boundary
    if (this.bird.y - this.bird.radius <= 0) {
      this.bird.y = this.bird.radius;
      this.bird.velocity = 0;
    }

    // 2. Obstacle Pipes Spawning
    if (timestamp - this.lastPipeSpawn > cfg.pipeInterval) {
      this.spawnPipe();
      this.lastPipeSpawn = timestamp;
    }

    // 3. Move Pipes & Check Collisions
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.x -= cfg.pipeSpeed;

      // Pipe oscillation for Hard difficulty
      if (pipe.oscillates) {
        pipe.gapY += Math.sin(timestamp * 0.003) * 0.8;
      }

      // Check if bird passed the pipe
      if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
        pipe.passed = true;
        this.score += 25; // Survival score per pipe
        this.survivalScore += 25;
        this.updateHUDStats();
        this.spawnCombatFloatText(this.bird.x, this.bird.y - 25, '+25 DODGE', '#00f59b');
      }

      // Collision Detection with Pipe Rectangles
      if (this.bird.invulnerableTimer <= 0) {
        const topPipeRect = { x: pipe.x, y: 0, width: pipe.width, height: pipe.gapY };
        const bottomPipeRect = {
          x: pipe.x,
          y: pipe.gapY + pipe.gapHeight,
          width: pipe.width,
          height: this.height - (pipe.gapY + pipe.gapHeight) - 40
        };

        if (this.checkCircleRectCollision(this.bird, topPipeRect) ||
            this.checkCircleRectCollision(this.bird, bottomPipeRect)) {
          this.handleDamage('ENERGY PILLAR COLLISION');
        }
      }

      // Remove offscreen pipes
      if (pipe.x + pipe.width < -50) {
        this.pipes.splice(i, 1);
      }
    }

    // 4. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 5. Scroll ground grid
    this.groundGridOffset = (this.groundGridOffset + cfg.pipeSpeed) % 40;
  }

  spawnPipe() {
    const cfg = DIFFICULTY_CONFIG[this.difficulty];
    const minGapY = 70;
    const maxGapY = this.height - cfg.pipeGap - 120;
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);

    this.pipes.push({
      x: this.width + 40,
      width: 64,
      gapY: gapY,
      gapHeight: cfg.pipeGap,
      passed: false,
      oscillates: this.difficulty === 'hard' && Math.random() > 0.4
    });
  }

  checkCircleRectCollision(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const distX = circle.x - closestX;
    const distY = circle.y - closestY;
    const distSquared = distX * distX + distY * distY;

    // Use slightly forgiving collision radius (14 instead of 18) for great player feel
    return distSquared < 14 * 14;
  }

  handleDamage(cause) {
    this.sound.playHit();
    this.createExplosionParticles(this.bird.x, this.bird.y, '#ff3366');

    if (this.shields > 0) {
      this.shields--;
      this.updateShieldsUI();
      this.bird.invulnerableTimer = 1600; // 1.6s grace period
      this.bird.velocity = -4; // small rebound lift
      this.spawnCombatFloatText(this.bird.x, this.bird.y - 30, 'SHIELD SAVED YOU!', '#ffbe0b');
    } else {
      this.triggerGameOver(cause);
    }
  }

  // --------------------------------------------------------------------------
  // PARTICLE EFFECTS
  // --------------------------------------------------------------------------
  createThrusterBurst(x, y) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x,
        y: y + (Math.random() * 4 - 2),
        vx: -(Math.random() * 2.5 + 2),
        vy: (Math.random() * 2 - 1),
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff2a85',
        life: 250,
        maxLife: 250
      });
    }
  }

  createWordBurstParticles(x, y) {
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const speed = Math.random() * 4 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: i % 2 === 0 ? '#00f0ff' : '#ffbe0b',
        life: 450,
        maxLife: 450
      });
    }
  }

  createExplosionParticles(x, y, color = '#ff3366') {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 2,
        color: color,
        life: 600,
        maxLife: 600
      });
    }
  }

  // --------------------------------------------------------------------------
  // CANVAS RENDERING PIPELINE
  // --------------------------------------------------------------------------
  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Dark Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#060711');
    skyGrad.addColorStop(0.65, '#0b0f24');
    skyGrad.addColorStop(1, '#130d24');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Parallax Stars
    for (const star of this.backgroundStars) {
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.fillRect(star.x % w, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1.0;

    // 3. Parallax City Skyline
    this.renderCitySkyline();

    // 4. Energy Pipes / Obstacles
    this.renderPipes();

    // 5. Cyber Grid Ground Floor
    this.renderCyberGround();

    // 6. Particles
    this.renderParticles();

    // 7. Cyber Bird
    this.renderCyberBird();
  }

  renderCitySkyline() {
    const ctx = this.ctx;
    const groundY = this.height - 40;

    ctx.save();
    ctx.fillStyle = 'rgba(10, 14, 30, 0.7)';
    for (const b of this.cityBuildings) {
      const bx = (b.x - (this.groundGridOffset * 0.35)) % (this.width + 300) - 100;
      const by = groundY - b.height;
      ctx.fillRect(bx, by, b.width, b.height);

      // Subtle cyan neon rim on top of buildings
      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.fillRect(bx, by, b.width, 2);
      ctx.fillStyle = 'rgba(10, 14, 30, 0.7)';
    }
    ctx.restore();
  }

  renderPipes() {
    const ctx = this.ctx;
    const groundY = this.height - 40;

    for (const pipe of this.pipes) {
      // Top Pipe
      this.drawPipeSection(pipe.x, 0, pipe.width, pipe.gapY, true);

      // Bottom Pipe
      const bottomY = pipe.gapY + pipe.gapHeight;
      const bottomHeight = groundY - bottomY;
      this.drawPipeSection(pipe.x, bottomY, pipe.width, bottomHeight, false);

      // Neon Energy crackle across the gap
      this.drawEnergyGap(pipe.x, pipe.gapY, pipe.width, pipe.gapHeight);
    }
  }

  drawPipeSection(x, y, width, height, isTop) {
    const ctx = this.ctx;
    ctx.save();

    // Pipe Body Gradient
    const pipeGrad = ctx.createLinearGradient(x, 0, x + width, 0);
    pipeGrad.addColorStop(0, '#0d1326');
    pipeGrad.addColorStop(0.3, '#1a2444');
    pipeGrad.addColorStop(0.7, '#131a33');
    pipeGrad.addColorStop(1, '#090d1a');

    ctx.fillStyle = pipeGrad;
    ctx.fillRect(x, y, width, height);

    // Glowing Neon Border
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Hazard Stripes & Cap
    const capHeight = 22;
    const capWidth = width + 10;
    const capX = x - 5;
    const capY = isTop ? y + height - capHeight : y;

    // Cap Gradient
    const capGrad = ctx.createLinearGradient(capX, 0, capX + capWidth, 0);
    capGrad.addColorStop(0, '#00f0ff');
    capGrad.addColorStop(0.5, '#7928ca');
    capGrad.addColorStop(1, '#ff0080');

    ctx.fillStyle = capGrad;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.fillRect(capX, capY, capWidth, capHeight);

    ctx.restore();
  }

  drawEnergyGap(x, gapY, width, gapHeight) {
    const ctx = this.ctx;
    ctx.save();
    // Glowing laser beam indicator
    ctx.strokeStyle = 'rgba(255, 42, 133, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(x + width / 2, gapY);
    ctx.lineTo(x + width / 2, gapY + gapHeight);
    ctx.stroke();
    ctx.restore();
  }

  renderCyberGround() {
    const ctx = this.ctx;
    const groundY = this.height - 40;
    const groundHeight = 40;

    // Solid dark floor
    ctx.fillStyle = '#060814';
    ctx.fillRect(0, groundY, this.width, groundHeight);

    // Top Glowing Laser Rail
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.stroke();

    // Perspective moving grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1;
    for (let x = -this.groundGridOffset; x < this.width + 40; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x - 20, this.height);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.save();
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  renderCyberBird() {
    const ctx = this.ctx;
    const b = this.bird;

    // Flash during invulnerability
    if (b.invulnerableTimer > 0 && Math.floor(b.invulnerableTimer / 100) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rotation);

    // 1. Pulsing Shield Bubble (if shields remain)
    if (this.shields > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, b.radius + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }

    // 2. Cyber Bird Aerodynamic Body
    ctx.save();
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;

    // Main fuselage
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, b.radius + 4, b.radius - 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cyan accent speed stripes
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(8, -2);
    ctx.lineTo(4, 2);
    ctx.lineTo(-8, 0);
    ctx.closePath();
    ctx.fill();

    // Cyber Visor Eye (Glowing neon pink / purple)
    ctx.fillStyle = '#ff2a85';
    ctx.shadowColor = '#ff2a85';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(8, -3, 6, 3, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Chrome Beak
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.moveTo(16, -2);
    ctx.lineTo(24, 1);
    ctx.lineTo(15, 5);
    ctx.closePath();
    ctx.fill();

    // 3. Animated Wing
    const wingY = -6 - (b.wingCycle * 10);
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#ff2a85';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(-14, wingY);
    ctx.lineTo(2, wingY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Thruster engine exhaust nozzle
    ctx.fillStyle = '#475569';
    ctx.fillRect(-18, -3, 5, 6);

    ctx.restore();
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // DOWNLOAD STANDALONE PROJECT ZIP
  // --------------------------------------------------------------------------
  async downloadProjectZip() {
    try {
      const JSZipLib = window.JSZip || (typeof JSZip !== 'undefined' ? JSZip : null);
      if (!JSZipLib) {
        alert('JSZip library is loading. Please try again in a moment.');
        return;
      }

      const zip = new JSZipLib();

      // Read current HTML, CSS, JS source code
      const htmlResp = await fetch('./index.html');
      const htmlContent = await htmlResp.text();

      const cssResp = await fetch('./style.css');
      const cssContent = await cssResp.text();

      const jsResp = await fetch('./script.js');
      const jsContent = await jsResp.text();

      let readmeContent = `# FlappyType - Neon Typing & Flying Arcade Game

A fast-paced indie browser game combining classic Flappy Bird flight mechanics with speed-typing thrills.

## How to Play

1. **Flight Controls**:
   - Press **Shift** (Left or Right Shift) to flap your bird and gain altitude.
   - Dodge the neon energy pillars and avoid hitting the floor.

2. **Typing & Scoring**:
   - Type the target word or phrase displayed in the bottom typing bay.
   - For phrases with spaces (e.g., *"a tiny lion"*), pressing **Space** enters the space in the phrase without flapping the bird.
   - Complete words fast to earn huge speed bonuses.
   - Consecutive correct words build your Combo Multiplier up to **4.0x**!
   - Every 5-streak restores 1 Shield!

3. **Difficulty Modes**:
   - **Easy**: 3 Shields, wide gaps, gentle scrolling speed.
   - **Medium**: 2 Shields, balanced speed, mixed words and phrases.
   - **Hard**: 1 Shield, narrow gaps, tricky high-speed phrases.

## Running Locally

Simply open \`index.html\` in any modern browser (Chrome, Firefox, Safari, Edge).
No build steps or server required!
`;

      zip.file('index.html', htmlContent);
      zip.file('style.css', cssContent);
      zip.file('script.js', jsContent);
      zip.file('README.md', readmeContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'FlappyType-Game.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Exporting zip failed:', err);
    }
  }
}

// ============================================================================
// BOOTSTRAP GAME INSTANCE ON DOM LOAD
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  window.flappyTypeApp = new FlappyTypeGame();
});
