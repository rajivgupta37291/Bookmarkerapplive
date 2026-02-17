"use client";

import {supabase} from "../../src/lib/superbaseClient";

export default function Home() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={loginWithGoogle}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Sign in with Google
      </button>
    </main>
  );
}
