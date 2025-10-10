import { apiClient } from './client'
import { CreatorProfile, Post } from '../types'

export const creatorsApi = {
  // Create creator profile
  createProfile: async (data: {
    displayName: string
    username: string
    bio?: string
    profilePictureUrl?: string
    coverImageUrl?: string
  }) => {
    const response = await apiClient.post<{ data: CreatorProfile }>('/creators/profile', data)
    return response.data.data
  },

  // Get my creator profile
  getMyProfile: async () => {
    const response = await apiClient.get<{ data: CreatorProfile }>('/creators/profile')
    return response.data.data
  },

  // Update creator profile
  updateProfile: async (data: {
    displayName?: string
    username?: string
    bio?: string
    profilePictureUrl?: string
    coverImageUrl?: string
  }) => {
    const response = await apiClient.put<{ data: CreatorProfile }>('/creators/profile', data)
    return response.data.data
  },

  // Get creator by username
  getByUsername: async (username: string) => {
    const response = await apiClient.get<{ data: { profile: CreatorProfile; posts: Post[] } }>(
      `/creators/${username}`
    )
    return response.data.data
  },

  // Get creator stats
  getStats: async (creatorId: string) => {
    const response = await apiClient.get<{ data: { totalPosts: number; totalLikes: number; totalSubscribers: number; totalEarnings: number } }>(
      `/creators/${creatorId}/stats`
    )
    return response.data.data
  },

  // List all creators (for explore page) - NOT IMPLEMENTED YET IN BACKEND
  listCreators: async (page = 1, limit = 20) => {
    // TODO: Backend needs to implement GET /creators endpoint
    // For now, return empty array
    console.warn('GET /creators endpoint not implemented in backend yet')
    return []
  },
}

