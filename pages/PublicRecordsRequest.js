
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FOIARequest } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Plus, Clock, CheckCircle, AlertTriangle, Loader2, FileSearch, Building } from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function PublicRecordsRequest() {
    const [requests, setRequests] = useState([]);
    const [showBuilder, setShowBuilder] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm();
    const { toast } = useToast();

    const watchSubject = watch("request_subject", "");
    const watchDescription = watch("request_description", "");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await FOIARequest.list("-date_submitted");
            setRequests(data);
        } catch (error) {
            console.error("Error loading FOIA requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateFOIARequest = async () => {
        if (!watchSubject.trim()) {
            toast({
                title: "Missing Information",
                description: "Please provide a subject for your FOIA request first.",
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        try {
            const prompt = `Generate a professional, legally compliant Freedom of Information Act (FOIA) request for the following subject: "${watchSubject}"

The request should:
1. Be formally written and legally appropriate
2. Include specific language invoking FOIA rights
3. Request expedited processing if appropriate
4. Include fee waiver language if applicable
5. Be detailed enough to help the agency identify responsive records
6. Follow proper FOIA formatting conventions

C
