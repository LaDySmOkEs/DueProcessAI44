import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star } from "lucide-react";

const categoryLabels = {
  traffic_stops: "Traffic Stops",
  home_searches: "Home Searches", 
  arrests: "Arrests",
  questioning: "Questioning",
  protests: "Protests", 
  general_rights: "General Rights"
};

const priorityColors = {
  essential: "bg-red-100 text-red-800 border-red-200",
  important: "bg-orange-100 text-orange-800 border-orange-200",
  helpful: "bg-blue-100 text-blue-800 border-blue-200"
};

export default function RightsModuleCard({ module, onClick, isSelected }) {
  return (
    <Card 
      className={`border-0 shadow-sm cursor-pointer transition-all ${
        isSelected ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-slate-900 pr-4">{module.title}</h3>
          <Badge variant="secondary" className={`${priorityColors[module.priority_level]} border`}>
            {module.priority_level}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{categoryLabels[module.category]}</Badge>
          {module.priority_level === 'essential' && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <Star className="w-3 h-3 fill-current" />
              <span>Essential Knowledge</span>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">
          {module.content.split('\n')[0]}
        </p>
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
            <BookOpen className="w-4 h-4" />
            <span>Read Module</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}