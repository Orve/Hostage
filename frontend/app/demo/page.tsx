"use client";

import React, { useState, useEffect, useMemo } from "react";
import StasisChamber from "../../components/StasisChamber";
import DashboardLayout from "../../components/DashboardLayout";
import { getCharacterImageByStatus, DEFAULT_CHARACTER_TYPE } from "@/lib/characterAssets";

// --- Mock Data & Types ---
type Task = {
  id: string;
  label: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
};

type Habit = {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: "t1", label: "NIGHTLY_BACKUP_ROUTINE", completed: false, priority: 'medium' },
  { id: "t2", label: "ADMINISTER_ANTIVIRUS_DOSE", completed: false, priority: 'high' },
  { id: "t3", label: "VERIFY_INTEGRITY_LOGS", completed: false, priority: 'low' },
];

const INITIAL_HABITS: Habit[] = [
  { id: "h1", title: "MORNING_MEDITATION", streak: 7, completedToday: false },
  { id: "h2", title: "EXERCISE_ROUTINE", streak: 3, completedToday: false },
  { id: "h3", title: "STUDY_SESSION", streak: 14, completedToday: true },
];

const MAX_HP = 100;

// 優先度別回復量
const HEAL_AMOUNTS: Record<Task['priority'], number> = {
  low: 3,
  medium: 5,
  high: 8,
  critical: 12,
};

