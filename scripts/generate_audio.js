// scripts/generate_audio.js
// Pre-generates all known narration phrases as .mp3 files into
// public/assets/audio/ and writes src/utils/audioMap.js.
//
// Usage: npm run generate-audio
// Requires: VITE_ELEVENLABS_API_KEY in .env.local

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not set in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_PATH  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
};

// ── Phrases to pre-generate ────────────────────────────────────────────────
const phrases = [
  // WONDER
  { text: "The Big Mystery! If Max needs to pack 4 party boxes, each holding 2,314 mini cupcakes...", style: 'encouragement' },
  { text: "How can we find the total cupcakes in seconds without adding 2,314 four times?", style: 'question' },
  { text: "Let's investigate how breaking numbers apart and using the standard algorithm make multi-digit multiplication fast and easy!", style: 'thinking' },

  // STORY (Panels 0–3)
  { text: "Max just received the largest order of his life — 4 giant party boxes for the Sunnyvale Town Festival, each holding 2,314 mini cupcakes!", style: 'statement' },
  { text: "Max starts writing repeated addition on paper and sighs: 'There must be a faster way than adding 2,314 four times…'", style: 'thinking' },
  { text: "Sophie dashes into the bakery! 'Multiplication is super fast when you use the Area Model! Break 2,314 apart by place value: 2,000 plus 300 plus 10 plus 4.'", style: 'statement' },
  { text: "Multiply each place-value chunk by 4, then sum them up!", style: 'statement' },
  { text: "Flip the Fox pulls out his chalkboard. 'You can also line the digits up vertically and multiply the standard algorithm way!'", style: 'statement' },
  { text: "Multiply right-to-left, regrouping carried numbers into the next column. Same exact total in seconds!", style: 'statement' },
  { text: "Max packs all 9,256 cupcakes with zero mistakes!", style: 'celebration' },
  { text: "Next, he calculates that his 45 helpers each get 128 thank-you stickers. That is 3-digit times 2-digit multiplication, and Max solves it in a flash!", style: 'statement' },
  { text: "Let's simulate and practice multiplying big numbers!", style: 'encouragement' },

  // SIMULATE INTROS
  { text: "Station A — Area Model Lab!", style: 'statement' },
  { text: "Break multi-digit numbers apart into place-value boxes, multiply each box, and add the partial products together. Let's explore!", style: 'statement' },
  { text: "Station B — Regroup and Carry Machine!", style: 'statement' },
  { text: "Watch the standard vertical algorithm step by step. Multiply each digit and carry numbers into the next column!", style: 'statement' },
  { text: "Station C — Two-Digit Shift Workshop!", style: 'statement' },
  { text: "When multiplying 3-digit by 2-digit numbers, multiply by the ones, then shift one place left for the tens row!", style: 'statement' },
  { text: "Station D — Error Detective!", style: 'statement' },
  { text: "Inspect student work to spot common multiplication mistakes and fix them like a math detective!", style: 'statement' },

  // SIMULATE INTERACTIVE DIALOGUES
  // Station A
  { text: "Great! All partial products found. Now add them together!", style: 'celebration' },
  { text: "Check your addition of the partial products and try again.", style: 'thinking' },
  // Station B
  { text: "Remember: write the ones digit in the answer and carry the tens digit!", style: 'thinking' },
  { text: "Check your calculation and try again.", style: 'thinking' },
  // Station C
  { text: "Exactly! The tens digit represents tens. Pull the shift lever to place the 0!", style: 'celebration' },
  { text: "Shift 0 placed! Now calculate the tens row.", style: 'statement' },
  // Station D
  { text: "Flawed step identified! Now diagnose the mathematical cause.", style: 'celebration' },
  { text: "That step is calculated correctly. Inspect the other steps!", style: 'thinking' },
  { text: "Exact diagnosis! Now calculate the TRUE repaired product.", style: 'statement' },
  { text: "Review the math carefully to diagnose the exact mistake.", style: 'thinking' },
  { text: "Calculate the exact product step-by-step.", style: 'thinking' },

  // PLAY / PRACTICE
  { text: "Spot on! Great multiplication!", style: 'statement' },
  { text: "Correct! You got it!", style: 'statement' },
  { text: "Excellent calculation!", style: 'statement' },
  { text: "Super job! Right on the money!", style: 'statement' },
  { text: "Awesome work! You are on a roll!", style: 'encouragement' },
  { text: "Not quite. Check each step carefully and try again!", style: 'thinking' },
  { text: "Close! Look at the place values and carries.", style: 'thinking' },
  { text: "Keep going! Check your partial products.", style: 'thinking' },
  { text: "Here is a hint: break the problem down place value by place value.", style: 'thinking' },
  { text: "Key clue: multiply each digit and remember to add any carried amounts.", style: 'emphasis' },
  { text: "Ready to unlock the next multiplication world?", style: 'encouragement' },

  // WORLD COMPLETIONS (All 10 Worlds)
  { text: "Fantastic! You completed all questions in Pencil Factory!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Bakery Boxes!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Sticker Studio!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Library Stacks!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Stadium Seats!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Farm Harvest!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Toy Warehouse!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in City Parade!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Space Cargo!", style: 'celebration' },
  { text: "Fantastic! You completed all questions in Multiplication Castle!", style: 'celebration' },

  // BOSS BATTLE
  { text: "Answer all questions correctly with 3 lives to claim your trophy!", style: 'statement' },
  { text: "Victory! You defeated the boss and claimed the badge!", style: 'celebration' },

  // REFLECT
  { text: "Welcome to the Reflect Phase!", style: 'statement' },
  { text: "Let's review the key multiplication strategies you mastered and check your scorecard!", style: 'statement' },
  { text: "Congratulations! You are officially a Multi-Digit Multiplication Grand Master!", style: 'celebration' },
];


