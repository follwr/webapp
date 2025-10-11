'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Info, Share2, Bookmark, MoreVertical, CheckCircle2 } from 'lucide-react'
import { postsApi } from '@/lib/api/posts'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.totalLikes)
  const [isSaved, setIsSaved] = useState(false)

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postsApi.unlikePost(post.id)
      } else {
        await postsApi.likePost(post.id)
      }
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    // TODO: Implement save API call
  }

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link 
          href={`/creators/${post.creator?.username}`}
          className="flex items-center gap-3"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.creator?.profilePictureUrl} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {post.creator?.displayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-900 text-sm">
                {post.creator?.displayName}
              </p>
              {post.creator?.isVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              @{post.creator?.username}
            </p>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            {post.publishedAt && formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }).replace('about ', '')}
          </span>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="w-full">
          <img
            src={post.mediaUrls[0]}
            alt="Post media"
            className="w-full object-cover"
            style={{ maxHeight: '600px' }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <Heart 
              className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-medium">{post.totalComments || 0}</span>
          </button>
          
          {post.price && post.price > 0 && (
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <Info className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-gray-900">
            <Share2 className="h-6 w-6" />
          </button>
          
          <button 
            onClick={handleSave}
            className="text-gray-700 hover:text-gray-900"
          >
            <Bookmark className={`h-6 w-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Caption */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-900">
            <Link 
              href={`/creators/${post.creator?.username}`}
              className="font-semibold hover:underline"
            >
              {post.creator?.displayName}
            </Link>{' '}
            <span className="whitespace-pre-wrap">{post.content}</span>
          </p>
        </div>
      )}
    </div>
  )
}
