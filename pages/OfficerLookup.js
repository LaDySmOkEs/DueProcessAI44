import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, User, Landmark, Building } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockOfficerData = {
  name: "John Doe",
  badgeNumber: "12345",
  department: "Anytown Police Department",
  rank: "Officer",
  yearsOfService: 8,
  complaintHistory: [
    { id: 1, date: "2022-05-10", allegation: "Excessive Force", status: "Not Sustained" },
    { id: 2, date: "2021-11-20", allegation: "Discourtesy", status: "Sustained" },
    { id: 3, date: "2020-01-15", allegation: "Improper Search", status: "Unfounded" },
  ],
  commendations: 2,
};

export default function OfficerLookup() {
  const [officerName, setOfficerName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [officerData, setOfficerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!officerName && !badgeNumber) return;
    setIsLoading(true);
    // In a real app, this would call an API to a public records database
    setTimeout(() => {
      setOfficerData(mockOfficerData);
      setIsLoading(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sustained': return 'bg-red-100 text-red-800';
      case 'Not Sustained': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Officer Background Check</h1>
              <p className="text-slate-600 mt-1">Search public records and complaint histories for law enforcement officers.</p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle>Search Officer Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Officer Name" value={officerName} onChange={e => setOfficerName(e.target.value)} />
              <Input placeholder="Badge Number" value={badgeNumber} onChange={e => setBadgeNumber(e.target.value)} />
            </div>
            <Input placeholder="Department (e.g., Anytown Police Department)" value={department} onChange={e => setDepartment(e.target.value)} />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : <><Search className="w-4 h-4 mr-2" /> Search Public Records</>}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {officerData && !isLoading && (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl">{officerData.name}</CardTitle>
              <p className="text-slate-600">{officerData.rank} • Badge #{officerData.badgeNumber}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><Building className="w-5 h-5 text-slate-500" /><span>{officerData.department}</span></div>
                <div className="flex items-center gap-2"><Landmark className="w-5 h-5 text-slate-500" /><span>Years of Service: {officerData.yearsOfService}</span></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Complaint History ({officerData.complaintHistory.length})</h3>
                <div className="space-y-2">
                  {officerData.complaintHistory.map(complaint => (
                    <div key={complaint.id} className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{complaint.allegation}</p>
                        <p className="text-sm text-slate-500">{complaint.date}</p>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
               <div>
                <h3 className="font-semibold text-lg">Commendations: {officerData.commendations}</h3>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}