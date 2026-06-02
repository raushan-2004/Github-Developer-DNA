# 🧬 GitHub Developer DNA

An enterprise-grade, high-fidelity developer capability analytics platform. By scanning public GitHub metadata, repository behaviors, languages, and topics, **GitHub Developer DNA** derives a candidate's development archetype, aggregates technological insights via interactive data structures, leverages **Google Gemini AI** to act as a career advisor, and facilitates head-to-head programmer matchups in a gaming-inspired Battle Mode arena.

Built on a robust monorepo structure with a high-performance **Node.js, Express, & TypeScript** backend alongside a visually stunning **React, Tailwind CSS, & Framer Motion** frontend.

---

## 🚀 Key Highlights & Architectural Features

### 1. Developer DNA Analysis Engine
* **Rule-Based Engine:** Computes developer categorizations (*Frontend, Backend, Full Stack, AI, or Open Source*) using a robust multi-tiered heuristic scoring framework.
* **Granular Repositories Analysis:** Evaluates project sizes, language diversity, fork rates, topic keywords, and description tags (e.g. detecting system boundaries like Kubernetes or Machine Learning structures) to calculate a capability categorization.
* **Strengths & Growth Path Generator:** Formulates personalized strengths and actionable training recommendations based on dynamic metrics.

### 2. Immersive Gaming Battle Mode
* **Dual-Fetching Architecture:** Utilizes React Query to concurrently load repositories, profiles, and statistics for two distinct usernames in parallel without extra backend endpoints.
* **Battle Power Scoring Heuristic:**
  * ⭐ **Star Value:** 2 Points
  * 🍴 **Fork Value:** 3 Points
  * 📦 **Repository Density:** 5 Points
  * 👥 **Social Reach (Followers):** 1 Point
* **Stunning Combat Aesthetics:** Features split-screen player cards wrapped in color-harmonized gradients (Neon Cyan vs. Deep Rose), a custom 3D glowing "VS" badge, and staggered spring animations.
* **Granular Analytics Comparison:** Plugs metric datasets into grouped `recharts` responsive Bar Charts to visualize comparisons objectively.

### 3. Google Gemini AI Career Advisor
* **Express Integration Service:** Connects to the official `gemini-flash-latest` model to act as a Senior Engineering Manager reviewing candidate portfolios.
* **Self-Healing API Output:** Sanitizes raw model returns, stripping Markdown format fences to produce a strongly-typed, clean JSON payload.
* **Dashboard Careers Panel:** An immersive, glassmorphic review pane equipped with dynamic micro-loaders, structured career path timelines, growth alert items, and custom resume improvements.

### 4. Recently Searched History (Modern SaaS-Style)
* **Persistent Cache:** Keeps track of the last 10 unique single user lookups and combat battle arena matches in local storage.
* **Interactive Shortcuts:** Clickable cards re-route the app to historical dashboards instantly. Features springy layout deletion transformations powered by Framer Motion's `AnimatePresence`.

### 5. Executive PDF Report Exporter
* **Light-Mode Print Stylesheet:** Custom `@media print` rules force a clean, highly legible white report formatting on standard printer sheets.
* **Zero-UI Print Exclusions:** Excludes interactive headers, inputs, theme switchers, and quick search widgets.
* **Seamless Grid Mapping:** Resizes layout card columns, charts, and analysis tables to cleanly distribute sections across standard printed sheets.
* **Corporate Header Block:** Automatically prints the generation date and profile link metadata at the top of the report.

### 6. Advanced Hotkey Integration
* `Ctrl + K` or `/` : Instantly focus the main input lookup.
* `Escape` : Instantly back-track to the home search hero, clean URL query strings, or exit the combat arena.
* `Ctrl + D` or `Alt + T` : Toggle Dark Mode globally.
* `Ctrl + P` : Trigger high-fidelity PDF report compile & print.

---

## 📂 Folder Structure

```
github-developer-dna/
├── client/                     # Frontend Application (Vite + React + TS)
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/             # shadcn reusable baseline UI components
│   │   ├── features/
│   │   │   └── github-profile/
│   │   │       ├── api/        # React Query hooks & fetch utilities
│   │   │       ├── components/ # Dashboard, BattleMode, SearchHero, AICareerAdvisor, etc.
│   │   │       └── types/      # Frontend shared domain TypeScript interfaces
│   │   ├── hooks/              # Custom debouncing and layout helper hooks
│   │   ├── App.tsx             # Application routing state & global hotkey orchestration
│   │   ├── index.css           # Global custom typography, glassmorphism layers, and grid styles
│   │   └── main.tsx            # App entrypoint & React Query provider wrapper
│   ├── tailwind.config.js      # Tailwind theme parameters & glass variables
│   ├── tsconfig.json           # Frontend strict type configuration
│   └── vite.config.ts          # Vite asset compiling pathways
│
├── server/                     # Backend API Service (Node.js + Express + TS)
│   ├── src/
│   │   ├── controllers/        # Express handlers (githubController, aiController)
│   │   ├── middleware/         # Helmet security, CORS, Rate Limiters, logger, error handlers
│   │   ├── routes/             # App routers (githubRoutes, aiRoutes)
│   │   ├── services/           # Services (analysisService, cacheService, githubService, aiService)
│   │   ├── types/              # Strong schema models and environment declarations
│   │   ├── utils/              # Custom logger, axios clients, and format helpers
│   │   └── index.ts            # Server spin-up gateway and database/port pathways
│   ├── tsconfig.json           # Backend compiler strictness parameters
│   └── package.json            # Scripts: dev (ts-node-dev), build (tsc), start (dist/index.js)
│
└── README.md                   # Submission Documentation
```

