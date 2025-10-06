# Follwr Frontend

A modern, responsive frontend for the Follwr content creator platform built with Next.js 15, shadcn/ui, and Supabase.

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Authentication and user management
- **Axios** - HTTP client for backend API
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## 📋 Prerequisites

- Node.js >= 22.0.0
- npm or yarn
- Supabase account
- Backend API running (see follwr-backend)

## 🛠️ Installation

### 1. Install dependencies

```bash
cd /Users/jaykumar/Code/follwr-frontend
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp env.template .env.local
```

Edit `.env.local` with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_NAME=Follwr
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## 📁 Project Structure

```
follwr-frontend/
├── app/                      # Next.js App Router pages
│   ├── auth/                # Authentication pages
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── feed/               # Main feed page
│   ├── profile/            # User profile page
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Homepage
├── components/              # React components
│   ├── auth/               # Auth components
│   │   └── auth-provider.tsx  # Auth context provider
│   ├── nav/                # Navigation components
│   │   └── navbar.tsx      # Main navigation bar
│   ├── posts/              # Post components
│   │   └── post-card.tsx   # Post display card
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utilities and configurations
│   ├── api/                # Backend API clients
│   │   ├── client.ts       # Axios client with auth
│   │   ├── creators.ts     # Creator API endpoints
│   │   ├── posts.ts        # Posts API endpoints
│   │   └── subscriptions.ts # Subscriptions API
│   ├── supabase/           # Supabase clients
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server client
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── public/                  # Static assets
```

## 🎨 Features

### Implemented

- ✅ **Authentication**
  - Login/Signup with Supabase
  - Protected routes
  - Session management
  
- ✅ **User Interface**
  - Responsive design
  - Modern, clean UI with shadcn/ui
  - Dark/light mode support (via Tailwind)
  
- ✅ **Feed System**
  - Personalized content feed
  - Post cards with media
  - Like functionality
  
- ✅ **Profile Management**
  - User profile page
  - Creator statistics
  - Subscription management
  
- ✅ **API Integration**
  - Axios client with auto-auth
  - Type-safe API calls
  - Error handling

### To Be Implemented

- 🔲 Creator profile setup flow
- 🔲 Post creation interface
- 🔲 Creator discovery page
- 🔲 Subscription checkout
- 🔲 Direct messaging
- 🔲 Notifications
- 🔲 Search functionality
- 🔲 Comment system
- 🔲 Media upload to Supabase Storage
- 🔲 User settings page

## 🔌 API Integration

The frontend communicates with the backend via REST API. All requests are automatically authenticated using Supabase JWT tokens.

### API Client Configuration

```typescript
// lib/api/client.ts
- Automatically adds auth token to requests
- Handles 401 errors (redirects to login)
- Base URL from environment variable
```

### Available API Modules

- **Creators API** (`lib/api/creators.ts`)
  - Create/update creator profile
  - Get creator by username
  - Get creator stats

- **Posts API** (`lib/api/posts.ts`)
  - Create posts
  - Get feed
  - Get creator posts
  - Like posts

- **Subscriptions API** (`lib/api/subscriptions.ts`)
  - Subscribe to creators
  - Get subscriptions
  - Check subscription status
  - Cancel subscriptions

## 🎯 Usage Examples

### Creating a New Page

```tsx
// app/new-page/page.tsx
'use client'

import { useAuth } from '@/components/auth/auth-provider'

export default function NewPage() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>New Page</h1>
      <p>Hello, {user?.email}</p>
    </div>
  )
}
```

### Making API Calls

```tsx
import { postsApi } from '@/lib/api/posts'

// Get feed
const posts = await postsApi.getFeed()

// Create post
const newPost = await postsApi.createPost({
  content: 'Hello, world!',
  isPublic: true
})
```

### Using UI Components

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Development Tips

### Hot Reload
Changes to files are automatically reflected in the browser during development.

### Adding shadcn Components
```bash
npx shadcn@latest add [component-name]
```

### TypeScript
- All API responses are typed
- Use types from `lib/types.ts`
- Create new types as needed

## 🔐 Security Notes

- Never commit `.env.local` file
- Supabase keys are public (anon key only)
- Backend handles all sensitive operations
- JWT tokens are automatically managed

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

---

Built with ❤️ using Next.js and shadcn/ui