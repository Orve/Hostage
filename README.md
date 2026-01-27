# HOSTAGE

<div align="center">

> "Your negligence kills."

A horror-gamified productivity app where your virtual character's survival depends on your real-world task completion.

</div>

## 🎮 Try It Now (PWA Ready)

No App Store download required. Works natively on your browser.

👉 [Launch HOSTAGE](https://hostage-app.xyz/)

1. Open in Mobile Browser — Safari (iOS) or Chrome (Android).
2. Add to Home Screen — Experience full-screen immersion without address bars.
3. The Pact is Sealed — Your task list is now a life-support system.

## 💀 The Concept

Traditional task managers are too forgiving.  
Miss a deadline → feel vaguely guilty → move on. No real consequences.

HOSTAGE changes that.

Your character lives in a stasis pod. Their fate is tied to your tasks.  
Procrastination isn't just inefficient—it's lethal.

## ⚡ Features

### 🩸 The Executioner Protocol (Damage Logic)

Unlike other apps, this system uses a linear decay algorithm combined with a "Task Penalty".

- **Time Decay:** The pet's HP drops slowly over time (Natural aging).
- **Task Penalty:** Every overdue task deals massive damage instantly upon synchronization.
- **Result:** You cannot ignore your list. You must clear it to survive.

### 📱 Native PWA Experience

Designed to be installed on your home screen.

- Full-screen "Stasis Pod" interface.
- No browser chrome/UI distractions.
- Instant access to your guilt.

### 📉 Horror UI Corruption

As HP drops, the interface physically degrades:

- CRT scanlines and vignette overlays intensify.
- Glitch text animations and system warnings appear.
- The "Entity" visual changes from pristine to corrupted.

### ⚰️ Permadeath & Purge

If HP hits 0, the specimen is terminated. You have two choices:

- **Reboot:** Revive the same specimen (carry the shame).
- **Purge:** Destroy the data and start with a fresh specimen.

## 🗺️ Roadmap

### Phase 1: The Infection ⚡ CURRENT

- [x] Core Task/HP Logic (The Executioner)
- [x] Horror UI effects (CRT, glitches)
- [x] Mobile PWA support (Add to Home Screen)
- [x] "Purge" mechanism for dead pets

### Phase 2: Social Contagion (Next Update)

- [ ] The Graveyard: A public memorial for deceased characters.
- [ ] Team Survival: Link HP with friends. If one slacks, everyone takes damage.
- [ ] Push Notifications: "It's hurting..." alerts.

### Phase 3: Web3 / Ownership (Future)

- [ ] Solana wallet authentication
- [ ] Dynamic NFTs that decay with character health

## 💻 Tech Stack & Rationale
- **Frontend: Next.js 14 (App Router)**
  - Utilized Server Actions for seamless mutation handling directly from components.
  - PWA Manifest integration for native-like mobile experience.
- **Backend: FastAPI (Python)**
  - Selected for high-performance async processing of the "Damage Logic" and future AI integration.
- **Database: Supabase (PostgreSQL)**
  - Row Level Security (RLS) enabled for secure user data isolation.
  - Realtime subscriptions used for instant HP updates across devices.

## 🎯 Philosophy

Guilt-driven productivity.

HOSTAGE uses psychological horror to create genuine motivation. When your character's life depends on your productivity, task completion becomes urgent and personal.

This isn't gamification—it's emotional warfare against procrastination.

## 🛠 For Developers

<details>
  <summary><strong>Local Development & Self-Hosting Setup</strong></summary>

HOSTAGE is open for inspection.

### Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase account

### 1. Database Setup (Supabase)

Create a Supabase project with these tables:

- `pets`: Character state management  
- `tasks`: Simple task management

### 2. Backend Setup

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --reload

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📜 License
Personal Project - All Rights Reserved
Built with psychological horror and FastAPI 💀


