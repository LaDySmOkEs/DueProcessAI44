import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Bot, User, BrainCircuit } from 'lucide-react';
import { InvokeLLM } from "@/integrations/Core";
import { useToast } from "@/components/ui/use-toast";
import SubscriptionGate from '../components/subscription/SubscriptionGate';

const simulationTypes = [
  { value: 'cross_examination', label: 'Cross-Examination Practice' },
  { value: 'opening_statement', label: 'Opening Statement Coaching' },
  { value: 'closing_argument', label: 'Closing Argument Review' },
  { value: 'objection_practice', label: 'Objection Drills' }
];

export default function CourtroomSimulator() {
  const [simulationType, setSimulationType] = useState('cross_examination');
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const startSimulation = async () => {
    if (!simulationType) {
      toast({ title: "Select a simulation type first.", variant: "destructive" });
      return;
    }
    
    setIsSimulating(true);
    setConversation([]);
    
    const initialPrompt = `
      Start a courtroom simulation. I am a user preparing for a legal proceeding.
      My chosen scenario is: ${simulationTypes.find(s => s.value === simulationType).label}.
      
      Your role is to act as my counterpart.
      - If Cross-Examination: You are a hostile, intelligent witness. Answer my questions evasively but plausibly.
      - If Opening/Closing Statement: You are a seasoned trial judge. After I give my statement, provide sharp, constructive feedback on its clarity, persuasiveness, and legal soundness.
      - If Objection Drills: You are opposing counsel. I will state an evidentiary objection, and you will argue against it.
      
      Begin now by setting the scene and prompting me for my first action.
    `;
    
    try {
      const response = await InvokeLLM({ prompt: initialPrompt });
      setConversation([{ speaker: 'ai', text: response }]);
    } catch (error) {
      console.error("Error starting simulation:", error);
      toast({ title: "Failed to start simulation.", variant: "destructive" });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleUserResponse = async () => {
    if (!userInput.trim()) return;

    const newConversation = [...conversation, { speaker: 'user', text: userInput }];
    setConversation(newConversation);
    setUserInput('');
    setIsSimulating(true);

    const context = newConversation.map(entry => 
      `${entry.speaker === 'user' ? 'My Response' : 'Your Response'}: ${entry.text}`
    ).join('\n\n');

    const prompt = `
      Continue the courtroom simulation. Here is the conversation so far:
      ${context}
      
      Your role remains the same. Provide your next response based on my last statement. Be challenging and realistic.
    `;
    
    try {
      const response = await InvokeLLM({ prompt });
      setConversation(prev => [...prev, { speaker: 'ai', text: response }]);
    } catch (error) {
      console.error("Error continuing simulation:", error);
      toast({ title: "Simulation error.", variant: "destructive" });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Courtroom Simulator</h1>
            <p className="text-slate-600 mt-1">Hone your skills against an AI adversary.</p>
        </div>

        <SubscriptionGate feature="courtroom_simulator">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle>Simulation Setup</CardTitle>
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Select value={simulationType} onValueChange={setSimulationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select simulation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {simulationTypes.map(sim => (
                      <SelectItem key={sim.value} value={sim.value}>{sim.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={startSimulation} disabled={isSimulating}>
                  {isSimulating ? "Starting..." : "Start New Simulation"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
                {conversation.length === 0 && (
                  <div className="text-center text-slate-500 pt-16">
                    <BrainCircuit className="w-12 h-12 mx-auto mb-4" />
                    <p>Select a scenario and start the simulation to begin practicing.</p>
                  </div>
                )}
                {conversation.map((entry, index) => (
                  <div key={index} className={`flex items-start gap-3 ${entry.speaker === 'user' ? 'justify-end' : ''}`}>
                    {entry.speaker === 'ai' && <div className="p-2 bg-slate-200 rounded-full"><Bot className="w-5 h-5 text-slate-700"/></div>}
                    <div className={`p-3 rounded-lg max-w-lg ${entry.speaker === 'ai' ? 'bg-white' : 'bg-blue-500 text-white'}`}>
                      <p className="whitespace-pre-wrap">{entry.text}</p>
                    </div>
                    {entry.speaker === 'user' && <div className="p-2 bg-blue-200 rounded-full"><User className="w-5 h-5 text-blue-800"/></div>}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4">
                <Textarea 
                  placeholder="Type your response..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isSimulating || conversation.length === 0}
                />
                <Button onClick={handleUserResponse} disabled={isSimulating || !userInput.trim()}>
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </SubscriptionGate>
      </div>
    </div>
  );
}