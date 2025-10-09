'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Shield, Edit } from 'lucide-react'
import { ChatListItem } from './chat-list-item'

// Mock chat data
const mockChats = [
  {
    id: '1',
    userName: 'John Doe',
    lastMessage: 'Can you please send more',
    timestamp: '19:24',
    isUnread: true,
    isFromYou: false,
  },
  {
    id: '2',
    userName: 'John Doe',
    lastMessage: 'No worries John, talk soon!',
    timestamp: '19:24',
    isUnread: false,
    isFromYou: true,
  },
  {
    id: '3',
    userName: 'John Doe',
    lastMessage: 'No worries John, talk soon!',
    timestamp: '19:24',
    isUnread: false,
    isFromYou: true,
  },
  {
    id: '4',
    userName: 'John Doe',
    lastMessage: 'No worries John, talk soon!',
    timestamp: '19:24',
    isUnread: false,
    isFromYou: true,
  },
]

export function CreatorMessages() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showMockChats, setShowMockChats] = useState(true)

  // Filter chats based on search
  const filteredChats = mockChats.filter((chat) =>
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      <div className="px-6 pb-4 flex items-center gap-3">
        <button 
          onClick={() => router.push('/messages/broadcast')}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-full transition-colors"
        >
          Broadcast Message
        </button>
        {/* Mock data toggle */}
        <button
          onClick={() => setShowMockChats(!showMockChats)}
          className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-full transition-colors"
        >
          {showMockChats ? 'Hide' : 'Show'} Mock Chats
        </button>
      </div>

      {/* Chat List or Empty State */}
      {showMockChats && filteredChats.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              id={chat.id}
              userName={chat.userName}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
              isUnread={chat.isUnread}
              isFromYou={chat.isFromYou}
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

