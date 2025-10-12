'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
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
            <Link href="/auth/login">
              <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 ml-4">Reset password</h1>
          </div>
        </div>

        {/* Success Content */}
        <div className="flex flex-col items-center justify-center px-6 pt-16">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 flex items-center justify-center">
                <svg className="w-24 h-24 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12.5V8.5C20 7.11929 18.8807 6 17.5 6H6.5C5.11929 6 4 7.11929 4 8.5V15.5C4 16.8807 5.11929 18 6.5 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 9L11.1056 12.5528C11.6686 12.8343 12.3314 12.8343 12.8944 12.5528L20 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15.5 16L16.5 17L18.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Check your email
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-8">
            We&apos;ve sent password reset instructions to <span className="font-medium text-gray-900">{email}</span>
          </p>

          {/* Button */}
          <Link href="/auth/login" className="w-full max-w-md">
            <PrimaryButton className="text-lg">
              Back to Login
            </PrimaryButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <Link href="/auth/login">
            <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 ml-4">Reset password</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 pt-16">
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
        <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
          Reset your password
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center max-w-md mb-8">
          Enter the email associated with your account to change your password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-md mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleResetPassword} className="w-full max-w-md space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={loading}
            isLoading={loading}
            className="text-lg"
          >
            {loading ? 'Sending...' : 'Send reset instructions'}
          </PrimaryButton>
        </form>

        {/* Back to Login */}
        <p className="text-center text-gray-600 mt-6">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

