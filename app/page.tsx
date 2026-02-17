"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/superbaseClient";
import AuthButton from "@/src/components/AuthButton";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-300 to-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="card p-8 md:p-10 glow-indigo">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 inline-block animate-bounce" style={{ animationDuration: '2s' }}>📌</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Smart Bookmark
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Save and organize your favorite websites instantly with real-time sync
            </p>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-2 gap-3 mb-8 text-center text-sm">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
              <span className="text-xl">🔐</span>
              <p className="text-slate-700 font-medium mt-1">Secure</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <span className="text-xl">⚡</span>
              <p className="text-slate-700 font-medium mt-1">Real-time</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
              <span className="text-xl">🌐</span>
              <p className="text-slate-700 font-medium mt-1">Online</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <span className="text-xl">👤</span>
              <p className="text-slate-700 font-medium mt-1">Private</p>
            </div>
          </div>

          {/* Auth button */}
          <AuthButton />
        </div>

        {/* Footer text */}
        <p className="text-center text-slate-600 text-sm mt-6">
          Powered by Next.js, Supabase & Tailwind CSS
        </p>
      </div>
    </main>
  );
}
