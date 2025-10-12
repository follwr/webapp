'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { creatorsApi } from '@/lib/api/creators'

export default function StripeConnectReturnPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [creatingProfile, setCreatingProfile] = useState(false)

  useEffect(() => {
    // In a real implementation, you'd verify the Stripe account status here
    // For now, we'll assume success after a brief delay
    const timer = setTimeout(() => {
      setStatus('success')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Check if we're in signup flow
  const isSignupFlow = typeof window !== 'undefined' && sessionStorage.getItem('stripe_signup_flow') === 'true'
  
  useEffect(() => {
    const createCreatorProfile = async () => {
      if (status === 'success' && isSignupFlow && !creatingProfile) {
        try {
          setCreatingProfile(true)
          
          // Get stored subscription price
          const pendingPrice = sessionStorage.getItem('pending_subscription_price')
          const data: { subscriptionPrice?: number; coverImageUrl?: string } = {}
          
          if (pendingPrice && parseFloat(pendingPrice) > 0) {
            data.subscriptionPrice = parseFloat(pendingPrice)
          }
          
          // NOW create the creator profile (after Stripe Connect succeeded)
          // Note: isVerified will be set to true automatically in the backend after Stripe verification
          await creatorsApi.createProfile(data)
          
          // Clean up session storage
          sessionStorage.removeItem('stripe_signup_flow')
          sessionStorage.removeItem('pending_subscription_price')
          
          // Redirect to success page (no delay needed, auth will refresh)
          router.push('/creator-signup?step=success')
        } catch (err) {
          console.error('Failed to create creator profile:', err)
          setStatus('error')
          setCreatingProfile(false)
        }
      }
    }
    
    createCreatorProfile()
  }, [status, isSignupFlow, creatingProfile, router])

  if (status === 'loading' || creatingProfile) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">
          {creatingProfile ? 'Setting up your creator account...' : 'Verifying your account...'}
        </p>
      </div>
    )
  }

  if (status === 'success' && !isSignupFlow) {
    // Only show this if NOT in signup flow (regular banking connect)
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
        }}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3">Bank Account Connected!</h1>
          <p className="text-gray-600 mb-8">
            Your bank account has been successfully connected. You can now receive payouts from your earnings.
          </p>

          <div className="space-y-3">
            <PrimaryButton onClick={() => router.push('/banking')}>
              Go to Banking
            </PrimaryButton>
            <button
              onClick={() => router.push('/feed')}
              className="w-full py-3 text-gray-600 hover:text-gray-900"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
      }}
    >
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">Connection Failed</h1>
        <p className="text-gray-600 mb-8">
          There was an issue connecting your bank account. Please try again.
        </p>

        <div className="space-y-3">
          <PrimaryButton onClick={() => router.push('/banking')}>
            Try Again
          </PrimaryButton>
          <button
            onClick={() => router.push('/feed')}
            className="w-full py-3 text-gray-600 hover:text-gray-900"
          >
            Back to Feed
          </button>
        </div>
      </div>
    </div>
  )
}

