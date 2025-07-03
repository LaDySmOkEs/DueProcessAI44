import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, FileText, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

export default function CourtAccessCenter() {
  const [filingType, setFilingType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [appealText, setAppealText] = useState('');
  const [filingTitle, setFilingTitle] = useState('');

  const handleSubmitAppeal = () => {
    // Handle appeal submission
    alert('Appeal submitted successfully');
    setAppealText('');
    setRejectionReason('');
    setFilingTitle('');
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-slate-900 rounded-xl flex items-center justify-center">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Court Access Center</h1>
              <p className="text-slate-600 mt-1">Challenge filing rejections and ensure access to justice.</p>
            </div>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Your Right to Court Access:</strong> Courts cannot arbitrarily reject filings. If your filing was rejected, you may have grounds to appeal or challenge the decision.
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="appeal" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="appeal">Appeal Rejection</TabsTrigger>
            <TabsTrigger value="mandamus">Mandamus Action</TabsTrigger>
            <TabsTrigger value="resources">Legal Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="appeal" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Appeal Filing Rejection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Original Filing Title *</label>
                  <Input
                    placeholder="Enter the title of your rejected filing"
                    value={filingTitle}
                    onChange={(e) => setFilingTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Type of Filing *</label>
                  <Select value={filingType} onValueChange={setFilingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motion">Motion</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="petition">Petition</SelectItem>
                      <SelectItem value="appeal">Appeal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Reason for Rejection *</label>
                  <Select value={rejectionReason} onValueChange={setRejectionReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rejection reason given" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formatting">Formatting Issues</SelectItem>
                      <SelectItem value="fees">Filing Fee Issues</SelectItem>
                      <SelectItem value="jurisdiction">Lack of Jurisdiction</SelectItem>
                      <SelectItem value="frivolous">Deemed Frivolous</SelectItem>
                      <SelectItem value="procedural">Procedural Defects</SelectItem>
                      <SelectItem value="other">Other/Unclear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Appeal Arguments *</label>
                  <Textarea
                    placeholder="Explain why the rejection was improper and should be overturned..."
                    value={appealText}
                    onChange={(e) => setAppealText(e.target.value)}
                    rows={8}
                  />
                </div>
                
                <Button onClick={handleSubmitAppeal} className="w-full">
                  Generate Appeal Document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mandamus" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Mandamus Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Mandamus:</strong> A legal action to compel a court or government official to perform their duty when they refuse to do so.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <p className="text-slate-600">
                    If a court is systematically refusing to accept your filings or denying you access to justice, 
                    you may need to file a writ of mandamus to compel them to perform their judicial duties.
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">When to Consider Mandamus:</h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      <li>• Court refuses to accept properly formatted filings</li>
                      <li>• Clerk's office creates unreasonable barriers</li>
                      <li>• Judge refuses to rule on motions</li>
                      <li>• Systematic denial of due process rights</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    Generate Mandamus Petition Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Filing Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Proper formatting and structure</li>
                    <li>• Required signatures and dates</li>
                    <li>• Appropriate filing fees (or fee waiver)</li>
                    <li>• Service of process requirements</li>
                    <li>• Jurisdictional prerequisites</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Right to access the courts</li>
                    <li>• Right to file pro se motions</li>
                    <li>• Right to appeal rejections</li>
                    <li>• Right to indigent fee waivers</li>
                    <li>• Right to due process</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}