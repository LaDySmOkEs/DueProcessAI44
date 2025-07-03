import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Search, AlertTriangle, FileText, TrendingUp } from 'lucide-react';

// Mock judicial data
const mockJudges = [
  {
    name: 'Judge Sarah Williams',
    court: 'Superior Court of Justice',
    appointedBy: 'Governor Smith (2018)',
    rulingHistory: 'Generally fair, some controversial decisions',
    complaintsCount: 3,
    reversalRate: '12%'
  },
  {
    name: 'Judge Robert Chen',
    court: 'District Court',
    appointedBy: 'Elected (2020)',
    rulingHistory: 'Pro-prosecution bias noted',
    complaintsCount: 7,
    reversalRate: '28%'
  }
];

export default function JudicialAccountability() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [complaintType, setComplaintType] = useState('');

  const handleSearch = () => {
    // Simulate search
    setSelectedJudge(mockJudges[0]);
  };

  const handleSubmitComplaint = () => {
    // Handle complaint submission
    alert('Complaint submitted for review');
    setComplaintText('');
    setComplaintType('');
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
              <Gavel className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Judicial Accountability Center</h1>
              <p className="text-slate-600 mt-1">Research judges, track patterns, and hold the judiciary accountable.</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="research" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="research">Judge Research</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
            <TabsTrigger value="complaints">File Complaint</TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="space-y-6">
            {/* Judge Search */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Judge Research Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter judge name, court, or case number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Judge Profile */}
            {selectedJudge && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedJudge.name}
                    <Badge variant="outline">{selectedJudge.court}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Background</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong>Appointed by:</strong> {selectedJudge.appointedBy}
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>Court:</strong> {selectedJudge.court}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Performance Metrics</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      <strong>Reversal Rate:</strong> {selectedJudge.reversalRate}
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>Complaints Filed:</strong> {selectedJudge.complaintsCount}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Ruling History Analysis</h4>
                    <p className="text-sm text-slate-600">{selectedJudge.rulingHistory}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Bias Pattern Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Pattern Analysis Coming Soon</h3>
                  <p className="text-slate-600">AI-powered analysis will identify judicial bias patterns across cases and demographics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  File Judicial Complaint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Complaint Type</label>
                  <Select value={complaintType} onValueChange={setComplaintType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complaint type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bias">Judicial Bias</SelectItem>
                      <SelectItem value="misconduct">Judicial Misconduct</SelectItem>
                      <SelectItem value="ethics">Ethics Violation</SelectItem>
                      <SelectItem value="procedure">Procedural Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Complaint Details</label>
                  <Textarea
                    placeholder="Provide detailed information about the judicial misconduct or bias..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    rows={6}
                  />
                </div>
                
                <Button onClick={handleSubmitComplaint} className="w-full">
                  Submit Complaint
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}