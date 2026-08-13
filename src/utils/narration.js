// src/utils/narration.js
// Maps application phases to ElevenLabs-compatible styled narration segments.
// All strings here must match on-screen UI text exactly (1:1 parity).

export function say(text) {
  return { text, style: 'statement' };
}
export function ask(text) {
  return { text, style: 'question' };
}
export function cheer(text) {
  return { text, style: 'encouragement' };
}
export function emphasize(text) {
  return { text, style: 'emphasis' };
}
export function think(text) {
  return { text, style: 'thinking' };
}
export function celebrate(text) {
  return { text, style: 'celebration' };
}

// ── WONDER PHASE ──
export function wonderNarration() {
  return [
    cheer("The Big Mystery! If Max needs to pack 4 party boxes, each holding 2,314 mini cupcakes..."),
    ask("How can we find the total cupcakes in seconds without adding 2,314 four times?"),
    think("Let's investigate how breaking numbers apart and using the standard algorithm make multi-digit multiplication fast and easy!"),
  ];
}

// ── STORY PHASE (Panels 0–3) ──
export function storyNarration(panelIdx) {
  switch (panelIdx) {
    case 0:
      return [
        say("Max just received the largest order of his life — 4 giant party boxes for the Sunnyvale Town Festival, each holding 2,314 mini cupcakes!"),
        think("Max starts writing repeated addition on paper and sighs: 'There must be a faster way than adding 2,314 four times…'"),
      ];
    case 1:
      return [
        say("Sophie dashes into the bakery! 'Multiplication is super fast when you use the Area Model! Break 2,314 apart by place value: 2,000 plus 300 plus 10 plus 4.'"),
        say("Multiply each place-value chunk by 4, then sum them up!"),
      ];
    case 2:
      return [
        say("Flip the Fox pulls out his chalkboard. 'You can also line the digits up vertically and multiply the standard algorithm way!'"),
        say("Multiply right-to-left, regrouping carried numbers into the next column. Same exact total in seconds!"),
      ];
    case 3:
      return [
        celebrate("Max packs all 9,256 cupcakes with zero mistakes!"),
        say("Next, he calculates that his 45 helpers each get 128 thank-you stickers. That is 3-digit times 2-digit multiplication, and Max solves it in a flash!"),
        cheer("Let's simulate and practice multiplying big numbers!"),
      ];
    default:
      return [];
  }
}

// ── SIMULATE PHASE INTROS & ACTIVE DIALOGUES ──
export function simStationIntro(stationIdx) {
  switch (stationIdx) {
    case 0:
      return [
        say("Station A — Area Model Lab!"),
        say("Break multi-digit numbers apart into place-value boxes, multiply each box, and add the partial products together. Let's explore!"),
      ];
    case 1:
      return [
        say("Station B — Regroup and Carry Machine!"),
        say("Watch the standard vertical algorithm step by step. Multiply each digit and carry numbers into the next column!"),
      ];
    case 2:
      return [
        say("Station C — Two-Digit Shift Workshop!"),
        say("When multiplying 3-digit by 2-digit numbers, multiply by the ones, then shift one place left for the tens row!"),
      ];
    case 3:
      return [
        say("Station D — Error Detective!"),
        say("Inspect student work to spot common multiplication mistakes and fix them like a math detective!"),
      ];
    default:
      return [];
  }
}

// Interactive Simulation Dialogues
export function simAreaModelAllTilesDone() {
  return [celebrate("Great! All partial products found. Now add them together!")];
}
export function simAreaModelComplete(totalStr = "") {
  return [celebrate(`Outstanding! All partial products sum to ${totalStr || "the total product"}!`)];
}
export function simAreaModelWrongSum() {
  return [think("Check your addition of the partial products and try again.")];
}

export function simRegroupPromptCarry(totalStr = "") {
  return [say(`Great! For product ${totalStr}, how do we record the ones and tens?`)];
}
export function simRegroupComplete(totalStr = "") {
  return [celebrate(`Masterful! Column algorithm complete: ${totalStr || "the total product"}!`)];
}
export function simRegroupCarryHint() {
  return [think("Remember: write the ones digit in the answer and carry the tens digit!")];
}
export function simRegroupWrongMult() {
  return [think("Check your calculation and try again.")];
}

export function simShiftRow1Done(row1Str = "") {
  return [say(`Great! Row 1 is ${row1Str || "calculated"}. Now let's examine the tens digit.`)];
}
export function simShiftTensConceptDone() {
  return [celebrate("Exactly! The tens digit represents tens. Pull the shift lever to place the 0!")];
}
export function simShiftLeverPlaced() {
  return [say("Shift 0 placed! Now calculate the tens row.")];
}
export function simShiftTensDone(row2Str = "") {
  return [celebrate(`Awesome! Row 2 is ${row2Str || "calculated"}. Now add both partial rows!`)];
}
export function simShiftComplete(totalStr = "") {
  return [celebrate(`Masterpiece! 2-Digit algorithm complete: ${totalStr || "the total product"}!`)];
}

export function simErrorFlawFound() {
  return [celebrate("Flawed step identified! Now diagnose the mathematical cause.")];
}
export function simErrorWrongStep() {
  return [think("That step is calculated correctly. Inspect the other steps!")];
}
export function simErrorDiagnosed() {
  return [say("Exact diagnosis! Now calculate the TRUE repaired product.")];
}
export function simErrorCracked(totalStr = "") {
  return [celebrate(`Case Cracked! The true product is ${totalStr || "the solution"}!`)];
}

// ── PLAY / PRACTICE PHASE ──
export function playQuestionNarration(questionText) {
  if (!questionText) return [];
  return [ask(questionText)];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [celebrate(`Incredible! You have a streak of ${streak} correct answers in a row!`)];
  }
  if (streak >= 3) {
    return [cheer("Awesome work! You are on a roll!")];
  }
  const compliments = [
    "Spot on! Great multiplication!",
    "Correct! You got it!",
    "Excellent calculation!",
    "Super job! Right on the money!",
  ];
  return [say(compliments[Math.floor(Math.random() * compliments.length)])];
}

export function playWrongNarration() {
  const nudges = [
    "Not quite. Check each step carefully and try again!",
    "Close! Look at the place values and carries.",
    "Keep going! Check your partial products.",
  ];
  return [think(nudges[Math.floor(Math.random() * nudges.length)])];
}

export function playHint1Narration(hintText) {
  return [think(hintText || "Here is a hint: break the problem down place value by place value.")];
}

export function playHint2Narration(hintText) {
  return [emphasize(hintText || "Key clue: multiply each digit and remember to add any carried amounts.")];
}

export function districtCompleteNarration(districtName = "District") {
  return [
    celebrate(`Fantastic! You completed all questions in ${districtName}!`),
    cheer("Ready to unlock the next multiplication world?"),
  ];
}

// ── BOSS BATTLE ──
export function bossStartNarration(bossName = "The Boss") {
  return [
    emphasize(`The Boss Battle begins against ${bossName}!`),
    say("Answer all questions correctly with 3 lives to claim your trophy!"),
  ];
}

export function bossWinNarration(reward = "the badge") {
  return [
    celebrate(`Victory! You defeated the boss and claimed ${reward}!`),
  ];
}

// ── REFLECT PHASE ──
export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase!"),
    say("Let's review the key multiplication strategies you mastered and check your scorecard!"),
  ];
}

export function reflectCompleteNarration() {
  return [
    celebrate("Congratulations! You are officially a Multi-Digit Multiplication Grand Master!"),
  ];
}

