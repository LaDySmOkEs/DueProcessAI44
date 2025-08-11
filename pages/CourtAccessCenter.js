import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileWarning, BookOpen, Landmark, MessageSquare, Scale, Shield } from "lucide-react";

export default function CourtAccessCenter() {

    const filingRejectionTools = [
        {
            title: "Writ of Mandamus Generator",
            description: "Generate a petition to compel a court clerk or government official to perform their legal duty, such as filing your documents.",
            icon: FileWarning,
            color: "text-red-600",
            link: "LegalDraftsman"
        },
        {
            title: "Affidavit of Filing Refusal",
            description: "Immediately create a sworn statement documenting an improper refusal to file, creating evidence for your petition.",
            icon: Landmark,
            color: "text-red-600",
            link: "LegalDraftsman"
        },
        {
            title: "Clerk Conduct Complaint Assistant",
            description: "Find the appropriate oversight body and get help structuring a formal complaint against a clerk for dereliction of duty.",
            icon: MessageSquare,
            color: "text-red-600",
            link: "JudicialAccountability"
        }
    ];

    const courtroomConditionTools = [
        {
            title: "Local Rules of Court Analyzer",
            description: "AI-powered search of your court's specific local rules to verify if a condition being imposed is lawful and published.",
            icon: BookOpen,
            color: "text-blue-600",
            link: "DigitalInvestigator"
        },
        {
            title: "Motion to Challenge Conditions",
            description: "Generate a formal motion objecting to unlawful courtroom conditions, citing public access rights and lack of authority.",
            icon: Shield,
            color: "text-blue-600",
            link: "LegalDraftsman"
        },
        {
            title: "Rights Assertion Scripts",
            description: "Get calm, legally-sound phrases to assert your rights in the moment when confronted with improper demands.",
            icon: MessageSquare,
            color: "text-blue-600",
            link: "KnowYourRights"
        }
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                            <Scale className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Procedural Justice & Court Access Center</h1>
                            <p className="text-slate-600 mt-1">Tools to combat obstruction and ensure your right to be heard.</p>
                        </div>
                    </div>
                    <Alert className="bg-slate-900 text-white border-slate-700">
                        <AlertTitle className="font-semibold flex items-center gap-2">The Clerk's Duty is Not a Choice</AlertTitle>
                        <AlertDescription>
                            Access to the courts is a fundamental right. Court clerks have a <span className="font-bold text-amber-400">ministerial duty</span> to file documents that conform to the rules; they cannot act as gatekeepers or substitute their judgment for a judge's. These tools are designed to help you enforce that duty.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Filing Rejection Toolkit */}
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                             <FileWarning className="w-6 h-6 text-red-600" />
                            Toolkit: Overcoming Improper Filing Rejections
                        </CardTitle>
                        <p className="text-slate-600 text-sm">Use these tools when a court clerk improperly refuses to accept your legal documents for filing.</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filingRejectionTools.map(tool => (
                            <Link to={createPageUrl(tool.link)} key={tool.title}>
                                <div className="p-4 border border-slate-200 rounded-lg h-full flex flex-col hover:shadow-md hover:border-red-300 transition-all">
                                    <tool.icon className={`w-8 h-8 mb-3 ${tool.color}`} />
                                    <h3 className="font-semibold text-slate-900 mb-2">{tool.title}</h3>
                                    <p className="text-sm text-slate-600 flex-grow">{tool.description}</p>
                                    <Button variant="link" className="p-0 mt-4 text-red-600">
                                        Use Tool &rarr;
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Courtroom Conditions Toolkit */}
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Landmark className="w-6 h-6 text-blue-600" />
                            Toolkit: Challenging Unlawful Courtroom Conditions
                        </CardTitle>
                        <p className="text-slate-600 text-sm">Use these tools to respond to arbitrary rules or conditions imposed on your access to the courtroom.</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courtroomConditionTools.map(tool => (
                             <Link to={createPageUrl(tool.link)} key={tool.title}>
                                <div className="p-4 border border-slate-200 rounded-lg h-full flex flex-col hover:shadow-md hover:border-blue-300 transition-all">
                                    <tool.icon className={`w-8 h-8 mb-3 ${tool.color}`} />
                                    <h3 className="font-semibold text-slate-900 mb-2">{tool.title}</h3>
                                    <p className="text-sm text-slate-600 flex-grow">{tool.description}</p>
                                    <Button variant="link" className="p-0 mt-4 text-blue-600">
                                        Use Tool &rarr;
                                    </Button>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
