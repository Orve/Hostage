"use client";

import { useState } from "react";

interface CreatePetFormProps {
  userId: string;
  onSuccess: () => void;
}

export default function CreatePetForm({ userId, onSuccess }: CreatePetFormProps) {
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!petName.trim()) {
      setError("DESIGNATION_REQUIRED");
      return;
    }

    if (petName.trim().length < 2) {
      setError("DESIGNATION_TOO_SHORT");
      return;
    }

    if (petName.trim().length > 50) {
      setError("DESIGNATION_TOO_LONG");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API call will be added in Task 2
      // For now, simulate the call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Uncomment when API is ready:
      // await createPet({
      //   user_id: userId,
      //   name: petName.trim(),
      //   hp: 100.0,
      //   max_hp: 100.0,
      //   status: 'ALIVE',
      //   infection_level: 0
      // });

      onSuccess();
    } catch (err) {
      setError("INITIALIZATION_FAILED");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container */}
      <div className="relative border-2 border-green-600 bg-black/90 p-6 md:p-8 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
        {/* Glitch overlay effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] mix-blend-screen" />

        {/* Header */}
        <div className="relative z-10 mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-green-500 tracking-[0.2em] uppercase mb-2 glitch-text" data-text="INITIALIZE">
            INITIALIZE
          </h2>
          <div className="text-xs text-green-900 tracking-[0.3em] uppercase">
            NEW_SUBJECT_PROTOCOL
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Input Field */}
          <div>
            <label
              htmlFor="petName"
              className="block text-xs text-green-500 tracking-[0.2em] uppercase mb-2 font-mono"
            >
              SUBJECT_DESIGNATION
            </label>
            <input
              id="petName"
              type="text"
              value={petName}
              onChange={(e) => {
                setPetName(e.target.value);
                setError(null);
              }}
              disabled={loading}
              placeholder="Enter designation..."
              maxLength={50}
              className="w-full px-4 py-3 bg-black border-2 border-green-900 text-green-400 font-mono text-sm tracking-wider placeholder:text-green-900/50 focus:border-green-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="mt-1 text-[10px] text-green-900 tracking-widest">
              {petName.length}/50 CHARACTERS
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="border border-yellow-900 bg-yellow-950/20 p-3 animate-pulse">
              <p className="text-yellow-500 text-xs tracking-wider text-center font-mono uppercase">
                ⚠ {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !petName.trim()}
            className="w-full p-4 border-2 border-green-900 bg-black hover:bg-green-900/20 active:bg-green-900/40 text-green-500 hover:text-green-300 transition-all text-sm tracking-[0.2em] uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="animate-pulse">INITIALIZING_SUBJECT...</span>
              ) : (
                "[ BEGIN_PROTOCOL ]"
              )}
            </span>
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>

        {/* Warning Message */}
        <div className="relative z-10 mt-6 border-t border-green-900/30 pt-4">
          <div className="text-[10px] text-green-900/70 tracking-widest text-center space-y-1">
            <div>⚠ WARNING: SUBJECT_MORTALITY_ENABLED</div>
            <div>NEGLIGENCE_WILL_RESULT_IN_TERMINATION</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 text-[10px] text-green-900/50 tracking-[0.3em]">
        PROTOCOL_V1.0.0
      </div>
    </div>
  );
}
