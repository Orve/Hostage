"use client";

import React, { useMemo } from 'react';
import StasisChamber from './StasisChamber';
import { getCharacterImageByStatus, DEFAULT_CHARACTER_TYPE } from '@/lib/characterAssets';

interface PetProps {
  pet: {
    name: string;
    hp: number;
    max_hp: number;
    status: 'ALIVE' | 'DEAD' | 'CRITICAL';
    infection_level: number;
    id: string; // IDを追加（API呼び出しに必要）
    character_type?: string; // キャラクタータイプ
  } | null;
  onRevive?: () => void; // 親から蘇生関数を受け取る
}

/**
 * PetDisplay - ペット表示コンポーネント
 * 
 * StasisChamber（培養槽）をベースに、Demo のレイアウト要素を統合。
 * HPバー、ステータステキスト、グリッチエフェクトを含む。
 * キャラクター画像はcharacterAssetsモジュールにより動的に切り替え。
 */
export default function PetDisplay({ pet, onRevive }: PetProps) {
  if (!pet) return <div className="text-gray-500">No Active Pet</div>;

  const hpPercent = (pet.hp / pet.max_hp) * 100;
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
    if (isDead) return "SYSTEM_FAILURE";
    if (isCritical) return "CRITICAL_ERROR";
    if (isWarning) return "UNSTABLE";
    return "OPERATIONAL";
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
          SUBJECT: {pet.name.toUpperCase()}
        </h2>
        <div className="text-[10px] text-cyan-700 tracking-widest">
          INFECTION_LEVEL: {pet.infection_level}%
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
      </div>
    </>
  );
}
