import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AnalyzedDocument, LegalCase, DocumentCollection } from "@/entities/all";
import { FolderOpen, FileText, Search, Tag, Calendar, Plus, Upload } from 'lucide-react';
import { format } from "date-fns";

export default function DocumentManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('searchTerm') || '',
    caseId: searchParams.get('caseId') || 'all',
    collectionId: searchParams.get('collectionId') || 'all',
    tags: searchParams.get('tags') || '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadDocuments();
    const newSearchParams = new URLSearchParams();
    if (filters.searchTerm) newSearchParams.set('searchTerm', filters.searchTerm);
    if (filters.caseId !== 'all') newSearchParams.set('caseId', filters.caseId);
    if (filters.collectionId !== 'all') newSearchParams.set('collectionId', filters.collectionId);
    if (filters.tags) newSearchParams.set('tags', filters.tags);
    setSearchParams(newSearchParams);
  }, [filters]);

  const loadInitialData = async () => {
    try {
      const [casesData, collectionsData] = await Promise.all([
        LegalCase.list(),
        DocumentCollection.list(),
      ]);
      setCases(casesData);
      setCollections(collectionsData);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      let query = {};
      if (filters.caseId !== 'all') query.case_id = filters.caseId;
      if (filters.collectionId !== 'all') query.collection_id = filters.collectionId;
      
      // These filters would require backend search capabilities or client-side filtering.
      // For now, we'll apply them client-side after fetching.
      let fetchedDocs = await AnalyzedDocument.filter(query, "-created_date");

      if (filters.searchTerm) {
          fetchedDocs = fetchedDocs.filter(d => 
              d.document_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
              d.analysis_summary?.toLowerCase().includes(filters.searchTerm.toLowerCase())
          );
      }
      if (filters.tags) {
          const searchTags = filters.tags.split(',').map(t => t.trim().toLowerCase());
          fetchedDocs = fetchedDocs.filter(d => 
              d.tags?.some(tag => searchTags.includes(tag.toLowerCase()))
          );
      }

      setDocuments(fetchedDocs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredCollections = filters.caseId === 'all' 
    ? collections 
    : collections.filter(c => c.case_id === filters.caseId);

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-slate-800 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Document Manager</h1>
              <p className="text-slate-600">Search, filter, and manage all your analyzed documents.</p>
            </div>
          </div>
          <Link to={createPageUrl("DocumentAnalyzer")}>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Analyze New Documents
            </Button>
          </Link>
        </div>

        {/* Filter Controls */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Keyword Search</Label>
              <Input id="search" placeholder="Search by name or content..." value={filters.searchTerm} onChange={e => handleFilterChange('searchTerm', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="case">Case</Label>
              <Select value={filters.caseId} onValueChange={value => handleFilterChange('caseId', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  {cases.map(c => <SelectItem key={c.id} value={c.id}>{c.case_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select value={filters.collectionId} onValueChange={value => handleFilterChange('collectionId', value)} disabled={filteredCollections.length === 0}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {filteredCollections.map(c => <SelectItem key={c.id} value={c.id}>{c.collection_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" placeholder="e.g., key_evidence, discovery" value={filters.tags} onChange={e => handleFilterChange('tags', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <Card className="text-center p-12">
              <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold">No Documents Found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or upload new documents.</p>
            </Card>
          ) : (
            documents.map(doc => (
              <Card key={doc.id} className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-3">
                    <h3 className="font-semibold text-blue-700 hover:underline">
                        {doc.document_name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{doc.analysis_summary}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {doc.tags?.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 space-y-1">
                      <div className="flex items-center gap-2"><FolderOpen className="w-4 h-4" /><span>{collections.find(c => c.id === doc.collection_id)?.collection_name || 'Uncategorized'}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{format(new Date(doc.created_date), 'MMM d, yyyy')}</span></div>
                  </div>
                  <div>
                    <Link to={createPageUrl(`DocumentDetails?id=${doc.id}`)}>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}