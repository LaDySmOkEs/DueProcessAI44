import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Users, AlertTriangle, ExternalLink } from 'lucide-react';

// Mock data for demonstration
const mockProfiles = [
  {
    platform: 'Twitter',
    handle: '@johndoe123',
    verified: false,
    followers: '1.2K',
    posts: '450',
    summary: 'Public profile with frequent political commentary.'
  },
  {
    platform: 'LinkedIn',
    handle: 'john-doe-officer',
    verified: true,
    connections: '500+',
    company: 'Metropolitan Police Dept',
    summary: 'Professional profile showing employment history.'
  }
];

export default function SocialMediaInvestigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults(mockProfiles);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Social Media Investigation</h1>
              <p className="text-slate-600 mt-1">Research public social media profiles for background information.</p>
            </div>
          </div>
          
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Legal Notice:</strong> Only search publicly available information. Do not attempt to access private accounts or engage in harassment.
            </AlertDescription>
          </Alert>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle>Search Public Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter name, username, or other identifier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : <><Search className="w-4 h-4 mr-2" />Search</>}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              This tool searches across multiple social media platforms for publicly available profiles and information.
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Search Results for "{searchQuery}"</h2>
            {results.map((profile, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      {profile.platform}
                      {profile.verified && <span className="text-blue-500">✓</span>}
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                  <p className="text-slate-600">{profile.handle}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {profile.followers && <div><strong>Followers:</strong> {profile.followers}</div>}
                    {profile.connections && <div><strong>Connections:</strong> {profile.connections}</div>}
                    {profile.posts && <div><strong>Posts:</strong> {profile.posts}</div>}
                    {profile.company && <div><strong>Company:</strong> {profile.company}</div>}
                  </div>
                  <p className="text-sm text-slate-700">{profile.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}