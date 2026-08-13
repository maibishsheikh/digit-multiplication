// src/config/worlds.config.js
export const WORLDS = [
  { id: 0, name: 'Pencil Factory',     emoji: '🏭', accent: '#ff6f61',
    description: 'Multiply boxes of pencils using 4-digit × 1-digit',
    digitFocus: '4x1',
    boss: { name: 'Factory Boss',   emoji: '⚙️', reward: 'Factory Star Badge 🏭' } },
  { id: 1, name: 'Bakery Boxes',       emoji: '🧁', accent: '#ffa726',
    description: "Multiply trays of treats at Max's bakery using 4-digit × 1-digit",
    digitFocus: '4x1',
    boss: { name: 'Oven Boss',      emoji: '🍞', reward: 'Bakery Badge 🧁' } },
  { id: 2, name: 'Sticker Studio',     emoji: '🎨', accent: '#ec407a',
    description: 'Multiply sticker sheets using 3-digit × 2-digit',
    digitFocus: '3x2',
    boss: { name: 'Studio Boss',    emoji: '🖍️', reward: 'Studio Star Badge 🎨' } },
  { id: 3, name: 'Library Stacks',     emoji: '📚', accent: '#5c6bc0',
    description: 'Multiply shelves of books using 3-digit × 2-digit',
    digitFocus: '3x2',
    boss: { name: 'Archive Boss',   emoji: '📖', reward: 'Library Badge 📚' } },
  { id: 4, name: 'Stadium Seats',      emoji: '🏟️', accent: '#29b6f6',
    description: 'Multiply rows of seats using 3-digit × 2-digit',
    digitFocus: '3x2',
    boss: { name: 'Coach Boss',     emoji: '🥅', reward: 'Stadium Badge 🏟️' } },
  { id: 5, name: 'Farm Harvest',       emoji: '🌾', accent: '#c0ca33',
    description: 'Multiply crates of harvest using 4-digit × 1-digit',
    digitFocus: '4x1',
    boss: { name: 'Harvest Boss',   emoji: '🚜', reward: 'Harvest Badge 🌾' } },
  { id: 6, name: 'Toy Warehouse',      emoji: '🧸', accent: '#ab47bc',
    description: 'Multiply pallets of toys using 3-digit × 2-digit',
    digitFocus: '3x2',
    boss: { name: 'Warehouse Boss', emoji: '📦', reward: 'Toy Champ Badge 🧸' } },
  { id: 7, name: 'City Parade',        emoji: '🎈', accent: '#66bb6a',
    description: 'Multiply bunches of balloons using 4-digit × 1-digit',
    digitFocus: '4x1',
    boss: { name: 'Parade Boss',    emoji: '🎉', reward: 'Planner Badge 🎈' } },
  { id: 8, name: 'Space Cargo',        emoji: '🚀', accent: '#283593',
    description: 'Mixed review of both multiplication types on a cargo launch',
    digitFocus: 'mixed',
    boss: { name: 'Comet Boss',     emoji: '☄️', reward: 'Space Badge 🚀' } },
  { id: 9, name: 'Multiplication Castle', emoji: '🏰', accent: '#00bcd4',
    description: "Master every multiplication strategy at Flip the Fox's castle",
    digitFocus: 'mixed',
    boss: { name: 'Fox King',       emoji: '👑', reward: 'Multiplication Master Badge 👑' } },
];

// ── Play modes (within each world) ──
export const PLAY_MODES = [
  {
    id: 'guided',
    name: 'Guided Practice',
    icon: '🧭',
    desc: '5 questions with hints, no time pressure',
    questionCount: 5,
    hints: true,
    timed: false,
    lives: false,
  },
  {
    id: 'independent',
    name: 'Independent Practice',
    icon: '✍️',
    desc: '10 questions, no hints, full XP',
    questionCount: 10,
    hints: false,
    timed: false,
    lives: false,
  },
  {
    id: 'timed',
    name: 'Timed Challenge',
    icon: '⏱️',
    desc: '8 questions in 60 seconds, bonus XP',
    questionCount: 8,
    hints: false,
    timed: true,
    timeLimit: 60,
    lives: false,
  },
  {
    id: 'boss',
    name: 'Boss Battle',
    icon: '👑',
    desc: '5 questions, 3 lives — defeat the boss!',
    questionCount: 5,
    hints: false,
    timed: false,
    lives: true,
  },
];

// ── Badges ──
export const BADGES = [
  { id: 'first_flip',        name: 'First Multiply',       icon: '🏅', desc: 'First correct multiplication answer' },
  { id: 'hot_streak',        name: 'Hot Streak',           icon: '🔥', desc: '5 consecutive correct' },
  { id: 'fact_family_star',  name: 'Break It Apart Star',  icon: '🥈', desc: 'Completed Simulate' },
  { id: 'multiplication_master',   name: 'Multiplication Master',icon: '🥇', desc: '80%+ correct overall' },
  { id: 'perfect_split',     name: 'Perfect Product',      icon: '💎', desc: 'A perfect world score' },
  { id: 'boss_slayer',       name: 'Boss Slayer',          icon: '👑', desc: 'Defeated a boss battle' },
  { id: 'full_journey',      name: 'Full Journey',         icon: '🌟', desc: 'Completed every phase' },
];

// ── XP economy ──
export const XP_REWARDS = {
  CORRECT: 10,
  STREAK_BONUS: 15, // on 5+ streak (replaces base)
  STATION_COMPLETE: 20,
  WORLD_COMPLETE: 50,
  BOSS_WIN: 100,
};

// ── The two legal multiplication patterns for this module (MOE P4 scope) ──
// '4x1' → a 4-digit number × a 1-digit number (e.g. 3,124 × 4)
// '3x2' → a 3-digit number × a 2-digit number (e.g. 234 × 56)
export const DIGIT_TYPES = ['4x1', '3x2'];
