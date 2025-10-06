'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'

interface CreateHeaderProps {
  onPost?: () => void
  isLoading?: boolean
}

export function CreateHeader({ onPost, isLoading }: CreateHeaderProps) {
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>

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
