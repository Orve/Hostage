'use client';

import { useMemo } from 'react';

type StasisChamberProps = {
  hp: number;
  maxHp?: number;
  imageSrc: string;
  status: 'ALIVE' | 'DEAD' | 'CRITICAL' | 'UNINITIALIZED';
  // インタラクション用のオプション
  glowIntensity?: 'low' | 'normal' | 'high';  // ボタン等の操作で発光を強調
};

/**
 * StasisChamber - 培養槽コンポーネント
 *
 * 3層のレイヤー構造で、サイバーパンク・ホラーな培養槽を表現。
 * - Layer 1: Background (流体・気泡・生命維持装置)
 * - Layer 2: Subject (キャラクター画像)
 * - Layer 3: Foreground (ガラス・UI・エフェクト)
 */
export default function StasisChamber({
  hp,
  maxHp = 100,
  imageSrc,
  status,
  glowIntensity = 'normal',
}: StasisChamberProps) {
  // HP比率を計算
  const hpRatio = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  // HPに応じた流体の色を決定
  const fluidColor = useMemo(() => {
    if (status === 'UNINITIALIZED') {
      return 'bg-cyan-950/60'; // 未初期化はシアン（待機状態）
    } else if (status === 'DEAD' || hpRatio === 0) {
      return 'bg-gray-900'; // 死亡時は暗黒
    } else if (status === 'CRITICAL' || hpRatio < 20) {
      return 'bg-red-900/80'; // 瀕死は深紅
    } else if (hpRatio < 50) {
      return 'bg-amber-800/70'; // 危険は琥珀色
    } else {
      return 'bg-emerald-900/60'; // 健康はエメラルド
    }
  }, [hpRatio, status]);

  // HPに応じた発光色
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
    } else if (status === 'CRITICAL' || hpRatio < 20) {
      return 'shadow-red-500/50';
    } else if (hpRatio < 50) {
      return 'shadow-amber-500/40';
    } else {
      return 'shadow-emerald-500/50';
    }
  }, [hpRatio, status, glowIntensity]);

  // 気泡生成（12個のランダムな気泡）
  const bubbles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 90 + 5, // 5-95%
      size: Math.random() * 20 + 10, // 10-30px
      delay: Math.random() * 5, // 0-5s
      duration: Math.random() * 6 + 4, // 4-10s
    }));
  }, []);

  // キャラクターのフィルター
  const subjectFilter = useMemo(() => {
    if (status === 'UNINITIALIZED') {
      // 未初期化：シアンに色相シフト、少しぼやけた状態
      return 'grayscale(20%) brightness(0.9) hue-rotate(180deg) saturate(0.8)';
    } else if (status === 'DEAD' || hpRatio === 0) {
      return 'grayscale(100%) contrast(1.3) brightness(0.5)';
    } else if (status === 'CRITICAL' || hpRatio < 20) {
      return 'grayscale(30%) contrast(1.2) brightness(0.8) saturate(0.7)';
    }
    return 'none';
  }, [hpRatio, status]);

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg border border-gray-800 shadow-2xl">
      {/* ========== Layer 1: BACKGROUND (Fluid & Bubbles) ========== */}
      <div className={`absolute inset-0 ${fluidColor} transition-colors duration-1000`}>
        {/* 流体の明滅（Pulse） */}
        <div className={`absolute inset-0 animate-fluid-pulse ${glowColor}`} />

        {/* 気泡（Bubbles） */}
        {status !== 'DEAD' && bubbles.map((bubble) => (
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
      </div>

      {/* ========== Layer 2: SUBJECT (Character) ========== */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={imageSrc}
          alt="Subject"
          className={`
            w-full h-full object-contain scale-125
            ${status === 'DEAD' ? '' : 'animate-float'}
            ${status === 'CRITICAL' ? 'animate-pulse' : ''}
            transition-all duration-500
          `}
          style={{
            filter: subjectFilter,
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      {/* ========== Layer 3: FOREGROUND (Glass & UI) ========== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* ガラスの反射 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30" />

        {/* ビネット効果 */}
        <div className="absolute inset-0 bg-radial-gradient-vignette" />

        {/* CRTスキャンライン */}
        <div className="absolute inset-0 scanlines opacity-30" />

        {/* 瀕死時のグリッチ効果 */}
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50" />
      </div>

      {/* ========== ステータス表示 ========== */}
      <div className="absolute top-2 left-2 text-xs font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status === 'UNINITIALIZED' ? 'bg-cyan-400 animate-pulse' :
            status === 'ALIVE' ? 'bg-emerald-400 animate-pulse' :
              status === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
                'bg-gray-500'
            }`} />
          {status === 'UNINITIALIZED' ? (
            <span className="text-cyan-400">HP: ---/---</span>
          ) : (
            <span>HP: {hp}/{maxHp}</span>
          )}
        </div>
        <div className="text-[10px] opacity-70 mt-0.5">
          STATUS: {status}
        </div>
      </div>
    </div>
  );
}
