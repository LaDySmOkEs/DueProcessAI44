import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, Eye, FileText, Users, TrendingUp } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import EmergencyTools from "../components/anti-despotism/EmergencyTools";
import ThreatLevelIndicator from "../components/anti-despotism/ThreatLevelIndicator";
import EncounterQuickStats from "../components/anti-despotism/EncounterQuickStats";
import FOIATracker from "../components/anti-despotism/FOIATracker";

export default function AntiDespotismDashboard() {
  const [threatLevel, setThreatLevel] = useState("moderate");
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setRecentAlerts([
        {
          id: 1,
          type: "pattern_detected",
          message: "Unusual arrest pattern detected in downtown area",
          severity: "high",
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: "rights_violation",
          message: "Multiple Fourth Amendment violations reported",
          severity: "critical",
          timestamp: new Date().toISOString()
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Anti-Despotism Dashboard</h1>
              <p className="text-slate-600 mt-1">Real-time monitoring of authoritarian threats and civil liberties</p>
            </div>
          </div>
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Constitutional Vigilance</AlertTitle>
            <AlertDescription className="text-amber-800">
              "The price of freedom is eternal vigilance." This dashboard monitors threats to democratic institutions and individual liberties.
            </AlertDescription>
          </Alert>
        </div>

        {/* Threat Level and Emergency Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ThreatLevelIndicator level={threatLevel} />
          </div>
          <div>
            <EmergencyTools />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <EncounterQuickStats />
            
            {/* Recent Alerts */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-red-900">{alert.message}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            alert.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-xs text-red-600">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <FOIATracker />
            
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Rapid Response Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl("ReportIncident")}>
                  <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Constitutional Violation
                  </Button>
                </Link>
                <Link to={createPageUrl("PublicRecordsRequest")}>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Emergency FOIA Request
                  </Button>
                </Link>
                <Link to={createPageUrl("ClassActionRegistry")}>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Join Class Action
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}