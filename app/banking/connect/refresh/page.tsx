'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StripeConnectRefreshPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect back to banking to restart the Connect flow
    router.push('/banking')
  }, [router])

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

