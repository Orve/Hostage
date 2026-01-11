# HOSTAGE

<div align="center">

![CPT2601110741-672x783](https://github.com/user-attachments/assets/917625d4-5c6f-4c71-bdb1-061591eee03c)


**"Your negligence kills."**
*(その怠慢が、命を奪う。)*

[![Live Demo](https://img.shields.io/badge/demo-live-red?style=for-the-badge)](https://your-actual-domain.vercel.app)
[![Status](https://img.shields.io/badge/status-alpha-orange?style=for-the-badge)](https://github.com/yourusername/hostage)

*現実世界のタスク消化状況が、バーチャルキャラクターの「生存」に直結する。*
*ホラーゲーミフィケーション・タスク管理アプリケーション。*

</div>

---

## 💀 コンセプト (The Concept)

従来のタスク管理アプリは優しすぎました。期限を過ぎても、少し罪悪感を感じるだけで、また次の日へ持ち越してしまう。そこには「本当の代償」がありません。

**HOSTAGE はそれを変えます。**

あなたのキャラクターはステイシスポッド（生命維持装置）の中にいます。彼らの運命は、あなたの Notion タスクとリンクしています。
先延ばし（Procrastination）は単なる非効率ではありません。ここでは、**致死的な行為**です。

## ⚡ 機能 (Features)

**Notion Sync**  
Notion データベースから期限切れのタスクを自動検出し、キャラクターに物理的ダメージを与えます。現実の期限破りが、リアルな痛みとなります。

**Decay System (減衰システム)**  
時間経過とともにHPが自然減衰し、未知のウイルス感染が進行します。「時間」そのものがキャラクターを殺しにかかります。

**Routine Healing (習慣による回復)**  
指定された習慣（Habit）を完了することで、HPを回復しシステムを安定化させることができます。生産性は、生存のための手段です。

**Horror UI Corruption (UI崩壊)**  
HPが低下するにつれて、インターフェースが腐敗していきます：
- CRTスキャンラインと周辺減光（Vignette）
- 不穏なグリッチテキストアニメーション
- 警告色に染まるクリティカル状態（Red Pulse）
- システムエラーメッセージの氾濫

**責任を放棄するにつれ、画面が壊れていく様を目撃してください。**

## 🗺️ ロードマップ (Roadmap)

### Phase 1: The Infection ⚡ 完了 (MVP)
- [x] Notion API コア連携
- [x] HP 減衰システム
- [x] ホラー UI エフェクト (CRT, Glitches)
- [x] ステイシスポッドの視覚化
- [x] デモモード (セットアップ不要)
- [ ] PWA サポート (モバイル対応)

### Phase 2: Web3 Integration (2025 Q1)
- [ ] Solana ウォレット認証
- [ ] キャラクターの健康状態に応じて変化する Dynamic NFT
- [ ] アチーブメントシステム (永久生存バッジ)
- [ ] The Graveyard (死亡したキャラクターの公開追悼墓地)
- [ ] Revival Protocol (SOLトークンによる蘇生プロトコル)

### Phase 3: Community Features (2025 Q2)
- [ ] チームサバイバルモード (連帯責任)
- [ ] グローバルリーダーボード
- [ ] 生成AIによるホラーシナリオ生成

## 💻 技術スタック (Tech Stack)

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

## 🚀 始め方 (Getting Started)

### 1. データベースセットアップ (Supabase)
Supabase プロジェクトを作成し、以下のテーブルを用意してください:
- `profiles`: ユーザー情報
- `pets`: キャラクター状態管理
- `habits`: 習慣トラッキング

### 2. バックエンドセットアップ

```bash
# 仮想環境の作成
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# 依存関係のインストール
pip install -r requirements.txt

# 環境変数の設定
cp .env.example .env
```

必要な環境変数 (`.env`):

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_ID=your_notion_database_id
```

サーバーの起動:

```bash
uvicorn app.main:app --reload
```
API は `http://localhost:8000` で稼働します。

### 3. フロントエンドセットアップ

```bash
cd frontend

# パッケージインストール
npm install

# 開発サーバー起動
npm run dev
```
アプリは `http://localhost:3000` で稼働します。

## ⚠️ MVP設定についての注意
デモ目的のため、現状のバージョンではユーザーIDや習慣IDをコード内で指定する必要がある場合があります:

```typescript
// frontend/app/page.tsx
const USER_ID = "YOUR_SUPABASE_UUID";
const HABIT_ID = "YOUR_HABIT_UUID";
```
将来のリリースでは、適切な認証フローに置き換えられる予定です。

## 🎯 開発哲学 (Philosophy)
**「感情的なステークス（利害）」を通じた、罪悪感駆動型の生産性。**

HOSTAGE は、心理的ホラーを利用して「本物のモチベーション」を生み出します。
キャラクターの命があなたの生産性に依存しているとき、タスク消化は緊急かつ個人的な問題へと変わります。

これは単なるゲーミフィケーションではありません。
**先延ばしに対する、感情的な戦争です。**

## 📜 ライセンス
Personal Project - All Rights Reserved

---
Built with psychological horror and FastAPI 💀

**"Your negligence kills."**
