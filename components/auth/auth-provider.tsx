'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { creatorsApi } from '@/lib/api/creators'
import { CreatorProfile } from '@/lib/types'

type AuthContextType = {
  user: User | null
  creatorProfile: CreatorProfile | null
  isCreator: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshCreatorProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  creatorProfile: null,
  isCreator: false,
  loading: true,
  signOut: async () => {},
  refreshCreatorProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
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
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Fetch creator profile in background (non-blocking)
      if (session?.user) {
        fetchCreatorProfile()
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Fetch creator profile in background (non-blocking)
      if (session?.user) {
        fetchCreatorProfile()
      } else {
        setCreatorProfile(null)
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setCreatorProfile(null)
    router.push('/auth/login')
  }

  const isCreator = !!creatorProfile

  return (
    <AuthContext.Provider value={{ user, creatorProfile, isCreator, loading, signOut, refreshCreatorProfile }}>
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

