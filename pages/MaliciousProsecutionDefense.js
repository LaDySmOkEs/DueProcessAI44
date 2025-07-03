import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Scale, FileText, BrainCircuit, Loader2 } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { InvokeLLM } from "@/integrations/Core";
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/components/ui/use-toast";

const analysisSchema = {
    type: "object",
    properties: {
        is_malicious_prosecution: { type: "boolean" },
        confidence_score: { type: "integer", minimum: 0, maximum: 100 },
        key_indicators: {
            type: "array",
            items: { 
                type: "object",
                properties: {
                    indicator: { type: "string" },
                    explanation: { type: "string" }
                }
            }
        },
        defense_strategy: { type: "string" },
        evidence_needed: { type: "array", items: { type: "string" } }
    },
    required: ["is_malicious_prosecution", "confidence_score", "key_indicators", "defense_strategy", "evidence_needed"]
};

export default function MaliciousProsecutionDefense() {
    const [caseDetails, setCaseDetails] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        if (!caseDetails.trim()) {
            toast({ title: "Please enter case details.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setAnalysisResult(null);

        const prompt = `
            Analyze the following case details for indicators of malicious prosecution.
            The user was charged with a crime but the case was terminated in their favor.
            Now they are considering a civil suit for malicious prosecution.

            Case Details: "${caseDetails}"

            Based on these details, evaluate the four elements of malicious prosecution:
            1. Institution of criminal proceedings by the defendant.
            2. Termination of proceedings in the plaintiff's favor.
            3. Absence of probable cause for the proceedings.
            4. Malice or a primary purpose other than bringing an offender to justice.

            Provide a structured analysis.
        `;

        try {
            const result = await InvokeLLM({
                prompt,
                response_json_schema: analysisSchema
            });
            setAnalysisResult(result);
        } catch (error) {
            console.error("Analysis failed:", error);
            toast({ title: "Analysis failed. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-slate-800 rounded-xl flex items-center justify-center">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Malicious Prosecution Defense Center</h1>
                            <p className="text-slate-600 mt-1">AI-powered tools to fight back against unjust prosecutions.</p>
                        </div>
                    </div>
                </div>

                {/* Input Card */}
                <Card className="border-0 shadow-lg bg-white mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Case Details Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Describe your case here. Include details about the original charges, why you believe there was no probable cause, any evidence of malice, and how the case was resolved in your favor."
                            value={caseDetails}
                            onChange={(e) => setCaseDetails(e.target.value)}
                            rows={8}
                        />
                        <Button onClick={handleAnalyze} disabled={isLoading}>
                            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/>Analyzing...</> : <><BrainCircuit className="w-4 h-4 mr-2"/>Analyze Case</>}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                {analysisResult && (
                    <Card className="border-0 shadow-lg bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5"/> AI Analysis Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className={`p-4 rounded-lg ${analysisResult.is_malicious_prosecution ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                                <h3 className="text-lg font-bold">{analysisResult.is_malicious_prosecution ? "Potential Malicious Prosecution Case Identified" : "Malicious Prosecution Claim Appears Weak"}</h3>
                                <p>Confidence Score: {analysisResult.confidence_score}%</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-2">Key Indicators Found:</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    {analysisResult.key_indicators.map((item, i) => (
                                        <li key={i}><strong>{item.indicator}:</strong> {item.explanation}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-2">Recommended Defense Strategy:</h4>
                                <ReactMarkdown className="prose">{analysisResult.defense_strategy}</ReactMarkdown>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Critical Evidence to Gather:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {analysisResult.evidence_needed.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}