# HOSTAGE - AGENTS.md

ホラー×ゲーミフィケーションのタスク管理アプリ。バーチャルキャラクターの生存がリアルのタスク消化に直結する。

## アーキテクチャ

```
Hostage/
├── app/              # FastAPI バックエンド
│   ├── main.py       # エントリーポイント（CORS設定・ルーター登録）
│   ├── routers/      # APIエンドポイント群
│   │   ├── tasks.py        # タスクCRUD + /cron/damage エンドポイント
│   │   ├── pets.py         # ペット（キャラクター）管理
│   │   ├── habits.py       # Notion同期習慣
│   │   ├── daily_habits.py # ネイティブ日次習慣
│   │   └── sync.py         # Notion同期
│   ├── services/
│   │   ├── game_logic.py   # HP減衰計算（calculate_time_decay）
│   │   ├── supabase.py     # Supabaseクライアント
│   │   └── notion.py       # Notion API連携
│   └── models/       # Pydanticモデル
│
├── frontend/         # Next.js 16 + App Router
│   ├── app/
│   │   ├── page.tsx        # メインダッシュボード
│   │   ├── stasis/         # ステイシスチャンバー画面
│   │   ├── login/          # 認証ページ
│   │   ├── demo/           # デモモード（認証不要）
│   │   └── api/cron/damage/ # Vercel Cron→バックエンドプロキシ
│   ├── components/
│   │   ├── StasisChamber.tsx  # キャラクター表示メイン
│   │   ├── PetDisplay.tsx     # ペット表示
│   │   ├── TaskManager.tsx    # タスク管理UI
│   │   ├── HabitManager.tsx   # 習慣管理UI
│   │   ├── DeathTimer.tsx     # 死亡カウントダウン
│   │   ├── DeathOverlay.tsx   # 死亡時オーバーレイ
│   │   ├── ScreenEffect.tsx   # CRT/グリッチエフェクト
│   │   ├── AuthGuard.tsx      # 認証ガード
│   │   └── AuthProvider.tsx   # Supabase認証コンテキスト
│   └── lib/
│       ├── api.ts           # バックエンドAPIクライアント
│       ├── supabase.ts      # Supabaseクライアント
│       ├── characterAssets.ts # キャラクター画像パス管理
│       └── i18n/            # 多言語対応（ja/en）
│
└── database/migrations/  # Supabase SQLマイグレーション
```

## 技術スタック

| 層 | 技術 | バージョン |
|---|---|---|
| Frontend | Next.js / React / TypeScript | 16.1.1 / 19.2.3 / 5.x |
| Styling | Tailwind CSS + framer-motion | 4.x |
| Auth / DB | Supabase | SSR 0.8.0 |
| Backend | FastAPI + Uvicorn | ≥0.100.0 |
| ORM | Pydantic v2 | ≥2.0.0 |
| 外部連携 | Notion API | notion-client ≥2.0.0 |
| Deploy | Vercel (frontend) / Railway (backend) | - |

## 開発コマンド

```bash
# フロントエンド
cd frontend && npm run dev          # localhost:3000
cd frontend && npm run dev:fresh    # ポート3000強制開放してから起動
cd frontend && npm run build        # ビルドチェック

# バックエンド
source venv/bin/activate
uvicorn app.main:app --reload       # localhost:8000

# 同時起動（推奨）
/run  # プロジェクトスキルを使う
```

## ゲームロジック（重要）

### ダメージシステム
- **時間減衰**: `calculate_time_decay()` in `app/services/game_logic.py`
- **期限切れタスクダメージ**: `app/routers/tasks.py` の `DAMAGE_RULES`
  - 1日経過: -5 HP/日
  - 3日経過: -10 HP/日
  - 7日経過: -20 HP/日 + 自動削除
- **優先度倍率**: low×1.0 / medium×1.5 / high×2.0 / critical×3.0
- **Cron実行**: Vercel Cron → `frontend/app/api/cron/damage/route.ts` → バックエンド `/tasks/cron/damage`

### HP管理
- HPは Supabase の `pets` テーブルで管理
- HP=0 → 死亡状態 → `DeathOverlay` 表示
- 死亡後: Reboot（リセット）or Purge（データ削除）を選択

## 環境変数

### Backend (`.env`)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NOTION_TOKEN=
NOTION_DB_ID=
CRON_SECRET=
ALLOWED_ORIGINS=http://localhost:3000,https://hostage-app.vercel.app
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:8000
CRON_SECRET=
```

## コーディング規約

- **TypeScript**: `any` 禁止、型は明示
- **API通信**: `frontend/lib/api.ts` の関数経由で統一（直接fetchしない）
- **認証**: `AuthGuard.tsx` でラップ必須、Supabase SSR使用
- **スタイル**: Tailwind CSS、ホラー演出は `ScreenEffect.tsx` に集約
- **i18n**: テキストは `frontend/lib/i18n/dict.ts` に追加、直書き禁止

## デプロイ・CI

- CI: `.github/workflows/ci.yml`（Pythonシンタックスチェック + Next.jsビルド）
- Frontend: Vercel（自動デプロイ、main pushで発火）
- Backend: Railway（`railway.toml` / `Procfile` で設定）
- 本番URL: https://hostage-app.xyz/

## 注意事項

- デモモード (`/demo`) は認証不要で動作する別フロー
- `page.tsx.prd` / `page.tsx.demo` は差し替え用バックアップファイル
- `StasisChamber.demo.tsx` はデモ用コンポーネント
- Vercel Cronは `vercel.json` の `crons` フィールドで設定（UTC基準）
