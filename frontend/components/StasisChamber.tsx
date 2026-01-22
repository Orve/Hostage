'use client';

import { useMemo, useState, useEffect } from 'react';

type StasisChamberProps = {
  hp: number;
  maxHp?: number;
  imageSrc: string;
  status: 'ALIVE' | 'DEAD' | 'CRITICAL' | 'UNINITIALIZED';
  // インタラクション用のオプション
  glowIntensity?: 'low' | 'normal' | 'high';
  // 誕生シーケンス用のオプション
  fillLevel?: number;           // 0-100: 培養液の充填レベル（省略時は100）
  characterVisible?: boolean;   // キャラクターの表示状態（省略時はtrue）
  characterOpacity?: number;    // キャラクターの透明度（0-1、省略時は1）
};

/**
 * Visual Decay Stage - HPに応じた劣化段階（5段階）
 * Stage 1: Pristine (HP 90-100) - 最高の状態、エメラルド発光
 * Stage 2: Healthy (HP 70-89) - 健康、緑色
 * Stage 3: Caution (HP 40-69) - 注意、黄色、走査線
 * Stage 4: Danger (HP 10-39) - 危険、赤、ノイズ、ビネット
 * Stage 5: Critical (HP 0-9) - 瀕死、グレー/赤黒、高速明滅
 */
type DecayStage = 'pristine' | 'healthy' | 'caution' | 'danger' | 'critical';

/**
 * HPから劣化段階を判定する（5段階）
 */
const getDecayStage = (hp: number): DecayStage => {
  if (hp >= 90) return 'pristine';  // Emerald (90-100)
  if (hp >= 70) return 'healthy';   // Green (70-89)
  if (hp >= 40) return 'caution';   // Yellow (40-69)
  if (hp >= 10) return 'danger';    // Red (10-39)
  return 'critical';                 // Critical (0-9)
};

/**
 * 劣化段階に応じた画像フィルターを返す
 * CSSのfilterプロパティに直接適用可能な文字列
 */
const getDecayFilters = (hp: number, status: string): string => {
  // 未初期化・死亡時は既存のフィルターを優先
  if (status === 'UNINITIALIZED') {
    return 'grayscale(20%) brightness(0.9) hue-rotate(180deg) saturate(0.8)';
  }
  if (status === 'DEAD') {
    return 'grayscale(100%) contrast(1.3) brightness(0.5)';
  }

  const stage = getDecayStage(hp);
  switch (stage) {
    case 'pristine':
      // Stage 1: 最高の状態、輝いている
      return 'brightness(1.15) saturate(1.2) contrast(1.05)';
    case 'healthy':
      // Stage 2: 健康、わずかに明るい
      return 'brightness(1.05) saturate(1.1)';
    case 'caution':
      // Stage 3: 彩度低下、わずかに暗く
      return 'saturate(0.75) brightness(0.9)';
    case 'danger':
      // Stage 4: ぼかし、暗い、セピア、高コントラスト
      return 'blur(1px) brightness(0.75) sepia(0.5) contrast(1.25)';
    case 'critical':
      // Stage 5: 激しいぼかし、非常に暗い、高コントラスト、グレースケール
      return 'blur(2px) brightness(0.5) contrast(1.5) grayscale(0.8)';
  }
};

/**
 * 劣化段階に応じたドロップシャドウクラスを返す（Tailwind CSS）
 */
const getDecayGlow = (hp: number, status: string): string => {
  if (status === 'UNINITIALIZED' || status === 'DEAD') return '';

  const stage = getDecayStage(hp);
  switch (stage) {
    case 'pristine':
      // 神聖なエメラルドの強い発光
      return 'drop-shadow-[0_0_25px_rgba(16,185,129,0.7)] drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]';
    case 'healthy':
      // 緑色の安定した発光
      return 'drop-shadow-[0_0_20px_rgba(34,197,94,0.5)] drop-shadow-[0_0_35px_rgba(34,197,94,0.25)]';
    case 'caution':
      // 黄色がかった警告色
      return 'drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]';
    case 'danger':
      // 赤みがかった危険な発光
      return 'drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    case 'critical':
      // 不安定で不気味な赤黒い発光
      return 'drop-shadow-[0_0_25px_rgba(127,29,29,0.6)] drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]';
  }
};

/**
 * StasisChamber - 培養槽コンポーネント
 *
 * 3層のレイヤー構造で、サイバーパンク・ホラーな培養槽を表現。
 * - Layer 1: Background (流体・気泡・生命維持装置)
 * - Layer 2: Subject (キャラクター画像)
 * - Layer 3: Foreground (ガラス・UI・エフェクト + Visual Decay)
 */
