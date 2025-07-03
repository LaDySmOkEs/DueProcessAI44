import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Send, BrainCircuit, Loader2 } from 'lucide-react';
import { InvokeLLM } from "@/integrations/Core";
import { FOIARequest } from "@/entities/all";
import { useToast } from "@/components/ui/use-toast";

const requestSchema = {
    type: "object",
    properties: {
        request_subject: { type: "string" },
        request_body: { type: "string" }
    },
    required: ["request_subject", "request_body"]
};

export default function PublicRecordsRequest() {
    const [agencyName, setAgencyName] = useState('');
    const [requestDescription, setRequestDescription] = useState('');
    const [generatedRequest, setGeneratedRequest] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!agencyName.trim() || !requestDescription.trim()) {
            toast({ title: "Agency and description are required.", variant: "destructive" });
            return;
        }

        setIsGenerating(true);
        setGeneratedRequest(null);

        const prompt = `
            Draft a formal public records request (like FOIA) based on state and federal laws.
            The request is for: "${requestDescription}".
            The target agency is: "${agencyName}".

            The draft should be formal, cite the relevant public records laws generally, clearly define the records being sought, and specify the preferred format for the records.
            Generate a subject line and the full body of the request.
        `;
        
        try {
            const result = await InvokeLLM({
                prompt,
                response_json_schema: requestSchema
            });
            setGeneratedRequest(result);
        } catch (error) {
            console.error("Request generation failed:", error);
            toast({ title: "Failed to generate request.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = async () => {
        // This is a mock submission. In a real app, it would be sent via an email API or saved to a database.
        toast({ title: "Saving Request...", description: "Saving the request to your records." });
        try {
            await FOIARequest.create({
                agency_name: agencyName,
                request_subject: generatedRequest.request_subject,
                request_description: generatedRequest.request_body,
                date_submitted: new Date().toISOString().split('T')[0],
                status: "submitted"
            });
            toast({ title: "Request Saved!", description: "Your public records request has been saved." });
        } catch(e) {
            toast({ title: "Failed to save request", variant: "destructive" });
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-800 rounded-xl flex items-center justify-center">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Public Records Request Builder</h1>
                            <p className="text-slate-600 mt-1">Generate and send formal requests for government records (FOIA).</p>
                        </div>
                    </div>
                </div>

                {/* Builder Card */}
                <Card className="border-0 shadow-lg bg-white mb-8">
                    <CardHeader>
                        <CardTitle>Draft Your Request</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="agency">Target Government Agency</Label>
                            <Input id="agency" placeholder="e.g., Anytown Police Department, Department of Justice" value={agencyName} onChange={e => setAgencyName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="description">What records are you requesting?</Label>
                            <Textarea id="description" placeholder="Be specific. e.g., 'All emails mentioning 'Project X' from Jan 1 to Mar 31', 'Complaint history for Officer John Doe, Badge #12345'." value={requestDescription} onChange={e => setRequestDescription(e.target.value)} rows={5} />
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Generating...</> : <><BrainCircuit className="w-4 h-4 mr-2"/>Generate Formal Request</>}
                        </Button>
                    </CardContent>
                </Card>

                {/* Generated Request */}
                {generatedRequest && (
                    <Card className="border-0 shadow-lg bg-white">
                        <CardHeader>
                            <CardTitle>Generated Request</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Subject</Label>
                                <Input readOnly value={generatedRequest.request_subject} />
                            </div>
                            <div>
                                <Label>Body</Label>
                                <Textarea readOnly value={generatedRequest.request_body} rows={15} />
                            </div>
                            <Button onClick={handleSend}><Send className="w-4 h-4 mr-2"/> Save Request</Button>
                            <p className="text-xs text-slate-500">Note: This saves the request to your records. You still need to email it to the appropriate agency contact.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}