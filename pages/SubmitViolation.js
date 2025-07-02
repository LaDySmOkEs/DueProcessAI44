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
        <div className="p-6 space-y-8">
            <div className="max-w-4xl mx-auto">
                <Card className="border-0 shadow-lg bg-white">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Submit a Due Process Violation Report</CardTitle>
                            <p className="text-slate-600 mt-2">Your story is a crucial piece of evidence in the fight for accountability.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="violation_type">Violation Type *</Label>
                                <Select onValueChange={(value) => setValue("violation_type", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the primary violation type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {violationTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.violation_type && <p className="text-red-500 text-xs mt-1">Violation type is required</p>}
                            </div>

                            <div>
                                <Label htmlFor="agency_involved">Agency Involved *</Label>
                                <Input 
                                    id="agency_involved" 
                                    placeholder="e.g., NYPD, FBI, City of Los Angeles Police"
                                    {...register("agency_involved", { required: "Agency name is required" })}
                                />
                                {errors.agency_involved && <p className="text-red-500 text-xs mt-1">{errors.agency_involved.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="location_state">State *</Label>
                                    <Select onValueChange={(value) => setValue("location_state", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {usStates.map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.location_state && <p className="text-red-500 text-xs mt-1">State is required</p>}
                                </div>
                                <div>
                                    <Label htmlFor="location_city">City *</Label>
                                    <Input 
                                        id="location_city" 
                                        placeholder="City or town where incident occurred"
                                        {...register("location_city", { required: "City is required" })}
                                    />
                                    {errors.location_city && <p className="text-red-500 text-xs mt-1">{errors.location_city.message}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="incident_date">Incident Date *</Label>
                                <Input 
                                    id="incident_date" 
                                    type="date"
                                    {...register("incident_date", { required: "Incident date is required" })}
                                />
                                {errors.incident_date && <p className="text-red-500 text-xs mt-1">{errors.incident_date.message}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="incident_description">Detailed Description *</Label>
                                <Textarea 
                                    id="incident_description" 
                                    placeholder="Provide a detailed, factual account of what happened. Include dates, times, locations, and specific actions taken by officials."
                                    className="h-32"
                                    {...register("incident_description", { required: "Description is required" })}
                                />
                                {errors.incident_description && <p className="text-red-500 text-xs mt-1">{errors.incident_description.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="contact_email">Contact Email *</Label>
                                <Input 
                                    id="contact_email" 
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...register("contact_email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email.message}</p>}
                            </div>
                            
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="consent_to_contact"
                                    {...register("consent_to_contact")}
                                />
                                <Label htmlFor="consent_to_contact" className="text-sm leading-relaxed">
                                    I consent to being contacted by verified legal professionals if my case matches a potential class action lawsuit or if additional information is needed to pursue accountability.
                                </Label>
                            </div>

                            <Alert className="bg-blue-50 border-blue-200">
                                <ShieldCheck className="h-4 w-4 text-blue-600" />
                                <AlertTitle className="text-blue-900">Your Privacy is Paramount</AlertTitle>
                                <AlertDescription className="text-blue-800 text-xs">
                                    Your contact information will never be made public. It is stored securely and will only be shared with verified legal professionals if you consent and a potential class action matching your case emerges.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting Report...
                                    </>
                                ) : (
                                    "Submit Secure Report"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}