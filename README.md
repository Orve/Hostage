# HOSTAGE

<div align="center">

![Demo](./assets/demo.gif)

**"Your negligence kills."**

[![Live Demo](https://img.shields.io/badge/demo-live-red?style=for-the-badge)](https://your-actual-domain.vercel.app)
[![Status](https://img.shields.io/badge/status-alpha-orange?style=for-the-badge)](https://github.com/yourusername/hostage)

*A horror-gamified productivity app where your virtual character's survival depends on your real-world task completion.*

</div>

---

## 💀 The Concept

Traditional task managers are too forgiving. Miss a deadline → feel vaguely guilty → move on. No real consequences.

**HOSTAGE changes that.**

Your character lives in a stasis pod. Their fate is tied to your Notion tasks. Procrastination isn't just inefficient—**it's lethal**.

## ⚡ Features

**Notion Sync**  
Automatically detects overdue tasks from your Notion database and inflicts physical damage on your character. Real deadlines = real consequences.

**Decay System**  
HP decays over time, simulating infection progression. Time literally kills your character.

**Routine Healing**  
Complete designated habits to restore HP and stabilize the system. Productivity becomes survival.

**Horror UI Corruption**  
As HP drops, the interface degrades:
- CRT scanlines and vignette overlays
- Glitch text animations
- Dynamic critical state (red pulse warnings)
- System error messages

**Watch the interface corrupt as you ignore your responsibilities.**

## 🗺️ Roadmap

### Phase 1: The Infection ⚡ IN PROGRESS
- [x] Core Notion API integration
- [x] HP decay system
- [x] Horror UI effects (CRT, glitches)
- [x] Stasis pod visualization
- [x] Demo mode (no setup required)
- [ ] Mobile PWA support

### Phase 2: Web3 Integration (Q1 2025)
- [ ] Solana wallet authentication
- [ ] Dynamic NFTs that change with character health
- [ ] Achievement system (permanent survivor badges)
- [ ] The Graveyard (public memorial for deceased characters)
- [ ] Revival Protocol (SOL-powered resurrection)

### Phase 3: Community Features (Q2 2025)
- [ ] Team survival mode
- [ ] Global leaderboards
- [ ] AI-generated horror scenarios

## 💻 Tech Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL)
- **Validation**: Pydantic v2
- **Integration**: Notion API (`httpx`)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 🚀 Getting Started

### 1. Database Setup (Supabase)
Create a Supabase project with these tables:
- `profiles`: User information
- `pets`: Character state management
- `habits`: Habit tracking

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

Required environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_ID=your_notion_database_id
```

Start the API server:

```bash
uvicorn app.main:app --reload
```
API runs at http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
App runs at http://localhost:3000

## ⚠️ MVP Configuration Note
For demo purposes, you may need to hardcode user/habit IDs:

```typescript
// frontend/app/page.tsx
const USER_ID = "YOUR_SUPABASE_UUID";
const HABIT_ID = "YOUR_HABIT_UUID";
```
This will be replaced with proper authentication in future releases.

## 🎯 Philosophy
**Guilt-driven productivity through emotional stakes.**

HOSTAGE uses psychological horror to create genuine motivation. When your character's life depends on your productivity, task completion becomes urgent and personal.

This isn't gamification—it's emotional warfare against procrastination.

## 📜 License
Personal Project - All Rights Reserved

---
Built with psychological horror and FastAPI 💀

**"Your negligence kills."**
