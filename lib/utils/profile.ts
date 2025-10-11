import { CreatorProfile } from '../types'

/**
 * Helper functions to access profile data from the new two-tier system
 * These provide backward compatibility during the migration
 */

export function getCreatorDisplayName(creator?: CreatorProfile | null): string {
  return creator?.userProfile?.displayName || creator?.displayName || 'Unknown'
}

export function getCreatorUsername(creator?: CreatorProfile | null): string {
  return creator?.userProfile?.username || creator?.username || 'unknown'
}

export function getCreatorBio(creator?: CreatorProfile | null): string | undefined {
  return creator?.userProfile?.bio || creator?.bio
}

export function getCreatorProfilePicture(creator?: CreatorProfile | null): string | undefined {
  return creator?.userProfile?.profilePictureUrl || creator?.profilePictureUrl
}

