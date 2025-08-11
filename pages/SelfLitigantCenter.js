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
    <SubscriptionGate feature="document_generation">
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
    </SubscriptionGate>
);

const CourtroomSimulator = () => (
    <SubscriptionGate feature="courtroom_simulator">
        <Card className="border-0 shadow-lg bg-white">
 
