// Types matching the backend schema

export interface User {
  id: string
  email: string
  created_at: string
}

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

export interface CreatorProfile {
  id: string
  userId: string
  userProfileId: string
  coverImageUrl?: string
  isVerified: boolean
  isFollowing?: boolean
  isSubscribed?: boolean
  subscriptionPrice?: number
  stripePriceId?: string
  stripeAccountId?: string
  totalEarnings: number
  totalSubscribers: number
  totalPosts: number
  totalLikes: number
  createdAt: string
  updatedAt: string
  userProfile?: UserProfile
  // Legacy fields for backward compatibility (will be removed)
  displayName?: string
  username?: string
  bio?: string
  profilePictureUrl?: string
}

export interface Post {
  id: string
  creatorId: string
  content?: string
  mediaUrls?: string[]
  visibility: 'public' | 'followers' | 'subscribers'
  price?: number | null
  totalLikes: number
  totalComments: number
  totalViews: number
  totalTips?: string
  isPinned: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  creator?: CreatorProfile
  isLiked?: boolean
  isSaved?: boolean
  hasPurchased?: boolean
  requiresPurchase?: boolean
  hasAccess?: boolean
}

export interface Subscription {
  id: string
  subscriberId: string
  creatorId: string
  tierId?: string
  status: 'active' | 'cancelled' | 'expired' | 'paused'
  startDate: string
  endDate?: string
  autoRenew: boolean
  creator?: CreatorProfile
}

export interface SubscriptionTier {
  id: string
  creatorId: string
  name: string
  description?: string
  price: number
  benefits?: string[]
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}


