"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { getSession } from "@/lib/auth";
import { getSession } from "../lib/auth";
// import Navbar from "@/components/Navbar";
import Navbar from "../components/Navbar";
import BookmarkForm from "../components/BookmarkForm";
// import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "../components/BookmarkList";
// import BookmarkList from "@/components/BookmarkList";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (!session) router.push("/");
    });
  }, []);

  return (
    <main className="max-w-xl mx-auto mt-10">
      <Navbar />
      <BookmarkForm />
      <BookmarkList />
    </main>
  );
}
