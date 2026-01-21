"use client";

import { useState } from "react";
import StasisChamber from "../../../components/StasisChamber";
import CreatePetForm from "../../../components/CreatePetForm";

/**
 * 開発用デモページ - CreatePetForm & StasisChamber
 * 
 * 認証なしでコンポーネントの動作確認が可能
 */
export default function CreatePetDemo() {
  const [showForm, setShowForm] = useState(true);
  const [demoStage, setDemoStage] = useState<'form' | 'success'>('form');

  // 成功時のコールバック（デモ用）
  const handleSuccess = () => {
    setDemoStage('success');
    setShowForm(false);
  };

  // ページをリセット
  const handleReset = () => {
    setDemoStage('form');
    setShowForm(true);
  };

  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center font-mono scanlines vignette p-4 md:p-8">
      {/* ヘッダー */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase">
          HOSTAGE
        </h1>
        <div className="text-xs text-cyan-700 tracking-[0.3em] mt-2">
          [ DEVELOPMENT_DEMO ]
        </div>
      </div>

      {/* メインコンテンツ */}
      {demoStage === 'form' && showForm && (
        <CreatePetForm
          userId="demo-user-id"
          onSuccess={handleSuccess}
          mockMode={true}
        />
      )}

      {/* 成功画面 */}
      {demoStage === 'success' && (
        <div className="text-center space-y-8">
          {/* 初期化完了の培養槽 */}
          <div className="w-64 mx-auto">
            <StasisChamber
              hp={100}
              imageSrc="/assets/status_normal.png"
              status="ALIVE"
            />
          </div>

          <div className="space-y-4">
            <div className="text-emerald-400 text-2xl font-bold tracking-widest animate-pulse">
              ✓ INITIALIZATION_COMPLETE
            </div>
            <div className="text-cyan-600 text-sm tracking-wider">
              SUBJECT_NOW_ACTIVE
            </div>

            {/* リセットボタン */}
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-3 border-2 border-cyan-800 bg-black hover:bg-cyan-900/20 text-cyan-400 text-sm tracking-widest uppercase transition-all"
            >
              [ RESET_DEMO ]
            </button>
          </div>
        </div>
      )}

      {/* StasisChamber ステータス別デモ */}
      <div className="mt-12 w-full max-w-4xl">
        <div className="text-center mb-6">
          <div className="text-xs text-green-900 tracking-[0.3em] uppercase border-t border-green-900/30 pt-4">
            STASIS_CHAMBER_STATUS_PREVIEW
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* UNINITIALIZED */}
          <div className="space-y-2">
            <StasisChamber
              hp={100}
              imageSrc="/assets/unnamed.png"
              status="UNINITIALIZED"
            />
            <div className="text-[10px] text-center text-cyan-600 tracking-wider">
              UNINITIALIZED
            </div>
          </div>

          {/* ALIVE */}
          <div className="space-y-2">
            <StasisChamber
              hp={100}
              imageSrc="/assets/status_normal.png"
              status="ALIVE"
            />
            <div className="text-[10px] text-center text-emerald-500 tracking-wider">
              ALIVE (100%)
            </div>
          </div>

          {/* CRITICAL */}
          <div className="space-y-2">
            <StasisChamber
              hp={15}
              imageSrc="/assets/status_critical.png"
              status="CRITICAL"
            />
            <div className="text-[10px] text-center text-red-500 tracking-wider">
              CRITICAL (15%)
            </div>
          </div>

          {/* DEAD */}
          <div className="space-y-2">
            <StasisChamber
              hp={0}
              imageSrc="/assets/status_critical.png"
              status="DEAD"
            />
            <div className="text-[10px] text-center text-gray-500 tracking-wider">
              DEAD (0%)
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-12 text-[10px] text-green-900/50 text-center tracking-widest">
        DEMO_MODE: API_CALLS_WILL_FAIL<br />
        BUILD v1.0.0 (DEV)
      </div>
    </main>
  );
}
