# Resume Builder Pro — Atelier Edition

A premium, full-stack MERN resume builder — internee.pk "Resume Builder with PDF Export" task,
rebuilt into a polished, AI-assisted product.

## What's new in this pass
- **AI writing assistant** (Claude) — generates a profile summary, per-role/project achievement
  bullets, and skill suggestions from the candidate's own details. It never invents employers,
  dates, or numbers.
- **ATS Match Analyzer** — paste a job description and get a 0–100 match score, matched/missing
  keywords, and concrete edit suggestions.
- **AI Cover Letter** — a tailored, 3‑paragraph cover letter generated from the resume + job post.
- **Six luxury templates** — Onyx / Ivory / Wine (banner layout) and Noir / Emerald / Sapphire
  (sidebar "atelier" layout). The live preview and the exported PDF are pixel-matched.
- **Shareable public link** — toggle a resume public and share a read-only `/r/:slug` page with a
  one‑click PDF download, no login required.
- **Expanded resume model** — projects, certifications, languages, links (website/LinkedIn/GitHub),
  location and duration per experience entry.
- **Redesigned UI** — a new marketing landing page, a section-based editor with autosave, and a
  refreshed sign-in/sign-up flow, all built around a gold/onyx "atelier" visual identity
  (Playfair Display + Work Sans).
- **Hardening** — request rate limiting, input whitelisting on resume updates, account
  enumeration-safe login errors, minimum password length, server-side PDF font embedding
  (Playfair Display / Work Sans, matching the web preview).

## Stack
- Frontend: React 19 (Vite) + Tailwind CSS + Framer Motion + Lucide icons
- Backend: Node.js + Express + PDFKit
- Database: MongoDB (Atlas or local)
- Auth: JWT
- AI: Anthropic Messages API (optional — the app works fully without it; only the AI buttons need a key)

## Setup

### 1. Backend
```
cd server
npm install
cp .env.example .env
```
Edit `server/.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_secret_string
PORT=5005
CLIENT_ORIGIN=http://localhost:5173

# Optional — powers the AI Assist buttons, ATS Analyzer and Cover Letter generator.
# Get a key at https://console.anthropic.com
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-fable-5-1
```
Run:
```
node index.js
```

### 2. Frontend
```
cd client
npm install
cp .env.example .env   # only needed if your API isn't on localhost:5005
npm run dev
```

## How it works
- Register/login — each account has exactly one resume, auto-created on first visit.
- Fill in personal details, summary, skills, experience, projects, education, certifications and
  languages. Every field autosaves ~700ms after you stop typing.
- Use **AI Assist** next to the summary, and **Write for me / Rewrite** on each experience and
  project card, to have Claude draft the copy from your own notes.
- Use **ATS Score** to check the resume against a specific job description, and **Cover Letter**
  to generate a tailored letter for it.
- Switch between 6 templates in the **Design** section — the live preview updates instantly.
- Click **Share** to publish a public, read-only link, or **Download PDF** for a polished,
  print-ready export (built server-side with PDFKit, matching the chosen theme exactly).

## API Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `GET  /api/resume` — fetch or auto-create the account's resume
- `PUT  /api/resume` — update any whitelisted resume field
- `GET  /api/resume/pdf` — download as PDF
- `POST /api/ai/summary` | `/bullets` | `/skills` | `/analyze` | `/cover-letter` — AI assistant (auth + rate-limited)
- `GET  /api/public/:slug` | `/api/public/:slug/pdf` — public read-only resume (only when shared)

## Deploying — everything on Vercel (no Render/Railway needed)

Both the client and the server can be deployed as **two separate Vercel projects** from the
same GitHub repo.

### Backend (server) on Vercel
1. New Project → import this repo → set **Root Directory** to `server`
2. Framework Preset: **Other** (Vercel auto-detects the `api/index.js` serverless function)
3. Environment Variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=any_long_random_secret_string
   CLIENT_ORIGIN=https://your-frontend.vercel.app   (set after the frontend is deployed)
   ANTHROPIC_API_KEY=            (optional)
   ANTHROPIC_MODEL=claude-fable-5-1
   ```
   (No `PORT` needed — Vercel manages that.)
4. Deploy. You'll get a URL like `https://resume-builder-pro-api.vercel.app`.

### Frontend (client) on Vercel
1. New Project → import the same repo → set **Root Directory** to `client`
2. Framework Preset: **Vite** (auto-detected)
3. Environment Variable:
   ```
   VITE_API_URL=https://resume-builder-pro-api.vercel.app/api
   ```
4. Deploy.

### Wire them together
Go back to the backend project's Environment Variables and set `CLIENT_ORIGIN` to the
frontend's real Vercel URL, then redeploy the backend so CORS allows it.

Note: on Vercel's free (Hobby) plan, serverless functions have a request time limit — the AI
endpoints are configured for 30s via `server/vercel.json`, which is enough for normal use.
