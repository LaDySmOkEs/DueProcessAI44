import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, BarChart2, Users, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const mockData = {
  crimeStats: [
    { name: 'Theft', count: 120 },
    { name: 'Assault', count: 45 },
    { name: 'Vandalism', count: 78 },
    { name: 'Traffic', count: 210 },
  ],
  demographics: {
    population: '45,000',
    medianIncome: '$62,000',
    diversityIndex: '65%',
  },
  incidentHotspots: [
    'Main St & 4th Ave',
    'Oak Park',
    'Downtown Plaza'
  ]
};

export default function LocationIntelligence() {
  const [location, setLocation] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!location.trim()) return;
    setIsLoading(true);
    // In a real app, this would be an API call.
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-slate-800 rounded-xl flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Location Intelligence</h1>
              <p className="text-slate-600 mt-1">Analyze crime statistics, demographics, and incident patterns for any location.</p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <Card className="border-0 shadow-lg bg-white mb-8">
          <CardHeader>
            <CardTitle>Search Location</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              placeholder="Enter address, city, or zip code..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : <><Search className="w-4 h-4 mr-2" /> Search</>}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading && (
            <div className="text-center">
                <p>Loading intelligence report...</p>
            </div>
        )}
        
        {data && !isLoading && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Intelligence Report for: <span className="text-indigo-600">{location}</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Crime Stats */}
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600" />Crime Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.crimeStats}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Demographics */}
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-indigo-600" />Demographics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-lg">
                        <p><strong>Population:</strong> {data.demographics.population}</p>
                        <p><strong>Median Income:</strong> {data.demographics.medianIncome}</p>
                        <p><strong>Diversity Index:</strong> {data.demographics.diversityIndex}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Incident Hotspots */}
            <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-600" />Incident Hotspots</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                        {data.incidentHotspots.map((spot, i) => <li key={i}>{spot}</li>)}
                    </ul>
                </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
}