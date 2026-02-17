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
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600 mt-2">Loading bookmarks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">📭 No bookmarks yet</p>
        <p className="text-gray-400 text-sm">Add your first bookmark above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex justify-between items-center border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow bg-gray-50"
        >
          <div className="flex-1 min-w-0">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline font-medium block truncate"
              title={b.title}
            >
              {b.title}
            </a>
            <p className="text-xs text-gray-500 mt-1 truncate" title={b.url}>
              {b.url}
            </p>
          </div>
          <button
            onClick={() => deleteBookmark(b.id)}
            disabled={deletingId === b.id}
            className="ml-4 text-red-500 hover:text-red-700 disabled:text-red-300 transition-colors flex-shrink-0"
            title="Delete bookmark"
          >
            {deletingId === b.id ? "⏳" : "❌"}
          </button>
        </div>
      ))}
    </div>
  );
}
