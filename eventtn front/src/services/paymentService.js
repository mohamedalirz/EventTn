import api, { USE_MOCK, mockDelay } from './api'

// Frontend only creates the payment intent and reacts to success/failure.
// Swap the mock branch for real Stripe/Konnect/Flouci redirect handling
// once the backend exposes /payments/create and /payments/callback.

async function createPayment({ eventId, amount, quantity }) {
  if (USE_MOCK) {
    await mockDelay(700)
    // Simulate a payment gateway approving the charge.
    return { success: true, reference: `PAY-${Date.now()}`, amount, eventId, quantity }
  }
  const { data } = await api.post('/payments/create', { eventId, amount, quantity })
  return data
}

async function verifyPayment(reference) {
  if (USE_MOCK) {
    await mockDelay(200)
    return { success: true, reference, status: 'PAID' }
  }
  const { data } = await api.post('/payments/callback', { reference })
  return data
}

export const paymentService = { createPayment, verifyPayment }
