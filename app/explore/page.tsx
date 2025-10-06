'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/nav/bottom-nav'
import { Search } from 'lucide-react'

export default function ExplorePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Explore')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

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
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Explore Creators Title */}
        <h2 className="text-2xl font-bold px-4 mb-4">Explore creators</h2>

        {/* Categories */}
        <div className="flex gap-2 px-4 mb-6 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium whitespace-nowrap transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Grid - Placeholder */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="aspect-[9/16] bg-gray-200 rounded-2xl"></div>
            <div className="aspect-[9/16] bg-gray-200 rounded-2xl"></div>
            <div className="aspect-[9/16] bg-gray-200 rounded-2xl"></div>
          </div>

          {/* Creator List - Placeholder */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Creator Name</p>
                    <p className="text-sm text-gray-500">@username</p>
                  </div>
                </div>
                <button className="text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
