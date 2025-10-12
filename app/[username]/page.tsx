'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { Heart, LayoutGrid, DollarSign, MessageCircle, UserPlus, Image as ImageIcon, Settings, Play } from 'lucide-react'
import { creatorsApi } from '@/lib/api/creators'
import { productsApi } from '@/lib/api/products'
import { followsApi } from '@/lib/api/follows'
import { subscriptionsApi } from '@/lib/api/subscriptions'
import { CreatorProfile, Post } from '@/lib/types'
import { Product } from '@/lib/api/products'
import { PostCard } from '@/components/posts/post-card'
import { getCreatorDisplayName, getCreatorUsername, getCreatorBio } from '@/lib/utils/profile'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Button } from '@/components/ui/button'

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
  const [isHoveringFollow, setIsHoveringFollow] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const hasFetchedRef = useRef<string | null>(null)
  
  // Check if viewing own profile
  const isOwnProfile = user?.id === creator?.userId

  // Check if media is video
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext))
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!username) return
      
      // Prevent duplicate fetches for the same username
      if (hasFetchedRef.current === username) return
      hasFetchedRef.current = username
      
      try {
        setLoadingData(true)
        const data = await creatorsApi.getByUsername(username)
        setCreator(data)
        
        // Create a clean creator object for posts (without nested posts to avoid circular reference)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { posts: _posts, ...creatorWithoutPosts } = data
        
        // Ensure all posts have the creator field populated with userProfile
        const postsWithCreator = (data.posts || []).map(post => ({
          ...post,
          creator: creatorWithoutPosts
        }))
        setPosts(postsWithCreator)
        
        // Set follow status from backend response
        setIsFollowing(data.isFollowing || false)

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

    if (user && !loading) {
      fetchCreatorData()
    }
  }, [username, user, loading])

  const handleSubscribe = async () => {
    if (!creator) return
    
    if (!creator.subscriptionPrice || creator.subscriptionPrice === 0) {
      alert('This creator hasn\'t set up subscriptions yet')
      return
    }

    try {
      setSubscribing(true)
      const { checkoutUrl } = await subscriptionsApi.createCheckoutSession(creator.id)
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Failed to create checkout session:', error)
      alert('Failed to start subscription. Please try again.')
      setSubscribing(false)
    }
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
          {!isOwnProfile && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                onClick={handleTip}
                size="icon"
                variant="secondary"
                className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full shadow-lg"
              >
                <DollarSign className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </Button>
              <Button
                onClick={handleMessage}
                size="icon"
                variant="secondary"
                className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </Button>
            </div>
          )}

          {/* Creator Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                {getCreatorDisplayName(creator)}
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
              @{getCreatorUsername(creator)}
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
        {getCreatorBio(creator) && (
          <div className="px-6 mb-6">
            <p className="text-center text-[15px] text-gray-700 leading-relaxed">
              {getCreatorBio(creator)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 mb-6 flex gap-3">
          {isOwnProfile ? (
            // Own profile - Show Edit Profile button
            <PrimaryButton
              onClick={() => router.push('/settings/profile')}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Settings className="w-5 h-5" strokeWidth={2} />
              <span>Edit Profile</span>
            </PrimaryButton>
          ) : (
            // Other's profile - Show Subscribe/Follow buttons
            <>
              <PrimaryButton
                onClick={handleSubscribe}
                disabled={subscribing}
                isLoading={subscribing}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {subscribing ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" strokeWidth={2} />
                    <span>Subscribe</span>
                  </>
                )}
              </PrimaryButton>
              
              <Button
                onClick={handleFollow}
                onMouseEnter={() => setIsHoveringFollow(true)}
                onMouseLeave={() => setIsHoveringFollow(false)}
                variant={isFollowing ? "secondary" : "outline"}
                className={`flex-1 rounded-full ${
                  isFollowing && isHoveringFollow
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : ''
                }`}
              >
                {isFollowing ? (isHoveringFollow ? 'Unfollow' : 'Following') : 'Follow'}
              </Button>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="px-6 mb-6 flex gap-3">
          <Button
            onClick={() => setActiveTab('posts')}
            variant={activeTab === 'posts' ? 'default' : 'secondary'}
            className={`flex items-center gap-2 rounded-full ${
              activeTab === 'posts'
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : ''
            }`}
          >
            <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            <span>Posts</span>
          </Button>
          
          <Button
            onClick={() => setActiveTab('slides')}
            variant={activeTab === 'slides' ? 'default' : 'secondary'}
            className={`flex items-center gap-2 rounded-full ${
              activeTab === 'slides'
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : ''
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
            <span>Slides</span>
          </Button>
          
          <Button
            onClick={() => setActiveTab('products')}
            variant={activeTab === 'products' ? 'default' : 'secondary'}
            className={`flex items-center gap-2 rounded-full ${
              activeTab === 'products'
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : ''
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Products</span>
          </Button>
        </div>

        {/* Content Grid or Feed */}
        <div className="px-4">
          {activeTab === 'posts' && (isFollowing || isOwnProfile) ? (
            // Feed view for followed creators or own profile
            <div className="max-w-2xl mx-auto">
              {posts.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
            </div>
          ) : (
            // Grid view for non-followed creators (locked preview)
            <>
              {activeTab === 'posts' && posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {activeTab === 'posts' && posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => router.push(`/saved/${post.id}`)}
                  className="relative rounded-3xl overflow-hidden aspect-[3/4] group"
                >
                  {post.mediaUrls && post.mediaUrls.length > 0 ? (
                    <>
                      {isVideo(post.mediaUrls[0]) ? (
                        <video
                          src={post.mediaUrls[0]}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={post.mediaUrls[0]}
                          alt={post.content || 'Post'}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Play icon overlay for videos */}
                      {isVideo(post.mediaUrls[0]) && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-6">
                      {/* Lock Icon for posts without media */}
                      <div className="w-24 h-24 mb-4">
                        <div className="w-24 h-24 rounded-full bg-blue-300/50 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-blue-600/40" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Caption */}
                      <p className="text-sm text-gray-700 text-center line-clamp-3 px-2">
                        {post.content || 'No caption'}
                      </p>
                    </div>
                  )}
                </button>
              ))}

              {activeTab === 'slides' && posts.filter(p => p.mediaUrls && p.mediaUrls.length > 0).map((slide) => (
                <button
                  key={slide.id}
                  onClick={() => router.push(`/saved/${slide.id}`)}
                  className="relative rounded-3xl overflow-hidden aspect-[3/4] group"
                >
                  {isVideo(slide.mediaUrls![0]) ? (
                    <>
                      <video
                        src={slide.mediaUrls![0]}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      {/* Play icon overlay for videos */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={slide.mediaUrls![0]}
                      alt={slide.content || 'Slide'}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

