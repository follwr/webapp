'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { creatorsApi } from '@/lib/api/creators'
import { setApiToken } from '@/lib/api/client'
import { CreatorProfile } from '@/lib/types'

type AuthContextType = {
  user: User | null
  creatorProfile: CreatorProfile | null
  isCreator: boolean
  loading: boolean
  accessToken: string | null
  signOut: () => Promise<void>
  refreshCreatorProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  creatorProfile: null,
  isCreator: false,
  loading: true,
  accessToken: null,
  signOut: async () => {},
  refreshCreatorProfile: async () => {},
})

// Module-level variable to prevent double initialization
let sharedInitRef: React.MutableRefObject<boolean> | null = null

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useState(() => createClient())[0] // Create only once

  // Fetch creator profile
  const fetchCreatorProfile = async () => {
    try {
      const profile = await creatorsApi.getMyProfile()
      setCreatorProfile(profile)
    } catch (error) {
      // User is not a creator - this is fine
      setCreatorProfile(null)
    }
  }

  const refreshCreatorProfile = async () => {
    await fetchCreatorProfile()
  }

  useEffect(() => {
    // Prevent double initialization in React 18 Strict Mode (dev)
    if (!sharedInitRef) {
      sharedInitRef = { current: false }
    }
    if (sharedInitRef.current) {
      return
    }
    sharedInitRef.current = true

    const lastUserIdRef = { current: null as string | null }

    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token ?? null
      const nextUser = session?.user ?? null
      setUser(nextUser)
      setAccessToken(token)
      setApiToken(token) // Update API client token
      setLoading(false)

      // Fetch creator profile if user changed
      const nextUserId = nextUser?.id ?? null
      if (nextUserId && lastUserIdRef.current !== nextUserId) {
        lastUserIdRef.current = nextUserId
        fetchCreatorProfile()
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

      // Fetch creator profile if user changed
      const nextUserId = nextUser?.id ?? null
      if (nextUserId && lastUserIdRef.current !== nextUserId) {
        lastUserIdRef.current = nextUserId
        fetchCreatorProfile()
      } else if (!nextUserId) {
        setCreatorProfile(null)
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setCreatorProfile(null)
    setAccessToken(null)
    setApiToken(null) // Clear API client token
    router.push('/auth/login')
  }

  const isCreator = !!creatorProfile

  return (
    <AuthContext.Provider value={{ user, creatorProfile, isCreator, loading, accessToken, signOut, refreshCreatorProfile }}>
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

