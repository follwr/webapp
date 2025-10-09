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
  onClick?: () => void
}

export function ChatListItem({
  id,
  userName,
  lastMessage,
  timestamp,
  isUnread = false,
  isFromYou = false,
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
      <div className="w-14 h-14 rounded-full bg-blue-400 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <h3 className="font-semibold text-gray-900 text-base mb-1">
          {userName}
        </h3>
        <p className="text-gray-500 text-sm truncate">
          {isFromYou && <span className="text-gray-600">You: </span>}
          {lastMessage}
        </p>
      </div>

      {/* Right side - Time and unread indicator */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-gray-500 text-sm">{timestamp}</span>
        {isUnread && (
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </div>
    </button>
  )
}

