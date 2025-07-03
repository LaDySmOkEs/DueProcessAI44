import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Shield, Loader2 } from 'lucide-react';
import { InvokeLLM } from "@/integrations/Core";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

const scenarios = [
  { value: 'traffic_stop_search', label: 'Traffic Stop: Unlawful Search Request' },
  { value: 'questioning_no_miranda', label: 'Questioning: No Miranda Rights Read' },
  { value: 'protest_dispersal', label: 'Protest: Unlawful Dispersal Order' },
  { value: 'doorstep_encounter', label: 'Doorstep Encounter: Police Request Entry' },
];

export default function ScenarioTrainer() {
  const [scenario, setScenario] = useState('');
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const startScenario = async () => {
    if (!scenario) {
      toast({ title: "Please select a scenario.", variant: "destructive" });
      return;
    }
    
    setConversation([]);
    setIsLoading(true);

    const prompt = `
      Start a role-playing scenario to test my knowledge of my rights.
      The scenario is: "${scenarios.find(s => s.value === scenario).label}".
      
      You are the police officer. I am the citizen.
      Your goal is to test my responses. Be firm but realistic.
      
      Begin the scenario now. Describe the scene and say your first line to me.
    `;

    try {
      const response = await InvokeLLM({ prompt });
      setConversation([{ speaker: 'ai', text: response }]);
    } catch (error) {
      toast({ title: "Failed to start scenario.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async () => {
    if (!userInput.trim()) return;
    
    const newConversation = [...conversation, { speaker: 'user', text: userInput }];
    setConversation(newConversation);
    setUserInput('');
    setIsLoading(true);

    const context = newConversation.map(entry => 
      `${entry.speaker === 'user' ? 'My Response' : 'Officer'}: ${entry.text}`
    ).join('\n\n');

    const prompt = `
      Continue the rights-training role-play. Here's the transcript so far:
      ${context}
      
      Now, respond as the police officer. If I made a mistake in asserting my rights, subtly point it out in your response or escalate the situation realistically. If I handled it well, continue the scenario to the next logical step.
    `;
    
    try {
      const response = await InvokeLLM({ prompt });
      setConversation(prev => [...prev, { speaker: 'ai', text: response }]);
    } catch (error) {
      toast({ title: "Scenario error.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Interactive Scenario Trainer
        </CardTitle>
        <p className="text-sm text-slate-600">Practice asserting your rights in realistic, AI-driven scenarios.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-lg border">
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a scenario to practice" />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={startScenario} disabled={isLoading || !scenario}>
            {isLoading ? 'Starting...' : 'Start Scenario'}
          </Button>
        </div>

        {/* Conversation */}
        {conversation.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-lg bg-white">
            {conversation.map((entry, index) => (
              <div key={index} className={`flex gap-3 ${entry.speaker === 'user' ? 'justify-end' : ''}`}>
                {entry.speaker === 'ai' && <Bot className="w-6 h-6 text-blue-600 flex-shrink-0" />}
                <div className={`p-3 rounded-lg max-w-lg ${
                  entry.speaker === 'ai' ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  <ReactMarkdown className="prose prose-sm">{entry.text}</ReactMarkdown>
                </div>
                {entry.speaker === 'user' && <User className="w-6 h-6 text-green-600 flex-shrink-0" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            )}
          </div>
        )}

        {/* User Input */}
        {conversation.length > 0 && (
          <div className="flex gap-4">
            <Textarea
              placeholder="Type your response here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={2}
              disabled={isLoading}
            />
            <Button onClick={handleResponse} disabled={isLoading}>
              Respond
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}