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
│   │   ├── login/              # Direct login with Firebase + Google
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

---

## 📄 License

© 2026 DreamSync AI. All rights reserved. Private repository.

---

*Built with ❤️ by [Vishwajeet](https://github.com/Vishwajeetsrk)*
