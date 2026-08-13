// src/utils/scoring.js

export function calcXP(attempt = 1, hintsUsed = 0, streak = 0) {
  let base = 10;
  if (attempt === 1) base += 5;
  if (hintsUsed === 0) base += 5;
  if (streak >= 5) base += 10;
  else if (streak >= 3) base += 5;
  return base;
}

export function calcStars(score) {
  if (score >= 9) return 3;
  if (score >= 7) return 2;
  if (score >= 5) return 1;
  return 0;
}
