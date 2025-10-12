'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { postsApi } from '@/lib/api/posts'
import { Post } from '@/lib/types'
import { PostCard } from '@/components/posts/post-card'
import { ChevronLeft } from 'lucide-react'

export default function SavedPostDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const postId = params.postId as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [loadingPost, setLoadingPost] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPost = async () => {
      if (!user || !postId) return
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(postId)) {
        setError('Invalid post ID')
        setLoadingPost(false)
        return
      }
      
      try {
        setLoadingPost(true)
        const data = await postsApi.getPost(postId)
        setPost(data)
      } catch (error) {
        setError('Post not found')
      } finally {
        setLoadingPost(false)
      }
    }

    if (user && !loading) {
      fetchPost()
    }
  }, [user, loading, postId])

  if (loading || loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">{error || 'Post not found'}</p>
        <button
          onClick={() => router.push('/saved')}
          className="text-blue-600 hover:underline"
        >
          Back to Saved Posts
        </button>
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
          Post
        </h1>
      </div>

      {/* Post Content - Use PostCard component */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <PostCard post={post} />
        </div>
      </div>
    </div>
  )
}