---

## ⚙️ Environment Variables

Copy the corresponding template configs into active project environments to get up and running:

### Server Environment (`server/.env`)
Create a `.env` file inside the `server/` root folder:
```env
# Server Deployment Options
PORT=5000
NODE_ENV=development

# GitHub Core API Integration (Optional but highly recommended to avoid 60 req/hr limits)
# Create at: https://github.com/settings/tokens (no special scopes needed)
GITHUB_TOKEN=your_personal_github_access_token

# Google Gemini Core Integration (Required for Career Advisor feature)
# Create at: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Environment (`client/.env`)
Create a `.env` file inside the `client/` root folder:
```env
# Point to backend API path (local development path)
VITE_API_URL=http://localhost:5000
```

---

## 🗺️ API Documentation

All API endpoints reside under the `/api` prefix, returning clean JSON payloads and implementing **intelligent 60-second in-memory caching** via `node-cache` to protect GitHub API limits.

### 1. Developer Profile Details
* **Route:** `GET /api/github/user/:username`
* **Headers:** None required.
* **Payload Structure:**
  ```json
  {
    "data": {
      "login": "octocat",
      "id": 5832347,
      "avatar_url": "https://avatars.githubusercontent.com/u/5832347?v=4",
      "name": "The Octocat",
      "bio": "Testing, testing...",
      "public_repos": 8,
      "followers": 3200,
      "following": 9,
      "cached": false,
      "timestamp": 1729482938
    }
  }
  ```

### 2. Developer Repositories List
* **Route:** `GET /api/github/repos/:username`
* **Description:** Retrieves the list of public repositories for a username.

### 3. Aggregated GitHub Statistics
* **Route:** `GET /api/github/stats/:username`
* **Payload Structure:**
  ```json
  {
    "data": {
      "totalStars": 348,
      "totalForks": 92,
      "topLanguages": {
        "TypeScript": 8,
        "CSS": 2,
        "HTML": 1
      }
    }
  }
  ```

### 4. Local Developer DNA Analysis
* **Route:** `GET /api/github/analyze/:username`
* **Payload Structure:**
  ```json
  {
    "data": {
      "developerType": "Frontend Engineer",
      "confidence": 92,
      "strengths": [
        "Highly skilled with modern web UI layout construction",
        "Prolific design habits across TypeScript & CSS"
      ],
      "recommendations": [
        "Begin mastering system bottlenecks like query optimizations",
        "Contribute to key server-side packages to round out systems experience"
      ]
    }
  }
  ```

### 5. Gemini AI Career Capabilities Review
* **Route:** `POST /api/ai/review`
* **Request Payload Format:**
  ```json
  {
    "profile": { "login": "torvalds", "bio": "...", "followers": 200000, "public_repos": 10 },
    "stats": { "totalStars": 50000, "totalForks": 12000, "topLanguages": { "C": 5, "Shell": 1 } }
  }
  ```
* **Response Payload Format:**
  ```json
  {
    "careerSummary": "A highly experienced systems architect who has established core infrastructure...",
    "strengths": [
      "Deep understanding of system interfaces and OS kernel compilation pathways",
      "Exceptional community influence"
    ],
    "weaknesses": [
      "Limited direct exposure to modern client-side frontend reactive pipelines"
    ],
    "suggestedTechnologies": ["Rust", "Assembly", "Go"],
    "suggestedCareerPath": "Principal Systems Architect / Chief Technical Officer",
    "resumeRecommendations": [
      "Add key metrics highlighting team-scaling systems and operational throughput",
      "Demonstrate architectural design considerations"
    ]
  }
  ```

---

## 🚢 Deployment Guide

Follow these steps to deploy both services into production:

### 1. Deploying the Backend API (Render Example)
1. Register on **Render** (or Fly.io, Heroku).
2. Click **New Web Service** and connect your GitHub repository.
3. Configure the environment properties:
   * **Environment:** `Node`
   * **Root Directory:** `server`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
4. Add the following **Environment Variables** in the Render settings page:
   * `PORT`: `5000`
   * `NODE_ENV`: `production`
   * `GITHUB_TOKEN`: *Your GitHub Access Token*
   * `GEMINI_API_KEY`: *Your Gemini API Access Key*

### 2. Deploying the Frontend Client (Vite + React)
1. Register on **Vercel** (or Netlify, Cloudflare Pages).
2. Click **Add New Project**, select the connected repository.
3. Configure the build parameters:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `client`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Add the following **Environment Variable** in the Vercel dashboard:
   * `VITE_API_URL`: *The URL of your deployed Backend Web Service (e.g. `https://my-backend-api.onrender.com`)*
5. Click **Deploy**. Your frontend is now live!

---

## 🔮 Future Improvements

High-value structural enhancements slated for subsequent platform iterations:

1. **OAuth GitHub Login:** Enable users to log in with their GitHub account via OAuth 2.0 to access private repositories, commit histories, and pull request metrics for a far deeper DNA analysis.
2. **Distributed Redis Caching:** Replace standard in-memory caching with a robust Redis cache server to support horizontal scalability and avoid memory leaks across multiple load-balanced API servers.
3. **Advanced Battle Arena Metrics:** Enrich Developer Battle Mode to compare commit frequency graphs, average time to resolve issues, and open-source contribution patterns.
4. **WebSocket-Powered Multiplayer Battles:** Allow two remote users to enter a combat room simultaneously and watch active developers spar live with animations and sound effects.
5. **Custom Report PDF Templates:** Enable users to choose between formal, gaming-neon, or minimal templates before exporting their capability profile PDF.
