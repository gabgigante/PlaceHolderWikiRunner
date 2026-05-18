# WikiRun — Scripts & JavaScript Logic

---

## Core Logic

The application uses **vanilla JavaScript** with no modules, bundlers, or external dependencies. Each page loads its respective script at the bottom of `<body>`.

### Entry Points by Page

| Script | Loaded By | Responsibility |
|---|---|---|
| `overlay.js` | `index.html` | Boot animation, sound effects, auto-redirect to menu |
| `script.js` | `wikirun.html`, `main.html` | Crew ranking (menu), game engine, Wikipedia fetching, timer (gameplay) |
| `finalPage.js` | `finalPage.html` | Results rendering, score/achievement display |
| `timer.js` | `index-test.html` | Development test timer (not used in production) |

---

## Game Engine (`script.js`)

`script.js` is the core of the application. It handles two distinct modes depending on which page loads it:

### Menu Mode (`wikirun.html`)

When loaded on the menu page, `script.js` populates the crew ranking scoreboard with random data:

```js
const scores = document.querySelectorAll(".score");
scores.forEach((score) => {
  const randomJumps = Math.floor(Math.random() * 10) + 2;
  score.textContent = `${randomJumps} jumps`;
});
```

Each crew member (SaccoViola, Gab, Tia, KevR) receives a random jump count between 2 and 11, displayed in the "CREW RANKING" section.

### Gameplay Mode (`main.html`)

When loaded on the gameplay page, `script.js` activates the full game engine:

1. On `DOMContentLoaded`, calls `getWikiAPI()` to fetch a random starting article.
2. Starts the timer via `setInterval` (1-second ticks).
3. Renders the article into `#display-result` and processes all links.

---

## State Management

All game state is managed through **module-scope global variables** in `script.js`. There is no state management library or pattern.

| Variable | Type | Purpose | Initial Value |
|---|---|---|---|
| `audioCtx` | `AudioContext \| null` | Web Audio API context | `null` |
| `count` | `number` | Timer in seconds (running total) | `0` |
| `clickCount` | `number` | Number of link clicks (jumps taken) | `0` |
| `currentTitle` | `string` | Currently displayed article title | `""` |
| `pathHistory` | `string[]` | Ordered list of all visited article titles | `[]` |
| `achievements` | `string[]` | Achievements unlocked during current session | `[]` |
| `intervalId` | `number` | Timer interval ID for `clearInterval` | _set by `setInterval`_ |

### Persistence via `localStorage`

| Key | Written When | Read By |
|---|---|---|
| `achievements` | On reaching target (JSON-serialized array) | `finalPage.js` (displays all unlocked achievements) |
| `bestScore` | On reaching target if current jumps < saved best | `finalPage.js` (displays as "Best score") |
| `bestTime` | On reaching target if current time < saved best | `finalPage.js` (displays as "Best time", formatted to MM:SS) |

### Achievements System

Achievements are checked at the moment the player reaches "Michael Jackson":

| Achievement | Icon | Condition |
|---|---|---|
| King of Pop | 👑 | `clickCount <= 5` |
| Moonwalker | 🏆 | `clickCount <= 10` |
| Smooth Criminal | ⚡ | `count <= 120` (under 2 minutes) |
| Normie | 🦅 | Path includes "United States" |
| Might be he | 💀 | Path includes "Adolf Hitler" |
| He's not his kid | 🕺 | Path includes "Billie Jean" |
| Not directed by Spielberg | 🎬 | Path includes "Thriller" |

Achievement data is **cumulative**: the `achievements` array is never reset between sessions, so all previously unlocked achievements persist once stored in `localStorage`.

---

## API Integration

The application communicates with the **Wikipedia MediaWiki Action API** using `fetch()`. Two distinct endpoints are used:

### 1. Random Article Fetch

```
GET https://en.wikipedia.org/w/api.php
  ?action=query
  &generator=random
  &grnnamespace=0
  &grnlimit=1
  &format=json
  &origin=*
```

- Called by `getWikiAPI()` at game start.
- `grnnamespace=0` restricts results to main article namespace (no categories, files, templates, etc.).
- If the random result is "Michael Jackson" itself, the function **recurses** (`getWikiAPI()` calls itself) to fetch a new starting article.

### 2. Article Parse

```
GET https://en.wikipedia.org/w/api.php
  ?action=parse
  &page=<article-title>
  &prop=text
  &format=json
  &origin=*
```

- Called by `loadWikipediaPage()` for every article view.
- Returns the full rendered HTML of the article body.
- The HTML is injected directly into `#display-result` via `innerHTML`.

### 3. Redirect Detection

```
GET https://en.wikipedia.org/w/api.php
  ?action=query
  &titles=<article-title>
  &redirects
  &format=json
  &origin=*
```

- Called by `isRedirectPage()` before rendering an article.
- If the title resolves to a redirect, the player is returned to the previous article (redirect trap prevention).

### CORS Handling

All requests include `origin=*` as a query parameter. This is the MediaWiki API's CORS bypass mechanism. Requests use `fetch()` with default JSON response parsing.

---

## Link Filtering

After injecting article HTML, every `<a>` element in `#display-result` is evaluated:

```js
result.querySelectorAll("a").forEach((link) => {
  const href = link.getAttribute("href");
  const wikiMatch = href.match(/^\/wiki\/([^#:]+)$/);
```

**Filtering rules:**

1. **No `href`** → Disabled via `disableLink()`.
2. **No match for `/wiki/Article_Name`** (has fragments `#`, colons `:`, or external URL) → Disabled.
3. **Matches `/wiki/Article_Name`** → Kept. A `click` event listener is attached:
   - Prevents default navigation (`e.preventDefault()`).
   - Plays a "key type" sound effect.
   - Calls `loadWikipediaPage(finalTitle, true)` to load the next article.
   - Increments the jump counter.

