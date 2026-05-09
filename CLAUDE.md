# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

No build step required. Open `index.html` directly in a browser (`open index.html`). The `Hospital_Pharmacy_Garbage/` folder contains legacy standalone HTML prototypes — they are not part of the running game.

For the AI chatbot to work, copy `js/config.example.js` → `js/config.js` and paste a Claude API key. `config.js` is gitignored and must never be committed.

## Architecture

Pure HTML/CSS/Vanilla-JS — no framework, no bundler, no npm.

### Page flow

- `index.html` — main menu. Shows mode toggle (단기/장기), progress bar, and mission cards. Navigates to `game.html?mission=<id>` on card click.
- `game.html` — universal game screen for all missions. Reads the `?mission=` URL param and calls `startMission(id)`.

### Script loading order in `game.html`

All 12 mission files load first (each defines a global like `hospitalMission`), then `js/game.js` (which reads those globals into `allMissions`), then `js/config.js`, then `js/chatbot.js`. **Order matters — do not reorder these `<script>` tags.**

### Game engine (`js/game.js`)

- `allMissions` — registry mapping mission ID strings to mission objects.
- `startMission(id)` — entry point; sets `currentMission`, populates `#hud-title`, calls `chatbotSetContext`, then shows vocab screen (if any) before calling `beginMission()`.
- `beginMission()` — calls `currentMission.sceneFn()` for scene-based missions, or `renderStep()` for step-based missions.
- `renderStep()` / `handleChoice()` — drives step-based missions via `currentMission.steps`.
- `showMissionComplete()` — saves `localStorage.setItem('cleared_<id>', 'true')` and shows the popup.

### Mission formats (`missions/*.js`)

Every mission file exports one `const <name>Mission = { id, title, background, vocabulary?, helperContext, completeTitle, completeMessage, sceneFn() | steps }`.

**Step-based** (`steps` object, used by exchange, lostfound, convstore, immigration):
```js
steps: {
  start: { text: '...', choices: [{ label: '...', next: 'nextKey' }] },
  nextKey: { text: '...', choices: [{ label: '...', next: 'END' }] }
}
```
A choice with `next: 'END'` triggers `showMissionComplete()`.

**Scene-based** (`sceneFn()`, used by subway, bank, telecom, clothing, realestate, garbage, hospital, pharmacy):
```js
sceneFn() {
  const scenes = {};
  const go      = name => { clearChoices(); scenes[name](); };
  const enterGo = name => waitEnterThen(() => go(name));
  const bg      = img  => changeBackground('images/' + img);

  let stateVar = false;  // closure state persists across scenes

  scenes.start = () => {
    bg('foo.png');
    typeText('Hello!', () => {
      addChoice('Option A', 'a');
      addChoice('Option B', 'b');
      waitForChoice(c => {
        if (c === 'a') go('sceneA');
        else go('sceneB');
      });
    });
  };

  go('start');
}
```

`game.js` globals available inside `sceneFn`:

| Helper | Purpose |
|---|---|
| `typeText(text, cb)` | Typewriter effect; click anywhere on text to skip |
| `addChoice(text, val)` | Add a choice button; `val` is passed to `waitForChoice` callback |
| `waitForChoice(cb)` | Sets callback fired when any choice button is clicked |
| `waitEnterThen(cb)` | Show `[Enter] 계속` hint; Enter key calls `cb()` |
| `clearChoices()` | Clear choice buttons and hint |
| `changeBackground(img)` | Set `#background` CSS background-image URL |
| `showMissionComplete()` | Show completion popup + save cleared state |

**Critical rules for `sceneFn` missions:**
- Always use `textContent` not `innerText` inside typewriter (game.js already does this).
- Do NOT call `localStorage.setItem(...)` or `window.location.href` — `game.js` handles both.
- Image paths must be `'images/<filename>'` (not relative to the mission file).

### Vocabulary system

The optional `vocabulary` array `[{ kr, en, rom? }, ...]` triggers a pre-mission flashcard screen. After the typewriter finishes each step, `applyVocabTooltips()` wraps matching Korean words in `<span class="word-tip" data-en="…">` — clicking shows a translation bubble. The scanner uses longest-match-first and a Hangul negative-lookbehind to avoid partial matches.

### CSS architecture (`style.css`)

Two themes in one file: Apple-minimal menu (`/* MENU SCREEN */` section) and dark visual-novel game (`/* GAME SCREEN */` section).

**Global `button` selector sets `width: 100%`.** Any button outside `#choices` (e.g. `#back-btn`, `#profile-btn`, `#chatbot-send`) must explicitly set `width: auto`.

Key z-index layers: `#mission-hud` (40) → `#back-btn` (50) → `#chatbot-panel` (100) → `#profile-overlay` (500) → `#missionComplete` (999).

### AI chatbot (`js/chatbot.js`)

Calls the Claude API directly from the browser (`anthropic-dangerous-direct-browser-access: true`). Uses `claude-haiku-4-5-20251001`. `chatbotSetContext(context, title)` rebuilds the system prompt per mission. `chatHistory[]` is capped at 20 messages (`MAX_HISTORY`).

---

## Current missions (12 total)

