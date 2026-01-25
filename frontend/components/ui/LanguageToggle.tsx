'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

/**
 * HOSTAGE SYSTEM - Language Toggle Switch
 * Sci-Fi Military-Style UI Component
 */

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button
      onClick={toggleLocale}
      className="fixed top-4 right-4 z-[9999] group"
      aria-label="Toggle Language"
    >
      <div className="flex items-center gap-2 bg-black/80 border border-green-500/30 px-3 py-1.5 rounded backdrop-blur-sm hover:border-green-500/60 transition-all duration-300">
        {/* EN Label */}
        <span
          className={`
            font-mono text-xs tracking-wider transition-all duration-300
            ${
              locale === 'en'
                ? 'text-green-400 font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                : 'text-gray-600 opacity-50'
            }
          `}
        >
          EN
        </span>

        {/* Divider */}
        <div className="h-4 w-px bg-green-500/30" />

        {/* JP Label */}
        <span
          className={`
            font-mono text-xs tracking-wider transition-all duration-300
            ${
              locale === 'ja'
                ? 'text-green-400 font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                : 'text-gray-600 opacity-50'
            }
          `}
        >
          JP
        </span>
      </div>

      {/* Hover Indicator */}
      <div className="absolute -inset-1 bg-green-500/10 rounded blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </button>
  );
}
