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
      {/* Error alert */}
      {error && (
        <div className="animate-fade-in-up p-4 bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-red-600 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Success alert */}
      {success && (
        <div className="animate-fade-in-up p-4 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-l-4 border-emerald-500 rounded-lg text-emerald-700 text-sm font-medium flex items-center gap-3">
          <span className="text-lg">✨</span>
          <p>Bookmark added successfully!</p>
        </div>
      )}

      {/* Title input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-1.5 text-xl">
            <span>📝</span> Bookmark Title
          </span>
        </label>
        <input
          placeholder="e.g., GitHub, YouTube, Stack Overflow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-modern placeholder:text-slate-400"
          disabled={loading}
        />
      </div>

      {/* URL input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-1.5 text-xl">
            <span>🔗</span> Website URL
          </span>
        </label>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-modern placeholder:text-slate-400"
          disabled={loading}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gradient text-white px-6 py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">✨</span>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <span>➕</span>
            <span>Add Bookmark</span>
          </>
        )}
      </button>
    </form>
  );
}
