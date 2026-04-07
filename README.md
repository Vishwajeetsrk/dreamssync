# 🌙 DreamSync AI — Precision-Engineered Career & Wellness

> **The all-in-one AI ecosystem for career growth and mental well-being.**
> Precision-built for the high-depth Indian job market with a premium **Neo-Brutalist** aesthetic.

### 🛡 Supabase Migration & Security Architecture (v22.1)
The DreamSync platform has successfully migrated from Firebase to **Supabase** for a more robust, unified authentication and database experience.

*   **Unified Auth (`/context/AuthContext.tsx`)**: Managed entirely via Supabase Auth with support for Google OAuth and Email/Password.
*   **PostgreSQL Persistence**: All user profiles and career data are now stored in Supabase's high-performance PostgreSQL database.
*   **Supabase Storage**: User identity photos and career documents are securely hosted in Supabase Storage with granular RLS policies.
*   **Centralized Validation (`/lib/aiGuard.ts`)**: Every user input across all AI modules is scanned for safety and ethical alignment.

### 🚀 Core Features

| Feature | Description | Tech Stack |
| :--- | :--- | :--- |
| 💼 **Fix LinkedIn** | **Advanced Profile Engineering** with actionable rewrite suggestions and SEO keywords. | OpenAI / Tailwind v4 |
| 🧠 **FAANG Resume Suite** | **Precision Document Engineering** supporting multi-format (PDF/Word) export. | React 19 / `docx` |
| 📊 **Smart ATS Analyzer** | **Recruiter-Grade Analysis** providing deep scoring against global hiring standards. | GPT-4o / Supabase |
| 🖼️ **Portfolio Engine** | **Instant Deployment** of professional portfolio sites generated dynamically. | Next.js RSC |

---

### 🛡️ Production-Grade Security & Reliability

-   **Global Rate Limiting Architecture**:
    -   **Standard API**: Multi-region sliding window (10 req / 10s).
    -   **High-Depth Tools**: Specialized limits (5 req / 1m) for Roadmap & ATS.
    -   **Security Threshold (Auth)**: Enhanced protection (5 attempts / 15m) for login & signup routes via Next.js Proxy & Upstash Redis.
-   **Next.js Proxy (v16.x)**: Secure configuration utilizing `src/proxy.ts` (Edge-compatible) for pre-flight security, authentication checks, and global rate limiting.
-   **Supabase Identity Sync**: High-performance photo uploads and profile management using Supabase Storage and PostgreSQL.
-   **DreamSync AI Guide**: Floating AI assistant with interactive tool discovery and 'Fix LinkedIn' priority mode.
-   **AI Reliability v2**: Optimized JSON generation and support-mode priority for 99.9% uptime.
-   **Supabase Real-time**: Instant profile photo and name updates across all components using Supabase Auth state changes.
-   **Global AI Safety Guard:** 400-level whole-word regex safety blocking enforced across all AI agents.
-   **Next.js Remote Hardening**: Securely configured `remotePatterns` for Supabase Storage domains.
-   **API Rate Limiting:** Global rate limiting via **Upstash Redis** to ensure multi-region stability.
-   **Global CSP Policy:** Hardened Content Security Policy to mitigate XSS and data exfiltration.

---

## 📈 Performance & Optimization

- **Zero-Latency Sessions:** Global session caching utilizing **Upstash Redis** for near-instant user state retrieval.
- **Concurrent Rendering:** Fully optimized for **React 19**, leveraging concurrent features and progressive hydration.
- **Dynamic AI Fallbacks:** Engineered with a robust fallback system (OpenRouter → Gemini → GPT) to ensure 99.9% AI uptime.
- **Micro-Animation Engine:** High-performance UX animations powered by **Framer Motion** with GPU-accelerated transitions.

---

## 📂 Repository Structure
1.  **Primary Development (`DreamSync-main`)**: The official source of truth for all feature work.
    *   [https://github.com/Vishwajeetsrk/DreamSync](https://github.com/Vishwajeetsrk/DreamSync)

---

## 🚀 Live Deployments

- **Production (Main):** [dreamsync-ruddy.vercel.app](https://dreamsync-ruddy.vercel.app/)
- **Mirror / Staging:** [dream-sync-nine.vercel.app](https://dream-sync-nine.vercel.app/)

---

## 🎨 Visual Language: Neo-Brutalism

DreamSync features a custom-engineered **Neo-Brutalist** design system:
- **Hard-Surface Shadows**: Real-time 4px/6px/8px black offsets for tactile depth.
- **Bold Typography**: Inter & Black-weights (900+) for industrial impact.
- **Vibrant Accent Palette**: High-contrast action colors on flat surfaces.

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router, Server Components)
- **React 19**
- **Tailwind CSS v4**
- **Framer Motion**

### Backend & Infrastructure
- **Supabase** (Auth, Database, Storage)
- **Upstash Redis** (Rate Limiting & Quota Tracking)
- **Resend** (Email API)

### AI Engine
- **Groq** (`llama-3`) — Fast inference.
- **OpenAI** (`gpt-4o`) — Primary reasoning.
- **Google Gemini** — Multimodal analysis.

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** >= 20.x
- **Supabase Account**: Project URL & Anon Key.
- **Upstash Redis**: URL/Token for rate limiting.

### 🚀 Supabase Setup (Important)

To ensure the profile and storage systems work correctly:
1. **Database**: Ensure a `profiles` table exists with columns: `id (uuid, primary key)`, `name (text)`, `email (text)`, `avatar_url (text)`, `plan (text)`, `created_at (timestamp)`.
2. **Storage**: Create a **public** bucket named `avatars` in Supabase Storage.
   - Set the bucket to **Public**.
- Add an **INSERT** Policy for **authenticated** users to upload: `(bucket_id = 'avatars'::text)`.
- Add a **SELECT** Policy for **anon and authenticated** roles to view: `(bucket_id = 'avatars'::text)`.

### 🛡️ Deployment Convention (Next.js 16)
This project uses the new **`src/proxy.ts`** standard for edge rate-limiting and security. Ensure your environment variables for Upstash are configured for the proxy to function correctly.

### Installation

```bash
# 1. Clone & Install
git clone https://github.com/Vishwajeetsrk/DreamSync.git
cd DreamSync
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Add your Supabase and AI keys to .env.local

# 3. Start development server
npm run dev
```

---

*Built with ❤️ by [Vishwajeet](https://github.com/Vishwajeetsrk)*
