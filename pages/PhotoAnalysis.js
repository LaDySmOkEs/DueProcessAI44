import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, BrainCircuit, Loader2, Image, Search, Shield, Clock } from 'lucide-react';
import { InvokeLLM, UploadFile } from "@/integrations/Core";
import { useToast } from "@/components/ui/use-toast";

const analysisSchema = {
    type: "object",
    properties: {
        objects_identified: { type: "array", items: { type: "string" } },
        potential_evidence: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    item: { type: "string" },
                    reasoning: { type: "string" }
                }
            }
        },
        inconsistencies: { type: "array", items: { type: "string" } },
        summary: { type: "string" }
    },
    required: ["objects_identified", "potential_evidence", "summary"]
};

export default function PhotoAnalysis() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const { toast } = useToast();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setAnalysisResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            toast({ title: "Please select an image file first.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const { file_url } = await UploadFile({ file: selectedFile });

            const prompt = `
                Analyze this image in a legal context. Identify all objects, people, and potential pieces of evidence.
                Look for inconsistencies, signs of tampering, or details that might be relevant to a police interaction or crime scene.
                Provide a structured analysis.
            `;
            
            const result = await InvokeLLM({
                prompt,
                file_urls: [file_url],
                response_json_schema: analysisSchema
            });

            setAnalysisResult(result);
            toast({ title: "Photo Analysis Complete" });

        } catch (error) {
            console.error("Photo analysis failed:", error);
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
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-slate-800 rounded-xl flex items-center justify-center">
                            <Camera className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">AI Photo & Evidence Analysis</h1>
                            <p className="text-slate-600 mt-1">Extract critical details and potential evidence from your images.</p>
                        </div>
                    </div>
                </div>

                {/* Upload Card */}
                <Card className="border-0 shadow-lg bg-white mb-8">
                    <CardHeader>
                        <CardTitle>Upload Image for Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview && (
                            <div className="mt-4">
                                <img src={preview} alt="Preview" className="max-h-64 rounded-lg mx-auto" />
                            </div>
                        )}
                        <Button onClick={handleAnalyze} disabled={isLoading || !selectedFile} className="w-full">
                            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><BrainCircuit className="w-4 h-4 mr-2" /> Analyze Photo</>}
                        </Button>
                    </CardContent>
                </Card>

                {/* Analysis Results */}
                {analysisResult && (
                    <Card className="border-0 shadow-lg bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5"/> Analysis Report</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Image className="w-4 h-4"/> Objects Identified</h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysisResult.objects_identified.map((item, i) => <Badge key={i} variant="secondary">{item}</Badge>)}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> Potential Evidence</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {analysisResult.potential_evidence.map((item, i) => (
                                        <li key={i}><strong>{item.item}:</strong> {item.reasoning}</li>
                                    ))}
                                </ul>
                            </div>
                             {analysisResult.inconsistencies.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Clock className="w-4 h-4"/> Inconsistencies / Tampering Signs</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {analysisResult.inconsistencies.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                             )}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Overall Summary</h3>
                                <p className="text-slate-700">{analysisResult.summary}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}