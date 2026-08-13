// src/core/questions/questionBank.js
// Procedural question generator — 100 questions, 10 types, 10 fully aligned worlds
// MultiplyQuest — Multiplying 4-digit × 1-digit and 3-digit × 2-digit numbers (Grade 4)
import { BADGES, DIGIT_TYPES } from '../../config/worlds.config.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function singular(word) { return word.endsWith('s') ? word.slice(0, -1) : word; }

function generateDistractors(correct, min, max) {
  const opts = new Set([correct]);
  const span = Math.max(1, Math.round((max - min) * 0.05));
  const offsets = shuffleArray([1, 2, 3, -1, -2, -3, span, -span, span * 2, -span * 2]);
  for (const off of offsets) {
    if (opts.size >= 4) break;
    const candidate = correct + off;
    if (candidate >= min && candidate <= max && candidate !== correct) opts.add(candidate);
  }
  while (opts.size < 4) {
    const candidate = randInt(min, Math.max(max, correct + 10));
    if (candidate !== correct) opts.add(candidate);
  }
  return shuffleArray([...opts]).slice(0, 4);
}

function genMultiplication(diff, forceType) {
  const digitType = forceType || DIGIT_TYPES[randInt(0, DIGIT_TYPES.length - 1)];
  let factorA, factorB;
  if (digitType === '4x1') {
    if (diff === 1) { factorA = randInt(1000, 3999); factorB = randInt(2, 5); }
    else if (diff === 2) { factorA = randInt(1000, 9999); factorB = randInt(2, 7); }
    else { factorA = randInt(4000, 9999); factorB = randInt(6, 9); }
  } else { // '3x2'
    if (diff === 1) { factorA = randInt(100, 399); factorB = randInt(11, 29); }
    else if (diff === 2) { factorA = randInt(100, 899); factorB = randInt(11, 69); }
    else { factorA = randInt(400, 999); factorB = randInt(45, 99); }
  }
  return { digitType, factorA, factorB, product: factorA * factorB };
}

function placeValueParts(n) {
  const str = String(n);
  const len = str.length;
  const parts = [];
  for (let i = 0; i < len; i++) {
    const digit = Number(str[i]);
    if (digit === 0) continue;
    parts.push(digit * Math.pow(10, len - 1 - i));
  }
  return parts;
}

function noCarryError(factorA, factorB) {
  const digits = String(factorA).split('').reverse().map(Number);
  const wrongDigits = digits.map((d) => (d * factorB) % 10);
  const str = wrongDigits.slice().reverse().join('').replace(/^0+(?=\d)/, '');
  return parseInt(str, 10);
}

function noShiftError(factorA, factorB) {
  const ones = factorB % 10;
  const tens = Math.floor(factorB / 10);
  return factorA * ones + factorA * tens;
}

function generateProductDistractors(correct, { factorA, factorB, digitType } = {}) {
  const opts = new Set([correct]);

  if (factorA && factorB && digitType) {
    const commonError = digitType === '4x1'
      ? noCarryError(factorA, factorB)
      : noShiftError(factorA, factorB);
    if (commonError && commonError > 0 && commonError !== correct) opts.add(commonError);
  }

  const scale = Math.max(10, Math.round(correct * 0.04));
  const offsets = shuffleArray([scale, -scale, scale * 2, -scale * 2, scale * 3, -scale * 3, 100, -100, 10, -10]);
  for (const off of offsets) {
    if (opts.size >= 4) break;
    const candidate = correct + off;
    if (candidate > 0 && candidate !== correct) opts.add(candidate);
  }
  while (opts.size < 4) {
    const candidate = correct + randInt(-40, 40);
    if (candidate > 0 && candidate !== correct) opts.add(candidate);
  }
  return shuffleArray([...opts]).slice(0, 4);
}

const englishNames = ['Emma', 'James', 'Oliver', 'Sophie', 'Lucas', 'Mia', 'Noah',
  'Ava', 'Ethan', 'Grace', 'Henry', 'Lily', 'Jack', 'Chloe', 'Ryan', 'Ella'];