export default function DemoPage() {
  // --- State ---
  const [hp, setHp] = useState(80);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isDead, setIsDead] = useState(false);
  const [healMessage, setHealMessage] = useState<string | null>(null);
  const [streakMessage, setStreakMessage] = useState<string | null>(null);

  // 入力フォーム用state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>("medium");
  const [newHabitTitle, setNewHabitTitle] = useState("");

  // --- Effects ---
  useEffect(() => {
    if (hp <= 0) {
      setHp(0);
      setIsDead(true);
    } else {
      setIsDead(false);
    }
  }, [hp]);

  // --- Task Logic ---
  const completeTask = (id: string) => {
    if (isDead) return;

    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;

    // 楽観的更新
    setTasks(prev => prev.filter(t => t.id !== id));

    const healAmount = HEAL_AMOUNTS[task.priority];
    setHp(prev => Math.min(prev + healAmount, MAX_HP));

    setHealMessage(`+${healAmount} HP`);
    setTimeout(() => setHealMessage(null), 2000);
  };

  // --- Habit Logic ---
  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;

      const wasCompleted = h.completedToday;
      const newStreak = wasCompleted ? Math.max(0, h.streak - 1) : h.streak + 1;

      if (!wasCompleted) {
        setStreakMessage(newStreak > 1 ? `🔥 ${newStreak}日連続！` : "✓ 完了！");
        setTimeout(() => setStreakMessage(null), 2000);
      }

      return {
        ...h,
        streak: newStreak,
        completedToday: !wasCompleted,
      };
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `t${Date.now()}`,
      label: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskPriority("medium");
    setShowTaskForm(false);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    const newHabit: Habit = {
      id: `h${Date.now()}`,
      title: newHabitTitle.trim(),
      streak: 0,
      completedToday: false,
    };
    setHabits(prev => [...prev, newHabit]);
    setNewHabitTitle("");
    setShowHabitForm(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateHp = (amount: number) => {
    setHp((prev) => {
      const stored = prev + amount;
      return Math.min(Math.max(stored, 0), MAX_HP);
    });
  };

  // Debug Actions
  const forceKill = () => setHp(0);
  const forceReset = () => {
    setHp(MAX_HP);
    setTasks(INITIAL_TASKS.map(t => ({ ...t, completed: false })));
    setHabits(INITIAL_HABITS.map(h => ({ ...h, completedToday: false })));
    setIsDead(false);
    setShowTaskForm(false);
    setShowHabitForm(false);
  };
  const forceDamage = () => updateHp(-20);

  // --- Render Helpers ---
  const isCritical = hp > 0 && hp <= 29;
  const isWarning = hp >= 30 && hp < 80;

  // Status（characterImageより先に定義する必要あり）
  const getStatus = (): 'ALIVE' | 'DEAD' | 'CRITICAL' => {
    if (isDead) return 'DEAD';
    if (isCritical) return 'CRITICAL';
    return 'ALIVE';
  };

  // Image Selector（characterAssetsモジュールを使用）
  const characterImage = useMemo(() => {
    return getCharacterImageByStatus(DEFAULT_CHARACTER_TYPE, hp, getStatus());
  }, [hp, isDead, isCritical]);

  // Status Text
  const getStatusText = () => {
    if (isDead) return "SYSTEM_FAILURE";
    if (isCritical) return "CRITICAL_ERROR";
    if (isWarning) return "UNSTABLE";
    return "OPERATIONAL";
  };

  // 優先度カラー
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 text-red-400';
      case 'high': return 'border-orange-500 text-orange-400';
      case 'medium': return 'border-cyan-500 text-cyan-400';
      case 'low': return 'border-gray-500 text-gray-400';
    }
  };

  return (
    <>
      <DashboardLayout
        title="HOSTAGE"
        buildVersion="1.1.0"
        mode="DEMO"
        isDead={isDead}
        isCritical={isCritical}
      >
        {/* --- 回復メッセージ --- */}
        {healMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 bg-emerald-900/90 border border-emerald-500 text-emerald-400 text-2xl font-bold tracking-widest animate-bounce">
            {healMessage}
          </div>
        )}

        {/* Subject Name */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-cyan-400 tracking-[0.2em] uppercase">
            SUBJECT: DEMO_UNIT
          </h2>
        </div>

        {/* ========== 培養槽 (StasisChamber) ========== */}
        <div className={`w-full max-w-sm mx-auto ${isCritical ? 'animate-pulse' : ''}`}>
          <StasisChamber
            hp={hp}
            maxHp={MAX_HP}
            imageSrc={characterImage}
            status={getStatus()}
            glowIntensity={isCritical ? 'high' : 'normal'}
          />
        </div>

        {/* ========== HPバー ========== */}
        <div className="mt-6 mb-8">
          <div className="flex justify-between text-xs mb-2 uppercase tracking-widest text-gray-400">
            <span>INTEGRITY (HP)</span>
            <span className={isCritical ? "text-red-500 font-bold" : (isWarning ? "text-yellow-500" : "text-green-500")}>
              {hp} / {MAX_HP}
            </span>
          </div>
          <div className="h-6 md:h-8 w-full bg-gray-900 border border-gray-700 rounded p-[2px]">
            <div
              className={`h-full transition-all duration-500 rounded-sm ${isCritical
                ? "bg-red-600 shadow-[0_0_15px_red]"
                : isWarning
                  ? "bg-yellow-500 shadow-[0_0_10px_yellow]"
                  : "bg-emerald-500 shadow-[0_0_15px_green]"
                }`}
              style={{ width: `${(hp / MAX_HP) * 100}%` }}
            />
          </div>
          <div className="text-center mt-3 text-xs tracking-[0.2em] text-gray-500">
            STATUS: <span className={isCritical ? "text-red-500 glitch-text" : "text-green-500"} data-text={getStatusText()}>{getStatusText()}</span>
          </div>
        </div>

        {/* ========== タスクリスト ========== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-400 tracking-[0.2em] uppercase">
              ACTIVE_TASKS
            </h3>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="px-3 py-1 text-xs border border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 tracking-wider uppercase"
            >
              {showTaskForm ? "CANCEL" : "+ ADD"}
            </button>
          </div>

          {/* タスク追加フォーム */}
          {showTaskForm && (
            <form onSubmit={handleAddTask} className="p-3 border border-cyan-900/50 bg-black/80 space-y-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="ENTER_TASK_NAME..."
                className="w-full px-3 py-2 bg-black border border-cyan-800 text-cyan-300 text-sm font-mono placeholder:text-cyan-900/50 focus:outline-none focus:border-cyan-400"
                maxLength={200}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-600 tracking-widest">PRIORITY:</span>
                <div className="flex gap-1">
                  {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`px-2 py-1 text-[10px] tracking-wider uppercase border transition-colors ${newTaskPriority === p
                        ? getPriorityColor(p)
                        : 'border-gray-700 text-gray-600'
                        }`}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="w-full py-2 border border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 text-xs tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed"
              >
                CREATE_TASK
              </button>
            </form>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-cyan-900/30">
              <div className="text-cyan-800 text-xs tracking-widest">NO_ACTIVE_TASKS</div>
              <div className="text-cyan-900/50 text-[10px] mt-1">CLICK ADD TO CREATE</div>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center gap-3 p-3 border bg-black/60 hover:bg-black/80 transition-colors ${getPriorityColor(task.priority)}`}
                >
                  {/* 完了ボタン */}
                  <button
                    onClick={() => completeTask(task.id)}
                    className="w-6 h-6 border border-current rounded flex items-center justify-center hover:bg-current/20 transition-colors"
                    disabled={isDead}
                  >
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✓</span>
                  </button>

                  {/* タスク情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono truncate">{task.label}</div>
                    <div className="text-[10px] opacity-60 tracking-wider uppercase">
                      {task.priority} | +{HEAL_AMOUNTS[task.priority]} HP
                    </div>
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="w-8 h-8 text-red-600/60 hover:text-red-400 transition-colors flex items-center justify-center"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="text-center text-[10px] text-cyan-900/50 tracking-widest">
              {tasks.length} TASK{tasks.length > 1 ? 'S' : ''} | COMPLETE TO HEAL
            </div>
          )}
        </div>

        {/* ========== 習慣セクション ========== */}
        <div className="space-y-3 mt-8">
          {/* ストリークメッセージ */}
          {streakMessage && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 bg-amber-900/90 border border-amber-500 text-amber-300 text-2xl font-bold tracking-widest animate-bounce">
              {streakMessage}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-400 tracking-[0.2em] uppercase">
                DAILY_HABITS
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-900/50 text-amber-400 tracking-wider">
                🔥 {habits.reduce((sum, h) => sum + h.streak, 0)} TOTAL
              </span>
            </div>
            <button
              onClick={() => setShowHabitForm(!showHabitForm)}
              className="px-3 py-1 text-xs border border-amber-700 text-amber-400 hover:bg-amber-900/30 tracking-wider uppercase"
            >
              {showHabitForm ? "CANCEL" : "+ ADD"}
            </button>
          </div>

          {/* 習慣追加フォーム */}
          {showHabitForm && (
            <form onSubmit={handleAddHabit} className="p-3 border border-amber-900/50 bg-black/80 space-y-3">
              <input
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder="ENTER_HABIT_NAME..."
                className="w-full px-3 py-2 bg-black border border-amber-800 text-amber-300 text-sm font-mono placeholder:text-amber-900/50 focus:outline-none focus:border-amber-400"
                maxLength={100}
                autoFocus
              />
              <button
                type="submit"
                disabled={!newHabitTitle.trim()}
                className="w-full py-2 border border-amber-700 text-amber-400 hover:bg-amber-900/30 text-xs tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed"
              >
                CREATE_HABIT
              </button>
            </form>
          )}

          {habits.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-amber-900/30">
              <div className="text-amber-800 text-xs tracking-widest">NO_HABITS_REGISTERED</div>
              <div className="text-amber-900/50 text-[10px] mt-1">CLICK ADD TO CREATE</div>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`group relative flex items-center gap-3 p-3 border transition-all ${habit.completedToday
                    ? "border-amber-600 bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "border-amber-900/50 bg-black/60 hover:bg-black/80"
                    }`}
                >
                  {/* 完了チェックボックス */}
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-6 h-6 border rounded flex items-center justify-center transition-all ${habit.completedToday
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-amber-700 hover:bg-amber-900/50"
                      }`}
                  >
                    {habit.completedToday && <span className="text-sm font-bold">✓</span>}
                  </button>

                  {/* 習慣情報 */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-mono truncate ${habit.completedToday ? "text-amber-400" : "text-amber-600"}`}>
                      {habit.title}
                    </div>
                  </div>

                  {/* ストリーク表示 */}
                  <div className={`flex items-center gap-1 ${habit.streak >= 30 ? "text-red-400 animate-pulse" :
                    habit.streak >= 7 ? "text-orange-400" :
                      habit.streak >= 3 ? "text-yellow-400" : "text-gray-500"
                    }`}>
                    <span className={habit.streak >= 7 ? "text-xl" : "text-base"}>🔥</span>
                    <span className="text-sm font-bold tracking-wider">{habit.streak}</span>
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="w-8 h-8 text-red-600/60 hover:text-red-400 transition-colors flex items-center justify-center"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}

          {habits.length > 0 && (
            <div className="text-center text-[10px] text-amber-900/50 tracking-widest">
              {habits.length} HABIT{habits.length > 1 ? 'S' : ''} | BUILD YOUR STREAK
            </div>
          )}
        </div>
      </DashboardLayout>

      {/* --- Debug Panel --- */}
      <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/80 border border-gray-800 backdrop-blur-sm rounded text-[10px] font-mono shadow-2xl opacity-50 hover:opacity-100 transition-opacity">
        <div className="mb-2 text-gray-500 uppercase tracking-widest border-b border-gray-700 pb-1">Debug Control</div>
        <div className="flex flex-col gap-2">
          <button onClick={forceDamage} className="px-3 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-900 hover:bg-yellow-900/50 transition-colors uppercase text-left">
            [!] -20 DMG
          </button>
          <button onClick={forceKill} className="px-3 py-1 bg-red-900/30 text-red-500 border border-red-900 hover:bg-red-900/50 transition-colors uppercase text-left">
            [X] KILL
          </button>
          <button onClick={forceReset} className="px-3 py-1 bg-blue-900/30 text-blue-500 border border-blue-900 hover:bg-blue-900/50 transition-colors uppercase text-left">
            [O] RESET
          </button>
        </div>
      </div>
    </>
  );
}
