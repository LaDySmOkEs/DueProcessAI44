import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScanText, Upload, Loader2, Camera, AlertCircle, X, FileText, Plus, ChevronDown } from "lucide-react";
import { InvokeLLM, UploadFile } from "@/integrations/Core";
import { AnalyzedDocument, DocumentCollection, LegalCase } from "@/entities/all";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionGate from "../components/subscription/SubscriptionGate";
import { analyzeAudio } from "@/functions/analyzeAudio";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB for videos and audio
const MAX_FILES = 10;

const AI_DOCUMENT_TYPES = [
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv', 'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const AI_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

// Add audio file types
const AI_AUDIO_TYPES = ['audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/m4a'];

const analysisSchema = {
    type: "object",
    properties: {
        document_name: { type: "string" },
        ai_summary: { type: "string" },
        ai_analysis: {
            type: "object",
            properties: {
                key_entities: {
                    type: "object",
                    properties: {
                        people: { type: "array", items: { type: "object", properties: { name: { type: "string" }, role: { type: "string" } } } },
                        dates: { type: "array", items: { type: "object", properties: { date: { type: "string" }, context: { type: "string" } } } },
                        locations: { type: "array", items: { type: "object", properties: { location: { type: "string" }, context: { type: "string" } } } }
                    }
                },
                legal_issues: {
                    type: "array",
                    items: { type: "object", properties: { issue: { type: "string" }, analysis: { type: "string" } } }
                },
                critical_analysis: {
                    type: "object",
                    properties: {
                        procedural_violations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    violation_type: { type: "string" },
                                    evidence_of_violation: { type: "string" },
                                    constitutional_implications: { type: "string" }
                                }
                            }
                        },
                        inconsistencies: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    inconsistency_type: { type: "string" },
                                    detailed_description: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    required: ["ai_summary", "ai_analysis"]
};

const videoAnalysisSchema = {
    type: "object",
    properties: {
        overall_summary: { type: "string" },
        full_transcript: { type: "string" },
        key_events: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    timestamp: { type: "string" },
                    description: { type: "string" }
                }
            }
        },
        identified_violations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    violation_type: { type: "string" },
                    timestamp_of_violation: { type: "string" },
                    supporting_evidence: { type: "string" },
                    constitutional_implication: { type: "string" }
                }
            }
        }
    },
    required: ["overall_summary", "full_transcript", "key_events", "identified_violations"]
};

