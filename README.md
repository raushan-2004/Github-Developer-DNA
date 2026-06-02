# 🧬 GitHub Developer DNA

An enterprise-grade, high-fidelity developer capability analytics platform. Scan public GitHub metadata, repositories, and topics to calculate a developer's archetype, spar programmers in a gaming-inspired Battle Mode arena, and receive senior-level career mentorship powered by **Google Gemini AI**.

### ⚡ **[Live Demo](https://github-developer-dna.vercel.app/)**

---

## 🚀 Core Features

### 1. Developer DNA Analytics Engine
- **Heuristic Classifier**: Evaluates public repository size, forks, languages, and keywords to classify capability archetypes (e.g. *Frontend, Backend, Full Stack, or AI Developer*).
- **Strengths & Growth Pathways**: Derives custom technical strengths and action items based on real-world Git metadata.

### 2. Google Gemini AI Career Advisor
- **Manager-Level Reviews**: Uses the `gemini-3.5-flash` model to analyze your profile and act as a Senior Engineering Manager.
- **Actionable Mentorship**: Provides career pathway timelines, suggested future technologies, and detailed resume improvement items.

### 3. Combat Battle Mode Arena
- **Side-by-Side Sparring**: Compares two developers' metrics concurrently using a customized React Query fetch pipeline.
- **Battle Power scoring**:
  - ⭐ **Stars**: 2 pts
  - 🍴 **Forks**: 3 pts
  - 📦 **Repositories**: 5 pts
  - 👥 **Followers**: 1 pt
- **Aesthetic Combat Visuals**: Outfitted with neon cyan vs. rose gradient card components, interactive glowing VS badges, and responsive Recharts bar charts.

### 4. Smart Local History
- **Persistent Cache**: Remembers the last 10 unique lookups and matches using localized cache structures.
- **Layout Animations**: Features springy cards and animated exit routes powered by Framer Motion.

### 5. Print-Ready PDF Exporter
- **Light-Mode Print Style**: Excludes all interactive fields, buttons, and theme toggles to create a clean, corporate-ready white paper report suitable for interview packets.

---

## 🛠️ Technology Stack

| Frontend | Backend |
| :--- | :--- |
| **React 19** & **Vite** | **Node.js** & **Express** |
| **TypeScript** | **TypeScript** |
| **Tailwind CSS v4** | **Helmet** (Security) & **CORS** |
| **Framer Motion** (Animations) | **Node-Cache** (60s Cache Protection) |
| **Recharts** & **Lucide Icons** | **Google Gemini AI SDK** |

---

## 📂 Monorepo Folder Structure
```
github-developer-dna/
├── client/                     # Frontend Application (Vite + React + TS)
│   ├── src/
│   │   ├── features/
│   │   │   └── github-profile/ # Core Hooks, API Queries & UI Components
│   │   ├── App.tsx             # Theme toggler & custom hotkey listeners
│   │   └── index.css           # Styling directives, base fonts & glows
│
├── server/                     # Backend API Service (Node + Express + TS)
│   ├── src/
│   │   ├── controllers/        # Route Handlers
│   │   ├── services/           # Gemini AI & GitHub API integrations
│   │   └── index.ts            # Server spin-up gateways
```

---

## ⚙️ Local Development

### 1. Environment Variables Setup

#### Backend Environment (`server/.env`):
```env
PORT=5000
NODE_ENV=development
GITHUB_API_TOKEN=your_github_access_token # Optional but avoids rate-limits
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Run Locally

#### Start Backend Server:
```bash
cd server
npm install
npm run dev
```

#### Start Frontend Client:
```bash
cd client
npm install
npm run dev
```
Open **`http://localhost:5173`** to access your dashboard.
