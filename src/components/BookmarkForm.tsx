"use client";

import { useState } from "react";
import { supabase } from "../lib/superbaseClient";

export default function BookmarkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateURL = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setError("Please fill in both fields");
      return;
    }

    if (!validateURL(url)) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) {
        setError("Not authenticated");
        return;
      }

      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          title: title.trim(),
          url: url.trim(),
          user_id: sessionData.session.user.id,
        });

      if (insertError) {
        setError(insertError.message);
      } else {
        setTitle("");
        setUrl("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={addBookmark} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          ✓ Bookmark added successfully!
        </div>
      )}
      <div>
        <input
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          disabled={loading}
        />
      </div>
      <div>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">⊙</span>
            Adding...
          </>
        ) : (
          <>
            <span>➕</span>
            Add Bookmark
          </>
        )}
      </button>
    </form>
  );
}
