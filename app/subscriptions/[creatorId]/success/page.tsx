'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Sparkles } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Button } from '@/components/ui/button'

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const username = params.creatorId as string
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify the session was successful
    if (!sessionId) {
      router.push(`/${username}`)
      return
    }

    // Give Stripe webhook time to process
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [sessionId, username, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          You&apos;re subscribed!
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <p className="text-gray-600">
            Welcome to the exclusive community
          </p>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>

        <p className="text-gray-600 mb-8">
          You now have access to all subscriber-only content and can message directly!
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/${username}`}>
            <PrimaryButton className="w-full">
              View Profile
            </PrimaryButton>
          </Link>
          
          <Link href="/feed">
            <Button variant="outline" className="w-full rounded-full">
              Go to Feed
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