// ── 10 Fully Themed World Contexts Aligned with World Cards ──
export const WORLD_CONTEXTS = [
  {
    worldId: 0,
    name: 'Pencil Factory',
    emoji: '🏭',
    digitFocus: '4x1',
    place: 'Pencil Factory',
    item: 'pencils',
    unit: 'boxes',
    unitSingular: 'box',
    contextSentences: [
      (name, a, b) => `At the Pencil Factory, ${name} loads ${a.toLocaleString()} pencils into each box. If the assembly line fills ${b} boxes today, how many pencils were packed in total?`,
      (name, a, b) => `The Pencil Factory produces ${a.toLocaleString()} sketching pencils per hour. How many pencils are made after ${b} hours of production?`,
      (name, a, b) => `A shipment contains ${b} crates of colored pencils, with ${a.toLocaleString()} pencils in each crate. What is the total count of pencils?`,
    ],
    areaModelIntro: (a, b) => `The Pencil Factory manager uses an area model to multiply ${a.toLocaleString()} pencils × ${b} boxes.`,
    verticalIntro: (a, b) => `Calculate the total pencil factory output: ${a.toLocaleString()} pencils × ${b} production runs.`,
    trueFalseIntro: (a, b, res) => `The quality inspector logs: "${a.toLocaleString()} pencils per carton × ${b} cartons = ${res.toLocaleString()} pencils." Is this log correct?`,
    estimateIntro: (a, b, round) => `Estimate the total pencils produced by rounding ${a.toLocaleString()} to ${round.toLocaleString()} and multiplying by ${b}.`,
  },
  {
    worldId: 1,
    name: 'Bakery Boxes',
    emoji: '🧁',
    digitFocus: '4x1',
    place: "Max's Bakery",
    item: 'cupcakes',
    unit: 'trays',
    unitSingular: 'tray',
    contextSentences: [
      (name, a, b) => `At Max's Bakery, ${name} bakes ${a.toLocaleString()} cupcakes on each large tray. If the bakery prepares ${b} trays for an order, how many cupcakes were baked?`,
      (name, a, b) => `The bakery packs ${a.toLocaleString()} chocolate chip cookies into each party carton. How many cookies are in ${b} cartons?`,
      (name, a, b) => `Baker ${name} frosts ${a.toLocaleString()} donuts per batch. How many donuts are frosted across ${b} batches?`,
    ],
    areaModelIntro: (a, b) => `Max breaks apart ${a.toLocaleString()} bakery treats to multiply by ${b} delivery crates using an area model.`,
    verticalIntro: (a, b) => `Calculate the total bakery orders: ${a.toLocaleString()} treats × ${b} bakery boxes.`,
    trueFalseIntro: (a, b, res) => `The baker records: "${a.toLocaleString()} pastries per tray × ${b} trays = ${res.toLocaleString()} pastries." Is this record correct?`,
    estimateIntro: (a, b, round) => `Estimate total bakery treats by rounding ${a.toLocaleString()} to ${round.toLocaleString()} and multiplying by ${b}.`,
  },
  {
    worldId: 2,
    name: 'Sticker Studio',
    emoji: '🎨',
    digitFocus: '3x2',
    place: 'Sticker Studio',
    item: 'stickers',
    unit: 'sheets',
    unitSingular: 'sheet',
    contextSentences: [
      (name, a, b) => `At the Sticker Studio, ${name} prints ${a} holographic stickers on each sheet. If ${b} sheets are printed for an art expo, how many stickers are printed in total?`,
      (name, a, b) => `The studio organizes ${a} vinyl stickers per album page across ${b} collector pages. How many stickers are collected?`,
      (name, a, b) => `Artist ${name} creates ${a} decal stickers per pack. How many stickers are in ${b} studio packs?`,
    ],
    areaModelIntro: (a, b) => `The Sticker Studio uses a grid area model to calculate ${a} stickers × ${b} sheets.`,
    verticalIntro: (a, b) => `Calculate the sticker studio inventory: ${a} stickers × ${b} print runs.`,
    trueFalseIntro: (a, b, res) => `The studio report states: "${a} stickers per pack × ${b} packs = ${res.toLocaleString()} stickers." Is this statement correct?`,
    estimateIntro: (a, b, round) => `Estimate total stickers by rounding ${a} to ${round} and multiplying by ${b}.`,
  },
  {
    worldId: 3,
    name: 'Library Stacks',
    emoji: '📚',
    digitFocus: '3x2',
    place: 'Central Library',
    item: 'books',
    unit: 'shelves',
    unitSingular: 'shelf',
    contextSentences: [
      (name, a, b) => `In the Central Library, ${name} organizes ${a} books onto each tall shelf. If there are ${b} shelves in the history aisle, how many books are shelved in total?`,
      (name, a, b) => `The library archive receives ${b} shipping crates containing ${a} historical volumes each. How many volumes were delivered?`,
      (name, a, b) => `Librarian ${name} catalogs ${a} science textbooks per section across ${b} library sections. How many textbooks are cataloged?`,
    ],
    areaModelIntro: (a, b) => `The librarian uses an area model breakdown to catalog ${a} books × ${b} shelf sections.`,
    verticalIntro: (a, b) => `Calculate the library collection: ${a} books × ${b} library bookcases.`,
    trueFalseIntro: (a, b, res) => `The catalog log states: "${a} books per row × ${b} rows = ${res.toLocaleString()} books." Is this entry correct?`,
    estimateIntro: (a, b, round) => `Estimate the library book collection by rounding ${a} to ${round} and multiplying by ${b}.`,
  },
  {
    worldId: 4,
    name: 'Stadium Seats',
    emoji: '🏟️',
    digitFocus: '3x2',
    place: 'Grand Arena',
    item: 'seats',
    unit: 'rows',
    unitSingular: 'row',
    contextSentences: [
      (name, a, b) => `At the Grand Arena, section manager ${name} counts ${a} seats in each stadium row. If section A has ${b} rows, how many spectators can sit in this section?`,
      (name, a, b) => `The stadium VIP stand has ${b} rows with ${a} deluxe armchairs in each row. What is the total VIP capacity?`,
      (name, a, b) => `Coach ${name} reserves ${b} bleacher rows with ${a} seats each for championship fans. How many seats are reserved?`,
    ],
    areaModelIntro: (a, b) => `The stadium planner calculates ${a} seats × ${b} rows using a seat grid area model.`,
    verticalIntro: (a, b) => `Calculate total stadium capacity: ${a} seats per row × ${b} arena rows.`,
    trueFalseIntro: (a, b, res) => `The ticket manager claims: "${a} seats × ${b} rows = ${res.toLocaleString()} seats." Is this claim correct?`,
    estimateIntro: (a, b, round) => `Estimate the stadium crowd capacity by rounding ${a} to ${round} and multiplying by ${b}.`,
  },
  {
    worldId: 5,
    name: 'Farm Harvest',
    emoji: '🌾',
    digitFocus: '4x1',
    place: 'Sunny Acres Farm',
    item: 'apples',
    unit: 'crates',
    unitSingular: 'crate',
    contextSentences: [
      (name, a, b) => `At Sunny Acres Farm, farmer ${name} packs ${a.toLocaleString()} crisp apples into each harvest crate. If ${b} crates are filled today, how many apples were harvested?`,
      (name, a, b) => `The farm gathers ${a.toLocaleString()} ears of sweet corn per field plot across ${b} farm plots. What is the total corn harvest?`,
      (name, a, b) => `Farmer ${name} collects ${a.toLocaleString()} farm-fresh eggs each week for ${b} weeks. How many eggs were collected in total?`,
    ],
    areaModelIntro: (a, b) => `The farm harvest team breaks apart ${a.toLocaleString()} crops × ${b} crates using an area model.`,
    verticalIntro: (a, b) => `Calculate total farm harvest: ${a.toLocaleString()} crops × ${b} harvest containers.`,
    trueFalseIntro: (a, b, res) => `The harvest tally reads: "${a.toLocaleString()} crops per crate × ${b} crates = ${res.toLocaleString()} crops." Is this tally correct?`,
    estimateIntro: (a, b, round) => `Estimate total farm harvest by rounding ${a.toLocaleString()} to ${round.toLocaleString()} and multiplying by ${b}.`,
  },
  {
    worldId: 6,
    name: 'Toy Warehouse',
    emoji: '🧸',
    digitFocus: '3x2',
    place: 'Toy Warehouse',
    item: 'toys',
    unit: 'pallets',
    unitSingular: 'pallet',
    contextSentences: [
      (name, a, b) => `At the Toy Warehouse, ${name} stacks ${a} board games onto each storage pallet. If ${b} pallets are ready for delivery, how many games are stored in total?`,
      (name, a, b) => `The toy distributor packs ${a} action figures into each shipping crate across ${b} warehouse crates. What is the total toy count?`,
      (name, a, b) => `Warehouse manager ${name} logs ${a} plush teddy bears per carton across ${b} cartons. How many plushies are logged?`,
    ],
    areaModelIntro: (a, b) => `The warehouse logistics team models ${a} toys × ${b} pallets using an area model grid.`,
    verticalIntro: (a, b) => `Calculate the toy warehouse inventory: ${a} toys × ${b} shipping pallets.`,
    trueFalseIntro: (a, b, res) => `The warehouse manifest claims: "${a} toys per pallet × ${b} pallets = ${res.toLocaleString()} toys." Is this manifest correct?`,
    estimateIntro: (a, b, round) => `Estimate the total warehouse toys by rounding ${a} to ${round} and multiplying by ${b}.`,
  },
  {
    worldId: 7,
    name: 'City Parade',
    emoji: '🎈',
    digitFocus: '4x1',
    place: 'City Festival Parade',
    item: 'balloons',
    unit: 'bunches',
    unitSingular: 'bunch',
    contextSentences: [
      (name, a, b) => `For the City Festival Parade, ${name} ties ${a.toLocaleString()} helium balloons into each massive bunch. If there are ${b} balloon bunches along the parade route, how many balloons are flying?`,
      (name, a, b) => `The parade committee hands out ${a.toLocaleString()} festival flags per street zone across ${b} parade zones. How many flags are distributed?`,
      (name, a, b) => `Coordinator ${name} arranges ${a.toLocaleString()} confetti packets per parade float across ${b} festival floats. How many packets are arranged?`,
    ],
    areaModelIntro: (a, b) => `The parade coordinator models ${a.toLocaleString()} festival supplies × ${b} parade floats using an area model.`,
    verticalIntro: (a, b) => `Calculate the city parade supplies: ${a.toLocaleString()} parade items × ${b} parade groups.`,
    trueFalseIntro: (a, b, res) => `The parade planner notes: "${a.toLocaleString()} balloons per bunch × ${b} bunches = ${res.toLocaleString()} balloons." Is this correct?`,
    estimateIntro: (a, b, round) => `Estimate total parade balloons by rounding ${a.toLocaleString()} to ${round.toLocaleString()} and multiplying by ${b}.`,
  },
  {
    worldId: 8,
    name: 'Space Cargo',
    emoji: '🚀',
    digitFocus: 'mixed',
    place: 'Orbital Cargo Launchpad',
    item: 'cargo canisters',
    unit: 'launch pods',
    unitSingular: 'launch pod',
    contextSentences: [
      (name, a, b) => `At the Orbital Cargo Launchpad, Commander ${name} loads ${a.toLocaleString()} solar battery cells into each space canister. If the rocket carries ${b} canisters, how many cells are launched into orbit?`,
      (name, a, b) => `The space mission loads ${a.toLocaleString()} freeze-dried meal packs into each cargo pod across ${b} pods. How many meals are loaded?`,
      (name, a, b) => `Astronaut ${name} prepares ${a.toLocaleString()} scientific instruments per satellite across ${b} orbital satellites. What is the instrument count?`,
    ],
    areaModelIntro: (a, b) => `The mission control team calculates space cargo of ${a.toLocaleString()} units × ${b} pods using an area model.`,
    verticalIntro: (a, b) => `Calculate space cargo payload: ${a.toLocaleString()} payload units × ${b} rocket modules.`,
    trueFalseIntro: (a, b, res) => `Mission telemetry states: "${a.toLocaleString()} units × ${b} pods = ${res.toLocaleString()} total units." Is this telemetry accurate?`,
    estimateIntro: (a, b, round) => `Estimate space cargo payload by rounding ${a.toLocaleString()} to ${round.toLocaleString()} and multiplying by ${b}.`,
  },
  {
    worldId: 9,
    name: 'Multiplication Castle',
    emoji: '🏰',
    digitFocus: 'mixed',
    place: 'Fox Royal Castle',
    item: 'golden coins',
    unit: 'treasure chests',
    unitSingular: 'treasure chest',
    contextSentences: [
      (name, a, b) => `In the Fox Royal Castle treasury, ${name} stores ${a.toLocaleString()} golden coins in each royal chest. If there are ${b} treasure chests in the vault, how many coins are stored in total?`,
      (name, a, b) => `The castle guard orders ${a.toLocaleString()} knight shields across ${b} castle battalions. How many shields were crafted?`,
      (name, a, b) => `King Flip inspects ${a.toLocaleString()} royal gemstone crests on each of ${b} castle banners. What is the total gemstone count?`,
    ],
    areaModelIntro: (a, b) => `The Royal Castle mathematician computes ${a.toLocaleString()} royal treasures × ${b} chests using an area model.`,
    verticalIntro: (a, b) => `Calculate the royal castle treasury: ${a.toLocaleString()} treasures × ${b} royal vaults.`,
    trueFalseIntro: (a, b, res) => `The royal scroll proclaims: "${a.toLocaleString()} treasures × ${b} chests = ${res.toLocaleString()} treasures." Is this royal proclamation true?`,
    estimateIntro: (a, b, round) => `Estimate the royal castle treasury by rounding ${a.toLocaleString()} to ${round.toLocaleString()} and multiplying by ${b}.`,
  },
];

