
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/integrations/Core";
import { Shield, Search, Loader2, AlertTriangle, ExternalLink, Building } from "lucide-react";

const officerSearchSchema = {
    type: "object",
    properties: {
        officer_found: {
            type: "boolean",
            description: "Whether any information was found about this officer"
        },
        summary: {
            type: "string", 
            description: "A brief summary of findings about this officer"
        },
        news_reports: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    source: { type: "string" },
                    date: { type: "string" },
                    summary: { type: "string" }
                }
            },
            description: "News reports mentioning this officer"
        },
        court_cases: {
            type: "array",
            items: {
                type: "object", 
                properties: {
                    case_name: { type: "string" },
                    court: { type: "string" },
                    date: { type: "string" },
                    outcome: { type: "string" }
                }
            },
            description: "Court cases involving this officer"
        },
        disciplinary_actions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    date: { type: "string" },
                    action: { type: "string" },
                    reason: { type: "string" }
                }
            },
            description: "Known disciplinary actions"
        },
        risk_level: {
            type: "string",
            enum: ["low", "medium", "high", "unknown"],
            description: "Assessment of risk level based on available information"
        }
    },
    required: ["officer_found", "summary", "risk_level"]
}
