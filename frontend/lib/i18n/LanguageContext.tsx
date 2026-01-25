'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale } from './dict';

/**
 * HOSTAGE SYSTEM - Language Context
 * Manages global language state with localStorage persistence
 */

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'hostage_locale';

/**
 * Detect browser language and map to supported locale
 */
function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language.toLowerCase();

  // Japanese detection
  if (browserLang.startsWith('ja')) {
    return 'ja';
  }

  // Default to English
  return 'en';
}

/**
 * Load locale from localStorage or detect from browser
 */
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ja') {
      return stored;
    }
  } catch (error) {
    console.warn('[i18n] Failed to read from localStorage:', error);
  }

  return detectBrowserLocale();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  // Initialize on mount (client-side only)
  useEffect(() => {
    setLocaleState(getInitialLocale());
    setMounted(true);
  }, []);

  // Save to localStorage when locale changes
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch (error) {
      console.warn('[i18n] Failed to save to localStorage:', error);
    }
  };

  // Toggle between EN and JP
  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ja' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Hook for getting translated text
 */
export function useTranslation() {
  const { locale } = useLanguage();

  return {
    locale,
    t: (key: string) => {
      // Dynamic import to avoid circular dependency
      const { t: translateFn } = require('./dict');
      return translateFn(key, locale);
    },
  };
}
