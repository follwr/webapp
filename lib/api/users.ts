import { apiClient } from './client'

export interface UserProfile {
  id: string
  userId: string
  displayName: string
  username: string
  bio?: string
  profilePictureUrl?: string
  createdAt: string
  updatedAt: string
}

export const usersApi = {
  // Create user profile (required for all users)
  createProfile: async (data: {
    displayName: string
    username: string
    bio?: string
    profilePictureUrl?: string
  }) => {
    const response = await apiClient.post<UserProfile>('/users/profile', data)
    return response.data
  },

  // Get my user profile
  getMyProfile: async () => {
    const response = await apiClient.get<UserProfile>('/users/profile')
    return response.data
  },

  // Update my user profile
  updateProfile: async (data: {
    displayName?: string
    username?: string
    bio?: string
    profilePictureUrl?: string
  }) => {
    const response = await apiClient.put<UserProfile>('/users/profile', data)
    return response.data
  },

  // Get any user's profile by username (public)
  getByUsername: async (username: string) => {
    const response = await apiClient.get<UserProfile>(`/users/${username}`)
    return response.data
  },
}

