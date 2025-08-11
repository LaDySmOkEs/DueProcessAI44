import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ClassActionPotential, DueProcessViolation } from "@/entities/all";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Scale, Users, FileText, Globe, Map } from 'lucide-react';

// This would be a more complex component in a real app, possibly using react-leaflet
const ViolationMap = () => (
    <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Map className="w-5 h-5 text-red-600" /> National Violation Hotspots</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">National map data would be rendered here.</p>
            </div>
        </CardContent>
    </Card>
);

export default function ClassActionRegistry() {
    const [potentials, setPotentials] = useState([]);
    const [stats, setStats] = useState({ total: 0, by_type: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [potentialData, violationData] = await Promise.all([
                    ClassActionPotential.list("-estimated_class_size"),
                    DueProcessViolation.list()
                ]);
                
                setPotentials(potentialData);

                const counts = violationData.reduce((acc, v) => {
                    acc[v.violation_type] = (acc[v.violation_type] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.entries(counts).map(([name, count]) => ({ name, count }));

                setStats({ total: violationData.length, by_type: chartData });

            } catch (err) {
                console.error("Error fetching registry data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">National Due Process Registry</h1>
                            <p className="text-slate-600 mt-1">Identifying systemic violations to build collective legal action.</p>
                        </div>
                    </div>
                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h2 className="font-semibold text-green-900 mb-2">🆓 Always Free</h2>
                        <p className="text-green-800 text-sm leading-relaxed">
                          This registry is completely free to access and contribute to. Help build a database of constitutional violations to enable class-action lawsuits.
                        </p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Potential Class Actions */}
                        <Card className="border-0 shadow-lg bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-slate-900">Emerging Class Action Investigations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoading ? <p>Loading investigations...</p> : potentials.length === 0 ? <p>No potential class actions identified yet. Be the first to submit a report.</p> :
                                potentials.map(p => (
                                    <div key={p.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-900">{p.title}</h3>
                                            <Badge variant={p.status === 'emerging' ? 'destructive' : 'secondary'}>{p.status}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">{p.summary}</p>
                                        <div className="flex justify-between items-end">
                                            <div className="text-xs text-slate-500 space-y-1">
                                                <p><span className="font-semibold">Target:</span> {p.target_agency}</p>
                                                <p><span className="font-semibold">Affected:</span> {p.estimated_class_size} individuals</p>
                                            </div>
                                            <Link to={createPageUrl(`ClassActionInvestigation?id=${p.id}`)}>
                                                <Button size="sm">View Investigation</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <ViolationMap />
                    </div>
                    <div className="space-y-8">
                        {/* Submit Your Case */}
                        <Card className="border-0 shadow-lg bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-amber-600"/> Add Your Case to the Registry</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 mb-4 text-sm">Have your constitutional rights been violated? Document your encounter to help build a national movement for accountability.</p>
                                <Link to={createPageUrl("SubmitViolation")}>
                                    <Button className="w-full bg-amber-600 hover:bg-amber-700">Submit a Violation Report</Button>
                                </Link>
                            </CardContent>
                        </Card>
                        {/* Stats Card */}
                        <Card className="border-0 shadow-lg bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-slate-900">Registry Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold text-red-600">{stats.total}</p>
                                    <p className="text-sm text-slate-600">Total Violations Documented</p>
                                </div>
                                <div style={{ height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.by_type} layout="vertical" margin={{ top: 5, right: 10, left: 70, bottom: 5 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#dc2626" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
