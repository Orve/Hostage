'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/LanguageContext';

/**
 * InstallPrompt - PWAインストール案内
 *
 * ブラウザモードでのみ表示され、ホーム画面への追加を促す。
 * Standaloneモード（PWAとして起動済み）では自動的に非表示。
 */
export default function InstallPrompt() {
  const { t } = useTranslation();
  const [isStandalone, setIsStandalone] = useState(true); // デフォルトtrue（非表示）
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Standaloneモードかチェック
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // iOS判定（Safari固有のインストール手順表示用）
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // LocalStorageで永続的な非表示設定をチェック
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    // LocalStorageに保存（次回以降も非表示）
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Standaloneモードまたは閉じられた場合は非表示
  if (isStandalone || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-[200] pointer-events-auto"
      >
        <div className="mx-4 mb-4 border-2 border-cyan-700 bg-black/95 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.4)]">
          {/* Header */}
          <div className="border-b border-cyan-900/50 bg-cyan-950/30 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-bold text-cyan-400 tracking-wider uppercase font-mono">
                {t('pwa.system_alert')}
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-cyan-700 hover:text-cyan-400 transition-colors text-xs font-mono"
              aria-label="Close"
            >
              [ X ]
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Main Message */}
            <div className="text-cyan-300 text-xs md:text-sm font-mono leading-relaxed">
              <span className="text-yellow-500">{t('pwa.restricted_mode')}</span>
              <br />
              {t('pwa.browser_shell')} <span className="text-cyan-400 font-bold">{t('pwa.local_shell')}</span> {t('pwa.full_experience')}
            </div>

            {/* Installation Instructions */}
            <div className="border-t border-cyan-900/30 pt-3 space-y-2">
              <div className="text-[10px] text-cyan-500 uppercase tracking-widest font-mono"
                dangerouslySetInnerHTML={{ __html: t('pwa.installation_protocol') }}
              />

              {isIOS ? (
                // iOS instructions
                <div className="text-[11px] text-cyan-400/80 font-mono space-y-1 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600">1.</span>
                    <span>{t('pwa.ios_step1')} <span className="text-cyan-300 font-bold">{t('pwa.ios_share')}</span> {t('pwa.ios_step1_end')} (
                      <svg className="inline w-3 h-3 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                      </svg>
                    )</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600">2.</span>
                    <span>{t('pwa.ios_step2')} <span className="text-cyan-300 font-bold">{t('pwa.ios_add_home')}</span>{t('pwa.ios_step2_end')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600">3.</span>
                    <span>{t('pwa.ios_step3')}</span>
                  </div>
                </div>
              ) : (
                // Android/Chrome instructions
                <div className="text-[11px] text-cyan-400/80 font-mono space-y-1 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600">1.</span>
                    <span>{t('pwa.android_step1')} <span className="text-cyan-300 font-bold">{t('pwa.android_menu')}</span> {t('pwa.android_step1_end')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600">2.</span>
                    <span>{t('pwa.android_step2')} <span className="text-cyan-300 font-bold">{t('pwa.android_add_home')}</span> {t('pwa.android_or')} <span className="text-cyan-300 font-bold">{t('pwa.android_install')}</span></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-600">3.</span>
                    <span>{t('pwa.android_step3')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="border-t border-cyan-900/30 pt-3">
              <div className="text-[10px] text-emerald-500/70 font-mono leading-relaxed">
                {t('pwa.benefit_fullscreen')}
                <br />
                {t('pwa.benefit_loading')}
                <br />
                {t('pwa.benefit_native')}
              </div>
            </div>

            {/* Dismiss Button */}
            <div className="pt-2">
              <button
                onClick={handleDismiss}
                className="w-full py-2 border border-cyan-900/50 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-500 text-[10px] uppercase tracking-widest font-mono transition-all"
              >
                {t('pwa.dismiss')}
              </button>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
