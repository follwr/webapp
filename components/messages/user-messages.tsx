'use client'

import { useRouter } from 'next/navigation'
import { PrimaryButton } from '@/components/ui/primary-button'
import { UserPlus } from 'lucide-react'
import Image from 'next/image'

export function UserMessages() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-white">
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
  )
}

