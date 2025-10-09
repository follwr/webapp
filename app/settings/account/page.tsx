'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react'

export default function AccountSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    if (user) {
      setEmail(user.email || '')
      setPhoneNumber(user.user_metadata?.phone || '')
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
          Account Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Account Information Section */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account information
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brontesheppeard@gmail.com"
                className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
              />
            </div>

            {/* Phone Number */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0406068552"
                className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Security
          </h2>

          <div className="space-y-0">
            {/* Change Password */}
            <button
              onClick={() => router.push('/settings/account/change-password')}
              className="w-full flex items-center gap-4 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-12 h-12 text-gray-700" strokeWidth={1.5} />
              <div className="flex-1 text-left">
                <h3 className="text-lg font-medium text-gray-900">
                  Change Password
                </h3>
              </div>
              <ChevronRight className="w-6 h-6 text-blue-500 flex-shrink-0" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

