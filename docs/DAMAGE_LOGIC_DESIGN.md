# ダメージロジック設計書
**日付**: 2026-01-22

---

## 1. 概要

タスクの期限切れや放置によるダメージシステムの設計。
ペットの生存には「タスクの消化」が必要であり、放置するとダメージを受ける。

---

## 2. ダメージ発生条件

### 2.1 期限切れタスク
| 条件 | ダメージ量 | 発生タイミング |
|---|---|---|
| 期限切れ後 1日経過 | -5 HP | cron実行時 |
| 期限切れ後 3日経過 | -10 HP | cron実行時 |
| 期限切れ後 7日経過 | -20 HP + タスク自動削除 | cron実行時 |

### 2.2 時間経過による自然減衰（既存）
- `calculate_time_decay` で実装済み
- 最後のチェックからの経過時間に応じてHPが減少

### 2.3 優先度による追加ダメージ
| 優先度 | 期限切れダメージ乗数 |
|---|---|
| low | x1.0 |
| medium | x1.5 |
| high | x2.0 |
| critical | x3.0 |

---

## 3. 期限切れタスク検出クエリ

```sql
-- 期限切れかつ未完了のタスクを取得
SELECT 
  t.id,
  t.user_id,
  t.title,
  t.priority,
  t.due_date,
  EXTRACT(DAY FROM (NOW() - t.due_date)) AS days_overdue
FROM tasks t
WHERE 
  t.completed = FALSE
  AND t.due_date IS NOT NULL
  AND t.due_date < NOW()
ORDER BY t.due_date ASC;
```

---

## 4. エンドポイント仕様

### 4.1 `POST /cron/damage`
ダメージを計算・適用するcron用エンドポイント。

**リクエスト**: なし（または管理者トークン）

**処理フロー**:
1. 全ユーザーの期限切れタスクを取得
2. ユーザーごとにダメージを集計
3. 各ペットにダメージを適用
4. HP <= 0 の場合、status を DEAD に変更
5. ログを返却

**レスポンス**:
```json
{
  "status": "completed",
  "processed_users": 15,
  "total_damage_dealt": 120,
  "pets_killed": 2,
  "details": [
    {
      "user_id": "uuid",
      "pet_name": "Subject-001",
      "damage": 15,
      "new_hp": 45,
      "overdue_tasks": 3
    }
  ]
}
```

### 4.2 `GET /tasks/{user_id}/overdue`
ユーザーの期限切れタスク一覧を取得。

**レスポンス**:
```json
{
  "overdue_tasks": [
    {
      "id": "uuid",
      "title": "BACKUP_ROUTINE",
      "due_date": "2026-01-20T00:00:00Z",
      "days_overdue": 2,
      "priority": "high",
      "potential_damage": 20
    }
  ],
  "total_potential_damage": 35
}
```

---

## 5. 実装計画

| フェーズ | タスク | 所要時間 |
|---|---|---|
| Phase 1 | `GET /tasks/{user_id}/overdue` エンドポイント実装 | 30分 |
| Phase 2 | `POST /cron/damage` エンドポイント実装 | 60分 |
| Phase 3 | フロントエンドに期限切れ警告UI追加 | 45分 |
| Phase 4 | Railway/Vercel Cron設定 | 15分 |

---

## 6. 注意事項

- cron実行は1日1回（例: 毎日 00:00 UTC）
- ダメージは「期限切れからの経過日数」で計算（時間単位ではない）
- ペットが既に `DEAD` の場合はスキップ
- タスクに `due_date` がない場合はダメージ対象外
