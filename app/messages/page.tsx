'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/nav/bottom-nav'
import { CreatorMessages } from '@/components/messages/creator-messages'
import { UserMessages } from '@/components/messages/user-messages'

export default function MessagesPage() {
  const { user, isCreator, loading } = useAuth()
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
      <div className="pb-20">
        {/* Conditionally render based on user type */}
        {isCreator ? <CreatorMessages /> : <UserMessages />}
      </div>
      <BottomNav />
    </>
  )
}
