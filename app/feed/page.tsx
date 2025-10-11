'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { postsApi } from '@/lib/api/posts'
import { creatorsApi } from '@/lib/api/creators'
import { Post, CreatorProfile } from '@/lib/types'
import { PostCard } from '@/components/posts/post-card'
import { CreatePostForm } from '@/components/posts/create-post-form'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import { BottomNav } from '@/components/nav/bottom-nav'
import { UserPlus } from 'lucide-react'
import { getCreatorDisplayName, getCreatorUsername, getCreatorProfilePicture } from '@/lib/utils/profile'

export default function FeedPage() {
  const { user, isCreator, loading: authLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creators, setCreators] = useState<CreatorProfile[]>([])
  const [loadingCreators, setLoadingCreators] = useState(false)
  const hasFetchedRef = useRef(false)
  const hasFetchedCreatorsRef = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await postsApi.getFeed()
      setPosts(data)
    } catch (err: unknown) {
      const errorCode = (err as { response?: { status?: number } })?.response?.status
      const errorMessage = (err as { response?: { data?: { message?: string } }; message?: string; code?: string })?.response?.data?.message || (err as { message?: string })?.message
      const errorNetworkCode = (err as { code?: string })?.code
      
      // If it's a network error (no backend), just show empty state
      if (errorNetworkCode === 'ERR_NETWORK' || errorMessage?.includes('Network Error')) {
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
  }, [])

  const handlePostCreated = useCallback(() => {
    // Refresh the feed after creating a post
    hasFetchedRef.current = false
    fetchPosts()
  }, [fetchPosts])

  const fetchCreators = useCallback(async () => {
    try {
      setLoadingCreators(true)
      const data = await creatorsApi.listCreators({
        page: 1,
        limit: 10,
        sort: 'trending'
      })
      setCreators(data)
    } catch (error) {
      console.error('Failed to load creators:', error)
      setCreators([])
    } finally {
      setLoadingCreators(false)
    }
  }, [])

  useEffect(() => {
    if (user && !authLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchPosts()
    }
  }, [user, authLoading, fetchPosts])

  useEffect(() => {
    if (user && !authLoading && !hasFetchedCreatorsRef.current) {
      hasFetchedCreatorsRef.current = true
      fetchCreators()
    }
  }, [user, authLoading, fetchCreators])

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
            Retry
          </Button>
        </div>
        <BottomNav />
      </>
    )
  }

  // Empty state - show onboarding (or create form for creators)
  if (posts.length === 0) {
    // If creator, show create form with empty state message
    if (isCreator) {
      return (
        <>
          <div className="container mx-auto px-4 pt-24 pb-20">
            <div className="max-w-2xl mx-auto">
              {/* Explore Creators Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Explore creators</h2>
                  <Link href="/explore" className="text-sm text-blue-600 font-medium">
                    See all
                  </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {loadingCreators ? (
                    <div className="flex gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-32 flex-shrink-0">
                          <div className="w-32 h-32 bg-gray-200 rounded-2xl mb-2 animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    creators.slice(0, 6).map((creator) => (
                      <Link
                        key={creator.id}
                        href={`/creators/${getCreatorUsername(creator)}`}
                        className="flex-shrink-0 w-32"
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2 bg-gray-100">
                          {getCreatorProfilePicture(creator) ? (
                            <img
                              src={getCreatorProfilePicture(creator)}
                              alt={getCreatorDisplayName(creator)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-400 text-white text-2xl font-bold">
                              {getCreatorDisplayName(creator).charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm truncate">{getCreatorDisplayName(creator)}</p>
                        <p className="text-xs text-gray-500 truncate">@{getCreatorUsername(creator)}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Create Post Form */}
              <div className="mb-6">
                <CreatePostForm onPostCreated={handlePostCreated} compact />
              </div>

              {/* Empty state message */}
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No posts in your feed yet
                </p>
                <Link href="/explore">
                  <Button variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find creators to follow
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <BottomNav />
        </>
      )
    }

    // Regular user empty state
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
  const exploreCreatorsSection = (
    <div className="px-4 py-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Explore creators</h2>
        <Link href="/explore" className="text-sm text-blue-600 font-medium">
          See all
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {loadingCreators ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-32 flex-shrink-0">
                <div className="w-32 h-32 bg-gray-200 rounded-2xl mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          creators.slice(0, 6).map((creator) => (
            <Link
              key={creator.id}
              href={`/creators/${getCreatorUsername(creator)}`}
              className="flex-shrink-0 w-32"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden mb-2 bg-gray-100">
                {getCreatorProfilePicture(creator) ? (
                  <img
                    src={getCreatorProfilePicture(creator)}
                    alt={getCreatorDisplayName(creator)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-400 text-white text-2xl font-bold">
                    {getCreatorDisplayName(creator).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <p className="font-semibold text-sm truncate">{getCreatorDisplayName(creator)}</p>
              <p className="text-xs text-gray-500 truncate">@{getCreatorUsername(creator)}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  )

  // Determine where to insert explore creators section
  const postsBeforeExplore = Math.min(posts.length, 2)
  const postsBeforeExploreList = posts.slice(0, postsBeforeExplore)
  const postsAfterExplore = posts.slice(postsBeforeExplore)

  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Create Post Form for Creators */}
          {isCreator && (
            <div className="mb-6">
              <CreatePostForm onPostCreated={handlePostCreated} compact />
            </div>
          )}

          {/* Posts List with Explore Creators inserted */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* First 1-2 posts */}
            {postsBeforeExploreList.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Explore Creators Section (after first 1-2 posts) */}
            {exploreCreatorsSection}

            {/* Remaining posts */}
            {postsAfterExplore.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}


