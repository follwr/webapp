'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Image as ImageIcon, Play, Bookmark } from 'lucide-react'
import { savedApi } from '@/lib/api/saved'
import { Post } from '@/lib/types'

export default function SavedPostsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user) return
      
      try {
        setLoadingPosts(true)
        const posts = await savedApi.getSavedPosts()
        setSavedPosts(posts)
      } catch (error) {
        console.error('Failed to load saved posts:', error)
      } finally {
        setLoadingPosts(false)
      }
    }

    if (user && !loading) {
      fetchSavedPosts()
    }
  }, [user, loading])

  // Check if media is video
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext))
  }

  if (loading || loadingPosts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200 relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Saved Posts
        </h1>
      </div>

      {/* Posts Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Bookmark className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              No saved posts yet
            </p>
            <p className="text-gray-400 text-sm mt-2 text-center">
              Tap the bookmark icon on posts to save them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {savedPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => router.push(`/saved/${post.id}`)}
                className="relative rounded-3xl overflow-hidden aspect-[3/4] group"
              >
                {post.mediaUrls && post.mediaUrls.length > 0 ? (
                  <>
                    {isVideo(post.mediaUrls[0]) ? (
                      <video
                        src={post.mediaUrls[0]}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={post.mediaUrls[0]}
                        alt={post.content || 'Saved post'}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Play icon overlay for videos */}
                    {isVideo(post.mediaUrls[0]) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-6">
                    {/* Icon for posts without media */}
                    <div className="w-24 h-24 mb-4">
                      <div className="w-24 h-24 rounded-full bg-blue-300/50 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-blue-600/40" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Caption */}
                    <p className="text-sm text-gray-700 text-center line-clamp-3 px-2">
                      {post.content || 'No caption'}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

