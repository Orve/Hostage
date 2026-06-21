"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchDailyHabits,
  createDailyHabit,
  toggleDailyHabitCheck,
  deleteDailyHabit,
  DailyHabit,
} from "../lib/api";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface HabitManagerProps {
  userId: string;
  onHabitComplete?: () => void; // ペットの状態を更新するためのコールバック
  onHpChange?: (delta: number) => void; // 楽観的HP更新
}

/**
 * HabitManager - 習慣管理コンポーネント
 *
 * ストリーク追跡機能を持つ日次習慣の管理UI。
 * サイバーパンク・ホラーな雰囲気を維持しつつ、
 * 炎アイコンでストリークを強調表示する。
 */
export default function HabitManager({ userId, onHabitComplete, onHpChange }: HabitManagerProps) {
  const { t, locale } = useTranslation();
  const [habits, setHabits] = useState<DailyHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 新規習慣入力
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ストリーク更新時のエフェクト
  const [streakMessage, setStreakMessage] = useState<string | null>(null);

  /**
   * 今日完了済みかどうかを判定（JST基準）
   */
  const isCompletedToday = (habit: DailyHabit): boolean => {
    if (!habit.last_completed_at) return false;

    const lastCompleted = new Date(habit.last_completed_at);
    const now = new Date();

    // JST（UTC+9）に変換して日付を比較
    const jstOffset = 9 * 60 * 60 * 1000;

    const lastCompletedJST = new Date(lastCompleted.getTime() + jstOffset);
    const nowJST = new Date(now.getTime() + jstOffset);

    return (
      lastCompletedJST.toDateString() === nowJST.toDateString()
    );
  };

  /**
   * ストリークに応じた炎の強度を返す
   */
  const getStreakIntensity = (streak: number): string => {
    if (streak >= 30) return "text-red-400 animate-pulse"; // 30日以上: 激しい炎
    if (streak >= 7) return "text-orange-400"; // 7日以上: オレンジ
    if (streak >= 3) return "text-yellow-400"; // 3日以上: 黄色
    return "text-gray-500"; // 3日未満: グレー
  };

  /**
   * ストリークに応じた炎のサイズを返す
   */
  const getStreakSize = (streak: number): string => {
    if (streak >= 30) return "text-2xl";
    if (streak >= 7) return "text-xl";
    if (streak >= 3) return "text-lg";
    return "text-base";
  };

  // 習慣一覧を取得
  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchDailyHabits(userId);
      setHabits(response.habits);
    } catch (e) {
      console.error("Failed to load habits:", e);
      setError(e instanceof Error ? e.message : "HABIT_LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadHabits();
    }
  }, [userId, loadHabits]);

  // 習慣作成
  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newHabitTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const newHabit = await createDailyHabit({
        user_id: userId,
        title: newHabitTitle.trim(),
      });

      // 楽観的更新: 新規習慣を先頭に追加
      setHabits((prev) => [newHabit, ...prev]);
      setNewHabitTitle("");
      setShowAddForm(false);
    } catch (e) {
      console.error("Failed to create habit:", e);
      setError(e instanceof Error ? e.message : "HABIT_CREATE_FAILED");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 習慣チェック（楽観的更新）
  const handleToggleCheck = async (habitId: string) => {
    // 対象の習慣を取得
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const wasCompleted = isCompletedToday(targetHabit);

    // 楽観的更新: 即座にUIを更新
    const HEAL_AMOUNT = 10.0;
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;

        if (wasCompleted) {
          // キャンセル: streak -1, last_completed_at を null に
          return {
            ...h,
            streak: Math.max(0, h.streak - 1),
            last_completed_at: null,
          };
        } else {
          // 完了: streak +1 (簡易計算), last_completed_at を now に
          return {
            ...h,
            streak: h.streak + 1,
            last_completed_at: new Date().toISOString(),
          };
        }
      })
    );

    // 楽観的HP更新: チェック時は即座に+10、キャンセル時は-10
    if (onHpChange) {
      onHpChange(wasCompleted ? -HEAL_AMOUNT : HEAL_AMOUNT);
    }

    // バックグラウンドでAPI呼び出し
    try {
      const response = await toggleDailyHabitCheck(habitId);

      // APIレスポンスで正確な値に更新
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? response.habit : h))
      );

      // 完了時のメッセージ表示
      if (response.action === "checked") {
        // HP回復情報を含むメッセージ
        const healInfo = response.healed > 0 ? ` +${response.healed} HP` : "";
        const newStreak = response.new_streak;
        setStreakMessage(
          newStreak > 1
            ? `🔥 ${newStreak}${t('habit.streak_message')}${healInfo}`
            : `✓ ${t('habit.completed')}${healInfo}`
        );
        setTimeout(() => setStreakMessage(null), 2000);

        // ペットの状態を更新
        if (response.healed > 0 && onHabitComplete) {
          onHabitComplete();
        }
      }
    } catch (e) {
      // 失敗: ロールバック（HP含む）
      console.error("Failed to toggle habit:", e);
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? targetHabit : h))
      );
      if (onHpChange) {
        onHpChange(wasCompleted ? HEAL_AMOUNT : -HEAL_AMOUNT);
      }
      setStreakMessage(null);
      setError(e instanceof Error ? e.message : "HABIT_CHECK_FAILED");
    }
  };

  // 習慣削除（楽観的更新）
  const handleDeleteHabit = async (habitId: string) => {
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    // 楽観的更新
    setHabits((prev) => prev.filter((h) => h.id !== habitId));

    try {
      await deleteDailyHabit(habitId);
    } catch (e) {
      // 失敗: ロールバック
      console.error("Failed to delete habit:", e);
      setHabits((prev) => [targetHabit, ...prev]);
      setError(e instanceof Error ? e.message : "HABIT_DELETE_FAILED");
    }
  };

  return (
    <div className="w-full mt-6">
      {/* ========== ヘッダー ========== */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-amber-400 tracking-[0.2em] uppercase">
            {t('habit.daily_habits')}
          </h3>
          {/* トータルストリーク表示 */}
          {habits.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-900/50 text-amber-400 tracking-wider">
              🔥 {habits.reduce((sum, h) => sum + h.streak, 0)} {t('habit.total')}
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 text-xs border border-amber-700 text-amber-400 hover:bg-amber-900/30 tracking-wider uppercase"
        >
          {showAddForm ? t('action.cancel') : t('habit.add_habit')}
        </motion.button>
      </div>

      {/* ========== ストリークメッセージ ========== */}
      <AnimatePresence>
        {streakMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-amber-900/90 border border-amber-500 text-amber-300 text-2xl font-bold tracking-widest"
          >
            {streakMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== 習慣追加フォーム ========== */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateHabit}
            className="mb-4 p-3 border border-amber-900/50 bg-black/80 overflow-hidden"
          >
            <div className="space-y-3">
              {/* タイトル入力 */}
              <input
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder={t('habit.title_placeholder')}
                className="w-full px-3 py-2 bg-black border border-amber-800 text-amber-300 text-sm font-mono placeholder:text-amber-900/50 focus:outline-none focus:border-amber-400"
                disabled={isSubmitting}
                maxLength={100}
              />

              {/* 送信ボタン */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !newHabitTitle.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 border border-amber-700 text-amber-400 hover:bg-amber-900/30 text-xs tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('habit.creating') : t('habit.create_habit')}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ========== エラー表示 ========== */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-2 border border-red-900 bg-red-950/30 text-red-500 text-xs tracking-wider text-center font-mono"
        >
          ⚠ {error}
        </motion.div>
      )}

      {/* ========== 習慣一覧 ========== */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-4">
            <span className="text-amber-600 text-xs tracking-[0.3em] animate-pulse">
              {t('habit.loading')}
            </span>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-amber-900/30">
            <div className="text-amber-800 text-xs tracking-widest">
              {t('habit.no_habits')}
            </div>
            <div className="text-amber-900/50 text-[10px] mt-1 tracking-wider">
              {t('habit.add_habit_help')}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {habits.map((habit, index) => {
              const completedToday = isCompletedToday(habit);

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative flex items-center gap-3 p-3 border transition-all ${completedToday
                    ? "border-amber-600 bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "border-amber-900/50 bg-black/60 hover:bg-black/80"
                    }`}
                >
                  {/* 完了チェックボックス */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleCheck(habit.id)}
                    className={`w-6 h-6 border rounded flex items-center justify-center transition-all ${completedToday
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-amber-700 hover:bg-amber-900/50"
                      }`}
                  >
                    {completedToday && <span className="text-sm font-bold">✓</span>}
                  </motion.button>

                  {/* 習慣情報 */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-mono truncate ${completedToday ? "text-amber-400" : "text-amber-600"
                        }`}
                    >
                      {habit.title}
                    </div>
                  </div>

                  {/* ストリーク表示 */}
                  <motion.div
                    className={`flex items-center gap-1 ${getStreakIntensity(
                      habit.streak
                    )}`}
                    animate={
                      habit.streak >= 7
                        ? {
                          scale: [1, 1.1, 1],
                          transition: { repeat: Infinity, duration: 2 },
                        }
                        : {}
                    }
                  >
                    <span className={getStreakSize(habit.streak)}>🔥</span>
                    <span className="text-sm font-bold tracking-wider">
                      {habit.streak}
                    </span>
                  </motion.div>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="w-8 h-8 text-red-600/60 hover:text-red-400 transition-colors flex items-center justify-center"
                  >
                    🗑
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* ========== 習慣数表示 ========== */}
      {!loading && habits.length > 0 && (
        <div className="mt-3 text-center text-[10px] text-amber-900/50 tracking-widest">
          {habits.length} HABIT{habits.length > 1 ? "S" : ""} | BUILD YOUR STREAK
        </div>
      )}
    </div>
  );
}
