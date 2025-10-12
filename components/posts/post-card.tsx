'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Info, Share2, Bookmark, MoreVertical, CheckCircle2, Lock, Volume2, VolumeX } from 'lucide-react'
import { postsApi } from '@/lib/api/posts'
import { formatDistanceToNow } from 'date-fns'
import { getCreatorDisplayName, getCreatorUsername, getCreatorProfilePicture } from '@/lib/utils/profile'
import { Button } from '@/components/ui/button'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.totalLikes)
  const [isSaved, setIsSaved] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)

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

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault()
    const video = e.currentTarget
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (video) {
      video.muted = !video.muted
      setIsMuted(video.muted)
    }
  }

  const creatorDisplayName = getCreatorDisplayName(post.creator)
  const creatorUsername = getCreatorUsername(post.creator)
  const creatorProfilePicture = getCreatorProfilePicture(post.creator)
  
  // Safety check - if no creator, return null
  if (!post.creator) {
    console.error('PostCard: post.creator is undefined for post', post.id)
    return null
  }

  // Check if media is video
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext))
  }

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link 
          href={`/${creatorUsername}`}
          className="flex items-center gap-3"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={creatorProfilePicture} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {creatorDisplayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-900 text-sm">
                {creatorDisplayName}
              </p>
              {post.creator?.isVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              @{creatorUsername}
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

      {/* Media or Locked Content */}
      {post.requiresPurchase ? (
        // Paid content that hasn't been purchased
        <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Exclusive Content</h3>
            <p className="text-gray-600 mb-6">
              Unlock this post to view exclusive content
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
              Unlock for ${post.price}
            </Button>
          </div>
        </div>
      ) : post.mediaUrls && post.mediaUrls.length > 0 ? (
        // Regular content
        <div className="w-full relative">
          {isVideo(post.mediaUrls[0]) ? (
            <>
              <video
                ref={videoRef}
                src={post.mediaUrls[0]}
                className="w-full object-cover cursor-pointer"
                style={{ maxHeight: '600px' }}
                playsInline
                loop
                muted={isMuted}
                preload="metadata"
                onClick={handleVideoClick}
              />
              {/* Mute/Unmute button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors z-10"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </>
          ) : (
            <img
              src={post.mediaUrls[0]}
              alt="Post media"
              className="w-full object-cover"
              style={{ maxHeight: '600px' }}
            />
          )}
        </div>
      ) : null}

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
              href={`/${creatorUsername}`}
              className="font-semibold hover:underline"
            >
              {creatorDisplayName}
            </Link>{' '}
            <span className="whitespace-pre-wrap">{post.content}</span>
          </p>
        </div>
      )}
    </div>
  )
}
