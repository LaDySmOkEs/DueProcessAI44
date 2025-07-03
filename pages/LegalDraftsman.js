import React, { useState } from 'react';
import DocumentTemplateSelector from '../components/legaldraftsman/DocumentTemplateSelector';
import DocumentGenerator from '../components/legal/DocumentGenerator';
import { FileSignature, Bot, FileText } from 'lucide-react';
import SubscriptionGate from '../components/subscription/SubscriptionGate';

export default function LegalDraftsman() {
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <FileSignature className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">AI Legal Draftsman</h1>
                    <p className="text-slate-600 mt-1">Generate court-ready documents from intelligent templates.</p>
                </div>

                <SubscriptionGate feature="document_generation">
                    {!selectedTemplate ? (
                        <DocumentTemplateSelector onSelectTemplate={setSelectedTemplate} />
                    ) : (
                        <DocumentGenerator 
                            template={selectedTemplate} 
                            onBack={() => setSelectedTemplate(null)} 
                        />
                    )}
                </SubscriptionGate>
            </div>
        </div>
    );
}