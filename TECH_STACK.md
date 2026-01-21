# HOSTAGE - 技術スタック概要

## 📋 プロジェクト概要

**HOSTAGE**は、ホラー×ゲーミフィケーションを組み合わせた生産性向上アプリです。  
バーチャルキャラクターの生存が、現実世界のタスク完了に依存するという心理的プレッシャーを活用しています。

---

## 🏗️ アーキテクチャ

```
Hostage/
├── app/                    # Python Backend (FastAPI)
│   ├── main.py             # FastAPIエントリーポイント
│   ├── core/               # ビジネスロジックのコア
│   ├── models/             # Pydanticモデル定義
│   ├── routers/            # APIエンドポイント
│   │   ├── habits.py       # 習慣管理API
│   │   ├── pets.py         # ペット（キャラクター）管理API
│   │   └── sync.py         # Notion同期API
│   └── services/           # 外部サービス連携
│       ├── game_logic.py   # ゲームロジック（HP減衰など）
│       ├── notion.py       # Notion API連携
│       └── supabase.py     # Supabase DB連携
│
├── frontend/               # Next.js Frontend
│   ├── app/                # App Router構造
│   │   ├── auth/           # 認証関連ページ
│   │   ├── demo/           # デモモード
│   │   ├── login/          # ログインページ
│   │   ├── stasis/         # Stasisチャンバー画面
│   │   ├── layout.tsx      # ルートレイアウト
│   │   ├── page.tsx        # メインダッシュボード
│   │   └── globals.css     # グローバルスタイル
│   ├── components/         # Reactコンポーネント
│   │   ├── StasisChamber.tsx   # ステイシスチャンバー表示
│   │   ├── CreatePetForm.tsx   # ペット作成フォーム
│   │   ├── PetDisplay.tsx      # ペット表示
│   │   ├── ActionPanel.tsx     # アクションパネル
│   │   ├── AuthGuard.tsx       # 認証ガード
│   │   ├── AuthProvider.tsx    # 認証プロバイダー
│   │   ├── ErrorBoundary.tsx   # エラーバウンダリ
│   │   └── SystemError.tsx     # システムエラー表示
│   └── lib/                # ユーティリティ・API
│
├── database/               # データベース関連
│   └── migrations/         # マイグレーションファイル
│
└── 設定ファイル群
```

---

## ⚙️ 技術スタック詳細

### **Frontend（フロントエンド）**

| カテゴリ | 技術 | バージョン | 備考 |
|---------|------|-----------|------|
| フレームワーク | **Next.js** | 16.1.1 | App Router使用 |
| UIライブラリ | **React** | 19.2.3 | 最新版 |
| 言語 | **TypeScript** | 5.x | 型安全な開発 |
| スタイリング | **Tailwind CSS** | 4.x | PostCSS統合 |
| 認証 | **Supabase SSR** | 0.8.0 | サーバーサイド認証 |
| DB接続 | **Supabase JS** | 2.90.1 | クライアントサイドDB |
| Linter | **ESLint** | 9.x | コード品質管理 |

### **Backend（バックエンド）**

| カテゴリ | 技術 | バージョン | 備考 |
|---------|------|-----------|------|
| フレームワーク | **FastAPI** | ≥0.100.0 | 高速なPython API |
| サーバー | **Uvicorn** | ≥0.20.0 | ASGIサーバー |
| バリデーション | **Pydantic** | ≥2.0.0 | データ検証 |
| 設定管理 | **Pydantic Settings** | ≥2.0.0 | 環境変数管理 |
| 環境変数 | **python-dotenv** | ≥1.0.0 | .envファイル読み込み |
| Python | - | 3.11+ | runtime.txt指定 |

### **外部サービス連携**

| サービス | 用途 | ライブラリ |
|----------|------|-----------|
| **Supabase** | データベース・認証 | supabase ≥2.0.0 |
| **Notion API** | タスク同期 | notion-client ≥2.0.0 |

### **インフラ・デプロイ**

| プラットフォーム | 用途 | 設定ファイル |
|-----------------|------|-------------|
| **Railway** | バックエンドホスティング | railway.toml |
| **Vercel** | フロントエンドホスティング | (自動検出) |
| **Render** | 代替ホスティング | Procfile |

---

## 🎨 UI/UXデザイン特徴

### ホラー要素
- **CRTスキャンライン**：レトロなブラウン管効果
- **グリッチアニメーション**：HP低下時のUI崩壊
- **ビネット効果**：画面端の暗転
- **赤色パルス警告**：クリティカル状態の視覚表現
- **サイバーパンク美学**：ネオン、ターミナル風UI

### 主要コンポーネント
- **StasisChamber**：キャラクターを表示するステイシスポッド
- **CreatePetForm**：ターミナル風のキャラクター作成画面

---

## 🔐 環境変数

### Backend (.env)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_ID=your_notion_database_id
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🚀 ローカル開発コマンド

### Backend
```bash
# 仮想環境の作成と有効化
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# 依存関係インストール
pip install -r requirements.txt

# 開発サーバー起動
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📅 開発フェーズ

| フェーズ | 状態 | 主な機能 |
|---------|------|----------|
| Phase 1: The Infection | 🔄 進行中 | Notion連携、HP減衰、ホラーUI |
| Phase 2: Web3 Integration | 📋 計画中 | Solana認証、動的NFT |
| Phase 3: Community Features | 📋 計画中 | チームモード、リーダーボード |

---

*最終更新: 2026-01-20*
