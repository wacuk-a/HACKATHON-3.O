import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, CreditCard, Smartphone, Check, Crown } from 'lucide-react';
import { SubscriptionPlan, intaSendService, PaymentRequest } from '@/lib/intasend';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onPaymentSuccess: (paymentId: string) => void;
}

export default function PaymentModal({ isOpen, onClose, plan, onPaymentSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'method' | 'processing'>('details');
  const [country, setCountry] = useState<'KE' | 'UG' | 'TZ'>('KE');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const supportedMethods = intaSendService.getSupportedMethods(country);
  const currencyMap = { KE: 'KES', UG: 'UGX', TZ: 'TZS' } as const;
  const selectedCurrency = currencyMap[country];

  // Get plan price for selected country/currency
  const getPlanPrice = () => {
    if (plan.currency === selectedCurrency) {
      return plan.price;
    }
    
    // Convert prices (approximate rates)
    const rates = {
      KES: { UGX: 40, TZS: 24 },
      UGX: { KES: 0.025, TZS: 0.6 },
      TZS: { KES: 0.042, UGX: 1.67 }
    };
    
    if (plan.currency in rates && selectedCurrency in rates[plan.currency as keyof typeof rates]) {
      return Math.round(plan.price * rates[plan.currency as keyof typeof rates][selectedCurrency as keyof typeof rates.KES]);
    }
    
    return plan.price;
  };

  const handlePayment = async () => {
    if (!email || (!phoneNumber && paymentMethod !== 'CARD')) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const paymentData: PaymentRequest = {
        amount: getPlanPrice(),
        currency: selectedCurrency,
        email,
        phone_number: phoneNumber,
        method: paymentMethod as 'MPESA' | 'AIRTEL-MONEY' | 'CARD',
        api_ref: `sub_${plan.id}_${Date.now()}`,
        redirect_url: `${window.location.origin}/payment-success`,
      };

      const response = await intaSendService.initiatePayment(paymentData);
      
      // In a real implementation, you would redirect to the checkout URL
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        onPaymentSuccess('demo_payment_id');
        toast.success('Payment successful! Premium features activated.');
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setStep('method');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('details');
    setPaymentMethod('');
    setPhoneNumber('');
    setEmail('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            <span>Upgrade to Premium</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'details' && (
          <div className="space-y-6">
            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-yellow-600">
                  {intaSendService.formatCurrency(getPlanPrice(), selectedCurrency)}
                  <span className="text-sm font-normal text-gray-600">
                    /{plan.duration}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="country">Select Country</Label>
                <Select value={country} onValueChange={(value: 'KE' | 'UG' | 'TZ') => setCountry(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KE">🇰🇪 Kenya</SelectItem>
                    <SelectItem value="UG">🇺🇬 Uganda</SelectItem>
                    <SelectItem value="TZ">🇹🇿 Tanzania</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <Button 
              onClick={() => setStep('method')} 
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
              disabled={!email}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 'method' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Choose Payment Method</h3>
              <p className="text-sm text-gray-600">
                Total: {intaSendService.formatCurrency(getPlanPrice(), selectedCurrency)}
              </p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {supportedMethods.map((method) => (
                <div key={method.method} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={method.method} id={method.method} />
                  <Label htmlFor={method.method} className="flex items-center space-x-3 cursor-pointer flex-1">
                    {method.method === 'CARD' ? (
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Smartphone className="h-5 w-5 text-green-600" />
                    )}
                    <span>{method.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {paymentMethod && paymentMethod !== 'CARD' && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={country === 'KE' ? '254712345678' : country === 'UG' ? '256712345678' : '255712345678'}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your mobile money number
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={!paymentMethod || (paymentMethod !== 'CARD' && !phoneNumber)}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center space-y-6 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Processing Payment</h3>
              <p className="text-sm text-gray-600">
                {paymentMethod === 'MPESA' && 'Check your phone for M-Pesa prompt'}
                {paymentMethod === 'AIRTEL-MONEY' && 'Check your phone for Airtel Money prompt'}
                {paymentMethod === 'CARD' && 'Redirecting to secure payment page'}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}