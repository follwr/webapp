import { apiClient } from './client'
import { Post } from '../types'

export const postsApi = {
  // Create a new post
  createPost: async (data: {
    content?: string
    mediaUrls?: string[]
    visibility?: 'public' | 'followers' | 'subscribers'
    price?: number
  }) => {
    const response = await apiClient.post<{ data: Post }>('/posts', data)
    return response.data.data
  },

  // Get personalized feed
  getFeed: async (page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: Post[] }>('/posts', {
      params: { page, limit }
    })
    return response.data.data
  },

  // Get single post
  getPost: async (postId: string) => {
    const response = await apiClient.get<{ data: Post }>(`/posts/${postId}`)
    return response.data.data
  },

  // Delete post
  deletePost: async (postId: string) => {
    const response = await apiClient.delete(`/posts/${postId}`)
    return response.data
  },

  // Purchase post
  purchasePost: async (postId: string, paymentMethodId: string) => {
    const response = await apiClient.post<{ data: { clientSecret: string; postId: string } }>(
      `/posts/${postId}/purchase`,
      { paymentMethodId }
    )
    return response.data.data
  },

  // Like a post
  likePost: async (postId: string) => {
    const response = await apiClient.post(`/posts/${postId}/like`)
    return response.data
  },

  // Unlike a post
  unlikePost: async (postId: string) => {
    const response = await apiClient.delete(`/posts/${postId}/like`)
    return response.data
  },
}

