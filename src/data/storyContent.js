// src/data/storyContent.js
// 4-panel educational story for Multi-Digit Multiplication featuring English characters (Max, Sophie & Flip the Fox)

export const STORY_PANELS = [
  {
    panel: 0,
    title: "Max's Big Bakery Order 🧁",
    text: "Max just received the largest order of his life — 4 giant party boxes for the Sunnyvale Town Festival, each holding 2,314 mini cupcakes! Max starts writing repeated addition on paper and sighs: 'There must be a faster way than adding 2,314 four times…'",
    character: "Max",
    imageEmoji: "🧁",
    imageBg: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
    imageScene: "bakery_order",
    highlight: "4 Boxes × 2,314 Cupcakes",
  },
  {
    panel: 1,
    title: "Sophie Breaks It Apart! 🧩",
    text: "Sophie dashes into the bakery! 'Multiplication is super fast when you use the Area Model! Break 2,314 apart by place value: 2,000 + 300 + 10 + 4. Multiply each place-value chunk by 4, then sum them up!'",
    character: "Sophie",
    imageEmoji: "👧",
    imageBg: "linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)",
    imageScene: "place_value_split",
    highlight: "(2,000 + 300 + 10 + 4) × 4 = 9,256",
  },
  {
    panel: 2,
    title: "Flip Shows the Fast Way! 🦊",
    text: "Flip the Fox pulls out his chalkboard. 'You can also line the digits up vertically and multiply the standard algorithm way! Multiply right-to-left, regrouping carried numbers into the next column. Same exact total in seconds!'",
    character: "Flip the Fox",
    imageEmoji: "🦊",
    imageBg: "linear-gradient(135deg, #01579b 0%, #0277bd 100%)",
    imageScene: "standard_algorithm",
    highlight: "2,314 × 4 = 9,256 (Regroup & Carry)",
  },
  {
    panel: 3,
    title: "Multiplication Mastery Unlocked! 🚀",
    text: "Max packs all 9,256 cupcakes with zero mistakes! Next, he calculates that his 45 helpers each get 128 thank-you stickers. That is 3-digit × 2-digit multiplication (128 × 45 = 5,760), and Max solves it in a flash! 'Let's simulate and practice!'",
    character: "Max & Flip",
    imageEmoji: "✨",
    imageBg: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
    imageScene: "celebration",
    highlight: "Ready to Simulate!",
  },
];
