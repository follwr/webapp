'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Search, ChevronRight } from 'lucide-react'

// Mock subscriptions data
const mockSubscriptions = [
  { id: '1', name: 'John Doe', username: 'johndoe', avatar: null },
  { id: '2', name: 'John Doe', username: 'johndoe2', avatar: null },
  { id: '3', name: 'John Doe', username: 'johndoe3', avatar: null },
  { id: '4', name: 'John Doe', username: 'johndoe4', avatar: null },
  { id: '5', name: 'John Doe', username: 'johndoe5', avatar: null },
]

export default function SubscriptionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Filter subscriptions based on search
  const filteredSubscriptions = mockSubscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          Subscriptions
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a subscription"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSubscriptions.map((subscription) => (
          <button
            key={subscription.id}
            onClick={() => router.push(`/subscriptions/${subscription.id}`)}
            className="w-full flex items-center gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-blue-400 flex-shrink-0" />

            {/* Name */}
            <div className="flex-1 text-left">
              <h3 className="text-lg font-medium text-gray-900">
                {subscription.name}
              </h3>
            </div>

            {/* Chevron */}
            <ChevronRight className="w-6 h-6 text-blue-500 flex-shrink-0" strokeWidth={2} />
          </button>
        ))}
      </div>
    </div>
  )
}

