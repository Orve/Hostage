HOSTAGEのダメージロジックをデバッグしてほしいのだ。

以下を順番に確認してほしいのだ：

1. **ダメージロジックの実装確認**
   - `app/services/game_logic.py` の `calculate_time_decay` 関数を読む
   - `app/routers/tasks.py` の `DAMAGE_RULES` と `calculate_overdue_damage` を読む

2. **Cronエンドポイントの確認**
   - `frontend/app/api/cron/damage/route.ts` を読む
   - バックエンドの `/tasks/cron/damage` エンドポイントを読む

3. **現在の状態確認（バックエンドが起動中の場合）**
   ```bash
   curl http://localhost:8000/tasks/cron/damage \
     -H "X-API-KEY: ${CRON_SECRET:-hostage_cron_secret_2026}"
   ```

4. 問題があれば修正案を提示してほしいのだ。
