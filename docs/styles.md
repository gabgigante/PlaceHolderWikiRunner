# WikiRun — Styles & CSS Architecture

---

## CSS Architecture

WikiRun uses **plain CSS3** with no preprocessor, CSS Modules, or utility framework. Styling is organized into four page-specific stylesheets, each loaded only by its corresponding HTML page. A set of shared CSS custom properties (variables) provides consistent theming across all pages.

### Stylesheet Mapping

| Stylesheet | Linked By | Scope |
|---|---|---|
| `assets/css/overlay.css` | `index.html` | Boot screen layout, noise overlay, scanline, glow effect |
| `assets/css/style.css` | `wikirun.html` | Menu/briefing page, hero layout, button, crew ranking |
| `assets/css/style-main.css` | `main.html` | Gameplay page, header/footer, Wikipedia article rendering |
| `assets/css/finalPage.css` | `finalPage.html` | Results page, score display, achievements, path history |

### Shared Overlay System

Each page includes a `.overlay` div that creates a CRT/monitor scanline effect:

- **`.overlay`** (in `style.css`, `style-main.css`, `finalPage.css`) — Fixed-position `repeating-linear-gradient` simulating horizontal scanlines.
- **`.overlay::after`** — Animated horizontal scan bar (`@keyframes scanline`) sweeping top to bottom every 5 seconds.
- **`.noise`** (in `overlay.css`, on `index.html` only) — Semi-transparent GIF background for CRT static effect.

These overlays are layered with `z-index` values of `1` (gradient), `10000` (scan bar), and `-1` (noise) to avoid interfering with interactive elements (`pointer-events: none`).

---

## Theming & Variables

### Color Palette

All four stylesheets define the same core palette via CSS custom properties on `:root`:

| Variable | Value | Usage |
|---|---|---|
| `--black` | `#0a0a0f` | Page backgrounds, overlay elements |
| `--fucsia` | `#ff00ff` | Borders, accents, headings, button text, highlights |
| `--neon-blue` | `#00f3ff` | Primary text, protocol text, glow effect base |
| `--neon-blue-soft` | `#c9fbff` | Body text, paragraph color, softer contrast |
| **grey** (literal) | `grey` | Secondary borders, structural dividers |

The palette creates a **neon retro-terminal** aesthetic: dark background with high-contrast blue and fuchsia accents.

### Typography

Variables for font sizing are defined in `style-main.css` and `finalPage.css`:

| Variable | Mobile Base | Tablet (>=768px) | Desktop (>=1024px) | Large (>=1440px) |
|---|---|---|---|---|
| `--fs-h1` | `1.8rem` | `2.8rem` | `3.5rem` | `4.5rem` |
| `--fs-h2` | `1.5rem` | `2.1rem` | `2.5rem` | `3rem` |
| `--fs-h3` | `1.4rem` | `1.7rem` | `2.0rem` | _—_ |
| `--fs-h4` | `1.1rem` | `1.3rem` | `1.5rem` | _—_ |
| `--fs-p` | `1.1rem` | `1.25rem` | `1.3rem` | `1.4rem` |

### Font Families

Loaded via Google Fonts `<link>` tags in every page:

| Font | Style | Purpose |
|---|---|---|
| **VT323** | Monospace | Primary typeface — all headings, body text, UI elements |
| **Montserrat** | Sans-serif, variable weight 100–900 | Loaded in all pages; not actively referenced in CSS selectors |

### Global Base

All pages share a `box-sizing: border-box` reset:

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
```

Base body styling:

- `min-width: 375px` (mobile floor)
- `font-size: 2.5rem` (boot, menu, results) / variable-based (gameplay)
- `letter-spacing: 3px` (boot, menu, results)
- `border: grey solid 3px`
- `margin: 1rem` (creates the inner frame effect)

---

## Key Visual Effects

### Glow Effect (`.glow`)

Applied to the "WIKIRUN" title and key headings:

```css
text-shadow:
  0 0 5px var(--neon-blue),
  0 0 10px var(--neon-blue),
  0 0 20px var(--neon-blue);
