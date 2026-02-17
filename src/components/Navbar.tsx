"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/superbaseClient";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">My Bookmarks 📌</h1>
      <button onClick={logout} className="text-red-500 text-sm">
        Logout
      </button>
    </div>
  );
}
