
import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Declare THREE as global
declare global {
  interface Window {
    THREE: any;
  }
}

interface CanvasObject {
  id: string;
  type: string;
  position: [number, number, number];
  code: string;
  props: any;
  metadata?: any;
}

// Enhanced object executor for AI-generated code
const AIGeneratedObject = ({ object }: { object: CanvasObject }) => {
  try {
    if (object.code && object.metadata?.type === 'ai_generated_object') {
      console.log('Executing AI-generated object code:', object.code);
      
      // Make THREE available globally for the executed code
      window.THREE = THREE;
      
      // Create a safe execution environment with React and useFrame
      const executeCode = () => {
        try {
          // Create a function that returns the component
          const componentCode = `
            (function() {
              ${object.code}
              
              // Try to find and return the component function
              const functionMatch = \`${object.code}\`.match(/function\\s+([A-Za-z][A-Za-z0-9]*)/);
              if (functionMatch && functionMatch[1]) {
                const componentName = functionMatch[1];
                try {
                  return eval(componentName);
                } catch (e) {
                  console.error('Error evaluating component:', e);
                  return null;
                }
              }
              
              // Try to find arrow function component
              const arrowMatch = \`${object.code}\`.match(/const\\s+([A-Za-z][A-Za-z0-9]*)\\s*=\\s*\\(/);
              if (arrowMatch && arrowMatch[1]) {
                const componentName = arrowMatch[1];
                try {
                  return eval(componentName);
                } catch (e) {
                  console.error('Error evaluating arrow component:', e);
                  return null;
                }
              }
              
              return null;
            })()
          `;
          
          const Component = eval(componentCode);
          return Component;
        } catch (error) {
          console.error('Error executing AI code:', error);
          return null;
        }
      };
      
      const Component = executeCode();
      
      if (Component) {
        console.log('Successfully created AI component, rendering at position:', object.position);
        return (
          <group position={object.position}>
            <Component />
          </group>
        );
      } else {
        console.warn('Could not extract component from AI code, falling back...');
        return <ExecuteObjectCode object={object} />;
      }
    }
    return <ExecuteObjectCode object={object} />;
  } catch (error) {
    console.error('Error executing AI object:', error);
    return <ExecuteObjectCode object={object} />;
  }
};

