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

## Challenges & Solutions 🛠️

During development, we faced and solved several key issues:

### 1. **Real-time Sync Not Working**
**Problem:** Bookmarks added in one tab weren't appearing in other tabs without manual refresh.

**Root Cause:** 
- WebSocket subscription wasn't properly initialized
- Event listeners weren't being triggered on new inserts
- Missing proper connection status tracking

**Solution:**
- Wrapped subscription in Promise to ensure full initialization before considering setup complete
- Added proper callback handlers for `postgres_changes` events
- Implemented connection timeout and logging for debugging
- Added `isMounted` flag to prevent memory leaks
- See [REALTIME_GUIDE.md](REALTIME_GUIDE.md) for detailed architecture

### 2. **Google OAuth Integration Issues**
**Problem:** OAuth redirects failing with "Redirect URL mismatch" errors.

**Root Cause:**
- Redirect URLs not registered in Supabase
- Different URLs for localhost vs production weren't configured
- Missing `/auth/callback` route handler

**Solution:**
- Created dedicated [app/auth/callback/page.tsx](app/auth/callback/page.tsx) to handle OAuth callback
- Added both local and production URLs to Supabase authorized redirects:
  - `http://localhost:3000/auth/callback`
  - `https://your-app.vercel.app/auth/callback`
- Implemented proper session exchange and token refresh logic

### 3. **Build Errors - Conflicting File Structure**
**Problem:** Project had duplicate directories causing build failures.

**Root Cause:**
- Multiple `Layout`, `page.tsx`, and `globals.css` files in different locations
- Conflicting Next.js routing causing module resolution errors

**Solution:**
- Consolidated to single source of truth in `app/` and `src/`
- Removed duplicate files and cleared `.next` cache
- Ensured consistent file structure following Next.js App Router conventions

### 4. **Real-time Not Showing New Bookmarks Immediately**
**Problem:** Required page refresh to see newly added bookmarks.

**Root Cause:**
- Real-time subscription callback wasn't properly refetching data
- State wasn't updating synchronously with database changes
- Missing sync status indicators for user feedback

**Solution:**
- Enhanced `fetchBookmarks()` to detect and highlight new bookmarks
- Added visual indicators: syncing spinner, last sync timestamp
- Implemented 2-second glow animation on newly added items
- Added `lastSynced` state to show sync time

### 5. **Memory Leaks in Real-time Subscriptions**
**Problem:** Multiple subscriptions accumulating, causing performance degradation.

**Root Cause:**
- Subscriptions not being properly cleaned up on component unmount
- Event listeners persisting after navigation

**Solution:**
- Added proper cleanup in `useEffect` return function
- Used `supabase.removeChannel()` to unsubscribe properly
- Added `isMounted` flag to prevent state updates after unmount

### 6. **Database Privacy - Users Seeing All Bookmarks**
**Problem:** Row Level Security policies not working correctly.

**Root Cause:**
- RLS policies not enabled on bookmarks table
- Missing `user_id` filter in queries

**Solution:**
- Enabled RLS with three policies:
  - SELECT: Only own bookmarks
  - INSERT: Only own bookmarks
  - DELETE: Only own bookmarks
- Added user_id filter to all queries and subscriptions

## Troubleshooting

| Problem       | Solution                              |
| ------------- | ------------------------------------- |
| URL not set   | Restart dev server after `.env.local` |
| OAuth failing | Check redirect URIs are set correctly |
| No bookmarks  | Verify RLS policies are enabled       |

## License

MIT - Build amazing things!
