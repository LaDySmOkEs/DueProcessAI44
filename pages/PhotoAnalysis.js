
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added import for Input component
import { InvokeLLM, UploadFile } from "@/integrations/Core";
import { Camera, Search, Loader2, FileUp, Eye, TextCursor, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const photoSchema = {
    type: "object",
    properties: {
        overall_summary: {
            type: "string",
            description: "A detailed, narrative summary of everything visible in the photo."
        },
        objects_identified: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    object: { type: "string" },
                    description: { type: "string" },
                    potential_relevance: { type: "string" }
                }
            }
        },
        people_identified: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    description: { type: "string" },
                    actions: { type: "string" }
                }
            }
        },
        text_in_image: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Any text that is clearly legible in the image."
        },
        potential_evidence_points: {
            type: "array",
            items: {
                type: "string"
            },
            description: "A bulleted list of specific details that could serve as evidence."
        },
        inconsistencies_or_anomalies: {
            type: "array",
            items: {
                type: "string"
            },
            description: "A list of any unusual, inconsistent, or potentially manipulated aspects of the photo."
        },
        inferred_context: {
            type: "object",
            properties: {
                time_of_day: { type: "string" },
                lighting: { type: "string" },
                potential_location_type: { type: "string" }
            }
        }
 
