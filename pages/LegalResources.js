import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, FileText, Book, Shield } from "lucide-react";

const resources = [
  { title: "Motion to Suppress Evidence", description: "Template for arguing that evidence was obtained illegally (4th Amendment).", icon: FileText, category: "Motions" },
  { title: "Motion to Dismiss for Lack of Speedy Trial", description: "Template for cases with excessive delays (6th Amendment).", icon: FileText, category: "Motions" },
  { title: "Guide to Civil Procedure", description: "An overview of the rules governing civil lawsuits.", icon: Book, category: "Guides" },
  { title: "Understanding Hearsay", description: "A guide to the rules of evidence regarding out-of-court statements.", icon: Book, category: "Guides" },
  { title: "Qualified Immunity Explained", description: "Learn about the legal doctrine that shields government officials from liability.", icon: Shield, category: "Concepts" }
];

export default function LegalResources() {
    return (
        <div className="p-6 space-y-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                            <Gavel className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Due Process Motions & Resources</h1>
                            <p className="text-slate-600 mt-1">A library of legal templates, guides, and educational materials.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Motion Templates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.filter(r => r.category === 'Motions').map(resource => (
                                <Card key={resource.title} className="border-0 shadow-lg bg-white">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <resource.icon className="w-8 h-8 text-amber-600" />
                                        <CardTitle>{resource.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-600">{resource.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                     <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Legal Guides & Concepts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.filter(r => r.category !== 'Motions').map(resource => (
                                <Card key={resource.title} className="border-0 shadow-lg bg-white">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <resource.icon className="w-8 h-8 text-blue-600" />
                                        <CardTitle>{resource.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-600">{resource.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
