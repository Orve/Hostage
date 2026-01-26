'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import ScreenEffect from './ScreenEffect';
import InstallPrompt from './InstallPrompt';

// Disable SSR for LanguageToggle to prevent hydration issues
const LanguageToggle = dynamic(
  () => import('@/components/ui/LanguageToggle'),
  { ssr: false }
);

/**
 * Client-side layout wrapper
 * Ensures all global components have access to LanguageProvider context
 * Includes: LanguageToggle, ScreenEffect, InstallPrompt
 */
export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {/* Screen Effects - Fixed overlay for all pages (mobile-safe) */}
      <ScreenEffect />

      {/* PWA Install Prompt - Shows only in browser mode, not in standalone */}
      <InstallPrompt />

      {/* Language Toggle */}
      <LanguageToggle />

      {/* Page Content */}
      {children}
    </LanguageProvider>
  );
}
