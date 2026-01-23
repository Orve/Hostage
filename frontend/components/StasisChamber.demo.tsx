'use client';

import { useState, useMemo } from 'react';
import StasisChamber from './StasisChamber';
import { getCharacterImageByStatus, DEFAULT_CHARACTER_TYPE } from '@/lib/characterAssets';

/**
 * StasisChamber Demo Component
 *
 * 培養槽コンポーネントの使用例とテストページ
 * characterAssetsモジュールによる動的画像切り替えのデモ
 */
export default function StasisChamberDemo() {
  const [hp, setHp] = useState(80);
  const [status, setStatus] = useState<'ALIVE' | 'DEAD' | 'CRITICAL'>('ALIVE');

  // HPに基づいてステータスを自動更新
  const updateStatus = (newHp: number) => {
    setHp(newHp);
    if (newHp === 0) {
      setStatus('DEAD');
    } else if (newHp < 20) {
      setStatus('CRITICAL');
    } else {
      setStatus('ALIVE');
    }
  };

  // HP・ステータスに応じて動的に画像を切り替え
  const characterImage = useMemo(() => {
    return getCharacterImageByStatus(DEFAULT_CHARACTER_TYPE, hp, status);
  }, [hp, status]);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* タイトル */}
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 glitch-text" data-text="STASIS CHAMBER">
          STASIS CHAMBER
        </h1>
        <p className="text-sm text-gray-400 mb-8 font-mono">
          培養槽システム - 実験体監視インターフェース
        </p>

        {/* デモグリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* メイン培養槽 */}
          <div className="lg:col-span-2">
            <StasisChamber
              hp={hp}
              maxHp={100}
              imageSrc={characterImage}
              status={status}
            />
          </div>

          {/* コントロールパネル */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4">
              <h2 className="text-cyan-400 text-lg font-bold mb-4 font-mono">
                CONTROL PANEL
              </h2>

              {/* HPスライダー */}
              <div className="space-y-2 mb-4">
                <label className="text-sm text-gray-400 font-mono">
                  HP: {hp}/100
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hp}
                  onChange={(e) => updateStatus(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* ステータスボタン */}
              <div className="space-y-2 mb-4">
                <label className="text-sm text-gray-400 font-mono block mb-2">
                  STATUS OVERRIDE:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setStatus('ALIVE')}
                    className={`px-3 py-2 text-xs font-mono rounded transition ${status === 'ALIVE'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                  >
                    ALIVE
                  </button>
                  <button
                    onClick={() => setStatus('CRITICAL')}
                    className={`px-3 py-2 text-xs font-mono rounded transition ${status === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                  >
                    CRITICAL
                  </button>
                  <button
                    onClick={() => setStatus('DEAD')}
                    className={`px-3 py-2 text-xs font-mono rounded transition ${status === 'DEAD'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                  >
                    DEAD
                  </button>
                </div>
              </div>

              {/* プリセットボタン */}
              <div className="border-t border-gray-700 pt-4">
                <label className="text-sm text-gray-400 font-mono block mb-2">
                  QUICK PRESETS:
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => updateStatus(100)}
                    className="w-full px-3 py-2 text-xs font-mono rounded bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 transition"
                  >
                    ⚡ FULL HEALTH
                  </button>
                  <button
                    onClick={() => updateStatus(50)}
                    className="w-full px-3 py-2 text-xs font-mono rounded bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 transition"
                  >
                    ⚠️ DAMAGED
                  </button>
                  <button
                    onClick={() => updateStatus(15)}
                    className="w-full px-3 py-2 text-xs font-mono rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                  >
                    ☠️ CRITICAL
                  </button>
                  <button
                    onClick={() => updateStatus(0)}
                    className="w-full px-3 py-2 text-xs font-mono rounded bg-gray-900/50 text-gray-400 hover:bg-gray-800 transition"
                  >
                    ✝ TERMINATED
                  </button>
                </div>
              </div>
            </div>

            {/* ステータス情報 */}
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4">
              <h2 className="text-cyan-400 text-sm font-bold mb-2 font-mono">
                SYSTEM STATUS
              </h2>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">HP Ratio:</span>
                  <span className="text-cyan-300">{hp}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fluid State:</span>
                  <span className={`${status === 'ALIVE' ? 'text-emerald-400' :
                    status === 'CRITICAL' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                    {status === 'ALIVE' ? 'STABLE' :
                      status === 'CRITICAL' ? 'UNSTABLE' :
                        'INACTIVE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Life Support:</span>
                  <span className={`${status === 'DEAD' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {status === 'DEAD' ? 'OFFLINE' : 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 複数の培養槽を並べた例 */}
        <div className="border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-mono">
            MULTIPLE SUBJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. HEALTHY */}
            <div>
              <div className="text-center text-xs font-mono text-emerald-500 mb-2">HEALTHY (100%)</div>
              <StasisChamber
                hp={100}
                maxHp={100}
                imageSrc={getCharacterImageByStatus(DEFAULT_CHARACTER_TYPE, 100, 'ALIVE')}
                status="ALIVE"
              />
            </div>

            {/* 2. CAUTION */}
            <div>
              <div className="text-center text-xs font-mono text-yellow-500 mb-2">CAUTION (60%)</div>
              <StasisChamber
                hp={60}
                maxHp={100}
                imageSrc={getCharacterImageByStatus(DEFAULT_CHARACTER_TYPE, 60, 'ALIVE')}
                status="ALIVE"
              />
            </div>

            {/* 3. DANGER */}
            <div>
              <div className="text-center text-xs font-mono text-orange-500 mb-2">DANGER (30%)</div>
              <StasisChamber
                hp={30}
                maxHp={100}
                imageSrc={getCharacterImageByStatus(DEFAULT_CHARACTER_TYPE, 30, 'ALIVE')}
                status="ALIVE"
              />
            </div>

            {/* 4. CRITICAL */}
            <div>
              <div className="text-center text-xs font-mono text-red-500 mb-2">CRITICAL (10%)</div>
              <StasisChamber
                hp={10}
                maxHp={100}
                imageSrc={getCharacterImageByStatus(DEFAULT_CHARACTER_TYPE, 10, 'CRITICAL')}
                status="CRITICAL"
              />
            </div>
          </div>
        </div>

        {/* 使用方法 */}
        <div className="mt-8 bg-gray-900 border border-cyan-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-3 font-mono">
            USAGE EXAMPLE
          </h2>
          <pre className="text-xs text-gray-300 overflow-x-auto bg-black/50 p-4 rounded">
            {`import StasisChamber from '@/components/StasisChamber';

<StasisChamber
  hp={80}
  maxHp={100}
  imageSrc="/path/to/character.png"
  status="ALIVE"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