| ID | Korean title | Mode | Format | Key images |
|---|---|---|---|---|
| `exchange` | 공항 환전 | Both | steps | `MoneyExchange.png`, `Airport_cv.png` |
| `lostfound` | 공항 분실물 센터 | Both | steps | `LostAndFound.png`, `Information_desk.png` |
| `convstore` | 편의점 | Both | steps | `ConvStoreInside.png` |
| `subway` | 지하철 타기 | Both | sceneFn | `subway_*.png` |
| `telecom` | 통신사 유심 개통 | Long only | sceneFn | `telecom_*.png` |
| `immigration` | 출입국관리사무소 | Long only | steps | `Immigration_*.png` |
| `bank` | 은행 통장 개설 | Long only | sceneFn | `bank_*.png` |
| `realestate` | 부동산 — 집 구하기 | Long only | sceneFn | `real_estate*.png`, `room_visit_*.png` |
| `garbage` | 쓰레기 봉투 구매 | Long only | sceneFn | `ConvStoreInside.png` |
| `hospital` | 병원 진료 받기 | Both | sceneFn | `hospital_*.png` |
| `pharmacy` | 약국에서 약 구매 | Both | sceneFn | `pharmacy*.png` |
| `clothing` | 옷 가게 환불/교환 | Both | sceneFn | `clothing_*.png` |

---

## Visit mode system (단기 / 장기)

`index.html` shows two mode tabs. The active mode is persisted in `localStorage["visit_mode"]` (`"short"` or `"long"`). Default is `"long"`.

`MODE_CONFIG` (inline script in `index.html`) defines the ordered mission list per mode:

| Mode | Count | Mission order |
|---|---|---|
| `short` 단기 방문 | 7 | exchange → lostfound → convstore → subway → hospital → pharmacy → clothing |
| `long` 장기 거주 | 12 | exchange → lostfound → convstore → subway → telecom → immigration → bank → realestate → garbage → hospital → pharmacy → clothing |

Missions are rendered as **STEP 1, STEP 2, …** badges. A mission is **locked** (`.locked` class, grayed-out, `cursor: not-allowed`) when the preceding step is not yet cleared. Clicking a locked card shows `#locked-toast` for 2.5 s. Missions outside the current mode's list are `display: none`. The progress bar counts only the current mode's missions.

Key functions in `index.html` inline script:
- `setMode(mode)` — persists and rerenders.
- `renderMissions()` — master render: resets all cards, applies mode filter, step badges, locked/cleared states, updates progress bar. Called on page load and on mode switch.
- `showLockedMsg(id, prevId)` — fires the toast.

Mission cards in the HTML have **no `onclick` attribute** — all handlers are assigned dynamically inside `renderMissions()`.

---

## User profile data collection

On first visit, `#profile-overlay` modal appears and collects:

| Field | Input | Stored as |
|---|---|---|
| email | `#f-email` | string |
| nationality | `#f-nationality` (select) | string |
| age | `#f-age` (number) | integer |
| location | `#f-location` | string |
| inKorea | `input[name="in-korea"]` radio | boolean |
| plannedArrival | `#f-arrival` (date, hidden if inKorea) | ISO date string or null |
| purpose | `input[name="purpose"]` radio | `"work"` \| `"study"` \| `"travel"` |

Stored in `localStorage["user_profile"]` as JSON with `registeredAt` and `updatedAt` timestamps. After save, `#profile-btn` (fixed top-right, `width: auto`) becomes visible.

Helpers (inline script): `getUserProfile()` → parsed object or `null`; `saveUserProfile(data)` → writes JSON. Modal input IDs: `f-<field>`. Error divs: `err-<field>`. `.error` class toggled on failed validation.

---

## Adding a new mission

1. Create `missions/<id>.js` — use an existing sceneFn mission (e.g. `missions/hospital.js`) as template.
2. Copy background images to `images/`.
3. Register in `js/game.js` → `allMissions` object.
4. Add `<script src="missions/<id>.js">` in `game.html` **before** the `game.js` script tag.
5. Add a `.mission-card` div in `index.html` (after `card-clothing`) with `id="card-<id>"` and `id="status-<id>"` on the inner status span. No `onclick` attribute — it is set by JS.
6. Add `'<id>'` to `ALL_MISSIONS` array in the inline script of `index.html`.
7. Add `'<id>'` to the appropriate mission list(s) in `MODE_CONFIG.short.missions` and/or `MODE_CONFIG.long.missions` at the correct step position.
8. Add `'<id>': '미션 이름'` to the `MISSION_NAMES` object (used in locked-toast messages).

---

## Known issues and pitfalls

- **Nested `.git` in `korea-rpg/`** — legacy directory; do not run git commands inside it expecting them to affect the outer repo.
- **Global `button` width** — `style.css` sets `width: 100%` on all buttons. New buttons outside `#choices` need `width: auto`.
- **`chatHistory` cap** — `MAX_HISTORY = 20` in `chatbot.js`. Keep bounded.
- **Typewriter must use `textContent`** — `innerText` normalizes whitespace on read, breaking the `+=` typewriter loop.
- **Cleared state requires both IDs** — `renderMissions()` toggles `.cleared` on both `#card-<id>` and `#status-<id>`. Missing either ID breaks the visual.
- **Background images are landscape-only** — `~2400×1700 px`. On portrait mobile `background-position: center center` with `cover` is used so the center-composed subject stays in frame (only ~37% of image width is visible). `#dialogue` is also capped at `max-height: 52vh; overflow-y: auto` so the background is never fully obscured by many choices. `Airport_pv.jpeg` is portrait-format but is unused by any mission.
- **`Hospital_Pharmacy_Garbage/` is prototype-only** — the standalone `.html` files there use a different engine (menu.html, old CSS) and are not part of the playable game. Do not link to them from `index.html` or `game.html`.
