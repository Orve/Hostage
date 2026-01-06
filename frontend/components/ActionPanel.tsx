import React, { useState } from 'react';
import { completeHabit, syncNotion } from '../lib/api';

interface ActionPanelProps {
  userId: string;
  habitId: string; // MVP: Hardcoded habit ID for testing
  onUpdate: () => void;
}

export default function ActionPanel({ userId, habitId, onUpdate }: ActionPanelProps) {
  console.log("ActionPanel habitId:", habitId); // DEBUG: IDを確認
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await syncNotion(userId);
      setMessage(`Sync: ${res.status} (Damage: ${res.damage_dealt})`);
      onUpdate();
    } catch (e) {
      setMessage("Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleHeal = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await completeHabit(habitId);
      setMessage("Habit Completed! (Healed)");
      onUpdate();
    } catch (e) {
      setMessage("Heal Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSync}
        disabled={loading}
        className="p-4 border border-cyan-900/50 bg-black hover:bg-cyan-900/20 active:bg-cyan-900/40 text-cyan-500 hover:text-cyan-300 transition-all text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <span className="relative z-10">{loading ? 'SYNCING...' : 'SYNC NOTION'}</span>
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <button
        onClick={handleHeal}
        disabled={loading}
        className="p-4 border border-green-900/50 bg-black hover:bg-green-900/20 active:bg-green-900/40 text-green-500 hover:text-green-300 transition-all text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <span className="relative z-10">{loading ? 'PROCESSING...' : 'COMPLETE HABIT'}</span>
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {message && (
        <div className="col-span-2 text-center text-[10px] text-gray-500 mt-4 tracking-widest typewriter">
          &gt; {message}
        </div>
      )}
    </>
  );
}
