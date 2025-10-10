import { apiClient } from './client'
import { Post } from '../types'

export const savedApi = {
  // Save a post
  savePost: async (postId: string) => {
    const response = await apiClient.post(`/posts/${postId}/save`)
    return response.data
  },

  // Unsave a post
  unsavePost: async (postId: string) => {
    const response = await apiClient.delete(`/posts/${postId}/save`)
    return response.data
  },

  // Get saved posts
  getSavedPosts: async (page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: Post[] }>('/posts/saved', {
      params: { page, limit }
    })
    return response.data.data
  },
}

