'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import { creatorsApi } from '@/lib/api/creators'
import { subscriptionsApi } from '@/lib/api/subscriptions'
import { CreatorProfile } from '@/lib/types'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCreatorDisplayName, getCreatorUsername, getCreatorProfilePicture } from '@/lib/utils/profile'

export default function SubscriptionCheckoutPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const username = params.creatorId as string // Route uses [creatorId] but we pass username

  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setLoading(true)
        const data = await creatorsApi.getByUsername(username)
        setCreator(data)
      } catch (error) {
        console.error('Failed to load creator:', error)
        setError('Creator not found')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCreator()
    }
  }, [username, user])

  const handleSubscribe = async () => {
    if (!creator) return

    try {
      setSubscribing(true)
      setError(null)

      // Create Stripe checkout session and redirect
      const { checkoutUrl } = await subscriptionsApi.createCheckoutSession(creator.id)
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl
      
    } catch (err) {
      console.error('Subscription failed:', err)
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to start subscription. Please try again.'
      setError(errorMessage)
      setSubscribing(false)
    }
  }

  if (authLoading || loading) {
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

  const monthlyPrice = creator.subscriptionPrice || 0

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200 relative">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="absolute left-4 p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Subscribe
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto">
          {/* Creator Info */}
          <div className="flex flex-col items-center mb-8">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={getCreatorProfilePicture(creator)} />
              <AvatarFallback className="bg-blue-400 text-white text-2xl">
                {getCreatorDisplayName(creator).charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                {getCreatorDisplayName(creator)}
              </h2>
              {creator.isVerified && (
                <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-500" />
              )}
            </div>
            
            <p className="text-gray-500 mb-6">
              @{getCreatorUsername(creator)}
            </p>

            {/* Price */}
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                ${monthlyPrice.toFixed(2)}<span className="text-lg text-gray-500">/month</span>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">What you get:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Access to all subscriber-only posts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Direct messaging with {getCreatorDisplayName(creator)}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Early access to new content</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Cancel anytime</span>
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Subscribe Button */}
          <PrimaryButton
            onClick={handleSubscribe}
            disabled={subscribing || monthlyPrice === 0}
            isLoading={subscribing}
            className="w-full mb-4"
          >
            {subscribing ? 'Processing...' : `Subscribe for $${monthlyPrice.toFixed(2)}/month`}
          </PrimaryButton>

          {monthlyPrice === 0 && (
            <p className="text-center text-sm text-gray-500">
              This creator hasn&apos;t set up subscriptions yet
            </p>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By subscribing, you agree to be charged ${monthlyPrice.toFixed(2)} monthly until you cancel. 
            You can cancel anytime from your subscriptions page.
          </p>
        </div>
      </div>
    </div>
  )
}

