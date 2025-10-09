'use client'

import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { PrimaryButton } from '@/components/ui/primary-button'

// Mock subscriber data
const mockSubscribers = [
  { id: '1', name: 'John Doe', avatar: null },
  { id: '2', name: 'John Doe', avatar: null },
  { id: '3', name: 'John Doe', avatar: null },
]

export default function BroadcastListDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const [listName, setListName] = useState('')
  const [listMembers, setListMembers] = useState<Array<{id: string, name: string, avatar: string | null}>>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    // Load list data based on listId
    if (params.listId === 'all') {
      // Load all subscribers (read-only)
      setListName('All subscribers')
      setListMembers([
        { id: '1', name: 'John Doe', avatar: null },
        { id: '2', name: 'John Doe', avatar: null },
        { id: '3', name: 'John Doe', avatar: null },
      ])
    } else {
      // Load custom list data
      setListName('VIP members')
      setListMembers([
        { id: '1', name: 'John Doe', avatar: null },
        { id: '2', name: 'John Doe', avatar: null },
        { id: '3', name: 'John Doe', avatar: null },
      ])
    }
  }, [user, loading, router, params.listId])

  const removeMember = (memberId: string) => {
    setListMembers((prev) => prev.filter((member) => member.id !== memberId))
  }

  const handleAddMembers = () => {
    // Navigate to member selection page
    router.push('/messages/broadcast/new')
  }

  const handleSave = () => {
    if (!listName.trim()) {
      alert('Please enter a list name')
      return
    }
    if (listMembers.length === 0) {
      alert('Please add at least one member')
      return
    }
    console.log('Saving list:', { listName, members: listMembers.map(m => m.id) })
    // TODO: API call to update list
    router.back()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const isAllSubscribers = params.listId === 'all'

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
          {isAllSubscribers ? 'List info' : 'Edit List'}
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
              onChange={(e) => !isAllSubscribers && setListName(e.target.value)}
              placeholder="VIP members"
              disabled={isAllSubscribers}
              className={`w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent ${
                isAllSubscribers ? 'opacity-60' : ''
              }`}
            />
          </div>
        </div>

        {/* List Members */}
        <div className="px-6 pb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            List members
          </h2>

          <div className="space-y-0">
            {listMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 px-0 py-4 border-b border-gray-100"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-blue-400 flex-shrink-0" />

                {/* Name */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-medium text-gray-900">
                    {member.name}
                  </h3>
                </div>

                {/* Delete Button - Only show for custom lists */}
                {!isAllSubscribers && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-6 h-6 text-blue-500" strokeWidth={2} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Members Button - Only show for custom lists */}
          {!isAllSubscribers && (
            <button
              onClick={handleAddMembers}
              className="w-full mt-6 px-6 py-4 border-2 border-blue-500 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors text-lg"
            >
              Add Members
            </button>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button - Only show for custom lists */}
      {!isAllSubscribers && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
          <PrimaryButton
            onClick={handleSave}
            className="w-full text-lg py-4"
          >
            Save
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}

