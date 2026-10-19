import { Order, Payment } from '@/types/database.types'

export interface CreateCheckoutSessionParams {
  orderId: string
  eventId: string
  planCode: string
  amount: number
  currency: string
  customerEmail: string
  customerName?: string
  successUrl: string
  cancelUrl: string
}

export interface CheckoutSessionResult {
  sessionId: string
  checkoutUrl: string
  provider: 'mock' | 'stripe' | 'mercadopago'
}

export interface PaymentVerificationResult {
  success: boolean
  orderId: string
  externalTransactionId: string
  amount: number
  status: 'completed' | 'failed' | 'pending'
  rawPayload: Record<string, unknown>
}

export interface IPaymentProvider {
  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult>
  verifyWebhook(payload: unknown, signature?: string): Promise<PaymentVerificationResult>
}

/**
 * MockPaymentAdapter: Safe development adapter that simulates a completed checkout
 * without connecting to an external bank or real credentials.
 */
export class MockPaymentAdapter implements IPaymentProvider {
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult> {
    const mockSessionId = `mock_sess_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // In test mode, we construct a local checkout confirmation URL
    const url = new URL(params.successUrl)
    url.searchParams.set('session_id', mockSessionId)
    url.searchParams.set('mock_provider', 'true')
    url.searchParams.set('order_id', params.orderId)

    return {
      sessionId: mockSessionId,
      checkoutUrl: url.toString(),
      provider: 'mock',
    }
  }

  async verifyWebhook(payload: unknown): Promise<PaymentVerificationResult> {
    const data = payload as { orderId: string; externalTransactionId?: string; amount?: number }
    return {
      success: true,
      orderId: data.orderId,
      externalTransactionId: data.externalTransactionId || `mock_tx_${Date.now()}`,
      amount: data.amount || 29.99,
      status: 'completed',
      rawPayload: payload as Record<string, unknown>,
    }
  }
}

/**
 * Payment Service Factory: Resolves the active payment provider based on configuration.
 */
export function getPaymentProvider(): IPaymentProvider {
  const mode = process.env.PAYMENTS_MODE || 'test'
  
  if (mode === 'test' || !process.env.STRIPE_SECRET_KEY) {
    return new MockPaymentAdapter()
  }

  // Ready to inject live providers (e.g. StripeAdapter, MercadoPagoAdapter)
  return new MockPaymentAdapter()
}
