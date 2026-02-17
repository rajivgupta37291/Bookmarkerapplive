"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/superbaseClient";
import Navbar from "@/src/components/Navbar";
import BookmarkForm from "@/src/components/BookmarkForm";
import BookmarkList from "@/src/components/BookmarkList";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 md:py-12">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-200 to-blue-200 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full opacity-15 blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        <Navbar />
        
        {/* Add Bookmark Section */}
        <div className="card p-6 md:p-8 glow-blue">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">➕</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Add New Bookmark</h2>
          </div>
          <BookmarkForm />
        </div>

        {/* Bookmarks List Section */}
        <div className="card p-6 md:p-8 glow-indigo">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📚</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Bookmarks</h2>
          </div>
          <BookmarkList />
        </div>
      </div>
    </main>
  );
}
