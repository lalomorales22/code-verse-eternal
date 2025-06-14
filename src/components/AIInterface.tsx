
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Code, Palette, Zap } from 'lucide-react';
import aiService, { AIGenerationResponse } from '@/services/aiService';

interface AIInterfaceProps {
  onObjectGenerated: (code: string, metadata: any) => void;
  onCodeModified: (code: string) => void;
  onUIUpdated: (code: string) => void;
}

export default function AIInterface({ 
  onObjectGenerated, 
  onCodeModified, 
  onUIUpdated 
}: AIInterfaceProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIGenerationResponse | null>(null);

  const handleGenerate = async (type: 'object' | 'code' | 'ui' | 'self-modify') => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      let response: AIGenerationResponse;
      
      switch (type) {
        case 'object':
          response = await aiService.generateObject(prompt);
          if (response.success && response.code) {
            onObjectGenerated(response.code, response.metadata);
          }
          break;
        case 'code':
          response = await aiService.modifyCode('', prompt);
          if (response.success && response.code) {
            onCodeModified(response.code);
          }
          break;
        case 'ui':
          response = await aiService.generateUI(prompt);
          if (response.success && response.code) {
            onUIUpdated(response.code);
          }
          break;
        case 'self-modify':
          response = await aiService.improveSelf();
          break;
        default:
          return;
      }
      
      setLastResponse(response);
      setPrompt('');
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 w-80">
      <Card className="bg-black/90 backdrop-blur-sm border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Control Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="generate" className="text-xs">
                <Code className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="ui" className="text-xs">
                <Palette className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="modify" className="text-xs">
                <Zap className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="self" className="text-xs">
                <Brain className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Generate Object</label>
                <Textarea
                  placeholder="Describe the 3D object you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
                <Button
                  onClick={() => handleGenerate('object')}
                  disabled={isGenerating}
                  className="w-full mt-2 bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  {isGenerating ? 'Generating...' : 'Create Object'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="ui" className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Generate UI</label>
                <Textarea
                  placeholder="Describe the UI component you want..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
                <Button
                  onClick={() => handleGenerate('ui')}
                  disabled={isGenerating}
                  className="w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {isGenerating ? 'Generating...' : 'Create UI'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="modify" className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Modify Code</label>
                <Textarea
                  placeholder="Describe how to modify existing code..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
                <Button
                  onClick={() => handleGenerate('code')}
                  disabled={isGenerating}
                  className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {isGenerating ? 'Modifying...' : 'Modify Code'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="self" className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Self-Improvement</label>
                <p className="text-xs text-gray-500 mb-2">
                  AI will analyze and improve its own capabilities
                </p>
                <Button
                  onClick={() => handleGenerate('self-modify')}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                >
                  {isGenerating ? 'Evolving...' : 'Improve Self'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {lastResponse && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Last AI Response:</div>
              <div className="text-sm text-green-400">
                {lastResponse.success ? 'Success' : 'Failed'}
              </div>
              {lastResponse.metadata && (
                <div className="text-xs text-gray-500 mt-1">
                  {JSON.stringify(lastResponse.metadata, null, 2)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
