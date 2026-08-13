// src/features/story/storyScripts/slides.js
//
// All 4 story slides for "Max's Big Bakery Order".
// No artwork has been supplied yet — StoryPhase renders a placeholder
// frame per slide until real PNGs are dropped into src/assets/story/
// (1.png – 4.png). See that folder's README.md for the exact image size.

export const STORY_SLIDES = [
  {
    title: "Max's Big Bakery Order 🧁",
    text: 'Max just got the biggest order of his life — 4 boxes for a city festival, each packed with 2,314 mini cupcakes! He starts adding 2,314 + 2,314 + 2,314 + 2,314 on paper and sighs. "There has to be a faster way than this…"',
    highlight: '🤔  How many cupcakes in total — without adding 4 times?',
    answer: null,
    narrationIdx: 0,
  },
  {
    title: 'Sophie Breaks It Apart! ✖️',
    text: 'Sophie hops over. "Multiplying is way faster! Break 2,314 apart by place value: 2,000 + 300 + 10 + 4. Multiply each part by 4, then add it all up!"',
    highlight: '✖️  (2,000 + 300 + 10 + 4) × 4 = 8,000 + 1,200 + 40 + 16 = 9,256',
    answer: null,
    narrationIdx: 1,
  },
  {
    title: 'Flip Shows the Fast Way! 🦊',
    text: 'Flip the Fox pulls out a notepad. "You can also line the numbers up and multiply the standard way — just regroup (carry) into the next place value as you go. Same answer, fewer steps!"',
    highlight: '🦊  2,314 × 4 = 9,256 — regroup as you multiply each digit!',
    answer: null,
    narrationIdx: 2,
  },
  {
    title: 'Max Multiplies Like a Pro! 🚀',
    text: 'Max grins and packs all 9,256 cupcakes without a single mistake. Next, he even works out that his 45 helpers each deserve 128 thank-you stickers — that\'s 3-digit × 2-digit multiplication, and Max solves it just as fast!',
    highlight: '🚀  128 × 45 = 5,760 — break it apart or multiply the standard way, either works!',
    answer: null,
    narrationIdx: 3,
  },
];
