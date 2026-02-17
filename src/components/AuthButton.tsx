"use client";

import { supabase } from "../lib/superbaseClient";

export default function AuthButton() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <button
      onClick={login}
      className="bg-black text-white px-6 py-3 rounded"
    >
      Sign in with Google
    </button>
  );
}
