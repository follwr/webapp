'use client'

import { useRouter } from 'next/navigation'

interface ChatListItemProps {
  id: string
  userName: string
  lastMessage: string
  timestamp: string
  isUnread?: boolean
  isFromYou?: boolean
  avatarUrl?: string
  isVerified?: boolean
  onClick?: () => void
}

export function ChatListItem({
  id,
  userName,
  lastMessage,
  timestamp,
  isUnread = false,
  isFromYou = false,
  avatarUrl,
  isVerified = false,
  onClick,
}: ChatListItemProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Navigate to chat thread
      router.push(`/messages/${id}`)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-blue-400 flex-shrink-0 overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-semibold text-gray-900 text-base">
            {userName}
          </h3>
          {isVerified && (
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              <circle cx="12" cy="12" r="10" fill="currentColor"/>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
            </svg>
          )}
        </div>
        <p className="text-gray-500 text-sm truncate">
          {isFromYou && <span className="text-gray-600">You: </span>}
          {lastMessage}
        </p>
      </div>

      {/* Right side - Time */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-gray-500 text-sm">{timestamp}</span>
      </div>
    </button>
  )
}