// Custom Mobile-Friendly Dropdown Component
const MobileDropdown = ({ value, onValueChange, placeholder, options, disabled = false, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
        <div className={`relative w-full`}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full px-3 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'hover:border-slate-400'
                } ${className}`}
            >
                <div className="flex items-center justify-between">
                    <span className={selectedOption ? 'text-slate-900' : 'text-slate-500'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            
            {isOpen && !disabled && (
                <>
                    {/* Mobile overlay */}
                    <div 
                        className="fixed inset-0 z-40 bg-black bg-opacity-25" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown content */}
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onValueChange(option.value);
                                    setIsOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function DocumentAnalyzer() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [cases, setCases] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedCase, setSelectedCase] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('');
    const [documentType, setDocumentType] = useState('other');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState({ current: 0, total: 0 });
    const [analysisResults, setAnalysisResults] = useState([]);
    const [uploadMode, setUploadMode] = useState('file');
    const [showNewCollection, setShowNewCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const { toast } = useToast();

    const canAnalyze = selectedFiles.length > 0 && selectedCase && selectedCollection && !isAnalyzing;

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [casesData, collectionsData] = await Promise.all([
                LegalCase.list("-created_date"),
                DocumentCollection.list("-created_date")
            ]);
            setCases(casesData);
            setCollections(collectionsData);
            
            if (casesData.length > 0) {
                setSelectedCase(casesData[0].id);
                const caseCollections = collectionsData.filter(c => c.case_id === casesData[0].id);
                if (caseCollections.length > 0) {
                    setSelectedCollection(caseCollections[0].id);
                }
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    const handleFileSelection = (files) => {
        if (!files || files.length === 0) return;
        
        const fileArray = Array.from(files);
        if (fileArray.length > MAX_FILES) {
            toast({
                title: "Too Many Files",
                description: `Please select no more than ${MAX_FILES} files at once.`,
                variant: "destructive"
            });
            return;
        }

        const validFiles = fileArray.filter(file => {
            const isVideoOrAudio = isVideoFile(file) || isAudioFile(file);
            const maxSize = isVideoOrAudio ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
            const sizeLimit = isVideoOrAudio ? "100MB" : "500MB";

            if (file.size > maxSize) {
                toast({
                    title: "File Too Large",
                    description: `${file.name} exceeds ${sizeLimit} limit${isVideoOrAudio ? ' for audio/video files' : ''}`,
                    variant: "destructive"
                });
                return false;
            }
            return true;
        });

        setSelectedFiles(validFiles);
        setAnalysisResults([]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const isVideoFile = (file) => AI_VIDEO_TYPES.includes(file.type);
    const isAudioFile = (file) => AI_AUDIO_TYPES.includes(file.type);
    const isDocumentFile = (file) => AI_DOCUMENT_TYPES.includes(file.type);

    const createNewCollection = async () => {
        if (!newCollectionName.trim() || !selectedCase) {
            toast({
                title: "Missing Information",
                description: "Please enter a collection name and select a case.",
                variant: "destructive"
            });
            return;
        }

        try {
            const newCollection = await DocumentCollection.create({
                collection_name: newCollectionName,
                collection_type: "evidence_collection",
                description: `Document collection for ${newCollectionName}`,
                case_id: selectedCase
            });
            
            setCollections(prev => [newCollection, ...prev]);
            setSelectedCollection(newCollection.id);
            setNewCollectionName('');
            setShowNewCollection(false);
            
            toast({
                title: "Collection Created",
                description: `Created: ${newCollectionName}`
            });
        } catch (error) {
            toast({
                title: "Creation Failed",
                description: "Could not create collection. Please try again.",
                variant: "destructive"
            });
        }
    };

    const analyzeDocuments = async () => {
        if (selectedFiles.length === 0 || !selectedCase || !selectedCollection) {
            toast({
                title: "Missing Requirements",
                description: "Please select files, case, and collection before analyzing.",
                variant: "destructive"
            });
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResults([]);
        setAnalysisProgress({ current: 0, total: selectedFiles.length });

        const results = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            setAnalysisProgress({ current: i + 1, total: selectedFiles.length });

            try {
                const { file_url } = await UploadFile({ file });
                const isVideo = isVideoFile(file);
                const isAudio = isAudioFile(file);
                const isDocument = isDocumentFile(file);

                let analysisResult;

                if (isAudio || file.name.toLowerCase().endsWith('.m4a')) {
                    toast({
                        title: "Processing Audio",
                        description: `Transcribing ${file.name} with AI... This may take a moment.`
                    });

                    const audioAnalysis = await analyzeAudio({
                        file_url,
                        file_name: file.name,
                        case_context: `Case: ${cases.find(c => c.id === selectedCase)?.case_name || 'Unknown'}`,
                        user_notes: notes
                    });

                    if (audioAnalysis.data && audioAnalysis.data.success) {
                        analysisResult = {
                            document_name: file.name,
                            file_url,
                            document_type: 'audio_evidence',
                            ai_summary: `Audio transcription completed. Duration: ${audioAnalysis.data.transcript.duration.toFixed(2)}s. ${audioAnalysis.data.analysis.summary.substring(0, 200)}${audioAnalysis.data.analysis.summary.length > 200 ? '...' : ''}`,
                            ai_analysis: {
                                transcript: audioAnalysis.data.transcript,
                                constitutional_analysis: audioAnalysis.data.analysis.summary,
                                key_findings: ["High-accuracy Whisper transcription", "GPT-4 constitutional analysis"],
                                processing_method: audioAnalysis.data.analysis.processing_method
                            },
                            whisper_transcript: audioAnalysis.data.transcript.full_text,
                            error: false
                        };
                    } else if (audioAnalysis.data && audioAnalysis.data.fallback_analysis) {
                        // Handle quota exceeded gracefully
                        analysisResult = {
                            document_name: file.name,
                            file_url,
                            document_type: 'audio_evidence',
                            ai_summary: `Audio file uploaded but transcription failed due to OpenAI quota limits. ${audioAnalysis.data.fallback_analysis.message}`,
                            ai_analysis: {
                                quota_exceeded: true,
                                recommendations: audioAnalysis.data.fallback_analysis.recommendations,
                                file_preserved: true
                            },
                            error: false, // Not a hard error preventing saving, but a warning
                            quota_issue: true // Custom flag for UI handling
                        };

                        toast({
                            title: "OpenAI Quota Exceeded",
                            description: "Audio file saved but could not be transcribed. Check your OpenAI billing.",
                            variant: "destructive"
                        });
                    } else {
                        analysisResult = {
                            document_name: file.name,
                            ai_summary: `Audio analysis failed: ${audioAnalysis.data ? audioAnalysis.data.error : 'Unknown error during audio processing.'}`,
                            error: true
                        };
                    }
                } else if (isVideo && file.type !== 'audio/x-m4a') {
                    const videoPrompt = `Analyze this video file for constitutional violations and due process issues. 
                    
                    Please provide:
                    1. A complete transcript of all audible speech
                    2. A chronological timeline of key events with timestamps
                    3. Identification of any constitutional violations (4th Amendment searches, 5th Amendment rights, excessive force, etc.)
                    4. Analysis of police procedure compliance
                    5. Documentation of any inconsistencies or concerning behavior
                    
                    Focus particularly on:
                    - Miranda rights violations
                    - Unlawful search and seizure
                    - Excessive use of force
                    - Procedural failures
                    - Evidence tampering or destruction
                    - False statements by officials`;
                    
                    const aiResult = await InvokeLLM({
                        prompt: videoPrompt,
                        file_urls: [file_url],
                        response_json_schema: videoAnalysisSchema
                    });
                    
                    analysisResult = {
                        document_name: file.name,
                        file_url,
                        document_type: 'video_evidence',
                        ai_summary: aiResult.overall_summary,
                        ai_analysis: aiResult,
                        error: false
                    };
                } else if (isDocument) {
                    const documentPrompt = `Analyze this legal document for constitutional violations, inconsistencies, and procedural issues. Focus on due process violations and provide detailed analysis.`;
                    
                    const aiResult = await InvokeLLM({
                        prompt: documentPrompt,
                        file_urls: [file_url],
                        response_json_schema: analysisSchema
                    });
                    
                    analysisResult = {
                        ...aiResult,
                        document_name: file.name,
                        file_url,
                        document_type: documentType,
                        error: false
                    };
                } else {
                    analysisResult = {
                        document_name: file.name,
                        file_url,
                        document_type: 'other',
                        ai_summary: `File uploaded successfully but cannot be analyzed automatically. File type: ${file.type}. Manual review recommended.`,
                        error: false
                    };
                }

                // Prepare key findings and due process violations based on the analysis type
                let docKeyFindings = [];
                let docDueProcessViolations = [];

                if (analysisResult.document_type === 'audio_evidence') {
                    docKeyFindings = analysisResult.ai_analysis?.key_findings || [];
                    docDueProcessViolations = analysisResult.ai_analysis?.constitutional_analysis ? ['Constitutional violations identified'] : [];
                } else if (analysisResult.document_type === 'video_evidence') {
                    docKeyFindings = analysisResult.ai_analysis?.key_events?.map(e => e.description) || [];
                    docDueProcessViolations = analysisResult.ai_analysis?.identified_violations?.map(v => v.violation_type) || [];
                } else if (isDocument) { // This handles the case where original 'documentType' was used for successful document analysis
                    docKeyFindings = analysisResult.ai_analysis?.legal_issues?.map(i => i.issue) || [];
                    docDueProcessViolations = analysisResult.ai_analysis?.critical_analysis?.procedural_violations?.map(v => v.violation_type) || [];
                }
                // If it's 'other' or error, findings/violations will remain empty arrays

                // Save to database
                await AnalyzedDocument.create({
                    document_name: file.name,
                    file_url,
                    file_type: file.type,
                    file_size: file.size,
                    case_id: selectedCase,
                    collection_id: selectedCollection,
                    document_type: analysisResult.document_type,
                    analysis_summary: analysisResult.ai_summary,
                    analysis_result: analysisResult,
                    key_findings: docKeyFindings,
                    due_process_violations: docDueProcessViolations,
                    tags: tags.split(',').map(t => t.trim()).filter(t => t),
                    upload_method: uploadMode,
                    notes
                });

                results.push(analysisResult);

            } catch (error) {
                console.error(`Analysis failed for ${file.name}:`, error);
                
                let summaryMessage = `Analysis failed for ${file.name}. An unknown error occurred.`;
                let isQuotaIssue = false; // Flag to indicate quota/rate limit issue

                if (error.response) {
                    const status = error.response.status;
                    const errorData = error.response.data;

                    if (status === 401) {
                        summaryMessage = "Authentication Failed: The OpenAI API Key is incorrect. Please update it in your app settings.";
                        toast({
                            title: "Invalid API Key",
                            description: "Please check your OpenAI API key in the app settings. It should start with 'sk-' and be about 51 characters long.",
                            variant: "destructive"
                        });
                    } else if (status === 429) {
                        summaryMessage = "Quota Exceeded: Your OpenAI account has reached its usage limit. Please check your billing details.";
                        isQuotaIssue = true;
                        toast({
                            title: "OpenAI Quota Exceeded",
                            description: "Your OpenAI account has reached its usage limit. Please check your billing details and try again.",
                            variant: "destructive"
                        });
                    } else if (errorData && errorData.error) {
                        // Check if the error message itself indicates quota or rate limiting for other services
                        if (typeof errorData.error === 'string' && (
                            errorData.error.toLowerCase().includes('rate limit') || 
                            errorData.error.toLowerCase().includes('quota') ||
                            errorData.error.toLowerCase().includes('usage limit'))
                        ) {
                            summaryMessage = `API Quota/Rate Limit Exceeded: ${errorData.error}`;
                            isQuotaIssue = true;
                            toast({
                                title: "API Quota/Rate Limit Exceeded",
                                description: "An API rate limit or quota has been exceeded. Please wait a moment or check your billing.",
                                variant: "destructive"
                            });
                        } else {
                            summaryMessage = `Analysis Error: ${errorData.error}`;
                        }
                    }
                } else if (error.message) {
                    summaryMessage = `Analysis failed: ${error.message}`;
                }

                results.push({
                    document_name: file.name,
                    ai_summary: summaryMessage,
                    error: !isQuotaIssue, // Mark as error unless it's a quota issue
                    quota_issue: isQuotaIssue // Custom flag for UI handling
                });
            }
        }

        setAnalysisResults(results);
        setIsAnalyzing(false);
        setSelectedFiles([]);
        setTags('');
        setNotes('');
        
        const successCount = results.filter(r => !r.error && !r.quota_issue).length;
        const audioCount = results.filter(r => r.document_type === 'audio_evidence' && !r.error).length;
        
        toast({
            title: "Analysis Complete",
            description: `Successfully analyzed ${successCount} of ${results.length} documents.${audioCount > 0 ? ` ${audioCount} audio files processed (some potentially with quota issues).` : ''}`
        });
    };

    const filteredCollections = collections.filter(c => c.case_id === selectedCase);

    const caseOptions = cases.map(c => ({ value: c.id, label: c.case_name }));
    const collectionOptions = filteredCollections.map(c => ({ 
        value: c.id, 
        label: `${c.collection_name} (${c.document_count || 0} docs)` 
    }));

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <ScanText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Document Analyzer</h1>
                    <p className="text-slate-600">Advanced analysis for constitutional violations and legal evidence</p>
                </div>

                <SubscriptionGate feature="document_analysis">
                    <div className="space-y-6">
                        {/* Case & Collection Selection */}
                        <Card className="border-2 border-amber-200 bg-amber-50">
                            <CardHeader>
                                <CardTitle className="text-amber-900">Step 1: Select Case & Collection</CardTitle>
                                <p className="text-sm text-amber-700">Required before analyzing documents</p>
                            </CardHeader>
                            <CardContent className="flex flex-col space-y-4">
                                <div>
                                    <Label>Select Case</Label>
                                    <MobileDropdown
                                        value={selectedCase}
                                        onValueChange={setSelectedCase}
                                        placeholder="Choose a case"
                                        options={caseOptions}
                                        className={!selectedCase ? 'border-red-300 bg-red-50' : ''}
                                    />
                                    {!selectedCase && (
                                        <p className="text-xs text-red-600 mt-1">Please select a case first</p>
                                    )}
                                </div>

                                <div>
                                    <Label>Select Collection</Label>
                                    <MobileDropdown
                                        value={selectedCollection}
                                        onValueChange={setSelectedCollection}
                                        placeholder="Choose collection"
                                        options={collectionOptions}
                                        disabled={!selectedCase}
                                        className={!selectedCollection && selectedCase ? 'border-red-300 bg-red-50' : ''}
                                    />
                                    {!selectedCollection && selectedCase && (
                                        <p className="text-xs text-red-600 mt-1">Please select a collection</p>
                                    )}
                                </div>
                            </CardContent>

                            {/* New Collection Form */}
                            {!showNewCollection ? (
                                <CardContent className="pt-0">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowNewCollection(true)}
                                        disabled={!selectedCase}
                                        className="w-full"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Collection
                                    </Button>
                                </CardContent>
                            ) : (
                                <CardContent className="pt-0">
                                    <div className="space-y-3 p-3 bg-white rounded-lg border">
                                        <Input
                                            placeholder="Collection name"
                                            value={newCollectionName}
                                            onChange={(e) => setNewCollectionName(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={createNewCollection} size="sm">
                                                Create
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setShowNewCollection(false)}
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        {/* Document Upload & Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Panel - Upload */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Step 2: Upload Documents</CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={uploadMode === 'file' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setUploadMode('file')}
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Files
                                            </Button>
                                            <Button
                                                variant={uploadMode === 'camera' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setUploadMode('camera')}
                                            >
                                                <Camera className="w-4 h-4 mr-2" />
                                                Camera
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label>Document Type</Label>
                                            <MobileDropdown
                                                value={documentType}
                                                onValueChange={setDocumentType}
                                                placeholder="Select document type"
                                                options={[
                                                    { value: "police_report", label: "Police Report" },
                                                    { value: "court_filing", label: "Court Filing" },
                                                    { value: "evidence_photo", label: "Evidence Photo" },
                                                    { value: "correspondence", label: "Correspondence" },
                                                    { value: "witness_statement", label: "Witness Statement" },
                                                    { value: "legal_motion", label: "Legal Motion" },
                                                    { value: "discovery_response", label: "Discovery Response" },
                                                    { value: "video_evidence", label: "Video Evidence" },
                                                    { value: "audio_evidence", label: "Audio Evidence" },
                                                    { value: "other", label: "Other" }
                                                ]}
                                            />
                                        </div>

                                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                            {uploadMode === 'file' ? (
                                                <>
                                                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                    <Input
                                                        type="file"
                                                        multiple
                                                        accept="*/*"
                                                        onChange={(e) => handleFileSelection(e.target.files)}
                                                        className="mb-4"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                    <Input
                                                        type="file"
                                                        accept="image/*,video/*,audio/*"
                                                        capture="environment"
                                                        onChange={(e) => handleFileSelection(e.target.files)}
                                                        className="mb-4"
                                                    />
                                                </>
                                            )}
                                            <p className="text-sm text-slate-500">
                                                All file types accepted. Audio/video up to 100MB, other files up to 500MB.
                                            </p>
                                        </div>

                                        {selectedFiles.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm">Selected Files:</h4>
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm">{file.name}</span>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {(file.size / 1024 / 1024).toFixed(1)}MB
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => removeFile(index)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add helpful notice for audio files - this notice is now less critical as direct audio analysis is supported */}
                                        {selectedFiles.some(f => f.name.toLowerCase().endsWith('.m4a') || AI_AUDIO_TYPES.includes(f.type)) && (
                                            <Alert className="bg-blue-50 border-blue-200">
                                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                                <AlertDescription className="text-blue-800">
                                                    <strong>Audio files detected:</strong> These will be analyzed using high-accuracy AI transcription and analysis.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div>
                                            <Label>Tags (comma-separated)</Label>
                                            <Input
                                                placeholder="e.g., key_evidence, discovery, police_report"
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <Label>Notes</Label>
                                            <Textarea
                                                placeholder="Add notes about these documents..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        {isAnalyzing && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Analyzing documents...</span>
                                                    <span>{analysisProgress.current}/{analysisProgress.total}</span>
                                                </div>
                                                <Progress value={(analysisProgress.current / analysisProgress.total) * 100} />
                                            </div>
                                        )}

                                        {/* Analysis Button with Clear Validation Messages */}
                                        <div className="space-y-2">
                                            <Button 
                                                onClick={analyzeDocuments}
                                                disabled={!canAnalyze}
                                                className="w-full"
                                            >
                                                {isAnalyzing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    `Analyze ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`
                                                )}
                                            </Button>
                                            
                                            {/* Validation Messages */}
                                            {!canAnalyze && !isAnalyzing && (
                                                <div className="text-xs text-red-600 space-y-1">
                                                    {selectedFiles.length === 0 && <p>• Please select files to analyze</p>}
                                                    {!selectedCase && <p>• Please select a case</p>}
                                                    {!selectedCollection && selectedCase && <p>• Please select a collection</p>}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Panel - Results */}
                            <div className="space-y-6 lg:col-span-1">
                                {analysisResults.length === 0 ? (
                                    <Card>
                                        <CardContent className="p-12 text-center">
                                            <ScanText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                                Ready for Analysis
                                            </h3>
                                            <p className="text-slate-600">
                                                Upload documents to see AI-powered analysis results here.
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    analysisResults.map((result, index) => (
                                        <Card 
                                            key={index} 
                                            className={
                                                result.error 
                                                    ? "border-red-200" 
                                                    : (result.quota_issue ? "border-orange-200" : "border-green-200")
                                            }
                                        >
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    {result.error ? (
                                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                                    ) : result.quota_issue ? (
                                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                                    ) : result.document_type === 'audio_evidence' ? (
                                                        <FileText className="w-5 h-5 text-purple-600" />
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-green-600" />
                                                    )}
                                                    {result.document_name}
                                                    {result.document_type === 'audio_evidence' && (
                                                        <Badge className="bg-purple-100 text-purple-800">Whisper AI</Badge>
                                                    )}
                                                    {result.quota_issue && (
                                                        <Badge className="bg-orange-100 text-orange-800">Quota Limit</Badge>
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Analysis Summary</h4>
                                                    <p className="text-sm text-slate-700">{result.ai_summary}</p>
                                                </div>

                                                {result.whisper_transcript && (
                                                    <div className="p-4 bg-purple-50 rounded-lg">
                                                        <h4 className="font-semibold text-purple-800 mb-2">Full Transcript</h4>
                                                        <div className="max-h-40 overflow-y-auto text-sm text-purple-700 whitespace-pre-line">
                                                            {result.whisper_transcript}
                                                        </div>
                                                    </div>
                                                )}

                                                {result.ai_analysis?.constitutional_analysis && (
                                                    <div className="p-4 bg-red-50 rounded-lg">
                                                        <h4 className="font-semibold text-red-800 mb-2">Constitutional Analysis</h4>
                                                        <div className="text-sm text-red-700 whitespace-pre-line">
                                                            {result.ai_analysis.constitutional_analysis}
                                                        </div>
                                                    </div>
                                                )}

                                                {result.quota_issue && (
                                                    <div className="p-4 bg-orange-50 rounded-lg">
                                                        <h4 className="font-semibold text-orange-800 mb-2">OpenAI Quota Limit Reached</h4>
                                                        <p className="text-sm text-orange-700 whitespace-pre-line">
                                                            {/* Display the general summary message */}
                                                            {result.ai_summary}
                                                            {/* If it's audio and has specific recommendations, add them */}
                                                            {result.document_type === 'audio_evidence' && result.ai_analysis?.recommendations && (
                                                                <>
                                                                    <br /><br />
                                                                    <strong>Recommendations:</strong> {result.ai_analysis.recommendations}
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                                {!result.error && !result.quota_issue && result.ai_analysis && (
                                                    <>
                                                        {result.ai_analysis.critical_analysis?.procedural_violations?.length > 0 && (
                                                            <div className="p-3 bg-red-50 rounded-lg">
                                                                <h4 className="font-semibold text-red-800 mb-2">
                                                                    Constitutional Violations Found
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {result.ai_analysis.critical_analysis.procedural_violations.map((violation, i) => (
                                                                        <div key={i} className="text-sm">
                                                                            <div className="font-medium text-red-700">{violation.violation_type}</div>
                                                                            <div className="text-red-600">{violation.evidence_of_violation}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* Display identified_violations for video */}
                                                        {result.ai_analysis.identified_violations?.length > 0 && (
                                                            <div className="p-3 bg-red-50 rounded-lg">
                                                                <h4 className="font-semibold text-red-800 mb-2">
                                                                    Identified Violations
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {result.ai_analysis.identified_violations.map((violation, i) => (
                                                                        <div key={i} className="text-sm">
                                                                            <div className="font-medium text-red-700">{violation.violation_type} at {violation.timestamp_of_violation}</div>
                                                                            <div className="text-red-600">{violation.supporting_evidence}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {result.ai_analysis.key_events && (
                                                            <div>
                                                                <h4 className="font-semibold mb-2">Key Events (Video)</h4>
                                                                <div className="space-y-1 text-sm">
                                                                    {result.ai_analysis.key_events.slice(0, 5).map((event, i) => (
                                                                        <div key={i}>
                                                                            <span className="font-medium">{event.timestamp}:</span> {event.description}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {result.ai_analysis.key_entities && (
                                                            <div>
                                                                <h4 className="font-semibold mb-2">Key Information</h4>
                                                                <div className="grid grid-cols-1 gap-2 text-sm">
                                                                    {result.ai_analysis.key_entities.people?.length > 0 && (
                                                                        <div>
                                                                            <span className="font-medium">People:</span> {result.ai_analysis.key_entities.people.map(p => p.name).join(', ')}
                                                                        </div>
                                                                    )}
                                                                    {result.ai_analysis.key_entities.dates?.length > 0 && (
                                                                        <div>
                                                                            <span className="font-medium">Dates:</span> {result.ai_analysis.key_entities.dates.map(d => d.date).join(', ')}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </SubscriptionGate>
            </div>
        </div>
    );
}