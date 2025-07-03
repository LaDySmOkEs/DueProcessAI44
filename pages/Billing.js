import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { createCheckoutSession, createStripePortalSession } from "@/functions/stripe";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Check, Zap, Crown, Shield } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Shield,
    features: [
      '5 AI operations per month',
      'Basic document analysis',
      'Know Your Rights library',
      'Incident reporting'
    ],
    limitations: [
      'Limited AI usage',
      'No premium features'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$29',
    period: 'month',
    icon: Zap,
    popular: true,
    features: [
      '100 AI operations per month',
      'Full document analysis suite',
      'AI case strategist',
      'Legal document generator',
      'Priority support'
    ],
    priceId: 'price_basic_monthly'
  },
  {
    id: 'premium',
    name: 'Premium', 
    price: '$79',
    period: 'month',
    icon: Crown,
    features: [
      'Unlimited AI operations',
      'All platform features',
      'Courtroom simulator',
      'Advanced investigations',
      'Priority support',
      '1-on-1 legal consultations'
    ],
    priceId: 'price_premium_monthly'
  }
];

export default function Billing() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleSubscribe = async (priceId) => {
    setIsLoading(true);
    try {
      const { data } = await createCheckoutSession({ price_id: priceId });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Subscription Error",
        description: "Unable to start subscription process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const { data } = await createStripePortalSession();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      toast({
        title: "Billing Portal Error",
        description: "Unable to access billing portal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Subscription</h1>
          <p className="text-slate-600">Choose the plan that fits your legal defense needs</p>
        </div>

        {/* Current Plan Status */}
        {user && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Current Plan</h3>
                  <p className="text-slate-600 capitalize">
                    {user.subscription_tier} Plan
                    {user.subscription_tier !== 'free' && (
                      <span className="ml-2">
                        • {user.ai_usage_count || 0} AI operations used this month
                      </span>
                    )}
                  </p>
                </div>
                {user.subscription_tier !== 'free' && (
                  <Button onClick={handleManageBilling} disabled={isLoading}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`border-0 shadow-lg relative ${
              plan.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  <plan.icon className="w-12 h-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-slate-900">
                  {plan.price}
                  <span className="text-lg font-normal text-slate-600">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-xs text-slate-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button 
                  className={`w-full ${
                    plan.id === 'free' 
                      ? 'bg-slate-600 hover:bg-slate-700'
                      : plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-slate-800 hover:bg-slate-900'
                  }`}
                  onClick={() => plan.priceId ? handleSubscribe(plan.priceId) : null}
                  disabled={isLoading || plan.id === 'free' || user?.subscription_tier === plan.id}
                >
                  {user?.subscription_tier === plan.id 
                    ? 'Current Plan' 
                    : plan.id === 'free' 
                    ? 'Free Forever' 
                    : `Subscribe to ${plan.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="border-0 shadow-lg bg-white mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">What are AI operations?</h4>
              <p className="text-slate-600 text-sm">AI operations include document analysis, case strategy generation, legal drafting, and other AI-powered features. Each request counts as one operation.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-slate-600 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Is my legal information secure?</h4>
              <p className="text-slate-600 text-sm">Absolutely. We use enterprise-grade encryption and security measures to protect your sensitive legal information. We never share your data with third parties.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}