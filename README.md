# NEXUS Shield

AI-powered cybersecurity training and simulation platform for the ITWeb Security Summit Hackathon 2026.

## Features

- **CyberShield** — Isometric Three.js cyber city with six interactive districts, player character, attack/shield effects, minimap, and HUD
- **NEXUS** — Organisation dashboard for phishing simulations, risk analytics, employee tracking, and compliance reports
- **Claude AI** — Mission generation, response evaluation, intel hints, after-action debriefs, phishing sims, and risk analysis (with full seed fallbacks)

## Quick Start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Claude API

Set your API key for live AI responses:

```bash
# .env.local
VITE_ANTHROPIC_API_KEY=your_key_here
```

Optional proxy for deployments that expose `/api/claude`:

```bash
VITE_CLAUDE_PROXY_URL=/api/claude
```

Without a key, the app uses high-quality seed data and never crashes.

## Stack

- React + Vite
- Three.js / React Three Fiber
- Recharts
- Lucide React
- Claude `claude-sonnet-4-20250514`

## Hackathon Demo Flow

1. City loads → boot sequence → role selection
2. **Analyst** → onboarding → cyber city → accept mission → SOC dashboard
3. **Organisation** → risk dashboard → launch phishing simulation → compliance PDF

Built for desktop presentation at Sandton Convention Centre.
