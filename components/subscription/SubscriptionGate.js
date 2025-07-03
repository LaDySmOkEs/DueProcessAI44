import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Lock, Zap, Crown } from 'lucide-react';

const featureTiers = {
  document_analysis: ['basic', 'premium'],
  case_strategy: ['basic', 'premium'],
  document_generation: ['basic', 'premium'],
  courtroom_simulator: ['premium'],
  // Add other features here
};

export default function SubscriptionGate({ children, feature }) {
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [feature]);

  const checkAccess = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      const requiredTiers = featureTiers[feature] || ['premium']; // Default to premium if feature not defined
      if (requiredTiers.includes(userData.subscription_tier)) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      // User is likely not logged in, treat as free tier
      setUser({ subscription_tier: 'free' });
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const requiredTier = (featureTiers[feature] || ['premium'])[0];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (hasAccess) {
    return children;
  }

  return (
    <Card className="border-2 border-amber-300 bg-amber-50">
      <CardHeader className="text-center">
        <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <CardTitle className="text-amber-900">Upgrade to Access This Feature</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-amber-800">
          This powerful tool is available on our{' '}
          <span className="font-semibold capitalize">{requiredTier}</span> plan.
        </p>
        <p className="text-sm text-amber-700">
          Unlock advanced AI capabilities, including {feature.replace(/_/g, ' ')}, to strengthen your legal strategy.
        </p>
        <Link to={createPageUrl("Billing")}>
          <Button className="bg-amber-600 hover:bg-amber-700">
            {requiredTier === 'basic' ? <Zap className="w-4 h-4 mr-2" /> : <Crown className="w-4 h-4 mr-2" />}
            Upgrade Your Plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}