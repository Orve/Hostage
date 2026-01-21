"use client";

import React, { useState, useEffect } from "react";
import StasisChamber from "../../components/StasisChamber";
import DashboardLayout from "../../components/DashboardLayout";

// --- Mock Data & Types ---
type Task = {
  id: string;
  label: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
};

const INITIAL_TASKS: Task[] = [
  { id: "t1", label: "NIGHTLY_BACKUP_ROUTINE", completed: false, priority: 'medium' },
  { id: "t2", label: "ADMINISTER_ANTIVIRUS_DOSE", completed: false, priority: 'high' },
  { id: "t3", label: "VERIFY_INTEGRITY_LOGS", completed: false, priority: 'low' },
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
  const [isDead, setIsDead] = useState(false);
  const [healMessage, setHealMessage] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    if (hp <= 0) {
      setHp(0);
      setIsDead(true);
    } else {
      setIsDead(false);
    }
  }, [hp]);

  // --- Logic ---
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
    setIsDead(false);
  };
  const forceDamage = () => updateHp(-20);
  const addTask = () => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      label: `TASK_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      completed: false,
      priority: (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)],
    };
    setTasks(prev => [...prev, newTask]);
  };

  // --- Render Helpers ---
  const isCritical = hp > 0 && hp <= 29;
  const isWarning = hp >= 30 && hp < 80;

  // Image Selector
  const getCharacterImage = () => {
    if (hp >= 80) return "/assets/status_normal.png";
    if (hp >= 30) return "/assets/status_warning.png";
    return "/assets/status_critical.png";
  };

  // Status
  const getStatus = (): 'ALIVE' | 'DEAD' | 'CRITICAL' => {
    if (isDead) return 'DEAD';
    if (isCritical) return 'CRITICAL';
    return 'ALIVE';
  };

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
            imageSrc={getCharacterImage()}
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
              onClick={addTask}
              className="px-3 py-1 text-xs border border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 tracking-wider uppercase"
            >
              + ADD
            </button>
          </div>

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
