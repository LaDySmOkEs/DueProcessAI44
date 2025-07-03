import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Archive, Link, Loader2, CheckCircle, FileText } from 'lucide-react';

// This would interact with a backend function
// For demonstration, we'll simulate the process
const archiveUrl = async (url) => {
  console.log(`Archiving ${url}`);
  await new Promise(res => setTimeout(res, 2000));
  return { 
    success: true, 
    archivedUrl: `https://archive.example.com/${new Date().getTime()}/${url.replace(/https?:\/\//, '')}`,
    timestamp: new Date().toISOString() 
  };
};

export default function EvidencePreservation() {
  const [urlToArchive, setUrlToArchive] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);
  const [archivedItems, setArchivedItems] = useState([]);
  const { toast } = useToast();

  const handleArchive = async () => {
    if (!urlToArchive.startsWith('http')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }
    
    setIsArchiving(true);
    try {
      const result = await archiveUrl(urlToArchive);
      if (result.success) {
        setArchivedItems(prev => [{ original: urlToArchive, ...result }, ...prev]);
        setUrlToArchive('');
        toast({
          title: "URL Archived",
          description: "A permanent, timestamped copy has been created.",
        });
      } else {
        throw new Error("Archiving failed");
      }
    } catch (error) {
      toast({
        title: "Archiving Failed",
        description: "Could not create an archive of the URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Archive className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Evidence Preservation Suite</h1>
              <p className="text-slate-600 mt-1">Create permanent, timestamped archives of online evidence.</p>
            </div>
          </div>
        </div>

        {/* Archiving Tool */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Archive a Webpage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                type="url"
                placeholder="https://example.com/evidence_page"
                value={urlToArchive}
                onChange={e => setUrlToArchive(e.target.value)}
                disabled={isArchiving}
              />
              <Button onClick={handleArchive} disabled={isArchiving || !urlToArchive}>
                {isArchiving ? <Loader2 className="animate-spin" /> : 'Archive'}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">This creates a snapshot of the page content as it exists right now.</p>
          </CardContent>
        </Card>
        
        {/* Archived Items List */}
        <div className="space-y-4">
           <h2 className="text-xl font-bold text-slate-900">My Archived Evidence</h2>
          {archivedItems.length === 0 ? (
            <Card className="text-center p-8 border-dashed">
              <FileText className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500">Your archived webpages will appear here.</p>
            </Card>
          ) : (
            archivedItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-md bg-white">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-800 truncate">{item.original}</p>
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> 
                      Archived on {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <a href__={item.archivedUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">View Archive</Button>
                  </a>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}