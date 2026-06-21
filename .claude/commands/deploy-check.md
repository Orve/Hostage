HOSTAGEのデプロイ前チェックを実行してほしいのだ。

以下をすべて確認して結果をまとめてほしいのだ：

## フロントエンドチェック
1. TypeScriptエラー確認: `cd frontend && npx tsc --noEmit`
2. ESLintチェック: `cd frontend && npm run lint`
3. ビルド確認: `cd frontend && npm run build`（環境変数のダミー値設定が必要）

## バックエンドチェック
1. シンタックスチェック: `python -m compileall app/`
2. importチェック: `python -c "from app.main import app; print('OK')"` (venv内で)

## 設定ファイルチェック
4. `vercel.json` にcrons設定があるか確認
5. `.env.example` と実際の環境変数が一致しているか確認（キーのみ）

## コードレビューポイント
- `any` 型が使われていないか
- `frontend/lib/api.ts` 経由でAPIを呼んでいるか
- 直接的なfetchが残っていないか

チェック結果を ✅/❌ で一覧表示してほしいのだ。
