# Smart Bookmark App 📌

A fast, modern bookmark manager built with Next.js and Supabase. Save and organize your favorite websites with real-time synchronization.

## Features ✨

- 🔐 **Google OAuth** - Secure authentication
- 📌 **Add Bookmarks** - Save URLs with titles
- 🔄 **Real-time Sync** - Instant updates across tabs
- 🗑️ **Delete Bookmarks** - Remove items anytime
- 👤 **Private** - Only see your own bookmarks
- ⚡ **Fast** - Built with Next.js App Router
- 🌐 **Live on Vercel** - Production ready

## Tech Stack

- Next.js 16+, React 19, TypeScript
- Supabase (Auth + PostgreSQL + Real-time)
- Tailwind CSS 4

## Quick Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create Supabase tables (in SQL editor)

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view_own" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own" ON bookmarks FOR DELETE USING (auth.uid() = user_id);
```

### 3. Add Google OAuth in Supabase Authentication

### 4. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 5. Run locally

```bash
npm run dev
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## Usage

- **Login**: Google OAuth
- **Add**: Enter title & URL
- **View**: See all bookmarks (real-time!)
- **Delete**: Click ❌
- **Logout**: Top right button

## Real-time Magic ✨

Open multiple tabs and watch bookmarks sync instantly!

## Troubleshooting

| Problem       | Solution                              |
| ------------- | ------------------------------------- |
| URL not set   | Restart dev server after `.env.local` |
| OAuth failing | Check redirect URIs are set correctly |
| No bookmarks  | Verify RLS policies are enabled       |

## License

MIT - Build amazing things!
