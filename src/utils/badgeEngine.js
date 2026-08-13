// src/utils/badgeEngine.js

export const BADGES = [
  { id: 'first_multiply',        label: 'First Multiply',       icon: '🏅', description: 'First correct multiplication answer' },
  { id: 'hot_streak',           label: 'Hot Streak',           icon: '🔥', description: 'Reached a 5-question streak' },
  { id: 'break_apart_star',     label: 'Break It Apart Star',  icon: '🧩', description: 'Completed the Area Model Simulation' },
  { id: 'regroup_pro',          label: 'Regrouping Master',    icon: '🔢', description: 'Mastered standard algorithm regrouping' },
  { id: 'boss_slayer',          label: 'Boss Slayer',          icon: '👑', description: 'Defeated a world boss battle' },
  { id: 'multiplication_master', label: 'Multiplication Master', icon: '🥇', description: 'Scored 80%+ across practice questions' },
  { id: 'full_journey',         label: 'Grand Journey',        icon: '🌟', description: 'Completed all 5 learning phases' },
];

export function checkBadges(state) {
  const earned = [];
  const totalCorrect = state.districtCorrect ? state.districtCorrect.reduce((s, c) => s + (c || 0), 0) : 0;

  if (totalCorrect >= 1) {
    earned.push('first_multiply');
  }
  if (state.maxStreak >= 5) {
    earned.push('hot_streak');
  }
  if (state.simStationsComplete && state.simStationsComplete[0]) {
    earned.push('break_apart_star');
  }
  if (state.simStationsComplete && state.simStationsComplete[1]) {
    earned.push('regroup_pro');
  }
  if (totalCorrect >= 80) {
    earned.push('multiplication_master');
  }
  if (state.phaseComplete?.wonder && state.phaseComplete?.story && state.phaseComplete?.simulate && state.phaseComplete?.play && state.phaseComplete?.reflect) {
    earned.push('full_journey');
  }

  return earned;
}
