'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Trash2 } from 'lucide-react'

export default function VisibilityPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [hideAccount, setHideAccount] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleDeleteAccount = () => {
    // TODO: Show confirmation modal and API call
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      console.log('Deleting account')
      // TODO: API call to delete account
    }
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
          Visibility
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Hide Account Toggle */}
        <div className="px-6 py-6 border-b-8 border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">
              Hide account
            </h2>
            
            {/* Toggle Switch */}
            <button
              onClick={() => setHideAccount(!hideAccount)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                hideAccount ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  hideAccount ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="px-6 pt-6">
          <h2 className="text-xl font-medium text-gray-900 mb-3">
            Delete account
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            This will permanently delete your account, all your information, saved resumes & cover letters will be deleted forever
          </p>

          {/* Delete Button */}
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-500" strokeWidth={2} />
            <span className="text-base font-medium text-gray-900">Delete account</span>
          </button>
        </div>
      </div>
    </div>
  )
}

