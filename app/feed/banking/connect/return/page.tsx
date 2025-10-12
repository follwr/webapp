'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FeedBankingConnectReturnRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct path
    // Preserve any query params from Stripe
    const searchParams = new URLSearchParams(window.location.search)
    const queryString = searchParams.toString()
    const targetUrl = `/banking/connect/return${queryString ? `?${queryString}` : ''}`
    router.replace(targetUrl)
  }, [router])

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'linear-gradient(180deg, #B3E7FF 0%, rgba(179, 231, 255, 0) 66.27%)',
      }}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Redirecting...</p>
    </div>
  )
}

