import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, User, Building } from 'lucide-react';

// Mock search results
const mockResults = [
  { type: 'court_document', title: 'Case #12345: State vs. John Smith', summary: 'Motion to dismiss filed on 2023-01-15.', source: 'County Court Records' },
  { type: 'property_record', title: '123 Main St, Anytown', summary: 'Owner: Jane Doe. Last sold: 2018.', source: 'County Assessor' },
  { type: 'business_license', title: 'Anytown Bistro LLC', summary: 'License active, expires 2024-12-31.', source: 'State Business Registry' },
];

export default function PublicRecordsSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsLoading(true);
    // In a real application, this would call multiple public records APIs
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };
  
  const getIcon = (type) => {
      switch(type) {
          case 'court_document': return <FileText className="w-5 h-5 text-red-600"/>;
          case 'property_record': return <Building className="w-5 h-5 text-blue-600"/>;
          case 'business_license': return <User className="w-5 h-5 text-green-600"/>;
          default: return <FileText className="w-5 h-5"/>;
      }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-slate-800 rounded-xl flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Public Records Search</h1>
              <p className="text-slate-600 mt-1">Access a nationwide database of public records.</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle>Enter Your Search Query</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              placeholder="Search by name, address, case number, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && !isLoading && (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle>Search Results for "{query}"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, i) => (
                <div key={i} className="p-4 border rounded-lg flex gap-4 items-start">
                    <div>{getIcon(result.type)}</div>
                    <div>
                        <h3 className="font-semibold">{result.title}</h3>
                        <p className="text-sm text-slate-600">{result.summary}</p>
                        <p className="text-xs text-slate-500 mt-1">Source: {result.source}</p>
                    </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}