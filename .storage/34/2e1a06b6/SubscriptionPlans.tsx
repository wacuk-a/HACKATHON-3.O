import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { subscriptionPlans, intaSendService, SubscriptionPlan } from '@/lib/intasend';
import PaymentModal from './PaymentModal';
import { User } from '@/types';

interface SubscriptionPlansProps {
  user: User;
  onUpgrade: (planId: string) => void;
}

export default function SubscriptionPlans({ user, onUpgrade }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      return; // Free plan is already active
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    if (selectedPlan) {
      onUpgrade(selectedPlan.id);
    }
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const getPlanIcon = (planId: string) => {
    if (planId === 'free') return <Zap className="h-6 w-6 text-blue-600" />;
    if (planId.includes('monthly')) return <Star className="h-6 w-6 text-purple-600" />;
    return <Crown className="h-6 w-6 text-yellow-600" />;
  };

  const getPlanBadge = (planId: string) => {
    if (planId === 'free') return null;
    if (planId.includes('yearly')) return <Badge className="bg-green-100 text-green-800">Best Value</Badge>;
    return <Badge className="bg-purple-100 text-purple-800">Popular</Badge>;
  };

  // Filter plans by currency (show KES plans by default)
  const displayPlans = subscriptionPlans.filter(plan => 
    plan.currency === 'KES' || plan.id === 'free'
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h2>
        <p className="text-lg text-gray-600">
          Unlock the full potential of AI-powered learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayPlans.map((plan) => {
          const isCurrentPlan = (plan.id === 'free' && !user.isPremium) || 
                               (plan.id !== 'free' && user.isPremium);
          const isPopular = plan.id.includes('monthly') && plan.id !== 'free';
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                isPopular ? 'border-purple-300 shadow-lg scale-105' : ''
              } ${isCurrentPlan ? 'border-green-300 bg-green-50' : ''}`}
            >
              {getPlanBadge(plan.id) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  {getPlanBadge(plan.id)}
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-800">
                    {plan.price === 0 ? 'Free' : intaSendService.formatCurrency(plan.price, plan.currency)}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-sm text-gray-600">per {plan.duration}</p>
                  )}
                  {plan.id.includes('yearly') && (
                    <p className="text-xs text-green-600 font-medium">Save 17%</p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full ${
                    plan.id === 'free' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                  }`}
                  variant={isCurrentPlan ? 'outline' : 'default'}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.id === 'free' ? 'Get Started' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Methods Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Secure Payment Methods</h3>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl mb-1">🇰🇪</div>
                <p className="text-sm font-medium">M-Pesa</p>
                <p className="text-xs text-gray-600">Kenya</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🇺🇬</div>
                <p className="text-sm font-medium">Airtel Money</p>
                <p className="text-xs text-gray-600">Uganda</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🇹🇿</div>
                <p className="text-sm font-medium">Airtel Money</p>
                <p className="text-xs text-gray-600">Tanzania</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">💳</div>
                <p className="text-sm font-medium">Cards</p>
                <p className="text-xs text-gray-600">All Countries</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Powered by IntaSend - Secure payments across East Africa
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}