# MultiplyQuest — Multi-Digit Multiplication (Grade 4)

A gamified, narrated Grade 4 math module teaching multi-digit multiplication via the **Area Model (Break-Apart / Partial Products)** and the **Standard Algorithm (Regrouping & Multi-Row Shifting)**, built on the Numberbound five-phase architecture (**Wonder → Story → Simulate → Practice → Reflect**). Aligned with the Singapore MOE Primary 4 Mathematics syllabus.

---

## Quick Start

```bash
npm install
npm run dev        # Launch local dev server at http://localhost:5173
npm run build      # Production build -> dist/
npm run preview    # Preview production build locally
```

---

## 5-Phase Learning Journey

1. **Wonder (01)**
   - *The Big Mystery*: How to multiply $2,314 \times 4$ cupcakes without adding 4 times.
   - Floating particle effects, glowing display, curious mascot dialogue with Flip the Fox.

2. **Story (02) — "Max's Big Bakery Order"**
   - 4-panel split card featuring English characters: **Max (👦)**, **Sophie (👧)**, and **Flip the Fox (🦊)**.
   - Introduces the bakery order ($2,314 \times 4$), Sophie's Area Model place-value breakdown, Flip's standard algorithm regrouping, and Max's 3-digit $\times$ 2-digit stickers order ($128 \times 45 = 5,760$).

3. **Simulate (03) — 4 Interactive Multiplication Labs**
   - **Station A: Area Model Lab** 🧩 — Tap place-value boxes (Thousands, Hundreds, Tens, Ones) to reveal partial products and sum them up.
   - **Station B: Regroup & Carry Machine** 🔢 — Step through the vertical standard algorithm column-by-column with animated carry bubbles.
   - **Station C: 2-Digit Shift Workshop** 🎚️ — Interactive $3\text{-digit} \times 2\text{-digit}$ multiplication demonstrating why the tens multiplier requires a column shift and trailing zero.
   - **Station D: Error Detective** 🔍 — Inspect student calculations, diagnose common mistakes (forgot to carry, missed shift zero), and repair answers.

4. **Practice / Play (04) — 10 Worlds & Boss Battles**
   - 10 themed multiplication worlds with 100 procedurally generated questions.
   - Category badges, visual diagrams (Multiplication Triangles, Vertical boxes, Area models), hints, and instant feedback overlays.
   - **Kingdom Map modal** and **Boss Battle modal** with 3 lives and exclusive badge rewards.

5. **Reflect (05) — Concept Quiz & Grand Master Scorecard**
   - 3-question strategy recap quiz.
   - Learning journal with quick-insert formula chips.
   - **Grand Master Trophy Scorecard**: Total score / 100, XP earned, best streak, animated stars, and unlocked badges list.

---

## Audio Pipeline

Compatible with the ElevenLabs pipeline documented in `audio_generation_pipeline (5).md` (Alice voice `Xb7hH8MSUJpSbSDYk0k2`):

1. Add `VITE_ELEVENLABS_API_KEY=your_key_here` to `.env.local`.
2. Run `npm run generate-audio` to pre-generate all narration `.mp3` files into `public/assets/audio/` and update `src/utils/audioMap.js`.
3. The app works seamlessly with zero latency and silent fallback if audio is not yet generated.

---

## Image Prompts & Asset Specs

See [`image_generation_prompts.md`](./image_generation_prompts.md) for detailed prompts, exact dimensions (`1200 × 800 px`, 3:2 landscape), and style guidelines for all story panels and character avatars.
