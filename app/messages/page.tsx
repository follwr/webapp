'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/nav/bottom-nav'
import { CreatorMessages } from '@/components/messages/creator-messages'
import { UserMessages } from '@/components/messages/user-messages'
import { UserCircle, Crown } from 'lucide-react'

export default function MessagesPage() {
  const { user, isCreator, loading } = useAuth()
  const router = useRouter()
  const [testMode, setTestMode] = useState<'auto' | 'creator' | 'user'>('auto')

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

  // Determine which view to show based on test mode
  const showCreatorView = testMode === 'creator' || (testMode === 'auto' && isCreator)

  return (
    <>
      {/* Test Mode Toggle - Development Only */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Test View</div>
        <div className="flex gap-1">
          <button
            onClick={() => setTestMode('auto')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              testMode === 'auto'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => setTestMode('user')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              testMode === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <UserCircle className="w-3 h-3" />
            User
          </button>
          <button
            onClick={() => setTestMode('creator')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              testMode === 'creator'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Crown className="w-3 h-3" />
            Creator
          </button>
        </div>
      </div>

      <div className="pb-20">
        {/* Conditionally render based on user type */}
        {showCreatorView ? <CreatorMessages /> : <UserMessages />}
      </div>
      <BottomNav />
    </>
  )
}
