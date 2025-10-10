import { apiClient } from './client'

export const followsApi = {
  // Follow a creator
  follow: async (creatorId: string) => {
    const response = await apiClient.post(`/follows/${creatorId}`)
    return response.data
  },

  // Unfollow a creator
  unfollow: async (creatorId: string) => {
    const response = await apiClient.delete(`/follows/${creatorId}`)
    return response.data
  },
}

