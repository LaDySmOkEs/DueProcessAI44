import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvokeLLM } from "@/integrations/Core";
import { Users, Search, Loader2, Phone, MapPin, User, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const witnessSearchSchema = {
    type: "object",
    properties: {
        search_results: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    full_name: { type: "string" },
                    age_range: { type: "string" },
                    current_address: { type: "string" },
                    previous_addresses: { type: "array", items: { type: "string" } },
                    phone_numbers: { type: "array", items: { type: "string" } },
                    email_addresses: { type: "array", items: { type: "string" } },
                    employment: { type: "string" },
                    relatives: { type: "array", items: { type: "string" } },
                    social_media_profiles: { type: "array", items: { type: "string" } },
                    confidence_score: { type: "integer", minimum: 0, maximum: 100 }
                }
            }
        },
        alternative_spellings: {
            type: "array",
            items: { type: "string" },
            description: "Possible alternative spellings or variations of the name"
        },
        search_suggestions: {
            type: "array",
            items: { type: "string" },
            description: "Additional search strategies or information that might help locate the person"
        }
    },
    required: ["search_results"]
};

export default function WitnessLocator() {
    const [searchQuery, setSearchQuery] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [results, setResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const { toast } = useToast();

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast({
                title: "Name Required",
                description: "Please enter a name to search for.",
                variant: "destructive"
            });
            return;
        }

        setIsSearching(true);
        setResults(null);

        try {
            const prompt = `Locate current contact information and background details for: "${searchQuery}"

A
