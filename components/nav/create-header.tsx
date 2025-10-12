'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CreateHeaderProps {
  onPost?: () => void
  isLoading?: boolean
  displayName?: string
  username?: string
  profilePictureUrl?: string
}

export function CreateHeader({ 
  onPost, 
  isLoading, 
  displayName, 
  username, 
  profilePictureUrl 
}: CreateHeaderProps) {
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>

          {/* User Info */}
          {(displayName || username) && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profilePictureUrl} />
                <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                  {displayName?.charAt(0).toUpperCase() || username?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">
                  {displayName || username}
                </span>
                {displayName && username && (
                  <span className="text-xs text-gray-500">
                    @{username}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Post Button */}
        <PrimaryButton
          onClick={onPost}
          disabled={isLoading}
          isLoading={isLoading}
          className="!w-auto px-8 py-2"
        >
          Post
        </PrimaryButton>
      </div>
    </header>
  )
}
