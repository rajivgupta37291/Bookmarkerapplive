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
    <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📌</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Bookmarks</h1>
          {user?.email && (
            <p className="text-sm text-gray-600">Signed in as {user.email}</p>
          )}
        </div>
      </div>
      <button
        onClick={logout}
        disabled={loading}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">⊙</span>
            Signing out...
          </>
        ) : (
          <>
            <span>🚪</span>
            Logout
          </>
        )}
      </button>
    </div>
  );
}
