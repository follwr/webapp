import { apiClient } from './client'

export const likesApi = {
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

