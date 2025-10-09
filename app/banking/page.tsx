'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Wallet, ChevronRight } from 'lucide-react'

// Mock saved cards
const mockCards = [
  {
    id: '1',
    type: 'Mastercard',
    lastFour: '7245',
    expiryMonth: '05',
    expiryYear: '22',
  },
]

export default function BankingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState(55.99)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleWithdraw = () => {
    router.push('/banking/withdraw')
  }

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      console.log('Deleting card:', cardId)
      // TODO: API call to delete card
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200 relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Banking & payouts
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* My Balance */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            My balance
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            {/* Wallet Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-white" strokeWidth={2} />
            </div>

            {/* Balance Info */}
            <div className="flex-1">
              <div className="text-2xl font-semibold text-gray-900">
                ${balance.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                Balance
              </div>
            </div>

            {/* Withdraw Button */}
            <button
              onClick={handleWithdraw}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-colors flex items-center gap-2"
            >
              <span>Withdraw</span>
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Saved Cards */}
        <div className="px-6 pt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Saved cards
          </h2>

          <div className="space-y-4">
            {mockCards.map((card) => (
              <div
                key={card.id}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-5"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* Card Logo */}
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-red-500" />
                    <div className="w-8 h-8 rounded-full bg-orange-400 -ml-3" />
                  </div>

                  {/* Card Type and Number */}
                  <div className="flex-1">
                    <div className="text-base font-medium text-gray-900">
                      {card.type}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="text-right">
                    <div className="text-base font-medium text-gray-900">
                      xxxx {card.lastFour}
                    </div>
                    <div className="text-sm text-gray-500">
                      exp {card.expiryMonth} / {card.expiryYear}
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-full transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="px-6 pt-6 pb-4">
          <p className="text-center text-sm text-gray-600 leading-relaxed mb-4">
            We are fully compliant with Payment Card Industry Data Security Standards.
          </p>

          {/* Card Logos */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Visa */}
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-blue-700 font-bold text-xs border border-gray-200">
              VISA
            </div>
            {/* Mastercard */}
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-6 rounded-full bg-red-500" />
              <div className="w-6 h-6 rounded-full bg-orange-400 -ml-2" />
            </div>
            {/* Maestro */}
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-6 rounded-full bg-blue-600" />
              <div className="w-6 h-6 rounded-full bg-red-500 -ml-2" />
            </div>
            {/* Diners Club */}
            <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-blue-700 font-bold text-[10px] border border-gray-200">
              DC
            </div>
            {/* Discover */}
            <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-[10px]">
              D
            </div>
            {/* JCB */}
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              JCB
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

