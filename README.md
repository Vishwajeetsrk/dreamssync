# 🌙 DreamSync— Career Intelligence Platform

> **AI-powered career tools built for the next generation of professionals.**
> Resume building, ATS optimization, LinkedIn profile enhancement, roadmap generation, portfolio creation, and more — all in one platform.

- GitHub: https://github.com/Vishwajeetsrk/dreamsync
- Live site: https://dreamsync-ruddy.vercel.app/

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Authentication](#-authentication)
- [Rate Limiting](#-rate-limiting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🚀 Overview

DreamSync is a full-stack AI career platform built with **Next.js 16 App Router**, backed by **Supabase** (auth + database), **Firebase** (client auth), **Upstash Redis** (rate limiting), and multiple AI providers including **OpenAI**, **Groq**, **Google Gemini**, and **OpenRouter**.

The UI is built with a **Neo-Brutalism + Fintech** aesthetic using **Tailwind CSS v4** and **Framer Motion** for micro-animations.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Resume Builder** | Generate professional resumes using AI with live preview |
| 📊 **ATS Checker** | Upload a resume and job description to get an ATS compatibility score |
| 💼 **LinkedIn Optimizer** | AI-powered LinkedIn profile analysis and rewrite suggestions |
| 🗺️ **Roadmap Generator** | Custom career roadmaps based on your goal role |
| 🖼️ **Portfolio Generator** | Auto-generate a portfolio site from your profile data |
| 📄 **Document Guide** | Government document guidance portal |
| 🤖 **AI Agent** | Conversational AI agent for career advice |
| 🔐 **Auth** | Firebase + Supabase dual auth with login/signup flows |
| 💸 **Donate** | UPI QR-based donation support system |
| 📧 **Contact** | Contact form with email delivery via Resend |

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Framer Motion** — micro-animations and page transitions
- **Lucide React** — icon library
- **clsx + tailwind-merge** — conditional class utilities

### Backend / APIs
- **Next.js API Routes** (`/src/app/api/`)
- **Supabase** — PostgreSQL database + server-side auth (`@supabase/ssr`)
- **Firebase** — client-side auth (Google sign-in, etc.)
- **Upstash Redis** — rate limiting per user/IP
- **Resend** — transactional email delivery

### AI Providers
- **OpenAI** (`gpt-4o`, `gpt-4o-mini`) — primary AI engine
- **Groq** (`llama-3` series) — fast inference fallback
- **Google Gemini** (`gemini-2.0-flash` etc.) — multimodal tasks
- **OpenRouter** — unified multi-model gateway

### Other
- **pdf-parse** — server-side PDF text extraction
- **Zod** — schema validation
- **Cloudflare Turnstile** — bot protection (`@marsidev/react-turnstile`)

---

## 📁 Project Structure

```
dreamsync/
├── public/                         # Static assets (images, icons, QR codes)
├── assets/                         # Additional media assets
├── src/
│   ├── app/
│   │   ├── globals.css             # Global design system (CSS variables, base styles)
│   │   ├── layout.tsx              # Root layout (Navbar + Footer)
│   │   ├── page.tsx                # Landing page with hero + feature sections
│   │   │
│   │   ├── about/                  # About DreamSync page
│   │   ├── contact/                # Contact form page
│   │   ├── team/                   # Team page
│   │   ├── privacy/                # Privacy policy
│   │   ├── terms/                  # Terms of service
│   │   ├── donate/                 # UPI donation page with QR code
│   │   │
│   │   ├── login/                  # Login page (Firebase + Supabase)
│   │   ├── signup/                 # Signup page
│   │   │
│   │   ├── dashboard/              # User dashboard (tools hub)
│   │   ├── resume-builder/         # AI Resume Builder
│   │   ├── ats-check/              # ATS Score Checker
│   │   ├── linkedin/               # LinkedIn Profile Optimizer
│   │   ├── roadmap/                # Career Roadmap Generator
│   │   ├── portfolio/              # Portfolio Generator
│   │   ├── documents/              # Government Document Guide
│   │   │
│   │   └── api/
│   │       ├── agent/              # AI Agent (conversational career coach)
│   │       ├── ats/                # ATS analysis endpoint
│   │       ├── linkedin/           # LinkedIn optimizer endpoint
│   │       ├── portfolio/          # Portfolio generation endpoint
│   │       ├── ratelimit/          # Rate limit check endpoint
│   │       ├── resume/             # Resume generation endpoint
│   │       ├── roadmap/            # Roadmap generation endpoint
│   │       └── usage/              # User usage tracking endpoint
│   │
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   ├── Footer.tsx              # Footer with links + donate CTA
│   │   └── Skeleton.tsx            # Loading skeleton component
│   │
│   ├── context/                    # React context providers (auth, usage, etc.)
│   └── lib/                        # Shared utilities (supabase client, AI helpers, etc.)
│
├── .env.local                      # Environment variables (see below)
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind v4 config
├── tsconfig.json                   # TypeScript config
└── package.json
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **Supabase** project
- A **Firebase** project
- An **Upstash Redis** instance
- API keys for at least one AI provider (OpenAI / Groq / Gemini)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd dreamsync

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Then fill in your keys (see Environment Variables section)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```env
# ===============================
# AUTH (NextAuth)
# ===============================
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# ===============================
# SUPABASE (DATABASE + AUTH)
# ===============================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres

# ===============================
# REDIS (UPSTASH) — Rate Limiting
# ===============================
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# ===============================
# AI PROVIDERS
# ===============================
OPENAI_API_KEY=sk-proj-...
GROQ_API_KEY=gsk_...
GOOGLE_API_KEY=AIza...
OPENROUTER_API_KEY=sk-or-v1-...

# ===============================
# FIREBASE (Client-side auth)
# ===============================
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_app_id

# ===============================
# 21st AGENTS SDK (optional)
# ===============================
API_KEY_21ST=your_21st_key
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

---

## 🌐 API Routes

All API routes live under `src/app/api/` and are **Next.js Route Handlers** (App Router).

| Route | Method | Description |
|---|---|---|
| `/api/resume` | `POST` | Generate a tailored resume from user input |
| `/api/ats` | `POST` | Analyze resume vs. job description, return ATS score |
| `/api/linkedin` | `POST` | Analyze LinkedIn profile and return AI-optimized suggestions |
| `/api/roadmap` | `POST` | Generate a career roadmap for a given target role |
| `/api/portfolio` | `POST` | Generate a portfolio from user profile data |
| `/api/agent` | `POST` | Conversational AI career coach |
| `/api/usage` | `GET/POST` | Retrieve and update per-user tool usage counts |
| `/api/ratelimit` | `GET` | Check current rate limit status for the user |

All AI endpoints are protected by **Upstash Redis rate limiting** (per user ID or IP address).

---

## 🔐 Authentication

DreamSync uses a **dual-auth** approach:

| Layer | Technology | Purpose |
|---|---|---|
| **Client-side** | Firebase Auth | Google Sign-In, email/password on the frontend |
| **Server-side** | Supabase Auth (`@supabase/ssr`) | Session management, RLS policies, API protection |

Auth context is provided globally via React Context (`src/context/`). The `Navbar` reflects the current auth state and shows login/logout actions.

---

## 🛡 Rate Limiting

API routes are rate-limited using **Upstash Redis** to prevent abuse:

- Limits are enforced **per authenticated user** (or per IP for unauthenticated requests)
- Each tool has its own quota (e.g., 5 resume generations / day)
- The `/api/ratelimit` endpoint exposes current usage for the frontend to display
- Limits reset on a **daily rolling window**

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

1. Push your repository to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Connect the `main` branch of `https://github.com/Vishwajeetsrk/dreamsync`.
4. Add all environment variables from `.env.local` in the Vercel dashboard.
5. Deploy — Vercel auto-detects Next.js and configures everything.

> Once Vercel is linked to GitHub, every `git push origin main` will trigger a new deployment for `https://dreamsync-ruddy.vercel.app/`.

### Environment-Specific Notes

- Set `NEXTAUTH_URL` to your production domain (e.g., `https://dreamsync.ai`) when deploying.
- Make sure your **Supabase** project's **allowed redirect URLs** include your production domain.
- Add your production domain to **Firebase Auth** → Authorized Domains.
- Update **Upstash Redis** CORS settings if required.

---

## 💸 Supporting DreamSync

DreamSync is passion-built and free for everyone. If it helps you land your dream job, consider supporting via the **Donate** page — it accepts UPI payments with a dynamic QR code.

---

## 📄 License

This project is **private** and not open source. All rights reserved © DreamSync AI.

---

## 📬 Contact

Have feedback, bugs, or partnership inquiries?
→ Use the in-app [Contact](http://localhost:3000/contact) page or reach the team via the [Team](http://localhost:3000/team) page.

---

*Built with ❤️ for ambitious professionals.*
