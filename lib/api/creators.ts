import { apiClient } from './client'
import { CreatorProfile } from '../types'

export const creatorsApi = {
  // Create creator profile
  createProfile: async (data: {
    displayName: string
    username: string
    bio?: string
  }) => {
    const response = await apiClient.post<CreatorProfile>('/creators/profile', data)
    return response.data
  },

  // Get my creator profile
  getMyProfile: async () => {
    const response = await apiClient.get<CreatorProfile>('/creators/profile')
    return response.data
  },

  // Update creator profile
  updateProfile: async (data: Partial<CreatorProfile>) => {
    const response = await apiClient.put<CreatorProfile>('/creators/profile', data)
    return response.data
  },

  // Get creator by username
  getByUsername: async (username: string) => {
    const response = await apiClient.get<CreatorProfile>(`/creators/${username}`)
    return response.data
  },

  // Get creator stats
  getStats: async (creatorId: string) => {
    const response = await apiClient.get(`/creators/${creatorId}/stats`)
    return response.data
  },
}

