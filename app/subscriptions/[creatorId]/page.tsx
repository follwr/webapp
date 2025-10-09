'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Send } from 'lucide-react'

// Mock subscription data
const mockSubscription = {
  creator: {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    avatar: null,
  },
  membershipDate: '12th Sept 2025',
  isRecurring: true,
  totalSpent: 124000.00,
  dmSpent: 124000.00,
}

export default function SubscriptionDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleMessage = () => {
    router.push(`/messages/${params.creatorId}`)
  }

  const handleUnsubscribe = () => {
    if (window.confirm('Are you sure you want to unsubscribe?')) {
      console.log('Unsubscribing from:', params.creatorId)
      // TODO: API call to unsubscribe
      router.back()
    }
  }

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
          Subscription
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Creator Info */}
        <div className="flex flex-col items-center px-6 pt-12 pb-8">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-blue-400 mb-5" />
          
          {/* Name */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {mockSubscription.creator.name}
          </h2>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full max-w-md">
            <button
              onClick={handleMessage}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Message</span>
            </button>
            
            <button
              onClick={handleUnsubscribe}
              className="flex-1 px-6 py-3.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-medium rounded-full transition-colors"
            >
              Unsubscribe
            </button>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="px-6 pt-6 space-y-5 border-t border-gray-200">
          {/* Membership */}
          <div className="flex items-center justify-between py-2">
            <span className="text-base font-medium text-gray-900">
              Membership
            </span>
            <span className="text-base text-gray-500">
              {mockSubscription.membershipDate} → {mockSubscription.isRecurring ? 'Recurring' : 'One-time'}
            </span>
          </div>

          {/* Total Amount Spent */}
          <div className="flex items-center justify-between py-2">
            <span className="text-base font-medium text-gray-900">
              Total amount spent
            </span>
            <span className="text-base text-gray-900 font-medium">
              ${mockSubscription.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Amount Spent on DMs */}
          <div className="flex items-center justify-between py-2">
            <span className="text-base font-medium text-gray-900">
              Amount spent on DMs
            </span>
            <span className="text-base text-gray-900 font-medium">
              ${mockSubscription.dmSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

