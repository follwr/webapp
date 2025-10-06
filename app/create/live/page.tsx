'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/nav/bottom-nav'

export default function GoLivePage() {
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
      <div className="container mx-auto px-4 py-8 pb-20">
        <h1 className="text-3xl font-bold mb-8">Go Live</h1>
        <p className="text-gray-600">Start your live stream</p>
      </div>
      <BottomNav />
    </>
  )
}
