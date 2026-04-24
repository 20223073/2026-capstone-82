# 한국 생활 RPG — Korea Life RPG

A 2D cultural guide game for foreigners in Korea, built with HTML/CSS/JS.

## 🚀 How to run

1. Open `index.html` in a web browser — that's it!
2. For chatbot to work, you need to add your Claude API key in `js/chatbot.js`

## 📁 Project structure

```
korea-rpg/
├── index.html              ← Main menu (start here)
├── game.html               ← Universal game screen (used for all missions)
├── style.css               ← All styling
│
├── js/
│   ├── game.js             ← Core game engine (dialog rendering, flow)
│   └── chatbot.js          ← AI helper (Claude API)
│
├── missions/               ← Mission data (one file per mission)
│   ├── convstore.js        ← Convenience store: buy T-money card
│   ├── exchange.js         ← Airport: exchange money
│   ├── immigration.js      ← Immigration office: apply for ARC
│   └── lostfound.js        ← Airport: find lost phone
│
└── images/                 ← Background images for each scene
    ├── Airport.png
    ├── ConvStoreInside.png
    ├── Immigration_RegDesk.png
    ├── Immigration_waiting.png
    ├── LostAndFound.png
    └── MoneyExchange.png
```

## ✨ What changed from the old version

### Before (old):
- 4 separate HTML files (convstore.html, airport_exchange.html, etc.)
- Same JavaScript code copy-pasted into each file (~400 lines × 4)
- Hard to add new missions — had to copy and modify everything
- No chatbot

### Now:
- **1 game.html** that works for all missions
- **Each mission is just a data file** (dialog as JSON-like object)
- **Game engine is shared** (`js/game.js`) — fix a bug once, all missions fixed
- **AI chatbot** that knows about the current mission

## ➕ How to add a new mission

1. Create `missions/newmission.js` copying the format of `convstore.js`
2. Add your background image to `images/`
3. Add the mission to `allMissions` object in `js/game.js`
4. Add a mission card in `index.html`

That's it! No need to duplicate any game logic.

## 🤖 Setting up the chatbot

The chatbot uses Claude API (Anthropic) to answer player questions.

1. Sign up at https://console.anthropic.com
2. Create an API key
3. Open `js/chatbot.js` and replace `YOUR_API_KEY_HERE` with your key

⚠️ **Security note:** Putting the key directly in JavaScript is only OK for development and demos. For a real production deployment, you'd use a backend (e.g., Vercel Functions, Netlify Functions) to keep the key secret. We'll cover this before the final presentation.

## 💰 API cost

Using Claude Haiku 4.5 (cheapest model):
- Each question costs ~$0.001 (less than 1 cent)
- A new account gets $5 free credit — plenty for the whole capstone

## 📱 Responsive

The game works on desktop and mobile browsers. The chatbot panel adapts to screen size.
