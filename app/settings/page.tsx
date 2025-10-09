'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const settingsOptions = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Profile data that visible to other users',
    href: '/settings/profile',
  },
  {
    id: 'account',
    title: 'Account & Security',
    description: 'Your personal information and security settings such as your passwords, etc',
    href: '/settings/account',
  },
  {
    id: 'visibility',
    title: 'Account Visibility',
    description: 'Who can see your profile',
    href: '/settings/visibility',
  },
]

export default function SettingsPage() {
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
          Settings
        </h1>
      </div>

      {/* Settings Options */}
      <div className="flex-1">
        {settingsOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => router.push(option.href)}
            className="w-full flex items-center gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {/* Icon Circle */}
            <div className="w-14 h-14 rounded-full bg-blue-400 flex-shrink-0" />

            {/* Text Content */}
            <div className="flex-1 text-left min-w-0">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {option.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {option.description}
              </p>
            </div>

            {/* Chevron */}
            <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

