'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/nav/bottom-nav'
import { SlideCard } from '@/components/posts/slide-card'
import { Search } from 'lucide-react'
import { creatorsApi } from '@/lib/api/creators'
import { CreatorProfile } from '@/lib/types'
import { getCreatorDisplayName, getCreatorUsername, getCreatorProfilePicture } from '@/lib/utils/profile'

export default function ExplorePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Explore')
  const [creators, setCreators] = useState<CreatorProfile[]>([])
  const [loadingCreators, setLoadingCreators] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'popular'>('trending')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoadingCreators(true)
        const data = await creatorsApi.listCreators({
          q: searchQuery || undefined,
          page: 1,
          limit: 20,
          sort: sortBy
        })
        setCreators(data)
      } catch (error) {
        console.error('Failed to load creators:', error)
        setCreators([])
      } finally {
        setLoadingCreators(false)
      }
    }

    if (user) {
      // Debounce search
      const timeoutId = setTimeout(() => {
        fetchCreators()
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [user, searchQuery, sortBy])

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <BottomNav />
      </>
    )
  }

  const tabs = ['Explore', 'Slides', 'Live']
  const categories = ['Fitness', 'Podcast', 'Videography', 'Modelling', 'Crypto']

  // Sample slides data - replace with actual API data
  const sampleSlides = [
    {
      id: '1',
      mediaUrl: '/mock/example.png',
      mediaType: 'image' as const,
      title: "Let's Pack My Daughter's Lunch",
      description: "Exclusive content & the only place I respond to all messages. Come join the fun. I'm 19 years old and I love to lift heavy weights.",
      creatorName: 'Bronte Sheppeard',
      creatorUsername: 'brontesheppeard',
      creatorAvatar: '',
      likes: 1234,
      comments: 89,
      isLiked: false,
    },
    {
      id: '2',
      mediaUrl: '/mock/example.png',
      mediaType: 'image' as const,
      title: 'Morning Workout Routine',
      description: "Join me for my daily workout session. Let's get fit together! Subscribe for exclusive fitness content.",
      creatorName: 'Fitness Pro',
      creatorUsername: 'fitnesspro',
      creatorAvatar: '',
      likes: 2456,
      comments: 145,
      isLiked: false,
    },
    {
      id: '3',
      mediaUrl: '/mock/example.png',
      mediaType: 'image' as const,
      title: 'Cooking with Love',
      description: "Today I'm making my favorite pasta dish. Follow along and let me know what you think!",
      creatorName: 'Chef Maria',
      creatorUsername: 'chefmaria',
      creatorAvatar: '',
      likes: 3891,
      comments: 267,
      isLiked: false,
    },
  ]

  // Show slides view when Slides tab is active
  if (activeTab === 'Slides') {
    return (
      <>
        {/* Fixed Tabs at Top */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white pt-2">
          <div className="bg-gray-100 rounded-2xl mx-4 mt-2 p-1 flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Scrollable Slides */}
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth">
          {sampleSlides.map((slide) => (
            <SlideCard key={slide.id} {...slide} />
          ))}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <div className="pb-20">
        {/* Tabs */}
        <div className="bg-gray-100 rounded-2xl mx-4 mt-4 p-1 flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mx-4 mt-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a creator"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Explore Creators Title */}
        <h2 className="text-2xl font-bold px-4 mb-4">Explore creators</h2>

        {/* Sort Options */}
        <div className="flex gap-2 px-4 mb-6 overflow-x-auto no-scrollbar">
          {(['trending', 'newest', 'popular'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                sortBy === sort
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Carousel - Placeholder */}
        <div className="mb-6">
          <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
            <div className="w-48 aspect-[9/16] bg-gray-200 rounded-2xl flex-shrink-0"></div>
            <div className="w-48 aspect-[9/16] bg-gray-200 rounded-2xl flex-shrink-0"></div>
            <div className="w-48 aspect-[9/16] bg-gray-200 rounded-2xl flex-shrink-0"></div>
          </div>
        </div>

        {/* Creator List */}
        <div className="px-4">
          {loadingCreators ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {creators.map((creator) => (
                  <button
                    key={creator.id}
                    onClick={() => router.push(`/${getCreatorUsername(creator)}`)}
                    className="w-full flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getCreatorProfilePicture(creator) ? (
                        <img
                          src={getCreatorProfilePicture(creator)}
                          alt={getCreatorDisplayName(creator)}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {getCreatorDisplayName(creator).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-gray-900">{getCreatorDisplayName(creator)}</p>
                          {creator.isVerified && (
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">@{getCreatorUsername(creator)}</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              {creators.length === 0 && !loadingCreators && (
                <div className="text-center py-12">
                  <p className="text-gray-900 font-semibold text-lg mb-2">
                    {searchQuery ? 'No creators found' : 'No creators yet'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {searchQuery 
                      ? `No results for "${searchQuery}". Try a different search term.`
                      : 'Be the first to create content!'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