// Dynamic code executor for basic objects
const ExecuteObjectCode = ({ object }: { object: CanvasObject }) => {
  try {
    switch (object.type) {
      case 'cube':
        return (
          <mesh position={object.position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={object.props.color || '#00ffff'} />
          </mesh>
        );
      case 'sphere':
        return (
          <mesh position={object.position}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={object.props.color || '#ff00ff'} />
          </mesh>
        );
      case 'text':
        return (
          <Text
            position={object.position}
            fontSize={0.5}
            color={object.props.color || '#ffffff'}
          >
            {object.props.text || 'AI Generated'}
          </Text>
        );
      default:
        // For AI generated objects without recognized type, try to render them
        if (object.metadata?.type === 'ai_generated_object') {
          return (
            <mesh position={object.position}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#ff0088" />
            </mesh>
          );
        }
        return null;
    }
  } catch (error) {
    console.error('Error executing object code:', error);
    return null;
  }
};

const QuickAddDialog = ({ onAddObject }: { onAddObject: (prompt: string) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onAddObject(prompt);
      setPrompt('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 text-black"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-sm border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Create Something</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Describe what you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button onClick={handleSubmit} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black">
            Create with AI
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FloatingControls = ({ onAddObject }: { onAddObject: (prompt: string) => void }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <QuickAddDialog onAddObject={onAddObject} />
    </div>
  );
};

const ObjectManager = ({ 
  objects, 
  selectedObject, 
  onSelectObject, 
  onDeleteObject 
}: {
  objects: CanvasObject[];
  selectedObject: string | null;
  onSelectObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
}) => {
  if (!selectedObject) return null;

  const object = objects.find(obj => obj.id === selectedObject);
  if (!object) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-cyan-400 font-semibold">Object: {object.type}</h3>
        <Button
          onClick={() => onDeleteObject(object.id)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-sm text-gray-300">
        <p>Position: {object.position.join(', ')}</p>
        <p>Type: {object.type}</p>
        {object.metadata && (
          <p>Source: {object.metadata.type || 'Manual'}</p>
        )}
      </div>
    </div>
  );
};

const InfiniteCanvas = forwardRef<any, { onQuickCreate?: (prompt: string) => void }>((props, ref) => {
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const sceneRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    addAIGeneratedObject: (code: string, metadata: any) => {
      console.log('Adding AI-generated object with code:', code);
      console.log('Metadata:', metadata);
      
      const newObject: CanvasObject = {
        id: `ai_obj_${Date.now()}`,
        type: 'ai_generated',
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        code,
        props: metadata || {},
        metadata: {
          ...metadata,
          type: 'ai_generated_object'
        }
      };
      
      setObjects(prev => {
        const newObjects = [...prev, newObject];
        console.log('Canvas objects updated. Total objects:', newObjects.length);
        console.log('New object added:', newObject);
        return newObjects;
      });
    },
    addObject: (object: any) => {
      const objWithMetadata = { ...object, metadata: object.metadata || {} };
      setObjects(prev => [...prev, objWithMetadata]);
    },
    getScene: () => sceneRef.current,
    getObjects: () => objects
  }));

  const addRandomObject = useCallback(() => {
    const types = ['cube', 'sphere', 'text'];
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff0080', '#00ff80'];
    
    const newObject: CanvasObject = {
      id: `obj_${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ],
      code: '',
      props: {
        color: colors[Math.floor(Math.random() * colors.length)],
        text: 'AI Generated Object'
      },
      metadata: { type: 'manual' }
    };

    setObjects(prev => [...prev, newObject]);
    console.log('Added new object:', newObject);
  }, []);

  const handleQuickCreate = useCallback((prompt: string) => {
    if (props.onQuickCreate) {
      props.onQuickCreate(prompt);
    }
  }, [props.onQuickCreate]);

  const deleteObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    setSelectedObject(null);
  }, []);

  const selectObject = useCallback((id: string) => {
    setSelectedObject(id);
  }, []);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Three.js Canvas */}
      <Canvas
        ref={sceneRef}
        camera={{ position: [10, 10, 10], fov: 75 }}
        style={{ background: 'radial-gradient(circle, #1a0033 0%, #000000 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

        {/* Grid */}
        <Grid
          position={[0, -5, 0]}
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#333"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#666"
          fadeDistance={50}
          fadeStrength={1}
        />

        {/* Render all objects with enhanced AI support */}
        {objects.map((object) => {
          console.log('Rendering object:', object.id, object.type, object.metadata?.type);
          return (
            <group key={object.id}>
              {object.code && object.metadata?.type === 'ai_generated_object' ? (
                <AIGeneratedObject object={object} />
              ) : (
                <ExecuteObjectCode object={object} />
              )}
            </group>
          );
        })}

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.8}
          rotateSpeed={0.4}
        />
      </Canvas>

      {/* UI Overlay */}
      <FloatingControls onAddObject={handleQuickCreate} />
      
      <ObjectManager
        objects={objects}
        selectedObject={selectedObject}
        onSelectObject={selectObject}
        onDeleteObject={deleteObject}
      />

      {/* Enhanced Header */}
      <div className="fixed top-4 left-4 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
          AI Canvas Pro
        </h1>
        <p className="text-sm text-gray-400">
          Objects: {objects.length} | AI-Generated: {objects.filter(obj => obj.metadata?.type === 'ai_generated_object').length}
        </p>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-gray-400">
        <p>Click + to add objects • Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
});

InfiniteCanvas.displayName = 'InfiniteCanvas';

export default InfiniteCanvas;
