// IntaSend Payment Integration for East African Markets
// Supports M-Pesa, Airtel Money, and Card payments

export interface IntaSendConfig {
  publicKey: string;
  isTest: boolean;
}

export interface PaymentRequest {
  amount: number;
  currency: 'KES' | 'UGX' | 'TZS';
  email: string;
  phone_number?: string;
  api_ref?: string;
  method: 'MPESA' | 'AIRTEL-MONEY' | 'CARD';
  redirect_url?: string;
}

export interface PaymentResponse {
  id: string;
  state: 'PENDING' | 'COMPLETE' | 'FAILED';
  provider: string;
  charges: number;
  net_amount: number;
  currency: string;
  value: string;
  account: string;
  api_ref: string;
  host: string;
  failed_reason?: string;
  failed_code?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: 'KES' | 'UGX' | 'TZS';
  duration: 'monthly' | 'yearly';
  features: string[];
}

class IntaSendService {
  private config: IntaSendConfig;
  private baseUrl: string;

  constructor(config: IntaSendConfig) {
    this.config = config;
    this.baseUrl = config.isTest 
      ? 'https://sandbox.intasend.com/api/v1'
      : 'https://payment.intasend.com/api/v1';
  }

  // Initialize payment checkout
  async initiatePayment(paymentData: PaymentRequest): Promise<{ checkout_url: string; signature: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-IntaSend-Public-Key-Test': this.config.publicKey,
        },
        body: JSON.stringify({
          ...paymentData,
          host: window.location.origin,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment initiation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('IntaSend payment initiation error:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}/`, {
        method: 'GET',
        headers: {
          'X-IntaSend-Public-Key-Test': this.config.publicKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Payment status check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('IntaSend payment status error:', error);
      throw error;
    }
  }

  // Get supported payment methods for country
  getSupportedMethods(country: 'KE' | 'UG' | 'TZ'): Array<{ method: string; name: string; currency: string }> {
    const methods = {
      KE: [
        { method: 'MPESA', name: 'M-Pesa', currency: 'KES' },
        { method: 'CARD', name: 'Credit/Debit Card', currency: 'KES' },
      ],
      UG: [
        { method: 'AIRTEL-MONEY', name: 'Airtel Money', currency: 'UGX' },
        { method: 'CARD', name: 'Credit/Debit Card', currency: 'UGX' },
      ],
      TZ: [
        { method: 'AIRTEL-MONEY', name: 'Airtel Money', currency: 'TZS' },
        { method: 'CARD', name: 'Credit/Debit Card', currency: 'TZS' },
      ],
    };

    return methods[country] || methods.KE;
  }

  // Format currency for display
  formatCurrency(amount: number, currency: 'KES' | 'UGX' | 'TZS'): string {
    const symbols = {
      KES: 'KSh',
      UGX: 'USh',
      TZS: 'TSh',
    };

    return `${symbols[currency]} ${amount.toLocaleString()}`;
  }
}

// Subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'KES',
    duration: 'monthly',
    features: [
      '3 PDF uploads per month',
      '5 quizzes per month',
      'Basic progress tracking',
      'Standard support'
    ]
  },
  {
    id: 'premium_monthly_kes',
    name: 'Premium Monthly',
    price: 500,
    currency: 'KES',
    duration: 'monthly',
    features: [
      'Unlimited PDF uploads',
      'Unlimited quiz generation',
      'Advanced analytics',
      'Flashcard generation',
      'Summary generation',
      'Export functionality',
      'Priority support'
    ]
  },
  {
    id: 'premium_yearly_kes',
    name: 'Premium Yearly',
    price: 5000,
    currency: 'KES',
    duration: 'yearly',
    features: [
      'Unlimited PDF uploads',
      'Unlimited quiz generation',
      'Advanced analytics',
      'Flashcard generation',
      'Summary generation',
      'Export functionality',
      'Priority support',
      '2 months free'
    ]
  },
  {
    id: 'premium_monthly_ugx',
    name: 'Premium Monthly',
    price: 20000,
    currency: 'UGX',
    duration: 'monthly',
    features: [
      'Unlimited PDF uploads',
      'Unlimited quiz generation',
      'Advanced analytics',
      'Flashcard generation',
      'Summary generation',
      'Export functionality',
      'Priority support'
    ]
  },
  {
    id: 'premium_monthly_tzs',
    name: 'Premium Monthly',
    price: 12000,
    currency: 'TZS',
    duration: 'monthly',
    features: [
      'Unlimited PDF uploads',
      'Unlimited quiz generation',
      'Advanced analytics',
      'Flashcard generation',
      'Summary generation',
      'Export functionality',
      'Priority support'
    ]
  }
];

// Initialize IntaSend service
export const intaSendService = new IntaSendService({
  publicKey: 'ISPubKey_test_your_public_key_here', // Replace with your actual public key
  isTest: true, // Set to false for production
});

export default IntaSendService;