import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Loader2, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import { LegalCase, LitigationStrategy } from "@/entities/all";
import { useToast } from "@/components/ui/use-toast";
import ConfidenceGauge from './ConfidenceGauge';
import ReactMarkdown from 'react-markdown';

const strategySchema = {
    type: "object",
    properties: {
        strengths: { type: "array", items: { type: "object", properties: { point: { type: "string" }, strategy: { type: "string" } } } },
        risks: { type: "array", items: { type: "object", properties: { risk: { type: "string" }, mitigation: { type: "string" } } } },
        strategy: { type: "string" },
        next_steps: { type: "array", items: { type: "string" } },
        confidence: { type: "integer", minimum: 0, maximum: 100 }
    },
    required: ["strengths", "risks", "strategy", "next_steps", "confidence"]
};

export default function AICaseStrategist() {
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState('');
    const [caseDescription, setCaseDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [strategy, setStrategy] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        loadCases();
    }, []);

    useEffect(() => {
        if(selectedCase) {
            const currentCase = cases.find(c => c.id === selectedCase);
            if (currentCase) {
                setCaseDescription(currentCase.description || '');
            }
        }
    }, [selectedCase, cases]);

    const loadCases = async () => {
        try {
            const casesData = await LegalCase.list();
            setCases(casesData);
        } catch (error) {
            console.error("Failed to load cases", error);
        }
    };

    const generateCaseStrategy = async () => {
        if (!selectedCase || !caseDescription.trim()) {
            toast({
                title: "Missing Information",
                description: "Please select a case and provide a case description.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        setStrategy(null);

        try {
            const prompt = `
                As an expert litigation strategist, analyze this case:
                "${caseDescription}"
                
                Provide a structured legal strategy including:
                1. Key strengths and how to leverage them.
                2. Major risks and how to mitigate them.
                3. A clear, overarching legal strategy.
                4. Actionable next steps.
                5. An estimated confidence level (0-100) for a favorable outcome.
            `;
            
            const result = await InvokeLLM({ prompt, response_json_schema: strategySchema });

            setStrategy(result);
            
            await LitigationStrategy.create({
                case_id: selectedCase,
                case_theory: result.strategy,
                elements_to_prove: result.strengths?.map(s => s.point) || [],
                discovery_plan: result.next_steps?.join('; ') || "",
                ai_analysis: result
            });

            toast({ title: "Strategy Generated Successfully" });
        } catch (error) {
            console.error("Strategy generation failed:", error);
            toast({ title: "Generation Failed", description: "Could not generate strategy. Please try again.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <BrainCircuit className="w-6 h-6 text-purple-600" />
                    AI Case Strategist
                </CardTitle>
                <p className="text-slate-600 text-sm pt-2">Develop a powerful legal strategy by analyzing your case facts, strengths, and weaknesses.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Inputs */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                    <Select value={selectedCase} onValueChange={setSelectedCase}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a case to analyze" />
                        </SelectTrigger>
                        <SelectContent>
                            {cases.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.case_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Textarea
                        placeholder="Describe the facts of your case here. Be as detailed as possible."
                        value={caseDescription}
                        onChange={(e) => setCaseDescription(e.target.value)}
                        rows={6}
                    />

                    <Button onClick={generateCaseStrategy} disabled={isGenerating || !selectedCase} className="w-full">
                        {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                        Generate Litigation Strategy
                    </Button>
                </div>

                {/* Results */}
                {strategy && (
                    <div className="space-y-6">
                        <ConfidenceGauge confidence={strategy.confidence} />

                        {/* Strengths */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="w-5 h-5"/> Case Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {strategy.strengths.map((item, i) => (
                                    <div key={i} className="p-3 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-green-900">{item.point}</h4>
                                        <p className="text-sm text-green-800">{item.strategy}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Risks */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    <AlertTriangle className="w-5 h-5"/> Potential Risks
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {strategy.risks.map((item, i) => (
                                    <div key={i} className="p-3 bg-red-50 rounded-lg">
                                        <h4 className="font-semibold text-red-900">{item.risk}</h4>
                                        <p className="text-sm text-red-800">{item.mitigation}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Strategy */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recommended Strategy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ReactMarkdown className="prose prose-sm">{strategy.strategy}</ReactMarkdown>
                            </CardContent>
                        </Card>

                        {/* Next Steps */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Next Steps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {strategy.next_steps.map((step, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <ArrowRight className="w-4 h-4 text-blue-600"/>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}