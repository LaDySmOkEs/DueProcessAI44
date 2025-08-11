import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/integrations/Core";
import { Search, Loader2, FileText, Building, User, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const searchSchema = {
    type: "object",
    properties: {
        search_summary: {
            type: "string",
            description: "A comprehensive summary of findings"
        },
        court_records: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    case_name: { type: "string" },
                    court: { type: "string" },
                    case_number: { type: "string" },
                    date: { type: "string" },
                    status: { type: "string" },
                    summary: { type: "string" }
                }
            }
        },
        property_records: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    address: { type: "string" },
                    owner: { type: "string" },
                    value: { type: "string" },
                    purchase_date: { type: "string" },
                    details: { type: "string" }
                }
            }
        },
        business_records: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    business_name: { type: "string" },
                    registration_state: { type: "string" },
                    status: { type: "string" },
                    officers: { type: "array", items: { type: "string" } },
                    address: { type: "string" }
                }
            }
        },
        professional_licenses: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    license_type: { type: "string" },
                    license_number: { type: "string" },
                    status: { type: "string" },
                    expiration: { type: "string" },
 
