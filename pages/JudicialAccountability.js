import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/integrations/Core";
import { Gavel, Search, Loader2, AlertTriangle, ExternalLink, Scale, FileText, Eye } from "lucide-react";

const judicialSearchSchema = {
    type: "object",
    properties: {
        judge_found: {
            type: "boolean",
            description: "Whether any disciplinary or accountability information was found for this judge"
        },
        summary: {
            type: "string",
            description: "Overall summary of the judge's disciplinary record and accountability issues"
        },
        disciplinary_actions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    date: { type: "string", description: "Date of disciplinary action" },
                    issuing_body: { type: "string", description: "Which judicial conduct board or authority issued the discipline" },
                    violation_type: { type: "string", description: "Type of misconduct (bias, financial conflicts, inappropriate conduct, etc.)" },
                    penalty: { type: "string", description: "Penalty imposed (censure, suspension, fine, etc.)" },
                    details: { type: "string", description: "Detailed description of the misconduct" },
                    case_impact: { type: "string", description: "Whether this affected specific cases or rulings" }
                }
            },
            description: "Official disciplinary actions taken against the judge"
        },
        ethics_violations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    violation_category: { type: "string", description: "Category of ethics violation" },
                    description: { type: "string", description: "Description of the ethics violation" },
                    resolution: { type: "string", description: "How the violation was resolved" },
                    ongoing_impact: { type: "string", description: "Whether this impacts current cases" }
                }
            },
            description: "Ethics violations and conflicts of interest"
        },
        controversial_rulings: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    case_name: { type: "string", description: "Name or identifier of the case" },
                    date: { type: "string", description: "Date of the ruling" },
                    controversy: { type: "string", description: "What made this ruling controversial" },
                    appeals_outcome: { type: "string", description: "Whether the ruling was overturned on appeal" },
                    legal_criticism: { type: "string", description: "Legal community criticism of the ruling" }
                }
            },
            description: "Controversial rulings that may indicate bias or poor judgment"
        },
        financial_disclosures: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    disclosure_year: { type: "string" },
                    potential_conflicts: { type: "string", description: "Potential conflicts of interest from financial holdings" },
                    recusal_patterns: { type: "string", description: "Pattern of recusals or failure to recuse" }
                }
            },
            description: "Financial disclosure issues and potential conflicts"
        },
        bias_indicators: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    bias_type: { type: "string", description: "Type of potential bias (racial, political, economic, etc.)" },
                    evidence: { type: "string", description: "Evidence or allegations of bias" },
                    impact_on_cases: { type: "string", description: "How this bias may affect case outcomes" }
                }
            },
            description: "Indicators of judicial bias that could affect fair proceedings"
        },
        accountability_score: {
            type: "string",
            enum: ["Excellent", "Good", "Concerning", "Poor", "Severely Compromised"],
            description: "Overall assessment of judicial accountability and fitness"
        }
    },
    required: ["judge_found", "summary", "accountability_score"]
};

export default function JudicialAccountability() {
    const [searchData, setSearchData] = useState({
        judge_name: "",
        court_name: "",
        jurisdiction: ""
    });
    const [results, setResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchData.judge_name && !searchData.court_name) {
            setError("Please provide either a judge's name or court name to search.");
            return;
        }
        
        setIsSearching(true);
        setError(null);
        setResults(null);

        try {
            const prompt = `Conduct a comprehensive judicial accountability investigation for: 
            Judge Name: "${searchData.judge_name}"
            Court: "${searchData.court_name}" 
            Jurisdiction: "${searchData.jurisdiction}"

            Search all available public records for:

            1. DISCIPLINARY ACTIONS:
            - Official reprimands, censures, suspensions
            - Judicial conduct commission findings
            - Bar disciplinary actions
            - Ethics violations and sanctions

            2. CONTROVERSIAL RULINGS:
            - Rulings overturned for bias or error
            - Patterns of unusual sentencing
            - Civil rights violations in rulings
 
