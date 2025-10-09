'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { Heart, LayoutGrid, DollarSign, MessageCircle, UserPlus, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

// Mock creator data
const mockCreator = {
  id: '1',
  displayName: 'Bronte Sheppeard',
  username: 'brontesheppeard',
  isVerified: true,
  coverImageUrl: null, // Use gradient for mock
  profilePictureUrl: null,
  bio: 'Exclusive content & the only place I respond to all messages. Come join the fun. I\'m 19 years old and I love to lift heavy weights.',
  totalLikes: 17,
  totalPosts: 42,
  subscriptionPrice: 9.99,
  isSubscribed: false,
  isFollowing: false,
}

// Mock posts
const mockPosts = [
  { id: '1', caption: 'Gymmmmieee. Feeling cute but weak. One week into my first..', isLocked: true, imageUrl: null },
  { id: '2', caption: 'Behind the scenes of my first ever fitness shoot', isLocked: true, imageUrl: null },
  { id: '3', caption: 'Meet & Greet 🤝', isLocked: true, imageUrl: null },
  { id: '4', caption: 'Gym selfie', isLocked: true, imageUrl: null },
]

// Mock products
const mockProducts = [
  { id: '1', title: 'My custom gym program', price: 29.99, imageUrl: '/mock/example.png' },
  { id: '2', title: '10 week meal plan guide', price: 19.99, imageUrl: '/mock/example.png' },
  { id: '3', title: '10 weeks custom gym program + meal plan guide', price: 49.99, imageUrl: '/mock/example.png' },
]

// Mock slides
const mockSlides = [
  { id: '1', caption: 'My fitness journey', isLocked: true, imageUrl: null },
  { id: '2', caption: 'Workout tips & tricks', isLocked: true, imageUrl: null },
]

export default function CreatorProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'posts' | 'slides' | 'products'>('posts')
  const [isSubscribed, setIsSubscribed] = useState(mockCreator.isSubscribed)
  const [isFollowing, setIsFollowing] = useState(mockCreator.isFollowing)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleSubscribe = () => {
    console.log('Subscribe clicked')
    // TODO: Navigate to subscription flow
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    console.log('Follow toggled')
  }

  const handleMessage = () => {
    router.push(`/messages/${mockCreator.id}`)
  }

  const handleTip = () => {
    console.log('Tip clicked')
    // TODO: Open tip modal
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
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6 pt-16">
        {/* Cover Image / Banner */}
        <div className="relative mx-4 mb-4 rounded-3xl overflow-hidden h-96 bg-gradient-to-b from-gray-300 to-gray-500">
          {mockCreator.coverImageUrl ? (
            <img src={mockCreator.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400" />
          )}
          
          {/* Action Icons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleTip}
              className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <DollarSign className="w-5 h-5 text-gray-900" strokeWidth={2} />
            </button>
            <button
              onClick={handleMessage}
              className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-900" strokeWidth={2} />
            </button>
          </div>

          {/* Creator Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                {mockCreator.displayName}
              </h1>
              {mockCreator.isVerified && (
                <svg className="w-7 h-7 text-blue-500 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                </svg>
              )}
            </div>
            <p className="text-white text-base mb-4 drop-shadow-lg">
              @{mockCreator.username}
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white drop-shadow-lg">
                <Heart className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">{mockCreator.totalLikes} Likes</span>
              </div>
              <div className="flex items-center gap-2 text-white drop-shadow-lg">
                <LayoutGrid className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">{mockCreator.totalPosts} Posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 mb-6">
          <p className="text-center text-[15px] text-gray-700 leading-relaxed">
            {mockCreator.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 mb-6 flex gap-3">
          <button
            onClick={handleSubscribe}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors"
          >
            <UserPlus className="w-5 h-5" strokeWidth={2} />
            <span>Subscribe</span>
          </button>
          
          <button
            onClick={handleFollow}
            className={`flex-1 px-6 py-3.5 font-semibold rounded-full transition-colors ${
              isFollowing
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                : 'bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-900'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-6 flex gap-3">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors ${
              activeTab === 'posts'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            <span>Posts</span>
          </button>
          
          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors ${
              activeTab === 'slides'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
            <span>Slides</span>
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Products</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-4">
            {activeTab === 'posts' && mockPosts.map((post) => (
              <div
                key={post.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 aspect-[3/4]"
              >
                <div className="flex flex-col items-center justify-center h-full p-6">
                  {/* Lock Icon */}
                  <div className="w-24 h-24 mb-4">
                    <div className="w-24 h-24 rounded-full bg-blue-300/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-blue-600/40" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-sm text-gray-700 text-center mb-4 line-clamp-2 px-2">
                    {post.caption}
                  </p>
                  
                  {/* Follow Button */}
                  <button className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-full transition-colors shadow-sm text-sm">
                    Follow
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'slides' && mockSlides.map((slide) => (
              <div
                key={slide.id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 aspect-[3/4]"
              >
                <div className="flex flex-col items-center justify-center h-full p-6">
                  {/* Lock Icon */}
                  <div className="w-24 h-24 mb-4">
                    <div className="w-24 h-24 rounded-full bg-blue-300/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-blue-600/40" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-sm text-gray-700 text-center mb-4 line-clamp-2 px-2">
                    {slide.caption}
                  </p>
                  
                  {/* Follow Button */}
                  <button className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-full transition-colors shadow-sm text-sm">
                    Follow
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'products' && mockProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 aspect-[3/4] hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col h-full">
                  {/* Product Image */}
                  <div className="flex-1 relative bg-gray-200">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="bg-white p-4">
                    <p className="text-sm text-gray-900 mb-3 line-clamp-2 font-medium text-left">
                      {product.title}
                    </p>
                    
                    {/* Buy Button */}
                    <span className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 font-medium rounded-full text-sm">
                      Buy ${product.price}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

