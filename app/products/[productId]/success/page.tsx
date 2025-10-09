'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { FileText, Play } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import Link from 'next/link'

// Mock purchased product data
const mockPurchasedProduct = {
  id: '1',
  title: 'My custom gym program',
  creatorUsername: 'brontesheppeard',
  files: [
    { id: '1', name: 'Gympr...pdf', type: 'pdf', url: '/files/gym-program.pdf', thumbnail: null },
    { id: '2', name: 'Workout video', type: 'video', url: '/files/workout.mp4', thumbnail: '/mock/example.png' },
  ],
}

export default function PurchaseSuccessPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleDone = () => {
    router.push('/feed')
  }

  const handleFileClick = (file: any) => {
    console.log('Opening file:', file.name)
    // TODO: Download or open file
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
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">
          Purchase successful
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 pt-6">
          {/* Product Info */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">
              @{mockPurchasedProduct.creatorUsername}
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {mockPurchasedProduct.title}
            </h2>
          </div>

          {/* Your Products Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your products:
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {mockPurchasedProduct.files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className="flex-shrink-0"
                >
                  {file.type === 'pdf' ? (
                    // PDF File
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-28 mb-2 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 120" fill="none">
                          <rect x="10" y="10" width="80" height="100" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                          <rect x="20" y="40" width="60" height="50" rx="6" fill="#EF4444"/>
                          <text x="50" y="62" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">PDF</text>
                          <path d="M30 20 L50 0 L50 20 L30 20" fill="#E5E7EB"/>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-900 text-center max-w-[100px] truncate">
                        {file.name}
                      </p>
                    </div>
                  ) : (
                    // Video File
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-28 mb-2 rounded-2xl overflow-hidden bg-gray-200">
                        {file.thumbnail && (
                          <img
                            src={file.thumbnail}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-white fill-white ml-1" strokeWidth={0} />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-900 text-center max-w-[160px] truncate">
                        {file.name}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info Text */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              You can also view your products in{' '}
              <Link 
                href="/purchased"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                purchased items
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <PrimaryButton
          onClick={handleDone}
          className="w-full text-base py-4"
        >
          Done
        </PrimaryButton>
      </div>
    </div>
  )
}

