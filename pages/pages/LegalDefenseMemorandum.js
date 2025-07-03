import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LegalCase, AnalyzedDocument } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileSignature, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function LegalDefenseMemorandum() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMemo, setGeneratedMemo] = useState('');
  const [caseSummary, setCaseSummary] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadCases();
  }, []);
  
  useEffect(() => {
    if(selectedCase){
      loadCaseDocuments();
      const currentCase = cases.find(c => c.id === selectedCase);
      if(currentCase) {
        setCaseSummary(currentCase.description || '');
      }
    } else {
      setDocuments([]);
      setCaseSummary('');
    }
  }, [selectedCase]);

  const loadCases = async () => {
    try {
      const casesData = await LegalCase.list();
      setCases(casesData);
    } catch (error) {
      console.error("Failed to load cases", error);
    }
  };
  
  const loadCaseDocuments = async () => {
      try {
          const docs = await AnalyzedDocument.filter({case_id: selectedCase});
          setDocuments(docs);
      } catch (error) {
          console.error("Failed to load documents for case", error);
      }
  }

  const generateMemorandum = async () => {
    if (!selectedCase || !caseSummary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a case and provide a summary.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedMemo('');

    // Compile evidence from documents for the selected case
    const evidenceContext = documents.map((doc, index) => 
        `Evidence ${index + 1} (${doc.document_name}):\nSummary: ${doc.analysis_summary}\nKey Findings: ${doc.key_findings?.join(', ') || 'N/A'}\n`
    ).join('\n');
    
    const prompt = `
      As an expert legal analyst, draft a comprehensive Legal Defense Memorandum based on the following case information.

      **Case Summary:**
      ${caseSummary}

      **Compiled Evidence:**
      ${evidenceContext || "No documents were available for this case."}

      **Instructions:**
      Structure the memorandum with the following sections, formatted in Markdown:
      1.  **Introduction:** Briefly state the purpose of the memo.
      2.  **Statement of Facts:** Synthesize a neutral, chronological statement of facts from the case summary and evidence.
      3.  **Legal Analysis & Key Issues:** Identify the core legal issues. Analyze the strengths and weaknesses of the case based on the provided evidence.
      4.  **Proposed Defense Strategy:** Outline a coherent defense strategy. Suggest which legal arguments to prioritize.
      5.  **Evidence Plan:** Detail which pieces of evidence are most critical and how they should be used.
      6.  **Conclusion:** Summarize the case's outlook and recommended next steps.

      The tone should be professional, objective, and analytical.
    `;

    try {
      const result = await InvokeLLM({ prompt });
      setGeneratedMemo(result);
      toast({ title: "Memorandum Generated Successfully" });
    } catch (error) {
      console.error("Memorandum generation failed:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the memorandum. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-slate-900 rounded-xl flex items-center justify-center">
              <FileSignature className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Legal Defense Memorandum</h1>
              <p className="text-slate-600 mt-1">Synthesize your case facts and evidence into a strategic legal memo.</p>
            </div>
          </div>
        </div>

        {/* Setup Card */}
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle>Memo Generation Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="case-select" className="block text-sm font-medium text-slate-700 mb-1">Select Case</label>
              <Select id="case-select" onValueChange={setSelectedCase} value={selectedCase}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a case to analyze..." />
                </SelectTrigger>
                <SelectContent>
                  {cases.map(c => <SelectItem key={c.id} value={c.id}>{c.case_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
               <label htmlFor="case-summary" className="block text-sm font-medium text-slate-700 mb-1">Case Summary / Theory</label>
               <Textarea
                 id="case-summary"
                 placeholder="Provide a brief summary of the case, the core conflict, and your desired outcome."
                 value={caseSummary}
                 onChange={e => setCaseSummary(e.target.value)}
                 rows={4}
                 disabled={!selectedCase}
               />
            </div>
             <p className="text-xs text-slate-500">
                {documents.length} analyzed document(s) for the selected case will be automatically included as context.
            </p>
            <Button onClick={generateMemorandum} disabled={isGenerating || !selectedCase}>
              {isGenerating ? <><Loader2 className="animate-spin mr-2" /> Generating...</> : <><BrainCircuit className="w-4 h-4 mr-2" /> Generate Memo</>}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Memo Output */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Generated Memorandum</CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating && (
              <div className="text-center p-8">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
                <p className="mt-2 text-slate-500">AI is analyzing your case...</p>
              </div>
            )}
            {generatedMemo && (
              <div className="prose max-w-none">
                <ReactMarkdown>{generatedMemo}</ReactMarkdown>
              </div>
            )}
            {!isGenerating && !generatedMemo && (
              <div className="text-center p-8 text-slate-500">
                Your generated legal memorandum will appear here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}