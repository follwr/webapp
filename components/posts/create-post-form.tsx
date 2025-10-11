'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, Image as ImageIcon, Video as VideoIcon, DollarSign, X } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { postsApi } from '@/lib/api/posts'
import { uploadApi } from '@/lib/api/upload'
import { getCreatorDisplayName, getCreatorUsername, getCreatorProfilePicture } from '@/lib/utils/profile'

interface MediaFile {
  id: string
  type: 'image' | 'video'
  url: string
  file: File
}

interface CreatePostFormProps {
  onPostCreated?: () => void
  compact?: boolean
}

export function CreatePostForm({ onPostCreated, compact = false }: CreatePostFormProps) {
  const { user, userProfile, creatorProfile } = useAuth()
  const [postContent, setPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'subscribers'>('public')
  const [price, setPrice] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setMediaFiles((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'image',
              url: reader.result as string,
              file,
            },
          ])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setMediaFiles((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'video',
              url: reader.result as string,
              file,
            },
          ])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => prev.filter((media) => media.id !== id))
  }

  const handlePost = async () => {
    try {
      setIsPosting(true)
      
      // Upload media files first
      const mediaUrls: string[] = []
      for (const media of mediaFiles) {
        try {
          const uploadedUrl = await uploadApi.uploadFileComplete(media.file)
          mediaUrls.push(uploadedUrl)
        } catch (uploadError) {
          console.error('Media upload failed:', uploadError)
        }
      }

      // Create the post
      await postsApi.createPost({
        content: postContent || undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        visibility,
        price: price ? parseFloat(price) : undefined,
      })

      // Reset form
      setPostContent('')
      setMediaFiles([])
      setPrice('')
      setVisibility('public')
      
      // Callback to parent
      onPostCreated?.()
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  const displayName = getCreatorDisplayName(creatorProfile) || userProfile?.displayName || 'User'
  const username = getCreatorUsername(creatorProfile) || userProfile?.username || 'username'
  const profilePicture = getCreatorProfilePicture(creatorProfile) || userProfile?.profilePictureUrl

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 ${compact ? 'p-4' : 'p-6'}`}>
      {/* User Info */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePicture} />
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            {displayName}
          </h3>
          <p className="text-xs text-gray-500">
            @{username}
          </p>
        </div>
        
        {/* Visibility Button */}
        <button 
          onClick={() => setIsVisibilityModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 text-xs"
        >
          <Eye className="w-3 h-3" />
          <span className="font-medium">
            {visibility === 'public' ? 'Public' : visibility === 'followers' ? 'Followers' : 'Subscribers'}
          </span>
        </button>
      </div>

      {/* Text Content Area */}
      <div className="mb-3">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Write something..."
          className="w-full min-h-[80px] px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
        />
      </div>

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
          {mediaFiles.map((media) => (
            <div key={media.id} className="relative w-32 h-32 flex-shrink-0">
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <video
                  src={media.url}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
              <button
                onClick={() => removeMedia(media.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800/70 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPriceModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs ${
              price 
                ? 'bg-gray-100 hover:bg-gray-200' 
                : 'hover:bg-gray-100'
            }`}
          >
            {price ? (
              <>
                <DollarSign className="w-4 h-4 text-gray-700" />
                <span className="font-medium text-gray-900">${price}</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 text-gray-700" />
                <span className="font-medium">Price</span>
              </>
            )}
          </button>
          <button 
            onClick={() => imageInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-xl" 
            aria-label="Add image"
          >
            <ImageIcon className="w-4 h-4 text-gray-700" />
          </button>
          <button 
            onClick={() => videoInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-xl" 
            aria-label="Add video"
          >
            <VideoIcon className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <PrimaryButton
          onClick={handlePost}
          disabled={isPosting || (!postContent.trim() && mediaFiles.length === 0)}
          className="text-sm px-6 py-2"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </PrimaryButton>
      </div>

      {/* Set Price Modal */}
      {isPriceModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsPriceModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Set Price
                </h3>
                <button
                  onClick={() => setIsPriceModalOpen(false)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Price Input */}
              <div className="mb-6">
                <div className="flex items-center gap-4 px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-5xl text-blue-400 font-light">$</div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Price</div>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="40"
                      className="w-full text-4xl bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <PrimaryButton
                onClick={() => setIsPriceModalOpen(false)}
                className="text-lg"
              >
                Confirm
              </PrimaryButton>
            </div>
          </div>
        </>
      )}

      {/* Visibility Modal */}
      {isVisibilityModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsVisibilityModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Who can see this post?
                </h3>
                <button
                  onClick={() => setIsVisibilityModalOpen(false)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="w-5 h-5 text-blue-600 accent-blue-600"
                  />
                  <span className="text-lg text-gray-900">Public</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'followers'}
                    onChange={() => setVisibility('followers')}
                    className="w-5 h-5 text-blue-600 accent-blue-600"
                  />
                  <span className="text-lg text-gray-900">Followers only</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'subscribers'}
                    onChange={() => setVisibility('subscribers')}
                    className="w-5 h-5 text-blue-600 accent-blue-600"
                  />
                  <span className="text-lg text-gray-900">Subscribers only</span>
                </label>
              </div>

              {/* Confirm Button */}
              <PrimaryButton
                onClick={() => setIsVisibilityModalOpen(false)}
                className="text-lg"
              >
                Confirm
              </PrimaryButton>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

