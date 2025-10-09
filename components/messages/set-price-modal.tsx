'use client'

import { X } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'

interface SetPriceModalProps {
  isOpen: boolean
  onClose: () => void
  price: string
  onPriceChange: (price: string) => void
  onConfirm: () => void
}

export function SetPriceModal({
  isOpen,
  onClose,
  price,
  onPriceChange,
  onConfirm,
}: SetPriceModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Set Price
            </h3>
            <button
              onClick={onClose}
              className="text-blue-600 hover:text-blue-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Price Input */}
          <div className="mb-6">
            <div className="flex items-center gap-4 px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-5xl text-blue-400 font-light">$</div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Price</div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => onPriceChange(e.target.value)}
                  placeholder="40"
                  className="w-full text-4xl bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-400 p-0"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <PrimaryButton
            onClick={handleConfirm}
            className="text-lg"
          >
            Confirm
          </PrimaryButton>
        </div>
      </div>
    </>
  )
}

