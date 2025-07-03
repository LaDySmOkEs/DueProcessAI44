import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PoliceInteraction } from "@/entities/all";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Shield, FileText, Calendar } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

export default function ReportIncident() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await PoliceInteraction.create({
        ...data,
        date: data.date || new Date().toISOString().split('T')[0],
        rights_violations: data.rights_violations || [],
        follow_up_needed: data.follow_up_needed || false,
        complaint_filed: false,
        severity_level: data.severity_level || 'minor'
      });
      
      toast({
        title: "Incident Reported",
        description: "Your police interaction has been documented successfully."
      });
      
      // Reset form or redirect
      window.location.href = '/MyIncidents';
    } catch (error) {
      console.error("Error submitting incident:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to document the incident. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Report Police Incident</h1>
              <p className="text-slate-600 mt-1">Document your interaction for legal protection and accountability.</p>
            </div>
          </div>
          
          <Alert className="bg-amber-50 border-amber-200 mb-6">
            <Shield className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> Document incidents as soon as possible while details are fresh. This information may be crucial for legal proceedings.
            </AlertDescription>
          </Alert>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Date of Incident *</Label>
                <Input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className={errors.date ? "border-red-300" : ""}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
              
              <div>
                <Label>Time of Incident</Label>
                <Input
                  type="time"
                  {...register("time")}
                  placeholder="Approximate time if known"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Location *</Label>
                <Input
                  {...register("location", { required: "Location is required" })}
                  placeholder="Street address, intersection, or general area"
                  className={errors.location ? "border-red-300" : ""}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <Label>Type of Encounter *</Label>
                <Controller
                  name="encounter_type"
                  control={control}
                  rules={{ required: "Encounter type is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.encounter_type ? "border-red-300" : ""}>
                        <SelectValue placeholder="Select encounter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traffic_stop">Traffic Stop</SelectItem>
                        <SelectItem value="pedestrian_stop">Pedestrian Stop</SelectItem>
                        <SelectItem value="home_visit">Home Visit</SelectItem>
                        <SelectItem value="arrest">Arrest</SelectItem>
                        <SelectItem value="questioning">Questioning</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.encounter_type && <p className="text-red-500 text-xs mt-1">{errors.encounter_type.message}</p>}
              </div>

              <div>
                <Label>Severity Level</Label>
                <Controller
                  name="severity_level"
                  control={control}
                  defaultValue="minor"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor Issue</SelectItem>
                        <SelectItem value="moderate">Moderate Concern</SelectItem>
                        <SelectItem value="serious">Serious Violation</SelectItem>
                        <SelectItem value="severe">Severe Violation</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Officer Information */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle>Officer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Officer Name</Label>
                <Input {...register("officer_name")} placeholder="If visible on nameplate or provided" />
              </div>
              
              <div>
                <Label>Badge Number</Label>
                <Input {...register("badge_number")} placeholder="If visible or provided" />
              </div>

              <div className="md:col-span-2">
                <Label>Agency/Department</Label>
                <Input {...register("agency")} placeholder="e.g., Metro Police Department, State Highway Patrol" />
              </div>
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Detailed Summary *</Label>
                <Textarea
                  {...register("summary", { required: "Summary is required" })}
                  placeholder="Provide a detailed, factual account of what happened. Include dialogue, actions taken, and timeline."
                  rows={8}
                  className={errors.summary ? "border-red-300" : ""}
                />
                {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>}
              </div>

              <div>
                <Label>Witnesses</Label>
                <Textarea
                  {...register("witnesses")}
                  placeholder="Names, contact information, or descriptions of witnesses present"
                  rows={3}
                />
              </div>

              <div>
                <Label>Potential Rights Violations</Label>
                <div className="space-y-3 mt-2">
                  {[
                    { value: "unreasonable_search", label: "Unreasonable Search" },
                    { value: "excessive_force", label: "Excessive Force" },
                    { value: "illegal_detention", label: "Illegal Detention" },
                    { value: "miranda_violation", label: "Miranda Rights Violation" },
                    { value: "discrimination", label: "Discrimination" },
                    { value: "other", label: "Other" }
                  ].map((violation) => (
                    <div key={violation.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={violation.value}
                        {...register("rights_violations")}
                        value={violation.value}
                      />
                      <Label htmlFor={violation.value} className="text-sm font-normal">
                        {violation.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="follow_up_needed"
                  {...register("follow_up_needed")}
                />
                <Label htmlFor="follow_up_needed" className="text-sm font-normal">
                  This incident requires follow-up action (complaint, legal consultation, etc.)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 px-8"
            >
              {isSubmitting ? "Documenting..." : "Document Incident"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}