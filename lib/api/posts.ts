import { apiClient } from './client'
import { Post } from '../types'

export const postsApi = {
  // Create a new post
  createPost: async (data: {
    content?: string
    mediaUrls?: string[]
    isPublic?: boolean
    requiresTier?: string
  }) => {
    const response = await apiClient.post<Post>('/posts', data)
    return response.data
  },

  // Get personalized feed
  getFeed: async (page = 1, limit = 20) => {
    const response = await apiClient.get<Post[]>('/posts/feed', {
      params: { page, limit }
    })
    return response.data
  },

  // Get posts by creator
  getCreatorPosts: async (creatorId: string, page = 1, limit = 20) => {
    const response = await apiClient.get<Post[]>(`/posts/creator/${creatorId}`, {
      params: { page, limit }
    })
    return response.data
  },

  // Get single post
  getPost: async (postId: string) => {
    const response = await apiClient.get<Post>(`/posts/${postId}`)
    return response.data
  },

  // Like/unlike a post
  toggleLike: async (postId: string) => {
    const response = await apiClient.post(`/posts/${postId}/like`)
    return response.data
  },
}

