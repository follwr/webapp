'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Heart, MessageCircle, DollarSign, Share2, Bookmark, MoreVertical, Clock, FileText, Copy } from 'lucide-react'

// Mock purchased item data
const mockItem = {
  id: '1',
  creator: {
    name: 'Bronte Sheppeard',
    username: 'brontesheppeard',
    isVerified: true,
    avatar: null,
  },
  imageUrl: null,
  caption: 'Exclusive content & the only place I respond to all messages. Come join the fun. I\'m 19 years old and I love to lift heavy weights.',
  likes: 231,
  comments: 0,
  isLiked: false,
  isSaved: false,
  timestamp: 'Yesterday',
  price: 25.00,
  type: 'product', // could be 'post', 'product', 'dm'
  fileCount: 3,
  hasDownloadableFiles: true,
}

export default function PurchasedItemDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [isLiked, setIsLiked] = useState(mockItem.isLiked)
  const [isSaved, setIsSaved] = useState(mockItem.isSaved)
  const [likeCount, setLikeCount] = useState(mockItem.likes)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleDownload = () => {
    console.log('Downloading item:', params.itemId)
    // TODO: Navigate to file download page or trigger download
    router.push(`/purchased/${params.itemId}/files`)
  }

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
          Purchased Posts
        </h1>
      </div>

      {/* Post Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Creator Info */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-400 flex-shrink-0" />
            
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 text-base">
                  {mockItem.creator.name}
                </h3>
                {mockItem.creator.isVerified && (
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    <circle cx="12" cy="12" r="10" fill="currentColor"/>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500">
                @{mockItem.creator.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-500">
              <span className="text-sm">{mockItem.timestamp}</span>
              <Clock className="w-4 h-4" />
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {mockItem.hasDownloadableFiles ? (
          // Downloadable Product Card
          <div className="px-4 pb-4">
            <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6 min-h-[500px] flex flex-col items-center justify-center">
              {/* Paid Badge */}
              <div className="absolute top-5 left-5">
                <div className="px-4 py-2 bg-green-400 rounded-full">
                  <span className="text-white font-semibold text-sm">
                    Paid: ${mockItem.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* File Count Badge */}
              <div className="absolute top-5 right-5">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                  <span className="text-gray-900 font-semibold text-base">
                    {mockItem.fileCount}
                  </span>
                  <Copy className="w-5 h-5 text-gray-700" strokeWidth={2} />
                </div>
              </div>

              {/* File Icon */}
              <div className="w-32 h-32 mb-8">
                <div className="w-32 h-32 rounded-full bg-blue-300/50 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-600/40" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Download Files Button */}
              <button
                onClick={handleDownload}
                className="w-full max-w-md flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 rounded-3xl transition-colors shadow-sm"
              >
                <span className="text-lg font-medium text-gray-900">
                  Download Files
                </span>
                <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        ) : mockItem.imageUrl ? (
          // Regular Post Image
          <div className="w-full">
            <img
              src={mockItem.imageUrl}
              alt="Purchased item"
              className="w-full object-cover"
            />
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center gap-6 px-4 py-4">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Heart
              className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`}
              strokeWidth={1.5}
            />
            <span className="text-base font-medium text-gray-900">{likeCount}</span>
          </button>

          {/* Comments */}
          <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <MessageCircle className="w-7 h-7 text-gray-900" strokeWidth={1.5} />
            <span className="text-base font-medium text-gray-900">{mockItem.comments}</span>
          </button>

          {/* Price Badge */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex-1" />

          {/* Share */}
          <button className="hover:opacity-70 transition-opacity">
            <Share2 className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
          </button>

          {/* Bookmark */}
          <button
            onClick={handleSave}
            className="hover:opacity-70 transition-opacity"
          >
            <Bookmark
              className={`w-6 h-6 ${isSaved ? 'fill-gray-900 text-gray-900' : 'text-gray-900'}`}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Caption */}
        <div className="px-4 pb-6">
          <p className="text-[15px] text-gray-900 leading-relaxed">
            <span className="font-semibold">{mockItem.creator.name}</span>{' '}
            {mockItem.caption}
          </p>
        </div>
      </div>
    </div>
  )
}

