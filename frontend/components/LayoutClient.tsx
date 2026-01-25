'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

// Disable SSR for LanguageToggle to prevent hydration issues
const LanguageToggle = dynamic(
  () => import('@/components/ui/LanguageToggle'),
  { ssr: false }
);

/**
 * Client-side layout wrapper
 * Ensures LanguageToggle is rendered within LanguageProvider context
 */
export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LanguageToggle />
      {children}
    </LanguageProvider>
  );
}
