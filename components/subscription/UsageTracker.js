import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

const planLimits = {
  free: 5,
  trial: 25,
  basic: 100,
  premium: Infinity
};

export default function UsageTracker() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      // Not logged in, or error fetching user.
      setUser(null); // Explicitly set to null to hide tracker
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !user) {
    // Show a loading state or nothing
    return <div className="h-16"></div>;
  }
  
  const limit = planLimits[user.subscription_tier] || 0;
  const usage = user.ai_usage_count || 0;
  const percentage = limit === Infinity ? 100 : (usage / limit) * 100;

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-slate-800">AI Usage</span>
        </div>
        <span className="text-xs font-semibold text-slate-600">
          {usage} / {limit === Infinity ? 'Unlimited' : limit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-slate-500 mt-2">
        Usage resets monthly.
      </p>
    </div>
  );
}