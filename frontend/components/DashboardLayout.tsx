"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import SystemGuideModal from "./SystemGuideModal";

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
  const { t } = useTranslation();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 初回アクセス時の自動表示
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      // 少し遅延させて表示（ページロード後のスムーズな体験）
      const timer = setTimeout(() => {
        setIsGuideOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black p-4 md:p-8 flex flex-col items-center justify-center font-mono relative overflow-hidden transition-colors duration-1000 scanlines vignette">

      {/* ========== Help FAB - Fixed in bottom-right corner ========== */}
      <button
        onClick={() => setIsGuideOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-cyan-700 bg-black/95 hover:bg-cyan-900/40 hover:border-cyan-500 text-cyan-500 hover:text-cyan-300 transition-all flex items-center justify-center text-xl md:text-2xl font-black group shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-110"
        aria-label="Help"
        title="System Operation Manual"
      >
        <span className="group-hover:rotate-12 transition-transform duration-300">?</span>
      </button>

      {/* ========== ホラーオーバーレイ（CRITICAL時） ========== */}
      {isCritical && !isDead && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse bg-red-900/10 mix-blend-overlay" />
      )}

      {/* ========== メインコンテンツ ========== */}
      <div className={`
        relative z-10 w-full max-w-lg
        flex flex-col items-center
        transition-all duration-500
        opacity-100
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
            {t('ui.build')}: {buildVersion} | {t('ui.mode')}: {mode}
          </div>
        </header>

        {/* コンテンツ */}
        <div className="w-full">
          {children}
        </div>

        {/* フッター */}
        <div className="mt-16 text-[10px] text-green-900/50 text-center tracking-widest">
          {t('ui.system_status_operational')}<br />
          {t('ui.chamber_interface')}_v{buildVersion}
        </div>
      </div>

      {/* System Guide Modal */}
      <SystemGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </main>
  );
}
