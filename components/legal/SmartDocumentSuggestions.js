import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Bot, FileSignature, Shield, Gavel } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import { LegalCase } from "@/entities/all";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const suggestionSchema = {
    type: "object",
    properties: {
        suggestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    document_id: { type: "string", description: "Unique ID like 'civil_rights_complaint' or 'motion_compel'" },
                    document_title: { type: "string" },
                    reasoning: { type: "string" },
                    priority: { type: "string", enum: ["High", "Medium", "Low"] }
                }
            }
        }
    },
    required: ["suggestions"]
};

const iconMap = {
    "civil_rights_complaint": Shield,
    "motion_compel": Gavel,
    "motion_to_dismiss": Gavel,
    "discovery_request": Gavel,
    "affidavit": FileSignature,
    "cease_desist": FileSignature,
    "summary_judgment": Gavel,
    "default": FileSignature
};

export default function SmartDocumentSuggestions({ onGenerate }) {
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState('');
    const [caseFacts, setCaseFacts] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadCases();
    }, []);

    useEffect(() => {
        if(selectedCase) {
            const currentCase = cases.find(c => c.id === selectedCase);
            if(currentCase) {
                setCaseFacts(currentCase.description || '');
            }
        }
    }, [selectedCase, cases]);

    const loadCases = async () => {
        try {
            const data = await LegalCase.list();
            setCases(data);
        } catch (error) {
            console.error("Error loading cases:", error);
        }
    };

    const getSuggestions = async () => {
        if (!caseFacts.trim()) {
            toast({ title: "Please provide case facts.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setSuggestions([]);

        const prompt = `
            Based on the following case facts, suggest the most relevant legal documents to generate.
            For each suggestion, provide a unique document_id (e.g., 'motion_compel'), a title, a brief reasoning, and a priority level (High, Medium, Low).

            Case Facts: "${caseFacts}"
        `;

        try {
            const result = await InvokeLLM({ prompt, response_json_schema: suggestionSchema });
            if (result && result.suggestions) {
                // Sort by priority: High > Medium > Low
                const sortedSuggestions = result.suggestions.sort((a, b) => {
                    const priorities = { High: 3, Medium: 2, Low: 1 };
                    return (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
                });
                setSuggestions(sortedSuggestions);
            } else {
                toast({ title: "AI did not return valid suggestions.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Suggestion generation failed:", error);
            toast({ title: "Failed to get suggestions.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-blue-600" />
                    AI Document Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                    <Select value={selectedCase} onValueChange={setSelectedCase}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a case..." />
                        </SelectTrigger>
                        <SelectContent>
                            {cases.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.case_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Textarea
                        placeholder="Or, describe your legal situation here..."
                        value={caseFacts}
                        onChange={(e) => setCaseFacts(e.target.value)}
                        rows={5}
                    />

                    <Button onClick={getSuggestions} disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                        Get AI Suggestions
                    </Button>
                </div>

                {suggestions.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">Recommended Documents:</h3>
                        {suggestions.map((suggestion, index) => {
                            const Icon = iconMap[suggestion.document_id] || iconMap.default;
                            return (
                                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                            <Icon className="w-5 h-5 text-blue-600"/>
                                            {suggestion.document_title}
                                        </h4>
                                        <Badge variant={suggestion.priority === 'High' ? 'destructive' : 'secondary'}>
                                            {suggestion.priority} Priority
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{suggestion.reasoning}</p>
                                    <Button size="sm" onClick={() => onGenerate(suggestion.document_id)}>
                                        <FileSignature className="w-4 h-4 mr-2"/>
                                        Generate this document
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}