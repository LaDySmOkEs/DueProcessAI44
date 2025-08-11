import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DueProcessViolation } from "@/entities/all";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Loader2 } from 'lucide-react';

const violationTypes = [
    { value: "unlawful_search", label: "Unlawful Search" },
    { value: "excessive_force", label: "Excessive Force" },
    { value: "false_arrest", label: "False Arrest" },
    { value: "miranda_violation", label: "Miranda Violation" },
    { value: "malicious_prosecution", label: "Malicious Prosecution" },
    { value: "due_process_denial", label: "Due Process Denial" },
    { value: "other", label: "Other" }
];

const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function SubmitViolation() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const { toast } = useToast();

    const consentToContact = watch("consent_to_contact", false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await DueProcessViolation.create(data);
            
            toast({
                title: "Violation Report Submitted",
                description: "Your report has been securely recorded and will be reviewed for potential class action opportunities.",
            });

            // Reset form or redirect
            window.location.reload();
        } catch (error) {
            console.error("Error submitting violation:", error);
            toast({
                title: "Submission Failed",
                description: "Failed to submit violation report. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
 
