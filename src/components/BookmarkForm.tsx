"use client";

import { useState } from "react";
import { supabase } from "../lib/superbaseClient";

export default function BookmarkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addBookmark = async () => {
    if (!title || !url) return;
    await supabase.from("bookmarks").insert({ title, url });
    setTitle("");
    setUrl("");
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        onClick={addBookmark}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add Bookmark
      </button>
    </div>
  );
}
