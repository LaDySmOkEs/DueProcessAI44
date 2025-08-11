
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Shield,
  BookOpen,
  FileText,
  BarChart3,
  AlertTriangle,
  Gavel,
  Users,
  Phone,
  ScanText,
  Scale,
  BrainCircuit,
  FileSignature,
  Mic,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Home,
  Plus,
  Eye,
  Target,
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UsageTracker from "./components/subscription/UsageTracker";

// REBUILT navigation structure around the three core pillars
const navigationSections = {
  main: {
    title: "Main",
    icon: Home,
    color: "text-amber-600",
    expanded: true,
    items: [
      {
        title: "Dashboard",
        url: createPageUrl("Dashboard"),
        icon: BarChart3,
        color: "text-amber-600",
        description: "Your case overview and activity"
      },
      {
        title: "Report New Incident",
        url: createPageUrl("ReportIncident"),
        icon: Plus,
        color: "text-red-600",
        description: "Document a police interaction",
        highlight: true
      },
    ]
  },
  
  defenseKit: {
    title: "Civil Liberties Defense Kit",
    icon: Shield,
    color: "text-blue-600",
    expanded: true,
    items: [
 
