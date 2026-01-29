"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const DECAY_RATE_PER_HOUR = 0.5;

interface DeathTimerProps {
  hp: number;
  isDead: boolean;
}

export default function DeathTimer({ hp, isDead }: DeathTimerProps) {
  const { t } = useTranslation();
  const [timeLeftStr, setTimeLeftStr] = useState(t("timer.calculating"));
  const targetRef = useRef(0);

  useEffect(() => {
    if (isDead || hp <= 0) {
      setTimeLeftStr("00d 00:00:00.00");
      return;
    }

    const msSurvival = (hp / DECAY_RATE_PER_HOUR) * 3600 * 1000;
    targetRef.current = Date.now() + msSurvival;

    const timer = setInterval(() => {
      const diff = targetRef.current - Date.now();

      if (diff <= 0) {
        setTimeLeftStr("00d 00:00:00.00");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      const centiseconds = Math.floor((diff % 1000) / 10);

      setTimeLeftStr(
        `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`
      );
    }, 30);

    return () => clearInterval(timer);
  }, [hp, isDead]);

  const isPanic = hp < 20;

  return (
    <div className="flex flex-col items-center mt-6 mb-6">
      <div className="text-[10px] text-gray-600 tracking-[0.2em] mb-1 uppercase animate-pulse">
        {t("timer.estimated_termination")}
      </div>
      {isDead || hp <= 0 ? (
        <div className="font-mono text-2xl md:text-3xl tabular-nums tracking-wider text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] font-bold">
          {t("timer.terminated")}
        </div>
      ) : (
        <div
          className={`font-mono text-2xl md:text-3xl tabular-nums tracking-wider ${
            isPanic
              ? "text-red-500 font-bold drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
              : "text-gray-200"
          }`}
        >
          {timeLeftStr}
        </div>
      )}
    </div>
  );
}
