# Follwr Frontend - Quick Start Guide

## ✅ What's Been Set Up

Your Follwr frontend is ready to go! Here's what's included:

### 🏗️ Core Features
- ✅ Next.js 15 with App Router and TypeScript
- ✅ shadcn/ui components (buttons, cards, inputs, forms, etc.)
- ✅ Supabase authentication integration
- ✅ Axios API client with auto-authentication
- ✅ Responsive, modern UI with Tailwind CSS
- ✅ Auth context provider for global state

### 📄 Pages Implemented
- ✅ Landing page with features
- ✅ Login page
- ✅ Signup page
- ✅ Feed page (personalized content feed)
- ✅ Profile page (user & creator stats)

### 🎨 Components Built
- ✅ Navigation bar with auth state
- ✅ Post cards with like functionality
- ✅ Auth provider (React Context)
- ✅ UI components from shadcn/ui

### 🔌 API Integration
- ✅ Creators API (profiles, stats)
- ✅ Posts API (feed, create, like)
- ✅ Subscriptions API (subscribe, cancel)
- ✅ Automatic JWT token injection

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd /Users/jaykumar/Code/follwr-frontend
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the template
cp env.template .env.local

# Edit with your credentials
nano .env.local
```

You'll need:
- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anon key
- **NEXT_PUBLIC_API_URL**: Backend API URL (default: http://localhost:3000)

Get Supabase credentials from:
https://supabase.com/dashboard → Your Project → Settings → API

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3001**

## 🧪 Testing the App

### 1. Start Both Backend and Frontend

```bash
# Terminal 1: Backend
cd /Users/jaykumar/Code/follwr-backend
npm run dev

# Terminal 2: Frontend
cd /Users/jaykumar/Code/follwr-frontend
npm run dev
```

### 2. Create an Account

1. Go to http://localhost:3001
2. Click "Sign Up"
3. Create an account with Supabase
4. You'll be redirected to the feed

### 3. Test Features

- **View Feed**: http://localhost:3001/feed
- **Profile**: http://localhost:3001/profile
- **Login/Logout**: Use navigation bar

## 📚 Project Structure

```
follwr-frontend/
├── app/                    # Pages (Next.js App Router)
│   ├── auth/              # Authentication pages
│   ├── feed/              # Main feed
│   ├── profile/           # User profile
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/             # React components
│   ├── auth/              # Auth components
│   ├── nav/               # Navigation
│   ├── posts/             # Post components
│   └── ui/                # shadcn/ui components
├── lib/                    # Libraries & utilities
│   ├── api/               # Backend API clients
│   ├── supabase/          # Supabase clients
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                 # Static files
```

## 🎯 Next Steps to Complete

### High Priority

1. **Creator Profile Setup**
   - Create `/creator/setup` page
   - Form to create creator profile
   - Upload profile/cover images

2. **Post Creation**
   - Create `/posts/create` page
   - Media upload to Supabase Storage
   - Rich text editor for content

3. **Creator Discovery**
   - Create `/creators` page
   - List all creators
   - Search & filter functionality

4. **Subscription Flow**
   - Subscription checkout page
   - Payment integration (Stripe)
   - Tier selection

### Medium Priority

5. **Individual Creator Page**
   - `/[username]` page
   - Creator posts grid
   - Subscribe button with tiers

6. **Individual Post Page**
   - `/posts/[postId]` page
   - Comments section
   - Share functionality

7. **Direct Messaging**
   - Message inbox
   - Chat interface
   - Real-time updates

8. **Notifications**
   - Notification bell
   - Notification list
   - Mark as read

### Nice to Have

9. **Search & Discovery**
   - Global search
   - Trending creators
   - Recommended content

10. **User Settings**
    - Edit profile
    - Privacy settings
    - Notification preferences

11. **Analytics Dashboard**
    - Creator earnings
    - Subscriber growth
    - Post performance

## 🔌 Adding New Pages

### Example: Create a new page

```bash
# Create the file
mkdir -p app/my-page
touch app/my-page/page.tsx
```

```tsx
// app/my-page/page.tsx
'use client'

import { useAuth } from '@/components/auth/auth-provider'

export default function MyPage() {
  const { user } = useAuth()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>My New Page</h1>
      <p>Hello, {user?.email}</p>
    </div>
  )
}
```

## 🎨 Adding shadcn Components

```bash
# Install a new component
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add toast
```

## 🔐 Protected Routes

To protect a route (require authentication):

```tsx
'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>

  return <div>Protected content</div>
}
```

## 🌐 Making API Calls

```tsx
import { postsApi } from '@/lib/api/posts'
import { creatorsApi } from '@/lib/api/creators'
import { subscriptionsApi } from '@/lib/api/subscriptions'

// Get feed
const posts = await postsApi.getFeed()

// Get creator by username
const creator = await creatorsApi.getByUsername('johndoe')

// Subscribe to creator
await subscriptionsApi.subscribe({
  creatorId: 'creator-id-here'
})
```

## 🐛 Troubleshooting

**Port already in use**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Backend connection errors**
- Ensure backend is running on port 3000
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS is configured in backend

**Supabase auth not working**
- Check Supabase credentials in .env.local
- Verify Supabase project is active
- Check browser console for errors

**Components not found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

## 🎉 You're All Set!

Your frontend is ready for development. Start building features and iterate based on user feedback!

---

**Built with ❤️ using Next.js 15 and shadcn/ui**

