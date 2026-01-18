"use client";

import { useEffect, useState } from "react";
import PetDisplay from "../components/PetDisplay";
import ActionPanel from "../components/ActionPanel";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthProvider";
import { fetchPetStatus } from "../lib/api";
import SystemError from "../components/SystemError";

// テスト用の習慣ID（後でデータベースから取得するように変更予定）
const HABIT_ID = "191a5781-7afd-4874-befb-6b6cf2a7f07e";

type Pet = {
  name: string;
  hp: number;
  max_hp: number;
  status: 'ALIVE' | 'DEAD';
  infection_level: number;
};

export default function Home() {
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchPetStatus(user.id);
      setPet(data);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to load pet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Show error state if data fetch failed
  if (error) {
    return (
      <AuthGuard>
        <SystemError
          title="DATA_CORRUPTION"
          message={error}
          onRetry={loadData}
        />
      </AuthGuard>
    );
  }

  const isDead = pet?.status === 'DEAD' || (pet && pet.hp <= 0);

  return (
    <AuthGuard>
      <main className={`min-h-screen bg-black text-green-500 p-8 flex flex-col items-center justify-center font-mono scanlines vignette relative overflow-hidden transition-colors duration-1000`}>
        <div className={`relative z-10 w-full max-w-lg flex flex-col items-center transition-all duration-500 ${isDead ? "opacity-0" : "opacity-100"}`}>
          <h1 className="text-5xl font-black mb-12 tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase">
            HOSTAGE
          </h1>

          {loading ? (
            <div className="text-center">
              <div className="text-green-500 text-xl tracking-[0.3em] uppercase animate-pulse mb-4">
                LOADING_SYSTEM
              </div>
              <div className="text-green-900 text-xs tracking-widest">
                [ PLEASE_WAIT ]
              </div>
            </div>
          ) : pet ? (
            <div className="w-full">
              <PetDisplay pet={pet} />
              <ActionPanel userId={user?.id || ""} habitId={HABIT_ID} onUpdate={loadData} />
            </div>
          ) : (
            <div className="text-center">
              <div className="text-yellow-500 text-lg tracking-widest uppercase mb-2">
                NO_PET_FOUND
              </div>
              <div className="text-yellow-900 text-xs tracking-wider">
                Create a pet to begin monitoring
              </div>
            </div>
          )}

          <div className="mt-16 text-[10px] text-green-900/50 text-center tracking-widest">
            SYSTEM STATUS: OPERATIONAL<br />
            BUILD v1.0.0 (AUTHENTICATED)
          </div>
        </div>

        {/* Death State: SIGNAL LOST */}
        {isDead && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
            {/* Static Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-20 pointer-events-none mix-blend-screen" />

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-red-600 tracking-wide md:tracking-widest uppercase glitch-text animate-pulse relative z-10 px-4" data-text="SIGNAL_LOST">
              SIGNAL LOST
            </h1>
            <div className="mt-8 text-xs text-red-800 tracking-[0.3em] md:tracking-[1em] font-mono animate-bounce px-4">
              CONNECTION_TERMINATED_BY_HOST
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
