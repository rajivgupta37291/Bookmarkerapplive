"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/superbaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      await supabase.auth.getSession();
      router.push("/dashboard");
    };

    handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated loader */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl animate-bounce">✨</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Completing sign in...</h2>
        <p className="text-slate-600">Please wait while we redirect you to your dashboard</p>
        
        {/* Progress indicator */}
        <div className="mt-8 w-32 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    </main>
  );
}
