import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PoliceEncounter } from "@/entities/all";
import { Eye, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

export default function PoliceEncounters() {
    const [encounters, setEncounters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEncounters = async () => {
            try {
                const data = await PoliceEncounter.list("-date_time");
                setEncounters(data);
            } catch (error) {
                console.error("Failed to load encounters:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadEncounters();
    }, []);

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                            <Eye className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Police Encounters</h1>
                            <p className="text-slate-600 mt-1">A community log of police interactions for transparency.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? <p>Loading encounters...</p> : encounters.length === 0 ? <p>No encounters have been logged yet.</p> :
                        encounters.map(encounter => (
                            <Card key={encounter.id} className="border-0 shadow-lg bg-white">
                                <CardHeader>
                                    <CardTitle className="capitalize">{encounter.encounter_type.replace(/_/g, ' ')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-slate-700">Encounter with {encounter.department || 'unspecified department'}.</p>
                                    {encounter.constitutional_violations && encounter.constitutional_violations.length > 0 &&
                                        <div className="flex flex-wrap gap-1">
                                            {encounter.constitutional_violations.map((v, i) => <Badge key={i} variant="destructive">{v.replace(/_/g, ' ')}</Badge>)}
                                        </div>
                                    }
                                    <div className="text-xs text-slate-600 space-y-1">
                                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{encounter.location}</span></div>
                                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{format(new Date(encounter.date_time), "MMM d, yyyy 'at' p")}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
