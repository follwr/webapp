'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { usersApi } from '@/lib/api/users'
import { creatorsApi } from '@/lib/api/creators'
import { uploadApi } from '@/lib/api/upload'

export default function ProfileSettingsPage() {
  const { user, userProfile, creatorProfile, isCreator, loading, refreshUserProfile, refreshCreatorProfile } = useAuth()
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const profileFileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    // Load user profile data if available
    if (userProfile) {
      setFullName(userProfile.displayName || '')
      setUsername(userProfile.username || '')
      setDescription(userProfile.bio || '')
      setProfilePicture(userProfile.profilePictureUrl || null)
    } else if (user) {
      // Fallback to Supabase user metadata if no user profile yet
      setFullName(user.user_metadata?.full_name || '')
      setUsername(user.email?.split('@')[0] || '')
      setProfilePicture(user.user_metadata?.avatar_url || null)
    }

    // Load creator profile data if user is a creator
    if (creatorProfile) {
      setCoverImage(creatorProfile.coverImageUrl || null)
    }
  }, [user, userProfile, creatorProfile, loading, router])

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store the file for upload
      setProfileImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store the file for upload
      setCoverImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      let profilePictureUrl = userProfile?.profilePictureUrl
      let coverImageUrl = creatorProfile?.coverImageUrl

      // Upload new profile image if one was selected
      if (profileImageFile) {
        try {
          profilePictureUrl = await uploadApi.uploadProfileImageComplete(profileImageFile, 'profile')
        } catch (uploadError) {
          console.error('Profile image upload failed:', uploadError)
          setError('Failed to upload profile image. Please try again.')
          setIsSaving(false)
          return
        }
      }

      // Upload new cover image if one was selected (for creators only)
      if (coverImageFile && isCreator) {
        try {
          coverImageUrl = await uploadApi.uploadProfileImageComplete(coverImageFile, 'cover')
        } catch (uploadError) {
          console.error('Cover image upload failed:', uploadError)
          setError('Failed to upload cover image. Please try again.')
          setIsSaving(false)
          return
        }
      }

      const profileData = {
        displayName: fullName,
        username: username,
        bio: description || undefined,
        profilePictureUrl: profilePictureUrl || undefined,
      }

      // Create or update user profile
      if (userProfile) {
        // Update existing profile
        await usersApi.updateProfile(profileData)
      } else {
        // Create new profile (first time setup)
        await usersApi.createProfile({
          displayName: fullName,
          username: username,
          bio: description || undefined,
          profilePictureUrl: profilePictureUrl || undefined,
        })
      }

      // Update creator profile if user is a creator and cover image changed
      if (isCreator && coverImageFile) {
        try {
          await creatorsApi.updateProfile({
            coverImageUrl: coverImageUrl || undefined,
          })
          await refreshCreatorProfile()
        } catch (creatorError) {
          console.error('Failed to update creator profile:', creatorError)
          // Don't fail the whole save if only creator update fails
        }
      }

      // Refresh the user profile in auth context
      await refreshUserProfile()

      // Navigate back
      router.back()
    } catch (err) {
      console.error('Failed to save profile:', err)
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save profile. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSaving(false)
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
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="absolute left-4 p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Profile Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Cover Image Banner (for creators only) */}
        {isCreator && (
          <div className="mx-6 mt-6 mb-6">
            <div className="relative w-full h-48 rounded-3xl overflow-hidden bg-gradient-to-b from-gray-200 to-gray-400">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-400" />
              )}
              
              {/* Overlay Text and Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
                  Cover Image
                </h2>
                <Button
                  onClick={() => coverFileInputRef.current?.click()}
                  variant="secondary"
                  className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-full shadow-lg"
                >
                  Change
                </Button>
              </div>
            </div>
            <Input
              ref={coverFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Profile Picture */}
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
              <Button
                onClick={() => profileFileInputRef.current?.click()}
                variant="secondary"
                className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-full shadow-lg"
              >
                Change
              </Button>
            </div>
          </div>
          <Input
            ref={profileFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileImageUpload}
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
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Bronte Sheppeard"
              className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Username */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="brontesheppeard"
              className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exclusive content & the only place I respond to all messages. Come join the fun. I'm 19 years old and I love to lift heavy weights."
              rows={4}
              className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none leading-relaxed p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
            {isSaving ? 'Updating...' : 'Update'}
          </PrimaryButton>
      </div>
    </div>
  )
}

