'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user has valid reset token
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Invalid or expired reset link. Please request a new one.')
      }
    }
    checkSession()
  }, [supabase.auth])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Reset password</h1>
          </div>
        </div>

        {/* Success Content */}
        <div className="flex flex-col items-center justify-center px-6 pt-16">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 flex items-center justify-center">
                <svg className="w-24 h-24 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Text */}
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
            Password reset successful!
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-8">
            Your password has been updated. Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-center relative">
          <Link href="/auth/login" className="absolute left-0">
            <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">New password</h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center px-6 pt-12">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 flex items-center justify-center">
                <svg className="w-24 h-24 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C9.79 2 8 3.79 8 6V8H7C5.9 8 5 8.9 5 10V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V10C19 8.9 18.1 8 17 8H16V6C16 3.79 14.21 2 12 2ZM12 4C13.1 4 14 4.9 14 6V8H10V6C10 4.9 10.9 4 12 4Z" fill="currentColor" opacity="0.3"/>
                  <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
                  <path d="M12 12C10.9 12 10 12.9 10 14C10 14.74 10.4 15.38 11 15.73V18H13V15.73C13.6 15.38 14 14.74 14 14C14 12.9 13.1 12 12 12Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
            Set your new password
          </h2>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-md mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleResetPassword} className="w-full max-w-md space-y-4">
            {/* Password Input */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <PrimaryButton
              type="submit"
              disabled={loading}
              isLoading={loading}
              className="text-lg mt-6"
            >
              {loading ? 'Confirming...' : 'Confirm'}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  )
}