```

Layered `text-shadow` creates a neon tube glow. A fuchsia variant is used for target node text.

### Pulse Animations

| Class | Animation | Usage |
|---|---|---|
| `.press-enter` | `pulse` (1s, opacity 1 → 0 → 1) | Boot screen prompt |
| `.pulse` | `pulse` (1.5s, opacity 1 → 0.2 → 1) | Fuchsia status text, crew ranking scores, diagnostics |
| Header `h2` | `pulse` (1.5s, text-shadow glow on/off) | Gameplay header "WIKI RUN" |
| `.pulsing-text` | `text-pulse` (1.5s, opacity + shadow) | Gameplay timer |

### Marquee / Scrolling Text

| Location | Class | Timing |
|---|---|---|
| `wikirun.html` header | `.traslate` → `marquee` (15s, translates -50%) | Desktop only |
| `main.html` header | `.title` → `marquee` (variable `--marquee-duration`, translates -100%) | All breakpoints; duration scales with viewport |
| `finalPage.html` header | `.traslate` → `marquee` (15s, translates -50%) | Desktop only |

### Marquee Duration Scale (`style-main.css`)

| Breakpoint | Duration |
|---|---|
| Mobile (base) | `20s` |
| Tablet (>=768px) | `30s` |
| Desktop (>=1024px) | `40s` |
| Large Desktop (>=1440px) | `50s` |

### Wikipedia Article Styling (`style-main.css`)

The gameplay page rethemes injected Wikipedia HTML to match the app aesthetic:

- **Headings (`h1`–`h6`)** — Colored `--fucsia` (fuchsia)
- **Paragraphs** — Colored `--neon-blue-soft`, `letter-spacing: 0.5px`
- **Links** — Colored `--neon-blue`; on hover, background becomes `--neon-blue` with `--black` text
- **Images** — `filter: grayscale(100%) sepia(100%) hue-rotate(230deg) saturate(400%)` (blue-tinted monochrome)
- **Infoboxes** — `float: right`, `max-width: 300px`, fuchsia border
- **Tables** — Collapsed borders, 1px solid `--fucsia` edges, transparent backgrounds
- **All backgrounds** — Forced to `transparent !important` across the article container

---

## Responsive Design

### Breakpoint Strategy

The application uses a **mobile-first** approach with the following breakpoints:

| Breakpoint | Media Query | Pages Affected |
|---|---|---|
| Mobile (base) | _—_ | All pages, default layout |
| Tablet | `min-width: 768px` / `789px` | `main.html` (logo visible), `wikirun.html` |
| Desktop | `min-width: 1024px` | `wikirun.html`, `finalPage.html`, `main.html` |
| Large Desktop | `min-width: 1440px` | `main.html` |

### Layout Adaptation by Page

#### Boot Screen (`index.html` / `overlay.css`)

- Base: `font-size: 3.5rem`, single column
- >= 789px: `font-size: 5rem`
- >= 1024px: Flex layout with gap, text aligned to flex-end

#### Menu / Briefing (`wikirun.html` / `style.css`)

- Base: Single column, hidden header nav, mobile logo shown
- >= 1024px: Two-column row layout (hero + ranking), header nav visible with marquee, desktop logo shown, button grows to 45rem with hover effects

#### Gameplay (`main.html` / `style-main.css`)

- Base: Header and footer visible, logo hidden, compact font sizes, marquee at 20s
- >= 768px: Logo appears (50px), font sizes increase, marquee at 30s
- >= 1024px: Larger font sizes, marquee at 40s
- >= 1440px: Maximum font sizes, marquee at 50s

#### Results (`finalPage.html` / `finalPage.css`)

- Base: Single column, mobile logo, compact layout
- >= 1024px: Two-column split (65% / 40%), desktop logo, header nav with marquee, larger headings (`h3` grows to 15rem), link/button hover effects

### Shared Responsive Pattern

Both `wikirun.html` and `finalPage.html` share nearly identical responsive behavior:

1. **Mobile** — single column, hidden header, mobile logo
2. **Desktop** — two-column split, visible marquee header, desktop logo, wider buttons, groove dividers between columns

---

## CSS Notes

- **No CSS reset library** is used. Each page restates `* { margin: 0; padding: 0; box-sizing: border-box; }`.
- **`!important`** is used aggressively on `#display-result` and descendants to override inline Wikipedia styles injected via the API.
- **`html { font-size: 10px; }`** is set in multiple stylesheets to normalize the rem-to-pixel ratio (1rem = 10px).
- **Duplicate keyframes** (`scanline`, `pulse`, `marquee`) are defined independently in multiple files rather than centralized in a shared file.
- **Border nesting** on the gameplay page uses three wrapper divs (`.border-grey` `.border-fucsia`) to achieve multi-colored borders on a single element, since CSS `border` only accepts one color.
