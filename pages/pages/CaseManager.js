import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LegalCase } from "@/entities/all";
import { Plus, FolderOpen, Scale, Calendar } from 'lucide-react';
import { format } from "date-fns";

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800", 
  closed: "bg-slate-100 text-slate-800",
  archived: "bg-slate-100 text-slate-600"
};

export default function CaseManager() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const data = await LegalCase.list("-created_date");
      setCases(data);
    } catch (error) {
      console.error("Error loading cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-800 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Case Manager</h1>
              <p className="text-slate-600">Your central hub for all legal cases</p>
            </div>
          </div>
          <Link to={createPageUrl("CreateCase")}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Case
            </Button>
          </Link>
        </div>

        {/* Cases Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cases.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Scale className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Cases Found</h3>
              <p className="text-slate-600 mb-4">Start by creating your first legal case file.</p>
              <Link to={createPageUrl("CreateCase")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Case
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((legalCase) => (
              <Card key={legalCase.id} className="border-0 shadow-lg bg-white flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg pr-2">{legalCase.case_name}</CardTitle>
                    <Badge className={statusColors[legalCase.status]}>
                      {legalCase.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 capitalize">{legalCase.case_type.replace('_', ' ')}</p>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {legalCase.description || 'No description provided.'}
                  </p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3"/>
                      <span>Next Deadline: {legalCase.next_deadline ? format(new Date(legalCase.next_deadline), 'MMM d, yyyy') : 'N/A'}</span>
                    </div>
                     <p>Case No: {legalCase.case_number || 'N/A'}</p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Link to={createPageUrl(`CaseDetails?id=${legalCase.id}`)}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}