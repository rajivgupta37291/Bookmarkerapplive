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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Smart Bookmark 📌</h1>
        <p className="text-gray-600 mb-8">Save and organize your favorite websites in real-time</p>
        <AuthButton />
      </div>
    </main>
  );
}
