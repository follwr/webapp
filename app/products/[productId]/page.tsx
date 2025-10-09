'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Copy } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'

// Mock product data
const mockProduct = {
  id: '1',
  title: 'My custom gym program',
  price: 100.00,
  imageUrl: '/mock/example.png',
  description: `I have worked with Fortune 500 brands such as Adidas, L'Oreal, Danone and Pfizer on multiple digital marketing projects. I aim to leverage my experience and know-how to help you launch and grow your brand on Instagram while maintaining brand professionalism, consistency and performance delivery.

I will do a thorough analysis of your Instagram account, provide you with personalized recommendations on how to improve your existing performance, update you with the latest Instagram updates and algorithms and finally provide you with a customized strategy and action plan on how you can best move forward in maximizing the performance to increase followers, engagement and ultimately traffic and sales.`,
  fileCount: 3,
  creatorName: 'Bronte Sheppeard',
  creatorUsername: 'brontesheppeard',
}

export default function ProductDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleBuy = async () => {
    // Navigate to purchase confirmation
    router.push(`/products/${params.productId}/checkout`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200 relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Product
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Product Image */}
        <div className="px-4 pt-6 pb-4">
          <div className="relative w-full rounded-3xl overflow-hidden bg-gray-200">
            <img
              src={mockProduct.imageUrl}
              alt={mockProduct.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 pb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {mockProduct.title}
          </h2>
          <p className="text-xl text-gray-600">
            ${mockProduct.price.toFixed(2)}
          </p>
        </div>

        {/* About Section */}
        <div className="px-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            About this gig
          </h3>
          <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">
            {mockProduct.description}
          </p>
        </div>

        {/* Files Preview */}
        <div className="px-6 pb-4">
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center">
            {/* File Count Badge */}
            <div className="absolute top-5 right-5">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                <span className="text-gray-900 font-semibold text-base">
                  {mockProduct.fileCount}
                </span>
                <Copy className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </div>
            </div>

            {/* File Icon */}
            <div className="w-32 h-32">
              <div className="w-32 h-32 rounded-full bg-blue-300/50 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <PrimaryButton
          onClick={handleBuy}
          className="w-full text-base py-4"
        >
          Buy Product
        </PrimaryButton>
      </div>
    </div>
  )
}

