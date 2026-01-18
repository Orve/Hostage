# HOSTAGE Phase 1 Setup Guide

## 完了した実装

### ✅ 1. Authentication System
- Supabase Auth with Google OAuth
- AuthProvider コンテキスト
- AuthGuard コンポーネント
- ログインページ (/login)
- OAuth コールバックページ (/auth/callback)

### ✅ 2. Environment Variables
- `.env.local.example` テンプレート作成
- API_BASE の環境変数化
- Supabase URL/ANON_KEY の設定

### ✅ 3. Error Handling
- SystemError コンポーネント（ホラー美学対応）
- ErrorBoundary 実装
- APIError クラスでエラー詳細を保持

### ✅ 4. Database Schema
- tasks テーブル作成スクリプト
- RLS (Row Level Security) ポリシー設定
- habits テーブル拡張（native task対応）

---

## セットアップ手順

### Step 1: Supabase プロジェクトの準備

1. [Supabase Dashboard](https://app.supabase.com) にアクセス
2. プロジェクトを作成または選択
3. **Authentication → Providers → Google** を有効化
   - Google Cloud Console で OAuth 2.0 クライアントIDを作成
   - Authorized redirect URIs: `https://<your-project>.supabase.co/auth/v1/callback`
   - Client ID と Client Secret を Supabase に設定

### Step 2: データベースマイグレーション

Supabase SQL Editor で以下を実行：

```bash
# database/migrations/001_create_tasks_table.sql の内容を実行
```

または Supabase CLI を使用：

```bash
supabase db push
```

### Step 3: 環境変数の設定

```bash
cd frontend
cp .env.local.example .env.local
```

`.env.local` を編集：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

**取得方法：**
- Supabase Dashboard → Settings → API
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `Project API keys` の `anon/public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: 依存関係のインストール

```bash
cd frontend
npm install
```

**インストールされたパッケージ：**
- `@supabase/supabase-js` - Supabase JavaScript クライアント
- `@supabase/ssr` - Next.js App Router 対応

### Step 5: 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

---

## 動作確認

### ✅ 認証フロー
1. `http://localhost:3000` にアクセス → ログインページにリダイレクト
2. "Sign In With Google" ボタンをクリック
3. Google 認証画面で承認
4. `/auth/callback` 経由でホームページにリダイレクト
5. ペットステータスが表示される

### ✅ エラーハンドリング
1. バックエンドを停止した状態でページアクセス
2. SystemError コンポーネントが表示される
3. "RETRY_CONNECTION" ボタンで再試行可能

### ✅ ローディング状態
1. 認証中: "AUTHENTICATING" 表示
2. データ読込中: "LOADING_SYSTEM" 表示

---

## トラブルシューティング

### 問題: "Invalid login credentials"
**原因:** Supabase の Google OAuth が未設定
**解決:** Step 1 を確認し、Google Provider を有効化

### 問題: "Failed to fetch pet status"
**原因:** バックエンドAPIが起動していない、または環境変数が間違っている
**解決:**
1. バックエンドが `http://localhost:8000` で起動しているか確認
2. `.env.local` の `NEXT_PUBLIC_API_BASE` を確認

### 問題: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**原因:** 環境変数が読み込まれていない
**解決:**
1. `.env.local` ファイルが `frontend/` ディレクトリ直下にあるか確認
2. 開発サーバーを再起動

### 問題: コンポーネントのインポートエラー
**原因:** ファイルパスの誤り
**解決:** 以下のディレクトリ構造を確認：

```
frontend/
├── app/
│   ├── layout.tsx (AuthProvider & ErrorBoundary を import)
│   ├── page.tsx (AuthGuard & useAuth を使用)
│   ├── login/
│   │   └── page.tsx
│   └── auth/
│       └── callback/
│           └── page.tsx
├── components/
│   ├── AuthProvider.tsx
│   ├── AuthGuard.tsx
│   ├── ErrorBoundary.tsx
│   ├── SystemError.tsx
│   ├── PetDisplay.tsx
│   └── ActionPanel.tsx
└── lib/
    ├── api.ts
    └── supabase.ts
```

---

## 次のステップ（Phase 2）

Phase 1 が完了したら、以下を実装：

1. **Native Task System**
   - タスク作成フォーム
   - タスク一覧表示
   - タスク完了機能

2. **Notion Integration (Optional)**
   - Notion 同期をオプション機能として残す
   - エラー時のグレースフルな縮退

3. **Unified Task Logic**
   - Native/Notion タスクを統合的に処理
   - 期限切れタスクの自動検出

---

## Phase 1 成功基準

- [x] Google ログインが機能する
- [x] 認証エラーが適切に表示される
- [x] ローディング状態が表示される
- [x] ホラー美学が維持されている
- [x] ハードコードされた USER_ID が削除された
- [x] 環境変数が適切に管理されている
- [x] Error Boundary がクラッシュを防ぐ

**Phase 1 完了！次の Phase 2 へ進んでください。**
