import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
    )
  }
  return stripePromise
}

/**
 * Helper to create a payment method from Stripe Elements
 */
export const createPaymentMethod = async (elements: StripeElements) => {
  const stripe = await getStripe()
  if (!stripe) throw new Error('Stripe not loaded')

  const cardElement = elements.getElement('card')
  if (!cardElement) throw new Error('Card element not found')

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  })

  if (error) throw error
  return paymentMethod
}

/**
 * Helper to confirm a card payment with client secret
 */
export const confirmCardPayment = async (clientSecret: string) => {
  const stripe = await getStripe()
  if (!stripe) throw new Error('Stripe not loaded')

  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret)
  
  if (error) throw error
  return paymentIntent
}

