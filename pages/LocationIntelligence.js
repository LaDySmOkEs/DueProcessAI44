import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvokeLLM } from "@/integrations/Core";
import { MapPin, Search, Loader2, AlertTriangle, Users, Building, Newspaper } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const locationSchema = {
    type: "object",
    properties: {
        location_summary: {
            type: "string",
            description: "A high-level summary of the location, including its general character and key features."
        },
        crime_statistics: {
            type: "object",
            properties: {
                overall_risk: { type: "string", enum: ["Low", "Moderate", "High", "Very High"] },
                crime_rate_comparison: { type: "string", description: "Comparison to national and state averages." },
                recent_trends: { type: "string", description: "Trends in crime over the last 12 months." },
                crime_types: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            type: { type: "string" },
                            count: { type: "integer" },
                            trend: { type: "string", enum: ["increasing", "decreasing", "stable"] }
                        }
                    }
                }
            }
        },
        demographics: {
            type: "object",
            properties: {
                population: { type: "integer" },
                median_household_income: { type: "string" },
                poverty_rate: { type: "string" },
                ethnic_composition: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            group: { type: "string" },
                            percentage: { type: "number" }
                        }
                    }
                }
            }
        },
        local_agencies: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    type: { type: "string" },
                    address: { type: "string" },
                    phone: { type: "string" }
                }
            },
            description: "List of police departments, sheriff's offices, and courthouses in the area."
        },
 