// Helper to generate a tailored 10-question set for a specific world
function generateWorldQuestions(worldCtx, worldIndex) {
  const questions = [];
  const { digitFocus } = worldCtx;
  const isMixed = digitFocus === 'mixed';

  function getDigitType(idx) {
    if (digitFocus === '4x1') return '4x1';
    if (digitFocus === '3x2') return '3x2';
    return idx % 2 === 0 ? '4x1' : '3x2';
  }

  // Q1: Word Problem (Repeated groups or array)
  {
    const dType = getDigitType(0);
    const { factorA, factorB, product } = genMultiplication(1, dType);
    const name = pick(englishNames);
    const sentenceGen = pick(worldCtx.contextSentences);
    const questionText = sentenceGen(name, factorA, factorB);

    questions.push({
      id: `w${worldIndex}_q1`,
      world: worldIndex,
      type: 'wordProblemRepeatedGroups',
      difficulty: 1,
      digitType: dType,
      factorA, factorB, product,
      questionText,
      visual: 'word',
      hint1: `${factorB} groups of ${factorA.toLocaleString()} — multiply to find the total.`,
      hint2: `${factorA.toLocaleString()} × ${factorB} = ?`,
      explanation: `${factorA.toLocaleString()} × ${factorB} = ${product.toLocaleString()} ${worldCtx.item} in total.`,
      options: generateProductDistractors(product, { factorA, factorB, digitType: dType }),
      correctAnswer: product,
    });
  }

  // Q2: Area Model Partial Product
  {
    const dType = getDigitType(1);
    const { factorA, factorB, product } = genMultiplication(1, dType);
    const parts = placeValueParts(factorA);
    const chosenPart = pick(parts);
    const partialProduct = chosenPart * factorB;

    questions.push({
      id: `w${worldIndex}_q2`,
      world: worldIndex,
      type: 'areaModelPartialProduct',
      difficulty: 1,
      digitType: dType,
      factorA, factorB, product, parts, chosenPart,
      questionText: `${worldCtx.areaModelIntro(factorA, factorB)} Break apart ${factorA.toLocaleString()} by place value: what is the partial product for ${chosenPart.toLocaleString()} × ${factorB}?`,
      visual: 'areaModel',
      hint1: `${chosenPart.toLocaleString()} is one place-value part of ${factorA.toLocaleString()}.`,
      hint2: `Multiply ${chosenPart.toLocaleString()} × ${factorB}.`,
      explanation: `${chosenPart.toLocaleString()} × ${factorB} = ${partialProduct.toLocaleString()}.`,
      options: generateProductDistractors(partialProduct, { factorA: chosenPart, factorB, digitType: dType }),
      correctAnswer: partialProduct,
    });
  }

  // Q3: Vertical (Standard Algorithm)
  {
    const dType = getDigitType(2);
    const { factorA, factorB, product } = genMultiplication(2, dType);

    questions.push({
      id: `w${worldIndex}_q3`,
      world: worldIndex,
      type: 'verticalMultiplication',
      difficulty: 2,
      digitType: dType,
      factorA, factorB, product,
      questionText: `${worldCtx.verticalIntro(factorA, factorB)} What is ${factorA.toLocaleString()} × ${factorB}?`,
      visual: 'vertical',
      hint1: `Multiply each digit column from right to left, regrouping (carrying) when necessary.`,
      hint2: `Add any carried digits to the next column's product.`,
      explanation: `${factorA.toLocaleString()} × ${factorB} = ${product.toLocaleString()}.`,
      options: generateProductDistractors(product, { factorA, factorB, digitType: dType }),
      correctAnswer: product,
    });
  }

  // Q4: Area Model Total Product
  {
    const dType = getDigitType(3);
    const { factorA, factorB, product } = genMultiplication(2, dType);
    const parts = placeValueParts(factorA);
    const partials = parts.map((p) => p * factorB);

    questions.push({
      id: `w${worldIndex}_q4`,
      world: worldIndex,
      type: 'areaModelTotal',
      difficulty: 2,
      digitType: dType,
      factorA, factorB, product, parts, partials,
      questionText: `At the ${worldCtx.place}, partial products for ${factorA.toLocaleString()} × ${factorB} are: ${partials.map(p => p.toLocaleString()).join(' + ')}. What is the total product?`,
      visual: 'areaModel',
      hint1: `Add all the partial products together: ${partials.map(p => p.toLocaleString()).join(' + ')}.`,
      hint2: `The sum of partial products equals the full product.`,
      explanation: `${partials.map(p => p.toLocaleString()).join(' + ')} = ${product.toLocaleString()}.`,
      options: generateProductDistractors(product, { factorA, factorB, digitType: dType }),
      correctAnswer: product,
    });
  }

  // Q5: Second Word Problem (Deeper Context)
  {
    const dType = getDigitType(4);
    const { factorA, factorB, product } = genMultiplication(2, dType);
    const name = pick(englishNames);
    const sentenceGen = pick(worldCtx.contextSentences);
    const questionText = sentenceGen(name, factorA, factorB);

    questions.push({
      id: `w${worldIndex}_q5`,
      world: worldIndex,
      type: 'wordProblemArrayContext',
      difficulty: 2,
      digitType: dType,
      factorA, factorB, product,
      questionText,
      visual: 'word',
      hint1: `Multiply ${factorA.toLocaleString()} by ${factorB}.`,
      hint2: `${factorA.toLocaleString()} × ${factorB} = ?`,
      explanation: `${factorA.toLocaleString()} × ${factorB} = ${product.toLocaleString()} ${worldCtx.item}.`,
      options: generateProductDistractors(product, { factorA, factorB, digitType: dType }),
      correctAnswer: product,
    });
  }

  // Q6: Missing Factor
  {
    const dType = getDigitType(5);
    const { factorA, factorB, product } = genMultiplication(2, dType);
    const missingSlot = Math.random() > 0.5 ? 'factorA' : 'factorB';
    const correctAnswer = missingSlot === 'factorA' ? factorA : factorB;
    const known = missingSlot === 'factorA' ? factorB : factorA;
    const range = missingSlot === 'factorA'
      ? (dType === '4x1' ? [1000, 9999] : [100, 999])
      : (dType === '4x1' ? [2, 9] : [10, 99]);
    const sentence = missingSlot === 'factorA'
      ? `___ × ${factorB} = ${product.toLocaleString()}`
      : `${factorA.toLocaleString()} × ___ = ${product.toLocaleString()}`;

    questions.push({
      id: `w${worldIndex}_q6`,
      world: worldIndex,
      type: 'missingFactor',
      difficulty: 2,
      digitType: dType,
      factorA, factorB, product, missingSlot,
      questionText: `At the ${worldCtx.place}, find the missing number for the inventory shipment: ${sentence}`,
      visual: 'sentence',
      hint1: `Divide ${product.toLocaleString()} by ${known.toLocaleString()} to find the missing factor.`,
      hint2: `${known.toLocaleString()} × ? = ${product.toLocaleString()}.`,
      explanation: `${factorA.toLocaleString()} × ${factorB} = ${product.toLocaleString()}.`,
      options: generateDistractors(correctAnswer, range[0], range[1]),
      correctAnswer,
    });
  }

  // Q7: Estimation & Rounding
  {
    const dType = getDigitType(6);
    const { factorA, factorB, product } = genMultiplication(2, dType);
    const roundPlace = dType === '4x1' ? 1000 : 100;
    const roundedA = Math.round(factorA / roundPlace) * roundPlace;
    const estimate = roundedA * factorB;

    questions.push({
      id: `w${worldIndex}_q7`,
      world: worldIndex,
      type: 'estimationRounding',
      difficulty: 2,
      digitType: dType,
      factorA, factorB, product, roundedA, estimate,
      questionText: `${worldCtx.estimateIntro(factorA, factorB, roundedA)} What is the estimated total?`,
      visual: 'sentence',
      hint1: `${factorA.toLocaleString()} rounds to ${roundedA.toLocaleString()}.`,
      hint2: `Multiply ${roundedA.toLocaleString()} × ${factorB} = ?`,
      explanation: `${factorA.toLocaleString()} rounds to ${roundedA.toLocaleString()}. ${roundedA.toLocaleString()} × ${factorB} = ${estimate.toLocaleString()} (exact answer is ${product.toLocaleString()}).`,
      options: generateProductDistractors(estimate, { factorA: roundedA, factorB, digitType: dType }),
      correctAnswer: estimate,
    });
  }

  // Q8: True / False Quality Check
  {
    const dType = getDigitType(7);
    const { factorA, factorB, product } = genMultiplication(2, dType);
    const isTrue = Math.random() > 0.5;
    let shown = product;
    if (!isTrue) {
      let wrong = dType === '4x1' ? noCarryError(factorA, factorB) : noShiftError(factorA, factorB);
      if (!wrong || wrong === product || wrong <= 0) wrong = product + (Math.random() > 0.5 ? 10 : -10);
      shown = wrong;
    }

    questions.push({
      id: `w${worldIndex}_q8`,
      world: worldIndex,
      type: 'trueFalseCheck',
      difficulty: 2,
      digitType: dType,
      factorA, factorB, product: shown, actualProduct: product,
      questionText: `${worldCtx.trueFalseIntro(factorA, factorB, shown)}`,
      visual: 'truefalse',
      hint1: `Calculate ${factorA.toLocaleString()} × ${factorB} carefully.`,
      hint2: `The exact product is ${product.toLocaleString()}.`,
      explanation: `${factorA.toLocaleString()} × ${factorB} = ${product.toLocaleString()}, so the statement is ${isTrue ? 'True ✓' : 'False ✗'}.`,
      options: ['True', 'False'],
      correctAnswer: isTrue ? 'True' : 'False',
    });
  }

  // Q9: Multiplication Triangle / Inventory Relation
  {
    const dType = getDigitType(8);
    const { factorA, factorB, product } = genMultiplication(3, dType);

    questions.push({
      id: `w${worldIndex}_q9`,
      world: worldIndex,
      type: 'multiplicationTriangle',
      difficulty: 3,
      digitType: dType,
      factorA, factorB, product, missingSlot: 'product',
      questionText: `In the ${worldCtx.place} records, factor ${factorA.toLocaleString()} and factor ${factorB} meet at the peak of the triangle. What is the product?`,
      visual: 'triangle',
      hint1: `Multiply the two bottom factors: ${factorA.toLocaleString()} × ${factorB}.`,
      hint2: `${factorA.toLocaleString()} × ${factorB} = ?`,
      explanation: `${factorA.toLocaleString()} × ${factorB} = ${product.toLocaleString()}.`,
      options: generateProductDistractors(product, { factorA, factorB, digitType: dType }),
      correctAnswer: product,
    });
  }

  // Q10: Boss Battle Review Challenge
  {
    const dType = getDigitType(9);
    const { factorA, factorB, product } = genMultiplication(3, dType);

    questions.push({
      id: `w${worldIndex}_q10`,
      world: worldIndex,
      type: 'mixedReviewBoss',
      difficulty: 3,
      digitType: dType,
      factorA, factorB, product, missingSlot: 'product',
      questionText: `👑 Boss Battle Challenge (${worldCtx.name}): Multiply ${factorA.toLocaleString()} × ${factorB} to claim the ${worldCtx.name} Badge!`,
      visual: 'mixed',
      mixedVisual: 'vertical',
      hint1: `Calculate each column step with great care, adding all carries.`,
      hint2: `Sum up all partial rows.`,
      explanation: `Outstanding! ${factorA.toLocaleString()} × ${factorB} = ${product.toLocaleString()}.`,
      options: generateProductDistractors(product, { factorA, factorB, digitType: dType }),
      correctAnswer: product,
    });
  }

  return questions;
}

