
-- ============================================================
-- HOSTAGE Master Schema Migration
-- 新規Supabaseプロジェクト向け: このファイル1本を実行すれば完了
-- 実行順: profiles → pets → tasks → habits → daily_habits
-- ============================================================

-- ============================================================
-- 1. profiles テーブル
-- auth.users とのブリッジ。ペット作成時に自動生成される。
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================
-- 2. pets テーブル（被験体）
-- ============================================================
CREATE TABLE IF NOT EXISTS pets (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  hp               FLOAT NOT NULL DEFAULT 40.0,
  max_hp           FLOAT NOT NULL DEFAULT 100.0,
  infection_level  INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'ALIVE'
                     CHECK (status IN ('ALIVE', 'DEAD', 'CRITICAL')),
  last_checked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  born_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  character_type   TEXT NOT NULL DEFAULT 'cyber-fairy'
);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_status  ON pets(status);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pets"
  ON pets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pets"
  ON pets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 3. tasks テーブル（ネイティブタスク）
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  due_date     TIMESTAMPTZ,
  priority     TEXT NOT NULL DEFAULT 'medium'
                 CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  source       TEXT NOT NULL DEFAULT 'native'
                 CHECK (source IN ('notion', 'native')),
  tags         TEXT[],
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id   ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date  ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_tasks_updated_at();

-- ============================================================
-- 4. habits テーブル（Notion同期 + ネイティブ習慣）
-- ============================================================
CREATE TABLE IF NOT EXISTS habits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  frequency  TEXT NOT NULL DEFAULT 'DAILY',
  source     TEXT NOT NULL DEFAULT 'notion'
               CHECK (source IN ('notion', 'native')),
  task_id    UUID REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_task_id ON habits(task_id);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
  ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 5. daily_habits テーブル（ストリーク追跡）
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_habits (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  streak            INTEGER NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_habits_user_id       ON daily_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_habits_last_completed ON daily_habits(last_completed_at);

ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily habits"
  ON daily_habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily habits"
  ON daily_habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily habits"
  ON daily_habits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily habits"
  ON daily_habits FOR DELETE USING (auth.uid() = user_id);
