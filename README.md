<p align="center">
  <img src="https://img.shields.io/badge/bloom-cinematic%20city%20dashboard-blueviolet?style=for-the-badge" alt="Bloom" />
  <img src="https://img.shields.io/badge/react-18+-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5+-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-5+-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

# 🌸 Bloom

> *"Feel the city."*

**Bloom** is a cinematic atmospheric city dashboard designed to be your browser's homepage. Search for any city and experience it — real-time weather, local time, ambient animations, and AI-generated narration come together to create a living, breathing portal into that city's atmosphere.

---

## ✨ What It Does

- 🔍 **Search any city** — type a city name and instantly dive into its atmosphere
- 🌦️ **Live weather** — real-time temperature, humidity, wind, air quality, sunrise/sunset, and moon phase
- 🎨 **Dynamic visuals** — background gradients, particles (rain, snow, fog, dust), and imagery shift based on weather and time of day
- 🐾 **Ambient buddy** — a small animated companion that reacts to the weather and follows your cursor
- 🗣️ **AI narration** — poetic one-liners describing what the city feels like right now
- 📅 **7-day forecast** — a cinematic timeline with temperature curves and precipitation indicators
- 🏙️ **City intelligence** — quick facts, landmarks, and vibe tags pulled from Wikipedia

---

## 🛠️ Tech Stack

| Technology | Role |
|-----------|------|
| React 18+ | UI framework |
| TypeScript 5+ | Type-safe codebase |
| Vite 5+ | Build tool & dev server |
| TailwindCSS 3.4+ | Styling |
| Framer Motion & GSAP | Animations |
| Zustand | State management |
| HTML5 Canvas & Three.js | Visual effects |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/bloom.git
cd bloom

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `.env` file in the project root. Core weather and geocoding APIs are free and require no keys. For optional enhanced features:

```env
VITE_UNSPLASH_ACCESS_KEY=your_key    # City background images
VITE_OPENAQ_API_KEY=your_key         # Air quality data
VITE_OPENAI_API_KEY=your_key         # AI narration (OpenAI)
VITE_GEMINI_API_KEY=your_key         # AI narration (Gemini)
```

> API keys can also be set at runtime via the in-app **Settings** panel.

### Build for Production

```bash
npm run build
npx serve dist
```

---

## 🌐 APIs Used

| API | What It Provides |
|-----|-----------------|
| [Open-Meteo](https://open-meteo.com/) | Weather data & city geocoding (free, no key) |
| [OpenAQ](https://openaq.org/) | Air quality index |
| [Unsplash](https://unsplash.com/developers) | City photography |
| [Wikipedia](https://en.wikipedia.org/api/rest_v1/) | City facts & summaries |
| [WorldTime](https://worldtimeapi.org/) | Local time by timezone |
| [OpenAI](https://platform.openai.com/) / [Gemini](https://ai.google.dev/) | AI-generated narration |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <sub>Built with 🌸 by the Bloom team</sub>
</p>
