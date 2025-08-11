import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScanText, Upload, Loader2, Camera, AlertCircle, X, FileText, Plus, ChevronDown, FileSignature } from "lucide-react";
import { InvokeLLM, UploadFile } from "@/integrations/Core";
import { AnalyzedDocument, DocumentCollection, LegalCase } from "@/entities/all";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionGate from "../components/subscription/SubscriptionGate";
import { User } from "@/entities/User";
import { analyzeAudio } from "@/functions/analyzeAudio";
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB for videos and audio
const MAX_FILES = 10;

const AI_DOCUMENT_TYPES = [
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv', 'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const AI_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

const AI_AUDIO_TYPES = ['audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/m4a'];

const comprehensiveAnalysisSchema = {
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
                },
                contractual_analysis: {
                    type: "object",
                    properties: {
                        is_contract: { type: "boolean", description: "Whether the document is determined to be a legally binding contract." },
                        contract_type: { type: "string", description: "The type of contract (e.g., Service Agreement, Lease, NDA)." },
                        key_obligations: {
                            type: "array",
                            items: { type: "object", properties: { party: { type: "string" }, obligation: { type: "string", description: "A key duty or promise." } } }
                        },
                        potential_breaches: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    breaching_party: { type: "string" },
                                    breached_obligation: { type: "string" },
                                    evidence_from_document: { type: "string" },
                                    potential_impact: { type: "string" }
                                }
                            }
                        },
                        remedies_or_penalties: { type: "string", description: "Penalties or remedies specified in the contract for a breach." }
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
 
