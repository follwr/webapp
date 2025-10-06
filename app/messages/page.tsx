'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/nav/bottom-nav'
import { PrimaryButton } from '@/components/ui/primary-button'
import { UserPlus } from 'lucide-react'
import Image from 'next/image'

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  return (
    <>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Header */}
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
          {/* Messages Illustration */}
          <div className="w-80 h-80 relative mb-12">
            <Image
              src="/assets/messages.png"
              alt="Messages"
              fill
              className="object-contain"
            />
          </div>

          {/* Text Content */}
          <div className="text-center mb-8 max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Subscribe to start sending messages.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              When you subscribe to a creator, you will be able to send them messages
            </p>
          </div>

          {/* Find Creators Button */}
          <div className="w-full max-w-md px-6">
            <PrimaryButton 
              onClick={() => router.push('/explore')}
              className="flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Find creators</span>
            </PrimaryButton>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
