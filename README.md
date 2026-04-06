# 🌙 DreamSync AI — Career & Wellness Platform

> **The all-in-one AI ecosystem for career growth and mental well-being.**
> Resume building, ATS optimization, LinkedIn profile enhancement, high-depth roadmap generation, interactive career coaching, and empathetic mental health support — all in one unified platform.

- **GitHub:** [Vishwajeetsrk/dreamsync](https://github.com/Vishwajeetsrk/dreamsync)
- **Live Site:** [dreamsync.vercel.app](https://dreamsync-ruddy.vercel.app/)

## 🎥 Live Portfolio Preview (Auto-Play)

<p align="center">
  <a href="./video.mp4">
    <img src="assets/DreamSync.gif" width="900" alt="Portfolio Live Preview">
  </a>
</p>

> ▶️ **GIF auto-plays** on GitHub  
---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Security & Rate Limiting](#-security--rate-limiting)
- [Deployment](#-deployment)

---

## 🚀 Overview

DreamSync is a precision-engineered, full-stack AI platform built with **Next.js 16 (App Router)** and **React 19**. It leverages a robust backend powered by **Supabase**, **Upstash Redis**, and a multi-model AI architecture (OpenAI, Groq, Google Gemini, OpenRouter).

The platform bridges the gap between technical career excellence and personal well-being:
1.  **Technical Excellence:** AI-driven resume building, ATS scoring, and high-depth career roadmap architecture.
2.  **Career Guidance:** A dedicated **Career Agent** providing real-time Indian job market insights, salary benchmarks, and direct application links.
3.  **Wellness:** **Serenity**, an empathetic AI counselor supporting **11 Indian languages** with native voice integration.

The UI follows a **Neo-Brutalism + Fintech** aesthetic, utilizing **Tailwind CSS v4** and **Framer Motion** for a premium, high-interaction experience.

---

## ✨ Features

| Feature | Description | Engine / Stack |
|---|---|---|
| 🔐 **Secure Authentication** | **Multimodal Auth System** featuring Email/Password, Google OAuth, and secure session management. | Firebase Auth / Supabase |
| 🛡️ **Bot Protection** | **Cloudflare Turnstile** integrated into all auth flows to prevent brute-force and bot attacks. | Turnstile / Security |
| 📉 **Interactive News Ticker** | **Live-linked 2026 platform updates** and tool announcements. | Next.js Server Components |
| ⚡ **Direct Google Auth** | **Ubiquitous One-Tap Access** from the global Navbar. Seamless profile creation and sync across all platform pages. | Google Web SDK / Firebase |
| 🕉️ **IKIGAI Finder** | **Premium Career Purpose Tool** based on the Japanese Ikigai framework. | Claude 3.7 / Gemini 2.0 |
| 🌿 **Serenity (AI Counselor)** | **Empathetic Mental Health Agent** with native Indian persona. Supports **11 languages** with **Voice Mode (STT/TTS)**. | Groq (Llama-3-70b) / Gemini |
| 🤖 **AI Career Agent** | **Conversational Career Coach** specialized in the Indian market (2026). Provides Naukri/LinkedIn links. | Groq / Redis |
| 🗺️ **Skill Roadmaps** | **High-Depth Roadmap Architect** with phase-by-phase video lectures, study materials, and certifications. | OpenAI GPT-4o / GPT-4o-mini |
| 💼 **LinkedIn Optimizer** | AI-powered profile analysis with actionable rewrite suggestions. | OpenAI / Tailwind CSS v4 |
| 🧠 **FAANG Resume Builder** | **Professional Multi-Format Suite** with side-by-side editing and FAANG-grade export (PDF/Word). Optimized for precision document engineering. | React 19 / `docx` / `lucide` |
| 📊 **Smart ATS Analyzer** | **FAANG+ Eligibility Tracker** providing deep analysis against Google, Microsoft, Amazon, Meta, and Netflix recruitment standards. | GPT-4o / Firestore |
| 🖼️ **Portfolio Generator** | Instant deployment-ready portfolio sites generated from your career data. | Next.js App Router |
| 📄 **Document Guide** | A comprehensive portal for navigating government documentation and career requirements. | Static Content Optimization |
| 💸 **Donation System** | Dynamic UPI QR-based support system for platform sustainability. | Custom QR Generator |

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router, Server Components, Server Actions) — *Next-gen performance and stability.*
- **React 19** — *Leveraging the latest concurrent features.*
- **TypeScript 5** — *Strictly typed codebase.*
- **Tailwind CSS v4** — *High-performance styling engine.*
- **Framer Motion** — *Liquid-smooth micro-animations and page transitions.*
- **Lucide React** — *Modern, lightweight iconography.*

### Backend & Infrastructure
- **Supabase** — *PostgreSQL database, storage, and server-side auth (@supabase/ssr).*
- **Firebase** — *Optimized client-side auth for Google Sign-In and profile synchronization.*
- **Upstash Redis** — *Global low-latency rate limiting and session caching.*
- **Resend** — *High-deliverability transactional email engine.*
- **Cloudflare Turnstile** — *Non-intrusive bot challenge for secure login/signup.*

### AI Engine
- **Groq** (`llama-3-8b/70b`) — *Ultra-fast inference for Serenity and Career Agent chat.*
- **OpenAI** (`gpt-4o`, `gpt-4o-mini`) — *Primary reasoning and resume engine.*
- **Google Gemini** (`gemini-2.0-flash`) — *Multimodal tasks and deep context analysis.*
- **OpenRouter** — *Dynamic model switching and unified API gateway.*

---

## 📁 Project Structure

```
dreamsync/
├── public/                         # Static assets (images, icons, QR codes)
├── src/
├── app/
│   ├── (auth)/
│   │   ├── login/              # Secure login with Turnstile + Google
│   │   ├── signup/             # Multi-step signup with Firestore sync
│   │   └── forgot-password/    # Email-based password recovery
│   │
│   ├── mental-health/          # Serenity AI Counselor (11 languages + Mood + Voice)
│   ├── career-agent/           # AI Career Guidance (Indian Market Specs)
│   ├── roadmap/                # High-depth Career Roadmaps
│   ├── resume-builder/         # AI Resume Builder
│   ├── ats-check/              # ATS Score Checker
│   ├── linkedin/               # LinkedIn Profile Optimizer
│   ├── portfolio/              # Portfolio Generator
│   ├── documents/              # Government Document Guide
│   │
│   ├── dashboard/              # Centralized user dashboard
│   ├── donate/                 # UPI donation portal (Dynamic QR)
│   └── api/
│       ├── mental-health/      # Serenity chat endpoint (Groq/Gemini)
│       ├── career-agent/       # Career coach endpoint (Redis cached)
│       ├── roadmap/            # High-depth roadmap generation
│       └── usage/              # User quota tracking
│
├── components/
│   ├── MarketTrends.tsx        # Live 2026 job market data component
│   ├── ProtectedRoute.tsx      # Auth-guarded navigation
│   ├── Navbar.tsx              # Dynamic navigation with auth states
│   └── Footer.tsx              # Global footer with donate CTA
│
├── context/                    # Auth and User Usage contexts
└── lib/                        # Core AI logic, Firebase/Supabase, and Security utils
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- A **Supabase** instance (Project URL & Anon Key)
- A **Firebase** project (Client SDK config)
- A **Cloudflare Turnstile** site key/secret
- An **Upstash Redis** URL/Token (for rate limiting)
- **API Keys:** OpenAI, Groq, or OpenRouter for AI features.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Vishwajeetsrk/dreamsync.git
cd dreamsync

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Add your secret keys to .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🛡️ Production & Security Audit (2026 Ready)

DreamSync has undergone a comprehensive full-stack security audit and hardening process to ensure it is production-ready for thousands of users:

- [x] **Secure Auth Logic**: Implementation of 2026-standard Login, Signup, and Password Recovery with multi-provider support (Email/Google).
- [x] **Premium Neo-Brutalism UI**: High-fidelity, bold interaction design restored and hardened across all authentication gateways for a FAANG-grade user experience.
- [x] **One-Tap Unified Login**: Single, professional entry point architected for ultra-fast user onboarding without redundant navigation elements.
- [x] **Cloudflare Turnstile**: Integrated smart challenges on all auth forms to prevent automated brute-force attacks.
- [x] **Global AI Safety Guardrails**: Proactive input validation (leetspeak & typo detection) to block harmful, illegal, or unethical career paths (e.g., terrorist, weapon manufacturing).
- [x] **Global Security Middleware**: Rigorous Content Security Policy (CSP), HSTS, and XSS headers injected into every request. *Updated 2026: Optimized for Firebase Authentication & Google Firestore (fixed auth/internal-error).*
- [x] **Firebase/Google Integration**: Whitelisted `identitytoolkit.googleapis.com`, `*.firebaseio.com`, `apis.google.com`, and `www.gstatic.com` in CSP to ensure seamless, secure OAuth and real-time database connections.
- [x] **Rate Limiting (Upstash)**: All AI routes are protected by distributed sliding-window rate limiting (5-20 req/min/user).
- [x] **Schema Validation (Zod)**: Strict input validation for all API endpoints to prevent malformed data or buffer overflow attacks.
- [x] **AI Safety Layer**: Real-time prompt injection detection and input sanitization to prevent jailbreaking or malicious AI hijacking.
- [x] **Authentication Guards**: Centralized `ProtectedRoute` component and middleware-level session hints to prevent unauthorized access.
- [x] **Next.js 16/17 Migration**: Full adoption of the `proxy.ts` convention for edge-ready middleware/routing logic.
- [x] **Zero-Hardcoded Secrets**: Verified 100% environment-driven configuration for Firebase to resolve GitHub security alerts.
- [x] **Environment Security**: Zero secrets exposed in the frontend. All AI and Database keys are securely managed via server-side environment variables.
- [x] **DoS Prevention**: Implemented request body size limits and hashing-based IP fingerprinting for robust abuse detection.
- [x] **PDF Security**: ATS checker validates MIME types, extensions, and file sizes (max 5MB) before processing.

---

## 📄 License

© 2026 DreamSync AI. All rights reserved. Private repository.

---

*Built with ❤️ by [Vishwajeet](https://github.com/Vishwajeetsrk)*