export default function StasisChamber({
  hp,
  maxHp = 100,
  imageSrc,
  status,
  glowIntensity = 'normal',
  fillLevel = 100,
  characterVisible = true,
  characterOpacity = 1,
}: StasisChamberProps) {
  // HP比率を計算
  const hpRatio = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  // 劣化段階を計算
  const decayStage = useMemo(() => getDecayStage(hpRatio), [hpRatio]);

  // HPに応じた流体の色を決定（5段階対応）
  const fluidColor = useMemo(() => {
    if (status === 'UNINITIALIZED') {
      return 'bg-cyan-950/60'; // 未初期化はシアン（待機状態）
    } else if (status === 'DEAD' || hpRatio === 0) {
      return 'bg-gray-900'; // 死亡時は暗黒
    } else if (hpRatio >= 90) {
      return 'bg-emerald-800/70'; // Pristine: 明るいエメラルド
    } else if (hpRatio >= 70) {
      return 'bg-green-900/65'; // Healthy: 緑色
    } else if (hpRatio >= 40) {
      return 'bg-yellow-800/60'; // Caution: 黄色
    } else if (hpRatio >= 10) {
      return 'bg-red-900/70'; // Danger: 赤
    } else {
      return 'bg-red-950/80'; // Critical: 深い赤黒
    }
  }, [hpRatio, status]);

  // HPに応じた発光色（5段階対応）
  const glowColor = useMemo(() => {
    if (status === 'UNINITIALIZED') {
      // glowIntensityに応じて明滅の強度を変える
      if (glowIntensity === 'high') {
        return 'shadow-cyan-400/80';
      } else if (glowIntensity === 'low') {
        return 'shadow-cyan-700/30';
      }
      return 'shadow-cyan-500/50';
    } else if (status === 'DEAD' || hpRatio === 0) {
      return 'shadow-gray-950';
    } else if (hpRatio >= 90) {
      return 'shadow-emerald-400/60'; // Pristine
    } else if (hpRatio >= 70) {
      return 'shadow-green-500/50'; // Healthy
    } else if (hpRatio >= 40) {
      return 'shadow-yellow-500/45'; // Caution
    } else if (hpRatio >= 10) {
      return 'shadow-red-500/50'; // Danger
    } else {
      return 'shadow-red-700/60'; // Critical
    }
  }, [hpRatio, status, glowIntensity]);

  // 気泡生成（12個の決定論的な気泡 - Hydration対応）
  // シード値ベースの擬似乱数で、サーバーとクライアントで同じ値を生成
  const bubbles = useMemo(() => {
    // 簡易的なシードベースの擬似乱数生成器
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: seededRandom(i * 1.1) * 90 + 5, // 5-95%
      size: seededRandom(i * 2.2) * 20 + 10, // 10-30px
      delay: seededRandom(i * 3.3) * 5, // 0-5s
      duration: seededRandom(i * 4.4) * 6 + 4, // 4-10s
    }));
  }, []);

  // クライアントサイドでマウント完了したかどうか（Hydration対応）
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Visual Decay用のフィルター
  const decayFilter = useMemo(() => getDecayFilters(hpRatio, status), [hpRatio, status]);
  const decayGlow = useMemo(() => getDecayGlow(hpRatio, status), [hpRatio, status]);

  // 液体充填レベルのクリップパス計算（下から上へ充填）
  const fluidClipPath = useMemo(() => {
    const fillPercent = Math.max(0, Math.min(100, fillLevel));
    return `inset(${100 - fillPercent}% 0 0 0)`;
  }, [fillLevel]);

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg border border-gray-800 shadow-2xl">
      {/* ========== Layer 1: BACKGROUND (Fluid & Bubbles) ========== */}
      {/* 空の培養槽（背景） */}
      <div className="absolute inset-0 bg-gray-950" />

      {/* 充填される液体（fillLevelに応じてクリップ） */}
      <div
        className={`absolute inset-0 ${fluidColor} transition-all duration-500`}
        style={{ clipPath: fluidClipPath }}
      >
        {/* 流体の明滅（Pulse） */}
        <div className={`absolute inset-0 animate-fluid-pulse ${glowColor}`} />

        {/* 気泡（Bubbles） - クライアントマウント後かつ液体が50%以上充填されている場合のみ表示 */}
        {isMounted && status !== 'DEAD' && fillLevel >= 50 && bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute bottom-0 rounded-full bg-white/20 backdrop-blur-sm animate-bubble-rise"
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
            }}
          />
        ))}

        {/* 流体の質感（グラデーション） */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

        {/* 液面の反射効果（充填中にのみ視覚的に強調） */}
        {fillLevel < 100 && fillLevel > 0 && (
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"
            style={{ top: `${100 - fillLevel}%` }}
          />
        )}
      </div>

      {/* ========== Layer 2: SUBJECT (Character) ========== */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={imageSrc}
          alt="Subject"
          className={`
            w-full h-full object-contain scale-125
            ${status === 'DEAD' ? '' : 'animate-float'}
            ${decayStage === 'critical' && status !== 'DEAD' ? 'animate-decay-flicker' : ''}
            ${decayGlow}
            transition-all duration-1000
          `}
          style={{
            filter: decayFilter,
            transformStyle: 'preserve-3d',
            opacity: characterVisible ? characterOpacity : 0,
            transform: characterVisible ? 'scale(1.25)' : 'scale(0.8)',
          }}
        />
      </div>

      {/* ========== Layer 3: FOREGROUND (Glass & UI & Visual Decay) ========== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* ガラスの反射 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30" />

        {/* ========== Visual Decay Overlays ========== */}

        {/* Stage 2 (Caution): 薄い走査線 */}
        {decayStage === 'caution' && status !== 'DEAD' && status !== 'UNINITIALIZED' && (
          <div className="absolute inset-0 decay-scanlines opacity-40 transition-opacity duration-1000" />
        )}

        {/* Stage 3 (Danger): ノイズオーバーレイ + 強化ビネット */}
        {decayStage === 'danger' && status !== 'DEAD' && status !== 'UNINITIALIZED' && (
          <>
            <div className="absolute inset-0 decay-noise opacity-30 transition-opacity duration-1000" />
            <div className="absolute inset-0 decay-vignette-heavy transition-opacity duration-1000" />
          </>
        )}

        {/* Stage 4 (Critical): 血のようなオーバーレイ + 激しいノイズ + 高速明滅 */}
        {decayStage === 'critical' && status !== 'DEAD' && status !== 'UNINITIALIZED' && (
          <>
            {/* 赤黒い血のようなオーバーレイ */}
            <div className="absolute inset-0 bg-red-900/30 mix-blend-overlay animate-decay-pulse transition-opacity duration-1000" />
            {/* 激しいノイズ */}
            <div className="absolute inset-0 decay-noise-heavy opacity-50 animate-decay-flicker transition-opacity duration-1000" />
            {/* 極端なビネット */}
            <div className="absolute inset-0 decay-vignette-extreme transition-opacity duration-1000" />
            {/* 色ズレ効果（Chromatic Aberration的な赤い縁） */}
            <div className="absolute inset-0 border-4 border-red-800/50 animate-decay-pulse transition-opacity duration-1000" />
          </>
        )}

        {/* 標準ビネット効果 */}
        <div className={`absolute inset-0 bg-radial-gradient-vignette ${decayStage === 'danger' || decayStage === 'critical' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`} />

        {/* CRTスキャンライン（常時表示、劣化時は強調） */}
        <div className={`absolute inset-0 scanlines ${decayStage === 'critical' ? 'opacity-50' : 'opacity-30'} transition-opacity duration-1000`} />

        {/* 瀕死時のグリッチ効果（status === 'CRITICAL'用、decayStageとは別） */}
        {status === 'CRITICAL' && (
          <>
            <div className="absolute inset-0 bg-red-500/10 animate-glitch-flicker" />
            <div className="absolute inset-0 border-2 border-red-500 animate-critical-pulse opacity-50" />
          </>
        )}

        {/* 死亡時のオーバーレイ */}
        {status === 'DEAD' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-red-500 text-4xl font-bold tracking-wider animate-pulse">
              ✝ DECEASED ✝
            </div>
          </div>
        )}

        {/* 培養槽のフレーム装飾 */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${decayStage === 'critical' ? 'via-red-500' : 'via-cyan-500'} to-transparent opacity-50 transition-colors duration-1000`} />
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${decayStage === 'critical' ? 'via-red-500' : 'via-cyan-500'} to-transparent opacity-50 transition-colors duration-1000`} />
        <div className={`absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent ${decayStage === 'critical' ? 'via-red-500' : 'via-cyan-500'} to-transparent opacity-50 transition-colors duration-1000`} />
        <div className={`absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent ${decayStage === 'critical' ? 'via-red-500' : 'via-cyan-500'} to-transparent opacity-50 transition-colors duration-1000`} />
      </div>

      {/* ========== ステータス表示 ========== */}
      <div className={`absolute top-2 left-2 text-xs font-mono bg-black/60 px-2 py-1 rounded border backdrop-blur-sm transition-colors duration-1000 ${decayStage === 'critical' ? 'text-red-400 border-red-500/50' :
        decayStage === 'danger' ? 'text-red-400 border-red-500/30' :
          decayStage === 'caution' ? 'text-yellow-400 border-yellow-500/30' :
            decayStage === 'healthy' ? 'text-green-400 border-green-500/30' :
              'text-emerald-400 border-emerald-500/30'
        }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status === 'UNINITIALIZED' ? 'bg-cyan-400 animate-pulse' :
            status === 'DEAD' ? 'bg-gray-500' :
              decayStage === 'pristine' ? 'bg-emerald-400 animate-pulse' :
                decayStage === 'healthy' ? 'bg-green-400 animate-pulse' :
                  decayStage === 'caution' ? 'bg-yellow-400 animate-pulse' :
                    decayStage === 'danger' ? 'bg-red-500 animate-pulse' :
                      'bg-red-500 animate-decay-flicker'
            }`} />
          {status === 'UNINITIALIZED' ? (
            <span className="text-cyan-400">HP: ---/---</span>
          ) : (
            <span>HP: {hp}/{maxHp}</span>
          )}
        </div>
        <div className="text-[10px] opacity-70 mt-0.5">
          STATUS: {status} {status !== 'DEAD' && status !== 'UNINITIALIZED' && `[${decayStage.toUpperCase()}]`}
        </div>
      </div>
    </div>
  );
}
