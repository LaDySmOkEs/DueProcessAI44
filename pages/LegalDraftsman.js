
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileSignature, Shield, MailWarning, FileText, Scale, BrainCircuit, Search, Gavel, Users, Info } from 'lucide-react'; // Kept original icons and added new ones
import { Link } from "react-router-dom"; // Still needed for createPageUrl, even if not directly used in new flow
import { createPageUrl } from "@/utils"; // Still needed for createPageUrl
import SmartDocumentSuggestions from '../components/legal/SmartDocumentSuggestions';
import DocumentGenerator from '../components/legal/DocumentGenerator';
import SubscriptionGate from '../components/subscription/SubscriptionGate';
import { AnalyzedDocument, PoliceInteraction } from "@/entities/all"; // Import entities
import { useToast } from "@/components/ui/use-toast"; // Import useToast

const documentTypes = [
  {
    id: "civil_rights_complaint",
    title: "Civil Rights Complaint (§ 1983)",
    description: "Federal civil rights complaint for constitutional violations by government officials",
    icon: Shield,
    color: "bg-blue-600 hover:bg-blue-700",
    link: "CivilRightsComplaintBuilder",
    featured: true
  },
  {
    id: "breach_of_contract_notice",
    title: "Breach of Contract Notice",
    description: "Formally notify a party that they have violated a contract",
    icon: MailWarning,
    color: "bg-red-600 hover:bg-red-700",
    template: true,
    featured: true
  },
  {
    id: "motion_compel",
    title: "Motion to Compel Discovery",
    description: "Force opposing party to provide withheld information or documents",
    icon: Gavel,
    color: "bg-slate-600 hover:bg-slate-700",
    template: true
  },
  {
    id: "motion_to_dismiss",
    title: "Motion to Dismiss",
    description: "Request the court to dismiss a case due to legal deficiencies",
    icon: Gavel,
    color: "bg-slate-600 hover:bg-slate-700",
    template: true
  },
  {
    id: "discovery_request",
    title: "Discovery Request",
    description: "Formally request evidence and information from the opposing party",
    icon: Search,
    color: "bg-slate-600 hover:bg-slate-700",
    template: true
  },
  {
    id: "affidavit",
    title: "Affidavit of Facts",
    description: "Sworn written statement of facts to support your case",
    icon: FileText,
    color: "bg-green-600 hover:bg-green-700",
    template: true
  },
  {
    id: "cease_desist",
    title: "Cease and Desist Letter",
    description: "Demand someone stop an unlawful activity",
    icon: MailWarning,
    color: "bg-orange-600 hover:bg-orange-700",
    template: true
  },
  {
    id: "summary_judgment",
    title: "Motion for Summary Judgment",
    description: "Request judge rule in your favor without trial",
    icon: Scale,
    color: "bg-purple-600 hover:bg-purple-700",
    template: true
  },
  {
    id: "custody_agreement",
    title: "Custody Agreement",
    description: "Create a formal agreement for child custody arrangements",
    icon: Users,
    color: "bg-teal-600 hover:bg-teal-700",
    template: true
  }
];

export default function LegalDraftsman() {
  const [caseDescription, setCaseDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); // Retained but not explicitly used in rendering for now
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [contextSource, setContextSource] = useState(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sourceDocId = searchParams.get('source_doc_id');
    const sourceIncidentId = searchParams.get('source_incident_id');

    const loadContext = async () => {
      setIsLoadingContext(true);
      try {
        if (sourceDocId) {
          const doc = await AnalyzedDocument.get(sourceDocId);
          setCaseDescription(doc.analysis_summary || "Could not load document summary.");
          setContextSource(`your analysis of "${doc.document_name}"`);
        } else if (sourceIncidentId) {
          const incident = await PoliceInteraction.get(sourceIncidentId);
          setCaseDescription(incident.summary || "Could not load incident summary.");
          setContextSource(`your reported incident from ${new Date(incident.date).toLocaleDateString()}`);
        }
      } catch (error) {
        console.error("Failed to load context:", error);
        toast({
          title: "Failed to Load Context",
          description: "Could not load the source information. Please paste it manually.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingContext(false);
      }
    };

    if (sourceDocId || sourceIncidentId) {
 
