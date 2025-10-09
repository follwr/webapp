'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { PrimaryButton } from '@/components/ui/primary-button'

// Mock subscriber data
const mockSubscribers = [
  { id: '1', name: 'John Doe', avatar: null },
  { id: '2', name: 'John Doe', avatar: null },
  { id: '3', name: 'John Doe', avatar: null },
  { id: '4', name: 'John Doe', avatar: null },
  { id: '5', name: 'John Doe', avatar: null },
]

export default function NewBroadcastListPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(memberId)) {
        newSet.delete(memberId)
      } else {
        newSet.add(memberId)
      }
      return newSet
    })
  }

  const handleNext = () => {
    if (selectedMembers.size === 0) {
      alert('Please select at least one subscriber')
      return
    }
    // Navigate to list info page with selected members
    const memberIds = Array.from(selectedMembers).join(',')
    router.push(`/messages/broadcast/create?members=${memberIds}`)
  }

  // Filter subscribers based on search
  const filteredSubscribers = mockSubscribers.filter((subscriber) =>
    subscriber.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedSubscribersList = mockSubscribers.filter((s) =>
    selectedMembers.has(s.id)
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
          New broadcast list
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a user"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Selected Subscribers Preview */}
      <div className="mx-6 mb-6 bg-blue-50 rounded-3xl py-8 px-6">
        {selectedSubscribersList.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-2">
            {selectedSubscribersList.map((subscriber) => (
              <div key={subscriber.id} className="flex flex-col items-center flex-shrink-0">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full bg-blue-400" />
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMember(subscriber.id)
                    }}
                    className="absolute -top-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-md"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-900 text-center max-w-[90px] truncate">
                  {subscriber.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="flex -space-x-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-orange-400 border-4 border-white flex-shrink-0" />
              <div className="w-16 h-16 rounded-full bg-pink-300 border-4 border-white flex-shrink-0" />
              <div className="w-16 h-16 rounded-full bg-green-400 border-4 border-white flex-shrink-0" />
            </div>
            <p className="text-center text-gray-900 text-base font-medium">
              Subscribers you select<br />will appear here.
            </p>
          </div>
        )}
      </div>

      {/* All Subscribers Section */}
      <div className="flex-1 overflow-y-auto pb-24">
        <h2 className="px-6 text-lg font-semibold text-gray-900 mb-4">
          All subscribers
        </h2>

        <div>
          {filteredSubscribers.map((subscriber) => (
            <button
              key={subscriber.id}
              onClick={() => toggleMember(subscriber.id)}
              className="w-full flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-blue-400 flex-shrink-0" />

              {/* Name */}
              <div className="flex-1 text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  {subscriber.name}
                </h3>
              </div>

              {/* Checkbox */}
              <div
                className={`w-7 h-7 rounded-full border-2 flex-shrink-0 transition-colors ${
                  selectedMembers.has(subscriber.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {selectedMembers.has(subscriber.id) && (
                  <svg
                    className="w-full h-full text-white p-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
        <PrimaryButton
          onClick={handleNext}
          className="w-full text-lg py-4"
        >
          Next
        </PrimaryButton>
      </div>
    </div>
  )
}

