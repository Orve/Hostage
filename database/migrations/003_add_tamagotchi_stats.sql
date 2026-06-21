-- Migration 003: たまごっちシステム用パラメータ追加
-- Supabase SQL Editor で実行すること

ALTER TABLE pets
  ADD COLUMN IF NOT EXISTS hunger FLOAT DEFAULT 0
    CHECK (hunger >= 0 AND hunger <= 100),
  ADD COLUMN IF NOT EXISTS mood FLOAT DEFAULT 50
    CHECK (mood >= 0 AND mood <= 100),
  ADD COLUMN IF NOT EXISTS evolution_stage INTEGER DEFAULT 0
    CHECK (evolution_stage >= 0 AND evolution_stage <= 4),
  ADD COLUMN IF NOT EXISTS evolution_path TEXT DEFAULT NULL
    CHECK (evolution_path IN ('light', 'dark') OR evolution_path IS NULL),
  ADD COLUMN IF NOT EXISTS care_score FLOAT DEFAULT 50
    CHECK (care_score >= 0 AND care_score <= 100);

-- infection_level を corruption として再利用（リネームせず意味を変える）
-- 既存カラム: infection_level INTEGER DEFAULT 0
-- 新しい意味: 腐敗度 0-100（習慣未達成で上昇、習慣完了で低下）
ALTER TABLE pets
  ALTER COLUMN infection_level SET DEFAULT 0,
  ADD CONSTRAINT infection_level_range
    CHECK (infection_level >= 0 AND infection_level <= 100);

COMMENT ON COLUMN pets.hunger IS '飢餓度 0-100。タスク未消化で上昇、完了で低下。高いとHP減衰加速';
COMMENT ON COLUMN pets.mood IS '機嫌度 0-100。習慣達成で上昇、時間経過で低下。高いとHP回復ボーナス';
COMMENT ON COLUMN pets.infection_level IS '腐敗度 0-100。習慣未達成で上昇、達成で低下。視覚的腐敗エフェクトに影響';
COMMENT ON COLUMN pets.evolution_stage IS '進化ステージ 0=卵 1=幼体 2=成体 3=覚醒/腐敗 4=最終形';
COMMENT ON COLUMN pets.evolution_path IS '進化パス: light=覚醒ルート dark=腐敗ルート（stage>=3で確定）';
COMMENT ON COLUMN pets.care_score IS 'ケアスコア 0-100。習慣達成/タスク消化の加重平均。進化パス決定に使用';
