'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, FileText } from 'lucide-react'

// Mock purchased items (posts, products, DMs, etc.)
const mockPurchasedItems = [
  {
    id: '1',
    type: 'post',
    imageUrl: '/mock/example.png',
    isAvailable: true,
    caption: null,
  },
  {
    id: '2',
    type: 'product',
    imageUrl: null,
    isAvailable: false,
    caption: null,
  },
  {
    id: '3',
    type: 'post',
    imageUrl: '/mock/example.png',
    isAvailable: true,
    caption: null,
  },
]

export default function PurchasedItemsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

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
          Purchased Posts
        </h1>
      </div>

      {/* Posts Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {mockPurchasedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.isAvailable && router.push(`/purchased/${item.id}`)}
              className={`relative rounded-3xl overflow-hidden bg-white border border-gray-100 ${
                item.isAvailable ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {item.isAvailable && item.imageUrl ? (
                // Available item with image
                <div className="aspect-[3/4] relative">
                  <img
                    src={item.imageUrl}
                    alt="Purchased item"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Unavailable/deleted item
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-6">
                  {/* File Icon */}
                  <div className="w-24 h-24 mb-4 relative">
                    <div className="w-24 h-24 rounded-full bg-blue-300/50 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/60 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600/40" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 text-center px-2">
                    Item no longer available
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

