
import React from 'react';

interface AIGeneratedUIProps {
  components: string[];
  onRemove: (index: number) => void;
}

const AIGeneratedUI = ({ components, onRemove }: AIGeneratedUIProps) => {
  if (components.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <div className="bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-400 text-sm font-semibold">AI Generated UI</h3>
          <span className="text-xs text-gray-400">{components.length} component(s)</span>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {components.map((component, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-xs z-10"
              >
                ×
              </button>
              <div className="bg-gray-900/50 border border-gray-600 rounded p-2">
                <div 
                  className="text-xs text-white"
                  dangerouslySetInnerHTML={{ __html: component }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIGeneratedUI;
