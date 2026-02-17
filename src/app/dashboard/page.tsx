"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/superbaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Auth protection
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) router.push("/");
    };

    checkAuth();
  }, []);

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  // Realtime listener
  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        fetchBookmarks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({ title, url });
    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="max-w-xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Bookmarks 📌</h1>
        <button onClick={logout} className="text-red-500 text-sm">
          Logout
        </button>
      </div>

      <div className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="w-full border p-2 rounded"
        />
        <button
          onClick={addBookmark}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <ul className="space-y-3">
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <a
              href={b.url}
              target="_blank"
              className="text-blue-600 underline"
            >
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
    </main>
  );
}
