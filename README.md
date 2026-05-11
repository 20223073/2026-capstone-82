# 🇰🇷 안녕 from Korea

> An interactive cultural guide game that teaches foreigners how to navigate everyday life in Korea — through branching dialogue, real Korean vocabulary, and AI-powered help.

Built with **pure HTML / CSS / Vanilla JavaScript** — no framework, no build step.

---

## What is this?

안녕 from Korea puts players in realistic Korean situations: exchanging money at the airport, riding the subway, opening a bank account, seeing a doctor, and more. Each mission teaches practical Korean phrases and cultural knowledge through conversation choices.

Two modes are available:
- **단기 방문 (Short-term visit)** — 7 missions for travellers (Airport → Shopping)
- **장기 거주 (Long-term residence)** — 12 missions for residents (Airport → Moving in)

Missions unlock sequentially — complete each step before advancing to the next.

---

## Missions

| # | Mission | Korean | Mode |
|---|---------|--------|------|
| 1 | Airport Currency Exchange | 공항 환전 | Both |
| 2 | Lost and Found | 분실물 센터 | Both |
| 3 | Convenience Store | 편의점 | Both |
| 4 | Seoul Subway | 지하철 타기 | Both |
| 5 | Telecom / SIM Card | 통신사 유심 개통 | Long-term |
| 6 | Immigration Office (ARC) | 출입국관리사무소 | Long-term |
| 7 | Bank Account Opening | 은행 통장 개설 | Long-term |
| 8 | Finding an Apartment | 부동산 — 집 구하기 | Long-term |
| 9 | Garbage Bag Purchase | 쓰레기 봉투 구매 | Long-term |
| 10 | Hospital Visit | 병원 진료 받기 | Both |
| 11 | Pharmacy | 약국에서 약 구매 | Both |
| 12 | Clothing Store Refund | 옷 가게 환불/교환 | Both |

---

## Features

- **Branching dialogue** — choices affect conversation flow and outcomes
- **Vocabulary flashcards** — key Korean words shown before each mission with romanisation
- **In-dialogue tooltips** — tap any highlighted word mid-scene to see its English meaning
- **AI chatbot** — context-aware Claude assistant available during every mission
- **Progress tracking** — completed missions saved to `localStorage`; synced to Firebase on login
- **Visit mode** — separate mission tracks for short-term visitors and long-term residents
- **User profile** — one-time registration (nationality, age, purpose of stay, arrival date)
- **Cross-device sync** — log in with email to restore progress on any device
- **Analytics dashboard** — real-time Chart.js dashboard showing user demographics and behaviour
- **Mobile-friendly** — portrait-mode crop anchors per image so characters stay in frame

---

## Getting started

No installation required.

```bash
# Just open the file in any modern browser
open index.html
```

### Enable the AI chatbot and Firebase (optional for local dev)

1. Get a Claude API key at [console.anthropic.com](https://console.anthropic.com)
2. Set up a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
3. Copy the template: `cp js/config.example.js js/config.js`
4. Open `js/config.js` and paste both keys
5. Refresh — the 💬 chatbot button and user profile sync will work

> `js/config.js` is git-ignored. The Claude API key is injected automatically at deploy time via GitHub Actions Secrets.

---

## Project structure

```
├── index.html          ← Main menu (mode tabs, progress bar, mission cards)
├── game.html           ← Universal game screen for all missions
├── dashboard.html      ← Analytics dashboard (Firestore events + Chart.js)
├── style.css           ← All styling (menu + game in one file)
│
├── js/
│   ├── game.js         ← Core engine (typewriter, choices, vocab tooltips)
│   ├── chatbot.js      ← AI helper (Claude API, context per mission)
│   ├── db.js           ← Firebase/Firestore wrapper (profiles + events)
│   ├── analytics.js    ← User behaviour event tracking (15 event types)
│   ├── config.public.js← Public config committed to git (Firebase keys; no API key)
│   ├── config.example.js
│   └── config.js       ← API keys — NOT committed (git-ignored)
│
├── missions/           ← One JS file per mission (12 total)
│
├── images/             ← Scene backgrounds (~2400×1700 px landscape)
│
├── docs/               ← Project landing page (GitHub Pages)
│   └── index.html
│
└── .github/
    └── workflows/
        └── deploy.yml  ← Auto-deploy to GitHub Pages; injects CLAUDE_API_KEY secret
```

---

## Adding a new mission

1. Create `missions/<id>.js` — use `missions/hospital.js` as a template (scene-based format)
2. Add background images to `images/`
3. Register in `js/game.js` → `allMissions` object
4. Add `<script src="missions/<id>.js">` in `game.html` before `game.js`
5. Add a `.mission-card` div in `index.html` with `id="card-<id>"` and `id="status-<id>"`
6. Add `'<id>'` to `ALL_MISSIONS` and `MODE_CONFIG` in the inline script of `index.html`
7. Add `'<id>': '미션 이름'` to the `MISSION_NAMES` object

See `CLAUDE.md` for the full architecture guide.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 / CSS3 / Vanilla JavaScript — zero dependencies, zero build step |
| AI Chatbot | [Claude API](https://www.anthropic.com) — `claude-haiku-4-5-20251001` |
| Database | Firebase Firestore — user profiles + analytics events |
| Analytics | Chart.js v4 — real-time dashboard (`dashboard.html`) |
| Fonts | Google Fonts — Inter, Noto Sans KR |
| Deployment | GitHub Actions → GitHub Pages (API key injected via Secrets) |

---

## Team · +82 Crew

Kookmin University — 2026 Capstone Design Project  
[github.com/kookmin-sw/2026-capstone-82](https://github.com/kookmin-sw/2026-capstone-82)

| Name | Role |
|---|---|
| 울란 | 팀장 · 프로젝트 기획 · 시나리오 · QA |
| 바호디르 | 개발자 1 · 게임 엔진 · AI 챗봇 · Firebase · UI 디자인 |
| 만다흐자야 | 개발자 2 · UI 디자인 · 로고 · 테스트 |
