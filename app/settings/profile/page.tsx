'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'

export default function ProfileSettingsPage() {
  const { user, creatorProfile, loading } = useAuth()
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    // Load user data
    if (user) {
      setFullName(user.user_metadata?.full_name || '')
      setUsername(user.email?.split('@')[0] || '')
      setProfilePicture(user.user_metadata?.avatar_url || null)
    }

    // Load creator profile data if available
    if (creatorProfile) {
      setFullName(creatorProfile.displayName || '')
      setUsername(creatorProfile.username || '')
      setDescription(creatorProfile.bio || '')
      setProfilePicture(creatorProfile.profilePictureUrl || null)
    }
  }, [user, creatorProfile, loading, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      alert('Please enter your full name')
      return
    }
    if (!username.trim()) {
      alert('Please enter a username')
      return
    }

    setIsSaving(true)
    // TODO: API call to update profile
    console.log('Saving profile:', { fullName, username, description, profilePicture })
    
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
          Profile Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile Picture Banner */}
        <div className="mx-6 mt-6 mb-6">
          <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-gray-200 to-gray-400">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400" />
            )}
            
            {/* Overlay Text and Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
                Profile Picture
              </h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-full transition-colors shadow-lg"
              >
                Change
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="px-6 space-y-4">
          {/* Full Name */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Bronte Sheppeard"
              className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>

          {/* Username */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="brontesheppeard"
              className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exclusive content & the only place I respond to all messages. Come join the fun. I'm 19 years old and I love to lift heavy weights."
              rows={4}
              className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none leading-relaxed"
            />
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
          {isSaving ? 'Saving...' : 'Save changes'}
        </PrimaryButton>
      </div>
    </div>
  )
}

