import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Globe, Camera, Clock, Shield, Download } from 'lucide-react';

// Mock preserved evidence
const mockEvidence = [
  {
    id: 1,
    type: 'webpage',
    url: 'https://example-news.com/police-incident',
    title: 'News Article: Police Incident Report',
    preservedAt: '2024-01-15T10:30:00Z',
    hash: 'sha256:abc123...',
    status: 'preserved'
  },
  {
    id: 2,
    type: 'social_media',
    url: 'https://twitter.com/example/status/123',
    title: 'Twitter Post - Officer Statement',
    preservedAt: '2024-01-14T15:45:00Z',
    hash: 'sha256:def456...',
    status: 'preserved'
  }
];

export default function EvidencePreservation() {
  const [urlToPreserve, setUrlToPreserve] = useState('');
  const [description, setDescription] = useState('');
  const [preservedItems, setPreservedItems] = useState(mockEvidence);
  const [isPreserving, setIsPreserving] = useState(false);

  const handlePreserveUrl = async () => {
    if (!urlToPreserve.trim()) return;
    
    setIsPreserving(true);
    
    // Simulate preservation process
    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        type: 'webpage',
        url: urlToPreserve,
        title: description || 'Preserved Web Content',
        preservedAt: new Date().toISOString(),
        hash: `sha256:${Math.random().toString(36).substring(2, 15)}`,
        status: 'preserved'
      };
      
      setPreservedItems(prev => [newItem, ...prev]);
      setUrlToPreserve('');
      setDescription('');
      setIsPreserving(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Archive className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Evidence Preservation Suite</h1>
              <p className="text-slate-600 mt-1">Securely archive digital evidence with cryptographic timestamps.</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="preserve" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="preserve">Preserve Evidence</TabsTrigger>
            <TabsTrigger value="archived">Archived Items</TabsTrigger>
            <TabsTrigger value="verify">Verify Integrity</TabsTrigger>
          </TabsList>

          <TabsContent value="preserve" className="space-y-6">
            {/* URL Preservation */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  Preserve Web Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL to Preserve *</label>
                  <Input
                    placeholder="https://example.com/important-evidence"
                    value={urlToPreserve}
                    onChange={(e) => setUrlToPreserve(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Brief description of this evidence and why it's important..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button onClick={handlePreserveUrl} disabled={isPreserving} className="w-full">
                  {isPreserving ? 'Preserving...' : <><Archive className="w-4 h-4 mr-2" />Preserve Content</>}
                </Button>
                
                <div className="text-xs text-slate-500 space-y-1">
                  <p>• Content will be archived with a cryptographic timestamp</p>
                  <p>• Screenshots and full HTML source will be captured</p>
                  <p>• Legal-grade chain of custody will be maintained</p>
                </div>
              </CardContent>
            </Card>

            {/* File Upload Preservation */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  Preserve Local Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Drag and drop files here or click to browse</p>
                  <input type="file" multiple className="hidden" />
                  <Button variant="outline">Select Files</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <div className="space-y-4">
              {preservedItems.map((item) => (
                <Card key={item.id} className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.url}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Preserved: {new Date(item.preservedAt).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Hash: {item.hash.substring(0, 20)}...
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          {item.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verify" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Verify Evidence Integrity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Evidence Hash</label>
                  <Input placeholder="Enter SHA-256 hash to verify..." />
                </div>
                
                <Button className="w-full" variant="outline">
                  Verify Integrity
                </Button>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Chain of Custody Features:</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Cryptographic timestamps prove when evidence was captured</li>
                    <li>• Hash verification ensures content hasn't been altered</li>
                    <li>• Legal-grade preservation standards maintained</li>
                    <li>• Export functionality for court submissions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}