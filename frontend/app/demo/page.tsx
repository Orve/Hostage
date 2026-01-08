"use client";

import React, { useState, useEffect } from "react";

// --- Mock Data & Types ---
type Habit = {
  id: string;
  label: string;
  completed: boolean;
};

const INITIAL_HABITS: Habit[] = [
  { id: "h1", label: "NIGHTLY_BACKUP_ROUTINE", completed: false },
  { id: "h2", label: "ADMINISTER_ANTIVIRUS_DOSE", completed: false },
  { id: "h3", label: "VERIFY_INTEGRITY_LOGS", completed: false },
];

const MAX_HP = 100;

export default function DemoPage() {
  // --- State ---
  const [hp, setHp] = useState(80);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isDead, setIsDead] = useState(false);

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
  const toggleHabit = (id: string) => {
    if (isDead) return; // Dead men tell no tales

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newState = !h.completed;
          // Effect: Heal or Damage
          updateHp(newState ? 10 : -10);
          return { ...h, completed: newState };
        }
        return h;
      })
    );
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
    setHabits(INITIAL_HABITS.map(h => ({ ...h, completed: false })));
    setIsDead(false);
  };
  const forceDamage = () => updateHp(-20);

  // --- Render Helpers ---
  const isCritical = hp > 0 && hp <= 30;

  // Status Text
  const getStatusText = () => {
    if (isDead) return "SYSTEM FAILURE";
    if (isCritical) return "CRITICAL ERROR";
    if (hp < 60) return "UNSTABLE";
    return "OPERATIONAL";
  };

  return (
    <main className={`
      min-h-screen p-8 flex flex-col items-center justify-center font-mono relative overflow-hidden transition-colors duration-1000
      ${isDead ? "bg-gray-900" : "bg-black"}
      scanlines vignette
    `}>
      {/* --- Horror Overlay Effects --- */}
      {isCritical && !isDead && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse bg-red-900/10 mix-blend-overlay" />
      )}
      {isDead && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-10 mix-blend-overlay" />
      )}

      {/* --- Main Interface --- */}
      <div className={`relative z-10 w-full max-w-2xl transition-all duration-500 ${isDead ? "grayscale blur-sm" : ""}`}>

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className={`text-4xl font-black tracking-[0.3em] uppercase mb-2 ${isCritical ? "text-red-600 glitch-text" : "text-green-500"}`} data-text="HOSTAGE_DEMO">
            HOSTAGE_DEMO
          </h1>
          <div className="text-xs tracking-widest text-gray-500">
            BUILD: 0.9.9 (MOCK) | USER: DEMO_ADMIN
          </div>
        </header>

        {/* Character Visual */}
        <div className="flex justify-center mb-12">
          <div className={`
              w-48 h-48 border-4 rounded-full flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300
              ${isDead
              ? "border-gray-600 bg-gray-800 text-gray-500"
              : isCritical
                ? "border-red-600 bg-red-900/20 text-red-500 animate-[pulse_0.2s_ease-in-out_infinite]"
                : "border-green-500 bg-green-900/10 text-green-500"
            }
            `}>
            {isDead ? "💀" : isCritical ? "👾" : "🥚"}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-xs mb-2 uppercase tracking-widest text-gray-400">
            <span>Integrity (HP)</span>
            <span className={isCritical ? "text-red-500 font-bold" : "text-green-500"}>{hp} / {MAX_HP}</span>
          </div>
          <div className="h-6 w-full bg-gray-900 border border-gray-700 rounded p-[2px]">
            <div
              className={`h-full transition-all duration-300 ${isCritical ? "bg-red-600 shadow-[0_0_10px_red]" : "bg-green-500 shadow-[0_0_10px_green]"}`}
              style={{ width: `${(hp / MAX_HP) * 100}%` }}
            />
          </div>
          <div className="text-center mt-4 text-xs tracking-[0.5em] text-gray-500">
            STATUS: <span className={isCritical ? "text-red-500 glitch-text" : "text-green-500"} data-text={getStatusText()}>{getStatusText()}</span>
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-gray-500 border-b border-gray-800 pb-2 mb-4">
            [ MAINTAIN_ROUTINE ]
          </h2>
          {habits.map((habit) => (
            <label
              key={habit.id}
              className={`
                 flex items-center p-4 border border-gray-800 bg-black/50 cursor-pointer hover:bg-gray-900 transition-all group
                 ${habit.completed ? "opacity-50 grayscale" : "opacity-100"}
               `}
            >
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => toggleHabit(habit.id)}
                className="mr-4 w-5 h-5 accent-green-500 cursor-pointer"
                disabled={isDead}
              />
              <span className={`font-mono text-sm tracking-widest ${habit.completed ? "line-through text-gray-600" : "text-green-400 group-hover:text-green-300"}`}>
                {habit.label}
              </span>
            </label>
          ))}
        </div>

      </div>

      {/* --- Dead Screen Overlay --- */}
      {isDead && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-8xl font-black text-red-600 tracking-widest uppercase opacity-20 glitch-text" data-text="FATAL_ERROR">
            FATAL
          </h1>
          <p className="text-red-600 mt-4 tracking-[1em] text-xs uppercase animate-pulse">Connection Lost</p>
        </div>
      )}

      {/* --- Debug Panel (Bottom Right) --- */}
      <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/80 border border-gray-800 backdrop-blur-sm rounded text-[10px] font-mono shadow-2xl">
        <div className="mb-2 text-gray-500 uppercase tracking-widest border-b border-gray-700 pb-1">Debug Control</div>
        <div className="flex flex-col gap-2">
          <button onClick={forceDamage} className="px-3 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-900 hover:bg-yellow-900/50 transition-colors uppercase text-left">
            [!]-20 DMG
          </button>
          <button onClick={forceKill} className="px-3 py-1 bg-red-900/30 text-red-500 border border-red-900 hover:bg-red-900/50 transition-colors uppercase text-left">
            [X] KILL
          </button>
          <button onClick={forceReset} className="px-3 py-1 bg-blue-900/30 text-blue-500 border border-blue-900 hover:bg-blue-900/50 transition-colors uppercase text-left">
            [O] RESET
          </button>
        </div>
        <div className="mt-2 text-gray-700 text-[9px] text-right">
          MVP_DEMO_MODE
        </div>
      </div>

    </main>
  );
}
