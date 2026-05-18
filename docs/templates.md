# WikiRun — Templates & HTML Structure

---

## Structural Overview

WikiRun is a **multi-page static application** composed of four distinct HTML documents. Each page serves a specific stage in the user journey and loads its own CSS and JavaScript files. There is no JavaScript framework, component system, or client-side routing — navigation occurs via standard `<a>` element links and `window.location.href` redirects.

### Pages at a Glance

| Page            | File             | Purpose                                      | CSS              | JS                   |
| --------------- | ---------------- | -------------------------------------------- | ---------------- | -------------------- |
| Boot Screen     | `index.html`     | Terminal-style loading animation             | `overlay.css`    | `overlay.js`         |
| Menu / Briefing | `wikirun.html`   | Rules, crew ranking, start button            | `style.css`      | `script.js` (shared) |
| Gameplay        | `main.html`      | Rendered Wikipedia view, timer, jump counter | `style-main.css` | `script.js` (shared) |
| Results         | `finalPage.html` | Score, achievements, path history            | `finalPage.css`  | `finalPage.js`       |

---

## Key Layouts

### 1. Boot Screen (`index.html`)

The simplest page in the application. Its sole purpose is to present a retro terminal boot sequence.

```
┌────────────────────────────────┐
│  [noise overlay]               │
│                                │
│  ┌── container ─────────────┐  │
│  │  Press enter to boot     │  │
│  │                          │  │
│  │[boot lines appear here]  │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

- **`<main id="loading">`** — Contains the initial "Press enter" prompt and dynamically receives boot status lines.
- **`.overlay.noise`** — CRT-style noise background (GIF from Giphy).
- After boot completes, the browser redirects to `wikirun.html`.

### 2. Menu / Briefing (`wikirun.html`)

Two-column layout on desktop; single column on mobile.

```
┌────────────────────────────────────────────┐
│  [hidden nav — marquee, desktop only]      │
│  ┌── border (fuchsia) ────────┐            │
│  │  ┌─ hero-main ─┐ ┌─ rank ─┐│            │
│  │  │ WIKIRUN      ││ CREW   ││            │
│  │  │ Beat it      ││ RANKING││            │
│  │  │ // MISSION   ││        ││            │
│  │  │ BRIEFING     ││ DIAG   ││            │
│  │  │ TARGET: MJ   ││        ││            │
│  │  │ // RULES     ││ logo   ││            │
│  │  │ [START BTN]  ││        ││            │
│  │  └──────────────┘└────────┘│            │
│  └────────────────────────────┘            │
└────────────────────────────────────────────┘
```

Key structural elements:

- **`header.hidden`** — Hidden on mobile, visible on desktop (`@media >= 1024px`). Contains a scrolling marquee (`<ul class="traslate">`) with mission text.
- **`.hero-container`** — Flexible wrapper. Column layout on mobile, row layout on desktop.
- **`.hero-main`** — Left column. Contains the title, mission briefing, target node callout, rules, and start button.
- **`.ranking-and-diagnostics`** — Right column. Contains crew ranking and system diagnostics readouts.
- **`button#start-btn`** — Wrapped in an `<a>` linking to `main.html`. This is the entry point to gameplay.

### 3. Gameplay (`main.html`)

Full-width layout with sticky header and footer.

```
┌────────────────────────────────────────────┐
│  ┌── header (sticky) ──────────────┐       │
│  │  WIKI RUN │ Protocol │ Page: X  │       │
│  └────────────────────────────────┘        │
│  ┌── main content area ──────────┐         │
│  │  ┌─#display-result─────────┐  │         │
│  │  │ Wikipedia article HTML  │  │         │
│  │  │ (injected dynamically)  │  │         │
│  │  └─────────────────────────┘  │         │
│  └───────────────────────────────┘         │
│  ┌── footer (sticky) ────────────┐         │
│  │  [Jumps] │ [Logo] │ [Timer]   │         │
│  └───────────────────────────────┘         │
└────────────────────────────────────────────┘
```

Key structural elements:

- **`header`** — Sticky to top (`position: sticky; top: 0`). Contains a marquee title bar and a dynamic page title (`#title`).
- **`.border-grey` / `.border-fucsia`** — Nested decorative border wrappers that create the terminal-frame aesthetic.
- **`<main>` → `#display-result`** — Empty container that receives full Wikipedia article HTML via inner HTML injection (`script.js`).
- **`footer`** — Sticky to bottom. Three-zone flex layout:
  - **Jump counter** (`#n-jumps`, `#jumps`, `#jump-text`)
  - **Logo** (hidden on mobile, visible on desktop)
  - **Timer** (`#minutes`, `#seconds`)

### 4. Results (`finalPage.html`)

Two-column layout on desktop; single column on mobile. Mirrors the menu page structure.

```
┌────────────────────────────────────────────┐
│  ┌── border (fuchsia) ────────┐            │
│  │  ┌─ hero-main ─┐ ┌─ diag ─┤│            │
│  │  │ WIKIRUN      ││ logo   ││            │
│  │  │ Beat it      ││        ││            │
│  │  │ YOU WON!     ││ Score  ││            │
│  │  │              ││ Achiev ││            │
│  │  │ [TRY AGAIN]  ││ Path   ││            │
│  │  └──────────────┘└────────┘│            │
│  └────────────────────────────┘            │
└────────────────────────────────────────────┘
```

Key structural elements:

- Same header nav, border wrapper, and `.hero-container` pattern as `wikirun.html`.
- **`.results`** — "YOU WON!" message with groove borders.
- **`.your-score`** — Dynamically populated paragraphs (`#nr-of-jumps`, `#time`, `#best-score`, `#best-time`).
- **`.achievements`** — Dynamically populated achievement list.
- **`.path-history`** — Shows the full path from start to finish as an arrow-separated string.
- **`a#start-btn`** — Links back to `main.html` to restart.

---

## Data Injection & Dynamic Content

### Wikipedia Article Rendering (`main.html`)

The `#display-result` div is populated entirely through JavaScript:

1. `script.js` fetches the article HTML from the Wikipedia API (`action=parse&prop=text`).
2. The raw HTML is injected via `result.innerHTML = `<h1>${title}</h1>${html}``.
3. After injection, all internal `<a>` tags are processed:
   - Links matching `/wiki/Article_Name` are kept and given a `click` handler that loads the next article.
   - All other links (external URLs, section anchors, file links, etc.) are **disabled** via `disableLink()`.

### URL-Parameter Passing (`main.html` → `finalPage.html`)

When the player reaches the target, game state is passed via URL query parameters:

```
finalPage.html?score=<jumps>&time=<seconds>&path=<url-encoded-json-path-history>
```

`finalPage.js` reads these with `URLSearchParams` and populates the DOM accordingly.

### `localStorage` Keys

| Key            | Type                  | Description                                 |
| -------------- | --------------------- | ------------------------------------------- |
| `bestScore`    | `string` (number)     | Fewest jumps to reach the target            |
| `bestTime`     | `string` (number)     | Fastest time in seconds to reach the target |
| `achievements` | `string` (JSON array) | Cumulative list of unlocked achievements    |
