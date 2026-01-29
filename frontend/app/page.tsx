"use client";

import { useEffect, useState } from "react";
import PetDisplay from "../components/PetDisplay";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/AuthProvider";
import { fetchPetStatus, Pet, syncNotion, revivePet } from "../lib/api";
import SystemError from "../components/SystemError";
import CreatePetForm from "../components/CreatePetForm";
import TaskManager from "../components/TaskManager";
import HabitManager from "../components/HabitManager";
import DashboardLayout from "../components/DashboardLayout";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // 初回ロード用（ローディング表示あり）
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

  // 静かに更新（ローディング表示なし、タスク完了時用）
  const refreshPetSilently = async () => {
    if (!user?.id) return;
    try {
      const data = await fetchPetStatus(user.id);
      setPet(data);
    } catch (e) {
      console.error("Silent refresh failed:", e);
      // エラーは静かに無視（楽観的更新の補完なので）
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Notion同期
  const handleSync = async () => {
    if (!user?.id) return;

    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncNotion(user.id);
      setSyncMessage(`SYNC: ${res.status} (DMG: ${res.damage_dealt})`);
      await loadData();
    } catch {
      setSyncMessage("SYNC_FAILED");
    } finally {
      setSyncing(false);
    }
  };

  // 蘇生アクション
  const handleRevive = async () => {
    if (!pet?.id) return;
    try {
      setLoading(true);
      await revivePet(pet.id);
      await loadData(); // データをリロード
    } catch (e) {
      console.error(e);
      setError("FAILED_TO_REVIVE_SUBJECT");
    } finally {
      setLoading(false);
    }
  };

  // 削除アクション（Purge）
  const handlePurge = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // ダイナミックインポートで循環参照を回避しつつAPIを呼ぶ（本来はimport済みでよい）
      const { deletePet } = await import('../lib/api');
      await deletePet(user.id);

      // 成功したらリロードしてオンボーディングへ
      // ルーターの遷移よりもリロードの方が確実に状態をクリアできる
      window.location.reload();
    } catch (e) {
      console.error(e);
      setError("PURGE_FAILED");
      setLoading(false);
    }
  };

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

  // 状態判定（null を false に変換）
  const isDead = (pet?.status === 'DEAD' || (pet && pet.hp <= 0)) ?? false;
  const isCritical = pet ? pet.hp > 0 && pet.hp <= 29 : false;

  return (
    <AuthGuard>
      <DashboardLayout
        title="HOSTAGE"
        buildVersion="1.1.0"
        mode="AUTHENTICATED"
        isDead={isDead}
        isCritical={isCritical}
      >
        {loading ? (
          <div className="text-center py-16">
            <div className="text-cyan-500 text-xl tracking-[0.3em] uppercase animate-pulse mb-4">
              {t('dashboard.loading_system')}
            </div>
            <div className="text-cyan-900 text-xs tracking-widest">
              {t('dashboard.please_wait')}
            </div>
          </div>
        ) : pet ? (
          <div className="w-full">
            <PetDisplay
              pet={pet}
              onRevive={handleRevive}
              onPurge={handlePurge}
            />

            {/* タスク管理 */}
            <TaskManager userId={user?.id || ""} onTaskComplete={refreshPetSilently} />

            {/* 習慣管理 */}
            <HabitManager
              userId={user?.id || ""}
              onHabitComplete={refreshPetSilently}
              onHpChange={(delta: number) => {
                setPet(prev => prev ? {
                  ...prev,
                  hp: Math.min(prev.max_hp, Math.max(0, prev.hp + delta)),
                } : prev);
              }}
            />
          </div>
        ) : (
          <CreatePetForm userId={user?.id || ""} onSuccess={loadData} />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
