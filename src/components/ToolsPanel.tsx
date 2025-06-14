
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tool } from '@/services/toolSystem';
import { Wrench, Trash2 } from 'lucide-react';

interface ToolsPanelProps {
  tools: Tool[];
  onExecuteTool: (tool: Tool) => void;
  onDeleteTool: (toolId: string) => void;
}

const ToolsPanel = ({ tools, onExecuteTool, onDeleteTool }: ToolsPanelProps) => {
  if (tools.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-xs">
      <div className="bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-4 h-4 text-orange-400" />
          <h3 className="text-orange-400 text-sm font-semibold">Active Tools</h3>
          <span className="text-xs text-gray-400">({tools.length})</span>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tools.map((tool) => (
            <div key={tool.id} className="flex items-center gap-2">
              <Button
                onClick={() => onExecuteTool(tool)}
                variant="outline"
                size="sm"
                className="flex-1 text-xs text-white border-orange-500/30 hover:bg-orange-500/20"
              >
                {tool.name}
              </Button>
              <Button
                onClick={() => onDeleteTool(tool.id)}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;
