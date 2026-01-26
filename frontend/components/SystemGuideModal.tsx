'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface SystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SystemGuideModal - 初回ユーザー向け操作マニュアル
 *
 * アプリのルールと使い方を説明するターミナル風モーダル。
 * 初回アクセス時に自動表示され、ヘルプボタンから再表示可能。
 */
export default function SystemGuideModal({ isOpen, onClose }: SystemGuideModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleAcknowledge = () => {
    // LocalStorageに既読フラグを保存
    localStorage.setItem('hasSeenGuide', 'true');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
            onClick={handleAcknowledge}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-2 border-cyan-700 shadow-[0_0_50px_rgba(6,182,212,0.5)] font-mono">
              {/* Header */}
              <div className="border-b-2 border-cyan-900/50 bg-cyan-950/30 p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <h2 className="text-lg md:text-xl font-black text-cyan-400 tracking-[0.2em] uppercase">
                      {t('guide.title')}
                    </h2>
                  </div>
                  <button
                    onClick={handleAcknowledge}
                    className="text-cyan-700 hover:text-cyan-400 transition-colors text-sm"
                    aria-label="Close"
                  >
                    [ X ]
                  </button>
                </div>
                <div className="text-[10px] text-cyan-700 tracking-widest mt-1">
                  {t('guide.version')}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Warning Banner */}
                <div className="border-2 border-red-900 bg-red-950/20 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-2xl">⚠</span>
                    <div>
                      <div className="text-red-400 font-bold text-sm md:text-base tracking-wider uppercase mb-2">
                        {t('guide.critical_warning')}
                      </div>
                      <div className="text-red-300/80 text-xs md:text-sm leading-relaxed">
                        {t('guide.warning_text')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Objective */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-2">
                    <span className="text-cyan-400 text-lg">▸</span>
                    <h3 className="text-cyan-400 font-bold text-sm md:text-base tracking-wider uppercase">
                      {t('guide.primary_objective')}
                    </h3>
                  </div>
                  <div className="pl-6 text-cyan-300/90 text-xs md:text-sm leading-relaxed">
                    {t('guide.objective_text')} <span className="text-red-400 font-bold">{t('guide.termination_final')}</span>{t('guide.progress_lost')}
                  </div>
                </div>

                {/* Step 1: Register Tasks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-2">
                    <span className="text-emerald-400 font-bold">[ 1 ]</span>
                    <h3 className="text-emerald-400 font-bold text-sm md:text-base tracking-wider uppercase">
                      {t('guide.step1_title')}
                    </h3>
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="text-cyan-300/90 text-xs md:text-sm leading-relaxed">
                      {t('guide.step1_text')}
                    </div>
                    <ul className="list-none space-y-1 text-cyan-400/80 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600">•</span>
                        <span><span className="text-cyan-300 font-bold">{t('guide.step1_title_field')}</span> {t('guide.step1_title_desc')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600">•</span>
                        <span><span className="text-cyan-300 font-bold">{t('guide.step1_due_field')}</span> {t('guide.step1_due_desc')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600">•</span>
                        <span><span className="text-cyan-300 font-bold">{t('guide.step1_priority_field')}</span> {t('guide.step1_priority_desc')}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step 2: Complete Tasks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-2">
                    <span className="text-emerald-400 font-bold">[ 2 ]</span>
                    <h3 className="text-emerald-400 font-bold text-sm md:text-base tracking-wider uppercase">
                      {t('guide.step2_title')}
                    </h3>
                  </div>
                  <div className="pl-6 text-cyan-300/90 text-xs md:text-sm leading-relaxed">
                    {t('guide.step2_text')} <span className="text-emerald-400 font-bold">{t('guide.positive_support')}</span>{t('guide.step2_text_end')}
                  </div>
                </div>

                {/* Step 3: Damage Calculation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-2">
                    <span className="text-yellow-400 font-bold">[ 3 ]</span>
                    <h3 className="text-yellow-400 font-bold text-sm md:text-base tracking-wider uppercase">
                      {t('guide.step3_title')}
                    </h3>
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="text-cyan-300/90 text-xs md:text-sm leading-relaxed">
                      <span className="text-red-400 font-bold">{t('guide.step3_critical')}</span> {t('guide.step3_text')}
                    </div>
                    <div className="bg-yellow-950/20 border border-yellow-900/50 p-3 text-yellow-400/80 text-[11px] leading-relaxed">
                      <span className="font-bold text-yellow-300">{t('guide.damage_formula')}</span><br />
                      {t('guide.damage_text')}
                    </div>
                  </div>
                </div>

                {/* Step 4: Sync Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-2">
                    <span className="text-purple-400 font-bold">[ 4 ]</span>
                    <h3 className="text-purple-400 font-bold text-sm md:text-base tracking-wider uppercase">
                      {t('guide.step4_title')}
                    </h3>
                  </div>
                  <div className="pl-6 text-cyan-300/90 text-xs md:text-sm leading-relaxed">
                    {t('guide.step4_text')} <span className="text-cyan-400 font-bold">{t('guide.active_monitoring')}</span>
                  </div>
                </div>

                {/* Step 5: Survival */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-2">
                    <span className="text-red-400 font-bold">[ 5 ]</span>
                    <h3 className="text-red-400 font-bold text-sm md:text-base tracking-wider uppercase">
                      {t('guide.step5_title')}
                    </h3>
                  </div>
                  <div className="pl-6 text-cyan-300/90 text-xs md:text-sm leading-relaxed">
                    {t('guide.step5_text')} <span className="text-emerald-400 font-bold">{t('guide.diligence')}</span> {t('guide.good_luck')}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border-t-2 border-cyan-900/30 pt-4 space-y-2">
                  <div className="text-[10px] text-cyan-700 uppercase tracking-widest"
                    dangerouslySetInnerHTML={{ __html: t('guide.additional_notes') }}
                  />
                  <div className="text-cyan-400/70 text-[11px] leading-relaxed space-y-1">
                    <div>{t('guide.note_revive')}</div>
                    <div>{t('guide.note_habits')}</div>
                    <div>{t('guide.note_decay')}</div>
                    <div>{t('guide.note_help')}</div>
                  </div>
                </div>
              </div>

              {/* Footer / Acknowledge Button */}
              <div className="border-t-2 border-cyan-900/50 bg-cyan-950/20 p-4 sticky bottom-0">
                <button
                  onClick={handleAcknowledge}
                  className="w-full py-3 border-2 border-cyan-600 bg-black hover:bg-cyan-900/30 text-cyan-400 hover:text-cyan-300 transition-all text-sm md:text-base tracking-[0.2em] uppercase font-bold group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full group-hover:animate-pulse" />
                    {t('guide.acknowledge')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="text-center mt-2 text-[9px] text-cyan-900/50 tracking-widest">
                  {t('guide.confirmation_text')}
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
