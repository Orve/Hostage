"use client";

import { useEffect, useState } from "react";
import PetDisplay from "../components/PetDisplay";
import ActionPanel from "../components/ActionPanel";
import { fetchPetStatus } from "../lib/api";

// MVP Configuration (In real app, fetch from auth context)
const USER_ID = "YOUR_UUID_HERE"; // ユーザーIDをここにハードコードするか、入力欄を作る
const HABIT_ID = "191a5781-7afd-4874-befb-6b6cf2a7f07e"; // テスト用の習慣ID

export default function Home() {
  const [pet, setPet] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // ローカルストレージとかから取ってもいいが、とりあえず入力させるかハードコード
    // 今回は簡易入力UIをつける
  }, []);

  const loadData = async () => {
    if (!userId) return;
    try {
      const data = await fetchPetStatus(userId);
      setPet(data);
    } catch (e) {
      console.error(e);
      setPet(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-500 p-8 flex flex-col items-center justify-center font-mono scanlines vignette relative">
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-5xl font-black mb-12 tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase">
          HOSTAGE
        </h1>

        {!pet && (
          <div className="mb-4 flex flex-col gap-4 w-full">
            <input
              type="text"
              placeholder="ENTER USER UUID"
              className="p-3 bg-black border border-green-800 text-green-500 text-center tracking-widest placeholder-green-900/50 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all uppercase"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button
              onClick={loadData}
              className="p-2 border border-green-900 hover:bg-green-900/20 text-green-700 hover:text-green-400 transition-colors text-xs tracking-[0.2em] uppercase"
            >
              [ CONNECT SYSTEM ]
            </button>
          </div>
        )}

        {pet && (
          <div className="w-full">
            <PetDisplay pet={pet} />
            <ActionPanel userId={userId} habitId={HABIT_ID} onUpdate={loadData} />
          </div>
        )}

        <div className="mt-16 text-[10px] text-green-900/50 text-center tracking-widest">
          SYSTEM STATUS: UNSTABLE<br />
          MVP BUILD v0.9 (CORRUPTED)
        </div>
      </div>
    </main>
  );
}
