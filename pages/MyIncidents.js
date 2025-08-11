
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
 
