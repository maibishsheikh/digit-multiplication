// src/utils/shuffle.js

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateSessionQuestions(bank) {
  if (typeof bank === 'function') {
    return bank();
  }
  if (Array.isArray(bank)) {
    return shuffle(bank);
  }
  return [];
}
