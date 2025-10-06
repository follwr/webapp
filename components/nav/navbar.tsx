'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/components/auth/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Home,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Users,
  Bell,
} from 'lucide-react'

export function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Left - App Icon */}
          <Link href={user ? "/feed" : "/"} className="flex items-center">
            <Image
              src="/assets/favicon.png"
              alt="Follwr"
              width={28}
              height={28}
              className="w-7 h-7"
              priority
            />
          </Link>

          {/* Right - Notification and Menu */}
          <div className="flex items-center gap-4">
            <Link href="/notifications" className="text-gray-700 hover:text-gray-900 transition-colors">
              <Bell className="w-6 h-6" strokeWidth={2} />
            </Link>
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          
          {/* Menu Content */}
          <div className="fixed top-20 right-6 z-50 bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-gray-100">
            <div className="p-4">
              {user ? (
                <>
                  {/* User Info */}
                  <Link 
                    href="/profile" 
                    onClick={toggleMenu}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </Link>

                  <div className="h-px bg-gray-200 my-2" />

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <Link 
                      href="/feed"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Feed</span>
                    </Link>

                    <Link 
                      href="/creators"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                    >
                      <Users className="h-5 w-5" />
                      <span className="font-medium">Creators</span>
                    </Link>

                    <Link 
                      href="/posts/create"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                    >
                      <PlusCircle className="h-5 w-5" />
                      <span className="font-medium">Create Post</span>
                    </Link>

                    <Link 
                      href="/profile"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </div>

                  <div className="h-px bg-gray-200 my-2" />

                  {/* Sign Out */}
                  <button
                    onClick={() => {
                      signOut()
                      toggleMenu()
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Not Logged In */}
                  <div className="space-y-2">
                    <Link 
                      href="/auth/login"
                      onClick={toggleMenu}
                      className="block w-full text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/signup"
                      onClick={toggleMenu}
                      className="block w-full text-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-14" />
    </>
  )
}
