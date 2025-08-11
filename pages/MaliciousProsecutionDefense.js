import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { InvokeLLM } from "@/integrations/Core";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Shield, 
  Gavel, 
  FileText, 
  BrainCircuit, 
  Scale,
  Search,
  Eye,
  AlertCircle,
  Loader2
} from 'lucide-react';

const EvidenceChecklistItem = ({ text }) => (
    <li className="flex items-start">
        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
        <span>{text}</span>
    </li>
);

export default function MaliciousProsecutionDefense() {
    const [caseSummary, setCaseSummary] = useState('');
    const [strategy, setStrategy] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerateStrategy = async () => {
        if (!caseSummary.trim()) {
            toast({
                title: "Case Summary Required",
                description: "Please describe your situation to generate a strategy.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        setStrategy(null);
        try {
            const prompt = `You are a top-tier civil rights attorney specializing in §1983 malicious prosecution cases against law enforcement. Analyze the following case summary from a user who believes they were framed. 
            
            Case Summary: "${caseSummary}"

            Based on this summary, generate a preliminary defense and counter-suit strategy. Your response must be structured in JSON format with the following keys:
            - "initial_assessment": A brief assessment of the viability of a malicious prosecution claim.
            - "key_defense_angles": An array of strings outlining potential defense angles for the criminal case.
            - "evidence_to_prioritize": An array of strings listing the most critical pieces of evidence to gather to prove the framing.
            - "potential_motions": An array of objects, each with "motion_name" and "purpose" keys (e.g., Motion to Suppress, Brady Motion).
            - "civil_suit_viability": An analysis of the strengths and weaknesses for a future §1983 lawsuit.
            - "next_steps": A numbered list of immediate, actionable next steps for the user.`;

            const result = await InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        initial_assessment: { type: "string" },
 
