'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { CreateHeader } from '@/components/nav/create-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, Image as ImageIcon, Video as VideoIcon, DollarSign, Radio, X } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { postsApi } from '@/lib/api/posts'
import { uploadApi } from '@/lib/api/upload'

interface MediaFile {
  id: string
  type: 'image' | 'video'
  url: string
  file: File
}

export default function CreatePage() {
  const { user, userProfile, creatorProfile, isCreator, loading } = useAuth()
  const router = useRouter()
  const [postContent, setPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [visibility, setVisibility] = useState<'all' | 'subscribers'>('all')
  const [price, setPrice] = useState('')
  const [checkingCreator, setCheckingCreator] = useState(true)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Separate effect to check creator status after auth is loaded
  useEffect(() => {
    if (!loading && user) {
      // Give it a moment to load creator profile
      const timer = setTimeout(() => {
        console.log('Creator check:', {
          isCreator,
          creatorProfile,
          userProfile,
          user: user?.email
        })
        setCheckingCreator(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [loading, user, isCreator, creatorProfile, userProfile])

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
    // Check if user is a creator
    if (!isCreator) {
      alert('You need to become a creator to post content. Redirecting to creator signup...')
      router.push('/creator-signup')
      return
    }

    // Validate that there's content or media
    if (!postContent.trim() && mediaFiles.length === 0) {
      alert('Please add some content or media to your post')
      return
    }

    setIsPosting(true)
    try {
      // Upload media files if any
      let mediaUrls: string[] = []
      if (mediaFiles.length > 0) {
        console.log('Uploading media files...')
        
        // Upload all media files in parallel
        const uploadPromises = mediaFiles.map(media => 
          uploadApi.uploadFileComplete(media.file)
        )
        mediaUrls = await Promise.all(uploadPromises)
        
        console.log('Media uploaded successfully:', mediaUrls)
      }

      // Map visibility to backend format
      const visibilityMap = {
        'all': 'public' as const,
        'subscribers': 'subscribers' as const,
      }

      // Create the post
      console.log('Creating post...')
      await postsApi.createPost({
        content: postContent.trim() || undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        visibility: visibilityMap[visibility],
        price: price ? parseFloat(price) : undefined,
      })

      console.log('Post created successfully!')
      
      // Redirect to feed
      router.push('/feed')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  if (loading || checkingCreator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <CreateHeader 
        onPost={handlePost} 
        isLoading={isPosting}
        displayName={userProfile?.displayName || user?.user_metadata?.full_name}
        username={userProfile?.username || user?.email?.split('@')[0]}
        profilePictureUrl={userProfile?.profilePictureUrl || user?.user_metadata?.avatar_url}
      />
      
      <div className="pt-20 pb-6 px-4">
        {/* User Info */}
        <div className="flex items-start gap-3 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userProfile?.profilePictureUrl || user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {userProfile?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {userProfile?.displayName || user?.user_metadata?.full_name || 'User Name'}
            </h3>
            <p className="text-sm text-gray-500">
              @{userProfile?.username || user?.email?.split('@')[0] || 'username'}
            </p>
          </div>
          
          {/* Visibility Button */}
          <button 
            onClick={() => setIsVisibilityModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">
              {visibility === 'all' ? 'All Follwrs' : 'Subscribers'}
            </span>
          </button>
        </div>

        {/* Media Area */}
        {mediaFiles.length > 0 ? (
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {mediaFiles.map((media) => (
              <div key={media.id} className="relative w-48 h-64 flex-shrink-0">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}
                <button
                  onClick={() => removeMedia(media.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-gray-800/70 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4 min-h-[300px]">
            {/* Empty space placeholder for media */}
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
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setIsPriceModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              price 
                ? 'bg-gray-100 hover:bg-gray-200' 
                : 'hover:bg-gray-100 rounded-xl'
            }`}
          >
            {price ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-gray-700" strokeWidth={3} />
                </div>
                <span className="font-medium text-gray-900">Price: ${price}</span>
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5 text-gray-700" />
                <span className="font-medium">Set Price</span>
              </>
            )}
          </button>
          <button 
            onClick={() => imageInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-xl" 
            aria-label="Add image"
          >
            <ImageIcon className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => videoInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-xl" 
            aria-label="Add video"
          >
            <VideoIcon className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl">
            <Radio className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Text Content Area */}
        <div className="mb-4">
          {postContent === '' && (
            <div className="px-4 py-3 text-gray-400 pointer-events-none">
              Write something...
            </div>
          )}
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder=""
            className={`w-full min-h-[100px] px-4 py-3 border-0 focus:outline-none resize-none text-gray-900 ${postContent === '' ? '-mt-[52px]' : ''}`}
          />
        </div>
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
                    checked={visibility === 'all'}
                    onChange={() => setVisibility('all')}
                    className="w-5 h-5 text-blue-600 accent-blue-600"
                  />
                  <span className="text-lg text-gray-900">All followers</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'subscribers'}
                    onChange={() => setVisibility('subscribers')}
                    className="w-5 h-5 text-blue-600 accent-blue-600"
                  />
                  <span className="text-lg text-gray-900">Only subscribers</span>
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
    </>
  )
}
