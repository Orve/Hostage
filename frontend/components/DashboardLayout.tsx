"use client";

import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  /** ヘッダーに表示するタイトル */
  title?: string;
  /** ビルドバージョン表示 */
  buildVersion?: string;
  /** モード表示（AUTHENTICATED, DEMO, etc.） */
  mode?: string;
  /** 死亡状態かどうか */
  isDead?: boolean;
  /** CRITICAL状態かどうか（赤オーバーレイ用） */
  isCritical?: boolean;
}

/**
 * DashboardLayout - 共通ダッシュボードレイアウト
 * 
 * Demo と本番で共通のレイアウト・スタイルを提供。
 * ヘッダー、フッター、ホラーエフェクトを統一。
 */
export default function DashboardLayout({
  children,
  title = "HOSTAGE",
  buildVersion = "1.1.0",
  mode = "AUTHENTICATED",
  isDead = false,
  isCritical = false,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center font-mono relative overflow-hidden transition-colors duration-1000 scanlines vignette">

      {/* ========== ホラーオーバーレイ（CRITICAL時） ========== */}
      {isCritical && !isDead && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse bg-red-900/10 mix-blend-overlay" />
      )}

      {/* ========== メインコンテンツ ========== */}
      <div className={`
        relative z-10 w-full max-w-lg 
        flex flex-col items-center 
        transition-all duration-500 
        ${isDead ? "opacity-0" : "opacity-100"}
      `}>

        {/* ヘッダー */}
        <header className="mb-8 text-center px-4">
          <h1
            className={`
              text-2xl md:text-4xl lg:text-5xl font-black 
              tracking-[0.1em] md:tracking-[0.2em] uppercase mb-2 
              ${isCritical
                ? "text-red-600 glitch-text"
                : "text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              }
            `}
            data-text={title}
          >
            {title}
          </h1>
          <div className="text-xs tracking-widest text-gray-500">
            BUILD: {buildVersion} | MODE: {mode}
          </div>
        </header>

        {/* コンテンツ */}
        <div className="w-full">
          {children}
        </div>

        {/* フッター */}
        <div className="mt-16 text-[10px] text-green-900/50 text-center tracking-widest">
          SYSTEM STATUS: OPERATIONAL<br />
          CHAMBER_INTERFACE_v{buildVersion}
        </div>
      </div>

      {/* ========== 死亡状態: SIGNAL LOST ========== */}
      {isDead && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          {/* Static Noise Overlay */}
          <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-20 pointer-events-none mix-blend-screen" />

          <h1
            className="text-4xl sm:text-6xl md:text-8xl font-black text-red-600 tracking-wide md:tracking-widest uppercase glitch-text animate-pulse relative z-10 px-4"
            data-text="SIGNAL_LOST"
          >
            SIGNAL LOST
          </h1>
          <div className="mt-8 text-xs text-red-800 tracking-[0.3em] md:tracking-[1em] font-mono animate-bounce px-4">
            CONNECTION_TERMINATED_BY_HOST
          </div>
        </div>
      )}
    </main>
  );
}
