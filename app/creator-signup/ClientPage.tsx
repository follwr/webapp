'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { usersApi } from '@/lib/api/users'
import { creatorsApi } from '@/lib/api/creators'
import { bankingApi } from '@/lib/api/banking'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle2, Upload, Link as LinkIcon } from 'lucide-react'

type Step = 'check' | 'profile' | 'creator' | 'stripe' | 'success'

export default function CreatorSignupClientPage() {
  const { user, userProfile, isCreator, loading: authLoading, refreshUserProfile, refreshCreatorProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('check')
  const [loading, setLoading] = useState(false)
  const [connectingStripe, setConnectingStripe] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // User Profile Form
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  // Creator Profile Form
  const [subscriptionPrice, setSubscriptionPrice] = useState('')

  useEffect(() => {
    if (!authLoading) {
      // Check if redirected from Stripe with success
      const stepParam = searchParams.get('step')
      if (stepParam === 'success') {
        // Show success page regardless of isCreator state
        // (it might not have refreshed yet)
        setStep('success')
        return
      }

      if (!user) {
        router.push('/auth/login')
      } else if (isCreator && !stepParam) {
        // Already a creator, go to feed (unless we're showing success)
        router.push('/feed')
      } else {
        // Check if user has profile
        if (userProfile) {
          setStep('creator')
        } else {
          setStep('profile')
          // Pre-fill from Supabase auth if available
          setDisplayName(user.user_metadata?.full_name || '')
          setUsername(user.email?.split('@')[0] || '')
        }
      }
    }
  }, [user, userProfile, isCreator, authLoading, router, searchParams])

  const handleCreateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!displayName.trim() || !username.trim()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await usersApi.createProfile({
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim() || undefined,
      })

      await refreshUserProfile()
      setStep('creator')
    } catch (err: unknown) {
      console.error('Failed to create user profile:', err)
      const apiErr = err as { response?: { data?: { message?: string } } }
      setError(apiErr.response?.data?.message ?? 'Failed to create profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCreatorProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      // Store subscription price for later (after Stripe Connect)
      if (subscriptionPrice && parseFloat(subscriptionPrice) > 0) {
        sessionStorage.setItem('pending_subscription_price', subscriptionPrice)
      }

      // Go to Stripe Connect BEFORE creating creator profile
      setStep('stripe')
    } catch (err: unknown) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || step === 'check') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
        }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Step 1: Create User Profile
  if (step === 'profile') {
    return (
      <div 
        className="min-h-screen px-4 py-8"
        style={{
          background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
        }}
      >
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold mb-2">Create your profile</h1>
            <p className="text-gray-600">First, let&apos;s set up your basic profile</p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateUserProfile} className="space-y-6">
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. John Doe"
                required
                maxLength={50}
              />
            </div>

            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g. johndoe"
                required
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1">
                Letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Bio (optional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={3}
                maxLength={200}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <PrimaryButton type="submit" isLoading={loading} disabled={loading}>
              Continue
            </PrimaryButton>
          </form>
        </div>
      </div>
    )
  }

  // Step 2: Become Creator
  if (step === 'creator') {
    return (
      <div 
        className="min-h-screen px-4 py-8"
        style={{
          background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
        }}
      >
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/home.png"
                alt="Become a creator"
                width={200}
                height={200}
                className="w-48 h-48 object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-center">Become a Creator</h1>
            <p className="text-gray-600 text-center">
              Start earning by sharing exclusive content with your subscribers
            </p>
          </div>

          {/* Benefits */}

          {/* Form */}
          <form onSubmit={handleCreateCreatorProfile} className="space-y-6">
            <div>
              <Label htmlFor="subscriptionPrice">Monthly Subscription Price (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="subscriptionPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={subscriptionPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubscriptionPrice(e.target.value)}
                  placeholder="9.99"
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional - You can set or change this later
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <PrimaryButton type="submit" isLoading={loading} disabled={loading}>
              Become a Creator
            </PrimaryButton>

            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Creator Terms of Service
            </p>
          </form>
        </div>
      </div>
    )
  }

  // Step 3: Stripe Connect (BEFORE creating creator profile)
  if (step === 'stripe') {
    const handleConnectStripe = async () => {
      try {
        setConnectingStripe(true)
        setError(null)
        
        // Step 1: Create Stripe Connect account
        const { onboardingUrl } = await bankingApi.createConnectAccount()
        
        // Store that we're in signup flow (will create creator profile on return)
        sessionStorage.setItem('stripe_signup_flow', 'true')
        
        // Redirect to Stripe onboarding
        window.location.href = onboardingUrl
      } catch (err: unknown) {
        console.error('Failed to create Connect account:', err)
        const apiErr = err as { response?: { data?: { message?: string } } }
        setError(apiErr.response?.data?.message ?? 'Failed to connect Stripe account')
        setConnectingStripe(false)
      }
    }

    return (
      <div 
        className="min-h-screen px-4 py-8"
        style={{
          background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
        }}
      >
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStep('creator')}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <h1 className="text-3xl font-bold mb-2 text-center">Connect Your Bank Account</h1>
            <p className="text-gray-600 text-center">
              Required to receive payments from your subscribers
            </p>
          </div>

          {/* Stripe Connect Info */}
          <div className="mb-8 space-y-3">
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Secure & Fast</h3>
                <p className="text-sm text-gray-600">
                  Powered by Stripe - industry-leading payment security
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Instant Payouts</h3>
                <p className="text-sm text-gray-600">
                  Withdraw your earnings anytime to your bank account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Takes 2-3 Minutes</h3>
                <p className="text-sm text-gray-600">
                  Quick verification process with your basic info
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Need */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-semibold mb-2">What you&apos;ll need:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Government-issued ID (driver&apos;s license or passport)</li>
              <li>• Social Security Number (or Tax ID)</li>
              <li>• Bank account information</li>
              <li>• Business address (can be home address)</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Connect Button */}
          <PrimaryButton
            onClick={handleConnectStripe}
            isLoading={connectingStripe}
            disabled={connectingStripe}
            className="mb-4"
          >
            <div className="flex items-center justify-center gap-2">
              <LinkIcon className="w-5 h-5" />
              <span>Connect with Stripe</span>
            </div>
          </PrimaryButton>

          <p className="text-xs text-center text-gray-500">
            You&apos;ll be redirected to Stripe&apos;s secure verification page
          </p>
        </div>
      </div>
    )
  }

  // Step 4: Success
  if (step === 'success') {
    return (
      <div 
        className="min-h-screen px-4 flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
        }}
      >
        <div className="max-w-md mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3">You&apos;re all set!</h1>
          <p className="text-gray-600 mb-8">
            Welcome to the creator community. Your bank account is connected and you can now start earning from your subscribers!
          </p>

          {/* Next Steps */}
          <div className="space-y-4 mb-8 text-left bg-white rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3">What&apos;s next:</h2>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Bank account connected</h3>
                <p className="text-sm text-gray-600">You&apos;re ready to receive payments</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium">Create your first post</h3>
                <p className="text-sm text-gray-600">Share exclusive content with your audience</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium">Customize your profile</h3>
                <p className="text-sm text-gray-600">Add a cover image and complete your bio</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium">Set your subscription price</h3>
                <p className="text-sm text-gray-600">Go to Settings to update your pricing</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <PrimaryButton onClick={() => router.push('/feed')}>
              Start Creating Content
            </PrimaryButton>

            <button
              onClick={() => router.push('/settings/profile')}
              className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium"
            >
              Customize Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}


