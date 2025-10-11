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

  // Check if following a creator
  isFollowing: async (creatorId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ data: { isFollowing: boolean } }>(`/follows/${creatorId}/status`)
      return response.data.data.isFollowing
    } catch (error) {
      return false
    }
  },
}