export function generateSessionQuestions() {
  let allQuestions = [];
  WORLD_CONTEXTS.forEach((worldCtx, worldIndex) => {
    const worldQs = generateWorldQuestions(worldCtx, worldIndex);
    allQuestions = allQuestions.concat(worldQs);
  });
  return allQuestions;
}

export const BADGE_TESTS = {
  first_flip:          (s) => s.totalScore > 0,
  hot_streak:          (s) => s.maxStreak >= 5,
  fact_family_star:    (s) => s.simulateDone,
  multiplication_master:     (s) => s.totalQuestions > 0 && s.totalScore / s.totalQuestions >= 0.8,
  perfect_split:       (s) => s.worldResults.some(w => w && w.correct === w.total),
  boss_slayer:         (s) => s.bossWon,
  full_journey:        (s) => s.reflectDone,
};

export function checkBadges(sessionState) {
  return BADGES.filter(b => (BADGE_TESTS[b.id] ? BADGE_TESTS[b.id](sessionState) : false));
}

export function scoreAnswer({ isCorrect, isFirstTry, streak }) {
  if (!isCorrect) return { xp: 0, newStreak: 0 };
  let xp = isFirstTry ? 10 : 5;
  const newStreak = streak + 1;
  if (newStreak >= 5 && newStreak % 5 === 0) xp += 5;
  return { xp, newStreak };
}

export function calcStars(correctCount, totalCount = 10) {
  const pct = totalCount > 0 ? correctCount / totalCount : 0;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function isWorldUnlocked() {
  return true;
}

export {
  genMultiplication, placeValueParts, noCarryError, noShiftError,
  generateProductDistractors, englishNames, randInt, shuffleArray, generateDistractors,
};
