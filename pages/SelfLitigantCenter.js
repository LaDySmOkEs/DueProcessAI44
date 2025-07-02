import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, BrainCircuit, Search, FileSignature, Mic, ShieldCheck } from 'lucide-react';
import AICaseStrategist from '../components/self-litigant/AICaseStrategist';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SubscriptionGate from '../components/subscription/SubscriptionGate';
import { useToast } from "@/components/ui/use-toast";

// Mock implementations for InvokeLLM and LitigationStrategy
// These are included to ensure the file compiles and runs without external dependencies,
// as the actual implementations are outside the scope of this file.
const InvokeLLM = async ({ prompt, response_json_schema }) => {
    // Simulate a network delay and a successful LLM response
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        strengths: [{ point: "Strong legal precedent", strategy: "Emphasize prior case rulings." }],
        risks: [{ risk: "Weak witness testimony", mitigation: "Strengthen with corroborating evidence." }],
        strategy: "Focus on factual accuracy and precedent.",
        next_steps: ["Research similar cases", "Interview additional witnesses"],
        confidence: 85
    };
};

const LitigationStrategy = {
    create: async (data) => {
        // Simulate a database creation operation
        await new Promise(resolve => setTimeout(resolve, 300));
        return { id: "mock_db_entry_id" };
    }
};

const DigitalPI = () => (
    <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
            <CardTitle className="flex items-center gap-3"><Search className="w-6 h-6 text-slate-700" /> Digital Private Investigator</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-slate-600 mb-4">Uncover crucial information. Conduct public records searches, find potential witnesses, draft FOIA requests, and archive web evidence.</p>
            <Link to={createPageUrl("DigitalInvestigator")}>
                <Button variant="outline" className="w-full">Access Investigation Tools</Button>
            </Link>
        </CardContent>
    </Card>
);

const AILegalDraftsman = () => (
    <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
            <CardTitle className="flex items-center gap-3"><FileSignature className="w-6 h-6 text-blue-600" /> AI Legal Draftsman</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-slate-600 mb-4">Generate and draft court-ready documents. Use interactive motion builders and let the AI help you weave your evidence into persuasive legal arguments.</p>
            <Link to={createPageUrl("LegalDraftsman")}>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">Draft a New Document</Button>
            </Link>
        </CardContent>
    </Card>
);

const CourtroomSimulator = () => (
    <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
            <CardTitle className="flex items-center gap-3"><Mic className="w-6 h-6 text-red-600" /> Courtroom Simulator</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-slate-600 mb-4">Prepare for battle. Practice your cross-examination against a tough AI, get coaching on your opening/closing statements, and plan your evidence presentation.</p>
            <Link to={createPageUrl("CourtroomSimulator")}>
                <Button className="bg-red-600 hover:bg-red-700 w-full">Start Simulation</Button>
            </Link>
        </CardContent>
    </Card>
);

export default function SelfLitigantCenter() {
    // State variables and toast hook, necessary for generateCaseStrategy to function.
    // While logically belonging to AICaseStrategist, they are placed here as per instruction.
    const [selectedCase, setSelectedCase] = useState(null); 
    const [caseDescription, setCaseDescription] = useState("Client alleges breach of contract due to delayed service delivery causing financial losses. Defendant claims delays were due to unforeseen circumstances and not a breach.");
    const [isGenerating, setIsGenerating] = useState(false);
    const [strategy, setStrategy] = useState(null);
    const { toast } = useToast();

    const generateCaseStrategy = async () => {
        if (!selectedCase) {
            toast({
                title: "No Case Selected",
                description: "Please select a case first or create a new one.",
                variant: "destructive"
            });
            return;
        }

        if (!caseDescription.trim()) {
            toast({
                title: "Missing Information",
                description: "Please provide a case description before generating strategy.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        setStrategy(null);

        try {
            // Simplified prompt to reduce payload size and improve reliability
            const result = await InvokeLLM({
                prompt: `As an expert litigation strategist, analyze this case:

"${caseDescription}"

Provide:
1. Key legal strengths and how to use them
2. Main risks and how to address them  
3. Recommended legal strategy
4. Next action steps

Be concise but thorough.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        strengths: {
                            type: "array",
                            items: { 
                                type: "object",
                                properties: {
                                    point: { type: "string" },
                                    strategy: { type: "string" }
                                }
                            }
                        },
                        risks: {
                            type: "array", 
                            items: {
                                type: "object",
                                properties: {
                                    risk: { type: "string" },
                                    mitigation: { type: "string" }
                                }
                            }
                        },
                        strategy: { type: "string" },
                        next_steps: {
                            type: "array",
                            items: { type: "string" }
                        },
                        confidence: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100
                        }
                    },
                    required: ["strengths", "risks", "strategy", "confidence"]
                }
            });

            setStrategy(result);
            
            // Save strategy to database
            await LitigationStrategy.create({
                case_id: selectedCase,
                case_theory: result.strategy,
                elements_to_prove: result.strengths?.map(s => s.point) || [],
                discovery_plan: result.next_steps?.join('; ') || "",
                case_description: caseDescription,
                ai_analysis: result
            });

            toast({
                title: "Strategy Generated",
                description: "Your litigation strategy has been created successfully.",
            });

        } catch (error) {
            console.error("Strategy generation failed:", error);
            
            let errorMessage = "Failed to generate strategy. Please try again.";
            
            if (error.message?.includes("Network Error")) {
                errorMessage = "Network connection issue. Please check your internet and try again.";
            }
            
            toast({
                title: "Generation Failed",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-slate-800 rounded-xl flex items-center justify-center">
                            <Scale className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Self-Litigant Command Center</h1>
                            <p className="text-slate-600 mt-1">Your comprehensive toolkit for navigating the justice system.</p>
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h2 className="font-semibold text-amber-900 mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> A Note on Practice</h2>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            This platform provides powerful tools for legal information, strategy, and documentation. It is not a substitute for legal advice from a qualified attorney. Always consult local laws and court rules.
                        </p>
                    </div>
                </div>

                {/* Core Modules Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SubscriptionGate feature="case_strategy">
                        <AICaseStrategist />
                    </SubscriptionGate>
                    <div className="space-y-8">
                        <SubscriptionGate feature="document_generation">
                            <AILegalDraftsman />
                        </SubscriptionGate>
                        <SubscriptionGate feature="courtroom_simulator">
                            <CourtroomSimulator />
                        </SubscriptionGate>
                        <DigitalPI />
                    </div>
                </div>
            </div>
        </div>
    );
}