"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/superbaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
};

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBookmarks = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setBookmarks(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user?.id) {
          setCurrentUserId(sessionData.session.user.id);
          await fetchBookmarks(sessionData.session.user.id);

          // Set up real-time subscription for this user's bookmarks
          const channel: RealtimeChannel = supabase
            .channel(`bookmarks:${sessionData.session.user.id}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "bookmarks",
                filter: `user_id=eq.${sessionData.session.user.id}`,
              },
              () => {
                fetchBookmarks(sessionData.session.user.id);
              }
            )
            .subscribe();

          return () => {
            supabase.removeChannel(channel);
          };
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize");
      }
    };

    const cleanup = initializeAndFetch();

    return () => {
      cleanup?.then((fn) => fn?.());
    };
  }, []);

  const deleteBookmark = async (id: string) => {
    try {
      setDeletingId(id);
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete bookmark");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block mb-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
        <p className="text-slate-600 font-medium">Loading your bookmarks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-red-700">Error loading bookmarks</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4">
          <div className="text-6xl inline-block opacity-50">📭</div>
        </div>
        <p className="text-lg font-semibold text-slate-600 mb-2">No bookmarks yet</p>
        <p className="text-slate-500 text-sm px-4">
          Add your first bookmark above to get started! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="group card p-5 hover:border-indigo-300 hover:-translate-y-1 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-blue-50"
        >
          <div className="flex justify-between items-start gap-4">
            {/* Left section - Title and URL */}
            <div className="flex-1 min-w-0">
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-bold text-indigo-600 hover:text-indigo-700 group/link transition-colors"
                title={b.title}
              >
                <span className="text-lg">🔗</span>
                <span className="line-clamp-1 group-hover/link:underline">{b.title}</span>
              </a>
              <p className="text-xs text-slate-500 mt-2 truncate line-clamp-1 pl-6" title={b.url}>
                {b.url.replace(/https?:\/\/(www\.)?/, '')}
              </p>
            </div>

            {/* Right section - Delete button */}
            <button
              onClick={() => deleteBookmark(b.id)}
              disabled={deletingId === b.id}
              className="flex-shrink-0 p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-all opacity-100 group-hover:opacity-100"
              title="Delete bookmark"
            >
              {deletingId === b.id ? (
                <span className="inline-block animate-spin text-lg">⏳</span>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
