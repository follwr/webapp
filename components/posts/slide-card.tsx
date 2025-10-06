'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Heart, MessageCircle, Bookmark, Share2, Volume2, VolumeX, MoreHorizontal } from 'lucide-react'

interface SlideCardProps {
  id: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  title: string
  description: string
  creatorName: string
  creatorUsername: string
  creatorAvatar?: string
  likes: number
  comments: number
  isLiked?: boolean
}

export function SlideCard({
  mediaUrl,
  mediaType,
  title,
  description,
  creatorName,
  creatorUsername,
  creatorAvatar,
  likes,
  comments,
  isLiked: initialIsLiked = false,
}: SlideCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isMuted, setIsMuted] = useState(true)
  const [likeCount, setLikeCount] = useState(likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <div className="relative w-full h-screen flex-shrink-0 snap-start snap-always bg-white px-4 flex flex-col">
      {/* Media Content Container */}
      <div className="relative mt-20 flex-1 rounded-3xl overflow-hidden bg-black">
        {/* Media Content */}
        {mediaType === 'image' ? (
          <img
            src={mediaUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            src={mediaUrl}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            autoPlay
            playsInline
            muted={isMuted}
          />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Three Dots Menu - Top Right */}
        <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center z-10">
          <MoreHorizontal className="w-6 h-6 text-white drop-shadow-lg" />
        </button>

        {/* Mute Button (for videos) */}
        {mediaType === 'video' && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-16 right-4 w-10 h-10 bg-gray-800/70 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors z-10"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        )}

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-6 z-10">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Heart
                className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              />
            </div>
            {likeCount > 0 && (
              <span className="text-white text-xs font-semibold drop-shadow-lg">
                {likeCount}
              </span>
            )}
          </button>

          {/* Comment Button */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </div>
            {comments > 0 && (
              <span className="text-white text-xs font-semibold drop-shadow-lg">
                {comments}
              </span>
            )}
          </button>

          {/* Bookmark Button */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Bookmark className="w-6 h-6 text-gray-700" />
            </div>
          </button>

          {/* Share Button */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Share2 className="w-6 h-6 text-gray-700" />
            </div>
          </button>
        </div>

        {/* Description - Inside container at bottom left */}
        <div className="absolute bottom-4 left-4 right-20 z-10">
          <p className="text-white text-sm drop-shadow-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Creator Info - Outside container */}
      <div className="flex items-center justify-between gap-3 py-4 pb-24">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={creatorAvatar} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {creatorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {creatorName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              @{creatorUsername}
            </p>
          </div>
        </div>

        {/* Explore Membership Button */}
        <PrimaryButton className="flex-shrink-0 w-auto text-sm px-5 py-2">
          Explore membership
        </PrimaryButton>

        {/* Plus Button */}
        <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
          <span className="text-gray-900 text-2xl font-light leading-none mb-0.5">+</span>
        </button>
      </div>
    </div>
  )
}
