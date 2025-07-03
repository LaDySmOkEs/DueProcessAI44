import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { FileSignature, Loader2, Shield } from 'lucide-react';
import { InvokeLLM } from "@/integrations/Core";

export default function CivilRightsComplaintBuilder() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { toast } = useToast();

    const onSubmit = async (data) => {
        setIsGenerating(true);
        setGeneratedText('');

        try {
            const prompt = `
Generate a formal civil rights complaint under 42 U.S.C. § 1983 based on the following information. Structure it with clear sections for Parties, Jurisdiction, Statement of Facts, Causes of Action, and Prayer for Relief.

**Plaintiff Information:**
Name: ${data.plaintiff_name}
Address: ${data.plaintiff_address}

**Defendant Information:**
Name(s): ${data.defendant_names}
Agency: ${data.defendant_agency}

**Incident Details:**
Date: ${data.incident_date}
Location: ${data.incident_location}
Description: ${data.incident_description}

**Constitutional Violations (check all that apply):**
${data.fourth_amendment ? "- Fourth Amendment (Unreasonable Search/Seizure)" : ""}
${data.first_amendment ? "- First Amendment (Freedom of Speech/Assembly)" : ""}
${data.fourteenth_amendment ? "- Fourteenth Amendment (Due Process/Equal Protection)" : ""}
${data.excessive_force ? "- Excessive Force" : ""}
Other: ${data.other_violations || 'N/A'}

**Requested Relief:**
${data.compensatory_damages ? "- Compensatory Damages" : ""}
${data.punitive_damages ? "- Punitive Damages" : ""}
${data.injunctive_relief ? `- Injunctive Relief (Details: ${data.injunctive_relief_details || 'N/A'})` : ""}
`;

            const result = await InvokeLLM({ prompt });
            setGeneratedText(result);
            toast({
                title: "Complaint Drafted",
                description: "Your civil rights complaint has been generated. Please review carefully."
            });
        } catch (error) {
            console.error("Error generating complaint:", error);
            toast({
                title: "Generation Failed",
                description: "Failed to generate the complaint. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-800 rounded-xl flex items-center justify-center">
                            <FileSignature className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Civil Rights Complaint Builder</h1>
                            <p className="text-slate-600 mt-1">Generate a formal complaint for constitutional violations.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Input */}
                    <Card className="border-0 shadow-lg bg-white">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle>Complaint Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <h3 className="font-semibold">Plaintiff Information</h3>
                                <div>
                                    <Label htmlFor="plaintiff_name">Your Full Name</Label>
                                    <Input id="plaintiff_name" {...register("plaintiff_name", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="plaintiff_address">Your Address</Label>
                                    <Input id="plaintiff_address" {...register("plaintiff_address", { required: true })} />
                                </div>

                                <h3 className="font-semibold pt-4 border-t">Defendant Information</h3>
                                <div>
                                    <Label htmlFor="defendant_names">Officer/Official Name(s)</Label>
                                    <Input id="defendant_names" placeholder="If known, otherwise 'John/Jane Doe'" {...register("defendant_names", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="defendant_agency">Government Agency</Label>
                                    <Input id="defendant_agency" placeholder="e.g., Anytown Police Department" {...register("defendant_agency", { required: true })} />
                                </div>

                                <h3 className="font-semibold pt-4 border-t">Incident Details</h3>
                                <div>
                                    <Label htmlFor="incident_date">Date of Incident</Label>
                                    <Input id="incident_date" type="date" {...register("incident_date", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="incident_location">Location of Incident</Label>
                                    <Input id="incident_location" {...register("incident_location", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="incident_description">Detailed Description</Label>
                                    <Textarea id="incident_description" className="h-24" {...register("incident_description", { required: true })} />
                                </div>

                                <h3 className="font-semibold pt-4 border-t">Violations & Relief</h3>
                                <div className="space-y-2">
                                    <Label>Alleged Constitutional Violations</Label>
                                    <div className="flex items-center space-x-2"><Checkbox id="fourth_amendment" {...register("fourth_amendment")} /><Label htmlFor="fourth_amendment">4th Amendment (Search/Seizure)</Label></div>
                                    <div className="flex items-center space-x-2"><Checkbox id="first_amendment" {...register("first_amendment")} /><Label htmlFor="first_amendment">1st Amendment (Speech/Assembly)</Label></div>
                                    <div className="flex items-center space-x-2"><Checkbox id="fourteenth_amendment" {...register("fourteenth_amendment")} /><Label htmlFor="fourteenth_amendment">14th Amendment (Due Process)</Label></div>
                                    <div className="flex items-center space-x-2"><Checkbox id="excessive_force" {...register("excessive_force")} /><Label htmlFor="excessive_force">Excessive Force</Label></div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Requested Relief</Label>
                                    <div className="flex items-center space-x-2"><Checkbox id="compensatory_damages" {...register("compensatory_damages")} /><Label htmlFor="compensatory_damages">Compensatory Damages</Label></div>
                                    <div className="flex items-center space-x-2"><Checkbox id="punitive_damages" {...register("punitive_damages")} /><Label htmlFor="punitive_damages">Punitive Damages</Label></div>
                                    <div className="flex items-center space-x-2"><Checkbox id="injunctive_relief" {...register("injunctive_relief")} /><Label htmlFor="injunctive_relief">Injunctive Relief</Label></div>
                                    <Input id="injunctive_relief_details" placeholder="Details for injunctive relief..." {...register("injunctive_relief_details")} />
                                </div>

                                <Button type="submit" className="w-full" disabled={isGenerating}>
                                    {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : 'Generate Complaint'}
                                </Button>
                            </CardContent>
                        </form>
                    </Card>

                    {/* Generated Document */}
                    <Card className="border-0 shadow-lg bg-white">
                        <CardHeader>
                            <CardTitle>Generated Complaint</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={generatedText || "Your generated complaint will appear here. Review carefully with legal counsel."}
                                className="h-96 whitespace-pre-wrap"
                            />
                            <Button className="mt-4" disabled={!generatedText} onClick={() => navigator.clipboard.writeText(generatedText)}>
                                Copy to Clipboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}