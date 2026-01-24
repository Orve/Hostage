"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import SystemError from "../../components/SystemError";

function LoginPageContent() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const detailsParam = searchParams.get("details");
    if (errorParam) {
      const errorMessage = detailsParam
        ? `${errorParam}: ${decodeURIComponent(detailsParam)}`
        : decodeURIComponent(errorParam);
      setError(errorMessage);
      console.error('[Login Page] Auth error:', { errorParam, detailsParam });
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      // OAuth will redirect, so we don't need to manually navigate
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <SystemError
        title="AUTH_FAILURE"
        message={error}
        onRetry={() => setError(null)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4 font-mono scanlines vignette relative overflow-hidden">
      {/* Background noise */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-repeat mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase">
            HOSTAGE
          </h1>
          <div className="text-xs tracking-[0.3em] text-green-900/70 uppercase">
            Negligence Protocol v0.9.9
          </div>
        </div>

        {/* Login Container */}
        <div className="border-2 border-green-800 bg-black/80 p-8 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
          <div className="mb-6">
            <div className="text-sm tracking-widest text-green-500/70 uppercase text-center mb-2">
              [ Authentication Required ]
            </div>
            <p className="text-xs text-green-900/90 text-center tracking-wider">
              Your tasks demand supervision.<br />
              Identify yourself to proceed.
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`
              w-full p-4 border-2 transition-all text-sm tracking-[0.2em] uppercase font-bold
              ${loading
                ? "border-green-900 bg-green-950/20 text-green-900 cursor-not-allowed"
                : "border-green-700 bg-green-950/30 text-green-500 hover:bg-green-900/30 hover:border-green-500 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
              }
            `}
          >
            {loading ? (
              <span className="animate-pulse">[ Connecting... ]</span>
            ) : (
              "[ Sign In With Google ]"
            )}
          </button>

          {/* Warning Message */}
          <div className="mt-6 border border-yellow-900 bg-yellow-950/10 p-3">
            <p className="text-[10px] text-yellow-700 tracking-wider text-center uppercase">
              ⚠ Warning: Your negligence has consequences
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-[10px] text-green-900/50 tracking-[0.3em] uppercase">
          System Status: Awaiting Authorization
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-mono scanlines vignette">
        <div className="relative z-10 text-center">
          <div className="text-green-500 text-2xl tracking-[0.3em] uppercase animate-pulse">
            LOADING
          </div>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
