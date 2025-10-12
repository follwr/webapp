'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Shield, Edit } from 'lucide-react'
import { ChatListItem } from './chat-list-item'
import { messagesApi, Conversation } from '@/lib/api/messages'

export function CreatorMessages() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      loadConversations()
    }
  }, [])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await messagesApi.getConversations()
      setConversations(data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    const name = conv.partnerCreator?.displayName || conv.partnerCreator?.username || 'User'
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getConversationName = (conv: Conversation) => {
    return conv.partnerCreator?.displayName || conv.partnerCreator?.username || 'User'
  }

  const getConversationAvatar = (conv: Conversation) => {
    return conv.partnerCreator?.profilePictureUrl
  }

  const formatTimestamp = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Shield className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Edit className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a user"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Broadcast Message Button */}
      <div className="px-6 pb-4">
        <button 
          onClick={() => router.push('/messages/broadcast')}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-full transition-colors"
        >
          Broadcast Message
        </button>
      </div>

      {/* Chat List or Empty State */}
      {filteredConversations.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <ChatListItem
              key={conv.partnerId}
              id={conv.partnerId}
              userName={getConversationName(conv)}
              lastMessage={conv.lastMessage?.content || 'Media message'}
              timestamp={formatTimestamp(conv.lastMessage?.createdAt)}
              isUnread={conv.unreadCount > 0}
              isFromYou={conv.lastMessage?.senderId !== conv.partnerId}
              avatarUrl={getConversationAvatar(conv)}
              isVerified={conv.partnerCreator?.isVerified}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No chats yet
            </h2>
            <p className="text-gray-500 text-lg">
              Chats with your subscribers will be here
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

