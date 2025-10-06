'use client'

import { Image, Clapperboard, Radio, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface CreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateModal({ isOpen, onClose }: CreateModalProps) {
  if (!isOpen) return null

  const options = [
    { icon: Image, label: 'Create a post', href: '/create' },
    { icon: Clapperboard, label: 'Create slides', href: '/create/slides' },
    { icon: Radio, label: 'Go live', href: '/create/live' },
    { icon: ShoppingBag, label: 'Shop Product', href: '/create/shop' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-30 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-30 animate-slide-up">
        <div className="bg-white rounded-3xl px-6 py-4 mx-4 mb-24 shadow-xl">
          <div className="space-y-1">
            {options.map((option) => {
              const Icon = option.icon
              return (
                <Link
                  key={option.label}
                  href={option.href}
                  onClick={onClose}
                  className="flex items-center gap-4 px-3 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Icon className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
                  <span className="text-base font-normal text-gray-900">
                    {option.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
