'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'

export default function ChangePasswordPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      alert('Please enter your current password')
      return
    }
    if (!newPassword.trim()) {
      alert('Please enter a new password')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setIsSaving(true)
    // TODO: API call to change password
    console.log('Changing password')
    
    setTimeout(() => {
      setIsSaving(false)
      router.back()
    }, 1000)
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
          Account Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Change Password
          </h2>

          <div className="space-y-4">
            {/* Current Password */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                Current Password
              </label>
              <div className="flex items-center">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                />
                <button
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-6 h-6 text-gray-500" strokeWidth={2} />
                  ) : (
                    <Eye className="w-6 h-6 text-gray-500" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                New Password
              </label>
              <div className="flex items-center">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-6 h-6 text-gray-500" strokeWidth={2} />
                  ) : (
                    <Eye className="w-6 h-6 text-gray-500" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                Confirm New Password
              </label>
              <div className="flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-6 h-6 text-gray-500" strokeWidth={2} />
                  ) : (
                    <Eye className="w-6 h-6 text-gray-500" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <PrimaryButton
          onClick={handleSave}
          disabled={isSaving}
          className="w-full text-base py-3.5"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </div>
  )
}

