import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, Search, TrendingUp, Users, Eye, Target } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AntiCorruptionCenter() {
  const [isLoading, setIsLoading] = useState(false);

  const tools = [
    {
      title: "Pattern Detection Engine",
      description: "AI-powered analysis to identify systemic corruption patterns across departments",
      icon: TrendingUp,
      status: "active"
    },
    {
      title: "Whistleblower Protection Suite",
      description: "Secure reporting mechanisms with legal protection resources",
      icon: Eye,
      status: "active"
    },
    {
      title: "Financial Irregularity Tracker",
      description: "Monitor suspicious financial activities and budget allocations",
      icon: Target,
      status: "active"
    },
    {
      title: "Public Records Correlation",
      description: "Cross-reference multiple data sources to uncover hidden connections",
      icon: Search,
      status: "active"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Anti-Corruption Center</h1>
              <p className="text-slate-600 mt-1">Systematic documentation and investigation of corruption patterns</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="font-semibold text-red-900 mb-2">Fighting Systemic Corruption</h2>
            <p className="text-red-800 text-sm leading-relaxed">
              Corruption thrives in darkness. Our platform uses advanced AI to identify patterns, protect whistleblowers, and provide the tools needed to expose systemic misconduct.
            </p>
          </div>
        </div>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="tools">Investigation Tools</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
            <TabsTrigger value="reports">Submit Report</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <tool.icon className="w-6 h-6 text-red-600" />
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{tool.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <Button variant="outline">Launch Tool</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Corruption Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Pattern Detection Coming Soon</h3>
                  <p className="text-slate-600">AI-powered pattern detection will analyze submitted reports to identify systemic corruption.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Secure Corruption Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Reporting Portal</h3>
                  <p className="text-slate-600 mb-4">Protected whistleblower reporting system coming soon.</p>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Request Early Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}