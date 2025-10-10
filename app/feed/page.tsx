'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { postsApi } from '@/lib/api/posts'
import { Post } from '@/lib/types'
import { PostCard } from '@/components/posts/post-card'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import { BottomNav } from '@/components/nav/bottom-nav'
import { RefreshCw, UserPlus } from 'lucide-react'

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await postsApi.getFeed()
      setPosts(data)
    } catch (err: any) {
      const errorCode = err?.response?.status
      const errorMessage = err?.response?.data?.message || err?.message
      
      // If it's a network error (no backend), just show empty state
      if (err.code === 'ERR_NETWORK' || errorMessage?.includes('Network Error')) {
        setPosts([])
        setError(null)
      } 
      // If 401/403, user might need to create profile or login
      else if (errorCode === 401 || errorCode === 403) {
        setPosts([])
        setError(null) // Show empty state instead of error
      }
      // Other errors
      else {
        console.error('Feed error:', err)
        setPosts([])
        setError(null) // Show empty state for all errors
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  if (authLoading || loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <BottomNav />
      </>
    )
  }

  if (error) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchPosts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <BottomNav />
      </>
    )
  }

  // Empty state - show onboarding
  if (posts.length === 0) {
    return (
      <>
        <div 
          className="min-h-screen pb-20 flex flex-col items-center justify-center px-4"
          style={{
            background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
          }}
        >
          {/* Central Illustration */}
          <div className="mb-12">
            <Image
              src="/assets/home.png"
              alt="Find creators"
              width={280}
              height={280}
              priority
              className="w-64 h-64 md:w-80 md:h-80 object-contain"
            />
          </div>

          {/* Text */}
          <h1 
            className="font-medium text-center text-gray-900 mb-8 max-w-md px-4"
            style={{
              fontSize: '20px',
              lineHeight: '27px',
              letterSpacing: '-0.04em'
            }}
          >
            Subscribe to your favourite creators to see them appear on your feed
          </h1>

          {/* Buttons */}
          <div className="w-full max-w-md px-4 space-y-4">
            <Link href="/explore" className="block">
              <PrimaryButton className="text-lg">
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Find creators</span>
                </div>
              </PrimaryButton>
            </Link>

            <Link href="/creator-signup" className="block">
              <Button 
                variant="outline"
                className="w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-3 rounded-full text-lg transition-colors"
              >
                Looking to earn as a creators?
              </Button>
            </Link>
          </div>
        </div>
        <BottomNav />
      </>
    )
  }

  // Feed with posts
  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Feed</h1>
            <Button variant="ghost" size="sm" onClick={fetchPosts}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

