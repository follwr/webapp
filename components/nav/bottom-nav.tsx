'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Send, User } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CreateModal } from './create-modal'

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const navItems = [
    { href: '/feed', icon: Home, label: 'Home' },
    { href: '/explore', icon: Search, label: 'Explore' },
    { href: '/create', icon: Plus, label: 'Create', isCreate: true },
    { href: '/messages', icon: Send, label: 'Messages' },
    { href: '/profile', icon: User, label: 'Profile', isProfile: true },
  ]

  return (
    <>
      <nav className="fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 px-6 py-3">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              if (item.isProfile) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-center p-2 rounded-xl transition-all hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8 border-2" style={{ borderColor: isActive ? '#3075FF' : 'transparent' }}>
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                )
              }

              if (item.isCreate) {
                return (
                  <button
                    key={item.href}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center p-2 rounded-xl transition-all hover:bg-gray-100"
                  >
                    <Icon 
                      className="h-6 w-6" 
                      style={{ 
                        color: isActive ? '#3075FF' : '#6b7280',
                        strokeWidth: 2
                      }}
                    />
                  </button>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center p-2 rounded-xl transition-all hover:bg-gray-100"
                >
                  <Icon 
                    className="h-6 w-6" 
                    style={{ 
                      color: isActive ? '#3075FF' : '#6b7280',
                      strokeWidth: 2
                    }}
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <CreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  )
}
