'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-white flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-lg font-medium text-gray-900">Page not found</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32 pt-20">
        {/* 404 Text */}
        <h2 className="text-[120px] font-bold text-gray-900 leading-none mb-8">
          404
        </h2>

        {/* Error Message */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Page not found
          </h3>
          <p className="text-gray-600 text-base">
            Sorry, the page you're looking<br />for doesn't exist.
          </p>
        </div>
      </div>

      {/* Go Back Button */}
      <div className="fixed bottom-6 left-6 right-6">
        <PrimaryButton onClick={() => router.back()}>
          Go back
        </PrimaryButton>
      </div>
    </div>
  )
}