function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 55);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index') out.index = parseInt(args[++i], 10);
    if (args[i] === '--text') out.text = args[++i];
    if (args[i] === '--style') out.style = args[++i];
    if (args[i] === '--list') out.list = true;
  }
  return out;
}

async function generateAudio(text, style) {
  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({ text, model_id: VOICE_MODEL, voice_settings: settings }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const { index, text: cliText, style: cliStyle, list } = parseArgs();

  if (list) {
    phrases.forEach((p, i) => console.log(`[${i}] (${p.style}) ${p.text.slice(0, 70)}…`));
    return;
  }

  if (cliText) {
    const style = cliStyle || 'statement';
    const filename = `audio_${slugify(cliText)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating single statement (${style}): "${cliText.slice(0, 60)}…"`);
    const buf = await generateAudio(cliText, style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  if (Number.isInteger(index)) {
    const phrase = phrases[index];
    if (!phrase) {
      console.error(`❌  No phrase at index ${index}. Run with --list to see valid indices.`);
      return;
    }
    const filename = `audio_${slugify(phrase.text)}_${index}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating [${index}] ${phrase.style}: "${phrase.text.slice(0, 60)}…"`);
    const buf = await generateAudio(phrase.text, phrase.style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  const audioMapEntries = [];
  let generated = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    const assetPath = `assets/audio/${filename}`;

    audioMapEntries.push([text, assetPath]);

    if (fs.existsSync(filePath)) {
      console.log(`⏭  Skipping (exists): ${filename}`);
      continue;
    }

    try {
      process.stdout.write(`🎙  Generating [${i + 1}/${phrases.length}] ${style}: "${text.slice(0, 48)}…" `);
      const buf = await generateAudio(text, style);
      fs.writeFileSync(filePath, buf);
      console.log(`✓ ${filename}`);
      generated++;
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`\n❌  Failed: ${err.message}`);
    }
  }

  const mapContent = `// src/utils/audioMap.js
// AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.
// Run \`npm run generate-audio\` to regenerate.

export const audioMap = {
${audioMapEntries.map(([text, p]) => `  ${JSON.stringify(text)}: ${JSON.stringify(p)},`).join('\n')}
};
`;
  fs.writeFileSync(MAP_PATH, mapContent);

  console.log(`\n✅  Done. Generated ${generated} new files. audioMap.js updated (${audioMapEntries.length} entries).`);
})();
