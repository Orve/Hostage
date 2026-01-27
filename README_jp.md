# HOSTAGE

<div align="center">

> "Your negligence kills." (その怠慢が、命を奪う。)

現実世界のタスク消化状況が、バーチャルキャラクターの「生存」に直結する。  
ホラーゲーミフィケーション・タスク管理アプリケーション。

</div>

## 🎮 今すぐ試す (PWA Ready)

アプリストアからのダウンロードは不要。ブラウザから直接インストール可能です。

👉 [HOSTAGE を起動する](https://hostage-app.xyz/)

1. モバイルブラウザで開く - iOS (Safari) または Android (Chrome) 推奨。
2. ホーム画面に追加 - アドレスバーのない「全画面の没入体験」が可能になります。
3. 契約成立 - あなたのタスクリストは、生命維持装置となりました。

## 💀 コンセプト (The Concept)

従来のタスク管理アプリは優しすぎました。期限を過ぎても、少し罪悪感を感じるだけで、また次の日へ持ち越してしまう。そこには「本当の代償」がありません。

HOSTAGE はそれを変えます。

あなたのキャラクターはステイシスポッド（生命維持装置）の中にいます。彼らの運命は、あなたのタスク消化とリンクしています。先延ばし（Procrastination）は単なる非効率ではありません。ここでは、致死的な行為です。

## ⚡ 機能 (Features)

### 🩸 処刑執行プロトコル (The Executioner Protocol)

他のアプリとは異なり、このシステムは冷徹な「減衰アルゴリズム」と「タスク罰」を組み合わせます。

- **時間減衰 (Time Decay):** 時間経過とともにHPが自然減衰（老化）します。
- **タスク滞留罰 (Task Penalty):** 期限切れタスクを同期するたびに、致命的なダメージを与えます。
- **結果:** 無視は許されません。生き残るには、消化するしかないのです。

### 📱 ネイティブPWA体験

ホーム画面に追加して使用することを前提に設計されています。

- 全画面の「ステイシスポッド」インターフェース
- 没入感を削ぐブラウザバーの排除
- ポケットから「罪悪感」への即時アクセス

### 📉 ホラーUI崩壊 (UI Corruption)

HPが低下するにつれて、インターフェースが物理的に腐敗していきます：

- CRTスキャンラインと周辺減光（Vignette）の悪化
- 不穏なグリッチテキストとシステム警告
- "Entity"（被検体）の姿が、清浄な状態から崩れていく様

### ⚰️ 死と廃棄 (Permadeath & Purge)

HPが0になると、被検体は**終了（Terminated）**します。選択肢は2つ：

- **再起動 (Reboot):** 同じ被検体を蘇生し、恥と共に生きる。
- **廃棄 (Purge):** データを物理削除し、新たな被検体でやり直す。

## 🗺️ ロードマップ (Roadmap)

### Phase 1: The Infection ⚡ 現在 (Current)

- [x] コア・タスク/HPロジック (The Executioner)
- [x] ホラー UI エフェクト (CRT, Glitches)
- [x] PWA サポート (ホーム画面追加)
- [x] 検体廃棄 (Purge) メカニズム

### Phase 2: Social Contagion (Next Update)

- [ ] The Graveyard: 死亡したキャラクターの公開追悼墓地
- [ ] Team Survival: 友人とHPをリンク（連帯責任モード）
- [ ] Push Notifications: "It's hurting..."（痛み）の通知

### Phase 3: Web3 / Ownership (Future)

- [ ] Solana ウォレット認証
- [ ] 健康状態に応じて腐敗・変化する Dynamic NFT

## 💻 技術スタック (Tech Stack)

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Supabase (PostgreSQL)
- **Infrastructure:** Vercel (Frontend), Railway (Backend)

## 🎯 開発哲学 (Philosophy)

「罪悪感駆動型」生産性。

HOSTAGE は、心理的ホラーを利用して「本物のモチベーション」を生み出します。キャラクターの命があなたの生産性に依存しているとき、タスク消化は緊急かつ個人的な問題へと変わります。

これは単なるゲーミフィケーションではありません。先延ばしに対する、感情的な戦争です。

## 🛠 開発者の方へ

<details>
  <summary><strong>ローカル開発環境・セルフホスティング</strong></summary>

HOSTAGE はオープンな実験場です。

### 前提条件

- Python 3.11+
- Node.js 18+
- Supabase アカウント

### 1. データベース (Supabase)

以下のテーブルを作成:

- `pets`: キャラクター状態管理
- `tasks`: 簡易タスク管理

### 2. バックエンド

```bash
# 仮想環境作成
python -m venv venv
source venv/bin/activate

# インストール
pip install -r requirements.txt

# 起動
uvicorn app.main:app --reload
```

### 3. フロントエンド

```bash
cd frontend
npm install
npm run dev
```

</details>

## 📜 ライセンス

Personal Project - All Rights Reserved

Built with psychological horror and FastAPI 💀
