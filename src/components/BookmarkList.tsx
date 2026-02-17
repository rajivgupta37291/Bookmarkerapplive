"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/superbaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        fetchBookmarks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <ul className="space-y-3 mt-4">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="flex justify-between items-center border p-3 rounded"
        >
          <a href={b.url} target="_blank" className="text-blue-600 underline">
            {b.title}
          </a>
          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
