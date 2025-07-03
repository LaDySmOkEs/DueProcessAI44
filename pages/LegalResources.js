import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Gavel, Scale, BookOpen } from 'lucide-react';

const resources = [
  {
    title: "Legal Document Templates",
    description: "Access a library of pre-formatted legal documents, from motions to affidavits.",
    icon: FileText,
    link: "/templates"
  },
  {
    title: "Guide to Civil Procedure",
    description: "Understand the step-by-step process of a civil lawsuit.",
    icon: Gavel,
    link: "/guides/civil-procedure"
  },
  {
    title: "Understanding Evidence Rules",
    description: "Learn what constitutes admissible evidence and how to challenge it.",
    icon: Scale,
    link: "/guides/evidence-rules"
  },
  {
    title: "Glossary of Legal Terms",
    description: "Decode complex legal jargon with simple explanations.",
    icon: BookOpen,
    link: "/guides/glossary"
  }
];

export default function LegalResources() {
  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Legal Resources</h1>
              <p className="text-slate-600 mt-1">Your library of guides, templates, and legal knowledge.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <resource.icon className="w-6 h-6 text-green-700" />
                  <CardTitle>{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{resource.description}</p>
                <Button variant="outline" className="w-full">
                  View Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}