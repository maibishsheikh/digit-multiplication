# Multi-Digit Multiplication — AI Image Generation Prompts & Asset Specs

This guide provides exact dimensions, aspect ratios, art style guidelines, and detailed text prompts for generating custom artwork for the **Multi-Digit Multiplication** module (`MultiplyQuest`).

---

## 1. Asset Specifications & Dimensions

| Asset | File Destination | Recommended Resolution | Aspect Ratio | Format |
| :--- | :--- | :--- | :--- | :--- |
| **Story Panel 1** | `src/assets/story/1.png` (or `public/assets/images/story_0.png`) | `1200 × 800 px` (or `1600 × 1066 px`) | 3:2 Landscape | PNG / WebP |
| **Story Panel 2** | `src/assets/story/2.png` (or `public/assets/images/story_1.png`) | `1200 × 800 px` (or `1600 × 1066 px`) | 3:2 Landscape | PNG / WebP |
| **Story Panel 3** | `src/assets/story/3.png` (or `public/assets/images/story_2.png`) | `1200 × 800 px` (or `1600 × 1066 px`) | 3:2 Landscape | PNG / WebP |
| **Story Panel 4** | `src/assets/story/4.png` (or `public/assets/images/story_3.png`) | `1200 × 800 px` (or `1600 × 1066 px`) | 3:2 Landscape | PNG / WebP |
| **Mascot Flip Avatar** | `src/assets/characters/flip.png` | `512 × 512 px` | 1:1 Square | PNG (Transparent) |
| **Max Character Avatar** | `src/assets/characters/max.png` | `512 × 512 px` | 1:1 Square | PNG (Transparent) |
| **Sophie Character Avatar** | `src/assets/characters/sophie.png` | `512 × 512 px` | 1:1 Square | PNG (Transparent) |

---

## 2. Universal Art Style Directives

- **Style:** Whimsical 3D digital illustration / Pixar-style stylized educational aesthetic.
- **Lighting & Color:** Warm, vibrant lighting, rich volumetric depth, glowing math elements, cheerful color palette (warm amber, indigo blues, golden yellow, fresh green).
- **Characters:** Expressive child characters with friendly faces and appealing design.
- **Backgrounds:** Clean, clutter-free, highly readable educational environments with soft ambient bokeh.

---

## 3. Story Panel Prompts

### Panel 1 — Max's Big Bakery Order
- **File Name:** `src/assets/story/1.png`
- **Dimensions:** `1200 × 800 px`
- **Dialogue / Text Context:** *"Max just received the largest order of his life — 4 giant party boxes for the Sunnyvale Town Festival, each holding 2,314 mini cupcakes! Max starts writing repeated addition on paper and sighs: 'There must be a faster way than adding 2,314 four times…'"*
- **Prompt:**
  ```text
  A charming 3D animated illustration of a cheerful young boy baker named Max in a cozy, sunlit bakery kitchen. On a wooden countertop are 4 large open party gift boxes overflowing with thousands of colorful miniature cupcakes with sprinkles. Max is wearing a small baker's apron, scratching his head thoughtfully with a pencil in his hand, looking at a long paper notepad covered in handwritten addition notes (2314 + 2314 + 2314 + 2314). Whimsical floating numbers and cupcake icons glow softly in the air. Warm morning sunlight streaming through the bakery window, vibrant pastel colors, Pixar/Disney style, cinematic depth of field, 8k render, landscape 3:2.
  ```

---

### Panel 2 — Sophie Breaks It Apart (Area Model)
- **File Name:** `src/assets/story/2.png`
- **Dimensions:** `1200 × 800 px`
- **Dialogue / Text Context:** *"Sophie dashes into the bakery! 'Multiplication is super fast when you use the Area Model! Break 2,314 apart by place value: 2,000 + 300 + 10 + 4. Multiply each place-value chunk by 4, then sum them up!'"*
- **Prompt:**
  ```text
  A vibrant 3D animated educational scene in a bakery kitchen. An energetic young girl named Sophie with pigtails points enthusiastically at a magical glowing floating glass board. On the board, the number 2,314 is broken apart into 4 glowing colored rectangular tiles labeled 2,000, 300, 10, and 4, each with a multiplication arrow multiplying by 4 to reveal glowing partial products (8,000, 1,200, 40, 16). Max watches with wide, amazed eyes. Cheerful, high-tech educational illustration, volumetric soft glow, rich purple and gold ambient light, 8k render, landscape 3:2.
  ```

---

### Panel 3 — Flip Shows the Fast Way (Standard Algorithm)
- **File Name:** `src/assets/story/3.png`
- **Dimensions:** `1200 × 800 px`
- **Dialogue / Text Context:** *"Flip the Fox pulls out his chalkboard. 'You can also line the digits up vertically and multiply the standard algorithm way! Multiply right-to-left, regrouping carried numbers into the next column. Same exact total in seconds!'"*
- **Prompt:**
  ```text
  A delightful 3D animated illustration featuring an intelligent, friendly red fox character named Flip wearing small round glasses and holding a wooden pointer. Flip is standing next to an easel chalkboard showing a vertical multiplication calculation: 2,314 stacked over 4 with a multiplication sign, with small golden carried numbers glowing above each column and the final product 9,256 written neatly at the bottom. Max and Sophie are smiling approvingly. Warm studio lighting, sparkling math stars, crisp clean typography on chalkboard, Disney/Pixar animation style, 8k render, landscape 3:2.
  ```

---

### Panel 4 — Multiplication Mastery Unlocked
- **File Name:** `src/assets/story/4.png`
- **Dimensions:** `1200 × 800 px`
- **Dialogue / Text Context:** *"Max packs all 9,256 cupcakes with zero mistakes! Next, he calculates that his 45 helpers each get 128 thank-you stickers. That is 3-digit × 2-digit multiplication (128 × 45 = 5,760), and Max solves it in a flash! 'Let's simulate and practice!'"*
- **Prompt:**
  ```text
  A celebratory 3D animated scene outside the festive bakery decorated with colorful festival banners and balloons. Max, Sophie, and Flip the Fox are giving each other high-fives and holding up a golden Multiplication Master trophy. Beautifully stacked bakery boxes with stickers and ribbons surround them, with shimmering gold confetti, sparkling stars, and floating celebration emojis (🧁, ✨, 🏆, 🚀). Joyful expressions, triumphant atmosphere, rich golden hour lighting, cinematic render, 8k resolution, landscape 3:2.
  ```

---

## 4. Character Avatars Prompts

### Flip the Fox (Narrator & Guide Mascot)
- **File Name:** `src/assets/characters/flip.png`
- **Dimensions:** `512 × 512 px`
- **Prompt:**
  ```text
  A cute 3D animated red fox character portrait named Flip, wearing smart round spectacles, a friendly smile, giving a thumbs up, transparent background, isolated, bright warm studio lighting, Pixar character design style, 8k.
  ```

### Max the Baker
- **File Name:** `src/assets/characters/max.png`
- **Dimensions:** `512 × 512 px`
- **Prompt:**
  ```text
  A cute 3D animated young boy baker character portrait named Max, wearing a white baker's hat and apron, friendly cheerful expression, transparent background, isolated, studio lighting, Pixar character design style, 8k.
  ```

### Sophie the Math Whiz
- **File Name:** `src/assets/characters/sophie.png`
- **Dimensions:** `512 × 512 px`
- **Prompt:**
  ```text
  A cute 3D animated young girl character portrait named Sophie with pigtails, holding a colorful notepad, smart enthusiastic smile, transparent background, isolated, studio lighting, Pixar character design style, 8k.
  ```
