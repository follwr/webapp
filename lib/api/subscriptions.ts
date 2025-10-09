import { apiClient } from './client'
import { Subscription } from '../types'

export const subscriptionsApi = {
  // Subscribe to a creator
  subscribe: async (data: {
    creatorId: string
    tierId?: string
  }) => {
    const response = await apiClient.post<Subscription>('/subscriptions', data)
    return response.data
  },

  // Get my subscriptions
  getMySubscriptions: async () => {
    const response = await apiClient.get<Subscription[]>('/subscriptions/my-subscriptions')
    return response.data
  },

  // Check subscription status
  checkStatus: async (creatorId: string) => {
    const response = await apiClient.get<{ isSubscribed: boolean, subscription?: Subscription }>(
      `/subscriptions/creator/${creatorId}/check`
    )
    return response.data
  },

  // Cancel subscription
  cancel: async (subscriptionId: string) => {
    const response = await apiClient.delete(`/subscriptions/${subscriptionId}`)
    return response.data
  },
}

