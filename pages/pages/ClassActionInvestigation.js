import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassActionPotential, DueProcessViolation } from "@/entities/all";
import { Users, AlertTriangle, MapPin, Scale, Plus } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function ClassActionInvestigation() {
  const [searchParams] = useSearchParams();
  const potentialId = searchParams.get('id');

  const [potential, setPotential] = useState(null);
  const [relatedViolations, setRelatedViolations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (potentialId) {
      loadData();
    }
  }, [potentialId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [potentialData] = await ClassActionPotential.filter({ id: potentialId });
      setPotential(potentialData);

      if (potentialData && potentialData.linked_violation_ids) {
        // In a real app, you might fetch these in batches
        const violationPromises = potentialData.linked_violation_ids.map(id => DueProcessViolation.filter({ id }));
        const violationsNested = await Promise.all(violationPromises);
        const violationsFlat = violationsNested.flat();
        setRelatedViolations(violationsFlat);
      }
    } catch (error) {
      console.error("Error loading investigation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading investigation details...</div>;
  }
  
  if (!potential) {
    return <div className="p-6">Investigation not found.</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{potential.title}</h1>
              <p className="text-slate-600 mt-1">Class Action Investigation Details</p>
            </div>
          </div>
        </div>

        {/* Investigation Overview */}
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle>Investigation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">{potential.summary}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div><p className="font-semibold">Status</p><Badge variant="destructive">{potential.status}</Badge></div>
              <div><p className="font-semibold">Target Agency</p><p>{potential.target_agency}</p></div>
              <div><p className="font-semibold">Violation</p><p>{potential.common_violation.replace('_', ' ')}</p></div>
              <div><p className="font-semibold">Affected Individuals</p><p>{potential.estimated_class_size}</p></div>
            </div>
          </CardContent>
        </Card>

        {/* Related Violations */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Linked Violation Reports ({relatedViolations.length})</CardTitle>
              <Link to={createPageUrl("SubmitViolation")}>
                <Button variant="outline"><Plus className="w-4 h-4 mr-2"/>Add Your Report</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedViolations.map(v => (
              <div key={v.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-900 capitalize">{v.violation_type.replace('_', ' ')}</h3>
                  <span className="text-xs text-slate-500">{format(new Date(v.incident_date), "MMM d, yyyy")}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{v.incident_description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{v.location_city}, {v.location_state}</div>
                  <div className="flex items-center gap-1"><Scale className="w-3 h-3"/>Agency: {v.agency_involved}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}