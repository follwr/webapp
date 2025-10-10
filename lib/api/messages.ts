import { apiClient } from './client'

export interface Message {
  id: string
  senderId: string
  recipientId: string
  content?: string
  mediaUrls?: string[]
  price?: number
  isPurchased: boolean
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  partnerId: string
  partnerCreator: {
    id: string
    displayName: string
    username: string
    profilePictureUrl?: string
    isVerified: boolean
  } | null
  lastMessage: Message
  unreadCount: number
}

export const messagesApi = {
  // Get conversations list
  getConversations: async (page = 1, limit = 50) => {
    const response = await apiClient.get<{ data: Conversation[] }>('/messages/conversations', {
      params: { page, limit }
    })
    return response.data.data
  },

  // Get messages with a specific user
  getMessages: async (userId: string, page = 1, limit = 50) => {
    const response = await apiClient.get<{ data: Message[] }>(`/messages/${userId}`, {
      params: { page, limit }
    })
    return response.data.data
  },

  // Send message
  sendMessage: async (data: {
    recipientId: string
    content?: string
    mediaUrls?: string[]
    price?: number
  }) => {
    const response = await apiClient.post<{ data: Message }>('/messages/send', data)
    return response.data.data
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    const response = await apiClient.put(`/messages/${messageId}/read`)
    return response.data
  },

  // Purchase paid message
  purchaseMessage: async (messageId: string, paymentMethodId: string) => {
    const response = await apiClient.post<{ data: { clientSecret: string; messageId: string } }>(
      `/messages/${messageId}/purchase`,
      { paymentMethodId }
    )
    return response.data.data
  },
}

