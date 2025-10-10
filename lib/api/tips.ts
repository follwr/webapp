import { apiClient } from './client'

export interface Tip {
  id: string
  fromUserId: string
  toCreatorId: string
  postId?: string
  amount: number
  serviceFee: number
  createdAt: string
  toCreator?: {
    id: string
    displayName: string
    username: string
    profilePictureUrl?: string
  }
  post?: {
    id: string
    content?: string
  }
}

export const tipsApi = {
  // Send tip on a post
  sendTip: async (postId: string, amount: number, paymentMethodId?: string) => {
    const response = await apiClient.post<{ data: { clientSecret: string } }>(
      `/posts/${postId}/tip`,
      { amount, paymentMethodId }
    )
    return response.data.data
  },

  // Get tips received (creator only)
  getTipsReceived: async (page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: Tip[] }>('/tips/received', {
      params: { page, limit }
    })
    return response.data.data
  },

  // Get tips sent
  getTipsSent: async (page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: Tip[] }>('/tips/sent', {
      params: { page, limit }
    })
    return response.data.data
  },
}

