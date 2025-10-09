'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
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
  Radio,
  Bookmark,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Settings,
  HelpCircle,
} from 'lucide-react'

export function Navbar() {
  const { user, isCreator, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Hide navbar on specific pages
  const hideNavbar = pathname === '/explore' || pathname?.startsWith('/create') || pathname?.startsWith('/messages') || pathname?.startsWith('/settings') || pathname?.startsWith('/subscriptions') || pathname?.startsWith('/banking') || pathname?.startsWith('/saved') || pathname?.startsWith('/purchased') || pathname?.startsWith('/products/')

  if (hideNavbar) {
    return null
  }

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

      {/* Fullscreen Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
          />
          
          {/* Menu Content - Fullscreen on mobile */}
          <div className="fixed top-0 right-0 bottom-0 z-50 bg-white w-80 max-w-[85vw] shadow-2xl overflow-y-auto">
            <div className="p-6">
              {user ? (
                <>
                  {/* User Info */}
                  <Link 
                    href="/profile" 
                    onClick={toggleMenu}
                    className="flex items-center gap-4 mb-6"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-blue-600 text-white text-xl">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="font-semibold text-xl text-gray-900 truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                        </p>
                        {isCreator && (
                          <svg className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            <circle cx="12" cy="12" r="10" fill="currentColor"/>
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        @{user.email?.split('@')[0] || 'username'}
                      </p>
                    </div>
                  </Link>

                  <div className="h-px bg-gray-200 mb-4" />

                  {/* Menu Items - Different for creators vs users */}
                  {isCreator ? (
                    // Creator Menu
                    <div className="space-y-2">
                      <Link 
                        href="/subscriptions"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Subscriptions</span>
                      </Link>

                      <Link 
                        href="/saved"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Saved posts</span>
                      </Link>

                      <Link 
                        href="/purchased"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Purchased Items</span>
                      </Link>

                      <div className="h-px bg-gray-200 my-4" />

                      <Link 
                        href="/analytics"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Analytics</span>
                      </Link>

                      <Link 
                        href="/banking"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Banking and payouts</span>
                      </Link>

                      <Link 
                        href="/subscription-price"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Subscription Price</span>
                      </Link>

                      <div className="h-px bg-gray-200 my-4" />

                      <Link 
                        href="/messages/broadcast"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Broadcast List</span>
                      </Link>

                      <Link 
                        href="/referral"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Referral Program</span>
                      </Link>

                      <div className="h-px bg-gray-200 my-4" />

                      <Link 
                        href="/settings"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Settings</span>
                      </Link>

                      <Link 
                        href="/help"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Help & Support</span>
                      </Link>

                      <div className="h-px bg-gray-200 my-4" />

                      <button
                        onClick={() => {
                          signOut()
                          toggleMenu()
                        }}
                        className="w-full text-left py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Logout</span>
                      </button>
                    </div>
                  ) : (
                    // Regular User Menu
                    <div className="space-y-2">
                      <Link 
                        href="/subscriptions"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Subscriptions</span>
                      </Link>

                      <Link 
                        href="/saved"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Saved posts</span>
                      </Link>

                      <Link 
                        href="/purchased"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Purchased Items</span>
                      </Link>

                      <div className="h-px bg-gray-200 my-4" />

                      <Link 
                        href="/banking"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Banking</span>
                      </Link>

                      <Link 
                        href="/start-earning"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Start Earning</span>
                      </Link>

                      <div className="h-px bg-gray-200 my-4" />

                      <Link 
                        href="/settings"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Settings</span>
                      </Link>

                      <Link 
                        href="/help"
                        onClick={toggleMenu}
                        className="block py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Help & Support</span>
                      </Link>

                      <div className="h-px bg-gray-200 my-4" />

                      <button
                        onClick={() => {
                          signOut()
                          toggleMenu()
                        }}
                        className="w-full text-left py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                      >
                        <span className="font-normal text-[15px]">Logout</span>
                      </button>
                    </div>
                  )}
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
    </>
  )
}

