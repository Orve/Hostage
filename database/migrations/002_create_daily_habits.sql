-- ============================================================
-- HOSTAGEプロジェクト: 日次習慣管理テーブル
-- 
-- ストリーク追跡機能を持つ独立した習慣管理システム。
-- タスクとは異なり、毎日繰り返し実行される習慣を管理する。
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  streak INTEGER DEFAULT 0,                    -- 現在の連続達成日数
  last_completed_at TIMESTAMPTZ,               -- 最終完了日時（NULL = 未完了）
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- パフォーマンス最適化用インデックス
CREATE INDEX IF NOT EXISTS idx_daily_habits_user_id ON daily_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_habits_last_completed ON daily_habits(last_completed_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の習慣のみ操作可能
CREATE POLICY "Users can view their own daily habits"
  ON daily_habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily habits"
  ON daily_habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily habits"
  ON daily_habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily habits"
  ON daily_habits FOR DELETE
  USING (auth.uid() = user_id);

-- テーブルコメント
COMMENT ON TABLE daily_habits IS '日次習慣管理テーブル - ストリーク追跡機能付き';
COMMENT ON COLUMN daily_habits.streak IS '連続達成日数 - ユーザーのモチベーション維持の核';
COMMENT ON COLUMN daily_habits.last_completed_at IS '最終完了日時 - 今日完了済みかどうかの判定に使用';
