import { apiClient } from './client'

export interface BroadcastList {
  id: string
  creatorId: string
  name: string
  memberIds: string[]
  createdAt: string
  updatedAt: string
}

export const broadcastApi = {
  // Get all broadcast lists
  getLists: async () => {
    const response = await apiClient.get<{ data: BroadcastList[] }>('/broadcast/lists')
    return response.data.data
  },

  // Create broadcast list
  createList: async (data: {
    name: string
    memberIds: string[]
  }) => {
    const response = await apiClient.post<{ data: BroadcastList }>('/broadcast/lists', data)
    return response.data.data
  },

  // Update broadcast list
  updateList: async (listId: string, data: {
    name?: string
    memberIds?: string[]
  }) => {
    const response = await apiClient.put<{ data: BroadcastList }>(`/broadcast/lists/${listId}`, data)
    return response.data.data
  },

  // Delete broadcast list
  deleteList: async (listId: string) => {
    const response = await apiClient.delete(`/broadcast/lists/${listId}`)
    return response.data
  },

  // Send broadcast message
  sendBroadcast: async (data: {
    listId: string
    content?: string
    mediaUrls?: string[]
    price?: number
  }) => {
    const response = await apiClient.post<{ data: { messagesSent: number; recipients: string[] } }>(
      '/broadcast/send',
      data
    )
    return response.data.data
  },
}

