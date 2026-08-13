// src/data/questionBank.js
// Procedurally generated 100-question bank across 10 Multiplication Districts
import { WORLDS } from '../config/worlds.config.js';
import {
  generateSessionQuestions,
  genMultiplication,
  placeValueParts,
  generateProductDistractors,
  generateDistractors,
  englishNames,
} from '../core/questions/questionBank.js';


export const DISTRICTS = WORLDS.map((w, idx) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  description: w.description,
  digitFocus: w.digitFocus,
  boss: {
    name: w.boss.name,
    emoji: w.boss.emoji,
    reward: w.boss.reward,
  },
}));

export function getFullQuestionBank() {
  return generateSessionQuestions();
}

export default getFullQuestionBank;
