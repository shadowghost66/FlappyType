# FlappyType ⚡

A polished, high-octane indie browser game blending classic **Flappy Bird** flight mechanics with continuous **speed-typing**, combo multipliers, funny phrase combinations, and retro synthwave visuals.

Built with **100% pure vanilla HTML5, CSS3, and JavaScript (Canvas 2D + Web Audio API)**. No external backend, paid APIs, or dependencies required!

---

## 📁 Project Structure

```text
flappytype/
├── index.html        # Game layout, HUD dashboard, Canvas arena, and modal overlays
├── style.css         # Cyberpunk/synthwave styling, neon animations, and responsive layout
├── script.js         # Game loop, physics engine, typing evaluator, sound synthesizer, and UI logic
└── README.md         # Documentation, rules, and running instructions
```

---

## 🎮 Gameplay & Core Mechanics

1. **Flight Controls**:
   - **Shift** (`Shift` key - either Left or Right Shift) flaps the bird's wings and gains altitude.
   - Navigate through neon energy pillars and avoid crashing into the floor.

2. **Typing & Scoring**:
   - Words and funny phrases stream continuously in the bottom typing bay.
   - Type letters on your keyboard (`A`–`Z`) to match characters.
   - **Correct Keystrokes**: Glow in vibrant neon emerald green.
   - **Incorrect Keystrokes**: Glow in high-contrast neon red with a subtle warning tone. The frame stays stable and still (no distracting physical shaking).
   - **No Unwanted Pauses**: Type words containing 'P' (like "penguin", "pipe", "pixel") smoothly without accidental pausing. Only `Escape` pauses the run.
   - **Spaces**: For multi-word phrases (e.g. *"a tiny lion"*, *"a dancing penguin"*), pressing **Space** enters the space in the phrase without flapping your bird.
   - **Fast Typing Bonus**: Complete words within seconds of appearing for massive bonus points!
   - **Consecutive Streak & Multiplier**: String together correct words without mistakes to boost your score multiplier from **1.0x up to 4.0x**!
   - **Shield Overcharge**: Every 5 consecutive words restores a broken Shield or grants +300 bonus score!

3. **Difficulty Modes**:
   - **Easy**: 3 Shields, wide gaps, gentle scrolling speed, simple vocabulary.
   - **Medium**: 2 Shields, balanced speed, mixed words and hilarious combos.
   - **Hard**: 1 Shield (sudden death), narrow gaps, oscillating pillars, long complex phrases.

4. **Real-time Analytics**:
   - Live **WPM** (Words Per Minute) calculated via standard typing formula: `(correct keystrokes / 5) / minutes elapsed`.
   - Typing **Accuracy %** (`correct / total * 100`) and total words completed.
   - Best score automatically saved to browser `localStorage` per difficulty.

5. **Audio Engine**:
   - Built-in retro synth sound effects generated via Web Audio API (flap swoosh, mechanical keystrokes, arpeggiated success chords, typo buzzer, and game over chimes).
   - Instant mute toggle button with state persistence.

---

## 🚀 Running the Game

You can run **FlappyType** in any modern web browser without installing anything!

### Option 1: Direct File Launch (Easiest)
Double-click `index.html` or drag it into any web browser (Google Chrome, Firefox, Safari, Microsoft Edge).

### Option 2: Live Server in VS Code
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.
3. The game will launch automatically at `http://localhost:5500`.

### Option 3: Local Python HTTP Server
Run the following command in your terminal inside the project directory:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Option 4: Vite Development Server
If running in a Vite environment:
```bash
npm run dev
```

---

## 📦 In-Game ZIP Export

Click the **"Export ZIP"** button in the top right dashboard of the game to instantly download a ready-to-run `.zip` archive containing `index.html`, `style.css`, `script.js`, and `README.md`.

---

## ⌨️ Controls Summary

| Action | Control |
|---|---|
| **Flap Bird** | `Shift` key (Left or Right Shift, or on-screen Flap button) |
| **Type Letters** | Any standard keyboard keys (`A`–`Z`) |
| **Type Spaces** | `Space` (advances space in multi-word phrases) |
| **Pause / Resume** | `Escape` key or top Pause button (no accidental pause when typing 'P') |
| **Start / Restart** | `Shift`, `Arrow Up`, `PageUp`, `Enter`, or `Space` on overlay screens |
| **Toggle Audio** | Click the Sound icon in the top right |

---

## 📄 License
Apache-2.0
