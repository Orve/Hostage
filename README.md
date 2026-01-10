# HOSTAGE (MVP)

> **"Your negligence kills."**

**HOSTAGE** は、現実世界のタスク消化状況がバーチャルキャラクターの「命」に直結する、ホラーゲーミフィケーション・タスク管理アプリケーションです。
Notionのタスク管理と連動し、タスクを放置するとキャラクターが衰弱し、画面が不穏な状態（グリッチ、ノイズ、警告色）へと変貌します。

![CPT2601110741-672x783](https://github.com/user-attachments/assets/a763e9bf-eb73-410c-9ace-73e1d11b1900)


## 🛠 Features

*   **Notion Sync**: Notionデータベースの「期限切れタスク」を自動取得し、キャラクターに物理的ダメージを与えます。
*   **Decay System**: 時間経過とともにHPが減衰（感染進行）します。
*   **Routine Healing**: 指定された習慣（Habit）を完了することで、HPを回復できます。
*   **Horror UI**: HP低下に伴い、UIが「崩壊」します。
    *   CRT Scanlines & Vignette Overlay
    *   Glitch Text Animations
    *   Dynamic Critical State (Red Pulse)

## 💻 Tech Stack

### Backend
*   **Language**: Python 3.11+
*   **Framework**: FastAPI
*   **Database**: Supabase (PostgreSQL)
*   **Validation**: Pydantic v2
*   **Integration**: Notion API (`httpx`)

### Frontend
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS
*   **Language**: TypeScript

## 🚀 Getting Started

### 1. Database Setup (Supabase)
Supabaseプロジェクトを作成し、以下のテーブルが必要です。
*   `profiles`: ユーザー情報
*   `pets`: キャラクター状態管理
*   `habits`: 習慣管理

### 2. Backend Setup
ルートディレクトリで実行します。

```bash
# 仮想環境作成 (推奨)
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# 依存関係インストール
pip install -r requirements.txt

# 環境変数設定
# .env.example をコピーして .env を作成し、自身のキーを設定してください
cp .env.example .env
```

**Required .env Variables:**
*   `SUPABASE_URL`
*   `SUPABASE_SERVICE_ROLE_KEY`
*   `NOTION_TOKEN`
*   `NOTION_DB_ID`

**Run Server:**
```bash
uvicorn app.main:app --reload
```
APIは `http://localhost:8000` で起動します。

### 3. Frontend Setup
`frontend` ディレクトリで実行します。

```bash
cd frontend

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```
アプリは `http://localhost:3000` で起動します。

## ⚠️ MVP Configuration Note
現在のMVPバージョンでは、デモを容易にするため、フロントエンド側で**ユーザーIDと習慣IDの設定**が必要な場合があります。

`frontend/app/page.tsx`:
```typescript
// ご自身のSupabase User UUIDとHabit IDに適宜書き換えてください
const USER_ID = "YOUR_UUID_HERE";
const HABIT_ID = "YOUR_HABIT_UUID_HERE";
```

## 📜 License
Personal Project.

