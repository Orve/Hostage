"use client";

import React, { useMemo } from 'react';
import StasisChamber from './StasisChamber';
import DeathTimer from './DeathTimer';
import { getCharacterImageByStatus, DEFAULT_CHARACTER_TYPE, getEvolutionStageName } from '@/lib/characterAssets';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface PetProps {
  pet: {
    name: string;
    hp: number;
    max_hp: number;
    status: 'ALIVE' | 'DEAD' | 'CRITICAL';
    infection_level: number;
    hunger?: number;
    mood?: number;
    evolution_stage?: number;
    evolution_path?: 'light' | 'dark' | null;
    id: string;
    character_type?: string;
  } | null;
  onRevive?: () => void;
  onPurge?: () => void;
}

/**
 * PetDisplay - ペット表示コンポーネント
 * 
 * StasisChamber（培養槽）をベースに、Demo のレイアウト要素を統合。
 * HPバー、ステータステキスト、グリッチエフェクトを含む。
 * キャラクター画像はcharacterAssetsモジュールにより動的に切り替え。
 */
export default function PetDisplay({ pet, onRevive, onPurge }: PetProps) {
  const { t } = useTranslation();

  if (!pet) return <div className="text-gray-500">{t('ui.no_active_pet')}</div>;

  const hpPercent = (pet.hp / pet.max_hp) * 100;
  // 以下、変数が消えていたので復元
  const isDead = pet.status === 'DEAD' || pet.hp <= 0;
  const isCritical = pet.hp > 0 && pet.hp <= 29;
  const isWarning = pet.hp >= 30 && pet.hp < 80;

  // ステータス判定
  const getStatus = (): 'ALIVE' | 'DEAD' | 'CRITICAL' => {
    if (isDead) return 'DEAD';
    if (isCritical) return 'CRITICAL';
    return 'ALIVE';
  };

  // ステータステキスト
  const getStatusText = () => {
    if (isDead) return t('status.SYSTEM_FAILURE');
    if (isCritical) return t('status.CRITICAL');
    if (isWarning) return t('status.UNSTABLE');
    return t('status.OPERATIONAL');
  };

  // HP状態別の画像（characterAssetsモジュールを使用）
  const characterImage = useMemo(() => {
    const charType = (pet.character_type as any) || DEFAULT_CHARACTER_TYPE;
    return getCharacterImageByStatus(charType, pet.hp, getStatus());
  }, [pet.hp, pet.status, pet.character_type]);

  return (
    <>
      {/* ========== ホラーオーバーレイ（CRITICAL時） ========== */}
      {isCritical && !isDead && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse bg-red-900/10 mix-blend-overlay" />
      )}

      {/* ========== ペット名表示 ========== */}
      <div className="text-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-cyan-400 tracking-[0.2em] uppercase">
          {t('ui.subject')}: {pet.name.toUpperCase()}
        </h2>
        <div className="text-[10px] text-cyan-700 tracking-widest">
          {t('ui.infection_level')}: {pet.infection_level}%
        </div>
      </div>

      {/* ========== 培養槽（StasisChamber） ========== */}
      <div className={`
        w-full max-w-sm mx-auto
        ${isCritical ? 'animate-pulse' : ''}
      `}>
        <StasisChamber
          hp={pet.hp}
          maxHp={pet.max_hp}
          imageSrc={characterImage}
          status={getStatus()}
          glowIntensity={isCritical ? 'high' : 'normal'}
          onRevive={onRevive}
          onPurge={onPurge}
          characterType={pet.character_type || DEFAULT_CHARACTER_TYPE}
          hunger={pet.hunger ?? 0}
          mood={pet.mood ?? 50}
          corruption={pet.infection_level ?? 0}
          evolutionStage={pet.evolution_stage ?? 0}
          evolutionPath={pet.evolution_path ?? null}
        />
      </div>

      {/* ========== HPバー（Demo スタイル） ========== */}
      <div className="mt-6 mb-8">
        <div className="flex justify-between text-xs mb-2 uppercase tracking-widest text-gray-400">
          <span>INTEGRITY (HP)</span>
          <span className={
            isCritical ? "text-red-500 font-bold" :
              isWarning ? "text-yellow-500" :
                "text-green-500"
          }>
            {pet.hp.toFixed(1)} / {pet.max_hp}
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
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="text-center mt-3 text-xs tracking-[0.2em] md:tracking-[0.3em] text-gray-500">
          STATUS: <span
            className={`
              ${isCritical ? "text-red-500 glitch-text" : ""}
              ${isWarning ? "text-yellow-500" : ""}
              ${!isCritical && !isWarning ? "text-green-500" : ""}
            `}
            data-text={getStatusText()}
          >
            {getStatusText()}
          </span>
        </div>
      </div >

      {/* ========== たまごっちパラメータ ========== */}
      {!isDead && (
        <div className="mb-6 space-y-3 border border-gray-800 rounded p-4 bg-gray-950/60">
          {/* 進化ステージバッジ */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-widest text-gray-500 uppercase">Evolution</span>
            <span className={`text-xs font-bold tracking-widest px-2 py-0.5 rounded ${
              pet.evolution_path === 'light' ? 'text-yellow-300 bg-yellow-900/50 border border-yellow-700/50' :
              pet.evolution_path === 'dark'  ? 'text-purple-300 bg-purple-900/50 border border-purple-700/50' :
              'text-cyan-400 bg-cyan-900/30 border border-cyan-800/40'
            }`}>
              ▶ {getEvolutionStageName(pet.evolution_stage ?? 0, pet.evolution_path ?? null)}
            </span>
          </div>

          {/* HUNGER */}
          <div>
            <div className="flex justify-between text-[10px] mb-1 uppercase tracking-widest">
              <span className="text-orange-400">Hunger</span>
              <span className={`font-mono ${(pet.hunger ?? 0) > 70 ? 'text-red-400' : 'text-orange-300'}`}>
                {Math.round(pet.hunger ?? 0)}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-900 border border-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pet.hunger ?? 0}%`,
                  background: (pet.hunger ?? 0) > 70
                    ? 'linear-gradient(90deg, #f97316, #ef4444)'
                    : 'linear-gradient(90deg, #92400e, #f97316)',
                  boxShadow: (pet.hunger ?? 0) > 70 ? '0 0 8px #ef4444' : 'none',
                }}
              />
            </div>
          </div>

          {/* MOOD */}
          <div>
            <div className="flex justify-between text-[10px] mb-1 uppercase tracking-widest">
              <span className="text-cyan-400">Mood</span>
              <span className={`font-mono ${(pet.mood ?? 50) > 60 ? 'text-cyan-300' : 'text-gray-400'}`}>
                {Math.round(pet.mood ?? 50)}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-900 border border-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pet.mood ?? 50}%`,
                  background: (pet.mood ?? 50) > 60
                    ? 'linear-gradient(90deg, #0891b2, #22d3ee)'
                    : 'linear-gradient(90deg, #374151, #6b7280)',
                  boxShadow: (pet.mood ?? 50) > 60 ? '0 0 8px #22d3ee55' : 'none',
                }}
              />
            </div>
          </div>

          {/* CORRUPT */}
          <div>
            <div className="flex justify-between text-[10px] mb-1 uppercase tracking-widest">
              <span className="text-purple-400">Corrupt</span>
              <span className={`font-mono ${(pet.infection_level ?? 0) > 50 ? 'text-purple-300' : 'text-gray-400'}`}>
                {Math.round(pet.infection_level ?? 0)}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-900 border border-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pet.infection_level ?? 0}%`,
                  background: (pet.infection_level ?? 0) > 50
                    ? 'linear-gradient(90deg, #7c3aed, #c026d3)'
                    : 'linear-gradient(90deg, #3b0764, #7c3aed)',
                  boxShadow: (pet.infection_level ?? 0) > 50 ? '0 0 10px #9333ea88' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========== Death Timer ========== */}
      <DeathTimer hp={pet.hp} isDead={isDead} />
    </>
  );
}
