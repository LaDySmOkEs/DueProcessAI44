import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfidenceGauge({ confidence }) {
  const getConfidenceColor = (value) => {
    if (value >= 75) return 'bg-green-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const color = getConfidenceColor(confidence);

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>AI Case Confidence Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-48 h-24 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${(confidence / 100) * 125.6} 125.6`}
              className={`transition-all duration-1000 ease-out ${color.replace('bg-', 'text-')}`}
            />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <span className="text-3xl font-bold">{confidence}%</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          AI-estimated likelihood of a favorable outcome based on provided facts.
        </p>
      </CardContent>
    </Card>
  );
}