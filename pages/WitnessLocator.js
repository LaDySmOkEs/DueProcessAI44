import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, MapPin, Phone, Mail, Search, Info } from 'lucide-react';

// Mock witness results
const mockWitnesses = [
  {
    name: 'Sarah Johnson',
    location: '2 blocks from incident',
    contact: 'sarah.j@email.com',
    reliability: 'High',
    notes: 'Was walking dog, had clear view of the interaction.'
  },
  {
    name: 'Mike Rodriguez',
    location: 'Across the street',
    contact: '(555) 123-4567',
    reliability: 'Medium',
    notes: 'Heard raised voices, partial view from apartment window.'
  }
];

export default function WitnessLocator() {
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [witnesses, setWitnesses] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!incidentLocation.trim()) return;
    setIsSearching(true);
    
    // Simulate search process
    setTimeout(() => {
      setWitnesses(mockWitnesses);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Witness Locator</h1>
              <p className="text-slate-600 mt-1">Find potential witnesses to your incident using AI-powered analysis.</p>
            </div>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              This tool uses publicly available data and crowdsourced information to help locate potential witnesses. Always verify identity and obtain consent before contacting.
            </AlertDescription>
          </Alert>
        </div>

        {/* Search Form */}
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle>Incident Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Incident Location *</Label>
              <Input
                placeholder="Street address or intersection where incident occurred"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Incident Description</Label>
              <Textarea
                placeholder="Brief description of what happened - this helps identify relevant witnesses"
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : <><Search className="w-4 h-4 mr-2" />Find Witnesses</>}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {witnesses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Potential Witnesses Found</h2>
            
            {witnesses.map((witness, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{witness.name}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      witness.reliability === 'High' ? 'bg-green-100 text-green-800' :
                      witness.reliability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {witness.reliability} Reliability
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{witness.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {witness.contact.includes('@') ? (
                        <Mail className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Phone className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm">{witness.contact}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-4">{witness.notes}</p>
                  <div className="flex gap-2">
                    <Button size="sm">Contact Witness</Button>
                    <Button size="sm" variant="outline">View Full Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}