'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { creatorsApi } from '@/lib/api/creators'
import { usersApi, UserProfile } from '@/lib/api/users'
import { setApiToken } from '@/lib/api/client'
import { CreatorProfile } from '@/lib/types'

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  creatorProfile: CreatorProfile | null
  isCreator: boolean
  loading: boolean
  accessToken: string | null
  signOut: () => Promise<void>
  refreshCreatorProfile: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  creatorProfile: null,
  isCreator: false,
  loading: true,
  accessToken: null,
  signOut: async () => {},
  refreshCreatorProfile: async () => {},
  refreshUserProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useState(() => createClient())[0] // Create only once
  const lastUserIdRef = useRef<string | null>(null)
  const fetchingProfilesRef = useRef(false)

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const profile = await usersApi.getMyProfile()
      setUserProfile(profile)
    } catch {
      // User doesn't have a profile yet
      setUserProfile(null)
    }
  }

  // Fetch creator profile
  const fetchCreatorProfile = async () => {
    try {
      const profile = await creatorsApi.getMyProfile()
      // API now returns { data: profile } or { data: null }
      setCreatorProfile(profile || null)
    } catch (error) {
      // If there's an actual error, log it but still set to null
      console.error('Error fetching creator profile:', error)
      setCreatorProfile(null)
    }
  }

  // Fetch both profiles with deduplication
  const fetchProfiles = async (userId: string) => {
    // Prevent duplicate fetches
    if (fetchingProfilesRef.current || lastUserIdRef.current === userId) {
      return
    }
    
    fetchingProfilesRef.current = true
    lastUserIdRef.current = userId
    
    try {
      await Promise.all([fetchUserProfile(), fetchCreatorProfile()])
    } finally {
      fetchingProfilesRef.current = false
    }
  }

  const refreshCreatorProfile = async () => {
    await fetchCreatorProfile()
  }

  const refreshUserProfile = async () => {
    await fetchUserProfile()
  }

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token ?? null
      const nextUser = session?.user ?? null
      setUser(nextUser)
      setAccessToken(token)
      setApiToken(token) // Update API client token
      setLoading(false)

      // Fetch profiles if user exists
      if (nextUser?.id) {
        fetchProfiles(nextUser.id)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const token = session?.access_token ?? null
      const nextUser = session?.user ?? null
      setUser(nextUser)
      setAccessToken(token)
      setApiToken(token) // Update API client token
      setLoading(false)

      // Fetch profiles if user exists, clear if logged out
      if (nextUser?.id) {
        fetchProfiles(nextUser.id)
      } else {
        setUserProfile(null)
        setCreatorProfile(null)
        lastUserIdRef.current = null
        fetchingProfilesRef.current = false
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserProfile(null)
    setCreatorProfile(null)
    setAccessToken(null)
    setApiToken(null) // Clear API client token
    lastUserIdRef.current = null
    fetchingProfilesRef.current = false
    router.push('/auth/login')
  }

  const isCreator = !!creatorProfile

  return (
    <AuthContext.Provider value={{ user, userProfile, creatorProfile, isCreator, loading, accessToken, signOut, refreshCreatorProfile, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

