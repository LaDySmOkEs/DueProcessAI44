import React, { useState, useEffect } from "react";
import { KnowYourRightsModule } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Shield, AlertTriangle, CheckCircle, Star } from "lucide-react";
import ReactMarkdown from 'react-markdown';

import RightsModuleCard from "../components/rights/RightsModuleCard";
import ScenarioTrainer from "../components/rights/ScenarioTrainer";

export default function KnowYourRights() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const data = await KnowYourRightsModule.list("priority_level");
      setModules(data);
    } catch (error) {
      console.error("Error loading modules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "All Rights", icon: Shield },
    { id: "traffic_stops", label: "Traffic Stops", icon: AlertTriangle },
    { id: "home_searches", label: "Home Searches", icon: Shield },
    { id: "arrests", label: "Arrests", icon: AlertTriangle },
    { id: "questioning", label: "Questioning", icon: BookOpen },
    { id: "protests", label: "Protests", icon: Shield },
    { id: "general_rights", label: "General Rights", icon: BookOpen }
  ];

  const filteredModules = activeCategory === "all" 
    ? modules 
    : modules.filter(module => module.category === activeCategory);

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Know Your Rights</h1>
              <p className="text-slate-600 mt-1">Learn your constitutional protections and how to exercise them</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="learn" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 bg-white border border-slate-200">
            <TabsTrigger value="learn" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Learn Rights
            </TabsTrigger>
            <TabsTrigger value="practice" className="gap-2">
              <Shield className="w-4 h-4" />
              Practice Scenarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="space-y-6">
            {/* Category Filter */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category.id)}
                      className={`gap-2 ${
                        activeCategory === category.id 
                          ? "bg-slate-900 hover:bg-slate-800" 
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid gap-6">
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <Card key={i} className="border-0 shadow-sm">
                        <CardContent className="p-6">
                          <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-slate-200 rounded"></div>
                              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : filteredModules.length === 0 ? (
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-12 text-center">
                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No modules found</h3>
                        <p className="text-slate-600">Try selecting a different category</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredModules.map((module) => (
                      <RightsModuleCard
                        key={module.id}
                        module={module}
                        onClick={() => setSelectedModule(module)}
 
