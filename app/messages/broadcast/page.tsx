'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Plus, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'

// Mock custom lists
const mockCustomLists = [
  { id: 'vip', name: 'VIP List', userCount: 24 },
]

export default function BroadcastListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    // Check if coming from successful list creation
    if (searchParams.get('created') === 'true') {
      setShowSuccess(true)
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }, [user, loading, router, searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="text-gray-900 font-medium">List successfully created</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <button
          onClick={() => router.push('/messages')}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Broadcast list
        </h1>
        
        <button 
          onClick={() => router.push('/messages/broadcast/new')}
          className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Plus className="w-6 h-6 text-blue-500" strokeWidth={2} />
        </button>
      </div>

      {/* Broadcast Lists */}
      <div className="flex-1">
        {/* All Subscribers List */}
        <button
          onClick={() => router.push('/messages/broadcast/all')}
          className="w-full px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            All subscribers
          </h3>
          <p className="text-sm text-gray-500">
            24 users
          </p>
        </button>

        {/* Custom Lists */}
        {mockCustomLists.map((list) => (
          <div
            key={list.id}
            className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <button
              onClick={() => router.push(`/messages/broadcast/${list.id}`)}
              className="flex-1 text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {list.name}
              </h3>
              <p className="text-sm text-gray-500">
                {list.userCount} users
              </p>
            </button>
            <button
              onClick={() => router.push(`/messages/broadcast/${list.id}`)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <Info className="w-6 h-6 text-blue-500" strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

