'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Check } from 'lucide-react'
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

export default function CreateBroadcastListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [listName, setListName] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    // Get selected member IDs from URL params
    const memberIds = searchParams.get('members')
    if (memberIds) {
      setSelectedMembers(memberIds.split(','))
    } else {
      // If no members selected, redirect back
      router.push('/messages/broadcast/new')
    }
  }, [user, loading, router, searchParams])

  const handleCreateList = () => {
    if (!listName.trim()) {
      alert('Please enter a list name')
      return
    }
    console.log('Creating list:', { listName, members: selectedMembers })
    // TODO: API call to create list
    router.push('/messages/broadcast?created=true')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const selectedSubscribersList = mockSubscribers.filter((s) =>
    selectedMembers.includes(s.id)
  )

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
          List info
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* List Name Input */}
        <div className="px-6 pt-6 pb-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <label className="block text-sm text-gray-500 mb-2">
              List name
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="VIP members"
              className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* List Members */}
        <div className="px-6 pb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            List members
          </h2>

          <div className="space-y-0">
            {selectedSubscribersList.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center gap-4 px-0 py-4 border-b border-gray-100"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-blue-400 flex-shrink-0" />

                {/* Name */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-medium text-gray-900">
                    {subscriber.name}
                  </h3>
                </div>

                {/* Checkmark */}
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
        <PrimaryButton
          onClick={handleCreateList}
          className="w-full text-lg py-4"
        >
          Create list
        </PrimaryButton>
      </div>
    </div>
  )
}

