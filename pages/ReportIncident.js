
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PoliceInteraction } from "@/entities/all";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Shield, Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileSignature, CheckCircle } from 'lucide-react';

const severityMap = {
    minor: { label: "Minor", class: "bg-green-100 text-green-800" },
    moderate: { label: "Moderate", class: "bg-yellow-100 text-yellow-800" },
    serious: { label: "Serious", class: "bg-orange-100 text-orange-800" },
    severe: { label: "Severe", class: "bg-red-100 text-red-800" }
};

const rightsViolationOptions = [
    { value: "unreasonable_search", label: "Unreasonable Search" },
    { value: "excessive_force", label: "Excessive Force" },
    { value: "illegal_detention", label: "Illegal Detention" },
    { value: "miranda_violation", label: "Miranda Violation" },
    { value: "discrimination", label: "Discrimination" },
    { value: "other", label: "Other" }
];

export default function ReportIncident() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [newIncidentId, setNewIncidentId] = useState(null);
    const [selectedViolations, setSelectedViolations] = useState([]);
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm();
    const { toast } = useToast();

    const handleViolationToggle = (violation) => {
        const newViolations = selectedViolations.includes(violation)
            ? selectedViolations.filter(v => v !== violation)
            : [...selectedViolations, violation];
        setSelectedViolations(newViolations);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const interactionData = {
                ...data,
                rights_violations: selectedViolations
            };

            const newIncident = await PoliceInteraction.create(interactionData);
            
            toast({
                title: "Incident Reported",
                description: "Your police interaction has been documented and saved securely.",
            });
            
            setNewIncidentId(newIncident.id);
            setSubmissionSuccess(true);
 
