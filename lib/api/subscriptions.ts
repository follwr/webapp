import { apiClient } from './client'
import { Subscription } from '../types'

export const subscriptionsApi = {
  // Create Stripe checkout session for subscription
  createCheckoutSession: async (creatorId: string) => {
    const response = await apiClient.post<{ data: { checkoutUrl: string; sessionId: string } }>(
      `/subscriptions/${creatorId}/checkout`
    )
    return response.data.data
  },

  // Subscribe to a creator (old method with payment method)
  subscribe: async (creatorId: string, paymentMethodId: string) => {
    const response = await apiClient.post<{ data: { subscription: Subscription; clientSecret?: string } }>(
      `/subscriptions/${creatorId}`,
      { paymentMethodId }
    )
    return response.data.data
  },

  // Get my subscriptions
  getMySubscriptions: async (page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: Subscription[] }>('/subscriptions', {
      params: { page, limit }
    })
    return response.data.data
  },

  // Get subscription details
  getSubscription: async (subscriptionId: string) => {
    const response = await apiClient.get<{ data: Subscription }>(`/subscriptions/${subscriptionId}`)
    return response.data.data
  },

  // Cancel subscription
  cancel: async (subscriptionId: string) => {
    const response = await apiClient.delete<{ data: Subscription }>(`/subscriptions/${subscriptionId}`)
    return response.data.data
  },

  // Update auto-renewal
  updateAutoRenew: async (subscriptionId: string, autoRenew: boolean) => {
    const response = await apiClient.put<{ data: Subscription }>(`/subscriptions/${subscriptionId}`, {
      autoRenew
    })
    return response.data.data
  },
}

