'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Image as ImageIcon } from 'lucide-react'

// Mock saved posts
const mockSavedPosts = [
  {
    id: '1',
    imageUrl: '/mock/example.png',
    hasAccess: true,
    caption: null,
  },
  {
    id: '2',
    imageUrl: null,
    hasAccess: false,
    caption: 'Gymmmmieee. Feeling cute but weak. One week into my first..',
  },
  {
    id: '3',
    imageUrl: null,
    hasAccess: false,
    caption: 'Gymmmmieee. Feeling cute but weak. One week into my first..',
  },
  {
    id: '4',
    imageUrl: '/mock/example.png',
    hasAccess: true,
    caption: null,
  },
]

export default function SavedPostsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
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
        <div className="grid grid-cols-2 gap-4">
          {mockSavedPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => post.hasAccess && router.push(`/saved/${post.id}`)}
              className={`relative rounded-3xl overflow-hidden bg-white border border-gray-100 ${
                post.hasAccess ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {post.hasAccess && post.imageUrl ? (
                // Post with image access
                <div className="aspect-[3/4] relative">
                  <img
                    src={post.imageUrl}
                    alt="Saved post"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Locked post
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-6">
                  {/* Lock Icon */}
                  <div className="w-24 h-24 mb-4 relative">
                    <div className="w-24 h-24 rounded-full bg-blue-300/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-blue-600/40" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  {post.caption && (
                    <p className="text-sm text-gray-700 text-center mb-4 line-clamp-2 px-2">
                      {post.caption}
                    </p>
                  )}
                  
                  {/* Subscribe Button */}
                  <span className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-full transition-colors shadow-sm text-sm">
                    Subscribe
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

