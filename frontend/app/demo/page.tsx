"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

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
    if (isDead) return;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newState = !h.completed;
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
  const isCritical = hp > 0 && hp <= 29;
  const isWarning = hp >= 30 && hp < 80;

  // Image Selector
  const getCharacterImage = () => {
    if (hp >= 80) return "/assets/status_normal.png";
    if (hp >= 30) return "/assets/status_warning.png";
    return "/assets/status_critical.png";
  };

  // Status Text
  const getStatusText = () => {
    if (isDead) return "SYSTEM FAILURE";
    if (isCritical) return "CRITICAL ERROR";
    if (isWarning) return "UNSTABLE";
    return "OPERATIONAL";
  };

  return (
    <main className={`
      min-h-screen p-4 md:p-8 flex flex-col items-center justify-center font-mono relative overflow-hidden transition-colors duration-1000
      ${isDead ? "bg-black" : "bg-black"}
      scanlines vignette
    `}>
      {/* --- Horror Overlay Effects --- */}
      {isCritical && !isDead && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse bg-red-900/10 mix-blend-overlay" />
      )}

      {/* --- Main Interface --- */}
      <div className={`relative z-10 w-full max-w-2xl transition-all duration-500 ${isDead ? "opacity-0" : "opacity-100"}`}>

        {/* Header */}
        <header className="mb-12 text-center px-4">
          <h1 className={`text-2xl md:text-4xl lg:text-5xl font-black tracking-[0.1em] md:tracking-[0.3em] uppercase mb-2 ${isCritical ? "text-red-600 glitch-text" : "text-green-500"}`} data-text="HOSTAGE_DEMO">
            HOSTAGE_DEMO
          </h1>
          <div className="text-xs tracking-widest text-gray-500">
            BUILD: 0.9.9 (MOCK) | USER: DEMO_ADMIN
          </div>
        </header>

        {/* Character Visual */}
        <div className="flex justify-center mb-8 md:mb-12 relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto">
          {/* Character Image Container */}
          <div className={`
                relative w-full h-full rounded-full overflow-hidden border-4 transition-all duration-500
                ${isCritical
              ? "border-red-600 shadow-[0_0_50px_red] bg-red-900/20"
              : isWarning
                ? "border-yellow-600 shadow-[0_0_20px_yellow] brightness-75"
                : "border-green-500 shadow-[0_0_30px_green] bg-green-900/10"
            }
             `}>
            {/* Image with Dynamic Effects */}
            <div className={`
                 w-full h-full relative
                 ${isCritical ? "glitch-heavy" : ""}
                 ${isWarning ? "glitch-occasional" : "animate-pulse"}
               `}>
              {/* Placeholder for actual image if missing, using object-cover */}
              <Image
                src={getCharacterImage()}
                alt="Character Status"
                fill
                className="object-cover"
                priority
                unoptimized // For local assets in mock
              />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-xs mb-2 uppercase tracking-widest text-gray-400">
            <span>Integrity (HP)</span>
            <span className={isCritical ? "text-red-500 font-bold" : (isWarning ? "text-yellow-500" : "text-green-500")}>{hp} / {MAX_HP}</span>
          </div>
          <div className="h-8 md:h-10 w-full bg-gray-900 border border-gray-700 rounded p-[2px]">
            <div
              className={`h-full transition-all duration-300 
                  ${isCritical ? "bg-red-600 shadow-[0_0_10px_red]" : (isWarning ? "bg-yellow-500 shadow-[0_0_5px_yellow]" : "bg-green-500 shadow-[0_0_10px_green]")}
                `}
              style={{ width: `${(hp / MAX_HP) * 100}%` }}
            />
          </div>
          <div className="text-center mt-4 text-xs tracking-[0.2em] md:tracking-[0.5em] text-gray-500 px-4">
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
                 ${habit.completed ? "opacity-30 grayscale" : "opacity-100"}
               `}
            >
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => toggleHabit(habit.id)}
                className="mr-4 w-6 h-6 sm:w-5 sm:h-5 accent-green-500 cursor-pointer"
                disabled={isDead}
              />
              <span className={`font-mono text-sm tracking-widest ${habit.completed ? "line-through text-gray-600" : "text-green-400 group-hover:text-green-300"}`}>
                {habit.label}
              </span>
            </label>
          ))}
        </div>

      </div>

      {/* --- Death State: SIGNAL LOST --- */}
      {isDead && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          {/* Static Noise Overlay if available, else CSS noise */}
          <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-20 pointer-events-none mix-blend-screen" />

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-red-600 tracking-wide md:tracking-widest uppercase glitch-text animate-pulse relative z-10 px-4" data-text="SIGNAL_LOST">
            SIGNAL LOST
          </h1>
          <div className="mt-8 text-xs text-red-800 tracking-[0.3em] md:tracking-[1em] font-mono animate-bounce px-4">
            CONNECTION_TERMINATED_BY_HOST
          </div>
        </div>
      )}

      {/* --- Debug Panel --- */}
      <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/80 border border-gray-800 backdrop-blur-sm rounded text-[10px] font-mono shadow-2xl opacity-50 hover:opacity-100 transition-opacity">
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
      </div>

    </main>
  );
}