**`disableLink()`** removes the `href` attribute, sets `cursor: default`, and `pointerEvents: "none"`.

---

## Timer System

The timer runs continuously during gameplay using a simple `setInterval` at 1-second intervals:

```js
const intervalId = setInterval(() => {
  count++;
  seconds.textContent = String(count % 60).padStart(2, "0");
  minutes.textContent = String(Math.floor(count / 60) % 60).padStart(2, "0");

  if (count >= 3600) {
    playEmergencySound();
    clearInterval(intervalId);
  }
}, 1000);
```

- **Display format:** `MM:SS` (minutes and seconds, zero-padded).
- **Max time:** 3600 seconds (1 hour). When reached, the timer stops and an emergency alarm sound plays.
- **On win:** `clearInterval(intervalId)` stops the timer; final `count` value is passed to the results page via URL params.

---

## Win Condition

```js
if (title.toLowerCase() === "michael jackson") {
  clearInterval(intervalId);
  // achievements check, localStorage save, redirect...
}
```

Sequence on reaching the target:

1. Timer is stopped via `clearInterval`.
2. All achievement conditions are evaluated and added to the `achievements` array.
3. Best score and best time are compared and updated if the current run is better.
4. Achievements are serialized to `localStorage`.
5. A return sound plays.
6. After 300ms, the player is redirected to `finalPage.html` with `score`, `time`, and `path` encoded in the URL query string.

---

## Results Page Logic (`finalPage.js`)

### Anti-Reload Protection

```js
const navigation = performance.getEntriesByType("navigation")[0];
if (navigation && navigation.type === "reload") {
  window.location.href = "../wikirun.html";
}
```

If the user refreshes the results page (which would lose URL params), they are redirected back to the menu.

### Data Population

| Element ID | Content |
|---|---|
| `#nr-of-jumps` | `"You won in <score> jumps"` |
| `#time` | `"Time: <MM>:<SS>"` |
| `#best-score` | `"Best score: <bestScore>"` |
| `#best-time` | `"Best time: <bestMM>:<bestSS>"` |
| `.path-history` | Full path: `Article1 → Article2 → ... → Michael Jackson` |
| `.achievements` | Each achievement as a `<p>` element + popup notification |

### Achievement Popup

The `showAchievement()` function creates a temporary `<div class="achievement-popup">` overlay that displays the achievement text and self-removes after 3 seconds.

---

## Boot Screen Logic (`overlay.js`)

### Audio Context Initialization

Web Audio API requires user interaction before it can play sound. The audio context is initialized on the first `keydown` event:

```js
document.addEventListener("keydown", initAudio, { once: true });
```

### Sound Effects

| Function | Effect | Tone Pattern |
|---|---|---|
| `playTone(freq, dur, type, vol, detune)` | Base oscillator | Generic, configurable parameters |
| `playReturnSound()` | CRLF mechanical clunk | 600Hz sawtooth + 120Hz square (detuned -30) |
| `playErrorSound()` | Error buzz | 220Hz → 180Hz sawtooth (150ms stagger) |
| `playBootChirp()` | Success chirp | 440Hz → 660Hz → 880Hz sine (upward scale) |

Additional effects in `script.js`:

| Function | Effect | Tone Pattern |
|---|---|---|
| `playKeyType()` | Keyboard click | Random 900-1100Hz square + noise burst |
| `playDataSound()` | Data loading | 6 random tones 2000-6000Hz (40ms gaps) |
| `playEmergencySound()` | Hour alarm | 8 alternating tones (800/400Hz, 200ms gaps) |

### Boot Sequence

Five boot lines are displayed sequentially with delays:

```
CONNECTING TO SERVER... OK                  (1.5s)  → playReturnSound
CALLING WIKI API... OK                     (1.5s)  → playReturnSound
FINDING NODE TARGET... ERROR | MANUAL OVERRIDE  (2.5s) → playErrorSound
TARGET: MICHAEL JACKSON                    (1.0s)  → playBootChirp
READY TO START THE GAME                    (1.0s)  → playBootChirp
```

After the sequence completes (~9.1s total), the browser auto-redirects to `wikirun.html`. The player can press **Enter** at any time to skip to the next screen early.

### Path Resolution for Hosting

Both `overlay.js` and the skip handler detect GitHub Pages hosting and adjust redirect paths:

```js
const isGithubPages = window.location.hostname.includes("github.io");
```

| Environment | Redirect Path |
|---|---|
| GitHub Pages | `/PlaceHolderWikiRunner/wikirun.html` |
| Local dev | `../../wikirun.html` |

---

## Event Listeners Summary

| Event | Target | Handler | Page(s) |
|---|---|---|---|
| `keydown` (Enter) | `document` | `handleStart()` — begin boot animation | `index.html` |
| `touchstart` | `document` | `handleStart()` — begin boot animation (mobile) | `index.html` |
| `keydown` (Enter) (skip) | `document` | Redirect to menu, skipping animation | `index.html` |
| `click` | `document` | `initAudio()` — one-time audio context init | `main.html` |
| `click` | article `<a>` tags | Load next Wikipedia page | `main.html` |
| `DOMContentLoaded` | `document` | `getWikiAPI()` — fetch random start article | `main.html` |
| `keydown` (Ctrl+F / Cmd+F) | `window` | Block find/search with `e.preventDefault()` + alert | `main.html` |

---

## Development / Test Files

### `timer.js`

A test file used with `index-test.html` for developing and validating timer logic independently. It is **not included in any production page**.

### `index-test.html`

A minimal test harness with a button, click counter, and display div. Used for rapid iteration of Wikipedia fetching and link-filtering logic during development.
