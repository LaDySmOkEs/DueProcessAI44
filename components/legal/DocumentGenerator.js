import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, ArrowLeft, Download } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

export default function DocumentGenerator({ documentType, onBack }) {
    const [userFacts, setUserFacts] = useState('');
    const [generatedDoc, setGeneratedDoc] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const generateDocument = async () => {
        if (!userFacts.trim()) {
            toast({ title: "Please provide facts for the document.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setGeneratedDoc('');

        const prompt = `
            Generate a legal document of type "${documentType.title}".
            The document should be professionally formatted, ready for court filing.
            Base the content on the following facts provided by the user.

            Facts: "${userFacts}"
        `;

        try {
            const result = await InvokeLLM({ prompt });
            setGeneratedDoc(result);
            toast({ title: `${documentType.title} Generated` });
        } catch (error) {
            console.error("Document generation failed:", error);
            toast({ title: "Failed to generate document.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    const downloadDocument = () => {
        if (!generatedDoc) return;
        const blob = new Blob([generatedDoc], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${documentType.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600"/>
                        Generate: {documentType.title}
                    </CardTitle>
                </div>
                <p className="text-sm text-slate-600 pl-14">{documentType.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="font-semibold text-slate-900 mb-2 block">1. Provide Case Facts</label>
                    <Textarea
                        placeholder={`Provide all relevant facts for the ${documentType.title}...`}
                        value={userFacts}
                        onChange={(e) => setUserFacts(e.target.value)}
                        rows={8}
                    />
                </div>
                
                <Button onClick={generateDocument} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Generate Document
                </Button>

                {generatedDoc && (
                    <div>
                        <label className="font-semibold text-slate-900 mb-2 block">2. Review Generated Document</label>
                        <div className="p-4 border rounded-lg bg-slate-50 max-h-96 overflow-y-auto">
                            <ReactMarkdown className="prose prose-sm whitespace-pre-wrap">{generatedDoc}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </CardContent>
            {generatedDoc && (
                <CardFooter>
                    <Button variant="secondary" onClick={downloadDocument}>
                        <Download className="w-4 h-4 mr-2" />
                        Download as .txt
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}