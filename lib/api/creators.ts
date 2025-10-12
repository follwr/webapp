import { apiClient } from './client'
import { CreatorProfile, Post } from '../types'

export const creatorsApi = {
  // Create creator profile
  createProfile: async (data: {
    coverImageUrl?: string
    subscriptionPrice?: number
  }) => {
    const response = await apiClient.post<{ data: CreatorProfile }>('/creators/profile', data)
    return response.data.data
  },

  // Get my creator profile
  getMyProfile: async () => {
    const response = await apiClient.get<{ data: CreatorProfile | null }>('/creators/profile')
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
    const response = await apiClient.get<CreatorProfile & { posts: Post[] }>(
      `/creators/${username}`
    )
    return response.data
  },

  // Get creator stats
  getStats: async (creatorId: string) => {
    const response = await apiClient.get<{ data: { totalPosts: number; totalLikes: number; totalSubscribers: number; totalEarnings: number } }>(
      `/creators/${creatorId}/stats`
    )
    return response.data.data
  },

  // List all creators (for explore page)
  listCreators: async (params?: {
    q?: string
    page?: number
    limit?: number
    sort?: 'trending' | 'newest' | 'popular'
  }) => {
    const response = await apiClient.get<{ data: CreatorProfile[] }>('/creators', {
      params: {
        q: params?.q,
        page: params?.page || 1,
        limit: params?.limit || 20,
        sort: params?.sort || 'trending'
      }
    })
    return response.data.data
  },
}

