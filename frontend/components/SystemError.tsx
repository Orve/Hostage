"use client";

interface SystemErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function SystemError({
  title = "SYSTEM_MALFUNCTION",
  message,
  onRetry
}: SystemErrorProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono scanlines vignette">
      <div className="relative z-10 max-w-lg w-full">
        {/* Static Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-10 pointer-events-none mix-blend-screen" />

        {/* Error Container */}
        <div className="relative border-2 border-red-600 bg-black/90 p-8 shadow-[0_0_50px_rgba(255,0,0,0.3)]">
          {/* Error Icon */}
          <div className="text-center mb-6">
            <div className="inline-block text-red-600 text-6xl animate-pulse">
              ⚠
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-black text-red-600 text-center mb-4 tracking-[0.2em] uppercase glitch-text animate-pulse" data-text={title}>
            {title}
          </h1>

          {/* Error Message */}
          <div className="border border-red-900 bg-red-950/20 p-4 mb-6">
            <p className="text-red-400 text-sm tracking-wider text-center break-words">
              {message}
            </p>
          </div>

          {/* System Status */}
          <div className="text-[10px] text-red-900/70 tracking-widest text-center mb-6 space-y-1">
            <div>STATUS: CRITICAL_ERROR</div>
            <div>INTERVENTION_REQUIRED</div>
          </div>

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full p-3 border-2 border-red-900 bg-red-950/20 text-red-500 hover:bg-red-900/30 hover:border-red-600 transition-all text-sm tracking-[0.2em] uppercase font-bold"
            >
              [ RETRY_CONNECTION ]
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-[10px] text-red-900/50 tracking-[0.3em]">
          ERROR_LOG_RECORDED
        </div>
      </div>
    </div>
  );
}
