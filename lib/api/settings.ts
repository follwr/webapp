import { apiClient } from './client'

export const settingsApi = {
  // Update profile (creator only)
  updateProfile: async (data: {
    displayName?: string
    username?: string
    bio?: string
    profilePictureUrl?: string
    coverImageUrl?: string
  }) => {
    const response = await apiClient.put('/settings/profile', data)
    return response.data
  },

  // Update account
  updateAccount: async (data: {
    email?: string
    phone?: string
  }) => {
    const response = await apiClient.put('/settings/account', data)
    return response.data
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post('/settings/password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  // Delete account
  deleteAccount: async () => {
    const response = await apiClient.delete('/settings/account')
    return response.data
  },

  // Update subscription price (creator only)
  updateSubscriptionPrice: async (price: number) => {
    const response = await apiClient.put('/settings/subscription-price', { price })
    return response.data
  },
}

