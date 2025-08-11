
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InvokeLLM } from "@/integrations/Core";
import { Globe, Search, Loader2, Link as LinkIcon, User, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const socialSchema = {
    type: "object",
    properties: {
        search_summary: {
            type: "string",
            description: "A summary of the overall findings and assessment of the subject's online presence."
        },
        profiles_found: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    platform: { type: "string" },
                    url: { type: "string" },
                    username: { type: "string" },
                    bio: { type: "string" },
                    confidence: { type: "string", enum: ["High", "Medium", "Low"] }
                }
            }
        },
        key_posts: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    platform: { type: "string" },
                    post_content: { type: "string" },
                    post_date: { type: "string" },
                    relevance: { type: "string" },
                    url: { type: "string" }
                }
            }
        },
        connections_analysis: {
            type: "string",
            description: "An analysis of the subject's key connections, associations, or groups based on public information."
        },
        sentiment_analysis: {
            type: "string",
            description: "General sentiment of public posts (e.g., negative, positive, professional)."
        }
    },
    required: ["search_summary"]
};

export default function SocialMediaInvestigation() {
    const [searchQuery, setSearchQuery] = useState("John Q. Public");
    const [additionalInfo, setAdditionalInfo] = useState("Known to live in Metropolis, works at Public Corp. May use username 'JohnnyPublic123'.");
    const [results, setResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const { toast } = useToast();

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast({ title: "Name Required", description: "Please enter a name to investigate.", variant: "destructive" });
 
