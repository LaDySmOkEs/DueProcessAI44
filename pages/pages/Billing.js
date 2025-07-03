import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Crown, Zap, CreditCard, AlertCircle } from 'lucide-react';
import { User } from "@/entities/User";
import { createCheckoutSession } from "@/functions/createCheckoutSession";
import { createStripePortalSession } from "@/functions/createStripePortalSession";
import { useToast } from "@/components/ui/use-toast";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Try all features risk-free",
    features: [
      "5 AI document analyses",
      "2 legal document generations", 
      "Basic case management",
      "Constitutional rights education",
      "Community violation registry access"
    ],
    priceId: null,
    buttonText: "Current Plan",
    popular: false
  },
  {
    name: "Basic Plan",
    price: "$29",
    period: "month",
    description: "Essential tools for individual cases",
    features: [
      "25 AI document analyses per month",
      "10 legal document generations",
      "Complete case management suite",
      "AI case strategist access",
      "Courtroom simulator",
      "Digital investigation tools",
      "Priority email support"
    ],
    priceId: "price_basic_monthly",
    buttonText: "Upgrade to Basic",
    popular: true
  },
  {
    name: "Premium Plan", 
    price: "$79",
    period: "month",
    description: "Professional-grade legal defense",
    features: [
      "Unlimited AI document analyses",
      "Unlimited document generations",
      "Advanced pattern detection",
      "Class action investigation tools",
      "Anti-corruption center access",
      "Expedited legal review",
      "Phone support",
      "Custom legal templates"
    ],
    priceId: "price_premium_monthly",
    buttonText: "Upgrade to Premium",
    popular: false
  }
];

export default function Billing() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (priceId) => {
    if (!priceId) return;
    
    setProcessingPlan(priceId);
    try {
      const { data } = await createCheckoutSession({ priceId });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "Unable to start checkout process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { data } = await createStripePortalSession();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast({
        title: "Portal Access Failed", 
        description: "Unable to access billing portal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCurrentPlanName = () => {
    if (!user) return "Loading...";
    if (user.subscription_tier === "trial") return "Free Trial";
    if (user.subscription_tier === "basic") return "Basic Plan";
    if (user.subscription_tier === "premium") return "Premium Plan";
    return "Free Trial";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-96 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Billing & Subscription</h1>
          <p className="text-slate-600">Choose the right plan to defend your constitutional rights</p>
          
          {user && (
            <div className="mt-6 flex justify-center">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md">
                <p className="text-amber-900 font-medium">Current Plan: {getCurrentPlanName()}</p>
                {user.subscription_tier !== "free" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleManageBilling}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Usage Alert */}
        {user && user.ai_usage_count > 20 && (
          <Alert className="mb-8 bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You've used {user.ai_usage_count} AI operations this month. Consider upgrading for unlimited access.
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border-0 shadow-lg relative ${
                plan.popular ? 'ring-2 ring-amber-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-600">/{plan.period}</span>
                </div>
                <p className="text-slate-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-slate-600 hover:bg-slate-700'
                  }`}
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={
                    processingPlan === plan.priceId || 
                    (user?.subscription_tier === "trial" && !plan.priceId) ||
                    (user?.subscription_tier === "basic" && plan.priceId === "price_basic_monthly") ||
                    (user?.subscription_tier === "premium" && plan.priceId === "price_premium_monthly")
                  }
                >
                  {processingPlan === plan.priceId ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-slate-600 text-sm">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Is my data secure?</h3>
                <p className="text-slate-600 text-sm">Absolutely. All data is encrypted and stored securely. We never share your legal information with third parties.</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-600 text-sm">We accept all major credit cards and debit cards through our secure Stripe payment processor.</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Do you offer refunds?</h3>
                <p className="text-slate-600 text-sm">We offer a 30-day money-back guarantee for all paid plans. Contact support for refund requests.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}