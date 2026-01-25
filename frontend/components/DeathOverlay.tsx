'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DeathOverlayProps = {
  onRevive: () => void;
  onPurge?: () => void;
};

type SequenceState = 'idle' | 'blackout' | 'booting';

const BOOT_LOGS = [
  "> SYSTEM_REBOOT_INITIATED...",
  "> CHECKING_BIOS_INTEGRITY... OK",
  "> DETECTING_LIFE_SIGNS... NEGATIVE",
  "> INJECTING_STASIS_GEL... 100%",
  "> CLEARING_CORRUPTION...",
  "> REBUILDING_NEURAL_LINKS...",
  "> CONNECTION_ESTABLISHED.",
  "> VITAL_SIGNS_RESTORED."
];

export default function DeathOverlay({ onRevive, onPurge }: DeathOverlayProps) {
  const [sequenceState, setSequenceState] = useState<SequenceState>('idle');
  const [logIndex, setLogIndex] = useState(0);

  const handleReboot = () => {
    setSequenceState('blackout');
  };

  // Sequence Logic
  useEffect(() => {
    if (sequenceState === 'blackout') {
      // 0.5s Blackout -> Booting
      const timer = setTimeout(() => {
        setSequenceState('booting');
      }, 500);
      return () => clearTimeout(timer);
    }

    if (sequenceState === 'booting') {
      // Display logs rapidly
      if (logIndex < BOOT_LOGS.length) {
        const timeout = setTimeout(() => {
          setLogIndex((prev) => prev + 1);
        }, 150); // Speed of log scrolling
        return () => clearTimeout(timeout);
      } else {
        // Logs finished -> Trigger Revive (Fade in happen in parent)
        const timeout = setTimeout(() => {
          onRevive();
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [sequenceState, logIndex, onRevive]);

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black/95 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* === IDLE STATE (GLITCH BUTTON) === */}
        {sequenceState === 'idle' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="text-red-600 text-6xl font-black tracking-widest animate-pulse glitch-text">
              SIGNAL LOST
            </div>

            <div className="text-red-400/70 font-mono text-sm tracking-widest uppercase mb-4">
              Subject Vital Signs: None
            </div>

            <button
              onClick={handleReboot}
              className="group relative px-8 py-4 bg-transparent border border-red-500 overflow-hidden transition-all hover:bg-red-500/10 active:scale-95"
            >
              <div className="absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="font-mono font-bold text-red-500 tracking-wider text-lg group-hover:text-red-100 transition-colors">
                  INITIATE_SYSTEM_REBOOT
                </span>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500" />
            </button>

            <div className="text-red-900/60 font-mono text-[10px] mt-2 mb-8 animate-pulse">
              COST: 0.1 SOL (TESTNET)
            </div>

            {/* PURGE OPTION (Secondary Action) */}
            <button
              onClick={() => {
                if (confirm("⚠️ WARNING: PURGE PROTOCOL INITIATED ⚠️\n\nAll genetic data will be permanently erased.\nThis action cannot be undone.\n\nProceed?")) {
                  onPurge && onPurge();
                }
              }}
              className="mt-8 px-4 py-2 border border-red-900/50 bg-red-950/20 text-red-500/70 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-red-900/40 hover:text-red-400 hover:border-red-500/50 transition-all duration-300"
            >
              [ PURGE SAMPLE DATA ]
            </button>
          </motion.div>
        )}

        {/* === BLACKOUT STATE === */}
        {sequenceState === 'blackout' && (
          <motion.div
            className="absolute inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* === BOOT LOG STATE === */}
        {sequenceState === 'booting' && (
          <motion.div
            className="absolute inset-0 bg-black z-50 flex items-start justify-start p-8 font-mono text-xs sm:text-sm text-green-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col gap-1 w-full max-w-md">
              {BOOT_LOGS.slice(0, logIndex).map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-l-2 border-green-900/50 pl-2"
                >
                  <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </motion.div>
              ))}
              <div className="h-4 w-2 bg-green-500 animate-pulse mt-1" />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
