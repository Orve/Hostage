import React from 'react';

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
  const isDead = pet.status === 'DEAD';

  return (
    <div className={`p-6 rounded-xl border-2 ${isDead ? 'border-red-900 bg-red-950' : 'border-emerald-500 bg-black'}`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDead ? 'text-red-600 animate-pulse' : 'text-emerald-400'}`}>
        {isDead ? '† DEAD †' : pet.name}
      </h2>

      {/* Visual Representation (Placeholder) */}
      <div className="flex justify-center mb-6">
        <div className={`w-32 h-32 flex items-center justify-center text-4xl rounded-full border-4 
          ${isDead ? 'border-red-800 bg-red-900' : 'border-emerald-500 bg-emerald-900'}`}>
          {isDead ? '💀' : '🥚'}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>HP</span>
          <span>{pet.hp.toFixed(1)} / {pet.max_hp}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
          <div
            className={`h-full transition-all duration-500 ${isDead ? 'bg-red-700' : 'bg-emerald-500'}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Infection: {pet.infection_level}</span>
          <span>Status: {pet.status}</span>
        </div>
      </div>
    </div>
  );
}
