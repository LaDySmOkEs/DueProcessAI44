import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { LegalCase } from "@/entities/all";
import { Loader2, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CreateCase() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { toast } = useToast();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const newCase = await LegalCase.create(data);
            toast({
                title: "Case Created Successfully",
                description: `Case "${newCase.case_name}" has been added to your manager.`,
            });
            navigate(createPageUrl("CaseManager"));
        } catch (error) {
            console.error("Error creating case:", error);
            toast({
                title: "Creation Failed",
                description: "Failed to create the case. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto">
                <Card className="border-0 shadow-lg bg-white">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-800 rounded-xl flex items-center justify-center">
                                    <FolderPlus className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-slate-900">Create New Legal Case</CardTitle>
                                    <p className="text-slate-600 mt-1">Start a new file to organize documents and strategy.</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="case_name">Case Name *</Label>
                                <Input 
                                    id="case_name" 
                                    placeholder="e.g., State v. John Doe, Smith v. Anytown PD"
                                    {...register("case_name", { required: "Case name is required" })}
                                />
                                {errors.case_name && <p className="text-red-500 text-xs mt-1">{errors.case_name.message}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="case_type">Case Type *</Label>
                                <Select onValueChange={(value) => setValue("case_type", value, { shouldValidate: true })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the area of law" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="civil_rights">Civil Rights</SelectItem>
                                        <SelectItem value="criminal_defense">Criminal Defense</SelectItem>
                                        <SelectItem value="family_law">Family Law</SelectItem>
                                        <SelectItem value="personal_injury">Personal Injury</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.case_type && <p className="text-red-500 text-xs mt-1">Case type is required</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="case_number">Case Number</Label>
                                    <Input 
                                        id="case_number" 
                                        placeholder="Optional official case number"
                                        {...register("case_number")}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="next_deadline">Next Important Deadline</Label>
                                    <Input 
                                        id="next_deadline" 
                                        type="date"
                                        {...register("next_deadline")}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Case Description</Label>
                                <Textarea 
                                    id="description" 
                                    placeholder="Briefly summarize the case facts and legal issues."
                                    className="h-24"
                                    {...register("description")}
                                />
                            </div>
                             <div>
                                <Label htmlFor="key_parties">Key Parties (comma-separated)</Label>
                                <Input 
                                    id="key_parties" 
                                    placeholder="e.g., John Doe, Jane Smith, Anytown Police Dept."
                                    {...register("key_parties", {
                                        setValueAs: v => v ? v.split(',').map(s => s.trim()) : []
                                    })}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Case...</>
                                ) : (
                                    "Create Case File"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}