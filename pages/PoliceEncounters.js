import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PoliceEncounter } from "@/entities/all";
import { AlertTriangle, MapPin, Clock, Plus } from 'lucide-react';
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PoliceEncounters() {
  const [encounters, setEncounters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEncounters();
  }, []);

  const loadEncounters = async () => {
    setIsLoading(true);
    try {
      const data = await PoliceEncounter.list("-date_time");
      setEncounters(data);
    } catch (error) {
      console.error("Error loading encounters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const encounterTypeLabels = {
      traffic_stop: "Traffic Stop",
      pedestrian_stop: "Pedestrian Stop",
      home_visit: "Home Visit",
      arrest: "Arrest",
      questioning: "Questioning",
      search: "Search",
      other: "Other"
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Police Encounters Log</h1>
            <p className="text-slate-600">A detailed record of all documented interactions.</p>
          </div>
          <Link to={createPageUrl("ReportIncident")}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Log New Encounter
            </Button>
          </Link>
        </div>

        {/* Encounters List */}
        <div className="space-y-6">
          {isLoading ? (
            <p>Loading encounters...</p>
          ) : encounters.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold">No encounters logged yet.</h3>
                <p className="text-slate-600">Start by documenting your first police interaction.</p>
              </CardContent>
            </Card>
          ) : (
            encounters.map((encounter) => (
              <Card key={encounter.id} className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{encounterTypeLabels[encounter.encounter_type] || 'Encounter'}</CardTitle>
                    <Badge variant={encounter.constitutional_violations?.length > 0 ? "destructive" : "secondary"}>
                      {encounter.constitutional_violations?.length > 0 ? "Violations Identified" : "No Violations Flagged"}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500 flex gap-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {format(new Date(encounter.date_time), "MMM d, yyyy 'at' p")}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {encounter.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Department:</strong> {encounter.department || 'N/A'}</p>
                    <p><strong>Outcome:</strong> {encounter.outcome?.replace('_', ' ') || 'N/A'}</p>
                    {encounter.constitutional_violations?.length > 0 && (
                        <div>
                            <strong>Potential Violations:</strong>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {encounter.constitutional_violations.map((v, i) => <Badge key={i} variant="outline" className="text-red-700 border-red-200">{v.replace('_', ' ')}</Badge>)}
                            </div>
                        </div>
                    )}
                  </div>
                  <Button variant="outline" className="mt-4">View Details</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}