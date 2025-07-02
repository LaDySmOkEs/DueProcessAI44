import React, { useState, useEffect } from "react";
import { PoliceInteraction, KnowYourRightsModule } from "@/entities/all";
import { Shield, BookOpen, FileText, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsCard from "../components/dashboard/StatsCard";
import RecentIncidents from "../components/dashboard/RecentIncidents";
import RightsProgress from "../components/dashboard/RightsProgress";
import QuickActions from "../components/dashboard/QuickActions";
import CorePillars from "../components/dashboard/CorePillars";

export default function Dashboard() {
  const [interactions, setInteractions] = useState([]);
  const [rightsModules, setRightsModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [interactionsData, modulesData] = await Promise.all([
        PoliceInteraction.list("-created_date", 10),
        KnowYourRightsModule.list("priority_level", 5)
      ]);
      setInteractions(interactionsData);
      setRightsModules(modulesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatsData = () => {
    const totalInteractions = interactions.length;
    const seriousIncidents = interactions.filter(i => 
      i.severity_level === 'serious' || i.severity_level === 'severe'
    ).length;
    const complaintsNeeded = interactions.filter(i => 
      i.follow_up_needed && !i.complaint_filed
    ).length;
    const recentInteractions = interactions.filter(i => {
      const interactionDate = new Date(i.created_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return interactionDate >= thirtyDaysAgo;
    }).length;

    return {
      totalInteractions,
      seriousIncidents, 
      complaintsNeeded,
      recentInteractions
    };
  };

  const stats = getStatsData();

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Emphasizing Due Process */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/82b755008_image.png" 
                alt="Due Process AI"
                className="w-8 h-8 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Main Dashboard</h1>
              <p className="text-slate-600 mt-1">Your overview of case stats, recent activity, and rights education</p>
            </div>
          </div>
          
          {/* Due Process Mission Statement */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-amber-900 mb-2">Your Constitutional Guarantee</h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              The 14th Amendment guarantees that no state shall "deprive any person of life, liberty, or property, without due process of law." 
              This platform helps you identify when proper procedures aren't followed and provides tools to defend your constitutional rights.
            </p>
          </div>
        </div>
        
        {/* Core Pillars Section */}
        <CorePillars />

        {/* Quick Actions - Reframed around Due Process */}
        <QuickActions />

        {/* Stats Grid - Due Process Focused */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Due Process Audits"
            value={stats.totalInteractions}
            icon={FileText}
            bgColor="bg-blue-500"
            description="Procedural reviews conducted"
          />
          <StatsCard
            title="Violations Detected"
            value={stats.seriousIncidents}
            icon={AlertTriangle}
            bgColor="bg-red-500"
            description="Potential procedural failures"
          />
          <StatsCard
            title="Actions Required"
            value={stats.complaintsNeeded}
            icon={TrendingUp}
            bgColor="bg-orange-500"
            description="Follow-up proceedings needed"
          />
          <StatsCard
            title="Recent Reviews"
            value={stats.recentInteractions}
            icon={Users}
            bgColor="bg-green-500"
            description="Last 30 days"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentIncidents 
              interactions={interactions}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-8">
            <RightsProgress 
              modules={rightsModules}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}