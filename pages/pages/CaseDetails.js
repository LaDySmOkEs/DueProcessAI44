import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LegalCase, AnalyzedDocument, ComplaintTracker, LitigationStrategy } from "@/entities/all";
import { FileText, Scale, Calendar, Users, AlertTriangle, Clock } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800", 
  closed: "bg-slate-100 text-slate-800",
  archived: "bg-slate-100 text-slate-600"
};

export default function CaseDetails() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('id');
  
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      loadCaseData();
    }
  }, [caseId]);

  const loadCaseData = async () => {
    setIsLoading(true);
    try {
      const [caseInfo, docs, comps, strats] = await Promise.all([
        LegalCase.filter({ id: caseId }),
        AnalyzedDocument.filter({ case_id: caseId }),
        ComplaintTracker.filter({ related_case_id: caseId }),
        LitigationStrategy.filter({ case_id: caseId })
      ]);

      setCaseData(caseInfo[0] || null);
      setDocuments(docs);
      setComplaints(comps);
      setStrategies(strats);
    } catch (error) {
      console.error("Error loading case data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!caseId) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Case Selected</h1>
          <p className="text-slate-600 mb-6">Please select a case to view its details.</p>
          <Link to={createPageUrl("CaseManager")}>
            <Button>Return to Case Manager</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-slate-200 rounded"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Case Not Found</h1>
          <p className="text-slate-600 mb-6">The requested case could not be found.</p>
          <Link to={createPageUrl("CaseManager")}>
            <Button>Return to Case Manager</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-slate-800 rounded-xl flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{caseData.case_name}</h1>
                <p className="text-slate-600">Case Details & Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[caseData.status]}>
                {caseData.status}
              </Badge>
              <Badge variant="outline">
                {caseData.case_type.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Case Overview */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Case Information</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div>Case Number: {caseData.case_number || 'Not assigned'}</div>
                    <div>Type: {caseData.case_type.replace('_', ' ')}</div>
                    <div>Created: {format(new Date(caseData.created_date), 'MMM d, yyyy')}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Next Deadline</h3>
                  <div className="text-sm text-slate-600">
                    {caseData.next_deadline ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(caseData.next_deadline), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      'No upcoming deadlines'
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Key Parties</h3>
                  <div className="text-sm text-slate-600">
                    {caseData.key_parties && caseData.key_parties.length > 0 ? (
                      <div className="space-y-1">
                        {caseData.key_parties.slice(0, 3).map((party, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {party}
                          </div>
                        ))}
                        {caseData.key_parties.length > 3 && (
                          <div className="text-xs text-slate-500">
                            +{caseData.key_parties.length - 3} more
                          </div>
                        )}
                      </div>
                    ) : (
                      'No parties listed'
                    )}
                  </div>
                </div>
              </div>
              
              {caseData.description && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Case Description</h3>
                  <p className="text-sm text-slate-700">{caseData.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="complaints" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Complaints ({complaints.length})
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-2">
              <Scale className="w-4 h-4" />
              Strategy ({strategies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            {documents.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Documents</h3>
                  <p className="text-slate-600 mb-4">No documents have been uploaded for this case yet.</p>
                  <Link to={createPageUrl("DocumentAnalyzer")}>
                    <Button>Upload Documents</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-900">{doc.document_name}</h4>
                        <Badge variant="outline">{doc.document_type}</Badge>
                      </div>
                      {doc.analysis_summary && (
                        <p className="text-sm text-slate-600 mb-3">{doc.analysis_summary}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                          Uploaded {format(new Date(doc.created_date), 'MMM d, yyyy')}
                        </div>
                        <Button size="sm" variant="outline">View Analysis</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            {complaints.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Complaints Filed</h3>
                  <p className="text-slate-600 mb-4">No formal complaints have been filed for this case.</p>
                  <Link to={createPageUrl("ComplaintTracker")}>
                    <Button>File Complaint</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {complaints.map((complaint) => (
                  <Card key={complaint.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-900">{complaint.complaint_title}</h4>
                        <Badge variant="outline">{complaint.status}</Badge>
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        Target: {complaint.target_agency}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                          Filed {format(new Date(complaint.date_filed), 'MMM d, yyyy')}
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            {strategies.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <Scale className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Strategy Developed</h3>
                  <p className="text-slate-600 mb-4">No litigation strategy has been created for this case.</p>
                  <Link to={createPageUrl("SelfLitigantCenter")}>
                    <Button>Develop Strategy</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {strategies.map((strategy) => (
                  <Card key={strategy.id} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Case Theory</h4>
                      <p className="text-sm text-slate-700 mb-4">{strategy.case_theory}</p>
                      
                      {strategy.elements_to_prove && strategy.elements_to_prove.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium text-slate-900 mb-2">Elements to Prove</h5>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {strategy.elements_to_prove.map((element, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
                                {element}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                          Created {format(new Date(strategy.created_date), 'MMM d, yyyy')}
                        </div>
                        <Button size="sm" variant="outline">View Full Strategy</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}