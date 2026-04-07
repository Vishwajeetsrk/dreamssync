# 🛡️ DreamSync AI: The Sovereign Career Architecture

**DreamSync** is a high-performance, AI-driven career ecosystem designed to transform raw ambition into professional dominance. It leverages advanced intelligence to synthesize resumes, analyze ATS compatibility, and architect strategic career roadmaps.

![DreamSync Banner](https://api.placeholder.com/1200/400?text=DreamSync+AI+Sovereign+Architecture)

## 💎 Core Feature Architecture

| Module | Intelligent Function | Identity Impact |
| :--- | :--- | :--- |
| **Resume Architect** | AI-Synthesized FAANG-optimized resumes | Instant professional authority |
| **Smart ATS Analyzer** | Real-time compatibility & eligibility auditing | Bypasses traditional gatekeepers |
| **Strategic Roadmap** | AI-generated career trajectories | Clear path to professional mastery |
| **Project Portfolio** | Dynamic, aesthetic project showcase | Visual proof of technical capability |
| **IKIGAI Engine** | Purpose-driven career alignment analysis | Long-term professional fulfillment |
| **Identity Hub** | Secure Firebase Auth with Profile Resilience | Absolute control over your digital self |

---

## 🚀 Step-by-Step Initialization

### 1. Repository Acquisition
```bash
git clone https://github.com/Vishwajeetsrk/DreamSync.git
cd DreamSync
```

### 2. Dependency Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and populate it with your secure credentials:

```env
# FIREBASE IDENTITY
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# AI INTELLIGENCE (GROQ / OPENROUTER)
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key

# RATE LIMITING (UPSTASH)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 4. Local Activation
```bash
npm run dev
```
Navigate to `http://localhost:3000` to initialize the architecture.

---

## 🛠️ Required Infrastructure

- **Node.js**: v18.x or higher
- **Firebase**: Project with Authentication (Email/Password) and Firestore enabled.
- **Upstash**: Redis database for Edge-first rate limiting.
- **Groq/OpenRouter**: For high-speed career intelligence synthesis.

## 🍱 Recommended VS Code Extensions

For the most efficient professional development environment:

1. **ES7+ React/Redux/React-Native snippets**: For rapid component architecture.
2. **Tailwind CSS IntelliSense**: For sleek, high-precision styling.
3. **Prettier - Code formatter**: To maintain a standardized, clean codebase.
4. **Lucide Icon Explorer**: To easily browse the platform's professional iconography.

---

## 🛡️ Critical Deployment Notes: Firebase CORS

If you experience "CORS Blocked" errors when uploading profile photos on your live site:

1. **Firestore Sync**: The platform now uses **Base64 Database Sync** to bypass standard storage blockers.
2. **Authorized Domains**: Ensure your Vercel URL (e.g., `dream-sync-nine.vercel.app`) is added to the **"Authorized Domains"** list in the Firebase Console under **Authentication > Settings**.

---

## 🌐 Live Deployments

- **Primary Architecture**: [dream-sync-nine.vercel.app](https://dream-sync-nine.vercel.app/)
- **Mirror Node**: [dreamssync.vercel.app](https://dreamssync.vercel.app/)
- **Repository**: [Vishwajeetsrk/DreamSync](https://github.com/Vishwajeetsrk/DreamSync)

**DreamSync AI is now 100% synchronized and production-ready.** 🛡️✨🚀
