import React from 'react';
import Image from 'next/image';

interface PetProps {
  pet: {
    name: string;
    hp: number;
    max_hp: number;
    status: 'ALIVE' | 'DEAD';
    infection_level: number;
  } | null;
}

export default function PetDisplay({ pet }: PetProps) {
  if (!pet) return <div className="text-gray-500">No Active Pet</div>;

  const hpPercent = (pet.hp / pet.max_hp) * 100;
  const isDead = pet.status === 'DEAD' || pet.hp <= 0;
  const isCritical = pet.hp > 0 && pet.hp <= 29;
  const isWarning = pet.hp >= 30 && pet.hp < 80;

  // Image Selector
  const getCharacterImage = () => {
    if (pet.hp >= 80) return "/assets/status_normal.png";
    if (pet.hp >= 30) return "/assets/status_warning.png";
    return "/assets/status_critical.png";
  };

  // Status Text
  const getStatusText = () => {
    if (isDead) return "SYSTEM FAILURE";
    if (isCritical) return "CRITICAL ERROR";
    if (isWarning) return "UNSTABLE";
    return "OPERATIONAL";
  };

  return (
    <>
      {/* Horror Overlay Effects */}
      {isCritical && !isDead && (
        <div className="fixed inset-0 pointer-events-none z-40 animate-pulse bg-red-900/10 mix-blend-overlay" />
      )}

      {/* Character Visual */}
      <div className="flex justify-center mb-8 md:mb-12 relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto">
        <div className={`
          relative w-full h-full rounded-full overflow-hidden border-4 transition-all duration-500
          ${isCritical
            ? "border-red-600 shadow-[0_0_50px_red] bg-red-900/20"
            : isWarning
              ? "border-yellow-600 shadow-[0_0_20px_yellow] brightness-75"
              : "border-green-500 shadow-[0_0_30px_green] bg-green-900/10"
          }
        `}>
          <div className={`
            w-full h-full relative
            ${isCritical ? "glitch-heavy" : ""}
            ${isWarning ? "glitch-occasional" : "animate-pulse"}
          `}>
            <Image
              src={getCharacterImage()}
              alt="Character Status"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-xs mb-2 uppercase tracking-widest text-gray-400">
          <span>Integrity (HP)</span>
          <span className={isCritical ? "text-red-500 font-bold" : (isWarning ? "text-yellow-500" : "text-green-500")}>
            {pet.hp.toFixed(1)} / {pet.max_hp}
          </span>
        </div>
        <div className="h-8 md:h-10 w-full bg-gray-900 border border-gray-700 rounded p-[2px]">
          <div
            className={`h-full transition-all duration-300
              ${isCritical ? "bg-red-600 shadow-[0_0_10px_red]" : (isWarning ? "bg-yellow-500 shadow-[0_0_5px_yellow]" : "bg-green-500 shadow-[0_0_10px_green]")}
            `}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="text-center mt-4 text-xs tracking-[0.2em] md:tracking-[0.5em] text-gray-500 px-4">
          STATUS: <span className={isCritical ? "text-red-500 glitch-text" : "text-green-500"} data-text={getStatusText()}>{getStatusText()}</span>
        </div>
      </div>
    </>
  );
}
