HOSTAGEの開発サーバーを起動する手順を案内してほしいのだ。

以下の手順を実行してほしいのだ：

1. バックエンド（FastAPI）の起動確認
   - `lsof -i :8000` でポート8000が空いているか確認
   - `cd /root/projects/Hostage && source venv/bin/activate && uvicorn app.main:app --reload` をバックグラウンドで起動

2. フロントエンド（Next.js）の起動確認
   - `lsof -i :3000` でポート3000が空いているか確認
   - `cd /root/projects/Hostage/frontend && npm run dev` を起動

3. 両方起動後に以下を表示してほしいのだ：
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs
