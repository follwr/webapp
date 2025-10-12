'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Wallet, ChevronRight, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { bankingApi, Balance, PaymentCard } from '@/lib/api/banking'
import { PrimaryButton } from '@/components/ui/primary-button'

export default function BankingPage() {
  const { user, isCreator, loading: authLoading } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState<Balance | null>(null)
  const [cards, setCards] = useState<PaymentCard[]>([])
  const [loadingBalance, setLoadingBalance] = useState(true)
  const [loadingCards, setLoadingCards] = useState(true)
  const [connectingStripe, setConnectingStripe] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && isCreator) {
      fetchBalance()
    }
    if (user) {
      fetchCards()
    }
  }, [user, isCreator])

  const fetchBalance = async () => {
    try {
      setLoadingBalance(true)
      const data = await bankingApi.getBalance()
      setBalance(data)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setError('Failed to load balance')
    } finally {
      setLoadingBalance(false)
    }
  }

  const fetchCards = async () => {
    try {
      setLoadingCards(true)
      const data = await bankingApi.getCards()
      setCards(data)
    } catch (err) {
      console.error('Failed to fetch cards:', err)
    } finally {
      setLoadingCards(false)
    }
  }

  const handleConnectStripe = async () => {
    try {
      setConnectingStripe(true)
      setError(null)
      const { onboardingUrl } = await bankingApi.createConnectAccount()
      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl
    } catch (err: unknown) {
      console.error('Failed to create Connect account:', err)
      const apiErr = err as { response?: { data?: { message?: string } } }
      setError(apiErr.response?.data?.message ?? 'Failed to connect Stripe account')
      setConnectingStripe(false)
    }
  }

  const handleWithdraw = () => {
    if (!balance?.stripeConnectAccountId) {
      alert('Please connect your bank account first')
      return
    }
    router.push('/banking/withdraw')
  }

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await bankingApi.removeCard(cardId)
        // Refresh cards list
        fetchCards()
      } catch (err) {
        console.error('Failed to delete card:', err)
        alert('Failed to delete card. Please try again.')
      }
    }
  }

  if (authLoading) {
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
        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Creator Balance Section */}
        {isCreator && (
          <>
            {/* Stripe Connect Banner (if not connected) */}
            {balance && !balance.stripeConnectAccountId && (
              <div className="mx-6 mt-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Connect your bank account
                    </h3>
                    <p className="text-sm text-gray-600">
                      Link your bank account to receive payouts from your earnings. We use Stripe for secure payments.
                    </p>
                  </div>
                </div>
                <PrimaryButton
                  onClick={handleConnectStripe}
                  isLoading={connectingStripe}
                  disabled={connectingStripe}
                >
                  Connect with Stripe
                </PrimaryButton>
              </div>
            )}

            {/* My Balance */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                My balance
              </h2>

              {loadingBalance ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : balance ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
                  {/* Wallet Icon */}
                  <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>

                  {/* Balance Info */}
                  <div className="flex-1">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${Number(balance.balance).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Available Balance
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Total Earnings: ${Number(balance.totalEarnings).toFixed(2)}
                    </div>
                  </div>

                  {/* Withdraw Button */}
                  <button
                    onClick={handleWithdraw}
                    disabled={!balance.stripeConnectAccountId || Number(balance.balance) === 0}
                    className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors flex items-center gap-2"
                  >
                    <span>Withdraw</span>
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center text-gray-500">
                  Failed to load balance
                </div>
              )}
            </div>
          </>
        )}

        {/* Non-Creator Message */}
        {!isCreator && (
          <div className="mx-6 mt-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              Creator account required
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Become a creator to start earning and manage your balance
            </p>
            <PrimaryButton onClick={() => router.push('/creator-signup')}>
              Become a Creator
            </PrimaryButton>
          </div>
        )}

        {/* Saved Cards */}
        <div className="px-6 pt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Saved cards
          </h2>

          {loadingCards ? (
            <div className="border border-gray-200 rounded-2xl p-5 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : cards.length > 0 ? (
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Card Logo */}
                    <div className="flex items-center gap-1">
                      {card.cardType?.toLowerCase() === 'mastercard' ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-red-500" />
                          <div className="w-8 h-8 rounded-full bg-orange-400 -ml-3" />
                        </>
                      ) : card.cardType?.toLowerCase() === 'visa' ? (
                        <div className="w-16 h-10 bg-blue-700 rounded flex items-center justify-center text-white font-bold text-xs">
                          VISA
                        </div>
                      ) : (
                        <div className="w-16 h-10 bg-gray-700 rounded flex items-center justify-center text-white font-bold text-xs">
                          CARD
                        </div>
                      )}
                    </div>

                    {/* Card Type and Number */}
                    <div className="flex-1">
                      <div className="text-base font-medium text-gray-900 capitalize">
                        {card.cardType}
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="text-right">
                      <div className="text-base font-medium text-gray-900">
                        •••• {card.lastFour}
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
          ) : (
            <div className="border border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-gray-500 mb-4">No saved cards</p>
              <p className="text-sm text-gray-400">
                Add a payment method when subscribing to creators
              </p>
            </div>
          )}
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

