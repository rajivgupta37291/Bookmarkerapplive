import "./globals.css";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Save bookmarks with real-time sync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
