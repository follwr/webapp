'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { Heart, LayoutGrid, DollarSign, MessageCircle, UserPlus, Image as ImageIcon } from 'lucide-react'
import { creatorsApi } from '@/lib/api/creators'
import { productsApi } from '@/lib/api/products'
import { followsApi } from '@/lib/api/follows'
import { CreatorProfile, Post } from '@/lib/types'
import { Product } from '@/lib/api/products'

export default function CreatorProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const username = params.username as string
  
  const [activeTab, setActiveTab] = useState<'posts' | 'slides' | 'products'>('posts')
  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!username) return
      
      try {
        setLoadingData(true)
        const data = await creatorsApi.getByUsername(username)
        setCreator(data)
        setPosts(data.posts || [])

        // Fetch products
        if (data.id) {
          const productData = await productsApi.listProducts(data.id)
          setProducts(productData)
        }
      } catch (error) {
        console.error('Failed to load creator:', error)
      } finally {
        setLoadingData(false)
      }
    }

    if (user) {
      fetchCreatorData()
    }
  }, [username, user])

  const handleSubscribe = () => {
    console.log('Subscribe clicked')
    router.push(`/subscriptions/${creator?.id}`)
  }

  const handleFollow = async () => {
    if (!creator) return
    
    try {
      if (isFollowing) {
        await followsApi.unfollow(creator.id)
      } else {
        await followsApi.follow(creator.id)
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  const handleMessage = () => {
    if (creator) {
      router.push(`/messages/${creator.userId}`)
    }
  }

  const handleTip = () => {
    console.log('Tip clicked')
    // TODO: Open tip modal
  }

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Creator not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6 pt-16">
        {/* Cover Image / Banner */}
        <div className="relative mx-4 mb-4 rounded-3xl overflow-hidden h-96 bg-gradient-to-b from-gray-300 to-gray-500">
          {creator.coverImageUrl ? (
            <img src={creator.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
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
                {creator.displayName}
              </h1>
              {creator.isVerified && (
                <svg className="w-7 h-7 text-blue-500 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                </svg>
              )}
            </div>
            <p className="text-white text-base mb-4 drop-shadow-lg">
              @{creator.username}
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white drop-shadow-lg">
                <Heart className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">{creator.totalLikes} Likes</span>
              </div>
              <div className="flex items-center gap-2 text-white drop-shadow-lg">
                <LayoutGrid className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">{creator.totalPosts} Posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 mb-6">
          <p className="text-center text-[15px] text-gray-700 leading-relaxed">
            {creator.bio}
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
            {activeTab === 'posts' && posts.map((post) => (
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
                    {post.content || 'No caption'}
                  </p>
                  
                  {/* Follow Button */}
                  <button className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-full transition-colors shadow-sm text-sm">
                    Follow
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'slides' && posts.filter(p => p.mediaUrls && p.mediaUrls.length > 0).map((slide) => (
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
                    {slide.content || 'No caption'}
                  </p>
                  
                  {/* Follow Button */}
                  <button className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-full transition-colors shadow-sm text-sm">
                    Follow
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'products' && products.map((product) => (
              <button
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 aspect-[3/4] hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col h-full">
                  {/* Product Image */}
                  <div className="flex-1 relative bg-gray-200">
                    {product.productImageUrl && (
                      <img
                        src={product.productImageUrl}
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

