'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, X } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Button } from '@/components/ui/button'

// Mock product data
const mockProduct = {
  id: '1',
  title: 'My custom gym program',
  price: 100.00,
  imageUrl: '/mock/example.png',
  creatorUsername: 'brontesheppeard',
}

const SERVICE_FEE_PERCENTAGE = 0.0412 // 4.12%

export default function PurchaseConfirmationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [items, setItems] = useState([mockProduct])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.id !== productId))
    if (items.length <= 1) {
      // If no items left, go back
      router.back()
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE
  const total = subtotal + serviceFee

  const handleContinueToCheckout = () => {
    console.log('Proceeding to checkout')
    // TODO: Process payment with payment provider
    // For now, simulate successful payment
    setTimeout(() => {
      router.push(`/products/${params.productId}/success`)
    }, 500)
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
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="absolute left-4 p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Purchase confirmation
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Order summary
          </h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                {/* Product Thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 mb-0.5">
                    @{item.creatorUsername}
                  </p>
                  <h3 className="text-base font-medium text-gray-900">
                    {item.title}
                  </h3>
                </div>

                {/* Price and Remove */}
                <div className="flex items-start gap-3 flex-shrink-0">
                  <span className="text-xl font-semibold text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => removeItem(item.id)}
                    variant="ghost"
                    size="icon"
                    className="p-1 rounded-lg h-auto w-auto"
                  >
                    <X className="w-5 h-5 text-blue-500" strokeWidth={2} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-600">Subtotal</span>
              <span className="text-lg font-medium text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-600">Service Fee</span>
              <span className="text-lg font-medium text-gray-900">
                ${serviceFee.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-300 mb-8">
            <span className="text-xl font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <PrimaryButton
          onClick={handleContinueToCheckout}
          className="w-full text-base py-4 mb-2"
        >
          Continue to checkout
        </PrimaryButton>
        <p className="text-center text-sm text-gray-500">
          You won&apos;t be charged yet
        </p>
      </div>
    </div>
  )
}

