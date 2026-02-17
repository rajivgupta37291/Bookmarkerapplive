"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/superbaseClient";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getUser();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="animate-slide-in-down">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 glow-indigo">
        {/* Left section - Title and user info */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl">
            <span className="text-2xl block">📌</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              My Bookmarks
            </h1>
            {user?.email && (
              <p className="text-xs md:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                <span>👤</span>
                <span className="font-medium">{user.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right section - Logout button */}
        <button
          onClick={logout}
          disabled={loading}
          className="w-full md:w-auto btn-gradient-red text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin text-lg">✨</span>
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
