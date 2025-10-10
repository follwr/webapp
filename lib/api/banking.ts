import { apiClient } from './client'

export interface PaymentCard {
  id: string
  userId: string
  cardType: string
  lastFour: string
  expiryMonth: number
  expiryYear: number
  createdAt: string
}

export interface Balance {
  balance: number
  totalEarnings: number
  stripeConnectAccountId: string | null
}

export interface Payout {
  payoutId: string
  amount: number
  status: string
  arrivalDate: Date | null
}

export const bankingApi = {
  // Get balance
  getBalance: async () => {
    const response = await apiClient.get<{ data: Balance }>('/banking/balance')
    return response.data.data
  },

  // Create Stripe Connect account
  createConnectAccount: async () => {
    const response = await apiClient.post<{ data: { accountId: string; onboardingUrl: string } }>(
      '/banking/connect'
    )
    return response.data.data
  },

  // Withdraw funds
  withdraw: async (amount: number) => {
    const response = await apiClient.post<{ data: Payout }>('/banking/withdraw', { amount })
    return response.data.data
  },

  // Get payment cards
  getCards: async () => {
    const response = await apiClient.get<{ data: PaymentCard[] }>('/banking/cards')
    return response.data.data
  },

  // Add payment card
  addCard: async (stripePaymentMethodId: string) => {
    const response = await apiClient.post<{ data: PaymentCard }>('/banking/cards', {
      stripePaymentMethodId
    })
    return response.data.data
  },

  // Remove card
  removeCard: async (cardId: string) => {
    const response = await apiClient.delete(`/banking/cards/${cardId}`)
    return response.data
  },
}

