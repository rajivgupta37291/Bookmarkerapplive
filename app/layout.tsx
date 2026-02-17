import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Bookmark - Save Your Favorite Websites",
  description: "A simple and fast bookmark manager with real-time sync powered by Next.js and Supabase",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
