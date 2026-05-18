# WikiRun — Project Overview

## Project Overview

**WikiRun** is a Wikipedia-based challenge game where the player starts from a randomly assigned Wikipedia article and must reach the target node — **"Michael Jackson"** — using only internal wiki links. The objective is to complete the journey in the fewest jumps and shortest time possible.

The concept is inspired by the "Wikirace" genre: navigate the interconnected graph of Wikipedia articles with minimal clicks. The game features a retro-futuristic, terminal-inspired aesthetic with sound effects, an achievements system, and persistent high scores via `localStorage`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend (Structure)** | HTML5 (multi-page, static) |
| **Frontend (Styling)** | CSS3 (plain, mobile-first, custom properties) |
| **Frontend (Logic)** | Vanilla JavaScript (no frameworks or build tooling) |
| **API** | [Wikipedia MediaWiki Action API](https://www.mediawiki.org/wiki/API:Main_page) |
| **Audio** | Web Audio API (procedural sound effects, no external files) |
| **Persistence** | `localStorage` (scores, achievements, path history) |
| **Fonts** | Google Fonts — **VT323** (primary, monospace), **Montserrat** (secondary) |
| **Hosting** | GitHub Pages (static deployment) |

---

## Getting Started

This project is entirely static — no build step or backend server is required.

### Prerequisites

- A modern browser with Web Audio API and `localStorage` support
- Node.js (optional, for local development server)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/gabgigante/PlaceHolderWikiRunner.git
cd PlaceHolderWikiRunner

# 2. Serve locally (optional — the app works by opening files directly)
npx serve .

# 3. Open index.html in your browser
```

### Environment Variables

No environment variables or configuration files are required.

---

## Project Structure

```
WikiRunner/
├── index.html              # Boot screen (animated terminal loading)
├── wikirun.html            # Game menu & mission briefing
├── main.html               # Core gameplay (rendered Wikipedia articles)
├── finalPage.html          # Victory/results screen
│
├── assets/
│   ├── css/
│   │   ├── overlay.css          # Boot screen styles
│   │   ├── style.css            # Menu/briefing page styles
│   │   ├── style-main.css       # Gameplay page styles
│   │   └── finalPage.css        # Results page styles
│   ├── js/
│   │   ├── overlay.js           # Boot animation & audio (index.html)
│   │   ├── script.js            # Main game logic (main.html, wikirun.html)
│   │   ├── finalPage.js         # Results rendering (finalPage.html)
│   │   ├── timer.js             # Test helper (index-test.html)
│   │   └── index-test.html      # Development test page
│   └── img/
│       ├── favicon_wikirun/     # Favicon set (multi-size + web manifest)
│       └── logo.png             # App logo
│
├── docs/                    # This documentation suite
├── README.md                # Project README
├── planning.md              # Project notes & roadmap (internal)
└── connections.md           # Git setup instructions (internal)
```

### Page Flow

```
index.html (Boot)
    │  [Press Enter]
    ▼
wikirun.html (Menu & Briefing)
    │  [Start The Moonwalk]
    ▼
main.html (Gameplay — random article → navigate links)
    │  [Reaches "Michael Jackson"]
    ▼
finalPage.html (Results, Achievements, Path History)
    │  [Try Again]
    ▼
main.html (Gameplay — new random start)
```

---

## Team

| Role | Member |
|---|---|
| Crew | Gab, Denise, Tia, KevR |

Built over approximately one week of active development.
