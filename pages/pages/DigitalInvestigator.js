import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Users, Map, Globe, Camera, FileText, LocateFixed } from 'lucide-react';
import SubscriptionGate from '../components/subscription/SubscriptionGate';

const investigationTools = [
  {
    title: "Public Records Search",
    description: "Search court dockets, property records, and other public databases.",
    icon: FileText,
    url: createPageUrl("PublicRecordsSearch"),
    feature: "public_records_search"
  },
  {
    title: "Witness Locator",
    description: "Identify and find contact information for potential witnesses.",
    icon: Users,
    url: createPageUrl("WitnessLocator"),
    feature: "witness_locator"
  },
  {
    title: "Location Intelligence",
    description: "Analyze locations for historical incidents, camera coverage, and more.",
    icon: Map,
    url: createPageUrl("LocationIntelligence"),
    feature: "location_intelligence"
  },
  {
    title: "Social Media Investigation",
    description: "Archive social media profiles and search for relevant public posts.",
    icon: Globe,
    url: createPageUrl("SocialMediaInvestigation"),
    feature: "social_media_investigation"
  },
  {
    title: "Photo & Video Analysis",
    description: "Extract metadata, enhance quality, and analyze visual evidence.",
    icon: Camera,
    url: createPageUrl("PhotoAnalysis"),
    feature: "media_analysis"
  },
    {
    title: "FOIA Request Builder",
    description: "Draft and track Freedom of Information Act requests to government agencies.",
    icon: LocateFixed,
    url: createPageUrl("PublicRecordsRequest"),
    feature: "foia_builder"
  }
];

export default function DigitalInvestigator() {
  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Digital Investigator Toolkit</h1>
              <p className="text-slate-600 mt-1">Uncover the facts with advanced open-source intelligence tools.</p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investigationTools.map((tool) => (
            <SubscriptionGate key={tool.title} feature={tool.feature} fallback={
              <Card className="border-0 shadow-lg bg-slate-50 opacity-70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-600">
                    <tool.icon className="w-6 h-6" /> {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 mb-4">{tool.description}</p>
                  <Button disabled className="w-full">Upgrade to Access</Button>
                </CardContent>
              </Card>
            }>
              <Card className="border-0 shadow-lg bg-white flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <tool.icon className="w-6 h-6 text-blue-600" /> {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-slate-600 mb-4">{tool.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Link to={tool.url}>
                    <Button variant="outline" className="w-full">Launch Tool</Button>
                  </Link>
                </div>
              </Card>
            </SubscriptionGate>
          ))}
        </div>
      </div>
    </div>
  );
}