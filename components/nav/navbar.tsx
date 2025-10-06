'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Home,
  User,
  LogOut,
  PlusCircle,
} from 'lucide-react'

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            Follwr
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/feed">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Feed
                </Button>
              </Link>
              <Link href="/creators">
                <Button variant="ghost" size="sm">
                  Creators
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/posts/create">
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>

              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>

              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
