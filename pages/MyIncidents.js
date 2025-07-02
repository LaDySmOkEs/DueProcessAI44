import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoliceInteraction } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertTriangle, Calendar, MapPin, Plus, Search, Filter } from "lucide-react";
import { format } from "date-fns";

const severityColors = {
    minor: "bg-green-100 text-green-800 border-green-200",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    serious: "bg-orange-100 text-orange-800 border-orange-200",
    severe: "bg-red-100 text-red-800 border-red-200"
};

const encounterTypeLabels = {
    traffic_stop: "Traffic Stop",
    pedestrian_stop: "Pedestrian Stop",
    home_visit: "Home Visit",
    arrest: "Arrest",
    questioning: "Questioning",
    other: "Other"
};

export default function MyIncidents() {
    const [interactions, setInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [severityFilter, setSeverityFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        loadInteractions();
    }, []);

    const loadInteractions = async () => {
        try {
            const data = await PoliceInteraction.list("-date");
            setInteractions(data);
        } catch (error) {
            console.error("Error loading interactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredInteractions = interactions.filter(interaction => {
        const matchesSearch = interaction.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             interaction.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (interaction.agency && interaction.agency.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesSeverity = severityFilter === "all" || interaction.severity_level === severityFilter;
        const matchesType = typeFilter === "all" || interaction.encounter_type === typeFilter;
        
        return matchesSearch && matchesSeverity && matchesType;
    });

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">My Incidents</h1>
                                <p className="text-slate-600 mt-1">Your documented police interactions and due process audits</p>
                            </div>
                        </div>
                        <Link to={createPageUrl("ReportIncident")}>
                            <Button className="bg-amber-600 hover:bg-amber-700 gap-2">
                                <Plus className="w-4 h-4" />
                                Report New Incident
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm bg-white mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-slate-500" />
                                <Input
                                    placeholder="Search incidents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-500" />
                                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Severity</SelectItem>
                                        <SelectItem value="minor">Minor</SelectItem>
                                        <SelectItem value="moderate">Moderate</SelectItem>
                                        <SelectItem value="serious">Serious</SelectItem>
                                        <SelectItem value="severe">Severe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="traffic_stop">Traffic Stop</SelectItem>
                                        <SelectItem value="pedestrian_stop">Pedestrian Stop</SelectItem>
                                        <SelectItem value="home_visit">Home Visit</SelectItem>
                                        <SelectItem value="arrest">Arrest</SelectItem>
                                        <SelectItem value="questioning">Questioning</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Incidents List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array(3).fill(0).map((_, i) => (
                            <Card key={i} className="border-0 shadow-sm bg-white">
                                <CardContent className="p-6">
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredInteractions.length === 0 ? (
                    <Card className="border-0 shadow-sm bg-white">
                        <CardContent className="p-12 text-center">
                            <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                {searchTerm || severityFilter !== "all" || typeFilter !== "all" 
                                    ? "No Matching Incidents" 
                                    : "No Incidents Recorded"
                                }
                            </h3>
                            <p className="text-slate-600 mb-6">
                                {searchTerm || severityFilter !== "all" || typeFilter !== "all"
                                    ? "Try adjusting your search criteria."
                                    : "Start documenting police interactions to build your record."
                                }
                            </p>
                            <Link to={createPageUrl("ReportIncident")}>
                                <Button className="bg-amber-600 hover:bg-amber-700">
                                    Report Your First Incident
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredInteractions.map((interaction) => (
                            <Card key={interaction.id} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-slate-900 text-lg">
                                                {encounterTypeLabels[interaction.encounter_type] || interaction.encounter_type}
                                            </h3>
                                            {interaction.follow_up_needed && (
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        <Badge className={`${severityColors[interaction.severity_level]} border font-medium`}>
                                            {interaction.severity_level}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{format(new Date(interaction.date), "MMM d, yyyy")}</span>
                                                {interaction.time && <span>at {interaction.time}</span>}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{interaction.location}</span>
                                            </div>
                                            {interaction.agency && (
                                                <span className="text-slate-500">• {interaction.agency}</span>
                                            )}
                                        </div>

                                        <p className="text-slate-700 line-clamp-2">
                                            {interaction.summary}
                                        </p>

                                        {interaction.rights_violations && interaction.rights_violations.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {interaction.rights_violations.map((violation, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                                        {violation.replace(/_/g, ' ')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {interaction.officer_name && (
                                            <div className="text-sm text-slate-600">
                                                <span className="font-medium">Officer:</span> {interaction.officer_name}
                                                {interaction.badge_number && <span> (Badge #{interaction.badge_number})</span>}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}