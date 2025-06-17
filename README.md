# 🧪 ChemLyrics — Periodic Table Style Lyrics Animator

Create lyric videos like never before. Mix **Chemistry**, **Coding**, **Emojis**, and **Physics Symbols** to make your lyrics *explode with style*.

![App Preview](preview.gif) <!-- Replace with actual GIF or image of the app output -->

---

## 🚀 Features

- 🧬 **Chemistry Mode**: Words broken down into real periodic table elements (preferring two-letter symbols first, then one-letter).
- ❤️ **Emoji Mode**: Can’t find the element? Use expressive emojis for common words like `love`, `fire`, `heart`, `dance`.
- 🧲 **Physics & Math Fallback**: Still unmatched? Uses scientific unit symbols (like `Ω`, `µ`, `Å`, `℃`) to fill every character gap.
- ✨ **Block Style Rendering**: Everything styled like a periodic table cell — element name, symbol, and atomic number.
- ⏱️ **Timestamp Sync**: Supports timed lyrics to generate animated visuals in sync with the music.

---

## 🎬 Example Output

Word: LOVE

→ [Li] [O] [V] [e⁻]

OR if not found in table:
→ ❤️ (emoji fallback)

yaml
Copy
Edit

Each word becomes a stack of stylish chemistry blocks with real or symbolic meaning!

---

## 🔧 How It Works

1. Input your lyrics and timestamps (optional).
2. The app parses each word.
3. For every word:
   - 🔍 **Check Emoji Map** → if found, use emoji.
   - 🧪 **Match 2-letter Element Symbols** → if matched, use.
   - 🧪 **Else, Match 1-letter Elements**.
   - 🧮 **Fallback with Physics/Math Symbol Map**.
4. Words are rendered vertically, preserving timestamp breaks.
5. Export animation.

---

## 📂 File Structure

/src
/components
LyricsDisplay.tsx # Core display logic
/utils
periodicTable.ts # Element/emoji/physics matching logic
/assets
periodicData.json # Element data (118 real elements)
emojiMap.ts # Word-to-emoji dictionary
physicsMap.ts # A–Z fallback symbol dictionary

mathematica
Copy
Edit

---

## 🧠 Fallback Symbol Map (Physics/Math Style)

| A = Å (Angstrom) | B = B (Magnetic Field) | C = ℃ (Celsius)       |
|------------------|------------------------|------------------------|
| D = D (Debye)    | E = e⁻ (Electron)      | F = F (Farad)          |
| G = G (Gravity)  | H = H (Henry/Planck)   | I = I (Current)        |
| J = J (Joule)    | K = K (Kelvin)         | L = L (Liter)          |
| M = m (Mass)     | N = N (Newton)         | O = Ω (Ohm)            |
| P = P (Power)    | Q = Q (Charge)         | R = R (Resistance)     |
| S = S (Siemens)  | T = T (Tesla)          | U = µ (Micro/Unit)     |
| V = V (Volt)     | W = W (Watt)           | X = χ (Chi)            |
| Y = γ (Gamma)    | Z = Z (Atomic Number)  |

---

## 🧪 Emoji Word Map Example

```ts
{
  "love": "❤️",
  "fire": "🔥",
  "music": "🎶",
  "dance": "💃",
  "heart": "💖",
  "girl": "👧",
  "boy": "👦",
  "happy": "😊",
  "sad": "😢",
  "cool": "😎"
}
You can expand this map easily in emojiMap.ts.

💡 Why This Project?
"Topper se impress karne ke liye chemistry ki kitaab nahi, code likha."

From a nerdy backbencher to a coding chemist — this app was born out of heartbreak, topped with humor, and spiced with science.

🛠️ Setup Instructions
bash
Copy
Edit
git clone https://github.com/yourusername/chemsong-lyrics-visualizer
cd chemsong-lyrics-visualizer
npm install
npm run dev
📦 Tech Stack
React + TypeScript

TailwindCSS

Vite or Next.js

Framer Motion

Custom splitting + symbol logic

✨ Inspiration
🎵 Inspired by "Eenie Meenie Miney Mo Lova" and real periodic table beauty
🔬 Adds a twist of chemistry, emoji culture, and science symbolism
🎥 Meant for Instagram Reels, Shorts, and YouTube lyric videos

🙌 Contribute
Feel free to fork, improve symbol sets, or add your own visual themes!

📸 Logo & Favicon
Designed using AI and vector graphics — combining 🎶 + ⚗️ + 💖
(See public/favicon.ico and assets/logo.svg)

yaml
Copy
Edit

---

Let me know if you want me to generate the actual `.ts` files like `emojiMap.ts`, `physicsMap.ts`, or
