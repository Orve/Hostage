"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証チェック
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state with horror aesthetic
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono scanlines vignette">
        <div className="relative z-10 text-center">
          <div className="text-green-500 text-2xl tracking-[0.3em] uppercase animate-pulse mb-4">
            INITIALIZING_SYSTEM
          </div>
          <div className="text-green-900 text-xs tracking-widest">
            [ PLEASE_WAIT ]
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
