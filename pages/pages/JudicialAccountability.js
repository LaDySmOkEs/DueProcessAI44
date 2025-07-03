import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, Search, FileText, Scale } from 'lucide-react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function JudicialAccountability() {
    const tools = [
        {
            title: "Judge Profile Database",
            description: "Review judicial history, rulings, and potential conflicts of interest.",
            icon: Search,
            link: "JudgeDatabase"
        },
        {
            title: "File a Judicial Conduct Complaint",
            description: "A guided process for reporting judicial misconduct to the appropriate commission.",
            icon: FileText,
            link: "FileJudicialComplaint"
        },
        {
            title: "Recusal Motion Generator",
            description: "Generate a legal motion to request a judge be removed from a case due to bias.",
            icon: Scale,
            link: "RecusalMotionGenerator"
        }
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-slate-800 rounded-xl flex items-center justify-center">
                            <Gavel className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Judicial Accountability Center</h1>
                            <p className="text-slate-600 mt-1">Tools and resources to ensure fairness from the bench.</p>
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h2 className="font-semibold text-amber-900 mb-2">Ensuring an Impartial Judiciary</h2>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            A fair trial requires an unbiased judge. This center provides tools to research judicial records, report misconduct, and challenge potential bias in your case, upholding the principle of equal justice under law.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tools.map(tool => (
                        <Card key={tool.title} className="border-0 shadow-lg bg-white flex flex-col">
                            <CardHeader className="items-center text-center">
                                <div className="p-4 bg-slate-100 rounded-full mb-4">
                                    <tool.icon className="w-8 h-8 text-amber-700" />
                                </div>
                                <CardTitle>{tool.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow text-center">
                                <p className="text-sm text-slate-600">{tool.description}</p>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Link to={createPageUrl(tool.link)}>
                                    <Button variant="outline" className="w-full">
                                        Access Tool
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}